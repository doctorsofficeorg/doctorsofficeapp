# DODS — Doctors Office Design System

Glass-UI component library for the Doctors Office app. iOS-inspired, themeable via CSS custom properties, built with Angular 21 standalone components and signals.

## At a glance

- **18 components** prefixed `dods-*`: button, card, input, textarea, select, checkbox, radio, switch, badge, chip, avatar, modal, toast, tooltip, tabs, divider, spinner, progress-bar.
- **Design tokens** exposed as CSS custom properties under `--dods-*`. Swap branding in one place and every component updates.
- **Glass mixins** (`dods-glass`, `dods-glass-subtle`, `dods-glass-elevated`, `dods-glass-inset`) compose backdrop blur, soft borders, highlight, and shadow in one call.
- **In-app playground** at `/dods` — sidebar navigation, per-component interactive controls, live preview, dark/light toggle. No external Storybook dependency.

## Folder layout

```
client/src/app/dods/
├── dods.scss              # Global entry (imported from styles.scss)
├── tokens/                # Color, typography, spacing, radius, shadows, blur, motion
├── mixins/                # glass-*, focus-ring, press-scale, hover-lift
├── components/            # One folder per component, barrel-exported from index.ts
└── playground/            # Storybook-style preview at /dods
    ├── shell/             # Sidebar + outlet
    ├── controls/          # Knobs renderer
    ├── story-frame/       # Frame wrapping preview + controls
    └── stories/           # One story per component + tokens + overview
```

## Using a component

Every component is standalone. Import it directly and drop it in a template:

```ts
import { DodsButtonComponent } from 'app/dods/components/button';

@Component({
  standalone: true,
  imports: [DodsButtonComponent],
  template: `<dods-button variant="primary" (pressed)="save()">Save</dods-button>`,
})
```

Or import everything:

```ts
import { DodsButtonComponent, DodsCardComponent } from 'app/dods';
```

## Theming

All colors live on `:root` under `--dods-*`. To rebrand a clinic, override the semantic tokens at the scope you care about:

```scss
.clinic-scope {
  --dods-brand-primary:          #b8005d;
  --dods-brand-primary-hover:    #96004c;
  --dods-brand-primary-contrast: #ffffff;
}
```

Dark mode swaps automatically via `[data-theme="dark"]` on `<html>`.

## Playground

Run `npm run dev` then visit **http://localhost:4200/dods**. Each component has:

- Live preview on a checkered glass surface
- A Controls panel with interactive knobs (same idea as Storybook args/controls)
- A Variants strip showing every state at a glance
- A copy-paste code snippet

The playground is only a feature route under `/dods` and ships with the app; migrating to real Storybook later is a drop-in if desired.

## Philosophy

- **Tokens over hardcodes.** Every color, shadow, and radius must go through a token.
- **Signals + OnPush everywhere.** No zone-reliant patterns.
- **Accessible by default.** Focus rings, ARIA, keyboard behavior are baked in.
- **Phase 2 only.** Existing feature pages still use PrimeNG/Bootstrap. DODS replaces them incrementally.
