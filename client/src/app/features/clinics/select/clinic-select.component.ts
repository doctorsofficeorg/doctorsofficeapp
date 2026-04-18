import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-clinic-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
  templateUrl: './clinic-select.component.html',
  styleUrl: './clinic-select.component.scss',
})
export class ClinicSelectComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  clinics = this.authStore.clinics;
  user = this.authStore.user;
  hasClinics = computed(() => this.clinics().length > 0);
  busyId = signal<string | null>(null);

  firstName = computed(() => {
    const name = (this.user()?.fullName ?? 'there').trim();
    const parts = name.split(/\s+/);
    // Skip common honorifics so "Dr. Priya Sharma" greets as "Priya".
    const titleRx = /^(dr|dr\.|mr|mr\.|mrs|mrs\.|ms|ms\.|miss|prof|prof\.)$/i;
    const first = parts.find(p => !titleRx.test(p));
    return first ?? parts[0] ?? 'there';
  });

  initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      owner: 'Owner',
      doctor: 'Doctor',
      nurse: 'Nurse',
      lab_tech: 'Lab Tech',
      front_desk: 'Front Desk',
    };
    return map[role] ?? role;
  }

  async openClinic(clinicId: string): Promise<void> {
    this.busyId.set(clinicId);
    const ok = await this.authStore.switchClinic(clinicId);
    this.busyId.set(null);
    if (ok) this.router.navigate(['/dashboard']);
  }

  createClinic(): void {
    this.router.navigate(['/clinics/new']);
  }

  signOut(): void {
    this.authStore.logout();
  }
}
