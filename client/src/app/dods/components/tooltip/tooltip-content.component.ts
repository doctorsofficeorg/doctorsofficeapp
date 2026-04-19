import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { DodsTooltipPlacement } from './tooltip.directive';

@Component({
  selector: 'dods-tooltip-content',
  standalone: true,
  template: `<span>{{ label() }}</span>`,
  styleUrls: ['./tooltip-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    'role': 'tooltip',
  },
})
export class DodsTooltipContentComponent {
  readonly label = input<string>('');
  readonly placement = input<DodsTooltipPlacement>('top');

  readonly hostClass = computed(() => `dods-tooltip dods-tooltip--${this.placement()}`);
}
