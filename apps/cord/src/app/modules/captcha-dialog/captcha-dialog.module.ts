import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CaptchaDialogComponent } from './captcha-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [SharedModule, TranslateModule.forChild(), NgHcaptchaModule.forRoot({ siteKey: environment.hCaptchaKey })],
  declarations: [CaptchaDialogComponent],
  exports: [CaptchaDialogComponent]
})
export class CaptchaDialogModule {}
