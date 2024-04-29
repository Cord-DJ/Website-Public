import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CordService } from '../../../services';
import { IUser, Permission } from '../../../api';
import { ContextMenuComponent } from 'xui';

@Component({
  selector: 'cord-user-context-menu',
  templateUrl: './user-context-menu.component.html',
  styleUrls: ['./user-context-menu.component.scss']
})
export class UserContextMenuComponent implements OnInit {
  @Input() info?: IUser;

  @ViewChild('menu') public menu!: ContextMenuComponent;

  isInQueue = false;

  canManageQueue$ = this.cordService.hasPermissions(Permission.ManageQueue);
  canKick$ = this.cordService.hasPermissions(Permission.Kick);
  canBan$ = this.cordService.hasPermissions(Permission.Ban);
  canMute$ = this.cordService.hasPermissions(Permission.Mute);

  constructor(private cordService: CordService) {}

  ngOnInit(): void {
    if (this.info) {
      this.isInQueue = this.cordService.room?.isUserInQueue(this.info) ?? false;
    }
  }

  mute(time: number) {
    if (this.info) {
      this.cordService.room?.mute(this.info, time);
    }
  }

  kick() {
    if (this.info) {
      this.cordService.room?.kick(this.info);
    }
  }

  ban(time: number) {
    if (this.info) {
      this.cordService.room?.ban(this.info, time);
    }
  }

  removeFromQueue() {
    if (this.info) {
      this.cordService.room?.removeFromQueue(this.info);
    }
  }
}
