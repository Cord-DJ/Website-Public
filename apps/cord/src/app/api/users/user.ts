import { environment } from '../../../environments/environment';
import { Type } from 'class-transformer';
import { ID } from '../types';
import { IBoost } from './iboost';
import { IUser } from './iuser';
import { UserProperties } from './update-properties';
import { IPlaylist } from '../playlists/iplaylist';
import { lastValueFrom } from 'rxjs';
import { UpdateUser } from './update-user';
import { getTimeFromId, ICharacter, Playlist } from '..';
import { ImportType } from './import-type';
import { Character } from '../equipment/character';

export class User implements IUser {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  properties!: UserProperties;

  email?: string;
  activePlaylistId?: ID;

  name!: string;
  discriminator!: number;
  avatar?: ID;
  banner?: ID;

  exp?: number;
  maxExp?: number;
  level?: number;
  boost?: IBoost;

  @Type(() => Character)
  character!: ICharacter;

  @Type(() => Playlist)
  playlists?: IPlaylist[];

  get activePlaylist(): IPlaylist | undefined {
    return this.playlists?.find(x => x.id == this.activePlaylistId);
  }

  hasProperty(prop: UserProperties) {
    return (this.properties & prop) === prop;
  }

  get expPercentage() {
    if (!this.exp || !this.maxExp) {
      return null;
    }

    return Math.round((this.exp / this.maxExp) * 100);
  }

  get remainingBoostPercentage() {
    if (!this.exp || !this.boost || !this.maxExp) {
      return null;
    }

    return Math.min(((this.exp + this.boost.remainingExp) / this.maxExp) * 100, 100);
  }

  get isStaff() {
    return this.hasProperty(UserProperties.Staff);
  }

  get hasTurbo() {
    return this.hasProperty(UserProperties.Turbo);
  }

  get isEarlySupporter() {
    return this.hasProperty(UserProperties.EarlySupporter);
  }

  get isPartner() {
    return this.hasProperty(UserProperties.Partner);
  }

  get isModerator() {
    return this.hasProperty(UserProperties.Moderator);
  }

  get avatarUrl() {
    return this.avatar
      ? `${environment.cdnEndpoint}/avatars/${this.avatar}.webp`
      : `${environment.cdnEndpoint}/embed/avatars/${this.discriminator % 5}.webp`;
  }

  get bannerUrl() {
    return this.banner ? `${environment.cdnEndpoint}/banners/${this.banner}.webp` : null;
  }

  get discriminatorString() {
    let ret = this.discriminator.toString();
    while (ret.length < 4) {
      ret = '0' + ret;
    }

    return '#' + ret;
  }

  // API
  private get endpoint() {
    return `${environment.apiEndpoint}/users`;
  }

  async update(update: UpdateUser): Promise<void> {
    await lastValueFrom(window.http.patch(`${environment.apiEndpoint}/users/@me`, update));
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await lastValueFrom(
      window.http.post(`${environment.apiEndpoint}/users/@me/update-password`, {
        currentPassword,
        newPassword
      })
    );
  }

  async createPlaylist(name: string): Promise<void> {
    await lastValueFrom(
      window.http.post(`${environment.apiEndpoint}/playlists`, {
        name
      })
    );
  }

  async importPlaylist(id: string, type: ImportType): Promise<void> {
    await lastValueFrom(
      window.http.post(`${environment.apiEndpoint}/playlists/import`, {
        id,
        type
      })
    );
  }
}
