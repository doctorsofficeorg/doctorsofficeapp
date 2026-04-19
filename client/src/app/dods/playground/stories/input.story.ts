import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsInputComponent } from '../../components/input';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'type', label: 'Type', type: 'select', defaultValue: 'text', options: [
    { value: 'text', label: 'text' }, { value: 'email', label: 'email' },
    { value: 'password', label: 'password' }, { value: 'tel', label: 'tel' },
    { value: 'number', label: 'number' }, { value: 'search', label: 'search' },
  ]},
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Mobile number' },
  { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: '' },
  { key: 'hint', label: 'Hint', type: 'text', defaultValue: 'We will send a 6-digit OTP.' },
  { key: 'error', label: 'Error', type: 'text', defaultValue: '' },
  { key: 'prefix', label: 'Prefix', type: 'text', defaultValue: '+91' },
  { key: 'suffix', label: 'Suffix', type: 'text', defaultValue: '' },
  { key: 'leadingIcon', label: 'Leading icon', type: 'text', defaultValue: '' },
  { key: 'trailingIcon', label: 'Trailing icon', type: 'text', defaultValue: '' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-input',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Input"
      description="Single-line text input with glass inset, floating label, prefix/suffix, icons, and error state."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-input
            [type]="s.prop('type')"
            [size]="s.prop('size')"
            [label]="s.prop('label') || null"
            [placeholder]="s.prop('placeholder')"
            [hint]="s.prop('hint') || null"
            [error]="s.prop('error') || null"
            [prefix]="s.prop('prefix') || null"
            [suffix]="s.prop('suffix') || null"
            [leadingIcon]="s.prop('leadingIcon') || null"
            [trailingIcon]="s.prop('trailingIcon') || null"
            [disabled]="s.prop('disabled')"
            [required]="s.prop('required')"
          />
        </div>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Sizes</h3>
        <div class="dods-story-col">
          <dods-input size="sm" label="Small" />
          <dods-input size="md" label="Medium" />
          <dods-input size="lg" label="Large" />
        </div>
        <h3 class="dods-story-variants-title">States</h3>
        <div class="dods-story-col">
          <dods-input label="Normal" hint="Helper text" />
          <dods-input label="Error" error="Phone is invalid" />
          <dods-input label="Disabled" disabled />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsInputStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-input
  label="Mobile number"
  prefix="+91"
  type="tel"
  [formControl]="phone"
/>`;
  readonly s = createStoryState(controls);
}
