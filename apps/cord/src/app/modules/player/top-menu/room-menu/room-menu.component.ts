import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CordService, NavigationService } from '../../../../services';
import { CreateRoomDialogComponent } from '../../create-room-dialog/create-room-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { Room } from '../../../../api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'cord-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.scss'],
  host: {
    class: 'hide-scrollbar'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomMenuComponent implements OnInit {
  rooms: Room[] = [];
  // rooms$ = this.cordService.rooms$;

  // public dls: CdkDropList[] = [];

  constructor(
    private cordService: CordService,
    private dialog: Dialog,
    private navService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cordService.rooms$.pipe(untilDestroyed(this)).subscribe(rooms => {
      this.rooms = rooms;
      this.changeDetectorRef.detectChanges();
    });
  }

  onDragStart(room: Room) {
    const idx = this.rooms.findIndex(x => x.id === room.id);
    this.rooms.splice(idx + 1, 0, { id: '0', name: null } as any as Room);
  }

  onDragEnd() {
    this.rooms = this.rooms.filter(x => x.id !== '0');
  }

  onDragDrop(event: any) {
    console.log('dropped', event);
  }

  openSearch() {
    this.navService.openSearch();
  }

  async createRoom() {
    this.dialog.open(CreateRoomDialogComponent, {
      width: '400px',
      height: '60%'
    });
  }

  isSelected(room: Room) {
    return this.cordService.room?.id === room.id;
  }

  firstLetter(name: string | null) {
    return name ? name[0].toUpperCase() : null;
  }
}
