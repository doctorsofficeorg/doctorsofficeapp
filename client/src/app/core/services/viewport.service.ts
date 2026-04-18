import { Injectable, signal, computed, afterNextRender, Injector, inject } from '@angular/core';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BREAKPOINTS: Record<BreakpointName, number> = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private injector = inject(Injector);
  private _width = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);

  readonly width = this._width.asReadonly();
  readonly isMobile = computed(() => this._width() < BREAKPOINTS.md);
  readonly isTablet = computed(() => this._width() >= BREAKPOINTS.md && this._width() < BREAKPOINTS.lg);
  readonly isDesktop = computed(() => this._width() >= BREAKPOINTS.lg);
  readonly belowLg = computed(() => this._width() < BREAKPOINTS.lg);

  constructor() {
    afterNextRender(() => {
      const update = () => this._width.set(window.innerWidth);
      update();
      window.addEventListener('resize', update, { passive: true });
    }, { injector: this.injector });
  }
}
