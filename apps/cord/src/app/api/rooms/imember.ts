import { ID } from '../types';
import { IUser } from '../users/iuser';
import { Permission } from './permission';

export interface IMember {
  user: IUser;
  nick?: string;
  avatar?: string;
  // string? Banner { get; }

  roles: readonly ID[];

  joinedAt: string;
  boostingSince?: string;

  permissions: Permission;

  // Per room avatar info
  // avatarInfo?: IAvatarInfo;

  assignRoles(roleIds: ID[]): Promise<void>;
  addRole(roleId: ID): Promise<void>;
  removeRole(roleId: ID): Promise<void>;
}
