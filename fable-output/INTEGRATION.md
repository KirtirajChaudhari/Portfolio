# Dual-Mode Portfolio — Interaction Architecture

Global view-mode state, directional mode-switch transition, accessible toggle, and swipe/keyboard input. No portfolio content — two labelled dummy blocks demonstrate the mechanics.

Typechecked with `tsc --strict` against: `motion@12.x`, `zustand@5.x`, React 19 types, TypeScript 5.9.

## Install

```bash
npm install motion zustand
```

- `motion` ≥ 11.11 (imports come from the `motion/react` entry point). If you must stay on framer-motion instead, change the import in `components/ModeSwitcher.tsx` to `"framer-motion"` — the API is identical.
- `zustand` v5. No Provider needed; the store is module-level.

## What wraps what

```
app/page.tsx ................................. Server Component
└── <PortfolioShell professional artistic>    ← the ONLY "use client" boundary
    ├── useModeHotkeys()                      window keydown (← / →)
    ├── ref={useSwipe(…)}                     swipe surface = the entire shell
    ├── <header>  STABLE hero frame           avatar frame + <ModeToggle/> + mobile swipe dots
    │                                          (mounted once — never remounts on switch)
    └── <main>
        └── <ModeSwitcher>                    the ONLY region that swaps
            └── <AnimatePresence> → active view
```

## Files

| Path | Role |
|---|---|
| `store/useViewMode.ts` | Zustand store: `mode`, `direction`, `setMode`, `toggle`. Not persisted on purpose — every load starts professional. |
| `components/ModeSwitcher.tsx` | AnimatePresence swap zone. Directional ±24px + fade over 0.5s; reduced motion → pure cross-fade. |
| `components/ModeToggle.tsx` | Pill button advertising the TARGET side. Plain action-button semantics (full rationale in the file). |
| `hooks/useSwipe.ts` | Axis-locked horizontal swipe; all listeners passive — structurally cannot block vertical scroll. |
| `hooks/useModeHotkeys.ts` | Global ← / →; ignores text fields, composite widgets, and modifier combos. |
| `components/PortfolioShell.tsx` | Interaction root: stable hero + swipe surface + hotkeys + switcher. |
| `app/page.tsx` | Runnable demo (Server Component) with two labelled dummy views. |

## Dropping into an existing App Router project

1. Copy `store/`, `hooks/`, and the three files in `components/` to your project root. Imports use the `@/*` alias from create-next-app, which maps to either the root or `src/` — both layouts work unchanged.
2. Keep your route's `page.tsx` a Server Component and render:
   ```tsx
   <PortfolioShell
     professional={<ProfessionalView />}
     artistic={<ArtisticView />}
   />
   ```
   Your real sections can stay Server Components — they're slotted through the client boundary as `ReactNode` props. Both sides ship in the initial payload, which is exactly why switching is instant: nothing is fetched on toggle.
3. Delete `DummyView` from the demo page once real views exist.
4. The shell owns `min-h-screen bg-[#0C0C0C]`, so no `layout.tsx` changes are required. Remove those classes if your layout already sets the canvas.
5. Any other client component can read the mode directly (e.g. to tint a nav item): `const mode = useViewMode((s) => s.mode);`

## Tuning knobs

- **Transition** — `SHIFT_PX` (24), `DURATION_S` (0.5), `EASE` at the top of `ModeSwitcher.tsx`.
- **Swipe** — pass options to `useSwipe`: `minDistance` (56px drag), `flickVelocity` (0.5 px/ms), `axisLockThreshold` (12px slop).
- **Keyboard scope** — `useModeHotkeys(false)` to disable on form-heavy routes, or move the call if you want it scoped differently.
- Trackpad horizontal wheel is intentionally **not** bound: two-finger horizontal swipe is the browser's back/forward gesture on macOS, and stealing it is hostile.

## Accessibility summary

- The toggle is a plain `<button>` whose visible text is its action ("Switch to Artistic side"). It uses neither `aria-pressed` nor `role="switch"`: both require a stable accessible name, which conflicts with a target-labelled control (WCAG 2.5.3 Label in Name). Full rationale — and when `role="switch"` *would* be right — is in `ModeToggle.tsx`.
- The resulting state is announced via an `aria-live="polite"` region in `ModeSwitcher`.
- ← / → never fire from inputs, textareas, contenteditable, sliders/tabs/menus, or with ⌘ / Ctrl / Alt held; `defaultPrevented` events are respected.
- `prefers-reduced-motion` removes all translation (pure cross-fade) via `useReducedMotion`, and the decorative CSS transitions carry `motion-reduce:transition-none`.
- Swipe is an enhancement only; the toggle (with visible `focus-visible` ring) is always the primary path. Mobile dot hint is `aria-hidden` — it's decorative.
