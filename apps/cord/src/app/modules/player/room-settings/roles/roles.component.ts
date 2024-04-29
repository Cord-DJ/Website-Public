import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { permissions } from './permission-translations';
import { UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CordService } from '../../../../services';
import { IRole, ID, IMember, EveryoneId, Permission } from '../../../../api';
import { BehaviorSubject } from 'rxjs';
import { AddMembersDialogComponent } from './add-members-dialog/add-members-dialog.component';
import { SettingsPage, XuiSnackBar } from 'xui';
import { Dialog } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'cord-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements SettingsPage, OnInit {
  stateChanged!: (state: boolean) => void;
  roles: IRole[] = [];
  dirtyRoles: ID[] = [];
  activeIdx = 0;
  activeRole$ = new BehaviorSubject<IRole>(this.activeRole);

  permissions = permissions;
  members: IMember[] = [];
  searchMembersControl = new UntypedFormControl();

  myPos!: number;

  get roleMembers() {
    const members = this.cordService.room?.getRoleMembers(this.activeRole) as IMember[];
    const search = this.searchMembersControl.value || '';

    return members.filter(x => x.user.name.toLowerCase().includes(search.toLowerCase()));
  }

  get activeRole() {
    return this.roles[this.activeIdx];
  }

  get isEveryoneSelected() {
    return this.activeRole.id == EveryoneId;
  }

  private get isOwnerOrAdmin() {
    return this.cordService.me.isStaff || this.cordService.room?.ownerId === this.cordService.me.id;
  }

  get canEditActiveRole() {
    return !this.isEveryoneSelected && (this.canEditRole(this.activeRole) || this.isOwnerOrAdmin);
  }

  get canEditActiveRoleIncludeEveryone() {
    return this.canEditRole(this.activeRole) || this.isOwnerOrAdmin;
  }

  hasPermission(flag: Permission) {
    if (!this.activeRole || !this.activeRole.permissions) {
      return false;
    }

    return (this.activeRole.permissions & flag) === flag;
  }

  canEditRole(role: IRole) {
    return this.isOwnerOrAdmin || role.position < this.myPos;
  }

  constructor(
    private cordService: CordService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: Dialog,
    private snackBar: XuiSnackBar
  ) {}

  async ngOnInit() {
    await this.reset();

    const meMem = this.cordService.room?.members?.find(x => x.user.id === this.cordService.me.id);
    this.myPos = this.cordService.room?.getMemberPrimaryRole(meMem!)?.position!;

    this.cordService.members$.pipe(untilDestroyed(this)).subscribe(x => {
      if (x) {
        this.members = x;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  removeMember(member: IMember) {
    return member.removeRole(this.activeRole.id);
  }

  async save() {
    // TODO: implement reorder savings

    for (const id of this.dirtyRoles) {
      const role = this.roles.find(x => x.id === id);
      if (role) {
        await this.cordService.room?.updateRole(role, {
          name: role.name,
          color: role.color,
          permissions: role.permissions
        });
      }
    }

    this.snackBar.open('Roles has been saved successfully');
    return true;
  }

  async reset() {
    this.dirtyRoles = [];
    this.roles = JSON.parse(JSON.stringify(this.cordService.room?.roles?.sort((a, b) => b.position - a.position)));

    this.changeDetectorRef.markForCheck();
    return true;
  }

  selectRole(idx: number) {
    this.activeIdx = idx;
    this.activeRole$.next(this.activeRole);
  }

  changePermission(flag: Permission) {
    if (this.activeRole.permissions === undefined) {
      return;
    }

    if (this.hasPermission(flag)) {
      this.activeRole.permissions &= ~flag;
    } else {
      this.activeRole.permissions |= flag;
    }

    this.markAsDirty(this.activeRole.id);
  }

  addMembers() {
    if (!this.canEditActiveRole) {
      return;
    }

    this.dialog.open(AddMembersDialogComponent, {
      width: '500px',
      height: '550px',
      data: this.activeRole
    });
  }

  async addRole() {
    const role = await this.cordService.room?.createRole();
    if (role) {
      const pos = this.roles.length - 1;
      this.roles.splice(pos || 1, 0, role);
    }

    this.changeDetectorRef.markForCheck();
  }

  async deleteRole(role: IRole) {
    if (!confirm('Do you want to delete the role?')) {
      return;
    }

    await this.cordService.room?.deleteRole(role);

    this.roles = this.roles.filter(x => x.id !== role.id);
    this.dirtyRoles = this.dirtyRoles.filter(x => x !== role.id);
    this.changeDetectorRef.markForCheck();
  }

  colorChange(color: string) {
    this.activeRole.color = color;
    this.markAsDirty(this.activeRole.id);
  }

  nameChange(event: any) {
    this.activeRole.name = event.target.value;
    this.markAsDirty(this.activeRole.id);
  }

  private markAsDirty(id: ID) {
    if (!this.dirtyRoles.includes(id)) {
      this.dirtyRoles.push(id);
    }

    this.stateChanged(false);
    this.changeDetectorRef.markForCheck();
  }
}
