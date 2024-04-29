import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'cord-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent {
  captcha = new UntypedFormControl(null, Validators.required);
  errorLinkIsNotValid = false;

  get hasCaptchaError(): boolean {
    const control = this.captcha;

    const { dirty, touched } = control;
    return control.invalid ? dirty! || touched! : false;
  }

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  async verifyEmail() {
    if (!this.captcha.valid) {
      this.captcha.markAllAsTouched();
      return;
    }

    const params = new URLSearchParams(this.route.snapshot.fragment ?? '');
    const token = params.get('token');
    if (!token) {
      return;
    }

    try {
      await this.authService.verify(token, this.captcha.value);
      await this.router.navigateByUrl('/rooms');
    } catch (e: any) {
      if (e.status === 404) {
        this.errorLinkIsNotValid = true;
      }
    }
  }
}
