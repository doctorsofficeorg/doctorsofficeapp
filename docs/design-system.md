# Doctors Office — Design System

> **Glassmorphism, mobile-first, multi-tenant themeable.**
> Angular 21 + PrimeNG Aura + Bootstrap 5.

---

## 1. Philosophy

Doctors Office is used at the point of care — often on phones and tablets, by practitioners between appointments. The design language has three pillars:

1. **Mobile-first.** Every layout starts at 375px and grows up. No desktop-first media queries.
2. **Glass surfaces, calm base.** Panels are translucent with controlled blur. The base page is a muted aurora gradient that gives glass something to refract. Content is king — glass is the frame, never the subject.
3. **Clinical clarity.** WCAG AA contrast in both light and dark modes, even over translucent layers. Glass never compromises readability.

---

## 2. Token architecture

Tokens live in [`client/src/design-tokens/tokens.json`](../client/src/design-tokens/tokens.json), authored in [W3C Design Tokens format](https://tr.designtokens.org/) so the same source of truth drives both Figma (via Tokens Studio) and CSS.

Two layers:

| Layer | Purpose | Example |
|-------|---------|---------|
| `primitive` | Raw palette, scales, primitives. Shared across themes. | `primitive.color.teal.600` → `#0d9488` |
| `semantic/{light,dark}` | Meaning-bound aliases that reference primitives. Theme-dependent. | `semantic.dark.surface.glass` → `rgba(17,24,39,0.55)` |

A small Node script ([`client/scripts/build-tokens.mjs`](../client/scripts/build-tokens.mjs)) emits `client/src/app/styles/_tokens.scss` from the JSON. Run with:

```bash
cd client
npm run tokens          # regenerate
npm run tokens:check    # CI: fail if out of sync
```

Primitives render as `--do-color-*`, `--do-radius-*`, `--do-space-*` at `:root`. Semantics render as `--do-surface-*`, `--do-text-*`, `--do-brand-*` at `:root` (light) and `[data-theme="dark"]` (dark).

### Multi-tenant branding

Each clinic can override `--do-brand-primary`, `--do-brand-secondary`, and `--do-brand-accent` at runtime. The [`ThemeService`](../client/src/app/core/services/theme.service.ts) reads `AuthStore.activeClinic().branding` via an `effect()` and writes inline CSS variables on `<html>`. It also runs a WCAG luminance check on the clinic's primary color and auto-picks `--do-brand-primary-contrast` (black or white) for legibility on buttons.

---

## 3. Glass recipes

Four tiers, all driven by semantic tokens so dark mode swaps automatically.

| Tier | When to use | blur | saturate | Light bg | Dark bg |
|------|-------------|------|----------|----------|---------|
| `glass-subtle`   | Stat cards, list rows, tags | 12px | 140% | `rgba(255,255,255,.45)` | `rgba(17,24,39,.40)` |
| `glass-standard` | Panels, sidebar, header     | 16px | 150% | `rgba(255,255,255,.60)` | `rgba(17,24,39,.55)` |
| `glass-elevated` | Dialogs, drawer, bottom-nav | 24px | 160% | `rgba(255,255,255,.72)` | `rgba(17,24,39,.70)` |
| `glass-inset`    | Inputs, pressed states      |  8px | 120% | `rgba(255,255,255,.30)` | `rgba(0,0,0,.25)` |

Each tier combines: translucent background, backdrop blur + saturation, 1px alpha border, inset highlight line, soft drop shadow. Defined as SCSS mixins in [`_glass.scss`](../client/src/app/styles/_glass.scss) and exposed as utility classes `.glass`, `.glass-subtle`, `.glass-el`, `.glass-inset`.

### `backdrop-filter` fallback

Browsers without `backdrop-filter` support (Firefox < 103, older Samsung Internet) fall back to opaque surfaces at 92% alpha via `@supports not (backdrop-filter: blur(1px))`. Text contrast is validated against this worst-case solid surface, so accessibility survives regardless of support.

---

## 4. Breakpoints

Mobile-first, defined as primitive tokens and exposed as SCSS mixins in [`_responsive.scss`](../client/src/app/styles/_responsive.scss).

| Name | Min width | Typical use |
|------|-----------|-------------|
| `xs` | 0         | Base — assume a 360×640 phone in portrait |
| `sm` | 480px     | Large phones, split-input layouts |
| `md` | 768px     | Tablet portrait, hide bottom-nav, 4-col stat grid |
| `lg` | 1024px    | Desktop — sidebar becomes persistent |
| `xl` | 1280px    | Wide desktop, 3-pane dashboards |

Behavioral anchors:

- **<md**: bottom tab bar visible, sidebar hidden, stat grid 2×2, queue as stacked cards, FAB shown.
- **<lg**: sidebar is off-canvas drawer triggered by hamburger in header.
- **≥lg**: sidebar persistent, queue as table, no FAB, no hamburger.

Usage:

```scss
@use "app/styles/responsive" as r;

.card {
  padding: 14px;
  @include r.bp-up(md) { padding: 20px; }
}
```

---

## 5. Theme service contract

[`ThemeService`](../client/src/app/core/services/theme.service.ts) is signal-based and zoneless-safe. It's initialized once at app bootstrap via `inject(ThemeService).initialize()` in [`app.ts`](../client/src/app/app.ts).

Resolution order for initial theme:
1. `localStorage.do-theme`
2. `AuthStore.activeClinic().branding.theme`
3. `prefers-color-scheme`

Writes `data-theme` on `<html>`. Toggle via header button (calls `themeService.toggle()`).

`applyBranding(branding)` runs automatically whenever `AuthStore.activeClinic` changes (via `effect()`) — so switching clinics instantly re-skins the app.

---

## 6. PrimeNG Aura overrides

Enabled in [`app.config.ts`](../client/src/app/app.config.ts):

```ts
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: { name: 'primeng', order: 'base, primeng, overrides' },
    },
  },
})
```

Our overrides in [`_primeng-aura-overrides.scss`](../client/src/app/styles/_primeng-aura-overrides.scss) sit in the `overrides` cascade layer and bridge Aura's CSS variables (`--p-*`) to our semantic tokens (`--do-*`). No `::ng-deep`, no `!important`.

Covered components: `p-dialog`, `p-popover`, `p-select`, `p-datepicker`, `p-menu`, `p-table`, `p-card`, `p-inputtext`, `p-inputnumber`, `p-textarea`, `p-button`, `p-tag`, `p-selectbutton`, `p-confirmpopup`.

---

## 7. Component patterns

### Buttons
- **Primary**: solid brand bg, `--do-brand-primary-contrast` text, subtle hover lift (-1px).
- **Outlined**: `--do-border-strong` border, glass-subtle hover bg.
- **Text**: no border, `--do-text-secondary`, glass-subtle hover.
- **Icon-only**: 38×38, 10px radius, same hover as text.

### Inputs
Always `glass-inset`. 10px radius. Focus = `--do-brand-primary` border + 3px tinted halo. Never `border: none` — glass needs the 1px edge for definition.

### Cards & panels
- `.section-card` = `glass-standard` + 16px padding + 16px radius.
- `.stat-card` = `glass-subtle` + 14px padding.
- Never stack more than two glass layers — blur cost compounds.

### Dialogs
Inherit `glass-elevated` from PrimeNG overrides. Responsive `[breakpoints]` attribute: `{ '960px': '80vw', '640px': '95vw' }`.

### Tags
Pill shape (9999px radius), `color-mix` of 18% semantic color on transparent, matching solid color text.

### Navigation
- **Sidebar (desktop)**: sticky, `glass-standard`, 260px wide.
- **Sidebar (drawer)**: fixed, `glass-elevated`, `transform: translateX(-100%)` → `0` on open. Animated 220ms cubic-bezier.
- **Bottom-nav**: fixed, `glass-elevated`, 5 tabs, honors `env(safe-area-inset-bottom)`.

---

## 8. Accessibility

- **Contrast**: body text passes WCAG AA against the opaque fallback surface (not just the translucent layer). Use `tools/axe-devtools` to verify.
- **Focus**: global `:focus-visible { outline: 2px solid var(--do-brand-primary); outline-offset: 2px; }`. Visible on all actionables.
- **Reduced motion**: global `@media (prefers-reduced-motion: reduce)` trims transitions to 0.01ms.
- **Touch targets**: minimum 44×44px on mobile primary actions (bottom-nav, FAB, mini-buttons).

---

## 9. Aurora backdrop

[`_backgrounds.scss`](../client/src/app/styles/_backgrounds.scss) defines `.bg-aurora` — three layered radial gradients in brand colors over `--do-surface-page`. Applied to `.dashboard-shell` so glass surfaces have something to blur.

Lightness is constrained (light: L 92–98%; dark: L 8–14%) so the average color never drops WCAG contrast against body text. Dark mode dials the gradient intensity down further.

---

## 10. Migration checklist (remaining pages)

Dashboard Home is the reference implementation. To port other pages:

- [ ] `features/dashboard/patients` — wrap in `.section-card`, use glass `p-table`, inputs inherit `glass-inset`.
- [ ] `features/dashboard/appointments` — custom queue list could reuse `<app-queue-card>`.
- [ ] `features/dashboard/prescriptions` — Tiptap wrapper needs `glass-standard` with inner padding.
- [ ] `features/dashboard/billing` — invoice table follows queue table pattern; totals card = `glass-subtle`.
- [ ] `features/dashboard/settings` — branding color-picker row should preview against all four glass tiers.
- [ ] `features/dashboard/team` — summary cards → `.stat-card`, members table → `p-table` inherits.
- [ ] `features/landing` — hero could use `bg-aurora` + centered `glass-elevated` CTA panel.
- [ ] `features/auth/{login,register}` — right-side form panel → `glass-elevated`; left-side branded gradient stays.

For each page, replace ad-hoc colors (`#ffffff`, `#f3f4f6`, etc.) with `var(--do-*)` tokens. Delete hardcoded `box-shadow` strings in favor of the glass mixins.

---

## 11. File map

| Path | Role |
|------|------|
| [`client/src/design-tokens/tokens.json`](../client/src/design-tokens/tokens.json) | W3C token source of truth |
| [`client/scripts/build-tokens.mjs`](../client/scripts/build-tokens.mjs) | Token → SCSS compiler |
| [`client/src/app/styles/_tokens.scss`](../client/src/app/styles/_tokens.scss) | Auto-generated CSS vars |
| [`client/src/app/styles/_responsive.scss`](../client/src/app/styles/_responsive.scss) | `bp-up` / `bp-down` mixins |
| [`client/src/app/styles/_glass.scss`](../client/src/app/styles/_glass.scss) | Glass mixins + utility classes |
| [`client/src/app/styles/_backgrounds.scss`](../client/src/app/styles/_backgrounds.scss) | `.bg-aurora` |
| [`client/src/app/styles/_primeng-aura-overrides.scss`](../client/src/app/styles/_primeng-aura-overrides.scss) | Aura → semantic bridge |
| [`client/src/app/core/services/theme.service.ts`](../client/src/app/core/services/theme.service.ts) | Theme + per-clinic branding |
| [`client/src/app/core/services/viewport.service.ts`](../client/src/app/core/services/viewport.service.ts) | `matchMedia`-backed signal |
| [`client/src/app/shared/components/bottom-nav/`](../client/src/app/shared/components/bottom-nav) | Mobile tab bar |
| [`client/src/app/shared/components/queue-card/`](../client/src/app/shared/components/queue-card) | Mobile glass queue row |
| [`docs/tokens-studio-import.md`](./tokens-studio-import.md) | Figma import walkthrough |
