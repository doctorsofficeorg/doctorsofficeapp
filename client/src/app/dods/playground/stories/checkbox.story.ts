import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsCheckboxComponent } from '../../components/checkbox';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Send OTP via SMS' },
  { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  { key: 'indeterminate', label: 'Indeterminate', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-checkbox',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Checkbox"
      description="Binary toggle with an animated check stroke. Supports indeterminate state."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-checkbox
          [label]="s.prop('label') || null"
          [description]="s.prop('description') || null"
          [disabled]="s.prop('disabled')"
          [indeterminate]="s.prop('indeterminate')"
        />
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">States</h3>
        <div class="dods-story-col">
          <dods-checkbox label="Default" />
          <dods-checkbox label="Indeterminate" indeterminate />
          <dods-checkbox label="Disabled" disabled />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsCheckboxStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-checkbox label="I agree" [(ngModel)]="agreed" />`;
  readonly s = createStoryState(controls);
}
