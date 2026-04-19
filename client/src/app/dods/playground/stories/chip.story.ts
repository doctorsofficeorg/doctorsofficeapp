import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DodsChipComponent } from '../../components/chip';
import { DodsControlDef } from '../playground.types';
import { DodsStoryFrameComponent } from '../story-frame/story-frame.component';
import { createStoryState } from '../story-base';

const controls: DodsControlDef[] = [
  { key: 'variant', label: 'Variant', type: 'select', defaultValue: 'primary', options: [
    { value: 'neutral', label: 'neutral' }, { value: 'primary', label: 'primary' },
    { value: 'success', label: 'success' }, { value: 'warning', label: 'warning' },
    { value: 'danger', label: 'danger' },   { value: 'info', label: 'info' },
  ]},
  { key: 'label', label: 'Label', type: 'text', defaultValue: 'fever' },
  { key: 'icon', label: 'Icon', type: 'text', defaultValue: 'pi pi-tag' },
  { key: 'removable', label: 'Removable', type: 'boolean', defaultValue: true },
  { key: 'disabled', label: 'Disabled', type: 'boolean', defaultValue: false },
];

@Component({
  selector: 'dods-story-chip',
  standalone: true,
  imports: [DodsStoryFrameComponent, DodsChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dods-story-frame
      title="Chip"
      description="Compact removable tag. Use for filters, symptoms, allergies, tags."
      [controls]="controls"
      [state]="s.state()"
      [snippet]="snippet"
      (changed)="s.onChange($event)"
      (reset)="s.onReset()"
    >
      <div dods-story-preview>
        <dods-chip
          [variant]="s.prop('variant')"
          [icon]="s.prop('icon') || null"
          [removable]="s.prop('removable')"
          [disabled]="s.prop('disabled')"
        >{{ s.prop('label') || 'fever' }}</dods-chip>
      </div>

      <div dods-story-variants>
        <h3 class="dods-story-variants-title">Tag cloud</h3>
        <div class="dods-story-row">
          @for (t of tags(); track t) {
            <dods-chip variant="primary" icon="pi pi-tag" removable (removed)="remove(t)">{{ t }}</dods-chip>
          }
        </div>
        <h3 class="dods-story-variants-title">Variants</h3>
        <div class="dods-story-row">
          <dods-chip variant="neutral">neutral</dods-chip>
          <dods-chip variant="primary">primary</dods-chip>
          <dods-chip variant="success">success</dods-chip>
          <dods-chip variant="warning">warning</dods-chip>
          <dods-chip variant="danger">danger</dods-chip>
          <dods-chip variant="info">info</dods-chip>
        </div>
      </div>
    </dods-story-frame>
  `,
  styleUrls: ['./_story-shared.scss'],
})
export class DodsChipStoryComponent {
  readonly controls = controls;
  readonly snippet = `<dods-chip variant="primary" removable (removed)="drop(tag)">fever</dods-chip>`;
  readonly s = createStoryState(controls);
  readonly tags = signal(['fever', 'cough', 'headache', 'diabetes', 'hypertension']);

  remove(t: string) { this.tags.update(list => list.filter(x => x !== t)); }
}
