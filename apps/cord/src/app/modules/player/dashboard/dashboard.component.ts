import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { combineLatest, distinctUntilChanged, filter, map, Observable, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DomSanitizer } from '@angular/platform-browser';
import { YoutubeService, NotificationService, CordService } from '../../../services';
import { ICurrentSong, Permission, User } from '../../../api';
import { SwUpdate } from '@angular/service-worker';
import { DateTime, Duration } from 'luxon';
import { SettingsService } from '../../../services/settings.service';
import { Song } from '../../../api/playlists/song';
import { RendererComponent } from './renderer/renderer.component';

@UntilDestroy()
@Component({
  selector: 'cord-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(YouTubePlayer) player!: YouTubePlayer;
  @ViewChild(RendererComponent, { static: true }) renderer!: RendererComponent;

  updateAvailable$ = this.swUpdate.versionUpdates.pipe(filter(x => x.type === 'VERSION_READY'));

  canEnqueue$ = this.cordService.hasPermissions(Permission.CanEnqueue);
  currentSong$ = this.cordService.currentSong$.pipe(
    map(x => ({ ...x, song: x?.song as Song })),
    distinctUntilChanged((prev, next) => prev?.endTime === next?.endTime)
  );
  settings$ = this.settingsService.settings$;
  inQueue$ = this.cordService.queue$.pipe(map(x => !!x?.find(y => y.id === this.cordService.id)));
  // wooters$ = this.cordService.currentSong$.pipe(map(x => x?.upvotes));

  expNotif?: string;
  levelNotif?: string;

  constructor(
    private sanitizer: DomSanitizer,
    private cordService: CordService,
    private changeDetectorRef: ChangeDetectorRef,
    private ytService: YoutubeService,
    private settingsService: SettingsService,
    private swUpdate: SwUpdate,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.notifService.valueNotif$.pipe(untilDestroyed(this)).subscribe(notif => {
      switch (notif.type) {
        case 'exp':
          this.expNotif = notif.value;

          setTimeout(() => {
            this.expNotif = undefined;
            this.changeDetectorRef.markForCheck();
          }, 2000);
          break;

        case 'level':
          this.levelNotif = notif.value;

          setTimeout(() => {
            this.levelNotif = undefined;
            this.changeDetectorRef.markForCheck();
          }, 2000);
          break;
      }
    });
  }

  async update() {
    if (await this.swUpdate.activateUpdate()) {
      document.location.reload();
    }
  }

  enqueue() {
    if (this.cordService.me) {
      this.cordService.room?.addToQueue();
    }
  }

  dequeue() {
    if (this.cordService.me) {
      this.cordService.room?.removeFromQueue();
    }
  }

  ngAfterViewInit() {
    this.cordService.me$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(x => this.renderer.setMe(x.id));

    combineLatest([this.cordService.currentSong$, this.cordService.users$])
      .pipe(untilDestroyed(this))
      .subscribe(([cur, users]) => {
        this.selectDJ(cur, users);

        this.changeDetectorRef.markForCheck();
      });

    // this.ytService.volume$.pipe(untilDestroyed(this)).subscribe(x => this.player.setVolume(x));

    combineLatest([this.currentSong$ as Observable<ICurrentSong>, this.settings$])
      .pipe(untilDestroyed(this))
      .subscribe(([{ song, endTime }, { videoVisible }]) => {
        if (!song?.youtubeId || !videoVisible) {
          this.renderer.playSong(null);
          return;
        }

        const start = DateTime.fromISO(endTime!).minus(Duration.fromISOTime(song.duration!));
        const diff = DateTime.utc().diff(start).milliseconds / 1000;

        console.log('called play');
        this.renderer.playSong(song.youtubeId);
        // this.player.videoId = song.youtubeId;
        // this.player.setVolume(this.ytService.volume);
        // this.player.seekTo(diff, true);
      });

    this.cordService.onlineUsers$
      .pipe(
        filter(x => !!x),
        take(1)
      )
      .subscribe(x => {
        for (const ou of x!) {
          this.renderer.createPlayer(ou.user?.id ?? ou.id, 'HVGirl', ou.position.x, ou.position.y);
        }
      });

    this.cordService.onlineUserCreated$.subscribe(onlineUser => {
      this.renderer.createPlayer(
        onlineUser.user?.id ?? onlineUser.id,
        'HVGirl',
        onlineUser.position.x,
        onlineUser.position.y
      );
    });

    this.cordService.onlineUserUpdated$.subscribe(onlineUser => {
      this.renderer.movePlayer(onlineUser.id, onlineUser.position.x, onlineUser.position.y);
    });

    this.cordService.onlineUserDeleted$.subscribe(onlineUserId => {
      this.renderer.deletePlayer(onlineUserId);
    });
  }

  private selectDJ(currentSong: ICurrentSong | undefined, users: User[]) {
    if (!currentSong?.userId) {
      this.renderer.promoteDJ(null);
      return;
    }

    const user = users.find(x => x.id === currentSong?.userId);
    if (!user) {
      this.renderer.promoteDJ(null);
      return;
    }

    this.renderer.promoteDJ(user.id);
  }
}
