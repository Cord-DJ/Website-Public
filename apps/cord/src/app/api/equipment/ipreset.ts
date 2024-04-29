import { ISnowflakeEntity } from '../isnowflake-entity';
import { ICharacter } from './icharacter';

export interface IPreset extends ISnowflakeEntity {
  activated: boolean;
  character: ICharacter;
  position: number;
}
