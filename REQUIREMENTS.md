# Product Requirements & User Directions

## Vision
A SaaS clinic management platform targeting **Indian doctors**. The product should allow doctors to create clinics, manage patients, run daily queues, write prescriptions, and handle GST-compliant billing — all from a clean, modern web interface.

## User-Specified Requirements

### Core Stack (User-Mandated)
- **Angular** — latest version (currently v21)
- **Bootstrap** theme with **PrimeNG** components
- **MongoDB** — primary database
- **Redis** — for caching
- **Node.js** backend — Express + TypeScript
- **Tiptap editor** with **Yjs WebSocket server** — for the prescription writer (collaborative editing)
- **Microsoft Clarity** — for instrumentation and session replay
- **Mobile number login** — OTP-based, focused on Indian market (+91)

### SaaS & Multi-Tenancy (User-Mandated)
- Users should be able to **create their own clinic** and manage it
- Users can **own or be part of multiple clinics**
- Should be able to **customize their clinic** with brand logo, color, theme, etc.
- **User management module** with access controls to manage:
  - Doctors
  - Nurses
  - Lab Technicians
  - Front Desk Representatives

### Previous Stack (Replaced)
The app was originally built with Next.js + Supabase + PostgreSQL + Drizzle ORM. The user decided to **start from scratch** with the Angular + Node.js stack listed above because they are more familiar with it.

## Feature Modules

### 1. Authentication
- Mobile number OTP login (Indian +91 numbers)
- Auto-provision clinic + user on first login
- JWT-based session (access token 1h, refresh token 7d)
- No email/password — mobile-first for Indian market

### 2. Dashboard
- 4 stat cards: Total Patients, Today's Queue, Prescriptions Today, Revenue Today (₹)
- Live queue table with status badges
- Quick action links to all modules

### 3. Patient Management
- Register patients with: name, phone, email, DOB, age, gender, blood group, address, emergency contact, medical history, allergies, notes
- Auto-generated Patient UID (PT-XXXXX format)
- Search and filter patients
- Patient table with avatar initials

### 4. Appointment Queue
- Walk-in appointment creation
- Auto-incrementing token numbers per day
- Status workflow: waiting → in_consultation → done (also: cancelled, no_show)
- Summary cards: waiting count, in-consultation count, completed count
- Real-time queue management

### 5. Prescriptions
- **Tiptap rich text editor** for prescription content (diagnosis, notes, advice)
- Yjs WebSocket collaboration (multiple doctors can edit simultaneously)
- Medicine items: name, dosage, frequency (OD/BD/TDS/QID/SOS/HS/STAT/PRN), duration, instructions
- Follow-up date
- Linked to patient + appointment

### 6. Billing & Invoicing
- Auto-generated invoice numbers (INV-0001, etc.)
- Line items with quantity × unit price
- GST calculation (Indian market — CGST/SGST/IGST)
- Discount support
- Payment modes: Cash, UPI, Card, Insurance, Other
- Payment status: Paid, Pending, Partial
- Revenue summary cards

### 7. Settings
- **Clinic Information**: name, address, phone, email, GSTIN, city, state, pincode
- **Branding Customization**: logo upload, primary/secondary/accent colors, light/dark theme, header/footer text for prescriptions
- **Doctor Profile**: name, qualification, registration number, specialization

### 8. Team Management (RBAC)
- Invite members by phone number
- 5 roles: Owner, Doctor, Nurse, Lab Technician, Front Desk
- Default permissions per role (customizable)
- View all members in a table
- Edit role, update permissions
- Remove (deactivate) members

### 9. Multi-Clinic Support
- Users can create multiple clinics
- Users can be invited to other clinics
- Clinic switcher in the UI
- All data scoped per clinic
- Each clinic has independent branding

## Future Considerations (Not Yet Built)
- PDF generation for prescriptions and invoices
- WhatsApp sharing
- PWA / mobile app
- Lab reports module
- Appointment scheduling (vs walk-in only)
- Patient portal
- Subscription/billing for the SaaS itself
- File uploads (logo, signatures) to cloud storage
- SMS OTP delivery integration (currently mock)
- Deployment (cloud provider TBD)

## Design Preferences
- Clean, professional, modern UI
- Teal as primary brand color (#0d9488)
- Indian Rupee (₹) for all monetary displays
- Indian phone format (+91 XXXXX XXXXX)
- Indian date format where applicable
- PrimeNG components — use Aura theme preset
- Bootstrap for layout grid
- System font stack (no Google Fonts dependency)

## Currency & Locale
- All monetary values in **Indian Rupees (₹)**
- Use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`
- GST rates: typically 18% for healthcare services
- GSTIN format for clinic registration
