import { Injectable, signal, effect, inject, Injector, afterNextRender } from '@angular/core';
import { AuthStore } from '../stores/auth.store';
import type { ClinicBranding } from '../models';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'do-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private authStore = inject(AuthStore);
  private injector = inject(Injector);

  private _theme = signal<ThemeMode>('light');
  readonly theme = this._theme.asReadonly();

  private initialized = false;

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    afterNextRender(() => {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
      const brandingTheme = this.authStore.activeClinic()?.branding?.theme;
      const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      const initial: ThemeMode = stored ?? brandingTheme ?? (systemDark ? 'dark' : 'light');
      this._theme.set(initial);
      this.applyThemeToDom(initial);
    }, { injector: this.injector });

    effect(() => {
      const mode = this._theme();
      this.applyThemeToDom(mode);
    }, { injector: this.injector });

    effect(() => {
      const clinic = this.authStore.activeClinic();
      if (clinic?.branding) this.applyBranding(clinic.branding);
    }, { injector: this.injector });
  }

  setTheme(mode: ThemeMode): void {
    this._theme.set(mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch { /* ignore */ }
  }

  toggle(): void {
    this.setTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }

  applyBranding(branding: ClinicBranding): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const p = branding.primaryColor?.trim();
    const s = branding.secondaryColor?.trim();
    const a = branding.accentColor?.trim();
    if (p) {
      html.style.setProperty('--do-brand-primary', p);
      html.style.setProperty('--do-brand-primary-hover', this.shade(p, -12));
      html.style.setProperty('--do-brand-primary-contrast', this.contrastOn(p));
    }
    if (s) html.style.setProperty('--do-brand-secondary', s);
    if (a) html.style.setProperty('--do-brand-accent', a);
  }

  private applyThemeToDom(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset['theme'] = mode;
  }

  /** Picks `#ffffff` or `#0b1220` based on WCAG relative luminance of `hex`. */
  private contrastOn(hex: string): string {
    const { r, g, b } = this.hexToRgb(hex);
    const lum = this.relativeLuminance(r, g, b);
    return lum > 0.45 ? '#0b1220' : '#ffffff';
  }

  /** Shade a hex color by `percent` (-100..100). Negative darkens. */
  private shade(hex: string, percent: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    const p = percent / 100;
    const mix = (c: number) => Math.max(0, Math.min(255, Math.round(p < 0 ? c * (1 + p) : c + (255 - c) * p)));
    return '#' + [mix(r), mix(g), mix(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const m = hex.replace('#', '');
    const v = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    return {
      r: parseInt(v.slice(0, 2), 16),
      g: parseInt(v.slice(2, 4), 16),
      b: parseInt(v.slice(4, 6), 16),
    };
  }

  private relativeLuminance(r: number, g: number, b: number): number {
    const f = (v: number) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
}
