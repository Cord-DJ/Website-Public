import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { CordService, DialogService, MenuService } from '../../../services';

@Component({
  selector: 'cord-right-top-menu',
  templateUrl: './right-top-menu.component.html',
  styleUrls: ['./right-top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightTopMenuComponent {
  activePage$ = this.menuService.activePage$;
  userCount$ = this.cordService.onlineUsers$.pipe(map(x => x?.length));

  totalQueue$ = this.cordService.queue$.pipe(map(x => x?.length));
  queuePosition$ = this.cordService.queue$.pipe(
    map(x => {
      const idx = x?.findIndex(y => y.id === this.cordService.id);
      return idx && idx !== -1 ? idx + 1 : '-';
    })
  );

  constructor(
    private cordService: CordService,
    private menuService: MenuService,
    private dialogService: DialogService
  ) {}

  open(page: string) {
    if (page === 'friend-list') {
      this.dialogService.ensureAuthenticated();
    }

    this.menuService.openPage(page);
  }
}
