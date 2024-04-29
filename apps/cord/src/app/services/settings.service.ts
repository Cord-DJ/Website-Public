import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { UserSettings, UserStatus } from '../api';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  @LocalStorage _settings: UserSettings = {
    locale: 'en-US',
    notifications: true,
    theme: 'dark',
    volume: 100,
    videoVisible: true,
    status: UserStatus.Online
  };

  private _sub = new BehaviorSubject<UserSettings>(this._settings);

  get settings$() {
    return this._sub.asObservable().pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
  }

  get locale$() {
    return this.settingsObservable(x => x.locale);
  }

  get status$() {
    return this.settingsObservable(x => x.status);
  }

  get settings() {
    return this._sub.value;
  }

  update(settings: Partial<UserSettings>) {
    const newSettings = {
      ...this._sub.value,
      ...settings
    };

    this._sub.next(newSettings);
    this._settings = newSettings;
  }

  private settingsObservable<T>(delegate: (settings: UserSettings) => T) {
    return this._sub.pipe(map(delegate), distinctUntilChanged());
  }
}
