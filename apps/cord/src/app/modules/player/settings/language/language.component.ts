import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LanguageService } from '../../../../services';

@Component({
  selector: 'cord-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {
  selected = new FormControl();

  languages: Language[] = [
    {
      local: 'Čeština',
      name: 'Czech',
      flag: 'CZ',
      value: 'cs-CZ'
    },
    {
      local: 'Deutch',
      name: 'German',
      flag: 'DE',
      value: 'de-DE'
    },
    {
      local: 'Eesti',
      name: 'Estonian',
      flag: 'EE',
      value: 'et-EE'
    },
    {
      local: 'English',
      name: 'English, US',
      flag: 'US',
      value: 'en-US'
    },
    {
      local: 'Español',
      name: 'Spanish',
      flag: 'ES',
      value: 'es-ES'
    },
    {
      local: 'Croatian',
      name: 'Hrvatski',
      flag: 'HR',
      value: 'hr-HR'
    },
    {
      local: 'Lietuva',
      name: 'Lithuanian',
      flag: 'LT',
      value: 'lt-LT'
    },
    {
      local: 'Português do Brasil',
      name: 'Portuguese, Brazilian',
      flag: 'BR',
      value: 'pt-BR'
    },
    {
      local: 'Slovenčina',
      name: 'Slovak',
      flag: 'SK',
      value: 'sk-SK'
    },
    {
      local: '日本語',
      name: 'Japanese',
      flag: 'JP',
      value: 'ja-JP'
    }
  ];

  constructor(private langService: LanguageService) {}

  ngOnInit(): void {
    this.selected.setValue(this.langService.locale);
    this.selected.valueChanges.subscribe(value => {
      this.langService.setLanguage(value);
    });
  }
}

interface Language {
  local: string;
  name: string;
  flag: string;
  value: string;
}
