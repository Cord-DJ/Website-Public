import { ISnowflakeEntity } from '../isnowflake-entity';
import { IPlaylist } from '../playlists/iplaylist';
import { ID } from '../types';
import { IBoost } from './iboost';
import { UserProperties } from './update-properties';
import { UpdateUser } from './update-user';
import { ImportType } from './import-type';
import { ICharacter } from '../equipment/icharacter';

export interface IUser extends ISnowflakeEntity {
  properties: UserProperties;

  email?: string;
  activePlaylistId?: ID;

  name: string;
  discriminator: number;
  avatar?: ID;
  banner?: ID;

  exp?: number;
  maxExp?: number;
  level?: number;
  boost?: IBoost;

  character: ICharacter;
  playlists?: IPlaylist[];

  activePlaylist?: IPlaylist;

  /// These are getters
  isStaff: boolean;
  hasTurbo: boolean;
  isEarlySupporter: boolean;
  isPartner: boolean;
  isModerator: boolean;

  avatarUrl: string;
  bannerUrl: string | null;
  /// ==========

  update(update: UpdateUser): Promise<void>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;

  createPlaylist(name: string): Promise<void>;
  importPlaylist(id: string, type: ImportType): Promise<void>;
}
