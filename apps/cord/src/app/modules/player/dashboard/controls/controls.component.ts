import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IPlaylist, Permission, Vote } from '../../../../api';
import { combineLatestWith, debounceTime, map } from 'rxjs';
import { CordService } from '../../../../services';

@UntilDestroy()
@Component({
  selector: 'cord-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent {
  private _upvoted = false;
  autoWoot = false;
  currentSong$ = this.cordService.currentSong$;
  playlists$ = this.cordService.playlists$;

  totalUpvotes$ = this.currentSong$.pipe(map(x => x?.upvotes.length));
  totalSteals$ = this.currentSong$.pipe(map(x => x?.steals.length));
  totalDownvotes$ = this.currentSong$.pipe(map(x => x?.downvotes.length));

  upvoted$ = this.currentSong$.pipe(map(x => x?.upvotes.find(y => y === this.cordService.id)));
  stealed$ = this.currentSong$.pipe(map(x => x?.steals.find(y => y === this.cordService.id)));
  downvoted$ = this.currentSong$.pipe(map(x => x?.downvotes.find(y => y === this.cordService.id)));

  isDJ$ = this.currentSong$.pipe(map(x => x?.userId === this.cordService.id));
  canControl$ = this.cordService.hasPermissions(Permission.ForceSkip);

  constructor(private cordService: CordService) {
    this.upvoted$
      .pipe(combineLatestWith(this.currentSong$), debounceTime(500), untilDestroyed(this))
      .subscribe(([upvoted, currentSong]) => {
        this._upvoted = !!upvoted;

        if (!upvoted && this.autoWoot && currentSong && this.cordService.me.id !== currentSong.userId) {
          this.cordService.room?.vote(Vote.Upvote);
        }
      });
  }

  toggleAutoWoot() {
    if (!this.autoWoot && !this._upvoted) {
      this.upvote();
    }

    this.autoWoot = !this.autoWoot;
  }

  steal(playlist: IPlaylist) {
    this.cordService.room?.steal(playlist);
  }

  upvote() {
    this.cordService.room?.vote(Vote.Upvote);
  }

  downvote() {
    this.autoWoot = false;
    this.cordService.room?.vote(Vote.Downvote);
  }

  skip() {
    this.cordService.room?.skip();
  }
}
