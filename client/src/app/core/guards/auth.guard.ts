import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Authenticated AND has a clinic membership selected. Use for dashboard pages
 * — users with zero clinics get bounced to the onboarding flow.
 */
export const clinicGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authStore.activeClinicId()) {
    router.navigate(['/clinics/select']);
    return false;
  }

  return true;
};
