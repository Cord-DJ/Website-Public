import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LandingPageService {
  constructor(private http: HttpClient) {}

  stats() {
    return lastValueFrom(this.http.get(`${environment.apiEndpoint}/stats/room-count`));
  }
}
