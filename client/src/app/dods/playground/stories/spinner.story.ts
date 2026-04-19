import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsSpinnerComponent } from '../../components/spinner';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'xs', label: 'xs' }, { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'tone', label: 'Tone', type: 'select', defaultValue: 'primary', options: [
    { value: 'primary', label: 'primary' }, { value: 'neutral', label: 'neutral' }, { value: 'inverse', label: 'inverse' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: '' },
];

@Component({
  selector: 'dods-story-spinner',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Spinner"
      description="Indeterminate loading indicator. Four sizes, three tones."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-spinner
          [size]="s.prop('size')"
          [tone]="s.prop('tone')"
          [label]="s.prop('label') || null"
        />
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Sizes</h3>
        <div class="dods-story-row">
          <dods-spinner size="xs" />
          <dods-spinner size="sm" />
          <dods-spinner size="md" />
          <dods-spinner size="lg" />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsSpinnerStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-spinner size="md" label="Saving…" />`;
  readonly s = createStoryState(controls);
}
