import { ISnowflakeEntity } from '../isnowflake-entity';
import { IItem } from './iitem';
import { Type } from 'class-transformer';
import { Item } from './item';

export interface IItemInstance extends ISnowflakeEntity {
  item: IItem;
  count?: number;
  modification: string;
  availableModifications: string[];
}
