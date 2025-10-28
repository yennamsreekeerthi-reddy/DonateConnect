import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'donor',
    canActivate: [roleGuard],
    data: { roles: ['DONOR'] },
    loadComponent: () => import('./pages/donor-dashboard/donor-dashboard.component').then(m => m.DonorDashboardComponent)
  },
  {
    path: 'ngo',
    canActivate: [roleGuard],
    data: { roles: ['NGO'] },
    loadComponent: () => import('./pages/ngo-dashboard/ngo-dashboard.component').then(m => m.NgoDashboardComponent)
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'nearby-ngos',
    loadComponent: () => import('./pages/nearby-ngos/nearby-ngos.component').then(m => m.NearbyNgosComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
