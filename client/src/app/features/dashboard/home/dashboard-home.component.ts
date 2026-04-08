import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ClinicService } from '../../../core/services/clinic.service';
import { QueueItem, InvoiceListItem, PrescriptionListItem, PatientListItem } from '../../../core/models';
import { formatCurrency } from '../../../core/utils/format';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, CardModule, TagModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent implements OnInit {
  private clinicService = inject(ClinicService);

  patients = signal<PatientListItem[]>([]);
  queue = signal<QueueItem[]>([]);
  prescriptions = signal<PrescriptionListItem[]>([]);
  invoices = signal<InvoiceListItem[]>([]);

  totalPatients = computed(() => this.patients().length);
  todayQueueCount = computed(() => this.queue().length);
  prescriptionsToday = computed(() => this.prescriptions().length);
  revenueToday = computed(() => {
    const total = this.invoices().reduce((sum, inv) => sum + inv.grandTotal, 0);
    return formatCurrency(total);
  });

  ngOnInit(): void {
    this.clinicService.getPatientsList().subscribe(data => this.patients.set(data));
    this.clinicService.getTodayQueue().subscribe(data => this.queue.set(data));
    this.clinicService.getPrescriptions().subscribe(data => this.prescriptions.set(data));
    this.clinicService.getInvoices().subscribe(data => this.invoices.set(data));
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'waiting': return 'warn';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Consultation';
      case 'waiting': return 'Waiting';
      case 'scheduled': return 'Scheduled';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  getActionLabel(status: string): string {
    switch (status) {
      case 'waiting': return 'Start Consultation';
      case 'in-progress': return 'Complete';
      case 'scheduled': return 'Check In';
      default: return '';
    }
  }

  onQueueAction(item: QueueItem): void {
    let newStatus: string;
    if (item.status === 'waiting') {
      newStatus = 'in-progress';
    } else if (item.status === 'in-progress') {
      newStatus = 'completed';
    } else if (item.status === 'scheduled') {
      newStatus = 'waiting';
    } else {
      return;
    }
    this.clinicService.updateAppointmentStatus(item.appointmentId, newStatus as any).subscribe(() => {
      this.queue.update(q => q.map(qi =>
        qi._id === item._id ? { ...qi, status: newStatus as any } : qi
      ));
    });
  }
}
