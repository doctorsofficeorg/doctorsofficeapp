import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Doctor } from '../models';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'do_auth_token';
const DOCTOR_KEY = 'do_current_doctor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  isAuthenticated = signal(false);
  currentDoctor = signal<Doctor | null>(null);
  token = signal<string | null>(null);

  constructor() {
    this.loadFromStorage();
  }

  sendOtp(phone: string): Observable<{ success: boolean; message: string }> {
    if (!environment.production) {
      // Dev mode mock
      return of({ success: true, message: 'OTP sent successfully (dev mock)' });
    }
    return this.http.post<{ success: boolean; message: string }>(
      `${environment.apiUrl}/auth/send-otp`,
      { phone }
    );
  }

  verifyOtp(phone: string, otp: string): Observable<{ token: string; doctor: Doctor }> {
    if (!environment.production) {
      // Dev mode mock
      const mockDoctor: Doctor = {
        _id: 'doc_001',
        clinicId: 'clinic_001',
        name: 'Dr. Meera Sharma',
        phone: phone,
        email: 'meera.sharma@clinic.in',
        specialization: 'General Physician',
        qualification: 'MBBS, MD',
        registrationNo: 'MCI-78234',
        gender: 'female',
        isOwner: true,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      };
      const mockToken = 'dev_mock_jwt_token_' + Date.now();
      return of({ token: mockToken, doctor: mockDoctor }).pipe(
        tap((res) => this.setSession(res.token, res.doctor))
      );
    }
    return this.http
      .post<{ token: string; doctor: Doctor }>(
        `${environment.apiUrl}/auth/verify-otp`,
        { phone, otp }
      )
      .pipe(tap((res) => this.setSession(res.token, res.doctor)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DOCTOR_KEY);
    this.token.set(null);
    this.currentDoctor.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  loadFromStorage(): void {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedDoctor = localStorage.getItem(DOCTOR_KEY);
    if (storedToken && storedDoctor) {
      try {
        const doctor = JSON.parse(storedDoctor) as Doctor;
        this.token.set(storedToken);
        this.currentDoctor.set(doctor);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  private setSession(token: string, doctor: Doctor): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
    this.token.set(token);
    this.currentDoctor.set(doctor);
    this.isAuthenticated.set(true);
  }
}
