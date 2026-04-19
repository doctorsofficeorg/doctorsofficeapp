import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DodsControlDef } from '../playground.types';

@Component({
  selector: 'dods-controls',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodsControlsComponent {
  readonly controls = input<DodsControlDef[]>([]);
  readonly state = input.required<Record<string, unknown>>();

  readonly changed = output<{ key: string; value: unknown }>();
  readonly reset = output<void>();

  readonly rows = computed(() =>
    this.controls().map(c => ({
      ...c,
      value: this.state()[c.key] ?? c.defaultValue,
    }))
  );

  onBool(key: string, event: Event) {
    this.changed.emit({ key, value: (event.target as HTMLInputElement).checked });
  }
  onText(key: string, event: Event) {
    this.changed.emit({ key, value: (event.target as HTMLInputElement).value });
  }
  onNumber(key: string, event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    this.changed.emit({ key, value: raw === '' ? null : Number(raw) });
  }
  onSelect(key: string, event: Event) {
    const el = event.target as HTMLSelectElement;
    const def = this.controls().find(c => c.key === key);
    const match = def?.options?.find(o => String(o.value) === el.value);
    this.changed.emit({ key, value: match?.value ?? el.value });
  }
  onColor(key: string, event: Event) {
    this.changed.emit({ key, value: (event.target as HTMLInputElement).value });
  }

  stringify(v: unknown): string {
    if (v == null) return '';
    return String(v);
  }
}
