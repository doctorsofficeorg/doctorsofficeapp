import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DodsTextareaComponent } from '../../components/textarea';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'Notes' },
  { key: 'placeholder', label: 'Placeholder', type: 'text', defaultValue: 'Type doctor’s observations…' },
  { key: 'hint', label: 'Hint', type: 'text', defaultValue: '' },
  { key: 'error', label: 'Error', type: 'text', defaultValue: '' },
  { key: 'rows', label: 'Rows', type: 'number', defaultValue: 3, min: 1, max: 20 },
  { key: 'autoResize', label: 'Auto resize', type: 'boolean', defaultValue: true },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
  { key: 'required', label: 'Required', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-textarea',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsTextareaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Textarea"
      description="Multi-line text input. Auto-resizes to content up to maxRows."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <div class="dods-story-stack">
          <dods-textarea
            [label]="s.prop('label') || null"
            [placeholder]="s.prop('placeholder')"
            [hint]="s.prop('hint') || null"
            [error]="s.prop('error') || null"
            [rows]="s.prop('rows')"
            [autoResize]="s.prop('autoResize')"
            [disabled]="s.prop('disabled')"
            [required]="s.prop('required')"
          />
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsTextareaStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-textarea label="Notes" [autoResize]="true" />`;
  readonly s = createStoryState(controls);
}
