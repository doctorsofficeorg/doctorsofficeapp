import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
} from '@angular/core';

export type DodsModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'dods-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DodsModalComponent {
  readonly open = input(false, { transform: booleanAttribute });
  readonly title = input<string | null>(null);
  readonly description = input<string | null>(null);
  readonly size = input<DodsModalSize>('md');
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  readonly showClose = input(true, { transform: booleanAttribute });

  readonly closed = output<void>();

  readonly panelClass = computed(() =>
    `dods-modal__panel dods-modal__panel--${this.size()}`
  );

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (typeof document === 'undefined') return;
      if (isOpen) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
    });
  }

  onBackdropClick() {
    if (this.closeOnBackdrop()) this.closed.emit();
  }

  onPanelClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) this.closed.emit();
  }

  close() { this.closed.emit(); }
}
