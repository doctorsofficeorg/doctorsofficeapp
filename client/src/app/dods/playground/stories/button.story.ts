import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsButtonComponent } from '../../components/button';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: [
    { value: 'primary', label: 'primary' },
    { value: 'secondary', label: 'secondary' },
    { value: 'ghost', label: 'ghost' },
    { value: 'danger', label: 'danger' },
    { value: 'success', label: 'success' },
  ]},
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Save changes' },
  { key: 'leadingIcon', label: 'Leading icon', type: 'text', defaultValue: '' },
  { key: 'trailingIcon', label: 'Trailing icon', type: 'text', defaultValue: '' },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  { key: 'loading', label: 'Loading', type: 'boolean', defaultValue: false },
  { key: 'block', label: 'Full width', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-button',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Button"
      description="Primary action trigger. Glass surface with spring press animation — five variants and three sizes."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-button
          [variant]="s.prop('variant')"
          [size]="s.prop('size')"
          [disabled]="s.prop('disabled')"
          [loading]="s.prop('loading')"
          [block]="s.prop('block')"
          [leadingIcon]="s.prop('leadingIcon') || null"
          [trailingIcon]="s.prop('trailingIcon') || null"
        >{{ s.prop('label') || 'Save changes' }}</dods-button>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Variants</h3>
        <div class="dods-story-row">
          <dods-button variant="primary">Primary</dods-button>
          <dods-button variant="secondary">Secondary</dods-button>
          <dods-button variant="ghost">Ghost</dods-button>
          <dods-button variant="danger">Danger</dods-button>
          <dods-button variant="success">Success</dods-button>
        </div>
        <h3 class="dods-story-variants-title">Sizes</h3>
        <div class="dods-story-row">
          <dods-button size="sm">Small</dods-button>
          <dods-button size="md">Medium</dods-button>
          <dods-button size="lg">Large</dods-button>
        </div>
        <h3 class="dods-story-variants-title">States</h3>
        <div class="dods-story-row">
          <dods-button loading>Loading</dods-button>
          <dods-button disabled>Disabled</dods-button>
          <dods-button leadingIcon="pi pi-check">With icon</dods-button>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsButtonStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-button variant="primary" size="md" (pressed)="save()">
  Save changes
</dods-button>`;
  readonly s = createStoryState(controls);
}
