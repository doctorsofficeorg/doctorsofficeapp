import { ChangeDetectionStrategy, Component } from '@angular/core';

const swatchGroups: { title: string; tokens: string[] }[] = [
  {
    title: 'Primary (teal)',
    tokens: ['primary-50', 'primary-100', 'primary-200', 'primary-300', 'primary-400',
             'primary-500', 'primary-600', 'primary-700', 'primary-800', 'primary-900'],
  },
  {
    title: 'Neutral',
    tokens: ['neutral-0', 'neutral-25', 'neutral-50', 'neutral-100', 'neutral-200', 'neutral-300',
             'neutral-400', 'neutral-500', 'neutral-600', 'neutral-700', 'neutral-800', 'neutral-900'],
  },
  {
    title: 'Feedback',
    tokens: ['success-500', 'warning-500', 'danger-500', 'info-500'],
  },
];

const spacingTokens = [
  'space-1', 'space-2', 'space-3', 'space-4', 'space-5',
  'space-6', 'space-8', 'space-10', 'space-12', 'space-16',
];

const radiusTokens = ['radius-xs', 'radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'radius-2xl', 'radius-3xl', 'radius-pill'];

const shadowTokens = ['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl',
                      'shadow-glass-subtle', 'shadow-glass', 'shadow-glass-elevated'];

@Component({
  selector: 'dods-story-tokens',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="dods-tk">
      <header>
        <h1>Design tokens</h1>
        <p>
          All tokens are CSS custom properties under <code>--dods-*</code>.
          Override them at <code>:root</code> or on a scoped element to rebrand the whole system.
        </p>
      </header>

      @for (g of swatchGroups; track g.title) {
        <section class="dods-tk__section">
          <h2>{{ g.title }}</h2>
          <div class="dods-tk__swatches">
            @for (t of g.tokens; track t) {
              <figure class="dods-tk__swatch">
                <span class="dods-tk__chip" [style.background]="'var(--dods-color-' + t + ')'"></span>
                <figcaption>
                  <strong>--dods-color-{{ t }}</strong>
                </figcaption>
              </figure>
            }
          </div>
        </section>
      }

      <section class="dods-tk__section">
        <h2>Spacing scale</h2>
        <ul class="dods-tk__list">
          @for (t of spacingTokens; track t) {
            <li>
              <span class="dods-tk__bar" [style.width]="'var(--dods-' + t + ')'"></span>
              <code>--dods-{{ t }}</code>
            </li>
          }
        </ul>
      </section>

      <section class="dods-tk__section">
        <h2>Radius</h2>
        <div class="dods-tk__radii">
          @for (t of radiusTokens; track t) {
            <div class="dods-tk__radius">
              <span class="dods-tk__radius-box" [style.borderRadius]="'var(--dods-' + t + ')'"></span>
              <code>--dods-{{ t }}</code>
            </div>
          }
        </div>
      </section>

      <section class="dods-tk__section">
        <h2>Shadows</h2>
        <div class="dods-tk__shadows">
          @for (t of shadowTokens; track t) {
            <div class="dods-tk__shadow">
              <span class="dods-tk__shadow-box" [style.boxShadow]="'var(--dods-' + t + ')'"></span>
              <code>--dods-{{ t }}</code>
            </div>
          }
        </div>
      </section>
    </article>
  `,
  styles: [`
    :host { display: block; }
    h1 {
      margin: 0 0 var(--dods-space-1);
      font-size: var(--dods-font-size-2xl);
      font-weight: var(--dods-font-weight-bold);
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 0 0 var(--dods-space-2);
      font-size: var(--dods-font-size-lg);
      font-weight: var(--dods-font-weight-semibold);
    }
    code {
      font-family: var(--dods-font-family-mono);
      font-size: var(--dods-font-size-xs);
      color: var(--dods-text-muted);
    }
    p { color: var(--dods-text-muted); max-width: 640px; }
    .dods-tk__section { margin-top: var(--dods-space-6); }
    .dods-tk__swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--dods-space-2);
    }
    .dods-tk__swatch {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .dods-tk__chip {
      display: block;
      height: 48px;
      border-radius: var(--dods-radius-md);
      border: 1px solid var(--dods-border-subtle);
    }
    .dods-tk__swatch figcaption strong {
      display: block;
      font-size: var(--dods-font-size-xs);
      font-family: var(--dods-font-family-mono);
      font-weight: var(--dods-font-weight-medium);
      color: var(--dods-text-secondary);
      word-break: break-all;
    }
    .dods-tk__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--dods-space-1);
    }
    .dods-tk__list li {
      display: flex;
      align-items: center;
      gap: var(--dods-space-3);
    }
    .dods-tk__bar {
      display: inline-block;
      height: 10px;
      background: var(--dods-brand-primary);
      border-radius: var(--dods-radius-pill);
    }
    .dods-tk__radii, .dods-tk__shadows {
      display: flex;
      flex-wrap: wrap;
      gap: var(--dods-space-4);
    }
    .dods-tk__radius, .dods-tk__shadow {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 110px;
    }
    .dods-tk__radius-box {
      width: 80px; height: 80px;
      background: linear-gradient(135deg, var(--dods-brand-primary), var(--dods-brand-secondary));
      box-shadow: var(--dods-shadow-sm);
    }
    .dods-tk__shadow-box {
      width: 80px; height: 80px;
      background: var(--dods-surface-solid);
      border-radius: var(--dods-radius-lg);
    }
  `],
})
export class DodsTokensStoryComponent {
  readonly swatchGroups = swatchGroups;
  readonly spacingTokens = spacingTokens;
  readonly radiusTokens = radiusTokens;
  readonly shadowTokens = shadowTokens;
}
