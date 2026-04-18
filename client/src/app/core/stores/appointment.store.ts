import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  addEntity,
  removeEntity,
  type EntityId,
  type SelectEntityId,
} from '@ngrx/signals/entities';
import { ApiService } from '../api/api.service';
import { withLoadingState } from '../store/loading.feature';
import type { Appointment, QueueItem, QueueResponse, AppointmentStatus } from '../models';

const selectId: SelectEntityId<Appointment> = (a) => a._id;

interface QueueState {
  queue: QueueItem[];
  queueStats: QueueResponse['stats'] | null;
}

function mapAppointmentToQueueItem(apt: Appointment): QueueItem {
  const patient = typeof apt.patientId === 'object' ? apt.patientId : null;
  const doctor = typeof apt.doctorId === 'object' ? apt.doctorId : null;

  return {
    _id: apt._id,
    tokenNo: apt.tokenNumber,
    patientId: patient?._id ?? (apt.patientId as string),
    patientName: patient?.fullName ?? 'Unknown',
    patientUid: patient?.patientUid ?? '',
    appointmentId: apt._id,
    doctorId: doctor?._id ?? (apt.doctorId as string),
    doctorName: doctor?.fullName ?? 'Doctor',
    status: apt.status,
    type: apt.chiefComplaint ?? 'Consultation',
    scheduledTime: new Date(apt.appointmentDate).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    checkInTime: apt.startedAt
      ? new Date(apt.startedAt).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : undefined,
  };
}

export const AppointmentStore = signalStore(
  { providedIn: 'root' },
  withEntities<Appointment>(),
  withLoadingState(),
  withState<QueueState>({ queue: [], queueStats: null }),
  withComputed(({ queue }) => ({
    queueCount: computed(() => queue().length),
    waitingCount: computed(() => queue().filter(q => q.status === 'waiting').length),
    inConsultationCount: computed(() => queue().filter(q => q.status === 'in_consultation').length),
    doneCount: computed(() => queue().filter(q => q.status === 'done').length),
  })),
  withMethods((store) => {
    const api = inject(ApiService);

    return {
      async loadTodayQueue(): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const res = await api.get<QueueResponse>('/appointments/today-queue');
          const queueItems = res.queue.map(mapAppointmentToQueueItem);
          patchState(store, {
            queue: queueItems,
            queueStats: res.stats,
            loading: false,
          });
          patchState(store, setAllEntities(res.queue, { selectId }));
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to load queue';
          patchState(store, { loading: false, error: msg });
        }
      },

      async createAppointment(data: {
        patientId: string;
        chiefComplaint?: string;
        appointmentDate?: string;
      }): Promise<Appointment | null> {
        try {
          const created = await api.post<Appointment>('/appointments', {
            patientId: data.patientId,
            appointmentDate: data.appointmentDate ?? new Date().toISOString(),
            chiefComplaint: data.chiefComplaint,
          });
          patchState(store, addEntity(created, { selectId }));
          // Refresh queue to get populated data
          await this.loadTodayQueue();
          return created;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to create appointment';
          patchState(store, { error: msg });
          return null;
        }
      },

      async updateStatus(id: string, status: AppointmentStatus): Promise<boolean> {
        try {
          const updated = await api.put<Appointment>(`/appointments/${id}`, { status });
          patchState(store, removeEntity(id as EntityId));
          patchState(store, addEntity(updated, { selectId }));
          // Update the queue item locally
          patchState(store, {
            queue: store.queue().map(q =>
              q.appointmentId === id ? { ...q, status } : q
            ),
          });
          return true;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Failed to update status';
          patchState(store, { error: msg });
          return false;
        }
      },
    };
  })
);
