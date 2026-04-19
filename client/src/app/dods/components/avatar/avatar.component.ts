import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type DodsAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DodsAvatarShape = 'circle' | 'rounded';
export type DodsAvatarVariant =
  | 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'dods-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
})
export class DodsAvatarComponent {
  readonly name = input<string | null>(null);
  readonly src = input<string | null>(null);
  readonly alt = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly size = input<DodsAvatarSize>('md');
  readonly shape = input<DodsAvatarShape>('circle');
  readonly variant = input<DodsAvatarVariant | null>(null);

  readonly hostClass = computed(() => {
    const parts = [
      'dods-avatar',
      `dods-avatar--${this.size()}`,
      `dods-avatar--${this.shape()}`,
    ];
    const v = this.variant() ?? this.deriveVariant();
    parts.push(`dods-avatar--${v}`);
    return parts.join(' ');
  });

  readonly initials = computed(() => {
    const n = this.name()?.trim();
    if (!n) return '';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  private deriveVariant(): DodsAvatarVariant {
    const palette: DodsAvatarVariant[] = [
      'primary', 'secondary', 'accent', 'success', 'info', 'warning', 'danger', 'neutral',
    ];
    const name = this.name() ?? '';
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  }
}
