import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { IMember, IRole, ID } from '../../../api';
import { CordService } from '../../../services';

@Component({
  selector: 'cord-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'x-scrollbar-thin scrollbar-thin-primary'
  }
})
export class UserListComponent {
  anonymousCount$ = this.cordService.onlineUsers$.pipe(map(x => x?.filter(x => x.user).length));

  roles$ = combineLatest([
    this.cordService.roles$,
    this.cordService.members$,
    this.cordService.onlineUsers$,
    this.cordService.currentSong$.pipe(startWith(null))
  ]).pipe(
    map(([roles, members, onlineUsers, currentSong]) => {
      if (!roles || !members || !onlineUsers) {
        return [];
      }

      const obj = roles.reduce((obj: any, value: IRole) => {
        obj[value.id] = <IRoleGroup>{
          name: value.name,
          position: value.position,
          members: []
        };

        return obj;
      }, {});

      const offline = [];
      for (const member of members) {
        if (onlineUsers.some(o => o.id === member.user.id)) {
          const role = this.cordService.room?.getMemberPrimaryRole(member);

          if (role) {
            obj[role.id].members.push({
              ...member,
              vote: currentSong?.upvotes.find(y => y === member.user.id)
                ? 'up'
                : currentSong?.downvotes.find(y => y === member.user.id)
                ? 'down'
                : null,
              steal: currentSong?.steals.find(y => y === member.user.id)
            });
          }
        } else {
          offline.push(member);
        }
      }

      const groups = [
        ...(Object.values(obj) as IRoleGroup[]).sort((a, b) => b.position - a.position),
        <IRoleGroup>{
          name: 'Offline',
          members: offline
        }
      ];

      return groups.filter(x => x.members.length);
    })
  );

  getUserColor(userId: ID) {
    return this.cordService.getUserPrimaryRole(userId).pipe(map(x => x?.color ?? 'white'));
  }

  constructor(private cordService: CordService) {}
}

interface IMemberWithVotes extends IMember {
  vote: string;
  steal: boolean;
}

interface IRoleGroup {
  name: string;
  position: number;
  members: IMemberWithVotes[];
}
