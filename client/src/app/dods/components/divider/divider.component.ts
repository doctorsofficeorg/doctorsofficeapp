import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DodsDividerOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'dods-divider',
  standalone: true,
  template: `
    @let _label = label();
    @if (_label) {
      <span class="dods-divider__line"></span>
      <span class="dods-divider__label">{{ _label }}</span>
      <span class="dods-divider__line"></span>
    } @else {
      <span class="dods-divider__line"></span>
    }
  `,
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()', 'role': 'separator' },
})
export class DodsDividerComponent {
  readonly orientation = input<DodsDividerOrientation>('horizontal');
  readonly label = input<string | null>(null);

  readonly hostClass = computed(() =>
    `dods-divider dods-divider--${this.orientation()}${this.label() ? ' dods-divider--labeled' : ''}`
  );
}
