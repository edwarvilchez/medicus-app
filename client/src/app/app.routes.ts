import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Patients } from './components/patients/patients';
import { Appointments } from './components/appointments/appointments';
import { Doctors } from './components/doctors/doctors';
import { Nurses } from './components/nurses/nurses';
import { Staff } from './components/staff/staff';
import { Payments } from './components/payments/payments';
import { MedicalHistory } from './components/medical-history/medical-history';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]
  },
  { path: 'patients', component: Patients, canActivate: [authGuard] },
  { path: 'appointments', component: Appointments, canActivate: [authGuard] },
  { path: 'doctors', component: Doctors, canActivate: [authGuard] },
  { path: 'nurses', component: Nurses, canActivate: [authGuard] },
  { 
    path: 'staff', 
    component: Staff, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN'] } 
  },
  { path: 'history', component: MedicalHistory, canActivate: [authGuard] },
  { path: 'lab-results', loadComponent: () => import('./components/lab-results/lab-results').then(m => m.LabResults), canActivate: [authGuard] },
  { 
    path: 'payments', 
    component: Payments, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE'] } 
  },
  { path: '**', redirectTo: 'dashboard' }
];
