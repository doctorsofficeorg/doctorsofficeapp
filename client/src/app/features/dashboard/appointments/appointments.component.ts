import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ClinicService } from '../../../core/services/clinic.service';
import { QueueItem, PatientListItem, AppointmentStatus } from '../../../core/models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, CardModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent implements OnInit {
  private clinicService = inject(ClinicService);

  queue = signal<QueueItem[]>([]);
  patientOptions = signal<{ label: string; value: string; id: string }[]>([]);
  showWalkInDialog = signal(false);

  walkInForm = {
    patientId: '',
    complaint: '',
  };

  waitingCount = computed(() => this.queue().filter(q => q.status === 'waiting' || q.status === 'scheduled').length);
  inConsultationCount = computed(() => this.queue().filter(q => q.status === 'in-progress').length);
  completedCount = computed(() => this.queue().filter(q => q.status === 'completed').length);

  ngOnInit(): void {
    this.clinicService.getTodayQueue().subscribe(data => this.queue.set(data));
    this.clinicService.getPatientsList().subscribe(data => {
      this.patientOptions.set(data.map(p => ({
        label: `${p.name} (${p.patientUid})`,
        value: p._id,
        id: p._id,
      })));
    });
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

  getActionSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'waiting': return 'info';
      case 'in-progress': return 'success';
      case 'scheduled': return 'warn';
      default: return 'secondary';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  onAction(item: QueueItem): void {
    let newStatus: AppointmentStatus;
    if (item.status === 'waiting') {
      newStatus = 'in-progress';
    } else if (item.status === 'in-progress') {
      newStatus = 'completed';
    } else if (item.status === 'scheduled') {
      newStatus = 'waiting';
    } else {
      return;
    }
    this.clinicService.updateAppointmentStatus(item.appointmentId, newStatus).subscribe(() => {
      this.queue.update(q => q.map(qi =>
        qi._id === item._id ? { ...qi, status: newStatus } : qi
      ));
    });
  }

  openWalkInDialog(): void {
    this.walkInForm = { patientId: '', complaint: '' };
    this.showWalkInDialog.set(true);
  }

  closeWalkInDialog(): void {
    this.showWalkInDialog.set(false);
  }

  saveWalkIn(): void {
    const selectedPatient = this.patientOptions().find(p => p.value === this.walkInForm.patientId);
    if (!selectedPatient) return;

    this.clinicService.createAppointment({
      patientId: this.walkInForm.patientId,
      patientName: selectedPatient.label.split(' (')[0],
      type: 'Walk-in',
      notes: this.walkInForm.complaint,
    }).subscribe(() => {
      const maxToken = this.queue().reduce((max, q) => Math.max(max, q.tokenNo), 0);
      const newItem: QueueItem = {
        _id: 'q_new_' + Date.now(),
        tokenNo: maxToken + 1,
        patientId: this.walkInForm.patientId,
        patientName: selectedPatient.label.split(' (')[0],
        patientUid: selectedPatient.label.match(/\((.*?)\)/)?.[1] ?? '',
        appointmentId: 'apt_new_' + Date.now(),
        doctorId: 'doc_001',
        doctorName: 'Dr. Meera Sharma',
        status: 'waiting',
        type: 'Walk-in',
        scheduledTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        checkInTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      this.queue.update(q => [...q, newItem]);
      this.closeWalkInDialog();
    });
  }
}
