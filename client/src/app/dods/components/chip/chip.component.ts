import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type DodsChipVariant =
  | 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'dods-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
})
export class DodsChipComponent {
  readonly variant = input<DodsChipVariant>('neutral');
  readonly icon = input<string | null>(null);
  readonly removable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly removed = output<void>();

  readonly hostClass = computed(() => {
    const parts = ['dods-chip', `dods-chip--${this.variant()}`];
    if (this.disabled()) parts.push('dods-chip--disabled');
    return parts.join(' ');
  });

  onRemove(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled()) this.removed.emit();
  }
}
