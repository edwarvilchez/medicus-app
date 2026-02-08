import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { PublicBooking } from './components/public-booking/public-booking';
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
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword },
  { path: 'agendar-cita', component: PublicBooking }, // Public booking - no auth required
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
  { 
    path: 'patients', 
    component: Patients, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR', 'NURSE'] }
  },
  { path: 'appointments', component: Appointments, canActivate: [authGuard] },
  { 
    path: 'doctors', 
    component: Doctors, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE'] }
  },
  { 
    path: 'nurses', 
    component: Nurses, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE'] }
  },
  { 
    path: 'staff', 
    component: Staff, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN'] } 
  },
  { 
    path: 'history', 
    component: MedicalHistory, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'DOCTOR', 'NURSE'] }
  },
  { 
    path: 'lab-results', 
    loadComponent: () => import('./components/lab-results/lab-results').then(m => m.LabResults), 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'DOCTOR', 'NURSE'] }
  },
  { 
    path: 'video-call/:id', 
    loadComponent: () => import('./components/video-call/video-call.component').then(m => m.VideoCallComponent), 
    canActivate: [authGuard] 
  },
  { 
    path: 'payments', 
    component: Payments, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'PATIENT'] } 
  },
  { path: '**', redirectTo: 'dashboard' }
];
