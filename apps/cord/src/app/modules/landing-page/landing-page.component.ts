import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { plainToInstance } from 'class-transformer';
import { User } from '../../api';

@Component({
  selector: 'cord-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent implements OnInit {
  userInfo$ = new Subject<User | null>();

  constructor(private oauth: OAuthService, private http: HttpClient) {}

  async ngOnInit() {
    if (this.oauth.hasValidAccessToken()) {
      await this.fetchUserInfo();
    }
  }

  async fetchUserInfo() {
    const response = await lastValueFrom(this.http.get(`${environment.apiEndpoint}/users/@me`));
    const user = plainToInstance(User, response);
    this.userInfo$.next(user);
  }

  logout() {
    this.oauth.logOut();
    this.userInfo$.next(null);
  }
}
