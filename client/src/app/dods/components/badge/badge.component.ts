import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type DodsBadgeVariant =
  | 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type DodsBadgeStyle = 'soft' | 'solid' | 'outline';
export type DodsBadgeSize = 'sm' | 'md';

@Component({
  selector: 'dods-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
})
export class DodsBadgeComponent {
  readonly variant = input<DodsBadgeVariant>('neutral');
  readonly styleMode = input<DodsBadgeStyle>('soft');
  readonly size = input<DodsBadgeSize>('md');
  readonly dot = input(false, { transform: booleanAttribute });
  readonly icon = input<string | null>(null);

  readonly hostClass = computed(() => {
    const parts = [
      'dods-badge',
      `dods-badge--${this.variant()}`,
      `dods-badge--${this.styleMode()}`,
      `dods-badge--${this.size()}`,
    ];
    if (this.dot()) parts.push('dods-badge--with-dot');
    return parts.join(' ');
  });
}
