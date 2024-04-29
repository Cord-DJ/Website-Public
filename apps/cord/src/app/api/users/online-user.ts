import { Type } from 'class-transformer';
import { ID } from '../types';
import { IOnlineUser } from './ionline-user';
import { IPosition } from './iposition';
import { IUser } from './iuser';
import { User } from './user';
import { getTimeFromId } from '../snowflake';

export class OnlineUser implements IOnlineUser {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  position!: IPosition;

  @Type(() => User)
  user!: IUser;
}
