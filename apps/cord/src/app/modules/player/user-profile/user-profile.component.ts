import { Component } from '@angular/core';
import { CordService } from '../../../services';

@Component({
  selector: 'cord-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  me$ = this.cordService.me$;

  constructor(private cordService: CordService) {}
}
