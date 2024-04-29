import { Component, Inject, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs';
import { CordService } from '../../../../../services';
import { UntypedFormControl } from '@angular/forms';
import { ID, IMember, IRole } from '../../../../../api';
import { combineLatest } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'cord-add-members-dialog',
  templateUrl: './add-members-dialog.component.html',
  styleUrls: ['./add-members-dialog.component.scss']
})
export class AddMembersDialogComponent implements OnInit {
  selectedMembers = new UntypedFormControl();
  searchMembersControl = new UntypedFormControl();

  members$ = combineLatest([
    this.cordService.members$,
    this.searchMembersControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(
      ([members, search]) =>
        members
          ?.filter(member => !this.getMemberRoles(member)?.some(role => role.id === this.role.id))
          ?.filter(member => member.user.name.toLowerCase().includes(search.toLowerCase()))
          ?.map(member => [member?.user?.id, member?.user?.name] as [ID, string]) || []
    )
  );

  getMemberRoles(member: IMember) {
    return this.cordService.room?.getMemberRoles(member);
  }

  constructor(
    @Inject(DIALOG_DATA) private role: IRole,
    private cordService: CordService,
    private dialogRef: DialogRef<AddMembersDialogComponent>
  ) {}

  ngOnInit() {}

  addMembers = async () => {
    console.log('members', this.selectedMembers.value);
    const ids = this.selectedMembers.value;

    if (ids) {
      for (const id of ids) {
        const member = this.cordService.room?.members?.find(x => x.user.id === id);
        await member?.addRole(this.role.id);
      }
    }

    this.close();
    return true;
  };

  close() {
    this.dialogRef.close();
  }
}
