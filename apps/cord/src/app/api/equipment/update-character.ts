import { SlotType } from './slot-type';
import { UpdateItemInstance } from './update-item-instance';

export interface UpdateCharacter extends Record<SlotType, UpdateItemInstance> {}
