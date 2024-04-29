import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { IPlaylist } from '../../../api';
import { CordService, DialogService } from '../../../services';

@Component({
  selector: 'cord-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Output() togglePlaylist = new EventEmitter();

  activePlaylist$ = this.cordService.activePlaylist$;
  me$ = this.cordService.me$;

  getActiveSong(playlist: IPlaylist | null | undefined) {
    if (!playlist) {
      return;
    }

    return playlist.songs.find(x => x.id === playlist.nextSongId);
  }

  constructor(private dialogService: DialogService, private cordService: CordService) {}

  openPlaylist() {
    this.dialogService.ensureAuthenticated();
    this.togglePlaylist.emit();
  }
}
