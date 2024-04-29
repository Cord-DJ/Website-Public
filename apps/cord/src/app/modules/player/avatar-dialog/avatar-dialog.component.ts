import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CordService, EquipmentService } from '../../../services';
import {
  IItemInstance,
  Item,
  ItemInstance,
  ItemType,
  Preset,
  SlotType,
  slotTypeToItemType,
  UpdateCharacter
} from '../../../api';
import { DialogRef } from '@angular/cdk/dialog';
import { UpdateItemInstance } from '../../../api/equipment/update-item-instance';
import { plainToInstance } from 'class-transformer';
import { Character } from '../../../api/equipment/character';

@Component({
  selector: 'cord-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrls: ['./avatar-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarDialogComponent implements OnInit {
  presets: Preset[] = [];
  items: ItemGroup[] = [];
  highlight?: ItemType;
  closed: string[] = [];
  loaded?: Preset;

  slots: SlotType[] = [
    SlotType.Race,
    SlotType.Skin,
    SlotType.Hair,
    SlotType.Eyes,
    SlotType.Head,
    SlotType.Hands,
    SlotType.Face,
    SlotType.Waist,
    SlotType.Neck,
    SlotType.Legs,
    SlotType.Shoulders,
    SlotType.Feet,
    SlotType.Back,
    SlotType.LeftFinger,
    SlotType.Chest,
    SlotType.RightFinger,
    SlotType.Shirt,
    SlotType.LeftTrinket,
    SlotType.Wrist,
    SlotType.RightTrinket,
    SlotType.LeftHand,
    SlotType.RightHand,
    SlotType.Dance,
    SlotType.Event
  ];

  positions: ('top' | 'left' | 'bottom' | 'right')[] = [
    'bottom',
    'bottom',
    'bottom',
    'bottom',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'right',
    'left',
    'top',
    'top',
    'top',
    'top'
  ];

  isOpened(group: string) {
    return !this.closed.includes(group);
  }

  constructor(
    private cordService: CordService,
    private equipService: EquipmentService,
    private domSanitizer: DomSanitizer,
    private dialogRef: DialogRef<AvatarDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.presets = await this.equipService.getPresets();
    await this.loadPreset(this.presets[0]);
    await this.loadItems();
  }

  async savePreset(preset: Preset) {
    const character = this.loaded!.character;
    const update = {} as UpdateCharacter;

    for (const key of Object.keys(character)) {
      const slot = key as SlotType;

      update[slot] = <UpdateItemInstance>{
        itemInstanceId: character[slot].id,
        modification: character[slot].modification
      };
    }

    const response = await this.equipService.updatePreset(preset.position, update);

    const idx = this.presets.findIndex(x => x.position === preset.position);
    this.presets[idx] = response;
    await this.loadPreset(response);
  }

  // async resetPreset(preset: Preset) {
  //   const response = await this.equipService.resetPreset(preset.position);
  //
  //   const idx = this.presets.findIndex(x => x.position === preset.position);
  //   this.presets[idx] = response;
  //   await this.loadPreset(response);
  // }

  onDragStarted(event: any) {
    const item = event.source.data.item as Item;
    this.highlight = item.type;
  }

  onDragEnded() {
    this.highlight = undefined;
  }

  async selectModification(slot: SlotType, name: string) {
    const itemInstance = this.loaded!.character[slot];
    if (itemInstance) {
      itemInstance.modification = name;
      await this.loadPreset(this.loaded!);

      this.changeDetectorRef.markForCheck();
    }
  }

  async onEquip(event: any, slot: SlotType) {
    const itemInstance = event.item.data as ItemInstance;

    if (
      this.loaded &&
      slotTypeToItemType(slot) === itemInstance.item.type &&
      (slot === SlotType.Race || itemInstance.item.races.includes(this.loaded.character[SlotType.Race].item.id))
    ) {
      if (slot === SlotType.Race) {
        this.loaded.character = new Character();
      }

      this.loaded.character[slot] = itemInstance;

      // Reload items when user changes race
      if (slot === SlotType.Race) {
        await this.loadItems();
      }

      await this.loadPreset(this.loaded);
    }
  }

  async removeSlot(slot: SlotType) {
    if (slot === SlotType.Race) {
      return;
    }

    if (this.loaded) {
      delete this.loaded.character[slot];
      await this.loadPreset(this.loaded);
    }
  }

  toggleGroup(group: string) {
    if (this.closed.includes(group)) {
      this.closed = this.closed.filter(x => x !== group);
    } else {
      this.closed = [...this.closed, group];
    }
  }

  async loadPreset(preset: Preset) {
    this.loaded = plainToInstance(Preset, JSON.parse(JSON.stringify({ ...preset, html: undefined })) as unknown);
    this.changeDetectorRef.markForCheck();
  }

  private async loadItems() {
    const items = await this.equipService.getItems();
    this.items = this.groupItems(items);
    this.changeDetectorRef.markForCheck();
  }

  private groupItems(items: IItemInstance[]) {
    const groups = Object.values(
      items
        .filter(
          x => x.item.races.includes(this.loaded?.character[SlotType.Race].item.id!) || x.item.type == ItemType.Race
        )
        .reduce((group, itemInstance) => {
          const { type } = itemInstance.item;
          group[type] = group[type] ?? {
            name: ItemType[type],
            itemInstances: []
          };

          group[type].itemInstances.push(itemInstance);
          return group;
        }, <{ [key in ItemType]: ItemGroup }>{})
    );

    return groups
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(group => ({
        ...group,
        itemInstances: group.itemInstances.sort((a, b) => a.item.name.localeCompare(b.item.name))
      }));
  }

  toItemType(slotType: SlotType) {
    return slotTypeToItemType(slotType);
  }
}

interface ItemGroup {
  name: string;
  itemInstances: ItemInstance[];
}
