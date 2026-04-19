import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DodsSelectOption<T = unknown> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export type DodsSelectSize = 'sm' | 'md' | 'lg';

let nextId = 0;

@Component({
  selector: 'dods-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DodsSelectComponent),
      multi: true,
    },
  ],
})
export class DodsSelectComponent<T = unknown> implements ControlValueAccessor {
  readonly options = input<DodsSelectOption<T>[]>([]);
  readonly label = input<string | null>(null);
  readonly placeholder = input<string>('Select…');
  readonly size = input<DodsSelectSize>('md');
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  readonly fieldId = `dods-select-${++nextId}`;
  readonly open = signal(false);
  readonly value = signal<T | null>(null);

  readonly selectedOption = computed(() => {
    const v = this.value();
    return this.options().find(o => o.value === v) ?? null;
  });

  readonly host = viewChild<ElementRef<HTMLElement>>('host');

  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: T | null): void { this.value.set(v ?? null); }
  registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  toggle() {
    if (this.disabled()) return;
    this.open.update(v => !v);
  }

  selectOption(opt: DodsSelectOption<T>) {
    if (opt.disabled) return;
    this.value.set(opt.value);
    this.onChange(opt.value);
    this.open.set(false);
  }

  close() {
    if (this.open()) {
      this.open.set(false);
      this.onTouched();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const el = this.host()?.nativeElement;
    if (el && !el.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
