import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserInfoModule } from '../user-info/user-info.module';
import { EmojiComponent } from './emoji/emoji.component';
import { OverviewComponent } from './overview/overview.component';
import { RolesComponent } from './roles/roles.component';
import { StickersComponent } from './stickers/stickers.component';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { BannedComponent } from './banned/banned.component';
import { MutedComponent } from './muted/muted.component';
import { AddMembersDialogComponent } from './roles/add-members-dialog/add-members-dialog.component';
import {
  XuiButtonModule,
  XuiContextMenuModule,
  XuiIconModule,
  XuiImageUploadModule,
  XuiInputModule,
  XuiSwitchModule,
  XuiTabModule
} from 'xui';

@NgModule({
  imports: [
    SharedModule,
    UserInfoModule,
    TranslateModule.forChild(),
    ColorPickerModule,
    XuiInputModule,
    XuiImageUploadModule,
    XuiButtonModule,
    XuiContextMenuModule,
    XuiSwitchModule,
    XuiIconModule,
    XuiTabModule
  ],
  declarations: [
    OverviewComponent,
    RolesComponent,
    EmojiComponent,
    StickersComponent,
    BannedComponent,
    MutedComponent,
    AddMembersDialogComponent
  ]
})
export class RoomSettingsModule {}
