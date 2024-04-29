import { ISong } from './isong';
import { IUser } from '../users/iuser';
import { ISongPlayed } from './isong-played';
import { Type } from 'class-transformer';
import { User } from '../users/user';
import { getTimeFromId } from '../snowflake';
import { ID } from '../types';
import { Song } from './song';

export class SongPlayed implements ISongPlayed {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  @Type(() => Song)
  song!: ISong;

  @Type(() => User)
  user!: IUser;

  upvotes!: number;
  steals!: number;
  downvotes!: number;
}
