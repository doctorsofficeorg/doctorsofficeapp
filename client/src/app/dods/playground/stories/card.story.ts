import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsCardComponent } from '../../components/card';
import { DodsButtonComponent } from '../../components/button';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'padding', label: 'Padding', type: 'select', defaultValue: 'md', options: [
    { value: 'none', label: 'none' }, { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'elevation', label: 'Elevation', type: 'select', defaultValue: 'standard', options: [
    { value: 'subtle', label: 'subtle' },
    { value: 'standard', label: 'standard' },
    { value: 'elevated', label: 'elevated' },
    { value: 'flat', label: 'flat' },
  ]},
  { key: 'interactive', label: 'Interactive (hover lift)', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-card',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsCardComponent, DodsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Card"
      description="Translucent glass surface for grouping content. Four elevation tiers, four padding sizes."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-card
          [padding]="s.prop('padding')"
          [elevation]="s.prop('elevation')"
          [interactive]="s.prop('interactive')"
          style="width: 320px"
        >
          <div dods-card-header>Patient visit</div>
          <p style="margin: 0; color: var(--dods-text-muted); font-size: var(--dods-font-size-sm);">
            Walk-in consultation scheduled for 10:30 am. Vitals recorded, awaiting doctor.
          </p>
          <div dods-card-footer>
            <dods-button variant="secondary" size="sm">Reassign</dods-button>
            <dods-button variant="primary" size="sm">Check in</dods-button>
          </div>
        </dods-card>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Elevations</h3>
        <div class="dods-story-col">
          <dods-card elevation="subtle">Subtle glass</dods-card>
          <dods-card elevation="standard">Standard glass</dods-card>
          <dods-card elevation="elevated">Elevated glass</dods-card>
          <dods-card elevation="flat">Flat solid</dods-card>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsCardStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-card elevation="standard" padding="md">
  <div dods-card-header>Patient visit</div>
  Walk-in consultation…
  <div dods-card-footer>
    <dods-button size="sm">Reassign</dods-button>
  </div>
</dods-card>`;
  readonly s = createStoryState(controls);
}
