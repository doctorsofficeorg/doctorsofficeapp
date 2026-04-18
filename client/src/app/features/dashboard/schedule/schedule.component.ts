import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, afterNextRender, ElementRef, viewChild, Injector, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AppointmentStore } from '../../../core/stores/appointment.store';
import { AuthStore } from '../../../core/stores/auth.store';
import { PatientStore } from '../../../core/stores/patient.store';
import { ViewportService } from '../../../core/services/viewport.service';
import type { AppointmentStatus, QueueItem } from '../../../core/models';
import { formatCurrency } from '../../../core/utils/format';

interface TrendPoint {
  label: string;
  bpSys: number;
  bpDia: number;
  pulse: number;
  weight: number;
}

interface WaitlistEntry {
  id: string;
  name: string;
  subtitle: string;
  cta: 'offer' | 'soft';
}

interface TomorrowSlot {
  time: string;
  name: string;
  type: string;
}

interface VitalTile {
  key: string;
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  tone: 'normal' | 'warn' | 'danger';
}

const MOCK_TREND: TrendPoint[] = [
  { label: 'Nov', bpSys: 150, bpDia: 96, pulse: 82, weight: 70.5 },
  { label: 'Dec', bpSys: 146, bpDia: 94, pulse: 80, weight: 70.8 },
  { label: 'Jan', bpSys: 148, bpDia: 96, pulse: 78, weight: 71.2 },
  { label: 'Feb', bpSys: 144, bpDia: 93, pulse: 80, weight: 71.5 },
  { label: 'Mar', bpSys: 146, bpDia: 92, pulse: 78, weight: 71.8 },
  { label: 'Apr', bpSys: 142, bpDia: 92, pulse: 78, weight: 72.0 },
];

const MOCK_WAITLIST: WaitlistEntry[] = [
  { id: 'w1', name: 'Deepak Shah · 52M', subtitle: 'This week · Follow-up · ₹800', cta: 'offer' },
  { id: 'w2', name: 'Pooja Rao · 29F',  subtitle: 'Telehealth · New · ₹600',     cta: 'offer' },
  { id: 'w3', name: 'Vikram Bhatia · 67M', subtitle: 'Urgent · Tmrw morning',    cta: 'offer' },
  { id: 'w4', name: 'Rakesh Jain · 55M', subtitle: 'Cancel backfill · ₹800',    cta: 'soft' },
];

const MOCK_TOMORROW: TomorrowSlot[] = [
  { time: '09:30', name: 'Sanjay Gupta',   type: 'Follow-up' },
  { time: '10:00', name: 'Neha Kapoor',    type: 'New · ECG' },
  { time: '11:15', name: 'Harish Malhotra', type: 'F/U' },
  { time: '14:30', name: 'Ritu Verma',     type: 'Telehealth' },
  { time: '15:45', name: 'Arun Paul',      type: 'Follow-up' },
  { time: '16:30', name: 'Leela Iyer',     type: 'New' },
];

