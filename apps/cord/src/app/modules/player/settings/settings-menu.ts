import { MenuItem } from 'xui';
import { ProfileComponent } from './profile/profile.component';
import { LanguageComponent } from './language/language.component';

export function createMenu(logout: () => void): MenuItem[] {
  return [
    {
      type: 'category',
      name: 'General'
    },
    {
      type: 'item',
      name: 'Profile',
      component: ProfileComponent
    },
    {
      type: 'item',
      name: 'Language',
      component: LanguageComponent
    },
    // {
    //   type: 'item',
    //   name: 'Room Boosts',
    //   component: RoomBoostsComponent
    // },
    // {
    //   type: 'category',
    //   name: 'Billing'
    // },
    // {
    //   type: 'item',
    //   name: 'Subscription',
    //   component: SubscriptionComponent
    // },
    // {
    //   type: 'category',
    //   name: 'Miscellaneous'
    // },
    {
      type: 'item',
      name: 'Log out',
      critical: true,
      action: logout
    }
  ];
}
