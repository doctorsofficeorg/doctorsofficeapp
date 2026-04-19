import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsButtonComponent } from '../../components/button';
import { DodsTooltipDirective } from '../../components/tooltip';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'This action is non-reversible' },
  { key: 'placement', label: 'Placement', type: 'select', defaultValue: 'top', options: [
    { value: 'top', label: 'top' }, { value: 'bottom', label: 'bottom' },
    { value: 'left', label: 'left' }, { value: 'right', label: 'right' },
  ]},
  { key: 'delay', label: 'Delay (ms)', type: 'number', defaultValue: 150, min: 0, step: 50 },
];

@Component({
  selector: 'dods-story-tooltip',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsButtonComponent, DodsTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Tooltip"
      description="Glass tooltip attached via the dodsTooltip directive. Hover or focus the trigger."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-button
          variant="secondary"
          [dodsTooltip]="s.prop('label')"
          [placement]="s.prop('placement')"
          [delay]="s.prop('delay')"
        >
          Hover me
        </dods-button>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Placements</h3>
        <div class="dods-story-row">
          <dods-button variant="ghost" dodsTooltip="Top (default)" placement="top">Top</dods-button>
          <dods-button variant="ghost" dodsTooltip="Bottom" placement="bottom">Bottom</dods-button>
          <dods-button variant="ghost" dodsTooltip="Left" placement="left">Left</dods-button>
          <dods-button variant="ghost" dodsTooltip="Right" placement="right">Right</dods-button>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsTooltipStoryComponent {
  readonly controls = controls;
  readonly snippet = `<button dodsTooltip="Save as draft" placement="top">Save</button>`;
  readonly s = createStoryState(controls);
}
