import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DialogRef } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'cord-captcha-dialog',
  templateUrl: './captcha-dialog.component.html',
  styleUrls: ['./captcha-dialog.component.scss']
})
export class CaptchaDialogComponent implements OnInit {
  captcha = new UntypedFormControl();

  constructor(private dialogRef: DialogRef<CaptchaDialogComponent>) {}

  ngOnInit() {
    this.captcha.valueChanges.pipe(untilDestroyed(this)).subscribe(value => {
      this.dialogRef.close(value);
    });
  }
}
