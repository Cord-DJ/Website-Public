import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CordService } from '../../../../services';
import { SettingsPage, XuiSnackBar } from 'xui';

@Component({
  selector: 'cord-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements SettingsPage, OnInit {
  model = new UntypedFormGroup({
    name: new UntypedFormControl(null, Validators.required),
    icon: new UntypedFormControl(),
    banner: new UntypedFormControl(),
    wallpaper: new UntypedFormControl()
  });

  stateChanged!: (state: boolean) => void;

  // avatar$ = this.model.valueChanges.pipe(map(x => x.avatar));
  // banner$ = this.model.valueChanges.pipe(map(x => x.banner));

  constructor(private snackBar: XuiSnackBar, private cordService: CordService) {}

  delete(type: string) {
    this.model.get(type)?.patchValue('delete');
  }

  ngOnInit() {
    this.setValues();
    this.model.valueChanges.subscribe(() => this.stateChanged(false));
  }

  async save() {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return false;
    }

    try {
      const value = this.model.value;
      await this.cordService.room?.update({
        name: value.name,
        icon: value.icon,
        banner: value.banner,
        wallpaper: value.wallpaper
      });
    } catch {
      return false;
    }

    this.setValues();
    this.snackBar.open('Room Settings has been saved successfuly');
    return true;
  }

  async reset() {
    this.setValues();
    return true;
  }

  private setValues() {
    const room = this.cordService.room;

    this.model.patchValue({
      name: room?.name
      // TODO: set this and also provide a way to detect if it was changed
      // icon: room?.icon,
      // banner: room?.banner,
      // wallpaper: room?.wallpaper
    });
  }
}
