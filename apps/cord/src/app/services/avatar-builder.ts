import { ICharacter, ItemInstance, SlotType } from '../api';

export class AvatarBuilder {
  constructor(private character: ICharacter) {}

  async build() {
    const [
      race,
      skin,
      head,
      eyes,
      hair,
      face,
      neck,

      back,
      shirt,
      chest,
      shoulders,
      hands,
      wrist,
      leftHand,
      rightHand,

      legs,
      feet,
      waist
    ]: (FileFormat | null)[] = await Promise.all([
      this.buildRace(),
      this.buildSkin(),
      this.buildHead(),
      this.buildEyes(),
      this.buildHair(),
      this.buildFace(),
      this.buildNeck(),

      this.buildBack(),
      this.buildShirt(),
      this.buildChest(),
      this.buildShoulders(),
      this.buildHands(),
      this.buildWrist(),
      this.buildLeftHand(),
      this.buildRightHand(),

      this.buildLegs(),
      this.buildFeet(),
      this.buildWaist()
    ]);

    if (!race?.main) {
      return '';
    }

    // TODO
    //   Dance = ItemType.Dance,
    //   Event = ItemType.Event,

    return this.wrap(
      race.main
        .replace('{SKIN_PART}', skin?.main ?? '') // Tattoo???
        .replace('{HEAD_PART}', head?.main ?? '') // cap, fedora...
        .replace('{EYES_PART}', eyes?.main ?? race.eyes ?? '') // glasses?
        .replace('{HAIR_PART}', hair?.main ?? '')
        .replace('{FACE_PART}', face?.main ?? '') // mustache
        .replace('{NECK_PART}', neck?.main ?? '')

        .replace('{BACK_PART}', back?.main ?? '') // cape
        .replace('{SHIRT_PART}', shirt?.main ?? '') // shirt under jacket
        .replace('{CHEST_PART}', chest?.main ?? '')
        .replace('{SHOULDERS_PART}', shoulders?.main ?? '')
        .replace('{HANDS_PART}', hands?.main ?? '') // gloves
        .replace('{WRIST_PART}', wrist?.main ?? '') // tomorrowland bracelet
        .replace('{LEFT_HAND_PART}', leftHand?.main ?? '')
        .replace('{RIGHT_HAND_PART}', rightHand?.main ?? '')

        .replace('{LEGS_PART}', legs?.main ?? '')
        .replace('{FEET_PART}', feet?.main ?? '') // boots
        .replace('{WAIST_PART}', waist?.main ?? legs?.waist ?? '')

      // TODO: these are not used, yet
      // .replace('{LEFT_FINGER_PART}', '')
      // .replace('{RIGHT_FINGER_PART}', '')
      // .replace('{LEFT_TRINKET_PART}', '')
      // .replace('{RIGHT_TRINKET_PART}', '')
    );
  }

  private async buildRace() {
    const itemInstance = this.character[SlotType.Race];
    const part = await this.loadPart(SlotType.Race);

    if (part?.main) {
      part.main = part.main.replaceAll('{RACE_MODIFICATION}', itemInstance.modification);
    }

    return part;
  }

  private buildSkin() {
    return this.loadPart(SlotType.Skin);
  }

  private buildHead() {
    return this.loadPart(SlotType.Head);
  }

  private buildEyes() {
    return this.loadPart(SlotType.Eyes);
  }

  private async buildHair() {
    const itemInstance = this.character[SlotType.Hair];
    const part = await this.loadPart(SlotType.Hair);

    if (part?.main) {
      part.main = part.main.replaceAll('{HAIR_MODIFICATION}', itemInstance.modification);
    }

    return part;
  }

  private buildFace() {
    return this.loadPart(SlotType.Face);
  }

  private buildNeck() {
    return this.loadPart(SlotType.Neck);
  }

  // =============================
  private buildBack() {
    return this.loadPart(SlotType.Back);
  }

  private async buildShirt() {
    const itemInstance = this.character[SlotType.Shirt];
    const part = await this.loadPart(SlotType.Shirt);

    if (part?.main) {
      part.main = part.main.replaceAll('{SHIRT_MODIFICATION}', itemInstance.modification);
    }

    return part;
  }

  private async buildChest() {
    const itemInstance = this.character[SlotType.Chest];
    const part = await this.loadPart(SlotType.Chest);

    if (part?.main) {
      part.main.replaceAll('{CHEST_MODIFICATION}', itemInstance.modification);
    }

    return part;
  }

  private buildShoulders() {
    return this.loadPart(SlotType.Shoulders);
  }

  private buildHands() {
    return this.loadPart(SlotType.Hands);
  }

  private buildWrist() {
    return this.loadPart(SlotType.Wrist);
  }

  private buildLeftHand() {
    return this.loadPart(SlotType.LeftHand);
  }
  private buildRightHand() {
    return this.loadPart(SlotType.RightHand);
  }

  private async buildLegs() {
    const itemInstance = this.character[SlotType.Legs];
    const part = await this.loadPart(SlotType.Legs);

    if (part?.main) {
      part.main = part.main.replaceAll('{LEGS_MODIFICATION}', itemInstance.modification);
    }

    return part;
  }

  private buildFeet() {
    return this.loadPart(SlotType.Feet);
  }

  private buildWaist() {
    return this.loadPart(SlotType.Waist);
  }

  private wrap(content: string) {
    return `
      <?xml version="1.0" encoding="utf-8"?>
      <svg version="1.1" id="layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 50 100" xml:space="preserve">
        ${content}
      </svg>`;
  }

  private async loadPart(slotType: SlotType): Promise<FileFormat | null> {
    const itemInstance: ItemInstance = this.character[slotType];
    if (!itemInstance) {
      return null;
    }

    const content = await fetch(`/assets/items/${itemInstance.item.assetName}.json`);
    const part = await content.json();
    const ret: any = {};

    for (const key of Object.keys(part)) {
      ret[key] = atob(part[key]);
    }

    return ret;
  }
}

interface FileFormat {
  main?: string;
  eyes?: string;
  waist?: string;
}
