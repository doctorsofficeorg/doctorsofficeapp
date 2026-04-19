import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DodsCardComponent } from '../../components/card';
import { DodsButtonComponent } from '../../components/button';
import { DodsBadgeComponent } from '../../components/badge';
import { STORY_INDEX } from '../story-index';

@Component({
  selector: 'dods-story-overview',
  standalone: true,
  imports: [RouterLink, DodsCardComponent, DodsButtonComponent, DodsBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="dods-overview">
      <header class="dods-overview__hero">
        <dods-badge variant="primary" styleMode="soft" dot>v1 • preview</dods-badge>
        <h1>DODS Design System</h1>
        <p>
          Glass UI components for Doctors Office. iOS-inspired, themeable via CSS custom properties,
          built with Angular 21 standalone components and signals.
        </p>
        <div class="dods-overview__cta">
          <dods-button [routerLink]="['/dods', 'button']" variant="primary" trailingIcon="pi pi-arrow-right">
            Start with Button
          </dods-button>
          <dods-button [routerLink]="['/dods', 'tokens']" variant="secondary" leadingIcon="pi pi-palette">
            Tokens
          </dods-button>
        </div>
      </header>

      <div class="dods-overview__grid">
        @for (item of items; track item.id) {
          <a class="dods-overview__card" [routerLink]="['/dods', item.id]">
            <dods-card elevation="subtle" interactive padding="md">
              <div class="dods-overview__card-head">
                @if (item.icon) { <i [class]="item.icon + ' dods-overview__icon'" aria-hidden="true"></i> }
                <span class="dods-overview__name">{{ item.name }}</span>
              </div>
              <p class="dods-overview__group">{{ item.group }}</p>
            </dods-card>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .dods-overview {
      display: flex;
      flex-direction: column;
      gap: var(--dods-space-8);
    }
    .dods-overview__hero {
      display: flex;
      flex-direction: column;
      gap: var(--dods-space-3);
      align-items: flex-start;
    }
    .dods-overview__hero h1 {
      margin: 0;
      font-size: var(--dods-font-size-4xl);
      font-weight: var(--dods-font-weight-bold);
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--dods-brand-primary), var(--dods-brand-secondary));
      -webkit-background-clip: text;
              background-clip: text;
      color: transparent;
    }
    .dods-overview__hero p {
      margin: 0;
      color: var(--dods-text-muted);
      max-width: 640px;
      font-size: var(--dods-font-size-md);
      line-height: var(--dods-line-height-snug);
    }
    .dods-overview__cta {
      display: flex;
      gap: var(--dods-space-2);
      margin-top: var(--dods-space-2);
    }
    .dods-overview__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: var(--dods-space-3);
    }
    .dods-overview__card { text-decoration: none; color: inherit; display: block; }
    .dods-overview__card-head {
      display: inline-flex;
      align-items: center;
      gap: var(--dods-space-2);
      font-weight: var(--dods-font-weight-semibold);
      color: var(--dods-text-primary);
    }
    .dods-overview__icon {
      color: var(--dods-brand-primary);
      font-size: 1.1rem;
    }
    .dods-overview__group {
      margin: 6px 0 0;
      font-size: var(--dods-font-size-xs);
      color: var(--dods-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  `],
})
export class DodsOverviewStoryComponent {
  readonly items = Object.entries(STORY_INDEX).map(([id, meta]) => ({ id, ...meta }));
}
