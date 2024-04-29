import { OverviewComponent } from './overview/overview.component';
import { RolesComponent } from './roles/roles.component';
import { BannedComponent } from './banned/banned.component';
import { MutedComponent } from './muted/muted.component';
import { MenuItem } from 'xui';

export function createMenu(deleteRoom: () => Promise<void>): MenuItem[] {
  return [
    {
      type: 'category',
      name: 'room_settings.general'
    },
    {
      type: 'item',
      name: 'room_settings.overview',
      component: OverviewComponent
    },
    {
      type: 'item',
      name: 'room_settings.roles',
      component: RolesComponent
    },
    // {
    //   type: 'category',
    //   name: 'room_settings.assets'
    // },
    // {
    //   type: 'item',
    //   name: 'room_settings.emoji',
    //   component: EmojiComponent
    // },
    // {
    //   type: 'item',
    //   name: 'room_settings.stickers',
    //   component: StickersComponent
    // },
    {
      type: 'divider'
    },
    {
      type: 'category',
      name: 'room_settings.misc'
    },
    {
      type: 'item',
      name: 'room_settings.banned_users',
      component: BannedComponent
    },
    {
      type: 'item',
      name: 'room_settings.muted_users',
      component: MutedComponent
    },
    {
      type: 'item',
      name: 'room_settings.delete_room',
      critical: true,
      action: deleteRoom
    }
  ];
}
