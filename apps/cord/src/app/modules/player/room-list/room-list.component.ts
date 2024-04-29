import { ApplicationRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, first, interval } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Room } from '../../../api';
import { CordService, NavigationService } from '../../../services';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'cord-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListComponent implements OnInit {
  rooms$ = new BehaviorSubject<Room[]>([]);

  constructor(
    private cordService: CordService,
    private appRef: ApplicationRef,
    private navService: NavigationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appRef.isStable.pipe(first(x => x)).subscribe(() => {
      interval(30000)
        .pipe(untilDestroyed(this))
        .subscribe(() => this.loadRooms());
    });

    return this.loadRooms();
  }

  private async loadRooms() {
    const rooms = await this.cordService.getPopularRooms();

    this.rooms$.next(
      rooms.sort(
        (a, b) =>
          (b?.isPartnered ? 1 : 0) - (a?.isPartnered ? 1 : 0) ||
          (b?.isVerified ? 1 : 0) - (a?.isVerified ? 1 : 0) ||
          (b?.onlineCount ?? 0) - (a?.onlineCount ?? 0) ||
          (b?.memberCount ?? 0) - (a?.memberCount ?? 0)
      )
    );

    this.appRef.tick();
  }

  async goToRoom(room: Room) {
    await this.router.navigateByUrl(`/r/${room.link}`);
    this.navService.closeSearch();
  }

  close() {
    this.navService.closeSearch();
  }
}
