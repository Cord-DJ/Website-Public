import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getUserPlaylists(userId: string) {
    return lastValueFrom(
      this.http.get<{ id: string; name: string }[]>(`${environment.apiEndpoint}/spotify/user/${userId}`)
    );
  }
}
