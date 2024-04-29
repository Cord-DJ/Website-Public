import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { TestUserComponent } from './test-user/test-user.component';
import { environment } from '../../../environments/environment';
import { CaptchaDialogModule } from '../captcha-dialog/captcha-dialog.module';
import { AuthorizeComponent } from './authorize/authorize.component';
import { XuiButtonModule, XuiDecagramModule, XuiIconModule, XuiInputModule } from 'xui';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'authorize',
    component: AuthorizeComponent
  },
  {
    path: 'test-user',
    component: TestUserComponent
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    NgHcaptchaModule.forRoot({ siteKey: environment.hCaptchaKey }),
    CaptchaDialogModule,
    XuiInputModule,
    XuiButtonModule,
    XuiIconModule,
    XuiDecagramModule
  ],
  declarations: [LoginComponent, RegisterComponent, TestUserComponent, AuthorizeComponent]
})
export class AuthenticationModule {}
