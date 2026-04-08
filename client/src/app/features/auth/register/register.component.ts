import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, InputTextModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  step = signal<'details' | 'otp'>('details');
  fullName = signal('');
  phone = signal('');
  otp = signal('');
  loading = signal(false);
  error = signal('');

  sendOtp(): void {
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
    this.authService.sendOtp(phoneVal).subscribe({
      next: () => {
        this.step.set('otp');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to send OTP. Please try again.');
        this.loading.set(false);
      },
    });
  }

  verifyOtp(): void {
    const otpVal = this.otp().trim();
    if (otpVal.length !== 6) {
      this.error.set('Please enter a valid 6-digit OTP');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.authService.verifyOtp(this.phone().trim(), otpVal).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error.set('Verification failed. Please try again.');
        this.loading.set(false);
      },
    });
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
