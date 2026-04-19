import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DodsControlDef } from '../playground.types';
import { DodsControlsComponent } from '../controls/controls.component';

@Component({
  selector: 'dods-story-frame',
  standalone: true,
  imports: [DodsControlsComponent],
  templateUrl: './story-frame.component.html',
  styleUrls: ['./story-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodsStoryFrameComponent {
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly controls = input<DodsControlDef[]>([]);
  readonly state = input.required<Record<string, unknown>>();
  readonly snippet = input<string | null>(null);

  readonly changed = output<{ key: string; value: unknown }>();
  readonly reset = output<void>();
}
