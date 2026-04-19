import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DodsSwitchSize = 'sm' | 'md' | 'lg';

let nextId = 0;

@Component({
  selector: 'dods-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DodsSwitchComponent),
      multi: true,
    },
  ],
})
export class DodsSwitchComponent implements ControlValueAccessor {
  readonly label = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<DodsSwitchSize>('md');

  readonly fieldId = `dods-switch-${++nextId}`;
  readonly checked = signal(false);

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: boolean | null): void { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  toggle() {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
