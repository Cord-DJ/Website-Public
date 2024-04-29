import { IItemInstance } from './iitem-instance';
import { SlotType } from './slot-type';

export interface ICharacter extends Record<SlotType, IItemInstance> {}
