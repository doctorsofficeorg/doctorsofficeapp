import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { ClinicService } from '../../../core/services/clinic.service';
import { PrescriptionListItem, PatientListItem, PrescriptionFrequency } from '../../../core/models';
import { TiptapEditorComponent } from '../../../shared/components/tiptap-editor/tiptap-editor.component';

interface MedicineRow {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, DialogModule,
    InputTextModule, SelectModule, TagModule, DatePickerModule, TiptapEditorComponent,
  ],
  templateUrl: './prescriptions.component.html',
  styleUrl: './prescriptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptionsComponent implements OnInit {
  private clinicService = inject(ClinicService);

  prescriptions = signal<PrescriptionListItem[]>([]);
  patientOptions = signal<{ label: string; value: string }[]>([]);
  showDialog = signal(false);

  form = {
    patientId: '',
    appointmentId: '',
    content: '',
    followUpDate: null as Date | null,
  };

  medicines = signal<MedicineRow[]>([]);

  appointmentOptions = [
    { label: 'Today 09:00 - Consultation', value: 'apt_001' },
    { label: 'Today 09:30 - Consultation', value: 'apt_002' },
    { label: 'Today 10:00 - Consultation', value: 'apt_003' },
  ];

  frequencyOptions = [
    { label: 'OD (Once Daily)', value: 'OD' },
    { label: 'BD (Twice Daily)', value: 'BD' },
    { label: 'TDS (Three Times)', value: 'TDS' },
    { label: 'QID (Four Times)', value: 'QID' },
    { label: 'SOS (As Needed)', value: 'SOS' },
    { label: 'HS (At Bedtime)', value: 'HS' },
    { label: 'STAT (Immediately)', value: 'stat' },
    { label: 'PRN (As Required)', value: 'weekly' },
  ];

  ngOnInit(): void {
    this.clinicService.getPrescriptions().subscribe(data => this.prescriptions.set(data));
    this.clinicService.getPatientsList().subscribe(data => {
      this.patientOptions.set(data.map(p => ({
        label: `${p.name} (${p.patientUid})`,
        value: p._id,
      })));
    });
  }

  openNewPrescription(): void {
    this.form = { patientId: '', appointmentId: '', content: '', followUpDate: null };
    this.medicines.set([this.emptyMedicine()]);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  onContentChange(html: string): void {
    this.form.content = html;
  }

  addMedicine(): void {
    this.medicines.update(list => [...list, this.emptyMedicine()]);
  }

  removeMedicine(index: number): void {
    this.medicines.update(list => list.filter((_, i) => i !== index));
  }

  savePrescription(): void {
    const items = this.medicines().map(m => ({
      drugName: m.drugName,
      dosage: m.dosage,
      frequency: m.frequency as PrescriptionFrequency,
      duration: m.duration,
      route: 'Oral',
      instructions: m.instructions,
    }));

    this.clinicService.createPrescription({
      patientId: this.form.patientId,
      appointmentId: this.form.appointmentId || undefined,
      diagnosis: this.form.content,
      complaints: '',
      items,
      followUpDate: this.form.followUpDate ? this.form.followUpDate.toISOString().split('T')[0] : undefined,
    }).subscribe(() => {
      this.clinicService.getPrescriptions().subscribe(data => this.prescriptions.set(data));
      this.closeDialog();
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private emptyMedicine(): MedicineRow {
    return { drugName: '', dosage: '', frequency: '', duration: '', instructions: '' };
  }
}
