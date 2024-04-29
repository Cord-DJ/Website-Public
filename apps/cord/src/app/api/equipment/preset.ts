import { ID } from '../types';
import { IPreset } from './ipreset';
import { getTimeFromId } from '../snowflake';
import { Type } from 'class-transformer';
import { Character } from './character';
import { ICharacter } from './icharacter';

export class Preset implements IPreset {
  id!: ID;

  get createdAt() {
    return getTimeFromId(this.id);
  }

  activated!: boolean;

  @Type(() => Character)
  character!: ICharacter;
  position!: number;
}
