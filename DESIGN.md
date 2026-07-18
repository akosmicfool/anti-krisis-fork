# Design Brief — Anti Krisis Protocol

## Visual Direction
Retro pixel gaming terminal. Matrix-green-on-black CRT aesthetic — classic hacker console meets blockchain protocol. Every surface looks like it was rendered on a phosphor display in 1984, running a game that also happens to burn ERC-20 tokens.

## Tone
Archaic yet powerful. Cryptic but legible. Users are miners and burners operating in a terminal universe — the UI communicates that you're interfacing with something ancient and unstoppable.

## Differentiation
VT323 display headers at large sizes feel like a DOS prompt. Handjet badges read like Game Boy status screens. Tomorrow body text gives everything a data-feed quality. Scanline overlay adds CRT depth. Green glow on primary actions signals energy output.

## Color Palette

| Role | Hex | OKLCH (approx) | Purpose |
|------|-----|----------------|---------|
| background | #0a0a0a | 0.07 0 0 | Near-black base — the void |
| card | #111111 | 0.10 0 0 | Slightly lifted surface |
| foreground | #c8ffc8 | 0.88 0.12 145 | Soft phosphor green — primary text |
| primary / accent | #00ff41 | 0.85 0.28 145 | Matrix green — CTAs, active, focus |
| muted green | #004d14 | 0.30 0.14 145 | Borders, inactive states, dividers |
| muted foreground | #5a8a5a | 0.56 0.10 145 | Secondary text, labels |
| error | #ff3131 | 0.60 0.26 22 | Failures, destructive actions |
| warning | #ffb700 | 0.78 0.16 83 | Pending, fee states, caution |

## Typography

| Tier | Font | Class | Use |
|------|------|-------|-----|
| Display | VT323 | `font-display` | H1/H2, app name, section titles, page headers — 32px+ only |
| Accent | Handjet | `font-accent` | Badges, status labels, tab names, nav links, short accents |
| Body / Mono | Tomorrow | `font-body` / `font-mono` | Body copy, stats, token amounts, addresses, TX hashes |

**Font sizing guidance:**
- VT323: always 28px+ (it's designed for large display use — looks muddy below 24px)
- Handjet: 10–14px for badges/labels, 14–16px for nav
- Tomorrow: 12–15px for body/data, never for long prose at small sizes

## UI Treatments

### Scanline Overlay
Subtle `repeating-linear-gradient` CRT scanline on the `<body>` background — 2px lines at 4% opacity. Adds depth without destroying readability.

### Pixel Borders
All card/panel borders use `border-primary/30` (muted green). No `border-radius` above 4px — hard corners only. Use `rounded-none` explicitly to override shadcn defaults where needed.

### Button Glow (`btn-glow`)
Primary action buttons get `box-shadow: 0 0 8px #00ff41, 0 0 20px #00ff4133` on hover. Applied via the `btn-glow` utility class. Only on primary/accent buttons — not outline or ghost variants.

### Terminal Cursor Blink (`cursor-blink`)
Blinking block cursor (▌) for active inputs or empty-state prompts. CSS `animation: blink 1s step-end infinite`. Use sparingly — one per screen at most.

### Energy Pulse (`energy-pulse`)
Subtle opacity oscillation on GRIT balance indicators. 2s ease-in-out infinite loop between 70–100% opacity. Communicates live data.

## Elevation & Depth

| Zone | Background | Border | Notes |
|------|-----------|--------|-------|
| Header/Nav | `bg-card` | `border-b border-primary/20` | Sticky, slightly elevated |
| Page content | `bg-background` | — | Main void |
| Cards/Forms | `bg-card` | `border border-primary/30` | 1px solid muted green |
| Inputs | `bg-background` | `border border-primary/40 focus:border-primary` | Darker inset feel |
| Muted sections | `bg-muted/10` | — | Alternating section backgrounds |
| Footer | `bg-card` | `border-t border-primary/20` | Mirror of header |

## Structural Zones

| Zone | Font tier | Accent usage |
|------|-----------|--------------|
| App name / Logo | `font-display` large | Accent color |
| Navigation tabs | `font-accent` | Active: accent border-b + text |
| Page titles (H1) | `font-display` 2xl–4xl | Uppercase, accent icon |
| Section headers (H2/H3) | `font-display` sm–lg | Muted foreground, uppercase |
| Data values / amounts | `font-mono` | Accent for key values |
| Status badges | `font-accent` xs | Colored border variants |
| Body copy / descriptions | `font-mono` sm | Muted foreground |
| Addresses / TX hashes | `font-mono` xs | Truncated, muted |

## Spacing & Rhythm
8px grid. Card padding: 16–20px. Section gaps: 24–32px. Component gaps: 12–16px. Dense data layouts (tables) use 8–12px row padding.

## Component Patterns
- **Buttons (primary)**: `bg-accent text-background` + `btn-glow` on hover. Font: `font-display uppercase tracking-widest`.
- **Buttons (outline/secondary)**: `border-primary/40 text-foreground` + `hover:border-primary`. Font: `font-mono uppercase`.
- **Badges/Status**: `font-accent` + colored border variant. Hard corners (`rounded-sm` max).
- **Inputs**: `bg-background border-primary/40 font-mono` with green `focus:ring-accent`.
- **Tables**: `font-mono` data, `font-accent` column headers. `hover:bg-muted/10` rows.
- **Skeleton**: `bg-muted/30 animate-pulse`.
- **Modals/Dialogs**: `bg-card border border-primary/40`. Title in `font-display`.

## Motion
- Button hover: `btn-glow` box-shadow transition, 0.2s ease
- GRIT balance: `energy-pulse` opacity cycle, 2s infinite
- Cards/list items: entrance `opacity 0→1, y 8→0`, 0.3s, staggered by `index * 0.06`
- Step indicators: `AnimatePresence` fade + y-shift between states
- No parallax, no bouncing — all motion serves data feedback

## Constraints
- Background ALWAYS `#0a0a0a` — never white, never gray
- Accent (#00ff41) used for: primary buttons, active nav, focused inputs, key data values, icons
- All other colors: muted greens, foreground soft-green, red/amber for states only
- No gradients — phosphor flat color only
- No `border-radius` above 4px on structural elements
- `font-display` (VT323) only at 24px+; never for body text
- Dark-only design — no light mode on this MVP

## Signature Details
- Scanline overlay gives the entire app a CRT screen feel
- VT323 headers at 3xl–4xl size are instantly recognisable as retro terminal output
- Green glow on primary buttons reinforces the energy/burn metaphor
- Status badges in Handjet feel like Game Boy UI overlays
- Tomorrow makes every number, address, and hash look like it came out of a system printout
