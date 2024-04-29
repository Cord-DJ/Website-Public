import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CordService } from '../../../services';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'cord-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {
  model = new UntypedFormGroup({
    name: new UntypedFormControl(null, Validators.required),
    icon: new UntypedFormControl(),
    banner: new UntypedFormControl(),
    wallpaper: new UntypedFormControl()
  });

  constructor(
    private cordService: CordService,
    private router: Router,
    private dialog: DialogRef<CreateRoomDialogComponent>
  ) {}

  create = async () => {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return false;
    }

    try {
      const value = this.model.value;
      const response = await this.cordService.createRoom({
        name: value.name,
        icon: value.icon,
        banner: value.banner
      });

      this.dialog.close();
      await this.router.navigateByUrl('/r/' + response.link);
    } catch {
      return false;
    }

    return true;
  };

  close() {
    this.dialog.close();
  }
}
