import { ISnowflakeEntity } from '../isnowflake-entity';
import { ID } from '../types';
import { IRoleSettings } from './irole-settings';
import { Permission } from './permission';

export const EveryoneId: ID = '420' as ID;

export interface IRole extends ISnowflakeEntity {
  position: number;
  name: string;
  color: string;
  settings: IRoleSettings;
  permissions: Permission;
}
