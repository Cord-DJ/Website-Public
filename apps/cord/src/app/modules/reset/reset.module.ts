import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ResetComponent } from './reset.component';
import { TranslateModule } from '@ngx-translate/core';
import { XuiButtonModule, XuiInputModule } from 'xui';

const routes: Routes = [
  {
    path: '',
    component: ResetComponent
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), TranslateModule.forChild(), XuiInputModule, XuiButtonModule],
  declarations: [ResetComponent]
})
export class ResetModule {}
