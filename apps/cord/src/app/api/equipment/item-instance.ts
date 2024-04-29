import { IItemInstance } from './iitem-instance';
import { Type } from 'class-transformer';
import { Item } from './item';
import { IItem } from './iitem';
import { ID } from '../types';
import { getTimeFromId } from '../snowflake';

export class ItemInstance implements IItemInstance {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  @Type(() => Item)
  item!: IItem;
  count?: number;
  modification!: string;
  availableModifications!: string[];
}
