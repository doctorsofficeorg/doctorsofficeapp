import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, SelectModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',

})
export class SettingsComponent {
  saving = signal(false);

  clinic = {
    name: 'Sharma Clinic',
    phone: '080-2345-6789',
    email: 'info@sharmaclinic.in',
    gstin: '29AABCS1234A1Z5',
    address: '42 MG Road, Jayanagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    logoUrl: '',
  };

  branding = {
    primaryColor: '#6366f1',
    secondaryColor: '#0ea5e9',
    accentColor: '#f59e0b',
    theme: 'light',
  };

  themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  doctor = {
    name: 'Dr. Meera Sharma',
    qualification: 'MBBS, MD (General Medicine)',
    registrationNo: 'KMC-2015-12345',
    specialization: 'General Physician',
  };

  saveSettings(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
    }, 800);
  }
}
