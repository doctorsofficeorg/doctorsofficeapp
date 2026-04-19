import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DodsButtonComponent } from '../../components/button';
import { DodsToastContainerComponent, DodsToastService } from '../../components/toast';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'severity', label: 'Severity', type: 'select', defaultValue: 'success', options: [
    { value: 'info', label: 'info' }, { value: 'success', label: 'success' },
    { value: 'warning', label: 'warning' }, { value: 'danger', label: 'danger' },
  ]},
  { key: 'title', label: 'Title', type: 'text', defaultValue: 'Saved' },
  { key: 'message', label: 'Message', type: 'text', defaultValue: 'Patient profile was updated.' },
  { key: 'durationMs', label: 'Duration (ms)', type: 'number', defaultValue: 4000, min: 0, step: 500 },
];

@Component({
  selector: 'dods-story-toast',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsButtonComponent, DodsToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Toast"
      description="Transient notifications. Inject DodsToastService and call success/info/warning/danger."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-button (pressed)="fire()">Trigger toast</dods-button>
      </div>
    </dods-story-frame>
    <dods-toast-container />
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsToastStoryComponent {
  readonly controls = controls;
  readonly snippet = `constructor(private toast: DodsToastService) {}
this.toast.success('Patient profile was updated.', 'Saved');`;
  readonly s = createStoryState(controls);
  private readonly toast = inject(DodsToastService);

  fire() {
    this.toast.show({
      severity: this.s.prop<any>('severity'),
      title: this.s.prop<string>('title') || undefined,
      message: this.s.prop<string>('message') || '',
      durationMs: this.s.prop<number>('durationMs') || undefined,
    });
  }
}
