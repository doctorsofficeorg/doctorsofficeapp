import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type DodsButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success';

export type DodsButtonSize = 'sm' | 'md' | 'lg';
export type DodsButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'dods-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.dods-button-host]': 'true',
    '[class.dods-button-host--block]': 'block()',
  },
})
export class DodsButtonComponent {
  readonly variant = input<DodsButtonVariant>('primary');
  readonly size = input<DodsButtonSize>('md');
  readonly type = input<DodsButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly block = input(false, { transform: booleanAttribute });
  readonly leadingIcon = input<string | null>(null);
  readonly trailingIcon = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly pressed = output<MouseEvent>();

  readonly classList = computed(() => {
    const parts = [
      'dods-button',
      `dods-button--${this.variant()}`,
      `dods-button--${this.size()}`,
    ];
    if (this.loading()) parts.push('dods-button--loading');
    if (this.block()) parts.push('dods-button--block');
    return parts.join(' ');
  });

  onClick(event: MouseEvent) {
    if (this.disabled() || this.loading()) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    this.pressed.emit(event);
  }
}
