import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withLoadingState } from '../store/loading.feature';
import { entityCrudMethods } from '../store/entity.feature';
import type { Patient, PaginatedResponse } from '../models';

export const PatientStore = signalStore(
  { providedIn: 'root' },
  withEntities<Patient>(),
  withLoadingState(),
  withMethods((store) => entityCrudMethods<Patient>(store, {
    endpoint: '/patients',
    mapListResponse: (res) => (res as PaginatedResponse<Patient>).data,
    mapCreatePayload: (data) => ({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      age: data.age,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      address: data.address,
      emergencyContact: data.emergencyContact,
      medicalHistory: data.medicalHistory,
      allergies: data.allergies,
      notes: data.notes,
    }),
  })),
  withComputed(({ entities }) => ({
    patientCount: computed(() => entities().length),
  }))
);
