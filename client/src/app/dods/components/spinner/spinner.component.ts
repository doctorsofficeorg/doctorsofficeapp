import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DodsSpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type DodsSpinnerTone = 'primary' | 'neutral' | 'inverse';

@Component({
  selector: 'dods-spinner',
  standalone: true,
  template: `
    <span class="dods-spinner__ring" aria-hidden="true"></span>
    @let _label = label();
    @if (_label) { <span class="dods-spinner__label">{{ _label }}</span> }
  `,
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    'role': 'status',
    '[attr.aria-label]': 'label() ?? "Loading"',
  },
})
export class DodsSpinnerComponent {
  readonly size = input<DodsSpinnerSize>('md');
  readonly tone = input<DodsSpinnerTone>('primary');
  readonly label = input<string | null>(null);

  readonly hostClass = computed(() =>
    `dods-spinner dods-spinner--${this.size()} dods-spinner--${this.tone()}`
  );
}
