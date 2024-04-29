import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { IPlaylist, ISong } from '../../../api';
import { CordService, YoutubeService } from '../../../services';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { DateTime } from 'luxon';
import { Dialog } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'cord-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistDialogComponent implements OnInit {
  @Output() hidePlaylist = new EventEmitter();
  pressedAlt = false;

  selectedPlaylist: IPlaylist | null = null;
  activePlaylist$ = this.cordService.activePlaylist$;
  playlists$ = this.cordService.playlists$;
  selectedPlaylist$ = new BehaviorSubject<IPlaylist | null>(null);

  search = new UntypedFormControl();
  results$ = new Subject<string[]>();

  @HostListener('window:keydown.alt') handleKeyPress() {
    this.pressedAlt = true;
  }

  @HostListener('window:keyup.alt') handleKeyRelease() {
    this.pressedAlt = false;
  }

  constructor(private ytService: YoutubeService, private cordService: CordService, public dialog: Dialog) {}

  ngOnInit() {
    this.cordService.playlists$
      .pipe(
        untilDestroyed(this),
        filter(x => !!x?.length)
      )
      .subscribe(playlists => {
        if (playlists) {
          if (!this.selectedPlaylist) {
            this.selectedPlaylist = this.cordService.me.activePlaylist as IPlaylist;
          }

          const pl = playlists.find(x => x.id === this.selectedPlaylist?.id);
          this.showPlaylist(pl ?? playlists[0]);
        }
      });

    this.search.valueChanges
      .pipe(
        debounceTime(100),
        filter(x => x?.length >= 3),
        distinctUntilChanged()
      )
      .subscribe(async x => {
        this.results$.next(await this.ytService.suggest(x));
        await this.showResults();
      });
  }

  async showResults() {
    if (!this.search.value) {
      return;
    }

    const videos = await this.ytService.search(this.search.value);
    this.selectedPlaylist$.next({
      name: 'Search Results',
      songs: (videos as any).map((x: any) => ({
        youtubeId: x.youtubeId,
        name: x.name,
        author: x.author,
        duration: x.duration ? DateTime.fromFormat(x.duration, 'HH:mm:ss').toFormat('mm:ss') : 'N/A',
        upvotes: null,
        downvotes: null,
        steals: null
      }))
    } as any as IPlaylist);
  }

  createPlaylist() {
    const name = prompt('Enter playlist name');
    if (name) {
      this.cordService.me?.createPlaylist(name);
    }
  }

  async moveOrAdd(data: any, playlist: IPlaylist) {
    const isCopyOrMove = !!data.id;

    await playlist.addSong({ youtubeId: data.youtubeId } as ISong);
    if (!isCopyOrMove) {
      return;
    }

    if (!this.pressedAlt) {
      await this.selectedPlaylist?.deleteSong(data);
    }
  }

  async reorder(event: any) {
    const data = event.item.data;

    // Ignore youtube list
    if (!data.id) {
      return;
    }

    if (event.previousIndex != event.currentIndex) {
      await this.selectedPlaylist?.reorderSongs(data, event.currentIndex);
    }
  }

  importPlaylist() {
    this.dialog.open(ImportDialogComponent, {
      width: '40%',
      height: '60%'
    });
  }

  showPlaylist(playlist: IPlaylist) {
    this.selectedPlaylist = playlist;
    this.selectedPlaylist$.next({
      ...playlist,
      songs: playlist.songs.map(x => ({
        ...x,
        duration: x.duration ? DateTime.fromFormat(x.duration, 'HH:mm:ss').toFormat('mm:ss') : 'N/A', // TODO: check why is there null, cuz it's live video
        upvotes: 0,
        downvotes: 0,
        steals: 0
      }))
    });
  }

  selectNextSong(song: ISong) {
    this.selectedPlaylist?.setNextSong(song);
  }

  async deleteSong(song: ISong) {
    // TODO: show toast??
    await this.selectedPlaylist?.deleteSong(song);
  }

  editPlaylistName() {
    const name = prompt('Enter new playlist name');
    if (name) {
      this.selectedPlaylist?.setName(name);
    }
  }

  deletePlaylist() {
    if (confirm('Are you sure you want to delete this playlist?')) {
      this.selectedPlaylist?.delete();
    }
  }

  activatePlaylist() {
    this.selectedPlaylist?.setActive();
  }
}
