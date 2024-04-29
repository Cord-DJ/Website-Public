import { ICharacter } from './icharacter';
import { Type } from 'class-transformer';
import { ItemInstance } from './item-instance';
import { IItemInstance } from './iitem-instance';

export class Character implements ICharacter {
  @Type(() => ItemInstance)
  Back!: IItemInstance;

  @Type(() => ItemInstance)
  Chest!: IItemInstance;

  @Type(() => ItemInstance)
  Dance!: IItemInstance;

  @Type(() => ItemInstance)
  Event!: IItemInstance;

  @Type(() => ItemInstance)
  Eyes!: IItemInstance;

  @Type(() => ItemInstance)
  Face!: IItemInstance;

  @Type(() => ItemInstance)
  Feet!: IItemInstance;

  @Type(() => ItemInstance)
  Hair!: IItemInstance;

  @Type(() => ItemInstance)
  Hands!: IItemInstance;

  @Type(() => ItemInstance)
  Head!: IItemInstance;

  @Type(() => ItemInstance)
  LeftFinger!: IItemInstance;

  @Type(() => ItemInstance)
  LeftHand!: IItemInstance;

  @Type(() => ItemInstance)
  LeftTrinket!: IItemInstance;

  @Type(() => ItemInstance)
  Legs!: IItemInstance;

  @Type(() => ItemInstance)
  Neck!: IItemInstance;

  @Type(() => ItemInstance)
  Race!: IItemInstance;

  @Type(() => ItemInstance)
  RightFinger!: IItemInstance;

  @Type(() => ItemInstance)
  RightHand!: IItemInstance;

  @Type(() => ItemInstance)
  RightTrinket!: IItemInstance;

  @Type(() => ItemInstance)
  Shirt!: IItemInstance;

  @Type(() => ItemInstance)
  Shoulders!: IItemInstance;

  @Type(() => ItemInstance)
  Skin!: IItemInstance;

  @Type(() => ItemInstance)
  Waist!: IItemInstance;

  @Type(() => ItemInstance)
  Wrist!: IItemInstance;
}
