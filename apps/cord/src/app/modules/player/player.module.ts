import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { FooterComponent } from './footer/footer.component';
import { ChannelNameComponent } from './top-menu/channel-name/channel-name.component';
import { CurrentSongComponent } from './top-menu/current-song/current-song.component';
import { ControlsComponent } from './dashboard/controls/controls.component';
import { ChatComponent } from './chat/chat.component';
import { UserListComponent } from './user-list/user-list.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { PlaylistDialogComponent } from './playlist-dialog/playlist-dialog.component';
import { QueueListComponent } from './queue-list/queue-list.component';
import { SharedModule } from '../shared/shared.module';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { RouterModule, Routes } from '@angular/router';
import { EmojiPickerComponent } from './chat/emoji-picker/emoji-picker.component';
import { AvatarDialogComponent } from './avatar-dialog/avatar-dialog.component';
import { MessageComponent } from './chat/message/message.component';
import { SettingsModule } from './settings/settings.module';
import { RoomMenuComponent } from './top-menu/room-menu/room-menu.component';
import { UserInfoModule } from './user-info/user-info.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { RoomSettingsModule } from './room-settings/room-settings.module';
import { TranslateModule } from '@ngx-translate/core';
import { RightTopMenuComponent } from './right-top-menu/right-top-menu.component';
import { RightBottomMenuComponent } from './right-bottom-menu/right-bottom-menu.component';
import { SongHistoryComponent } from './top-menu/song-history/song-history.component';
import { ImportDialogComponent } from './playlist-dialog/import-dialog/import-dialog.component';
import { CreateRoomDialogComponent } from './create-room-dialog/create-room-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { HomeComponent } from './home.component';
import { RoomListComponent } from './room-list/room-list.component';
import { SlotComponent } from './avatar-dialog/slot/slot.component';
import {
  XuiButtonModule,
  XuiContextMenuModule,
  XuiIconModule,
  XuiImageUploadModule,
  XuiInputModule,
  XuiTabModule,
  XuiSettingsModule,
  XuiDecagramModule,
  XuiSnackbarModule,
  XuiTooltipModule,
  XuiSliderModule,
  XuiSelectModule,
  XuiSpinnerModule,
  XuiToggleModule,
  XuiDividerModule,
  XuiStatusModule
} from 'xui';
import { UserContextMenuComponent } from './user-context-menu/user-context-menu.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AvatarComponent } from './avatar/avatar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RendererComponent } from './dashboard/renderer/renderer.component';

const routes: Routes = [
  {
    path: ':id',
    component: PlayerComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    YouTubePlayerModule,
    RouterModule.forChild(routes),
    SettingsModule,
    RoomSettingsModule,
    UserInfoModule,
    EditorModule,
    TranslateModule.forChild(),

    XuiButtonModule,
    XuiInputModule,
    XuiContextMenuModule,
    XuiIconModule,
    XuiSettingsModule,
    XuiImageUploadModule,
    XuiTabModule,
    XuiDecagramModule,
    XuiSnackbarModule,
    XuiTooltipModule,
    XuiSliderModule,
    XuiSelectModule,
    XuiSpinnerModule,
    XuiToggleModule,
    XuiDividerModule,
    XuiStatusModule
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    TopMenuComponent,
    SongHistoryComponent,
    FooterComponent,
    ChannelNameComponent,
    CurrentSongComponent,
    ControlsComponent,
    ChatComponent,
    MessageComponent,
    UserListComponent,
    FriendListComponent,
    PlaylistDialogComponent,
    QueueListComponent,
    PlayerComponent,
    EmojiPickerComponent,
    AvatarDialogComponent,
    RoomMenuComponent,
    RightTopMenuComponent,
    RightBottomMenuComponent,
    ImportDialogComponent,
    CreateRoomDialogComponent,
    ChangePasswordDialogComponent,
    RoomListComponent,

    SlotComponent,
    UserContextMenuComponent,
    AvatarComponent,
    UserProfileComponent,
    RendererComponent
  ],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }]
})
export class PlayerModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('pants', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pants.svg'));
    iconRegistry.addSvgIcon('cape', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cape.svg'));
    iconRegistry.addSvgIcon('skin', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/skin.svg'));
    iconRegistry.addSvgIcon('hairstyle', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/hairstyle.svg'));
    iconRegistry.addSvgIcon('shoulders', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shoulders.svg'));
    iconRegistry.addSvgIcon('belt', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/belt.svg'));
    iconRegistry.addSvgIcon('bracelet', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bracelet.svg'));
    iconRegistry.addSvgIcon('mustache', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/mustache.svg'));
    iconRegistry.addSvgIcon('gloves', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/gloves.svg'));
    iconRegistry.addSvgIcon('chest-plate', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/chest_plate.svg'));
  }
}
