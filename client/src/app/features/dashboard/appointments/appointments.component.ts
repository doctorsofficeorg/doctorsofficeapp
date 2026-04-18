import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { AppointmentStore } from '../../../core/stores/appointment.store';
import { PatientStore } from '../../../core/stores/patient.store';
import { QueueItem, AppointmentStatus } from '../../../core/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, CardModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent implements OnInit {
  private appointmentStore = inject(AppointmentStore);
  private patientStore = inject(PatientStore);

  queue = this.appointmentStore.queue;
  showWalkInDialog = signal(false);

  patientOptions = computed(() =>
    this.patientStore.entities().map(p => ({
      label: `${p.fullName} (${p.patientUid})`,
      value: p._id,
      id: p._id,
    }))
  );

  walkInForm = {
    patientId: '',
    complaint: '',
  };

  waitingCount = this.appointmentStore.waitingCount;
  inConsultationCount = this.appointmentStore.inConsultationCount;
  completedCount = this.appointmentStore.doneCount;

  ngOnInit(): void {
    this.appointmentStore.loadTodayQueue();
    this.patientStore.loadAll();
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

  getActionSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'waiting': return 'info';
      case 'in_consultation': return 'success';
      default: return 'secondary';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  async onAction(item: QueueItem): Promise<void> {
    let newStatus: AppointmentStatus;
    if (item.status === 'waiting') {
      newStatus = 'in_consultation';
    } else if (item.status === 'in_consultation') {
      newStatus = 'done';
    } else {
      return;
    }
    await this.appointmentStore.updateStatus(item.appointmentId, newStatus);
  }

  openWalkInDialog(): void {
    this.walkInForm = { patientId: '', complaint: '' };
    this.showWalkInDialog.set(true);
  }

  closeWalkInDialog(): void {
    this.showWalkInDialog.set(false);
  }

  async saveWalkIn(): Promise<void> {
    if (!this.walkInForm.patientId) return;

    await this.appointmentStore.createAppointment({
      patientId: this.walkInForm.patientId,
      chiefComplaint: this.walkInForm.complaint || 'Walk-in',
    });
    this.closeWalkInDialog();
  }
}
