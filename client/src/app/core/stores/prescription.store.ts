import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withLoadingState } from '../store/loading.feature';
import { entityCrudMethods } from '../store/entity.feature';
import type { Prescription, PaginatedResponse, PrescriptionListItem } from '../models';

export const PrescriptionStore = signalStore(
  { providedIn: 'root' },
  withEntities<Prescription>(),
  withLoadingState(),
  withMethods((store) => entityCrudMethods<Prescription>(store, {
    endpoint: '/prescriptions',
    mapListResponse: (res) => (res as PaginatedResponse<Prescription>).data,
    mapCreatePayload: (data) => ({
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      diagnosis: data.diagnosis,
      notes: data.notes,
      advice: data.advice,
      followUpDate: data.followUpDate,
      tiptapContent: data.tiptapContent,
      items: data.items?.map(item => ({
        medicineName: item.medicineName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
        quantity: item.quantity,
      })),
    }),
  })),
  withComputed(({ entities }) => ({
    listItems: computed((): PrescriptionListItem[] =>
      entities().map(p => {
        const patient = typeof p.patientId === 'object' ? p.patientId : null;
        const doctor = typeof p.doctorId === 'object' ? p.doctorId : null;
        return {
          _id: p._id,
          patientName: patient?.fullName ?? 'Unknown',
          patientUid: patient?.patientUid ?? '',
          doctorName: doctor?.fullName ?? 'Doctor',
          date: p.createdAt,
          diagnosis: p.diagnosis,
          itemCount: p.items?.length ?? 0,
        };
      })
    ),
  }))
);
