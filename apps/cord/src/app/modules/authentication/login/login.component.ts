import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CordService, DialogService, AuthService } from '../../../services';
import { CaptchaDialogComponent } from '../../captcha-dialog/captcha-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'cord-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  model = new UntypedFormGroup({
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    password: new UntypedFormControl(null, Validators.required)
  });

  constructor(
    private authService: AuthService,
    private oauthService: OAuthService,
    private router: Router,
    private dialogService: DialogService,
    private dialog: Dialog,
    private cordService: CordService,
    private route: ActivatedRoute
  ) {
    this.model.get('email')!.valueChanges.subscribe(() => {
      this.model.get('password')!.setErrors(null);
    });

    this.model.get('password')!.valueChanges.subscribe(() => {
      this.model.get('email')!.setErrors(null);
    });
  }

  login = async () => {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return false;
    }

    const { email, password } = this.model.value;

    try {
      await this.authService.login(email, password);
      window.location.href = this.route.snapshot.queryParams['redirect_url'] ?? '/rooms';
    } catch (e: any) {
      if (e.status === 404) {
        this.model.get('email')!.setErrors({ message: 'login.wrong_password' });
        this.model.get('password')!.setErrors({ message: 'login.wrong_password' });
      }

      return false;
    }

    return true;
  };

  async passwordRecovery() {
    const email = this.model.get('email')!;

    if (!email.valid) {
      email.markAsTouched();
      return;
    }

    const captcha = await lastValueFrom(
      this.dialog.open(CaptchaDialogComponent, {
        width: '500px',
        height: '300px'
      }).closed
    );

    try {
      await this.cordService.resetPasswordRequest(email.value, captcha as any);
      this.dialogService.show('login.instructions_sent', 'login.password_recovery_instructions');
      this.model.reset();
    } catch (e: any) {
      email.setErrors({ message: 'login.email_not_found' });
    }
  }
}
