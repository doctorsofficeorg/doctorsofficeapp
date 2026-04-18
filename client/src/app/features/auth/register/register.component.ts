import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, InputTextModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  step = signal<'details' | 'otp'>('details');
  fullName = signal('');
  phone = signal('');
  otp = signal('');
  loading = signal(false);
  error = signal('');

  async sendOtp(): Promise<void> {
    const name = this.fullName().trim();
    const phoneVal = this.phone().trim();
    if (!name) {
      this.error.set('Please enter your full name');
      return;
    }
    if (phoneVal.length !== 10) {
      this.error.set('Please enter a valid 10-digit mobile number');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const result = await this.authStore.sendOtp(phoneVal);
    this.loading.set(false);
    if (result.success) {
      if (result.otp) {
        console.log('[Dev] OTP:', result.otp);
      }
      this.step.set('otp');
    } else {
      this.error.set(result.message);
    }
  }

  async verifyOtp(): Promise<void> {
    const otpVal = this.otp().trim();
    if (otpVal.length !== 6) {
      this.error.set('Please enter a valid 6-digit OTP');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const result = await this.authStore.verifyOtp(this.phone().trim(), otpVal, this.fullName().trim());
    this.loading.set(false);
    if (result.success) {
      this.router.navigate(['/clinics/select']);
    } else {
      this.error.set('Verification failed. Please try again.');
    }
  }

  onNameInput(event: Event): void {
    this.fullName.set((event.target as HTMLInputElement).value);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onOtpInput(event: Event): void {
    this.otp.set((event.target as HTMLInputElement).value);
  }
}
