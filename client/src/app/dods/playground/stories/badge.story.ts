import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsBadgeComponent } from '../../components/badge';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: [
    { value: 'neutral', label: 'neutral' }, { value: 'primary', label: 'primary' },
    { value: 'success', label: 'success' }, { value: 'warning', label: 'warning' },
    { value: 'danger', label: 'danger' },   { value: 'info', label: 'info' },
  ]},
  { key: 'styleMode', label: 'Style', type: 'select', defaultValue: 'soft', options: [
    { value: 'soft', label: 'soft' }, { value: 'solid', label: 'solid' }, { value: 'outline', label: 'outline' },
  ]},
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'In consultation' },
  { key: 'dot', label: 'Show dot', type: 'boolean', defaultValue: true },
  { key: 'icon', label: 'Icon', type: 'text', defaultValue: '' },
];

@Component({
  selector: 'dods-story-badge',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Badge"
      description="Compact status label. Soft (tinted), solid, or outline variants."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-badge
          [variant]="s.prop('variant')"
          [styleMode]="s.prop('styleMode')"
          [size]="s.prop('size')"
          [dot]="s.prop('dot')"
          [icon]="s.prop('icon') || null"
        >{{ s.prop('label') || 'Status' }}</dods-badge>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Soft</h3>
        <div class="dods-story-row">
          <dods-badge variant="primary" dot>In progress</dods-badge>
          <dods-badge variant="success" dot>Completed</dods-badge>
          <dods-badge variant="warning" dot>Pending</dods-badge>
          <dods-badge variant="danger" dot>Failed</dods-badge>
          <dods-badge variant="info" dot>New</dods-badge>
          <dods-badge variant="neutral" dot>Draft</dods-badge>
        </div>
        <h3 class="dods-story-variants-title">Solid</h3>
        <div class="dods-story-row">
          <dods-badge styleMode="solid" variant="primary">Primary</dods-badge>
          <dods-badge styleMode="solid" variant="success">Paid</dods-badge>
          <dods-badge styleMode="solid" variant="danger">Unpaid</dods-badge>
        </div>
        <h3 class="dods-story-variants-title">Outline</h3>
        <div class="dods-story-row">
          <dods-badge styleMode="outline" variant="primary">Primary</dods-badge>
          <dods-badge styleMode="outline" variant="warning">Warning</dods-badge>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsBadgeStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-badge variant="success" dot>Paid</dods-badge>`;
  readonly s = createStoryState(controls);
}
