# Professional UI/UX fixes

Preserve the existing 3D architecture, formations, point counts, rendering paths,
scroll morphs, easing, pointer response and page transitions. Keep content and the
visual identity. This pass fixes reproduced UI defects rather than redesigning pages.

## Verified findings and changes

- Home's CSS used width900px for side-by-side, while its scene used aspect>1.15.
  At1024×900/1366 the scene overlaps headings; at844×390 the scene sits behind the
  stacked copy. Make CSS the single framing contract: side-by-side at width>=900
  and aspect>1.15. The renderer reads that layout flag on resize, preserving its math.
- Work's36px figure margin is smaller than the48px entrance translation. Figures
  cover headings in initial/offscreen captures. Reserve64px without changing motion.
- IdBoundaryDetection overflows320px; the preceding project's Next link also
  overflows. Allow long headings to wrap and next-project flex text to shrink.
- Small-screen headers hide Artistic and the theme control. Provide a native mobile
  disclosure with all primary links, plus the theme button at every width. Preserve
  no-JS navigation, Escape/outside/route-change closing and visible keyboard focus.
- Header navigation retains focus in the old navigation after a route change.
  Move focus to the loaded main landmark after intentional route navigation.
- Hash scrolling uses querySelector on arbitrary fragments and always requests
  smooth motion. Resolve IDs safely and honor reduced-motion settings.
- Repeated home case links need unique accessible names. Raise small text-link
  touch targets without changing their labels.
- Contact clipboard failure is silent and correction errors remain stale. Add
  accessible feedback, timer cleanup, valid-correction clearing and required semantics.

## Validation

Production build, existing responsive/accessibility and home WebGL/scroll/idle
checks, plus targeted regressions for new navigation, hash/focus, long project
names, contact feedback and the responsive scene framing. Review before/after
screenshots at phone/tablet/desktop and both themes. External legacy font failures
from the previous pass are recorded separately, not suppressed or called passing.

## Validation evidence

- VERIFIED production build: TypeScript, client/SSR bundles and15 prerendered
  routes pass (`/tmp/pro-ui-build.log`).
- VERIFIED new regression suite:13/13 pass (`scripts/pro-ui.spec.ts`). It covers
  native mobile navigation with/without JS, Escape/outside/route-change closing,
  theme access at320px, focus handoff, safe/reduced-motion hashes, all9 case-study
  layouts at320px, reserved entrance space, four framing viewports and contact
  clipboard/validation behavior.
- VERIFIED existing redev suite:47/48 pass. The single failure is the previously
  observed legacy `/xray`/`/character` Google Fonts network rejection, with three
  `ERR_TUNNEL_CONNECTION_FAILED` console errors. No assertions were weakened.
  Professional and Creator accessibility/responsive/no-JS checks all pass.
- VERIFIED preserved scene gates: one WebGL context, offscreen idle, all three
  scroll formations, reduced-motion stills and touch behavior pass. The shader,
  formation data, projection math, morph timings, easing and pointer response
  were not changed. Only responsive framing now reads the CSS layout flag on resize.
- VERIFIED home visual review: hero and RasaCare at1024×900,1024×1366,844×390,
  900×700 and1440×900 in both themes. The first two now separate the graph and
  headings; the short landscape framing also matches the copy. Normal wide-screen
  composition stays side-by-side.320px navigation also reviewed in both themes.
  Screenshots: `/tmp/pro-ui-after/`; original evidence: `/tmp/pro-ui-before/`.

Commands (production preview already running):

```sh
npm run build
BASE_URL=http://localhost:4181 PW_EXECUTABLE=/usr/bin/chromium npx playwright test scripts/pro-ui.spec.ts --project=chromium
BASE_URL=http://localhost:4181 PW_EXECUTABLE=/usr/bin/chromium npx playwright test scripts/redev.spec.ts --project=chromium
```

Known limits: real devices, Safari/Firefox, a real hardware GPU and deployed host
routing are unverified. Blocked third-party font/embedded services remain external
limitations from the earlier pass. This UI pass does not claim to resolve the
previously measured Creator LCP or experimental lens/character timing budgets.

### Final secondary-page and performance review

VERIFIED:74 route/size/theme captures and geometry checks report zero horizontal
page overflow, offscreen visible headings/controls or page errors. All nine case
studies fit320px in both themes. Reviewed representative Work, About, Contact,
case-study and404 captures at390/640/768/1024/1440px, plus mobile navigation open
and closed. Long titles and Next arrows now fit; entrance space remains clear.
Evidence: `/tmp/pro-ui-after-other/report.json` and corresponding PNGs.

VERIFIED isolated landing-page Lighthouse mobile check (one run, not a median):
Performance90, CLS0, LCP0.776s. The LCP element is the actual home H1. These meet
the repository's >=90/0/<2s budget in this check. No other browser work was active.
Report: `/tmp/pro-ui-home-lighthouse.report.json` and `.report.html`.

```sh
CHROME_PATH=/usr/bin/chromium /tmp/creator-lighthouse/node_modules/.bin/lighthouse http://localhost:4181/ --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance --output=json --output=html --output-path=/tmp/pro-ui-home-lighthouse --quiet
```

The earlier Work overlap finding is limited to full-page/offscreen captures; a
live-scroll overlap was not independently demonstrated. The added clearance
protects those captures and the maximum entrance translation while preserving
that animation. The menu display regression found during implementation (Tailwind
`flex!important` overriding CSS visibility) was corrected and is covered by the
320px navigation/overflow regression test; final screenshots show the intended
mobile disclosure.
