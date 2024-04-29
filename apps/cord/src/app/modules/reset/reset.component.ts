import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { CordService } from '../../services/cord.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'cord-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetComponent implements OnInit {
  password = new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]);
  token?: string;

  constructor(private cordService: CordService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.fragment.pipe(take(1)).subscribe(fragment => {
      if (fragment) {
        const params = new URLSearchParams(fragment);
        this.token = params.get('token') || undefined;
      }
    });
  }

  async changePassword() {
    if (!this.password.valid) {
      this.password.markAllAsTouched();
      return;
    }

    if (!this.token) {
      return;
    }

    try {
      await this.cordService.resetPassword(this.token, this.password.value);
      await this.router.navigateByUrl('/auth/login');
    } catch (e: any) {
      if (e.status === 404) {
        this.password.setErrors({ message: 'reset_password.invalid_link' });
      }
    }
  }
}
