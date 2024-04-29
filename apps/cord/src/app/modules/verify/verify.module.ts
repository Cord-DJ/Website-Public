import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './verify.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from '../../../environments/environment';
import { XuiButtonModule } from 'xui';

const routes: Routes = [
  {
    path: '',
    component: VerifyComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgHcaptchaModule.forRoot({ siteKey: environment.hCaptchaKey }),
    XuiButtonModule
  ],
  declarations: [VerifyComponent]
})
export class VerifyModule {}
