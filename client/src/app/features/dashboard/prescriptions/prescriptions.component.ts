import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { PrescriptionStore } from '../../../core/stores/prescription.store';
import { PatientStore } from '../../../core/stores/patient.store';
import { PrescriptionFrequency } from '../../../core/models';
import { TiptapEditorComponent } from '../../../shared/components/tiptap-editor/tiptap-editor.component';

interface MedicineRow {
  medicineName: string;
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
})
export class PrescriptionsComponent implements OnInit {
  private prescriptionStore = inject(PrescriptionStore);
  private patientStore = inject(PatientStore);

  prescriptions = this.prescriptionStore.listItems;
  showDialog = signal(false);

  patientOptions = computed(() =>
    this.patientStore.entities().map(p => ({
      label: `${p.fullName} (${p.patientUid})`,
      value: p._id,
    }))
  );

  form = {
    patientId: '',
    appointmentId: '',
    content: '',
    followUpDate: null as Date | null,
  };

  medicines = signal<MedicineRow[]>([]);

  appointmentOptions = signal<{ label: string; value: string }[]>([]);

  frequencyOptions = [
    { label: 'OD (Once Daily)', value: 'OD' },
    { label: 'BD (Twice Daily)', value: 'BD' },
    { label: 'TDS (Three Times)', value: 'TDS' },
    { label: 'QID (Four Times)', value: 'QID' },
    { label: 'SOS (As Needed)', value: 'SOS' },
    { label: 'HS (At Bedtime)', value: 'HS' },
    { label: 'STAT (Immediately)', value: 'STAT' },
    { label: 'PRN (As Required)', value: 'PRN' },
  ];

  ngOnInit(): void {
    this.prescriptionStore.loadAll();
    this.patientStore.loadAll();
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

  async savePrescription(): Promise<void> {
    const items = this.medicines().map(m => ({
      medicineName: m.medicineName,
      dosage: m.dosage,
      frequency: m.frequency as PrescriptionFrequency,
      duration: m.duration,
      instructions: m.instructions,
    }));

    await this.prescriptionStore.create({
      patientId: this.form.patientId,
      appointmentId: this.form.appointmentId || undefined,
      diagnosis: this.form.content,
      items,
      followUpDate: this.form.followUpDate ? this.form.followUpDate.toISOString().split('T')[0] : undefined,
    } as any);

    this.closeDialog();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private emptyMedicine(): MedicineRow {
    return { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' };
  }
}
