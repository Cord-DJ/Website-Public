import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { PartnershipComponent } from './partnership/partnership.component';
import { HomeComponent } from './home/home.component';
import { XuiButtonModule, XuiContextMenuModule, XuiIconModule } from 'xui';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { DownloadComponent } from './download/download.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { PartnershipRequirementsComponent } from './partnership-requirements/partnership-requirements.component';
import { PartnershipCodeOfConductComponent } from './partnership-code-of-conduct/partnership-code-of-conduct.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      { path: 'download', component: DownloadComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'guidelines', component: GuidelinesComponent },
      { path: 'partnership', component: PartnershipRequirementsComponent },
      { path: 'partnership-code-of-conduct', component: PartnershipCodeOfConductComponent },
      { path: '**', component: HomeComponent }
    ]
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), XuiContextMenuModule, XuiButtonModule, XuiIconModule],
  declarations: [
    LandingPageComponent,
    PartnershipComponent,
    HomeComponent,
    PrivacyComponent,
    TermsComponent,
    DownloadComponent,
    GuidelinesComponent,
    PartnershipRequirementsComponent,
    PartnershipCodeOfConductComponent
  ]
})
export class LandingPageModule {}
