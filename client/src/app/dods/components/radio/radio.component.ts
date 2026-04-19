import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DodsRadioOption<T = unknown> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

@Component({
  selector: 'dods-radio',
  standalone: true,
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DodsRadioComponent),
      multi: true,
    },
  ],
})
export class DodsRadioComponent<T = unknown> implements ControlValueAccessor {
  readonly options = input<DodsRadioOption<T>[]>([]);
  readonly name = input<string>('dods-radio');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  readonly value = signal<T | null>(null);

  private onChange: (v: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: T | null): void { this.value.set(v ?? null); }
  registerOnChange(fn: (v: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  select(opt: DodsRadioOption<T>) {
    if (opt.disabled || this.disabled()) return;
    this.value.set(opt.value);
    this.onChange(opt.value);
    this.onTouched();
  }
}
