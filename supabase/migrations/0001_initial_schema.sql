-- ============================================
-- Doctors Office — Initial Schema Migration
-- ============================================

-- Enums
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE appointment_status AS ENUM ('waiting', 'in_consultation', 'done', 'cancelled', 'no_show');
CREATE TYPE payment_mode AS ENUM ('cash', 'upi', 'card', 'insurance', 'other');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'partial');
CREATE TYPE region AS ENUM ('india', 'us', 'eu');
CREATE TYPE prescription_frequency AS ENUM ('OD', 'BD', 'TDS', 'QID', 'SOS', 'HS', 'STAT', 'PRN');

-- ============================================
-- CLINICS
-- ============================================
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gstin VARCHAR(20),
  logo_url TEXT,
  region region NOT NULL DEFAULT 'india',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- DOCTORS
-- ============================================
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  full_name VARCHAR(255) NOT NULL,
  qualification VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  signature_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_doctors_clinic ON doctors(clinic_id);
CREATE INDEX idx_doctors_user ON doctors(user_id);

-- ============================================
-- PATIENTS
-- ============================================
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_uid VARCHAR(20) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  date_of_birth DATE,
  age INTEGER,
  gender gender NOT NULL,
  blood_group VARCHAR(5),
  address TEXT,
  emergency_contact VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_patients_uid ON patients(clinic_id, patient_uid);
CREATE INDEX idx_patients_clinic ON patients(clinic_id);
CREATE INDEX idx_patients_phone ON patients(clinic_id, phone);

-- ============================================
-- APPOINTMENTS
-- ============================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  token_number INTEGER NOT NULL,
  status appointment_status NOT NULL DEFAULT 'waiting',
  chief_complaint TEXT,
  vitals JSONB,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_clinic_date ON appointments(clinic_id, appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE UNIQUE INDEX idx_appointments_token ON appointments(clinic_id, appointment_date, token_number);

-- ============================================
-- PRESCRIPTIONS
-- ============================================
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  notes TEXT,
  advice TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_appointment ON prescriptions(appointment_id);

-- ============================================
-- PRESCRIPTION ITEMS
-- ============================================
CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency prescription_frequency NOT NULL,
  duration VARCHAR(50) NOT NULL,
  instructions TEXT,
  quantity INTEGER
);

CREATE INDEX idx_prescription_items_rx ON prescription_items(prescription_id);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_mode payment_mode NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_invoices_number ON invoices(clinic_id, invoice_number);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);

-- ============================================
-- INVOICE ITEMS
-- ============================================
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Policy: doctors can access their own clinic's data
CREATE POLICY "doctors_own_clinic" ON clinics
  FOR ALL USING (
    id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "doctors_same_clinic" ON doctors
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "patients_same_clinic" ON patients
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "appointments_same_clinic" ON appointments
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "prescriptions_same_clinic" ON prescriptions
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "prescription_items_via_rx" ON prescription_items
  FOR ALL USING (
    prescription_id IN (
      SELECT id FROM prescriptions
      WHERE clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "invoices_same_clinic" ON invoices
  FOR ALL USING (
    clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "invoice_items_via_invoice" ON invoice_items
  FOR ALL USING (
    invoice_id IN (
      SELECT id FROM invoices
      WHERE clinic_id IN (SELECT clinic_id FROM doctors WHERE user_id = auth.uid())
    )
  );

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ENABLE REALTIME (for queue updates)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
