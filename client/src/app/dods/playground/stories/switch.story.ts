import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsSwitchComponent } from '../../components/switch';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Allow WhatsApp reminders' },
  { key: 'description', label: 'Description', type: 'text', defaultValue: 'Send appointment reminders the day before.' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-switch',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Switch"
      description="iOS-style toggle with spring motion. Use for on/off settings."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-switch
          [size]="s.prop('size')"
          [label]="s.prop('label') || null"
          [description]="s.prop('description') || null"
          [disabled]="s.prop('disabled')"
        />
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Sizes</h3>
        <div class="dods-story-col">
          <dods-switch size="sm" label="Small" />
          <dods-switch size="md" label="Medium" />
          <dods-switch size="lg" label="Large" />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsSwitchStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-switch label="Notifications" [(ngModel)]="enabled" />`;
  readonly s = createStoryState(controls);
}
