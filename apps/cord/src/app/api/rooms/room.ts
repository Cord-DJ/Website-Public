import { Type } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IMessage } from '../messages/imessage';
import { Message } from '../messages/message';
import { ICurrentSong } from '../playlists/icurrent-song';
import { IPlaylist } from '../playlists/iplaylist';
import { ID } from '../types';
import { IOnlineUser } from '../users/ionline-user';
import { IUser } from '../users/iuser';
import { OnlineUser } from '../users/online-user';
import { User } from '../users/user';
import { IMember } from './imember';
import { IRole } from './irole';
import { IRoom } from './iroom';
import { Member } from './member';
import { Permission } from './permission';
import { RoomFeatures } from './room-features';
import { UpdateRole } from './update-role';
import { UpdateRoom } from './update-room';
import { Vote } from './vote';
import { ISongPlayed } from '../playlists/isong-played';
import { getTimeFromId } from '../snowflake';
import { SongPlayed } from '../playlists/song-played';
import { CurrentSong } from '../playlists/current-song';

export class Room implements IRoom {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  name!: string;
  link!: string;
  description!: string;
  features!: RoomFeatures;

  ownerId!: ID;
  ownerName!: string;

  icon?: ID;
  banner?: ID;
  wallpaper?: ID;

  onlineCount?: number;
  memberCount?: number;

  @Type(() => CurrentSong)
  currentSong?: ICurrentSong;

  // these should be modified from signalr
  @Type(() => OnlineUser)
  onlineUsers?: IOnlineUser[];

  @Type(() => Member)
  members?: IMember[];

  @Type(() => User)
  queue?: IUser[];
  roles?: IRole[];

  @Type(() => User)
  banned?: IUser[];

  @Type(() => User)
  muted?: IUser[];

  @Type(() => Message)
  messages?: IMessage[];

  @Type(() => SongPlayed)
  songHistory?: ISongPlayed[];

  get isPartnered() {
    return (this.features & RoomFeatures.Partnered) === RoomFeatures.Partnered;
  }

  get isVerified() {
    return (this.features & RoomFeatures.Verified) === RoomFeatures.Verified;
  }

  get iconUrl() {
    return this.icon ? `${environment.cdnEndpoint}/icons/${this.icon}.webp` : null;
  }

  get bannerUrl() {
    return this.banner ? `${environment.cdnEndpoint}/banners/${this.banner}.webp` : null;
  }

  get wallpaperUrl() {
    return this.wallpaper ? `${environment.cdnEndpoint}/wallpapers/${this.wallpaper}.webp` : '/assets/default-bg.webp';
  }

  // API calls
  private get endpoint() {
    return `${environment.apiEndpoint}/rooms/${this.id}`;
  }

  async addToQueue(user?: IUser): Promise<void> {
    await lastValueFrom(window.http.put(`${this.endpoint}/members/${user?.id ?? '@me'}/queue`, null));
  }

  async removeFromQueue(user?: IUser): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/members/${user?.id ?? '@me'}/queue`));
  }

  async reorderQueue(ids: ID[]): Promise<void> {
    await lastValueFrom(window.http.patch(`${this.endpoint}/queue`, ids));
  }

  async addMember(user?: IUser): Promise<void> {
    await lastValueFrom(window.http.post(`${this.endpoint}/members/${user?.id ?? '@me'}`, null));
  }

  async removeMember(user?: IUser): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/members/${user?.id ?? '@me'}`));
  }

  async vote(vote: Vote): Promise<void> {
    await lastValueFrom(window.http.post(`${this.endpoint}/vote/${vote}`, null));
  }

  async steal(playlist: IPlaylist): Promise<void> {
    await lastValueFrom(
      window.http.post(`${this.endpoint}/steal`, {
        playlistId: playlist.id
      })
    );
  }

  async skip(): Promise<void> {
    await lastValueFrom(window.http.post(`${this.endpoint}/skip`, null));
  }

  async update(room: UpdateRoom): Promise<void> {
    await lastValueFrom(window.http.patch(`${this.endpoint}`, room));
  }

  async delete(): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}`));
  }

  async kick(user: IUser): Promise<void> {
    await lastValueFrom(window.http.post(`${this.endpoint}/users/${user.id}/kick`, null));
  }

  async ban(user: IUser, duration: number): Promise<void> {
    await lastValueFrom(
      window.http.post(`${this.endpoint}/users/${user.id}/ban`, {
        duration
      })
    );
  }

  async mute(user: IUser, duration: number): Promise<void> {
    await lastValueFrom(
      window.http.post(`${this.endpoint}/users/${user.id}/mute`, {
        duration
      })
    );
  }

  async unban(user: IUser): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/users/${user.id}/ban`));
  }

  async unmute(user: IUser): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/users/${user.id}/mute`));
  }

  async createRole(): Promise<IRole> {
    const role = await lastValueFrom(window.http.post<IRole>(`${this.endpoint}/roles`, null));
    // return plainToInstance(IRole, role);
    return role;
  }

  async deleteRole(role: IRole): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/roles/${role.id}`));
  }

  async updateRole(role: IRole, values: UpdateRole): Promise<void> {
    await lastValueFrom(window.http.patch(`${this.endpoint}/roles/${role.id}`, values));
  }

  async reorderRoles(roles: IRole[]): Promise<void> {
    await lastValueFrom(
      window.http.patch(
        `${this.endpoint}/roles`,
        roles.map(x => x.id)
      )
    );
  }

  async sendMessage(message: string): Promise<void> {
    await lastValueFrom(
      window.http.post(`${this.endpoint}/messages`, {
        message
      })
    );
  }

  getMemberRoles(member: IMember): IRole[] | undefined {
    return member.roles.map(id => this.roles?.find(x => x.id === id)) as IRole[];
  }

  getRoleMembers(role: IRole): IMember[] | undefined {
    return this.members?.filter(x => x.roles.includes(role.id));
  }

  getMemberPrimaryRole(member: IMember): IRole | undefined {
    return this.getMemberRoles(member)?.reduce((prev, cur) => (prev.position > cur.position ? prev : cur));
  }

  hasPermissions(userId: ID, ...permissions: Permission[]) {
    const member = this.members?.find(x => x.user.id === userId);
    if (!member) {
      return false;
    }

    if ((member.permissions & Permission.Administrator) === Permission.Administrator) {
      return true;
    }

    for (const req of permissions) {
      if ((member.permissions & req) === req) {
        return true;
      }
    }

    return false;
  }

  isUserInQueue(user: IUser) {
    return this.queue?.some(x => x.id === user.id);
  }
}
