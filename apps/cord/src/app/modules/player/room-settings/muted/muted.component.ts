import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IUser } from '../../../../api';
import { CordService } from '../../../../services';
import { SettingsPage } from 'xui';

@Component({
  selector: 'cord-muted',
  templateUrl: './muted.component.html',
  styleUrls: ['./muted.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MutedComponent implements SettingsPage {
  mutedUsers$ = this.cordService.muted$;
  stateChanged!: (state: boolean) => void;

  async save() {
    return true;
  }
  async reset() {
    return true;
  }

  constructor(private cordService: CordService) {}

  async unban(user: IUser) {
    if (!confirm(`Do you want to unmute user ${user.name}?`)) {
      return;
    }

    await this.cordService.room?.unmute(user);
  }
}
