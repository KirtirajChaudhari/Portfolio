# Professional UI fix pass (2026-11-21)

Scope: glitches on `/` and the other professional pages. The WebGL figure, its
formations, point count, shader, morph timing, easing and pointer response stay
as they are. Only framing and containment change.

## Reproduced defects (production build, 390 / 768 / 1024 / 1440, both themes)

1. **Home figure leaks past the story.** `.stage-field` is sticky with
   `margin-bottom: -100svh`, so its margin box is zero-height and it stays pinned
   for a further viewport after the last panel. The track formation and its
   caption draw over the Recognition list ("Finalist, InCubate" is covered at
   1024 and 1440; the "Recognition" heading at 390).
   Fix: the field becomes an absolute layer covering the whole stage, with a
   sticky 100svh pin inside it. The pin is released exactly when the last panel's
   bottom reaches the viewport bottom, which is also where `progress()` ends.
2. **Project titles break mid-word on the home stage.** "DrishtiMana / s" at
   1024 and 1440: the 84px display size is wider than the 35rem copy column.
   Fix: the copy column is an inline-size container and its title is capped at
   14cqi (DrishtiManas measures 6.75em).
3. **Phone framing hides the figure.** In the stacked layout the figure is framed
   to the top 46% of the canvas, but the copy's fade starts above that, so the
   lower part of the graph and its red trace sit under the headline.
   Fix: CSS declares the visible window (`.stage-window`, header bottom to the
   start of the fade). The renderer reads its rect on resize and frames the figure
   inside it, as it already does with `--field-wide`.
4. **Email breaks mid-word** ("…@gm / ail.com") on phones in the closing band
   and on Contact. Fix: a break opportunity after `@`, `break-all` removed, and a
   size that fits the local part at 320px.
5. **External-link arrows detach** when a link wraps (About "Class X" school,
   long organisation names): `inline-flex` puts the icon in its own column.
   Fix: an inline link whose last word and arrow never separate.
6. **Phone About "at a glance"** stacks four short facts one per row with 56px
   padding each. Fix: two columns on phones, tighter rows.
7. **Phone footer** is a single 1,100px column of links. Fix: two columns with
   the identity block spanning the row.
8. **Work stills appear late**: drawn at 300px from the viewport, so a fast
   scroll shows an empty plate. Fix: start one viewport ahead.

9. **Pin offset at the top of the page** (found by the new test): the stage
   began under the header, so at scroll 0 the pinned figure sat 64px low and
   travelled up before it pinned. The stage now starts under the sticky header
   (`margin-top: -header`), with the hero's padding absorbing the difference.

## Validation

Build, `scripts/pro-ui.spec.ts`, `scripts/redev.spec.ts`, scroll captures of the
home stage at 390 / 1024 / 1440, full-page captures of every professional route
in both themes with overflow checks.

## Outcome

- VERIFIED production build: TypeScript, client/SSR bundles, 15 prerendered routes.
- VERIFIED `scripts/pro-ui.spec.ts` + `scripts/redev.spec.ts`: 71/71 pass on the
  production preview (61 existing + 10 new: figure released with the last panel at
  three sizes, project titles on one line at four widths, stacked framing window
  above the copy, email break at 320px, outbound arrows attached).
- VERIFIED screenshots: home scroll sequence at 390x844, 1024x768 and 1440x900;
  every professional route at 390/768/1440 in both themes, zero horizontal
  overflow. Shader, formations, point count, morph timing, easing and pointer
  response are unchanged; only framing (the stacked window) and containment moved.
- Not verified here: real devices, Safari/Firefox, a hardware GPU, Lighthouse.
