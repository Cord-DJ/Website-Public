import { ItemType } from './item-type';
import { ItemQuality } from './item-quality';
import { ID } from '../types';
import { ISnowflakeEntity } from '../isnowflake-entity';

// snowflake entity
export interface IItem extends ISnowflakeEntity {
  type: ItemType;
  quality: ItemQuality;
  name: string;
  races: ID[];
  assetName?: string;
  modifications: string[];
  minimumLevel: number;
  priceLP?: number;
  priceCP?: number;
}
