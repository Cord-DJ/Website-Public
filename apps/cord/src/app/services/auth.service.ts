import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return lastValueFrom(
      this.http.post<string>(`${environment.authEndpoint}/login`, {
        email,
        password
      })
    );
  }

  getData(returnUrl: string) {
    return lastValueFrom(
      this.http.post<string>(`${environment.authEndpoint}/get-data`, {
        returnUrl
      })
    );
  }

  verify(code: string, captcha: string) {
    return lastValueFrom(
      this.http.post<string>(`${environment.apiEndpoint}/verification`, {
        code,
        captcha
      })
    );
  }

  getVerified() {
    return lastValueFrom(this.http.get<number>(`${environment.apiEndpoint}/verification/@me`));
  }

  createEmailVerification() {
    return lastValueFrom(this.http.post(`${environment.apiEndpoint}/verification/create`, {}));
  }

  // fetchToken(code: string) {
  //   const params = new URLSearchParams();
  //   params.set('client_id', 'cord-dj-client');
  //   params.set('grant_type', 'authorization_code');
  //   params.set('code', code);
  //   params.set('redirect_uri', 'https://cord.local/rooms');
  //
  //   let options = {
  //     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  //   };
  //
  //   return lastValueFrom(
  //     this.http.post<string>(`${environment.authEndpoint}/connect/token`, params, options)
  //   );
  // }
}
