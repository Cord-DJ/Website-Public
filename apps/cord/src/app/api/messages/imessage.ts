import { IMember } from '../rooms/imember';
import { ID } from '../types';
import { IUser } from '../users/iuser';
import { ISnowflakeEntity } from '../isnowflake-entity';

export interface IMessage extends ISnowflakeEntity {
  author: IUser;
  member?: IMember;
  roomId: ID;

  text?: string;
  sticker?: string;

  mentions?: ID[];
  mentionRoles?: ID[];

  delete(): Promise<void>;
}
