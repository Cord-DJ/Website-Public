import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, distinctUntilChanged, filter, first, lastValueFrom } from 'rxjs';
import { CordService, MenuService, SignalrService, AuthService, NavigationService } from '../../services';
import { OAuthService } from 'angular-oauth2-oidc';

@UntilDestroy()
@Component({
  selector: 'cord-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  openedPlaylist = false;
  activePage$ = this.menuService.activePage$;
  state$ = this.sigService.state$;
  isSearchOpened$ = this.navService.isSearchOpened$;
  showVerification$ = new BehaviorSubject(false);
  verificationSent = false; // TODO: implement click once button

  constructor(
    meta: Meta,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private sigService: SignalrService,
    private menuService: MenuService,
    private cordService: CordService,
    private authService: AuthService,
    private appRef: ApplicationRef,
    private oauth: OAuthService,
    private navService: NavigationService
  ) {
    cordService.room$.pipe(untilDestroyed(this)).subscribe(room => {
      if (room?.name) {
        title.setTitle(`Cord.DJ | ${room.name}`);

        meta.updateTag({ name: 'title', content: room.name });
        meta.updateTag({ name: 'og:title', content: room.name });
        meta.updateTag({ name: 'twitter:title', content: room.name });
      }

      if (room?.description) {
        meta.updateTag({ name: 'description', content: room.description });
        meta.updateTag({ name: 'og:description', content: room.description });
        meta.updateTag({ name: 'twitter:description', content: room.description });
      }

      if (room?.banner) {
        meta.updateTag({ name: 'image', content: room.banner });
        meta.updateTag({ name: 'og:image', content: room.banner });
        meta.updateTag({ name: 'twitter:image', content: room.banner });
      }

      meta.updateTag({ name: 'url', content: router.url });
      meta.updateTag({ name: 'og:url', content: router.url });
      meta.updateTag({ name: 'twitter:url', content: router.url });
    });
  }

  async ngOnInit() {
    this.appRef.isStable.pipe(first(x => x)).subscribe(async () => {
      try {
        if (!this.oauth.hasValidAccessToken()) {
          await this.oauth.silentRefresh();
        }
      } catch {
        // Ignore
      }

      if (this.oauth.hasValidAccessToken()) {
        this.authService.getVerified().then(x => this.showVerification$.next(x == 0));
        setTimeout(() => this.oauth.setupAutomaticSilentRefresh(), 60000);
      }
    });
  }

  ngAfterViewInit() {
    this.sigService.state$
      .pipe(
        untilDestroyed(this),
        filter(x => x === SignalrService.Disconnected)
      )
      .subscribe(() => {
        this.cordService.reconnect(this.route.snapshot.params['id']);
      });

    // This is called only when user selects new room in the left navigator
    let isFirstOpen = true;
    this.route.params.pipe(untilDestroyed(this), distinctUntilChanged()).subscribe(async a => {
      this.navService.setRoom(a['id']);

      await lastValueFrom(this.sigService.state$.pipe(first(x => x === SignalrService.Ready)));

      // don't call enterRoom on first open because it will be called twice
      if (!isFirstOpen) {
        await this.cordService.enterRoom(this.route.snapshot.params['id']);
      }

      isFirstOpen = false;
    });
  }

  createEmailVerification() {
    this.verificationSent = true;
    return this.authService.createEmailVerification();
  }

  async ngOnDestroy() {
    await this.sigService.disconnect();
    this.cordService.reset();
    this.title.setTitle('Cord.DJ');
  }
}
