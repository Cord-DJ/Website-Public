import { ID } from '../types';
import { ISong } from './isong';

export interface ICurrentSong {
  song: ISong;
  userId: ID;
  endTime: string;

  upvotes: ID[];
  steals: ID[];
  downvotes: ID[];
}
