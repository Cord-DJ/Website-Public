import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  volume$ = this.settings.settings$.pipe(map(x => x.volume));

  get volume() {
    return this.settings.settings.volume;
  }

  setVolume(volume: number) {
    this.settings.update({ volume });
  }

  constructor(private http: HttpClient, private settings: SettingsService) {}

  search(query: string) {
    return lastValueFrom(this.http.get(`${environment.apiEndpoint}/youtube/search?query=${query}`));
  }

  async suggest(pattern: string) {
    let res = await lastValueFrom(
      this.http.get(`${environment.apiEndpoint}/youtube/suggest?pattern=${pattern}`, { responseType: 'text' })
    );
    res = res.replace('window.google.ac.h', 'getData');

    const payload = eval(res);
    return payload[1].map((x: any) => x[0]);
  }
}

// Called from eval()
function getData(data: any) {
  return data;
}