@Component({
  selector: 'app-schedule',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TagModule, SelectButtonModule, SelectModule, InputTextModule, DialogModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  private appointmentStore = inject(AppointmentStore);
  private authStore = inject(AuthStore);
  private patientStore = inject(PatientStore);
  private viewport = inject(ViewportService);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  queue = this.appointmentStore.queue;
  doctor = this.authStore.currentDoctor;
  activeClinic = this.authStore.activeClinic;
  isMobile = this.viewport.isMobile;
  isDesktop = this.viewport.isDesktop;

  // Day-grid: 24 rows, each HOUR_HEIGHT tall. Minutes translate linearly.
  readonly HOUR_HEIGHT = 56;
  readonly HOURS: number[] = Array.from({ length: 24 }, (_, i) => i);
  readonly MINUTE_OPTIONS: number[] = [0, 15, 30, 45];

  // Ticks each minute so the "Now" line and the current-hour highlight stay live.
  private _now = signal(new Date());
  now = this._now.asReadonly();
  nowHour   = computed(() => this._now().getHours());
  nowMinute = computed(() => this._now().getMinutes());
  nowTopPx  = computed(() => (this.nowHour() * 60 + this.nowMinute()) / 60 * this.HOUR_HEIGHT);
  nowLabel  = computed(() =>
    `${String(this.nowHour()).padStart(2, '0')}:${String(this.nowMinute()).padStart(2, '0')}`,
  );

  // Booking dialog state
  bookingVisible = signal(false);
  bookingHour = signal<number>(9);
  bookingMinute = signal<number>(0);
  bookingPatientId = signal<string | null>(null);
  bookingComplaint = signal('');
  bookingBusy = signal(false);
  bookingError = signal('');
  patients = this.patientStore.entities;
  patientOptions = computed(() =>
    this.patients().map(p => ({ label: `${p.fullName} · ${p.phone}`, value: p._id })),
  );
  bookingTimeLabel = computed(() =>
    `${String(this.bookingHour()).padStart(2, '0')}:${String(this.bookingMinute()).padStart(2, '0')}`,
  );

  // Scroll container ref so we can center on current time after mount.
  scrollRef = viewChild<ElementRef<HTMLDivElement>>('dayScroll');

  today = signal(new Date());
  viewMode = signal<'day' | 'week'>('day');
  statusFilter = signal<'all' | AppointmentStatus>('all');
  selectedId = signal<string | null>(null);

  viewModeOptions = [
    { label: 'Day',  value: 'day'  as const },
    { label: 'Week', value: 'week' as const },
  ];

  statusOptions = [
    { label: 'All statuses',     value: 'all'             },
    { label: 'Waiting',          value: 'waiting'         },
    { label: 'In consultation',  value: 'in_consultation' },
    { label: 'Done',             value: 'done'            },
    { label: 'No-show',          value: 'no_show'         },
    { label: 'Cancelled',        value: 'cancelled'       },
  ];

  dateLabel = computed(() =>
    this.today().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }),
  );

  filteredQueue = computed<QueueItem[]>(() => {
    const f = this.statusFilter();
    const q = this.queue();
    if (f === 'all') return q;
    return q.filter(item => item.status === f);
  });

  selectedAppointment = computed<QueueItem | null>(() => {
    const id = this.selectedId();
    const q = this.queue();
    if (id) return q.find(x => x._id === id) ?? null;
    return q[0] ?? null;
  });

  // ── KPIs ──
  totalAppointments = computed(() => this.queue().length);
  noShowsCount      = computed(() => this.queue().filter(q => q.status === 'no_show').length);
  arrivedCount      = computed(() => this.queue().filter(q => q.status === 'waiting' || q.status === 'in_consultation').length);
  doneCount         = computed(() => this.queue().filter(q => q.status === 'done').length);
  expectedRevenueN  = computed(() => this.totalAppointments() * 800);
  collectedRevenueN = computed(() => this.doneCount() * 800);
  expectedRevenue   = computed(() => formatCurrency(this.expectedRevenueN()));
  collectedRevenue  = computed(() => formatCurrency(this.collectedRevenueN()));
  summarySubtitle   = computed(() => `${this.totalAppointments()} appointments · ${this.expectedRevenue()} expected`);

  // ── Mock data slices ──
  trend    = signal<TrendPoint[]>(MOCK_TREND);
  waitlist = signal<WaitlistEntry[]>(MOCK_WAITLIST);
  tomorrow = signal<TomorrowSlot[]>(MOCK_TOMORROW);

  vitalTiles = computed<VitalTile[]>(() => [
    { key: 'bp',     label: 'BP',     value: '142/92', unit: 'mmHg', delta: '↑ High',     tone: 'danger' },
    { key: 'pulse',  label: 'Pulse',  value: '78',     unit: 'bpm',  delta: 'Normal',     tone: 'normal' },
    { key: 'spo2',   label: 'SpO₂',   value: '98',     unit: '%',    delta: 'Normal',     tone: 'normal' },
    { key: 'temp',   label: 'Temp',   value: '98.4',   unit: '°F',   delta: 'Normal',     tone: 'normal' },
    { key: 'weight', label: 'Weight', value: '72 kg',                delta: 'Δ +1.2 kg',  tone: 'normal' },
    { key: 'bmi',    label: 'BMI',    value: '26.4',                 delta: 'Overweight', tone: 'warn'   },
  ]);

  // ── Status helpers ──
  statusLabel(status: string): string {
    const m: Record<string, string> = {
      waiting: 'Arrived', in_consultation: 'In consultation',
      done: 'Done', cancelled: 'Cancelled', no_show: 'No-show',
    };
    return m[status] ?? status;
  }

  /** CSS modifier class for a slot (controls tint + accent bar). */
  slotTone(status: string, type?: string): string {
    if (status === 'done')      return 'tone-done';
    if (status === 'no_show')   return 'tone-danger';
    if (status === 'cancelled') return 'tone-done';
    if (status === 'in_consultation' || status === 'waiting') return 'tone-warn';
    if (type && /video|telehealth/i.test(type)) return 'tone-indigo';
    return 'tone-primary';
  }

  /** Quick patient-card summary used in the schedule list. */
  ageGender(item: QueueItem): string {
    // Not present on QueueItem today — fall back to a short derived string.
    const first = item.patientName.split(' ')[0];
    return first ? `${first}` : item.patientUid;
  }

  feeForItem(_item: QueueItem): string {
    return '₹800';
  }

  selectedSubtitle = computed(() => {
    const s = this.selectedAppointment();
    if (!s) return '';
    return `${s.scheduledTime} · ${this.statusLabel(s.status)} · ${s.type}`;
  });

  selectedInitials = computed(() => {
    const s = this.selectedAppointment();
    if (!s) return '—';
    const parts = s.patientName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return s.patientName.substring(0, 2).toUpperCase();
  });

  ngOnInit(): void {
    this.appointmentStore.loadTodayQueue();
    this.patientStore.loadAll();

    // Live "Now" line: re-tick every 60s.
    const tick = setInterval(() => this._now.set(new Date()), 60_000);
    this.destroyRef.onDestroy(() => clearInterval(tick));

    // Scroll day-grid so current time sits roughly in the middle of the view.
    afterNextRender(() => {
      const el = this.scrollRef()?.nativeElement;
      if (!el) return;
      const target = this.nowTopPx() - el.clientHeight / 2;
      el.scrollTo({ top: Math.max(0, target), behavior: 'instant' as ScrollBehavior });
    }, { injector: this.injector });
  }

  selectAppointment(id: string): void { this.selectedId.set(id); }
  goToday(): void { this.today.set(new Date()); }
  goPrev(): void  { const d = new Date(this.today()); d.setDate(d.getDate() - 1); this.today.set(d); }
  goNext(): void  { const d = new Date(this.today()); d.setDate(d.getDate() + 1); this.today.set(d); }

  // ── Day-grid math ──

  /** Parse "HH:mm" (24h) into minutes since midnight. Returns -1 on parse failure. */
  private parseTimeToMinutes(t: string): number {
    const m = /^(\d{1,2}):(\d{2})/.exec(t ?? '');
    if (!m) return -1;
    const h = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    if (isNaN(h) || isNaN(mm)) return -1;
    return h * 60 + mm;
  }

  appointmentTopPx(item: QueueItem): number {
    const mins = this.parseTimeToMinutes(item.scheduledTime);
    return (mins < 0 ? 0 : mins) / 60 * this.HOUR_HEIGHT;
  }

  /** Appointments default to a 30-minute block visually. */
  appointmentHeightPx(_item: QueueItem): number {
    return this.HOUR_HEIGHT - 6;
  }

  gridTotalHeightPx = computed(() => 24 * this.HOUR_HEIGHT);

  hourLabel(h: number): string {
    const hh = String(h).padStart(2, '0');
    return `${hh}:00`;
  }

  isNowHour(h: number): boolean {
    return h === this.nowHour();
  }

  // ── Booking dialog ──

  openBookingAt(hour: number, minute = 0): void {
    this.bookingHour.set(hour);
    this.bookingMinute.set(minute);
    this.bookingPatientId.set(null);
    this.bookingComplaint.set('');
    this.bookingError.set('');
    this.bookingVisible.set(true);
  }

  closeBooking(): void {
    this.bookingVisible.set(false);
  }

  // ── Demo seeder ──
  //
  // Creates a handful of patients + appointments with varied statuses so every
  // visual tier of the schedule page (waiting, in-consultation, done,
  // no-show, cancelled, telehealth) is exercised end-to-end. Intended for
  // development only; safe to re-run — each run creates fresh records with
  // unique phone numbers.
  seeding = signal(false);
  seedError = signal('');

  async seedDemoData(): Promise<void> {
    if (this.seeding()) return;
    this.seeding.set(true);
    this.seedError.set('');

    const base = 7_000_000_000 + (Date.now() % 900_000_000);
    const patients = [
      { name: 'Ramesh Kumar',   gender: 'male'   as const, dob: '1983-05-12' },
      { name: 'Anita Desai',    gender: 'female' as const, dob: '1987-03-12' },
      { name: 'Suresh Iyer',    gender: 'male'   as const, dob: '1969-11-24' },
      { name: 'Prakash Reddy',  gender: 'male'   as const, dob: '1964-07-02' },
      { name: 'Meera Nair',     gender: 'female' as const, dob: '1996-09-18' },
      { name: 'Kavita Patel',   gender: 'female' as const, dob: '1991-01-05' },
      { name: 'Arjun Mehta',    gender: 'male'   as const, dob: '1978-10-30' },
    ];

    const created: string[] = [];
    try {
      for (let i = 0; i < patients.length; i++) {
        const p = patients[i];
        const phone = `+91${String(base + i * 137).slice(0, 10)}`;
        // Generate a unique email to sidestep a legacy global unique index
        // on `email` that otherwise collides on repeated null values.
        const emailSlug = p.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
        const email = `${emailSlug}.${base + i}@demo.local`;
        const pc = await this.patientStore.create({
          fullName: p.name,
          phone,
          email,
          gender: p.gender,
          dateOfBirth: p.dob as unknown as string,
        });
        if (pc?._id) created.push(pc._id);
      }

      if (created.length < 4) {
        throw new Error('Could not create enough demo patients.');
      }

      const slots: { hour: number; min: number; complaint: string; status?: AppointmentStatus; patientIndex: number }[] = [
        { hour: 9,  min: 0,  complaint: 'Routine follow-up',            status: 'waiting',         patientIndex: 0 },
        { hour: 9,  min: 45, complaint: 'Chest tightness on exertion',  status: 'in_consultation', patientIndex: 1 },
        { hour: 10, min: 30, complaint: 'Telehealth follow-up',         status: 'waiting',         patientIndex: 2 },
        { hour: 11, min: 0,  complaint: 'Routine visit',                status: 'done',            patientIndex: 3 },
        { hour: 14, min: 0,  complaint: 'New patient — ECG review',     status: 'waiting',         patientIndex: 4 },
        { hour: 15, min: 0,  complaint: 'Tentative appointment',        status: 'cancelled',       patientIndex: 6 },
        { hour: 17, min: 0,  complaint: 'Follow-up',                    status: 'no_show',         patientIndex: 5 },
      ];

      for (const s of slots) {
        const pid = created[s.patientIndex];
        if (!pid) continue;
        const d = new Date();
        d.setHours(s.hour, s.min, 0, 0);
        const appt = await this.appointmentStore.createAppointment({
          patientId: pid,
          appointmentDate: d.toISOString(),
          chiefComplaint: s.complaint,
        });
        if (appt && s.status && s.status !== 'waiting') {
          await this.appointmentStore.updateStatus(appt._id, s.status);
        }
      }

      // Refresh so the queue reflects every status update.
      await this.appointmentStore.loadTodayQueue();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to seed demo data.';
      this.seedError.set(msg);
    } finally {
      this.seeding.set(false);
    }
  }

  async confirmBooking(): Promise<void> {
    const patientId = this.bookingPatientId();
    if (!patientId) {
      this.bookingError.set('Please pick a patient.');
      return;
    }
    this.bookingBusy.set(true);
    this.bookingError.set('');

    const d = new Date(this.today());
    d.setHours(this.bookingHour(), this.bookingMinute(), 0, 0);

    const created = await this.appointmentStore.createAppointment({
      patientId,
      appointmentDate: d.toISOString(),
      chiefComplaint: this.bookingComplaint().trim() || undefined,
    });

    this.bookingBusy.set(false);

    if (created) {
      this.bookingVisible.set(false);
    } else {
      this.bookingError.set('Could not create appointment. Please try again.');
    }
  }

  // ── Trend chart helpers (inline SVG) ──
  readonly chartW = 600;
  readonly chartH = 160;
  readonly chartPadX = 24;
  readonly chartPadY = 16;

  private scaleX(i: number): number {
    const pts = this.trend().length;
    if (pts <= 1) return this.chartPadX;
    return this.chartPadX + i * (this.chartW - this.chartPadX * 2) / (pts - 1);
  }

  private scaleY(v: number, min: number, max: number): number {
    const span = max - min || 1;
    const inner = this.chartH - this.chartPadY * 2;
    return this.chartPadY + inner - ((v - min) / span) * inner;
  }

  private linePath(values: number[], min: number, max: number): string {
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'}${this.scaleX(i).toFixed(1)},${this.scaleY(v, min, max).toFixed(1)}`).join(' ');
  }

  // Series bounds — keep one set so lines share vertical space proportionally.
  private get trendBounds() {
    const t = this.trend();
    const all = [
      ...t.map(p => p.bpSys), ...t.map(p => p.bpDia),
      ...t.map(p => p.pulse), ...t.map(p => p.weight),
    ];
    const min = Math.min(...all) - 10;
    const max = Math.max(...all) + 10;
    return { min, max };
  }

  pathBpSys  = computed(() => { const b = this.trendBounds; return this.linePath(this.trend().map(p => p.bpSys), b.min, b.max); });
  pathBpDia  = computed(() => { const b = this.trendBounds; return this.linePath(this.trend().map(p => p.bpDia), b.min, b.max); });
  pathPulse  = computed(() => { const b = this.trendBounds; return this.linePath(this.trend().map(p => p.pulse), b.min, b.max); });
  pathWeight = computed(() => { const b = this.trendBounds; return this.linePath(this.trend().map(p => p.weight), b.min, b.max); });

  pointsBpSys  = computed(() => { const b = this.trendBounds; return this.trend().map((p, i) => ({ x: this.scaleX(i), y: this.scaleY(p.bpSys, b.min, b.max) })); });
  pointsBpDia  = computed(() => { const b = this.trendBounds; return this.trend().map((p, i) => ({ x: this.scaleX(i), y: this.scaleY(p.bpDia, b.min, b.max) })); });
  pointsPulse  = computed(() => { const b = this.trendBounds; return this.trend().map((p, i) => ({ x: this.scaleX(i), y: this.scaleY(p.pulse, b.min, b.max) })); });
  pointsWeight = computed(() => { const b = this.trendBounds; return this.trend().map((p, i) => ({ x: this.scaleX(i), y: this.scaleY(p.weight, b.min, b.max) })); });

  labelXs = computed(() => this.trend().map((_p, i) => this.scaleX(i)));
}
