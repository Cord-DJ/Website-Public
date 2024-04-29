import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LocalStorage, NavigationService } from '../../services';

@Component({
  selector: 'cord-home',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  @LocalStorage lastRoom?: string;

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    return this.navigationService.goToLastOrDefault();
  }
}
