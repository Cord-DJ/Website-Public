import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(x => x.AdminModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./modules/verify/verify.module').then(x => x.VerifyModule)
  },
  {
    path: 'reset',
    loadChildren: () => import('./modules/reset/reset.module').then(x => x.ResetModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(x => x.AuthenticationModule)
  },
  {
    path: 'r',
    loadChildren: () => import('./modules/player/player.module').then(x => x.PlayerModule)
  },
  { path: 'room', redirectTo: 'r' },
  { path: 'rooms', redirectTo: 'r' },
  {
    path: '',
    loadChildren: () => import('./modules/landing-page/landing-page.module').then(x => x.LandingPageModule)
    // redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
