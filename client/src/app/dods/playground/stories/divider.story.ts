import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsDividerComponent } from '../../components/divider';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'orientation', label: 'Orientation', type: 'select', defaultValue: 'horizontal', options: [
    { value: 'horizontal', label: 'horizontal' }, { value: 'vertical', label: 'vertical' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Or' },
];

@Component({
  selector: 'dods-story-divider',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Divider"
      description="Thin rule to separate content. Optional uppercase label sits in the middle."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-divider
            [orientation]="s.prop('orientation')"
            [label]="s.prop('label') || null"
          />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsDividerStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-divider label="Or" />`;
  readonly s = createStoryState(controls);
}
