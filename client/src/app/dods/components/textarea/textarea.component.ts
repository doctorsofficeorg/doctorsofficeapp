import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DodsTextareaSize = 'sm' | 'md' | 'lg';

let nextId = 0;

@Component({
  selector: 'dods-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DodsTextareaComponent),
      multi: true,
    },
  ],
})
export class DodsTextareaComponent implements ControlValueAccessor {
  readonly label = input<string | null>(null);
  readonly placeholder = input<string>('');
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly size = input<DodsTextareaSize>('md');
  readonly rows = input<number>(3);
  readonly maxRows = input<number>(10);
  readonly autoResize = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });

  readonly fieldId = `dods-textarea-${++nextId}`;
  readonly focused = signal(false);
  readonly value = signal<string>('');

  readonly hasFloating = computed(() => !!this.label());
  readonly showFloatingUp = computed(
    () => this.hasFloating() && (this.focused() || !!this.value() || !!this.placeholder())
  );

  private readonly ta = viewChild<ElementRef<HTMLTextAreaElement>>('ta');

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => this.resize());
  }

  writeValue(v: string | null): void {
    this.value.set(v ?? '');
    queueMicrotask(() => this.resize());
  }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  onInput(event: Event) {
    const v = (event.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.onChange(v);
    this.resize();
  }

  onFocus() { this.focused.set(true); }
  onBlur()  { this.focused.set(false); this.onTouched(); }

  private resize() {
    if (!this.autoResize()) return;
    const el = this.ta()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * this.maxRows();
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }
}
