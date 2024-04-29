import { ID } from './types';
import { DateTime } from 'luxon';

export function getTimeFromId(id: ID): DateTime {
  const epoch = DateTime.fromISO('2021-11-29', { zone: 'utc' }).toUTC();
  return epoch.plus({ milliseconds: Number(BigInt(id) >> BigInt(22)) });
}
