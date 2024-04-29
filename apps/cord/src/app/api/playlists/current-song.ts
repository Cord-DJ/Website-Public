import { ID } from '../types';
import { getTimeFromId } from '../snowflake';
import { ISong } from './isong';
import { ICurrentSong } from './icurrent-song';
import { Type } from 'class-transformer';
import { Song } from './song';

export class CurrentSong implements ICurrentSong {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  @Type(() => Song)
  song!: ISong;
  userId!: ID;
  endTime!: string;

  upvotes!: ID[];
  steals!: ID[];
  downvotes!: ID[];
}
