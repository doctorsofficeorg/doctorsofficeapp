import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsAvatarComponent } from '../../components/avatar';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'name', label: 'Name', type: 'text', defaultValue: 'Dr. Aarav Mehta' },
  { key: 'src', label: 'Image URL', type: 'text', defaultValue: '' },
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'xs', label: 'xs' }, { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' }, { value: 'xl', label: 'xl' },
  ]},
  { key: 'shape', label: 'Shape', type: 'select', defaultValue: 'circle', options: [
    { value: 'circle', label: 'circle' }, { value: 'rounded', label: 'rounded' },
  ]},
  { key: 'variant', label: 'Color', type: 'select', defaultValue: '', options: [
    { value: '', label: 'auto from name' },
    { value: 'primary', label: 'primary' }, { value: 'secondary', label: 'secondary' },
    { value: 'accent', label: 'accent' },   { value: 'success', label: 'success' },
    { value: 'info', label: 'info' },       { value: 'warning', label: 'warning' },
    { value: 'danger', label: 'danger' },   { value: 'neutral', label: 'neutral' },
  ]},
  { key: 'icon', label: 'Icon class', type: 'text', defaultValue: '' },
];

@Component({
  selector: 'dods-story-avatar',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Avatar"
      description="User avatar. Falls back to initials derived from name; hash-assigns a variant if unset."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-avatar
          [name]="s.prop('name')"
          [src]="s.prop('src') || null"
          [size]="s.prop('size')"
          [shape]="s.prop('shape')"
          [variant]="s.prop('variant') || null"
          [icon]="s.prop('icon') || null"
        />
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Sizes</h3>
        <div class="dods-story-row">
          <dods-avatar name="Aarav Mehta" size="xs" />
          <dods-avatar name="Priya Shah"  size="sm" />
          <dods-avatar name="Rohan Das"   size="md" />
          <dods-avatar name="Kavita Rao"  size="lg" />
          <dods-avatar name="Vikram Iyer" size="xl" />
        </div>
        <h3 class="dods-story-variants-title">Hash-colored</h3>
        <div class="dods-story-row">
          <dods-avatar name="Aarav" />
          <dods-avatar name="Priya" />
          <dods-avatar name="Rohan" />
          <dods-avatar name="Kavita" />
          <dods-avatar name="Vikram" />
          <dods-avatar name="Meera" />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsAvatarStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-avatar name="Dr. Aarav Mehta" size="md" />`;
  readonly s = createStoryState(controls);
}
