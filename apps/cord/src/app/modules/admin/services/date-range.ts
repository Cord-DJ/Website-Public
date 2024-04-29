import { DateTime } from 'luxon';

export interface IDateRange {
  start: DateTime;
  end: DateTime;

  calculateStep(): string;
}

export class DateRange implements IDateRange {
  constructor(public start: DateTime, public end: DateTime) {}

  calculateStep(): string {
    const diff = this.end.diff(this.start, 'days');

    if (diff.days < 3) {
      return '1h';
    } else if (diff.days < 90) {
      return '1d';
    } else {
      return '90d';
    }
  }
}
