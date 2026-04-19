import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsProgressBarComponent } from '../../components/progress-bar';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'value', label: 'Value', type: 'number', defaultValue: 40, min: 0, max: 100 },
  { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: [
    { value: 'primary', label: 'primary' }, { value: 'success', label: 'success' },
    { value: 'warning', label: 'warning' }, { value: 'danger', label: 'danger' },
    { value: 'info', label: 'info' },
  ]},
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Appointments filled' },
  { key: 'showValue', label: 'Show value', type: 'boolean', defaultValue: true },
  { key: 'indeterminate', label: 'Indeterminate', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-progress-bar',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Progress bar"
      description="Linear progress. Supports determinate and indeterminate modes."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-progress-bar
            [value]="s.prop('value')"
            [variant]="s.prop('variant')"
            [size]="s.prop('size')"
            [label]="s.prop('label') || null"
            [showValue]="s.prop('showValue')"
            [indeterminate]="s.prop('indeterminate')"
          />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsProgressBarStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-progress-bar [value]="40" label="Appointments" showValue />`;
  readonly s = createStoryState(controls);
}
