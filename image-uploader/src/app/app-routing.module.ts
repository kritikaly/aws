import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaurdGuard } from './auth/gaurd.guard';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeFeedComponent } from './components/home-feed/home-feed.component';
import { LoginComponent } from './components/login/login.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeFeedComponent,
    canActivate: [GaurdGuard]
  },
  {
    path: 'userDetails',
    component: UserDetailsComponent,
    canActivate: [GaurdGuard]
  },
  {
    path: 'explore',
    component: ExploreComponent,
    canActivate: [GaurdGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
