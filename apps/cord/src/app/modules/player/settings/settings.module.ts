import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserInfoModule } from '../user-info/user-info.module';
import { ProfileComponent } from './profile/profile.component';
import { RoomBoostsComponent } from './room-boosts/room-boosts.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { TranslateModule } from '@ngx-translate/core';
import { XuiButtonModule, XuiImageUploadModule, XuiInputModule, XuiRadioListModule } from 'xui';
import { LanguageComponent } from './language/language.component';

@NgModule({
  imports: [
    SharedModule,
    UserInfoModule,
    TranslateModule.forChild(),
    XuiImageUploadModule,
    XuiButtonModule,
    XuiInputModule,
    XuiRadioListModule
  ],
  declarations: [ProfileComponent, RoomBoostsComponent, SubscriptionComponent, LanguageComponent]
})
export class SettingsModule {}
