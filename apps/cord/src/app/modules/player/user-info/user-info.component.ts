import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IUser } from '../../../api';

@Component({
  selector: 'cord-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoComponent {
  @Input() info?: IUser;
  @Input() avatarSource?: string;
  @Input() bannerSource?: string;

  get avatar() {
    if (this.avatarSource) {
      return this.avatarSource;
    }

    return this.info?.avatarUrl + '?size=90';
  }

  get banner() {
    if (this.bannerSource) {
      return this.bannerSource;
    }

    if (!this.info?.banner) {
      return null;
    }

    return this.info?.bannerUrl + '?size=300';
  }
}
