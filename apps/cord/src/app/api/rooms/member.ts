import { Type } from 'class-transformer';
import { ID } from '../types';
import { IUser } from '../users/iuser';
import { User } from '../users/user';
import { IMember } from './imember';
import { Permission } from './permission';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRoom } from './iroom';

export class Member implements IMember {
  @Type(() => User)
  user!: IUser;

  nick?: string;
  avatar?: string;

  roles!: readonly ID[];

  joinedAt!: string;
  boostingSince?: string;

  permissions!: Permission;

  // @Type(() => AvatarInfo)
  // avatarInfo?: IAvatarInfo;

  room!: IRoom;

  // API calls
  private get endpoint() {
    return `${environment.apiEndpoint}/rooms/${this.room.id}/members/${this.user.id}`;
  }

  async assignRoles(roleIds: ID[]): Promise<void> {
    throw new Error('Method not implemented.');

    // await lastValueFrom(
    //   window.http.post(`${this.endpoint}/roles`, {
    //
    //   })
    // );
  }

  async addRole(roleId: ID): Promise<void> {
    await lastValueFrom(window.http.put(`${this.endpoint}/roles/${roleId}`, null));
  }

  async removeRole(roleId: ID): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/roles/${roleId}`));
  }
}
