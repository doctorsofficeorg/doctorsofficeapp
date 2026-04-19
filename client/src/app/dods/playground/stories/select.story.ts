import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsSelectComponent, DodsSelectOption } from '../../components/select';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Specialization' },
  { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Pick a specialization' },
  { key: 'error', label: 'Error', type: 'text', defaultValue: '' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
];

const options: DodsSelectOption<string>[] = [
  { value: 'gp',   label: 'General Physician', icon: 'pi pi-user', description: 'MBBS, family medicine' },
  { value: 'card', label: 'Cardiologist',       icon: 'pi pi-heart' },
  { value: 'derm', label: 'Dermatologist',      icon: 'pi pi-sparkles' },
  { value: 'ortho', label: 'Orthopedic',        icon: 'pi pi-shield' },
  { value: 'peds', label: 'Pediatrician',       icon: 'pi pi-users', disabled: true },
];

@Component({
  selector: 'dods-story-select',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Select"
      description="Dropdown with a glass popover. Each option supports icons and descriptions."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-select
            [options]="options"
            [size]="s.prop('size')"
            [label]="s.prop('label') || null"
            [placeholder]="s.prop('placeholder')"
            [error]="s.prop('error') || null"
            [disabled]="s.prop('disabled')"
          />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsSelectStoryComponent {
  readonly controls = controls;
  readonly options = options;
  readonly snippet = `<dods-select [options]="specs" label="Specialization" [(ngModel)]="spec" />`;
  readonly s = createStoryState(controls);
}
