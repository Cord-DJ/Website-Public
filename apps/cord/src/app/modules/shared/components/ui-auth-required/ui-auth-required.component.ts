import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-auth-required',
  templateUrl: './ui-auth-required.component.html',
  styleUrls: ['./ui-auth-required.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthRequiredComponent {}
