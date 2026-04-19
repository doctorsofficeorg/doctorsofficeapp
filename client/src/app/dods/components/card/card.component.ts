import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type DodsCardPadding = 'none' | 'sm' | 'md' | 'lg';
export type DodsCardElevation = 'subtle' | 'standard' | 'elevated' | 'flat';

@Component({
  selector: 'dods-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class DodsCardComponent {
  readonly padding = input<DodsCardPadding>('md');
  readonly elevation = input<DodsCardElevation>('standard');
  readonly interactive = input(false, { transform: booleanAttribute });

  readonly hostClass = computed(() => {
    const parts = [
      'dods-card',
      `dods-card--pad-${this.padding()}`,
      `dods-card--${this.elevation()}`,
    ];
    if (this.interactive()) parts.push('dods-card--interactive');
    return parts.join(' ');
  });
}
