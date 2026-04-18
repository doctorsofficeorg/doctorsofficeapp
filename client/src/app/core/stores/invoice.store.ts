import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withLoadingState } from '../store/loading.feature';
import { entityCrudMethods } from '../store/entity.feature';
import type { Invoice, PaginatedResponse, InvoiceListItem } from '../models';

export const InvoiceStore = signalStore(
  { providedIn: 'root' },
  withEntities<Invoice>(),
  withLoadingState(),
  withMethods((store) => entityCrudMethods<Invoice>(store, {
    endpoint: '/invoices',
    mapListResponse: (res) => (res as PaginatedResponse<Invoice>).data,
    mapCreatePayload: (data) => ({
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      subtotal: data.subtotal,
      gstPercent: data.gstPercent ?? 0,
      gstAmount: data.gstAmount ?? 0,
      discount: data.discount ?? 0,
      total: data.total,
      paymentMode: data.paymentMode,
      paymentStatus: data.paymentStatus,
      notes: data.notes,
      items: data.items?.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      })),
    }),
  })),
  withComputed(({ entities }) => ({
    listItems: computed((): InvoiceListItem[] =>
      entities().map(inv => {
        const patient = typeof inv.patientId === 'object' ? inv.patientId : null;
        return {
          _id: inv._id,
          invoiceNumber: inv.invoiceNumber,
          patientName: patient?.fullName ?? 'Unknown',
          patientUid: patient?.patientUid ?? '',
          date: inv.createdAt,
          total: inv.total,
          paymentStatus: inv.paymentStatus,
          paymentMode: inv.paymentMode,
        };
      })
    ),
    totalRevenue: computed(() =>
      entities().reduce((sum, inv) => sum + (inv.total ?? 0), 0)
    ),
  }))
);
