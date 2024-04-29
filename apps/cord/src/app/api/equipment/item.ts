import { IItem } from './iitem';
import { ItemQuality } from './item-quality';
import { ItemType } from './item-type';
import { ID } from '../types';
import { getTimeFromId } from '../snowflake';

export class Item implements IItem {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  type!: ItemType;
  quality!: ItemQuality;
  name!: string;
  races!: ID[];
  assetName?: string;
  modifications!: string[];
  minimumLevel!: number;
  priceLP?: number;
  priceCP?: number;

  get qualityColor() {
    switch (this.quality) {
      case ItemQuality.Poor:
        return '#9d9d9d';
      case ItemQuality.Common:
        return 'white';
      case ItemQuality.Uncommon:
        return '#1eff00';
      case ItemQuality.Rare:
        return '#0070dd';
      case ItemQuality.Epic:
        return '#a335ee';
      case ItemQuality.Legendary:
        return '#ff8000';
      case ItemQuality.Event:
        return '#00ccff';
    }
  }

  get iconRef() {
    return `/assets/items/${this.assetName ?? ''}.webp`;
  }
}
