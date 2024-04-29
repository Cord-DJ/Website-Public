import { ISnowflakeEntity } from '../isnowflake-entity';
import { IPosition } from './iposition';
import { IUser } from './iuser';

export interface IOnlineUser extends ISnowflakeEntity {
  position: IPosition;
  user: IUser;
}
