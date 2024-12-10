import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { UserProfileComponent } from './features/profile/user-profile/user-profile.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'profile', 
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: '', 
    redirectTo: 'profile', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'profile' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }