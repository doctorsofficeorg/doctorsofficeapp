import { Routes } from '@angular/router';
import { authGuard, clinicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'clinics/select',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clinics/select/clinic-select.component').then(m => m.ClinicSelectComponent),
  },
  {
    path: 'clinics/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clinics/new/clinic-new.component').then(m => m.ClinicNewComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        m => m.DashboardLayoutComponent
      ),
    canActivate: [clinicGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/home/dashboard-home.component').then(
            m => m.DashboardHomeComponent
          ),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/dashboard/schedule/schedule.component').then(
            m => m.ScheduleComponent
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/dashboard/patients/patients.component').then(
            m => m.PatientsComponent
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/dashboard/appointments/appointments.component').then(
            m => m.AppointmentsComponent
          ),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./features/dashboard/prescriptions/prescriptions.component').then(
            m => m.PrescriptionsComponent
          ),
      },
      {
        path: 'billing',
        loadComponent: () =>
          import('./features/dashboard/billing/billing.component').then(
            m => m.BillingComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboard/settings/settings.component').then(
            m => m.SettingsComponent
          ),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./features/dashboard/team/team.component').then(
            m => m.TeamComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
