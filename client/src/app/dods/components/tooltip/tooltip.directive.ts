import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  createComponent,
  inject,
  input,
} from '@angular/core';
import { DodsTooltipContentComponent } from './tooltip-content.component';

export type DodsTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[dodsTooltip]',
  standalone: true,
})
export class DodsTooltipDirective implements OnDestroy {
  private readonly appRef = inject(ApplicationRef);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  readonly dodsTooltip = input<string>('');
  readonly placement = input<DodsTooltipPlacement>('top');
  readonly delay = input<number>(150);

  private ref: ComponentRef<DodsTooltipContentComponent> | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter') onEnter() { this.scheduleShow(); }
  @HostListener('focus')       onFocus() { this.scheduleShow(); }
  @HostListener('mouseleave') onLeave() { this.hide(); }
  @HostListener('blur')        onBlur()  { this.hide(); }

  ngOnDestroy(): void {
    this.hide();
  }

  private scheduleShow() {
    if (!this.dodsTooltip()) return;
    this.clearTimer();
    this.showTimer = setTimeout(() => this.show(), this.delay());
  }

  private show() {
    if (this.ref) return;
    const ref = createComponent(DodsTooltipContentComponent, {
      environmentInjector: this.appRef.injector,
    });
    ref.setInput('label', this.dodsTooltip());
    ref.setInput('placement', this.placement());
    this.appRef.attachView(ref.hostView);
    const node = ref.location.nativeElement as HTMLElement;
    this.renderer.appendChild(document.body, node);
    this.ref = ref;
    queueMicrotask(() => this.position());
  }

  private position() {
    if (!this.ref) return;
    const tip = this.ref.location.nativeElement as HTMLElement;
    const trigger = this.el.nativeElement.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (this.placement()) {
      case 'top':
        top = trigger.top - tipRect.height - gap;
        left = trigger.left + trigger.width / 2 - tipRect.width / 2;
        break;
      case 'bottom':
        top = trigger.bottom + gap;
        left = trigger.left + trigger.width / 2 - tipRect.width / 2;
        break;
      case 'left':
        top = trigger.top + trigger.height / 2 - tipRect.height / 2;
        left = trigger.left - tipRect.width - gap;
        break;
      case 'right':
        top = trigger.top + trigger.height / 2 - tipRect.height / 2;
        left = trigger.right + gap;
        break;
    }

    tip.style.top = `${top + window.scrollY}px`;
    tip.style.left = `${left + window.scrollX}px`;
  }

  private hide() {
    this.clearTimer();
    if (!this.ref) return;
    this.appRef.detachView(this.ref.hostView);
    this.ref.destroy();
    this.ref = null;
  }

  private clearTimer() {
    if (this.showTimer != null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }
}
