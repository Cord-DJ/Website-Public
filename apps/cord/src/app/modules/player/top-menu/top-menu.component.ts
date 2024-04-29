import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalStorage } from '../../../services';

@Component({
  selector: 'cord-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent {
  @LocalStorage closedMenu = false;
}
