import { ApplicationRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { YoutubeService, LocalStorage, CordService } from '../../../../services';
import { BehaviorSubject, combineLatest, distinctUntilChanged, first, interval, map } from 'rxjs';
import { DateTime, Duration } from 'luxon';
import { FormControl } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'cord-current-song',
  templateUrl: './current-song.component.html',
  styleUrls: ['./current-song.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentSongComponent implements OnInit {
  @LocalStorage private lastVolume = 100;
  private finishTime: DateTime | null = null;

  volume = new FormControl();
  volume$ = this.ytService.volume$;
  currentName$ = this.cordService.currentSong$.pipe(map(x => x?.song.name ?? 'Nothing is Playing Right Now'));
  remainingTime$ = new BehaviorSubject<string>('--:--');

  currentDJ$ = combineLatest([this.cordService.currentSong$, this.cordService.users$]).pipe(
    map(([currentSong, users]) => {
      return currentSong ? users.find(x => x.id === currentSong.userId)?.name : 'N/A';
    })
  );

  constructor(private cordService: CordService, private ytService: YoutubeService, private appRef: ApplicationRef) {}

  ngOnInit() {
    this.appRef.isStable.pipe(first(x => x)).subscribe(() => {
      interval(1000)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          const remaining = !this.finishTime ? Duration.fromMillis(0) : this.finishTime.diff(DateTime.utc());
          if (remaining.toMillis() > 0) {
            this.remainingTime$.next(remaining.toFormat(remaining.hours > 1 ? 'HH:mm:ss' : 'mm:ss'));
          } else {
            this.remainingTime$.next('--:--');
          }

          this.appRef.tick();
        });
    });

    this.cordService.currentSong$.pipe(untilDestroyed(this)).subscribe(curSong => {
      this.finishTime = curSong?.song ? DateTime.fromISO(curSong.endTime) : null;
    });

    this.ytService.volume$
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe(volume => this.volume.setValue(volume));
    this.volume.valueChanges.pipe(distinctUntilChanged()).subscribe(volume => this.ytService.setVolume(volume));
  }

  toggleVolume() {
    if (this.ytService.volume > 0) {
      this.lastVolume = this.ytService.volume;
      this.ytService.setVolume(0);
    } else {
      this.ytService.setVolume(this.lastVolume);
    }
  }

  getVolumeIcon(volume: number) {
    if (volume === 0) {
      return 'volume-off';
    } else if (volume <= 30) {
      return 'volume-low';
    } else if (volume <= 60) {
      return 'volume-medium';
    } else {
      return 'volume-high';
    }
  }
}
