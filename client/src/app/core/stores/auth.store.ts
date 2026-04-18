import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { ApiService } from '../api/api.service';
import type { AuthResponse, ClinicListItem, Doctor } from '../models';

const TOKEN_KEY = 'do_auth_token';
const REFRESH_TOKEN_KEY = 'do_refresh_token';
const USER_KEY = 'do_current_user';
const CLINIC_ID_KEY = 'do_active_clinic_id';
const CLINICS_KEY = 'do_clinics';
const LOGIN_TIME_KEY = 'do_login_time';

interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  clinics: ClinicListItem[];
  activeClinicId: string | null;
  isAuthenticated: boolean;
  loginTime: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  clinics: [],
  activeClinicId: null,
  isAuthenticated: false,
  loginTime: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user, clinics, activeClinicId }) => ({
    currentDoctor: computed((): Doctor | null => {
      const u = user();
      const cId = activeClinicId();
      if (!u) return null;
      const membership = clinics().find(c => c.clinicId === cId);
      return {
        _id: u.id,
        clinicId: cId ?? '',
        fullName: u.fullName,
        phone: u.phone,
        email: u.email,
        avatarUrl: u.avatarUrl,
        role: membership?.role ?? 'doctor',
        qualification: undefined,
        specialization: undefined,
      };
    }),
    activeClinic: computed(() => {
      const cId = activeClinicId();
      return clinics().find(c => c.clinicId === cId) ?? null;
    }),
  })),
  withMethods((store) => {
    const api = inject(ApiService);
    const router = inject(Router);

    function persistSession(state: Partial<AuthState>): void {
      if (state.token !== undefined) {
        if (state.token) localStorage.setItem(TOKEN_KEY, state.token);
        else localStorage.removeItem(TOKEN_KEY);
      }
      if (state.refreshToken !== undefined) {
        if (state.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken);
        else localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      if (state.user !== undefined) {
        if (state.user) localStorage.setItem(USER_KEY, JSON.stringify(state.user));
        else localStorage.removeItem(USER_KEY);
      }
      if (state.activeClinicId !== undefined) {
        if (state.activeClinicId) localStorage.setItem(CLINIC_ID_KEY, state.activeClinicId);
        else localStorage.removeItem(CLINIC_ID_KEY);
      }
      if (state.clinics !== undefined) {
        if (state.clinics.length) localStorage.setItem(CLINICS_KEY, JSON.stringify(state.clinics));
        else localStorage.removeItem(CLINICS_KEY);
      }
      if (state.loginTime !== undefined) {
        if (state.loginTime) localStorage.setItem(LOGIN_TIME_KEY, state.loginTime);
        else localStorage.removeItem(LOGIN_TIME_KEY);
      }
    }

    return {
      async sendOtp(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
        patchState(store, { loading: true, error: null });
        try {
          const result = await api.post<{ message: string; expiresIn: number; otp?: string }>(
            '/auth/send-otp',
            { phone: `+91${phone}` }
          );
          patchState(store, { loading: false });
          return { success: true, message: result.message, otp: result.otp };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to send OTP';
          patchState(store, { loading: false, error: msg });
          return { success: false, message: msg };
        }
      },

      async verifyOtp(phone: string, otp: string, fullName?: string): Promise<{ success: boolean; isNewUser: boolean }> {
        patchState(store, { loading: true, error: null });
        try {
          const body: Record<string, string> = { phone: `+91${phone}`, otp };
          if (fullName?.trim()) body['fullName'] = fullName.trim();
          const res = await api.post<AuthResponse>('/auth/verify-otp', body);

          const now = new Date().toISOString();
          const state: Partial<AuthState> = {
            token: res.accessToken,
            refreshToken: res.refreshToken,
            user: res.user,
            clinics: res.clinics,
            activeClinicId: res.activeClinicId,
            isAuthenticated: true,
            loginTime: now,
            loading: false,
            error: null,
          };
          patchState(store, state);
          persistSession(state);
          return { success: true, isNewUser: res.isNewUser };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'OTP verification failed';
          patchState(store, { loading: false, error: msg });
          return { success: false, isNewUser: false };
        }
      },

      async updateProfile(data: { fullName?: string; email?: string }): Promise<boolean> {
        try {
          const res = await api.put<{ user: AuthUser }>('/auth/profile', data);
          const updatedUser = res.user;
          patchState(store, { user: updatedUser });
          persistSession({ user: updatedUser });
          return true;
        } catch {
          return false;
        }
      },

      async createClinic(payload: {
        name: string;
        phone: string;
        email: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        gstin?: string;
        branding?: Record<string, unknown>;
      }): Promise<{ success: boolean; clinicId?: string; error?: string }> {
        patchState(store, { loading: true, error: null });
        try {
          const res = await api.post<{ clinic: { _id: string; name: string; branding?: any } }>(
            '/clinics',
            payload,
          );
          const newClinic: ClinicListItem = {
            clinicId: res.clinic._id,
            clinicName: res.clinic.name,
            role: 'owner',
            branding: res.clinic.branding,
          };
          const updatedClinics = [...store.clinics(), newClinic];
          const partial: Partial<AuthState> = {
            clinics: updatedClinics,
            loading: false,
          };
          patchState(store, partial);
          persistSession({ clinics: updatedClinics });
          return { success: true, clinicId: res.clinic._id };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to create clinic';
          patchState(store, { loading: false, error: msg });
          return { success: false, error: msg };
        }
      },

      async switchClinic(clinicId: string): Promise<boolean> {
        try {
          const res = await api.post<{
            accessToken: string;
            refreshToken: string;
            clinic: { id: string; name: string };
            role: string;
          }>('/auth/switch-clinic', { clinicId });

          const state: Partial<AuthState> = {
            token: res.accessToken,
            refreshToken: res.refreshToken,
            activeClinicId: clinicId,
          };
          patchState(store, state);
          persistSession(state);
          return true;
        } catch {
          return false;
        }
      },

      logout(): void {
        patchState(store, initialState);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(CLINIC_ID_KEY);
        localStorage.removeItem(CLINICS_KEY);
        localStorage.removeItem(LOGIN_TIME_KEY);
        router.navigate(['/login']);
      },

      loadFromStorage(): void {
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);
        const clinicsStr = localStorage.getItem(CLINICS_KEY);
        const activeClinicId = localStorage.getItem(CLINIC_ID_KEY);
        const loginTime = localStorage.getItem(LOGIN_TIME_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr) as AuthUser;
            const clinics = clinicsStr ? (JSON.parse(clinicsStr) as ClinicListItem[]) : [];
            patchState(store, {
              token,
              refreshToken,
              user,
              clinics,
              activeClinicId,
              isAuthenticated: true,
              loginTime,
            });
          } catch {
            // Corrupted storage — clear it
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
    },
  })
);
