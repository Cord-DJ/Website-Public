import { ISnowflakeEntity } from '../isnowflake-entity';
import { IMessage } from '../messages/imessage';
import { ICurrentSong } from '../playlists/icurrent-song';
import { IPlaylist } from '../playlists/iplaylist';
import { ISongPlayed } from '../playlists/isong-played';
import { ID } from '../types';
import { IOnlineUser } from '../users/ionline-user';
import { IUser } from '../users/iuser';
import { IMember } from './imember';
import { IRole } from './irole';
import { RoomFeatures } from './room-features';
import { UpdateRole } from './update-role';
import { UpdateRoom } from './update-room';
import { Vote } from './vote';

export interface IRoom extends ISnowflakeEntity {
  name: string;
  link: string;
  description: string;
  features: RoomFeatures;

  ownerId: ID;

  icon?: ID;
  banner?: ID;
  wallpaper?: ID;

  onlineCount?: number;
  memberCount?: number;

  currentSong?: ICurrentSong;

  onlineUsers?: IOnlineUser[];
  members?: IMember[];
  queue?: IUser[];
  roles?: IRole[];

  banned?: IUser[];
  muted?: IUser[];

  messages?: IMessage[];
  songHistory?: ISongPlayed[];

  addToQueue(user: IUser): Promise<void>;
  removeFromQueue(user: IUser): Promise<void>;
  reorderQueue(ids: ID[]): Promise<void>;

  addMember(user?: IUser): Promise<void>;
  removeMember(user?: IUser): Promise<void>;

  vote(vote: Vote): Promise<void>;
  steal(playlist: IPlaylist): Promise<void>;
  skip(): Promise<void>;
  update(room: UpdateRoom): Promise<void>;
  delete(): Promise<void>;

  kick(user: IUser): Promise<void>;
  ban(user: IUser, duration: number): Promise<void>;
  mute(user: IUser, duration: number): Promise<void>;
  unban(user: IUser): Promise<void>;
  unmute(user: IUser): Promise<void>;

  createRole(): Promise<IRole>;
  deleteRole(role: IRole): Promise<void>;
  updateRole(role: IRole, values: UpdateRole): Promise<void>;
  reorderRoles(roles: IRole[]): Promise<void>;

  sendMessage(message: string): Promise<void>;

  getMemberRoles(member: IMember): IRole[] | undefined;
  getMemberPrimaryRole(member: IMember): IRole | undefined;
}
