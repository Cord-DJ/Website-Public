import { ApplicationRef, Component, HostListener, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { LanguageService } from './services/language.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concat, first, interval } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'cord-root',
  template: '<router-outlet></router-outlet>'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @HostListener('contextmenu', ['$event'])
  _handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  constructor(
    private appRef: ApplicationRef,
    private oauthService: OAuthService,
    private swUpdate: SwUpdate,
    langService: LanguageService
  ) {
    langService; // Need this to enable translations

    oauthService.configure({
      issuer: environment.issuer,
      clientId: 'cord-dj-client',
      // clientId: 'Orion_Swagger',
      scope: 'openid email',
      responseType: 'code',
      redirectUri: window.location.origin + '/rooms',
      silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
      useSilentRefresh: true,
      requestAccessToken: true,
      disablePKCE: true
    });

    this.printStop();
  }

  async ngOnInit() {
    this.appRef.isStable.subscribe(x => console.log('is stable', x));

    concat(this.appRef.isStable.pipe(first(x => x)), interval(60000))
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        console.log('is swupdate enabled', this.swUpdate.isEnabled);
        console.log('checking for update');

        if (this.swUpdate.isEnabled) {
          const update = await this.swUpdate.checkForUpdate();
          console.log(`update ${update ? 'available' : 'everything is up to date'}`);
        }
      });

    await this.oauthService.loadDiscoveryDocument();
  }

  private printStop() {
    if (!environment.production) {
      return;
    }

    const font = 'font-family:helvetica; font-size:20px; ';
    const large = 'font-size:50px; font-weight:bold; color:red; -webkit-text-stroke:1px black;';

    console.log('%cStop!', font + large);
    console.log(
      '%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable any feature or "hack" someone\'s account, it is a scam and will give them access to your account.',
      font
    );
  }
}
