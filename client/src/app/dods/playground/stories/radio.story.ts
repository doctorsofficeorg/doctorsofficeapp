import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsRadioComponent, DodsRadioOption } from '../../components/radio';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'orientation', label: 'Orientation', type: 'select', defaultValue: 'vertical', options: [
    { value: 'vertical', label: 'vertical' }, { value: 'horizontal', label: 'horizontal' },
  ]},
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
];

const options: DodsRadioOption<string>[] = [
  { value: 'upi',  label: 'UPI / GPay',    description: 'Instant settlement' },
  { value: 'card', label: 'Card',          description: 'Visa, Mastercard, Rupay' },
  { value: 'cash', label: 'Cash',          description: 'Record at counter' },
  { value: 'ins',  label: 'Insurance',     disabled: true },
];

@Component({
  selector: 'dods-story-radio',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsRadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Radio"
      description="Single-select option group. Orientation can be vertical or horizontal."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-radio
          [options]="options"
          [orientation]="s.prop('orientation')"
          [disabled]="s.prop('disabled')"
        />
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsRadioStoryComponent {
  readonly controls = controls;
  readonly options = options;
  readonly snippet = `<dods-radio [options]="methods" [(ngModel)]="method" />`;
  readonly s = createStoryState(controls);
}
