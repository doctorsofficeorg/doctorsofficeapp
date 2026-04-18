import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PatientStore } from '../../../core/stores/patient.store';
import { Patient } from '../../../core/models';

interface PatientForm {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  allergies: string;
  notes: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss',
})
export class PatientsComponent implements OnInit {
  private patientStore = inject(PatientStore);

  patients = this.patientStore.entities;
  searchQuery = signal('');
  showDialog = signal(false);

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  bloodGroupOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  form: PatientForm = this.getEmptyForm();

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    const search = this.searchQuery();
    this.patientStore.loadAll(search ? { search } : undefined);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.loadPatients();
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getAge(dob: string | undefined): number | string {
    if (!dob) return '-';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  formatGender(gender: string): string {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  openNewPatientDialog(): void {
    this.form = this.getEmptyForm();
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  async savePatient(): Promise<void> {
    const data: Partial<Patient> = {
      fullName: this.form.fullName,
      phone: this.form.phone,
      email: this.form.email || undefined,
      dateOfBirth: this.form.dateOfBirth || undefined,
      gender: this.form.gender as Patient['gender'],
      bloodGroup: this.form.bloodGroup as Patient['bloodGroup'],
      address: this.form.address || undefined,
      emergencyContact: this.form.emergencyContact || undefined,
      medicalHistory: this.form.medicalHistory || undefined,
      allergies: this.form.allergies || undefined,
      notes: this.form.notes || undefined,
    };

    await this.patientStore.create(data);
    this.closeDialog();
  }

  private getEmptyForm(): PatientForm {
    return {
      fullName: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      bloodGroup: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      notes: '',
    };
  }
}
