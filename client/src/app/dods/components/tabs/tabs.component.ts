import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

export interface DodsTabItem<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string;
}

export type DodsTabsVariant = 'segmented' | 'underline' | 'pill';

@Component({
  selector: 'dods-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
})
export class DodsTabsComponent<T = string> {
  readonly tabs = input<DodsTabItem<T>[]>([]);
  readonly value = input<T | null>(null);
  readonly variant = input<DodsTabsVariant>('segmented');
  readonly fullWidth = input(false, { transform: booleanAttribute });

  readonly valueChange = output<T>();

  readonly active = signal<T | null>(null);

  constructor() {
    effect(() => { this.active.set(this.value()); });
  }

  readonly hostClass = computed(() => {
    const parts = ['dods-tabs', `dods-tabs--${this.variant()}`];
    if (this.fullWidth()) parts.push('dods-tabs--full');
    return parts.join(' ');
  });

  select(tab: DodsTabItem<T>) {
    if (tab.disabled) return;
    this.active.set(tab.value);
    this.valueChange.emit(tab.value);
  }
}
