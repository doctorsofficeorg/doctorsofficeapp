import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthStore } from '../../../core/stores/auth.store';
import { ThemeService } from '../../../core/services/theme.service';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

@Component({
  selector: 'app-clinic-new',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputTextModule, ButtonModule, SelectModule, SelectButtonModule],
  templateUrl: './clinic-new.component.html',
  styleUrl: './clinic-new.component.scss',
})
export class ClinicNewComponent {
  private authStore = inject(AuthStore);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  stateOptions = INDIAN_STATES.map(s => ({ label: s, value: s }));
  themeOptions = [
    { label: 'Light', value: 'light' as const },
    { label: 'Dark', value: 'dark' as const },
  ];

  name = signal('');
  phone = signal('');
  email = signal('');
  gstin = signal('');
  address = signal('');
  city = signal('');
  state = signal('');
  pincode = signal('');

  primaryColor = signal('#0d9488');
  secondaryColor = signal('#6366f1');
  accentColor = signal('#f59e0b');
  theme = signal<'light' | 'dark'>('light');

  loading = signal(false);
  error = signal('');

  hasExistingClinics = computed(() => this.authStore.clinics().length > 0);

  canSubmit = computed(() =>
    this.name().trim().length > 1 &&
    /^\+?\d{10,15}$/.test(this.phone().trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()) &&
    this.address().trim().length > 2 &&
    this.city().trim().length > 1 &&
    this.state().trim().length > 1 &&
    /^\d{6}$/.test(this.pincode().trim()),
  );

  async submit(): Promise<void> {
    if (!this.canSubmit() || this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    const phoneVal = this.phone().trim();
    const normalizedPhone = phoneVal.startsWith('+') ? phoneVal : `+91${phoneVal}`;

    const res = await this.authStore.createClinic({
      name: this.name().trim(),
      phone: normalizedPhone,
      email: this.email().trim(),
      address: this.address().trim(),
      city: this.city().trim(),
      state: this.state().trim(),
      pincode: this.pincode().trim(),
      gstin: this.gstin().trim() || undefined,
      branding: {
        primaryColor: this.primaryColor(),
        secondaryColor: this.secondaryColor(),
        accentColor: this.accentColor(),
        theme: this.theme(),
      },
    });

    if (!res.success || !res.clinicId) {
      this.loading.set(false);
      this.error.set(res.error ?? 'Failed to create clinic. Please try again.');
      return;
    }

    const switched = await this.authStore.switchClinic(res.clinicId);
    this.themeService.setTheme(this.theme());
    this.loading.set(false);

    if (switched) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Clinic created but could not switch to it. Please pick it from the list.');
      this.router.navigate(['/clinics/select']);
    }
  }

  cancel(): void {
    if (this.hasExistingClinics()) {
      this.router.navigate(['/clinics/select']);
    } else {
      this.authStore.logout();
    }
  }
}
