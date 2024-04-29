import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CordService } from '../../../services';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'cord-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  model = new UntypedFormGroup({
    currentPassword: new UntypedFormControl(null, Validators.required),
    newPassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)])
  });

  constructor(private cordService: CordService, private dialog: DialogRef<ChangePasswordDialogComponent>) {}

  changePassword = async () => {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return false;
    }

    const { currentPassword, newPassword, confirmPassword } = this.model.value;
    if (newPassword !== confirmPassword) {
      this.model.get('confirmPassword')!.setErrors({ message: 'registration.password_no_match' });
      return false;
    }

    try {
      await this.cordService.me.updatePassword(currentPassword, newPassword);
      this.dialog.close();
    } catch (e: any) {
      switch (e.status) {
        case 403:
          this.model.get('currentPassword')!.setErrors({ message: 'password_change.wrong_password' });
          break;
      }

      return false;
    }

    return true;
  };

  close() {
    this.dialog.close();
  }
}
