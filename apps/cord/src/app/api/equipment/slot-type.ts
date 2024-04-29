import { ItemType } from './item-type';

export enum SlotType {
  Race = 'Race',
  Skin = 'Skin',
  Head = 'Head',
  Face = 'Face',
  Neck = 'Neck',
  Shoulders = 'Shoulders',
  Back = 'Back',
  Chest = 'Chest',
  Shirt = 'Shirt',
  Wrist = 'Wrist',
  Hands = 'Hands',
  Waist = 'Waist',
  Legs = 'Legs',
  Feet = 'Feet',
  Eyes = 'Eyes',
  Hair = 'Hair',
  Dance = 'Dance',
  Event = 'Event',

  LeftHand = 'LeftHand',
  RightHand = 'RightHand',
  LeftFinger = 'LeftFinger',
  RightFinger = 'RightFinger',
  LeftTrinket = 'LeftTrinket',
  RightTrinket = 'RightTrinket'
}

export function slotTypeToItemType(type: SlotType): ItemType {
  switch (type) {
    case SlotType.Race:
      return ItemType.Race;
    case SlotType.Skin:
      return ItemType.Skin;
    case SlotType.Head:
      return ItemType.Head;
    case SlotType.Face:
      return ItemType.Face;
    case SlotType.Neck:
      return ItemType.Neck;
    case SlotType.Shoulders:
      return ItemType.Shoulders;
    case SlotType.Back:
      return ItemType.Back;
    case SlotType.Chest:
      return ItemType.Chest;
    case SlotType.Shirt:
      return ItemType.Shirt;
    case SlotType.Wrist:
      return ItemType.Wrist;
    case SlotType.Hands:
      return ItemType.Hands;
    case SlotType.Waist:
      return ItemType.Waist;
    case SlotType.Legs:
      return ItemType.Legs;
    case SlotType.Feet:
      return ItemType.Feet;
    case SlotType.Eyes:
      return ItemType.Eyes;
    case SlotType.Hair:
      return ItemType.Hair;
    case SlotType.Dance:
      return ItemType.Dance;
    case SlotType.Event:
      return ItemType.Event;

    case SlotType.LeftHand:
      return ItemType.Hand;
    case SlotType.RightHand:
      return ItemType.Hand;
    case SlotType.LeftTrinket:
      return ItemType.Trinket;
    case SlotType.RightTrinket:
      return ItemType.Trinket;
    case SlotType.LeftFinger:
      return ItemType.Finger;
    case SlotType.RightFinger:
      return ItemType.Finger;
  }
}
