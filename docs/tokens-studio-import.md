# Importing Doctors Office tokens into Figma

The canonical source of truth is [`client/src/design-tokens/tokens.json`](../client/src/design-tokens/tokens.json). We don't maintain a separate Figma file — Figma is kept in sync with the code.

## One-time setup

1. Open Figma → **Plugins** → **Browse plugins** → search **Tokens Studio for Figma** → Run.
2. First run: the plugin asks for storage. Pick **File storage** (default, stores inside the Figma file). You can migrate to a Git sync later if you want.
3. Copy the entire contents of `client/src/design-tokens/tokens.json`.
4. In Tokens Studio → **Settings (gear icon)** → **Sync providers** → **Add new** → **JSON**. Paste the JSON. Click **Save**.
5. Tokens Studio will parse the file and show three collections:
   - `primitive` (shared across themes)
   - `semantic/light`
   - `semantic/dark`

## Converting tokens → Figma Variables

Tokens Studio's sets ≠ Figma's native Variables. To get them into Figma Variables (so components can reference them):

1. In Tokens Studio, click the **hamburger menu** on the top-right of a token set → **Create styles & variables**.
2. Select **Variables** (not Styles). Choose which collection they go into — recommended: `Doctors Office`.
3. For `semantic/light` and `semantic/dark`: create a **Mode** on the collection. Set `semantic/light` as the default mode (`Light`) and `semantic/dark` as the second mode (`Dark`).
4. Map `primitive/*` tokens into a second collection, `Doctors Office / Primitives`, with no modes.

After this, Figma Variables panel will show:

```
Doctors Office
├── brand/primary          (modes: Light, Dark)
├── surface/glass          (modes: Light, Dark)
├── surface/glass-elevated (modes: Light, Dark)
├── text/primary           (modes: Light, Dark)
└── ...

Doctors Office / Primitives
├── color/teal/600
├── blur/md
├── space/4
└── ...
```

## Keeping Figma in sync with code

When tokens change in code:

1. A developer edits `tokens.json` and runs `npm run tokens` (from `client/`). The generated `_tokens.scss` is committed.
2. A designer opens Tokens Studio → **Sync providers** → **Pull** to re-import the latest JSON.
3. Re-run **Create styles & variables** — existing variables are updated in place (if names match); new ones are added.

To prevent drift in either direction:

- Code side: CI runs `npm run tokens:check` on every PR. If `_tokens.scss` doesn't match regen output, CI fails.
- Figma side: designers should treat Tokens Studio as read-only; never edit token values directly in the Figma Variables panel — edit `tokens.json` and sync.

## Building a component library in Figma

Once variables are live, component authoring is straightforward:

- **Glass surfaces**: rectangle → Fill = `surface/glass` (or `-subtle`/`-elevated`). Add a background-blur effect (16px for standard, 24px for elevated). Add stroke = `border/glass`.
- **Typography**: bind text color to `text/primary`, `text/secondary`, or `text/muted`.
- **Brand buttons**: fill = `brand/primary`, text color = `brand/primary-contrast`.
- **Tags**: fill = a token like `feedback/success` at 18% opacity (Figma allows variable + opacity layering).

Thumbnail your components against both **Light** and **Dark** modes by toggling the collection mode on the top frame — everything re-skins instantly.

## Troubleshooting

- **"Alias could not be resolved"** on import: Tokens Studio needs all referenced primitives to load first. Re-open the JSON editor and scroll — the parse order usually resolves it on the second load.
- **Opacity tokens show as solid**: Figma Variables don't support alpha-component separation. Use the RGBA literal (e.g., `rgba(255,255,255,0.60)`) as the token value, which we already do in `tokens.json`.
- **Dark mode not switching in component previews**: ensure the top-level frame has its mode set to `Dark` via the Variables panel, not just the instance.
