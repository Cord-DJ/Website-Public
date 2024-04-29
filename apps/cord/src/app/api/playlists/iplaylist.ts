import { ISnowflakeEntity } from '../isnowflake-entity';
import { ID } from '../types';
import { ISong } from './isong';

export interface IPlaylist extends ISnowflakeEntity {
  name: string;
  nextSongId?: ID;
  isProcessing: boolean;
  songs: readonly ISong[];

  reorderSongs(song: ISong, position: number): Promise<void>;
  setActive(): Promise<void>;

  addSong(song: ISong): Promise<void>;
  deleteSong(song: ISong): Promise<void>;

  setName(name: string): Promise<void>;
  setNextSong(song: ISong): Promise<void>;
  delete(): Promise<void>;
}
