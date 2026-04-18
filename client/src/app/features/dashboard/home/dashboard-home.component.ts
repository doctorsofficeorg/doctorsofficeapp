import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppointmentStore } from '../../../core/stores/appointment.store';
import { PrescriptionStore } from '../../../core/stores/prescription.store';
import { InvoiceStore } from '../../../core/stores/invoice.store';
import { AuthStore } from '../../../core/stores/auth.store';
import { ViewportService } from '../../../core/services/viewport.service';
import { QueueItem, Vitals } from '../../../core/models';
import { formatCurrency } from '../../../core/utils/format';
import { QueueCardComponent } from '../../../shared/components/queue-card/queue-card.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, RouterLink,
    TableModule, ButtonModule, CardModule, TagModule,
    DialogModule, InputNumberModule, SelectButtonModule,
    QueueCardComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit {
  private appointmentStore = inject(AppointmentStore);
  private prescriptionStore = inject(PrescriptionStore);
  private invoiceStore = inject(InvoiceStore);
  private authStore = inject(AuthStore);
  private viewport = inject(ViewportService);

  isMobile = this.viewport.isMobile;

  doctorName = computed(() => this.authStore.currentDoctor()?.fullName ?? 'Doctor');
  doctorCredentials = computed(() => {
    const doc = this.authStore.currentDoctor();
    const parts: string[] = [];
    if (doc?.qualification) parts.push(doc.qualification);
    if (doc?.specialization) parts.push(doc.specialization);
    return parts.join(' | ');
  });
  loginTimeFormatted = computed(() => {
    const lt = this.authStore.loginTime();
    if (!lt) return '';
    return new Date(lt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  });

  queue = this.appointmentStore.queue;
  prescriptions = this.prescriptionStore.listItems;
  invoiceList = this.invoiceStore.listItems;

  todayQueueCount = this.appointmentStore.queueCount;
  prescriptionsToday = computed(() => this.prescriptions().length);
  revenueToday = computed(() => formatCurrency(this.invoiceStore.totalRevenue()));
  waitingCount = computed(() => this.queue().filter(q => q.status === 'waiting').length);

  firstWaiting = computed(() => this.queue().find(q => q.status === 'waiting') ?? null);

  // Vitals dialog state
  vitalsDialogVisible = false;
  selectedQueueItem = signal<QueueItem | null>(null);
  vitals: Vitals = this.getEmptyVitals();
  tempUnitOptions = [
    { label: '\u00b0F', value: 'F' as const },
    { label: '\u00b0C', value: 'C' as const },
  ];

  ngOnInit(): void {
    this.appointmentStore.loadTodayQueue();
    this.prescriptionStore.loadAll();
    this.invoiceStore.loadAll();
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'done': return 'success';
      case 'in_consultation': return 'info';
      case 'waiting': return 'warn';
      case 'cancelled': return 'danger';
      case 'no_show': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'done': return 'Completed';
      case 'in_consultation': return 'In Consultation';
      case 'waiting': return 'Waiting';
      case 'cancelled': return 'Cancelled';
      case 'no_show': return 'No Show';
      default: return status;
    }
  }

  getActionLabel(status: string): string {
    switch (status) {
      case 'waiting': return 'Start Consultation';
      case 'in_consultation': return 'Complete';
      default: return '';
    }
  }

  async onQueueAction(item: QueueItem): Promise<void> {
    let newStatus: string;
    if (item.status === 'waiting') {
      newStatus = 'in_consultation';
    } else if (item.status === 'in_consultation') {
      newStatus = 'done';
    } else {
      return;
    }
    await this.appointmentStore.updateStatus(item.appointmentId, newStatus as any);
  }

  async startNext(): Promise<void> {
    const next = this.firstWaiting();
    if (next) await this.onQueueAction(next);
  }

  // ── Vitals dialog ──

  openVitalsDialog(item: QueueItem): void {
    this.selectedQueueItem.set(item);
    this.vitals = this.getEmptyVitals();
    this.vitalsDialogVisible = true;
  }

  onVitalsDialogHide(): void {
    this.selectedQueueItem.set(null);
  }

  calculateBmi(): void {
    const w = this.vitals.weight;
    const h = this.vitals.height;
    if (w && h && h > 0) {
      const heightM = h / 100;
      this.vitals.bmi = Math.round((w / (heightM * heightM)) * 10) / 10;
    } else {
      this.vitals.bmi = null;
    }
  }

  getBmiCategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  getBmiCategoryClass(bmi: number): string {
    if (bmi < 18.5) return 'bmi-underweight';
    if (bmi < 25) return 'bmi-normal';
    if (bmi < 30) return 'bmi-overweight';
    return 'bmi-obese';
  }

  saveVitals(): void {
    console.log('Vitals saved for', this.selectedQueueItem()?.patientName, this.vitals);
    this.vitalsDialogVisible = false;
  }

  private getEmptyVitals(): Vitals {
    return {
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      heartRate: null,
      temperature: null,
      temperatureUnit: 'F',
      spo2: null,
      respiratoryRate: null,
      weight: null,
      height: null,
      bmi: null,
    };
  }
}
