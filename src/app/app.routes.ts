import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
      },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
];
