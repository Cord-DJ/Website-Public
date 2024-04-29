import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemInstance, ItemType } from '../../../../api';

@Component({
  selector: 'cord-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotComponent implements OnInit {
  extraOpened = false;

  colorModifications = {
    color_red: '#b22222',
    color_green: '#22B573',
    color_blue: '#226ab2',
    color_lime: '#74FF91',
    color_orange: '#FEA443',
    color_gray_purple: '#705E78',
    color_burgundy: '#812F33',
    color_dark_blue: '#0C4FB3',
    color_shady_blue: '#3B8AFF',
    color_sky_blue: '#66D8E8',
    color_dark_pink: '#D982BA',
    color_purple: '#BE65BF',
    color_dark_purple: '#7B3CA6',
    color_cream_white: '#DCE6F2',
    color_gold: '#FFE48C'
  };

  humanSkinColorModifications = {
    human_skin_white: '#EFCBBF',
    human_skin_black: '#9E6F63',
    human_skin_chocolate: '#936C58',
    human_skin_asian: '#DBBB9C',
    human_skin_hispanic: '#C9A273'
  };

  @Input() type!: ItemType;
  @Input() itemInstance?: ItemInstance;
  @Input() position!: 'top' | 'bottom' | 'left' | 'right';
  @Output() modificationSelected = new EventEmitter<string>();

  get icon() {
    if (!this.type || this.itemInstance) {
      return null;
    }

    switch (this.type) {
      case ItemType.Race:
        return 'face-man-shimmer';
      case ItemType.Skin:
        return 'skin';
      case ItemType.Head:
        return 'hat-fedora';
      case ItemType.Face:
        return 'mustache';
      case ItemType.Neck:
        return 'necklace';
      case ItemType.Shoulders:
        return 'shoulders';
      case ItemType.Back:
        return 'cape';
      case ItemType.Chest:
        return 'chest-plate';
      case ItemType.Shirt:
        return 'tshirt-crew';
      case ItemType.Wrist:
        return 'bracelet';
      case ItemType.Hands:
        return 'gloves';
      case ItemType.Waist:
        return 'belt';
      case ItemType.Legs:
        return 'pants';
      case ItemType.Feet:
        return 'shoe-sneaker';
      case ItemType.Finger:
        return 'hand-pointing-up';
      case ItemType.Trinket:
        return 'earbuds';
      case ItemType.Eyes:
        return 'eye';
      case ItemType.Hair:
        return 'hairstyle';
      case ItemType.Hand:
        return 'hand-okay';
      case ItemType.Dance:
        return 'human-female-dance';
      case ItemType.Event:
        return 'calendar';

      default:
        return 'eye';
    }
  }

  get tooltip() {
    return this.itemInstance?.item.name ?? ItemType[this.type];
  }

  get availableColorModifications() {
    return this.itemInstance?.availableModifications.filter(x => x.startsWith('color_'));
  }

  get availableHumanSKinColorModifications() {
    return this.itemInstance?.availableModifications.filter(x => x.startsWith('human_skin_'));
  }

  // hasModification(name: string) {
  //   return this.itemInstance?.availableModifications.includes(name);
  // }

  ngOnInit() {
    // TODO: update host border-color according to the item quality
  }

  selectModification(name: string) {
    this.modificationSelected.emit(name);
    this.extraOpened = false;
  }

  get chevron() {
    if (this.extraOpened) {
      switch (this.position) {
        case 'top':
          return 'chevron-double-down';
        case 'bottom':
          return 'chevron-double-up';
        case 'left':
          return 'chevron-double-right';
        case 'right':
          return 'chevron-double-left';
      }
    }

    switch (this.position) {
      case 'top':
        return 'chevron-double-up';
      case 'bottom':
        return 'chevron-double-down';
      case 'left':
        return 'chevron-double-left';
      case 'right':
        return 'chevron-double-right';
    }
  }

  toggleExtra() {
    this.extraOpened = !this.extraOpened;
  }
}
