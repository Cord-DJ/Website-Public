import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { CordService } from '../../../../services';
import { IPlaylist, ISong, ISongPlayed } from '../../../../api';

@UntilDestroy()
@Component({
  selector: 'cord-song-history',
  templateUrl: './song-history.component.html',
  styleUrls: ['./song-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [style({ height: 0 }), animate('.2s ease-out', style({ height: '60vh' }))]),
      transition(':leave', [style({ height: '60vh' }), animate('.2s ease-in', style({ height: 0 }))])
    ])
  ]
})
export class SongHistoryComponent {
  showHistory = false;
  playlists$ = this.cordService.playlists$;
  songHistory$ = this.cordService.songHistory$.pipe(map(x => x?.sort((a, b) => b.id.localeCompare(a.id))));

  onClick() {
    this.showHistory = !this.showHistory;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showHistory = false;
    }
  }

  constructor(private cordService: CordService, private elementRef: ElementRef) {}

  createdTime(songPlayed: ISongPlayed) {
    return songPlayed.createdAt.toRelative();
  }

  async addToPlaylist(playlist: IPlaylist, song: ISong) {
    await playlist.addSong(song);
  }
}
