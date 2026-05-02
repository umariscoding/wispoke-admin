# Wispoke Admin — Design Tokens

The sidebar (`src/components/layout/Sidebar.tsx`) is the source of truth for the
visual language. Everything else in the admin should speak the same dialect.

The aesthetic: **terminal elegance** — a deep teal-black surface, depth created
through translucent white overlays rather than additional gray steps, slate text
in graduated weights, and a single teal accent used with precision.

> Don't reach for new colors. Reach for restraint.

---

## Surface levels

| Level | Dark | Light | Use |
|---|---|---|---|
| L0 — page / body | `#0E1515` (`bg-sidebar-bg`) | `#fafafa` / `bg-neutral-50` | global background |
| L1 — card / elevated | `bg-white/[0.02]` | `bg-white` | the dashboard's content surfaces |
| L2 — hover / subtle interaction | `bg-white/[0.04]` | `bg-slate-50` | row & item hover |
| L3 — pressed / active | `bg-white/[0.08]` | `bg-slate-100` | active states, current selection |
| Tinted accent surface | `bg-teal-500/10` → `bg-teal-500/20` | `bg-teal-50` | icon wells, badges, pills |

L1 over L0 is *barely* visible — that's intentional. Hierarchy is carried by the
**border**, not the fill.

## Borders

| Token | Dark | Light | Use |
|---|---|---|---|
| Hairline | `border-white/[0.05]` | `border-slate-200/60` | subtle dividers |
| Default | `border-white/[0.06]` | `border-slate-200/80` | card edges |
| Emphasized | `border-white/[0.10]` | `border-slate-300` | hover edges, strong dividers |
| Accent | `border-teal-500/20` → `border-teal-500/30` | `border-teal-200` | accent surfaces, focus |

A 1px white-overlay border on the L0/L1 seam is what carries cards in dark mode.

## Text

| Role | Dark | Light |
|---|---|---|
| Primary (headlines, key values) | `text-white` / `text-slate-100` | `text-slate-900` |
| Secondary (body copy) | `text-slate-300` | `text-slate-700` |
| Tertiary (labels, captions) | `text-slate-400` | `text-slate-500` |
| Quaternary (hints, disabled) | `text-slate-500` / `text-slate-600` | `text-slate-400` |
| Mono / data | same scale, add `font-mono` | same |

Avoid `text-neutral-*`. The sidebar speaks `slate`; everything else should too.

## Accent

The accent is **teal**. It is used:

- For active state indicators (`bg-teal-400` 3px rule, `bg-teal-500/20` chip)
- For data emphasis (icons, primary value highlights)
- For focus rings (`ring-teal-500/30` over a `border-teal-500/30` border)
- For trend indicators when positive

It is **not** used for buttons that already have shape or for status chips
(those use status semantics — see below).

| Token | Dark | Light |
|---|---|---|
| Icon active | `text-teal-400` | `text-teal-600` |
| Icon hover | `text-slate-300` (was slate-500) | `text-slate-700` |
| Tinted text | `text-teal-300` | `text-teal-700` |
| Tinted surface | `bg-teal-500/15` | `bg-teal-50` |
| Tinted border | `border-teal-500/20` | `border-teal-200` |
| Indicator line | `bg-teal-400` | `bg-teal-500` |
| Top hairline glow | `from-transparent via-teal-500/30 to-transparent` | same |

## Status

For success / warning / error, prefer the cooler-feeling Tailwind defaults
(`emerald`, `amber`, `rose`) over `red`/`green` — they sit better next to teal
and the slate scale. A red error state on this palette feels like a foreign
object.

| Status | Dark text | Dark surface | Dark border |
|---|---|---|---|
| Success | `text-emerald-400` | `bg-emerald-500/10` | `border-emerald-500/20` |
| Warning | `text-amber-400` | `bg-amber-500/10` | `border-amber-500/20` |
| Error | `text-rose-400` | `bg-rose-500/10` | `border-rose-500/20` |
| Info / accent | `text-teal-400` | `bg-teal-500/10` | `border-teal-500/20` |

Light-mode equivalents use the `-50` surface, `-200` border, `-700` text.

## Typography

- Display / values: `font-bold tracking-[-0.03em]` (tight tracking is the look)
- Section headers: `text-sm font-semibold tracking-[-0.01em]`
- Section labels: `text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600` (light: `text-slate-400`)
- Captions: `text-[11px]` to `text-xs`
- Numerals in tables: add `tabular-nums`

## Motion

- Default transition: `transition-all duration-200`
- Hover state: subtle bg lift + border tint
- Skeleton: gradient sweep (see `.shimmer`), not a flat pulse
- Page enter: `animate-in` (already defined)

## Compound recipes

**Card surface**
```tsx
className="bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] rounded-xl"
```

**Card with hover lift**
```tsx
className="... transition-all duration-200 hover:border-slate-300 dark:hover:border-white/[0.10] hover:shadow-md hover:shadow-slate-200/40 dark:hover:shadow-none"
```

**Top hairline glow (decorative)**
```tsx
<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
```

**Tinted icon well**
```tsx
<div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 ring-1 ring-inset ring-teal-200 dark:ring-teal-500/20">
  <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
</div>
```

**Trend chip (positive / negative)**
```tsx
// positive
className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20"
// negative — same with rose-*
```

**Section accent line**
```tsx
<span className="block w-[3px] h-4 rounded-r-full bg-teal-400" />
```

---

When extending the system, ask: *would this read as native to the sidebar?* If
not, walk it back.
