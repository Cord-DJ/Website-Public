import { ISnowflakeEntity } from '../isnowflake-entity';
import { ISong } from './isong';
import { IUser } from '../users/iuser';

export interface ISongPlayed extends ISnowflakeEntity {
  song: ISong;
  user: IUser;

  upvotes: number;
  steals: number;
  downvotes: number;
}
