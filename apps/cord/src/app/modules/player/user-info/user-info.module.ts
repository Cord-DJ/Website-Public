import { NgModule } from '@angular/core';
import { XuiDecagramModule, XuiIconModule, XuiTooltipModule } from 'xui';
import { SharedModule } from '../../shared/shared.module';
import { UserInfoComponent } from './user-info.component';
import { UserInfoDirective } from './user-info.directive';

@NgModule({
  imports: [SharedModule, XuiIconModule, XuiDecagramModule, XuiTooltipModule],
  declarations: [UserInfoComponent, UserInfoDirective],
  exports: [UserInfoComponent, UserInfoDirective]
})
export class UserInfoModule {}
