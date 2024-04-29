import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { ID } from '../types';
import { IPlaylist } from './iplaylist';
import { ISong } from './isong';
import { getTimeFromId } from '../snowflake';
import { Type } from 'class-transformer';
import { Song } from './song';

export class Playlist implements IPlaylist {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  name!: string;
  isProcessing!: boolean;
  nextSongId?: ID;

  @Type(() => Song)
  songs!: readonly ISong[];

  private get endpoint() {
    return `${environment.apiEndpoint}/playlists`;
  }

  async reorderSongs(song: ISong, position: number): Promise<void> {
    await lastValueFrom(
      window.http.patch(`${this.endpoint}/${this.id}/songs`, {
        id: song.id,
        position
      })
    );
  }

  async setActive() {
    await lastValueFrom(window.http.post(`${this.endpoint}/${this.id}/active`, null));
  }

  async addSong(song: ISong): Promise<void> {
    await lastValueFrom(
      window.http.put(`${this.endpoint}/${this.id}/songs`, {
        youtubeId: song.youtubeId
      })
    );
  }

  async deleteSong(song: ISong): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/${this.id}/songs/${song.id}`));
  }

  async setName(name: string): Promise<void> {
    await lastValueFrom(
      window.http.patch(`${this.endpoint}/${this.id}`, {
        name
      })
    );
  }

  async setNextSong(song: ISong): Promise<void> {
    await lastValueFrom(window.http.post(`${this.endpoint}/${this.id}/songs/${song.id}/next`, null));
  }

  async delete(): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/${this.id}`));
  }
}
