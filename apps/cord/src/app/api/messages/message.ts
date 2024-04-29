import { Type } from 'class-transformer';
import { IMember } from '../rooms/imember';
import { Member } from '../rooms/member';
import { ID } from '../types';
import { IUser } from '../users/iuser';
import { User } from '../users/user';
import { IMessage } from './imessage';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getTimeFromId } from '../snowflake';

export class Message implements IMessage {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  @Type(() => User)
  author!: IUser;

  @Type(() => Member)
  member?: IMember;
  roomId!: ID;

  text?: string;
  sticker?: string;

  mentions?: ID[];
  mentionRoles?: ID[];

  // Set for private usage only
  isCozy = false;

  private get endpoint() {
    return `${environment.apiEndpoint}/rooms/${this.roomId}/messages`;
  }

  get user() {
    return this.member ? this.member.user : this.author;
  }

  async delete(): Promise<void> {
    await lastValueFrom(window.http.delete(`${this.endpoint}/${this.id}`));
  }
}
