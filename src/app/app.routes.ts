import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { APP_ROUTES } from './routes.constantes';

export const routes: Routes = [
  {
    path: APP_ROUTES.AUTH.LOGIN,
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: APP_ROUTES.AUTH.LOGIN,
    pathMatch: 'full'
  },
  {
    path: APP_ROUTES.DASHBOARD.ROOT,
    canActivate: [AuthGuard],
    children: [
      { 
        path: APP_ROUTES.DASHBOARD.MAIN, 
        component: DashboardComponent 
      },
    ]
  }
];
