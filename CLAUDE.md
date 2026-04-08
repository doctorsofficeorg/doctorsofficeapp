# CLAUDE.md — Doctors Office App

## Project Overview

**Doctors Office** is a SaaS clinic management platform built for the **Indian market**. Doctors can create and manage multiple clinics, invite team members with role-based access, and handle day-to-day operations: patient registration, appointment queuing, prescription writing, and GST-compliant billing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 21 (latest), Bootstrap 5, PrimeNG (Aura theme) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Mongoose ODM) |
| **Cache** | Redis (ioredis) |
| **Auth** | Mobile OTP login (Indian market, +91 numbers), JWT tokens |
| **Editor** | Tiptap rich text editor for prescriptions |
| **Realtime** | Yjs + y-websocket for collaborative prescription editing |
| **Analytics** | Microsoft Clarity for session replay & instrumentation |
| **Styling** | Bootstrap 5 + PrimeNG components (NOT custom design system) |

## Project Structure

```
doctorsofficeapp/
├── CLAUDE.md              ← You are here
├── REQUIREMENTS.md        ← Product requirements & user directions
├── package.json           ← Root workspace (concurrently for dev)
│
├── client/                ← Angular 21 Frontend
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/        → TypeScript interfaces
│   │   │   ├── services/      → AuthService, ClinicService, ApiService, ClarityService
│   │   │   ├── guards/        → Auth guard (dev mode: always passes)
│   │   │   ├── interceptors/  → JWT auth interceptor
│   │   │   └── utils/         → formatCurrency (₹ INR)
│   │   ├── features/
│   │   │   ├── landing/           → Marketing landing page
│   │   │   ├── auth/login/        → Mobile OTP login (+91)
│   │   │   ├── auth/register/     → Registration with OTP
│   │   │   └── dashboard/
│   │   │       ├── home/          → Stats cards, queue, quick actions
│   │   │       ├── patients/      → Patient CRUD (PrimeNG Table + Dialog)
│   │   │       ├── appointments/  → Queue management with status transitions
│   │   │       ├── prescriptions/ → Tiptap editor + medicine items
│   │   │       ├── billing/       → Invoices with GST calculation
│   │   │       ├── settings/      → Clinic info + branding customization
│   │   │       └── team/          → User/member management with RBAC
│   │   ├── layouts/
│   │   │   └── dashboard-layout/  → Sidebar + header shell
│   │   └── shared/
│   │       └── components/
│   │           └── tiptap-editor/ → Reusable Tiptap wrapper
│   ├── angular.json
│   └── package.json
│
├── server/                ← Node.js + Express Backend
│   ├── src/
│   │   ├── index.ts           → Express app entry, MongoDB + Redis connect
│   │   ├── config/            → Environment config
│   │   ├── models/
│   │   │   ├── user.model.ts              → Base user account (phone login)
│   │   │   ├── clinic.model.ts            → Clinic with branding
│   │   │   ├── clinic-membership.model.ts → Many-to-many user↔clinic with roles
│   │   │   ├── patient.model.ts           → Patient records
│   │   │   ├── appointment.model.ts       → Appointment queue
│   │   │   ├── prescription.model.ts      → Prescriptions + tiptapContent
│   │   │   └── invoice.model.ts           → Invoices with GST
│   │   ├── controllers/       → Auth, Clinic, Member, Patient, Appointment, Prescription, Invoice
│   │   ├── routes/            → REST API with RBAC middleware
│   │   ├── middleware/
│   │   │   ├── auth.ts        → JWT validation + requirePermission()
│   │   │   └── cache.ts       → Redis caching middleware
│   │   └── services/
│   │       ├── otp.service.ts   → 6-digit OTP, Redis store, 5min TTL
│   │       ├── token.service.ts → JWT access (1h) + refresh (7d) tokens
│   │       └── cache.service.ts → Redis get/set/del
│   ├── .env.example
│   └── package.json
│
└── yjs-server/            ← Yjs WebSocket for collaborative editing
    ├── src/index.ts       → WebSocket server on port 1234
    └── package.json
```

## Key Architecture Decisions

### Multi-Tenancy (SaaS)
- **User** model is separate from Doctor/role — a user can own or be part of multiple clinics
- **ClinicMembership** is a many-to-many join between User and Clinic with a `role` and `permissions[]`
- All data (patients, appointments, etc.) is scoped to `clinicId`
- Frontend sends `x-clinic-id` header; backend middleware resolves membership + permissions
- JWT token contains `userId`, `phone`, `clinicId` (active), `role`

