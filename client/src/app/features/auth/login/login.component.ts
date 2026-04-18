import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  step = signal<'phone' | 'otp' | 'profile'>('phone');
  phone = signal('');
  otp = signal('');
  profileName = signal('');
  profileEmail = signal('');
  loading = signal(false);
  error = signal('');

  async sendOtp(): Promise<void> {
    const phoneVal = this.phone().trim();
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
    const result = await this.authStore.verifyOtp(this.phone().trim(), otpVal);
    this.loading.set(false);
    if (result.success) {
      if (result.isNewUser) {
        // New user — capture their name before going to dashboard
        this.error.set('');
        this.step.set('profile');
      } else {
        this.router.navigate(['/clinics/select']);
      }
    } else {
      this.error.set(this.authStore.error() ?? 'Invalid OTP. Please try again.');
    }
  }

  async saveProfile(): Promise<void> {
    const name = this.profileName().trim();
    if (!name) {
      this.error.set('Please enter your full name');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    await this.authStore.updateProfile({
      fullName: name,
      email: this.profileEmail().trim() || undefined,
    });
    this.loading.set(false);
    this.router.navigate(['/clinics/select']);
  }

  onPhoneInput(event: Event): void {
    this.phone.set((event.target as HTMLInputElement).value);
  }

  onOtpInput(event: Event): void {
    this.otp.set((event.target as HTMLInputElement).value);
  }

  onProfileNameInput(event: Event): void {
    this.profileName.set((event.target as HTMLInputElement).value);
  }

  onProfileEmailInput(event: Event): void {
    this.profileEmail.set((event.target as HTMLInputElement).value);
  }
}
