import { Injectable, signal } from '@angular/core';

export type DodsToastSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface DodsToast {
  id: number;
  severity: DodsToastSeverity;
  title?: string;
  message: string;
  durationMs?: number;
  icon?: string;
}

export interface DodsToastInit {
  severity?: DodsToastSeverity;
  title?: string;
  message: string;
  durationMs?: number;
  icon?: string;
}

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class DodsToastService {
  private readonly _toasts = signal<DodsToast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(init: DodsToastInit): number {
    const id = ++nextId;
    const toast: DodsToast = {
      id,
      severity: init.severity ?? 'info',
      title: init.title,
      message: init.message,
      durationMs: init.durationMs ?? 4000,
      icon: init.icon,
    };
    this._toasts.update(list => [...list, toast]);
    if (toast.durationMs && toast.durationMs > 0) {
      setTimeout(() => this.dismiss(id), toast.durationMs);
    }
    return id;
  }

  success(message: string, title?: string) { return this.show({ severity: 'success', title, message }); }
  info(message: string, title?: string)    { return this.show({ severity: 'info', title, message }); }
  warning(message: string, title?: string) { return this.show({ severity: 'warning', title, message }); }
  danger(message: string, title?: string)  { return this.show({ severity: 'danger', title, message }); }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }
}