### Roles & Permissions (RBAC)
5 roles with default permission sets:
- **owner** — full access + clinic management + member management
- **doctor** — patients, appointments, prescriptions, invoices, reports
- **nurse** — patients, appointments, read prescriptions
- **lab_tech** — read patients, appointments, prescriptions
- **front_desk** — patients, appointments, invoices

Permissions are granular strings like `patients:read`, `patients:write`, `invoices:delete`, `members:manage`, etc.

### Clinic Branding
Each clinic has a `branding` subdocument:
- `logoUrl`, `primaryColor`, `secondaryColor`, `accentColor`
- `theme: 'light' | 'dark'`
- `headerText`, `footerText` (for prescriptions/invoices)

### Auth Flow (Indian Market)
1. User enters +91 mobile number → `POST /api/auth/send-otp`
2. OTP stored in Redis (key: `otp:+91XXXXXXXXXX`, TTL: 300s)
3. User enters 6-digit OTP → `POST /api/auth/verify-otp`
4. Backend finds/creates User, creates default Clinic if new
5. Returns JWT tokens + user profile + clinic list
6. `POST /api/auth/switch-clinic` to change active clinic

### Frontend Patterns (Angular 21)
- All components are **standalone** (no NgModules)
- Use `inject()` function, NOT constructor injection
- Use **signals** (`signal()`, `computed()`) for state
- Use `@if`/`@for`/`@switch` template syntax (NOT *ngIf/*ngFor)
- `ChangeDetectionStrategy.OnPush` on all components
- PrimeNG components imported directly in component `imports` array
- Bootstrap classes for layout (container-fluid, row, col-*, etc.)
- Lazy-loaded routes via `loadComponent`

### Development Mode
- Auth guard passes everyone through when `environment.production === false`
- AuthService returns mock data (mock doctor, mock JWT) in dev mode
- ClinicService returns demo data via `of()` observables (5 patients, 5 queue items, etc.)
- OTP service returns the OTP in the response in dev mode for testing
- No MongoDB/Redis needed to test the frontend

## Commands

```bash
# Root — run all services
npm run dev              # Starts client + server + yjs-server concurrently

# Frontend only
cd client && npx ng serve          # http://localhost:4200
cd client && npx ng build          # Production build

# Backend only
cd server && npm run dev           # http://localhost:3000 (needs MongoDB + Redis)

# Yjs WebSocket server
cd yjs-server && npm run dev       # ws://localhost:1234

# Type checking
cd server && npx tsc --noEmit      # Backend type check
cd client && npx ng build          # Frontend type check (via build)
```

## Environment Variables (server/.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/doctorsoffice
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
OTP_EXPIRY=300
NODE_ENV=development
```

## API Routes

| Method | Route | Auth | Permission | Description |
|--------|-------|------|-----------|-------------|
| POST | /api/auth/send-otp | No | — | Send OTP to phone |
| POST | /api/auth/verify-otp | No | — | Verify OTP, get tokens |
| POST | /api/auth/refresh | No | — | Refresh access token |
| GET | /api/auth/me | Yes | — | Get user profile + clinics |
| POST | /api/auth/switch-clinic | Yes | — | Switch active clinic |
| GET | /api/clinics/my-clinics | Yes | — | List user's clinics |
| POST | /api/clinics | Yes | — | Create new clinic |
| PUT | /api/clinics/:id | Yes | settings:manage | Update clinic |
| PUT | /api/clinics/:id/branding | Yes | settings:manage | Update branding |
| GET | /api/members | Yes | members:manage | List clinic members |
| POST | /api/members/invite | Yes | members:invite | Invite by phone |
| PUT | /api/members/:id | Yes | members:manage | Update role/permissions |
| DELETE | /api/members/:id | Yes | members:remove | Remove member |
| CRUD | /api/patients | Yes | patients:* | Patient management |
| CRUD | /api/appointments | Yes | appointments:* | Appointment management |
| GET | /api/appointments/today-queue | Yes | appointments:read | Today's queue |
| CRUD | /api/prescriptions | Yes | prescriptions:* | Prescription management |
| CRUD | /api/invoices | Yes | invoices:* | Invoice management |

## Git Workflow

- **Branch**: `claude/doctors-office-app-dev-pjfyr`
- **Base**: `main`
- Always commit with descriptive messages
- Push to origin after commits
