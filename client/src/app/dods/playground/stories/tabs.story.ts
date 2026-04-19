import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DodsTabsComponent, DodsTabItem } from '../../components/tabs';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'segmented', options: [
    { value: 'segmented', label: 'segmented (iOS)' },
    { value: 'underline', label: 'underline' },
    { value: 'pill', label: 'pill' },
  ]},
  { key: 'fullWidth', label: 'Full width', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-tabs',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Tabs"
      description="iOS-style segmented control plus underline and pill variants."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-tabs
            [tabs]="tabs"
            [value]="active()"
            [variant]="s.prop('variant')"
            [fullWidth]="s.prop('fullWidth')"
            (valueChange)="active.set($event)"
          />
          <div style="padding: var(--dods-space-3); color: var(--dods-text-secondary); font-size: var(--dods-font-size-sm);">
            Selected: <strong>{{ active() }}</strong>
          </div>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsTabsStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-tabs [tabs]="tabs" [value]="active()" (valueChange)="active.set($event)" />`;
  readonly s = createStoryState(controls);
  readonly active = signal<string>('queue');
  readonly tabs: DodsTabItem<string>[] = [
    { value: 'queue', label: 'Queue', icon: 'pi pi-users' },
    { value: 'day',   label: 'Day',   icon: 'pi pi-calendar', badge: '12' },
    { value: 'week',  label: 'Week',  icon: 'pi pi-calendar-plus' },
    { value: 'month', label: 'Month', icon: 'pi pi-th-large', disabled: true },
  ];
}
