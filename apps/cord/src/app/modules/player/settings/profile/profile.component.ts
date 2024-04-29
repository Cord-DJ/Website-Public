import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { User } from '../../../../api';
import { map } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CordService } from '../../../../services';
import { ChangePasswordDialogComponent } from '../../change-password-dialog/change-password-dialog.component';
import { SettingsPage, XuiSnackBar } from 'xui';
import { Dialog } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'cord-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements SettingsPage, OnInit {
  model = new UntypedFormGroup({
    name: new UntypedFormControl(),
    avatar: new UntypedFormControl(),
    banner: new UntypedFormControl()
  });

  stateChanged!: (state: boolean) => void;
  me?: User;

  avatar$ = this.model.valueChanges.pipe(map(x => x.avatar));
  banner$ = this.model.valueChanges.pipe(map(x => x.banner));

  constructor(private snackBar: XuiSnackBar, private cordService: CordService, private dialog: Dialog) {}

  ngOnInit() {
    this.setValues();
    this.model.valueChanges.subscribe(() => this.stateChanged(false));
  }

  async save() {
    const value = this.model.value;

    try {
      await this.me?.update({
        name: value.name,
        // discriminator: 42,
        avatar: value.avatar,
        banner: value.banner
      });
    } catch {
      return false;
    }

    this.setValues();
    this.snackBar.open('Settings has been saved successfully');
    return true;
  }

  async reset() {
    this.setValues();
    return true;
  }

  async changePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      height: '60%'
    });
  }

  private setValues() {
    if (this.cordService.me) {
      this.me = this.cordService.me;
      this.model.patchValue({ name: this.me.name });
    }
  }
}
