import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, CordService } from '../../../services';
import { XuiSnackBar } from 'xui';

@Component({
  selector: 'cord-test-user',
  template: ''
})
export class TestUserComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private cordService: CordService,
    private snackBar: XuiSnackBar,
    private router: Router
  ) {}

  async ngOnInit() {
    const email = `${this.makeString(12)}@test.cord.dj`;
    const password = this.makeString(32);
    const name = this.makeString(8);

    try {
      const response = await this.cordService.createUser(email, password, name, '');
      if (response === 'unauthorized') {
        this.snackBar.open('registration.wrong_captcha');
      } else if (response === 'email exist') {
        this.snackBar.open('registration.email_exists');
      }

      await this.authService.login(email, password);
      this.router.navigateByUrl('/r');
    } catch (e) {
      this.snackBar.open('registration.problem');
    }
  }

  makeString(length: number) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }
}
