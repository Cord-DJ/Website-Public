import { ID } from './types';
import { DateTime } from 'luxon';

export interface ISnowflakeEntity {
  id: ID;
  createdAt: DateTime;
}
