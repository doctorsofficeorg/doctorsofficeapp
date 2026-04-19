import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type DodsProgressVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type DodsProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'dods-progress-bar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
})
export class DodsProgressBarComponent {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly variant = input<DodsProgressVariant>('primary');
  readonly size = input<DodsProgressSize>('md');
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly label = input<string | null>(null);
  readonly showValue = input(false, { transform: booleanAttribute });

  readonly percent = computed(() => {
    if (this.indeterminate()) return 0;
    const max = this.max() || 100;
    const v = Math.max(0, Math.min(max, this.value()));
    return (v / max) * 100;
  });

  readonly hostClass = computed(() => {
    const parts = [
      'dods-progress',
      `dods-progress--${this.variant()}`,
      `dods-progress--${this.size()}`,
    ];
    if (this.indeterminate()) parts.push('dods-progress--indeterminate');
    return parts.join(' ');
  });
}
