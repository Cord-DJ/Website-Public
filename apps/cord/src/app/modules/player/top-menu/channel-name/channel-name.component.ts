import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Permission, Room } from '../../../../api';
import { combineLatest, map } from 'rxjs';
import { CordService, DialogService } from '../../../../services';
import { SettingsComponent, XuiSnackBar } from 'xui';
import { createMenu } from '../../room-settings/room-menu';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'cord-channel-name',
  templateUrl: './channel-name.component.html',
  styleUrls: ['./channel-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [style({ height: 0 }), animate('.2s ease-out', style({ height: '60vh' }))]),
      transition(':leave', [style({ height: '60vh' }), animate('.2s ease-in', style({ height: 0 }))])
    ])
  ]
})
export class ChannelNameComponent {
  menuItems = createMenu(() => this.deleteRoom());
  showInfo = false;
  editMode = false;
  name = new UntypedFormControl();
  description = new UntypedFormControl();

  room$ = this.cordService.room$.pipe(map(x => x as Room));
  hasJoined$ = this.cordService.hasJoined$;
  canEdit$ = this.cordService.hasPermissions(Permission.ManageRoles, Permission.ManageServer);
  canLeave$ = this.room$.pipe(map(x => x?.ownerId !== this.cordService.id));

  ownerName$ = combineLatest([this.room$, this.cordService.users$]).pipe(
    map(([room, users]) => users.find(x => x.id === room?.ownerId)?.name)
  );

  @ViewChild('settings') settings!: SettingsComponent;

  get unsafeHtmlContent() {
    return this.sanitizer.bypassSecurityTrustHtml(this.description.value);
  }

  // @HostListener('document:click', ['$event'])
  // documentClick(event: any) {
  //   console.log('click');
  //   if (!this.elementRef.nativeElement.contains(event.target) && !this.editMode) {
  //     // this.showInfo = false;
  //   }
  // }

  getDecagram(room?: Room) {
    if (room?.isVerified) {
      return 'verified';
    }

    if (room?.isPartnered) {
      return 'partnered';
    }

    if (room?.link === 'home') {
      return 'home';
    }

    return null;
  }

  constructor(
    private snackBar: XuiSnackBar,
    private router: Router,
    private cordService: CordService,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.room$.pipe(untilDestroyed(this)).subscribe(room => {
      if (!this.editMode) {
        this.description.patchValue(room?.description ?? '');
        this.name.patchValue(room?.name);
      }
    });
  }

  joinRoom(event: any) {
    event.stopPropagation();
    this.dialogService.ensureAuthenticated();
    this.cordService.room?.addMember();
  }

  leaveRoom() {
    this.cordService.room?.removeMember();
  }

  reportRaid() {
    alert('Raid reported successfully');
  }

  edit() {
    this.editMode = true;
  }

  cancel() {
    if (this.editMode) {
      if (confirm('Do you wanna exit without saving?')) {
        this.editMode = false;
        this.description.patchValue(this.cordService.room?.description ?? '');
      }
    } else {
      this.showInfo = false;
    }
  }

  openSettings() {
    this.settings.open();
  }

  save = async () => {
    try {
      await this.cordService.room?.update({
        name: this.name.value,
        description: this.description.value
      });
    } catch {
      this.changeDetectorRef.markForCheck();
      return false;
    }

    this.editMode = false;
    this.changeDetectorRef.markForCheck();
    return true;
  };

  async deleteRoom() {
    if (confirm('Do you want to permanently delete your room?')) {
      await this.cordService.room?.delete();

      this.snackBar.open('Room has been deleted');
      await this.router.navigateByUrl('/rooms');
    }
  }
}
