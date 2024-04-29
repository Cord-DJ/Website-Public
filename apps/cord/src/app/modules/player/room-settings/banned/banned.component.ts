import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IUser } from '../../../../api';
import { CordService } from '../../../../services';
import { SettingsPage } from 'xui';

@Component({
  selector: 'cord-banned',
  templateUrl: './banned.component.html',
  styleUrls: ['./banned.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannedComponent implements SettingsPage {
  bannedUsers$ = this.cordService.banned$;
  stateChanged!: (state: boolean) => void;

  async save() {
    return true;
  }
  async reset() {
    return true;
  }

  constructor(private cordService: CordService) {}

  async unban(user: IUser) {
    if (!confirm(`Do you want to unban user ${user.name}?`)) {
      return;
    }

    await this.cordService.room?.unban(user);
  }
}
