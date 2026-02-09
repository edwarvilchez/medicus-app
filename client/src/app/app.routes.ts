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
import { VideoHistory } from './components/video-history/video-history';
import { BulkData } from './components/bulk-data/bulk-data';
import { TeamComponent } from './components/team/team.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'Medicus - Iniciar Sesión' },
  { path: 'register', component: Register, title: 'Medicus - Registro de Pacientes' },
  { path: 'forgot-password', component: ForgotPassword, title: 'Medicus - Recuperar Contraseña' },
  { path: 'reset-password/:token', component: ResetPassword, title: 'Medicus - Restablecer Contraseña' },
  { path: 'agendar-cita', component: PublicBooking, title: 'Medicus - Agendar Cita' }, // Public booking - no auth required
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard],
    title: 'Medicus - Panel Principal'
  },
  { 
    path: 'patients', 
    component: Patients, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR', 'NURSE'] },
    title: 'Medicus - Gestión de Pacientes'
  },
  { path: 'appointments', component: Appointments, canActivate: [authGuard], title: 'Medicus - Gestión de Citas' },
  { 
    path: 'video-history', 
    component: VideoHistory, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR'] },
    title: 'Medicus - Historial de Videoconsultas'
  },
  { 
    path: 'doctors', 
    component: Doctors, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE'] },
    title: 'Medicus - Gestión de Doctores'
  },
  { 
    path: 'nurses', 
    component: Nurses, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE'] },
    title: 'Medicus - Gestión de Enfermeras'
  },
  { 
    path: 'staff', 
    component: Staff, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN'] },
    title: 'Medicus - Personal Administrativo'
  },
  { 
    path: 'history', 
    component: MedicalHistory, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'DOCTOR', 'NURSE'] },
    title: 'Medicus - Historial Médico'
  },
  { 
    path: 'lab-results', 
    loadComponent: () => import('./components/lab-results/lab-results').then(m => m.LabResults), 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'DOCTOR', 'NURSE'] },
    title: 'Medicus - Resultados de Laboratorio'
  },
  { 
    path: 'video-call/:id', 
    loadComponent: () => import('./components/video-call/video-call.component').then(m => m.VideoCallComponent), 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SUPERADMIN', 'DOCTOR', 'PATIENT'] },
    title: 'Medicus - Videoconsulta'
  },
  { 
    path: 'payments', 
    component: Payments, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'PATIENT'] },
    title: 'Medicus - Control de Pagos'
  },
  { 
    path: 'bulk-import', 
    component: BulkData, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN'] },
    title: 'Medicus - Carga Masiva'
  },
  { 
    path: 'team', 
    component: TeamComponent, 
    canActivate: [authGuard, roleGuard], 
    data: { roles: ['SUPERADMIN', 'ADMINISTRATIVE', 'DOCTOR'] },
    title: 'Medicus - Gestión de Equipo'
  },
  { path: '**', redirectTo: 'dashboard' }
];
