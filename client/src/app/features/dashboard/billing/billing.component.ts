import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InvoiceStore } from '../../../core/stores/invoice.store';
import { PatientStore } from '../../../core/stores/patient.store';
import { PaymentMode, PaymentStatus } from '../../../core/models';
import { formatCurrency } from '../../../core/utils/format';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, CardModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent implements OnInit {
  private invoiceStore = inject(InvoiceStore);
  private patientStore = inject(PatientStore);

  invoices = this.invoiceStore.listItems;
  showDialog = signal(false);

  patientOptions = computed(() =>
    this.patientStore.entities().map(p => ({
      label: `${p.fullName} (${p.patientUid})`,
      value: p._id,
    }))
  );

  form = {
    patientId: '',
    gstPercent: 0,
    discount: 0,
    paymentMode: '' as string,
    paymentStatus: '' as string,
    notes: '',
  };

  items = signal<InvoiceItem[]>([]);

  paymentModeOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'UPI', value: 'upi' },
    { label: 'Card', value: 'card' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'Other', value: 'other' },
  ];

  paymentStatusOptions = [
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Partial', value: 'partial' },
  ];

  todayRevenue = computed(() => formatCurrency(this.invoiceStore.totalRevenue()));
  invoicesToday = computed(() => this.invoices().length);
  pendingPayments = computed(() =>
    this.invoices().filter(inv => inv.paymentStatus === 'pending' || inv.paymentStatus === 'partial').length
  );

  subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.amount, 0)
  );

  gstAmount = computed(() =>
    Math.round(this.subtotal() * this.form.gstPercent / 100 * 100) / 100
  );

  total = computed(() =>
    this.subtotal() + this.gstAmount() - this.form.discount
  );

  ngOnInit(): void {
    this.invoiceStore.loadAll();
    this.patientStore.loadAll();
  }

  openNewInvoice(): void {
    this.form = { patientId: '', gstPercent: 0, discount: 0, paymentMode: '', paymentStatus: '', notes: '' };
    this.items.set([this.emptyItem()]);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  addItem(): void {
    this.items.update(list => [...list, this.emptyItem()]);
  }

  removeItem(index: number): void {
    this.items.update(list => list.filter((_, i) => i !== index));
  }

  updateItemAmount(item: InvoiceItem): void {
    item.amount = Math.round(item.quantity * item.unitPrice * 100) / 100;
    this.items.update(list => [...list]);
  }

  async saveInvoice(): Promise<void> {
    await this.invoiceStore.create({
      patientId: this.form.patientId,
      items: this.items().map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
      })),
      subtotal: this.subtotal(),
      gstPercent: this.form.gstPercent,
      gstAmount: this.gstAmount(),
      discount: this.form.discount,
      total: this.total(),
      paymentMode: this.form.paymentMode as PaymentMode,
      paymentStatus: this.form.paymentStatus as PaymentStatus,
      notes: this.form.notes || undefined,
    } as any);

    this.closeDialog();
  }

  fc(amount: number): string {
    return formatCurrency(amount);
  }

  getPaymentModeSeverity(mode: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (mode) {
      case 'cash': return 'success';
      case 'upi': return 'info';
      case 'card': return 'warn';
      case 'insurance': return 'contrast';
      default: return 'secondary';
    }
  }

  getPaymentStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warn';
      case 'partial': return 'info';
      default: return 'secondary';
    }
  }

  formatPaymentMode(mode: string): string {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  formatPaymentStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private emptyItem(): InvoiceItem {
    return { description: '', quantity: 1, unitPrice: 0, amount: 0 };
  }
}
