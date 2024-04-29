import { ISnowflakeEntity } from '../isnowflake-entity';

export interface ISong extends ISnowflakeEntity {
  youtubeId: string;
  author: string;
  name: string;
  duration: string;
}
