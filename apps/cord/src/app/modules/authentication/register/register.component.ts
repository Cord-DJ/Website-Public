import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { CordService, AuthService } from '../../../services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'cord-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  model = new UntypedFormGroup({
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    name: new UntypedFormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
    captcha: new UntypedFormControl(null, Validators.required)
  });

  get hasCaptchaError(): boolean {
    const control = this.model.get('captcha');
    if (!control) {
      return false;
    }

    const { dirty, touched } = control;
    return control.invalid ? dirty! || touched! : false;
  }

  constructor(
    private oauthService: OAuthService,
    private authService: AuthService,
    private cordService: CordService,
    private route: ActivatedRoute
  ) {}

  register = async () => {
    if (!this.model.valid) {
      this.model.markAllAsTouched();
      return false;
    }

    const { email, name, password, confirmPassword, captcha } = this.model.value;
    if (password !== confirmPassword) {
      this.model.get('password')!.setErrors({ message: 'registration.password_no_match' });
      return false;
    }

    try {
      await this.cordService.createUser(email, password, name, captcha);
      await this.authService.login(email, password);

      window.location.href = this.route.snapshot.queryParams['redirect_url'] ?? '/rooms';
    } catch (e) {
      const error = e as HttpErrorResponse;
      let message = 'registration.problem';

      if (error.status === 400 && error.error?.message === 'captcha') {
        message = 'registration.wrong_captcha';
        this.model.get('captcha')!.reset();
      } else if (error.status === 409) {
        message = 'registration.email_exists';
      }

      this.model.get('email')!.setErrors({ message });
      return false;
    }

    return true;
  };
}
