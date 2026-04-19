import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DodsInputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';
export type DodsInputSize = 'sm' | 'md' | 'lg';

let nextId = 0;

@Component({
  selector: 'dods-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DodsInputComponent),
      multi: true,
    },
  ],
})
export class DodsInputComponent implements ControlValueAccessor {
  readonly type = input<DodsInputType>('text');
  readonly size = input<DodsInputSize>('md');
  readonly label = input<string | null>(null);
  readonly placeholder = input<string>('');
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly prefix = input<string | null>(null);
  readonly suffix = input<string | null>(null);
  readonly leadingIcon = input<string | null>(null);
  readonly trailingIcon = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly autocomplete = input<string>('off');

  readonly fieldId = `dods-input-${++nextId}`;
  readonly focused = signal(false);
  readonly value = signal<string>('');

  readonly hasFloating = computed(() => !!this.label());
  readonly showFloatingUp = computed(
    () => this.hasFloating() && (this.focused() || !!this.value() || !!this.placeholder())
  );

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(_isDisabled: boolean): void {
    // handled via `disabled()` input + host state; intentional no-op
  }

  onInput(event: Event) {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  onFocus() {
    this.focused.set(true);
  }

  onBlur() {
    this.focused.set(false);
    this.onTouched();
  }
}
