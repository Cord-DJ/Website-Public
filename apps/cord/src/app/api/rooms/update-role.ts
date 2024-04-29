import { Permission } from './permission';

export interface UpdateRole {
  name: string;
  color: string;
  permissions: Permission;
}
