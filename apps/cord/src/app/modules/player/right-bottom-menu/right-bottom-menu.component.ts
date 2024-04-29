import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CordService, DialogService } from '../../../services';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { SettingsComponent } from 'xui';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { createMenu } from '../settings/settings-menu';
import { Dialog } from '@angular/cdk/dialog';
import { SettingsService } from '../../../services/settings.service';
import { UserStatus } from '../../../api';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@Component({
  selector: 'cord-right-bottom-menu',
  templateUrl: './right-bottom-menu.component.html',
  styleUrls: ['./right-bottom-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightBottomMenuComponent {
  Status = UserStatus;

  status$ = this.settingsService.status$;
  me$ = this.cordService.me$;
  menuItems = createMenu(() => this.logout());

  @ViewChild('settings') settings!: SettingsComponent;

  constructor(
    private dialog: Dialog,
    private dialogService: DialogService,
    private cordService: CordService,
    private settingsService: SettingsService,
    private oauth: OAuthService,
    private router: Router
  ) {}

  openSettings() {
    this.dialogService.ensureAuthenticated();
    this.settings.open();
  }

  openCharacter() {
    this.dialogService.ensureAuthenticated();
    this.dialog.open(AvatarDialogComponent, {
      width: '900px',
      height: '700px'
    });
  }

  openUserProfile() {
    this.dialogService.ensureAuthenticated();
    this.dialog.open(UserProfileComponent, {
      width: '900px',
      height: '700px'
    });
  }

  // TODO: move this to user profile
  // formatExpTooltip(user: User) {
  //   if (!user?.exp || !user?.maxExp || !user?.expPercentage) {
  //     return ' ';
  //   }
  //
  //   let boost = '';
  //   if (user?.remainingBoostPercentage) {
  //     boost = ` | Boost Remaining: ${Math.round(user.remainingBoostPercentage)}%`;
  //   }
  //
  //   return `${user.exp} XP / ${user.maxExp} XP [${user.expPercentage}%]${boost}`;
  // }

  logout() {
    this.oauth.logOut();
    this.cordService.reset();

    return this.router.navigateByUrl('/r');
  }

  setStatus(status: UserStatus) {
    this.settingsService.update({ status });
  }
}
