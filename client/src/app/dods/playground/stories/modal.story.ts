import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DodsModalComponent } from '../../components/modal';
import { DodsButtonComponent } from '../../components/button';
import { DodsInputComponent } from '../../components/input';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'size', label: 'Size', type: 'select', defaultValue: 'md', options: [
    { value: 'sm', label: 'sm' }, { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' }, { value: 'xl', label: 'xl' },
  ]},
  { key: 'title', label: 'Title', type: 'text', defaultValue: 'Add a new patient' },
  { key: 'description', label: 'Description', type: 'text', defaultValue: 'Fill in details to register.' },
  { key: 'closeOnBackdrop', label: 'Close on backdrop', type: 'boolean', defaultValue: true },
  { key: 'showClose', label: 'Show close button', type: 'boolean', defaultValue: true },
];

@Component({
  selector: 'dods-story-modal',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsModalComponent, DodsButtonComponent, DodsInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Modal"
      description="Glass dialog with backdrop blur and spring entry. Dismiss via backdrop, close button, or Escape."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-button (pressed)="open.set(true)">Open modal</dods-button>
        <dods-modal
          [open]="open()"
          [size]="s.prop('size')"
          [title]="s.prop('title') || null"
          [description]="s.prop('description') || null"
          [closeOnBackdrop]="s.prop('closeOnBackdrop')"
          [showClose]="s.prop('showClose')"
          (closed)="open.set(false)"
        >
          <div style="display:flex; flex-direction:column; gap: var(--dods-space-3);">
            <dods-input label="Full name" placeholder="e.g. Aarav Mehta" />
            <dods-input label="Mobile" prefix="+91" type="tel" />
          </div>
          <div dods-modal-footer>
            <dods-button variant="ghost" (pressed)="open.set(false)">Cancel</dods-button>
            <dods-button variant="primary" (pressed)="open.set(false)">Register</dods-button>
          </div>
        </dods-modal>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsModalStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-modal [open]="open()" title="Register" (closed)="open.set(false)">
  <!-- content -->
</dods-modal>`;
  readonly s = createStoryState(controls);
  readonly open = signal(false);
}
