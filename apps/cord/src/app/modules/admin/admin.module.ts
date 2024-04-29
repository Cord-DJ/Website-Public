import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { FetchService, PrometheusFetchService } from './services/fetch.service';
import { XuiCardModule, XuiLayoutModule } from 'xui';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    XuiLayoutModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    XuiCardModule
  ],
  providers: [{ provide: FetchService, useClass: PrometheusFetchService }]
})
export class AdminModule {}
