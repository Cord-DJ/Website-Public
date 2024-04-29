import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  get locale() {
    return this.settings.settings.locale;
  }

  constructor(private translate: TranslateService, private settings: SettingsService) {
    translate.addLangs([
      'en-US',
      'de-DE',
      'sk-SK',
      'cs-CZ',
      'lt-LT',
      'et-EE',
      'hu-HU',
      'hr-HR',
      'es-ES',
      'ja-JP',
      'pt-BR'
    ]);
    translate.setDefaultLang('en-US');

    settings.locale$.subscribe(locale => this.setLanguage(locale));

    this.setLanguage(this.locale ?? this.translate.getBrowserCultureLang() ?? null);
    console.log('browser language', navigator.languages, this.translate.getBrowserCultureLang());
  }

  setLanguage(locale: string | null) {
    if (locale && this.translate.langs.includes(locale)) {
      this.translate.use(locale);
      this.settings.update({ locale });
    }
  }
}
