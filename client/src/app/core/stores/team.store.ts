import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { ApiService } from '../api/api.service';
import type { ClinicMembership } from '../models';

interface MemberResponse {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: string;
  permissions: string[];
  qualification?: string;
  specialization?: string;
  registrationNumber?: string;
  invitedBy?: string;
  joinedAt: string;
  isActive: boolean;
}

interface TeamState {
  members: MemberResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
  loading: false,
  error: null,
};

export const TeamStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ members }) => ({
    doctorCount: computed(() => members().filter(m => m.role === 'doctor' || m.role === 'owner').length),
    nurseCount: computed(() => members().filter(m => m.role === 'nurse').length),
    labTechCount: computed(() => members().filter(m => m.role === 'lab_tech').length),
    frontDeskCount: computed(() => members().filter(m => m.role === 'front_desk').length),
  })),
  withMethods((store) => {
    const api = inject(ApiService);

    return {
      async loadMembers(): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const res = await api.get<{ members: MemberResponse[] }>('/members');
          patchState(store, { members: res.members, loading: false });
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to load members';
          patchState(store, { loading: false, error: msg });
        }
      },

      async inviteMember(data: {
        phone: string;
        role: string;
        qualification?: string;
        specialization?: string;
        registrationNumber?: string;
      }): Promise<boolean> {
        try {
          await api.post('/members/invite', {
            phone: `+91${data.phone}`,
            role: data.role,
            qualification: data.qualification,
            specialization: data.specialization,
            registrationNumber: data.registrationNumber,
          });
          // Refresh the list
          await this.loadMembers();
          return true;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to invite member';
          patchState(store, { error: msg });
          return false;
        }
      },

      async updateMember(membershipId: string, data: {
        role?: string;
        permissions?: string[];
        qualification?: string;
        specialization?: string;
        registrationNumber?: string;
      }): Promise<boolean> {
        try {
          await api.put(`/members/${membershipId}`, data);
          await this.loadMembers();
          return true;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to update member';
          patchState(store, { error: msg });
          return false;
        }
      },

      async removeMember(membershipId: string): Promise<boolean> {
        try {
          await api.delete(`/members/${membershipId}`);
          patchState(store, {
            members: store.members().filter(m => m.id !== membershipId),
          });
          return true;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to remove member';
          patchState(store, { error: msg });
          return false;
        }
      },
    };
  })
);
