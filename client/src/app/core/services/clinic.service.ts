import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import {
  Patient,
  PatientListItem,
  QueueItem,
  PrescriptionListItem,
  InvoiceListItem,
  Appointment,
  Prescription,
  Invoice,
  AppointmentStatus,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ClinicService {
  private api = inject(ApiService);

  // --- Patients ---

  getPatients(search?: string): Observable<Patient[]> {
    return of(MOCK_PATIENTS.filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
    ));
  }

  getPatientsList(): Observable<PatientListItem[]> {
    return of(MOCK_PATIENTS.map(p => ({
      _id: p._id,
      patientUid: p.patientUid,
      name: p.name,
      phone: p.phone,
      gender: p.gender,
      dateOfBirth: p.dateOfBirth,
      lastVisit: p.updatedAt,
    })));
  }

  createPatient(data: Partial<Patient>): Observable<Patient> {
    return of({ ...MOCK_PATIENTS[0], ...data } as Patient);
  }

  // --- Queue / Appointments ---

  getTodayQueue(): Observable<QueueItem[]> {
    return of(MOCK_QUEUE);
  }

  createAppointment(data: Partial<Appointment>): Observable<Appointment> {
    return of({
      _id: 'apt_new',
      clinicId: 'clinic_001',
      patientId: data['patientId'] ?? '',
      doctorId: 'doc_001',
      patientName: data['patientName'] ?? '',
      doctorName: 'Dr. Meera Sharma',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      status: 'scheduled' as AppointmentStatus,
      type: data['type'] ?? 'consultation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<{ success: boolean }> {
    return of({ success: true });
  }

  // --- Prescriptions ---

  getPrescriptions(): Observable<PrescriptionListItem[]> {
    return of(MOCK_PRESCRIPTIONS);
  }

  createPrescription(data: Partial<Prescription>): Observable<Prescription> {
    return of({ ...data, _id: 'rx_new', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Prescription);
  }

  // --- Invoices ---

  getInvoices(): Observable<InvoiceListItem[]> {
    return of(MOCK_INVOICES);
  }

  createInvoice(data: Partial<Invoice>): Observable<Invoice> {
    return of({ ...data, _id: 'inv_new', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Invoice);
  }
}

// ----- Mock Data -----

const MOCK_PATIENTS: Patient[] = [
  {
    _id: 'pat_001', clinicId: 'clinic_001', patientUid: 'P-1001', name: 'Rajesh Kumar',
    phone: '9876543210', email: 'rajesh.kumar@email.com', gender: 'male',
    dateOfBirth: '1985-03-15', bloodGroup: 'B+', address: '42 MG Road',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560001',
    allergies: ['Penicillin'], medicalHistory: ['Hypertension'],
    createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-04-07T09:30:00Z',
  },
  {
    _id: 'pat_002', clinicId: 'clinic_001', patientUid: 'P-1002', name: 'Priya Nair',
    phone: '9876543211', gender: 'female',
    dateOfBirth: '1992-07-22', bloodGroup: 'O+', address: '18 Residency Road',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560025',
    allergies: [], medicalHistory: [],
    createdAt: '2025-08-10T10:00:00Z', updatedAt: '2026-04-06T14:00:00Z',
  },
  {
    _id: 'pat_003', clinicId: 'clinic_001', patientUid: 'P-1003', name: 'Amit Patel',
    phone: '9876543212', gender: 'male',
    dateOfBirth: '1978-11-05', bloodGroup: 'A+', address: '7 Jayanagar 4th Block',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560041',
    allergies: ['Sulfa drugs'], medicalHistory: ['Diabetes Type 2', 'Hypothyroidism'],
    createdAt: '2025-04-20T10:00:00Z', updatedAt: '2026-04-07T11:00:00Z',
  },
  {
    _id: 'pat_004', clinicId: 'clinic_001', patientUid: 'P-1004', name: 'Sneha Reddy',
    phone: '9876543213', gender: 'female',
    dateOfBirth: '2000-01-30', bloodGroup: 'AB+', address: '33 Koramangala',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560034',
    allergies: [], medicalHistory: [],
    createdAt: '2025-12-01T10:00:00Z', updatedAt: '2026-04-05T16:00:00Z',
  },
  {
    _id: 'pat_005', clinicId: 'clinic_001', patientUid: 'P-1005', name: 'Mohammed Irfan',
    phone: '9876543214', gender: 'male',
    dateOfBirth: '1965-09-12', bloodGroup: 'O-', address: '101 Commercial Street',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560001',
    allergies: ['Aspirin'], medicalHistory: ['Asthma', 'GERD'],
    createdAt: '2025-03-15T10:00:00Z', updatedAt: '2026-04-07T08:00:00Z',
  },
];

const MOCK_QUEUE: QueueItem[] = [
  {
    _id: 'q_001', tokenNo: 1, patientId: 'pat_001', patientName: 'Rajesh Kumar',
    patientUid: 'P-1001', appointmentId: 'apt_001', doctorId: 'doc_001',
    doctorName: 'Dr. Meera Sharma', status: 'completed', type: 'Follow-up',
    scheduledTime: '09:00', checkInTime: '08:55',
  },
  {
    _id: 'q_002', tokenNo: 2, patientId: 'pat_003', patientName: 'Amit Patel',
    patientUid: 'P-1003', appointmentId: 'apt_002', doctorId: 'doc_001',
    doctorName: 'Dr. Meera Sharma', status: 'in-progress', type: 'Consultation',
    scheduledTime: '09:30', checkInTime: '09:25',
  },
  {
    _id: 'q_003', tokenNo: 3, patientId: 'pat_002', patientName: 'Priya Nair',
    patientUid: 'P-1002', appointmentId: 'apt_003', doctorId: 'doc_001',
    doctorName: 'Dr. Meera Sharma', status: 'waiting', type: 'Consultation',
    scheduledTime: '10:00', checkInTime: '09:50',
  },
  {
    _id: 'q_004', tokenNo: 4, patientId: 'pat_005', patientName: 'Mohammed Irfan',
    patientUid: 'P-1005', appointmentId: 'apt_004', doctorId: 'doc_001',
    doctorName: 'Dr. Meera Sharma', status: 'waiting', type: 'Follow-up',
    scheduledTime: '10:30',
  },
  {
    _id: 'q_005', tokenNo: 5, patientId: 'pat_004', patientName: 'Sneha Reddy',
    patientUid: 'P-1004', appointmentId: 'apt_005', doctorId: 'doc_001',
    doctorName: 'Dr. Meera Sharma', status: 'scheduled', type: 'New Patient',
    scheduledTime: '11:00',
  },
];

const MOCK_PRESCRIPTIONS: PrescriptionListItem[] = [
  {
    _id: 'rx_001', patientName: 'Rajesh Kumar', patientUid: 'P-1001',
    doctorName: 'Dr. Meera Sharma', date: '2026-04-07', diagnosis: 'Hypertension follow-up', itemCount: 3,
  },
  {
    _id: 'rx_002', patientName: 'Amit Patel', patientUid: 'P-1003',
    doctorName: 'Dr. Meera Sharma', date: '2026-04-07', diagnosis: 'Type 2 Diabetes management', itemCount: 4,
  },
  {
    _id: 'rx_003', patientName: 'Mohammed Irfan', patientUid: 'P-1005',
    doctorName: 'Dr. Meera Sharma', date: '2026-04-06', diagnosis: 'Acute bronchitis with GERD', itemCount: 5,
  },
  {
    _id: 'rx_004', patientName: 'Priya Nair', patientUid: 'P-1002',
    doctorName: 'Dr. Meera Sharma', date: '2026-04-06', diagnosis: 'Viral upper respiratory infection', itemCount: 3,
  },
];

const MOCK_INVOICES: InvoiceListItem[] = [
  {
    _id: 'inv_001', invoiceNo: 'INV-2026-0047', patientName: 'Rajesh Kumar',
    patientUid: 'P-1001', date: '2026-04-07', grandTotal: 850,
    paymentStatus: 'paid', paymentMode: 'upi',
  },
  {
    _id: 'inv_002', invoiceNo: 'INV-2026-0048', patientName: 'Amit Patel',
    patientUid: 'P-1003', date: '2026-04-07', grandTotal: 1200,
    paymentStatus: 'paid', paymentMode: 'cash',
  },
  {
    _id: 'inv_003', invoiceNo: 'INV-2026-0049', patientName: 'Mohammed Irfan',
    patientUid: 'P-1005', date: '2026-04-06', grandTotal: 1500,
    paymentStatus: 'pending', paymentMode: 'cash',
  },
  {
    _id: 'inv_004', invoiceNo: 'INV-2026-0050', patientName: 'Priya Nair',
    patientUid: 'P-1002', date: '2026-04-06', grandTotal: 650,
    paymentStatus: 'paid', paymentMode: 'card',
  },
];
