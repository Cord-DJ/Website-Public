import { ID } from '../types';
import { getTimeFromId } from '../snowflake';
import { ISong } from './isong';

export class Song implements ISong {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  author!: string;
  duration!: string;
  name!: string;
  youtubeId!: string;

  get thumbnail() {
    return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg`;
  }
}
