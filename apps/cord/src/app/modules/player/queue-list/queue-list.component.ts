import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { ID, IMember, Permission, User } from '../../../api';
import { CordService } from '../../../services';

@Component({
  selector: 'cord-queue-list',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'x-scrollbar-thin scrollbar-thin-primary'
  }
})
export class QueueListComponent {
  users$ = this.cordService.queue$;
  canReorder$ = this.cordService.hasPermissions(Permission.ManageQueue);

  constructor(private cordService: CordService) {}

  getUserColor(userId: ID) {
    return this.cordService.getUserPrimaryRole(userId).pipe(map(x => x?.color ?? 'white'));
  }

  getMember(userId: ID) {
    return this.cordService.room?.members?.find(x => x.user.id === userId) as IMember;
  }

  drop(users: User[], event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const ids = users.map(x => x.id);
    moveItemInArray(ids, event.previousIndex, event.currentIndex);

    this.cordService.room?.reorderQueue(ids);
  }
}
