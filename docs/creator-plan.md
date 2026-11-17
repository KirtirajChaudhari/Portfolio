# Creator rebuild

## Plan and evidence

This plan follows the supplied brief and continues directly to implementation. The baseline review is being recorded below; final results will distinguish inspected code from measured behaviour.

- VERIFIED: `/creator` currently imports the old shell, Google Fonts, a three.js gallery and an empty book. The current professional identity is defined by `site.css` and `components/site/`.
- VERIFIED (browser): Creator stays cream with Spectral in dark mode; About uses Archivo and the dark tokens. Creator has two desktop H1s and one mobile H1. The accessible name **is** “Beyond the code”; F7's missing-space hypothesis is refuted.
- VERIFIED: all 57 gallery WebPs have a longest side of at most 900 px (4,245,460 bytes total).

## Design decisions

Use Page, Header, Footer, Archivo, Geist Mono and the existing light/dark tokens. Keep the supplied intro's words, changing its em dash to a semicolon. A real photograph replaces the avatar. Keep the hero quiet, without the duplicate epigraph, marquee, tape or reveals. Interpret the artistic LCP restriction as applying to the X-Ray lens layers; a real Creator photograph may be LCP and must meet the measured budget.

Use 14 photographs, selected on visible sharpness, varied orientations and avoidance of near-duplicates. Stable order, no invented titles or captions. Alt text describes visible subjects only. A CSS depth wall responds to the pointer only on fine-pointer devices, with one transform-only rAF loop, visible via IntersectionObserver; reduced motion and touch get a static grid. Images open in a native dialog with close, previous/next and keyboard controls. No image displays above its intrinsic resolution. Lazy-load photos below the fold.

Music uses the supplied song title and verified destination URLs. Omit unproven story, artist bio and subscriber count. Use neutral reel labels. Only create the titled Spotify iframe near the viewport. Writing shows the supplied blurb and account link, and actual poem fragments only when supplied. Remove undifferentiated Post links: no reliable mapping from them to local photos exists.

`/creator` becomes professional and prerendered; `/profile-2` stays an alias with canonical `/creator`. Keep the experimental routes functional. Remove only demonstrably orphaned components/packages.

## Owner decisions and defaults

- PHOTO_SELECTION: 14 images, filenames recorded with the final evidence. Owner may change the selection.
- HERO_PHOTO: `20250126-26.webp`, from the selection.
- DEBUT_STORY / ARTIST_BIO: omitted unless authorship can be established; history is not proof of personal authorship.
- REEL_LABELS: Reel 1, Reel 2, Reel 3.
- SUBSCRIBER_COUNT: omitted. POEM_FRAGMENT: none. AVATAR: not shown, file retained.
- VERBATIM_COPY: punctuation only; record the exact change.
- PROFILE_2: same page, canonical Creator, no redirect.

## Acceptance criteria

Production build and prerendering; all existing redev, hero-registration, hero-lens and character-smooth gates pass without weakened assertions. Creator gets the common responsive, heading, console, axe, dash, theme and no-JS gates plus deterministic gallery order, dialog keyboard/focus, static touch/reduced-motion and no WebGL checks. No three.js or Google Fonts on Creator first load. Review six screenshots (390, 1024, 1440; light/dark). Three Lighthouse mobile runs: median performance >=90, CLS exactly 0, LCP <2s; identify LCP. Leave public/creator/photos intact. Commit and push only on re-dev.

## Findings

| ID | Revised finding | Severity | Status | Evidence | Required update |
|---|---|---|---|---|---|
| F1 | Creator uses a separate identity. | P1 | VERIFIED, kept | At 1440 dark: creator html chapter=two, body Spectral/Georgia, rgb(242,240,235); about pro, Archivo, oklch(0.16 0.008 20). Creator requests Google Fonts stylesheet listing Inter, Inter Tight, Antonio, Spectral, Caveat. Screenshot /tmp/creator-before.png. | Shared tokens and self-hosted type. |
| F2 | Creator uses old pill nav and own footer, no theme toggle; dark preference still cream. | P1 | VERIFIED, kept | DOM, computed background, CreatorPage footer and SiteNav. About has a theme button; creator has none. | Shared Page/Header/Footer/themes. |
| F3 | Creator has a heavy three.js gallery bundle. | P1 | VERIFIED bundle size/source; INFERRED dominance | Retained production CreatorPage JS is 568,570 bytes minified, 146,688 bytes gzip (Python gzip level 6; Vite reported 148.55 kB on its prior build); art-gallery imports three and constructs its renderer/materials/textures. No rebuild was done during concurrent source changes. | Remove library-backed gallery. |
| F4 | Software WebGL is not gated out; black gallery reproduced, cause UNKNOWN. | P1 | VERIFIED behaviour/gate absence; UNVERIFIED root cause | Browser renderer ANGLE Vulkan SwiftShader, one visible canvas; screenshot has black cells/loading dots. art-gallery and WebGLSurface do not call hasHardwareWebGL; WebGLSurface checks availability only. | Replace WebGL gallery with real image DOM; do not assert GPU is root cause. |
| F5 | Photos shuffle per mount with positional Frame labels; no large viewer. | P1 | VERIFIED, kept | PhotographyWall Fisher-Yates; two browser mounts produced different first eight drawImage sources (20250126-34 first vs 20251007-04 first). Source has no dialog. | Fixed selection/order and accessible dialog. |
| F6 | Desktop book adds a second H1; mobile uses plain card. | P1 | VERIFIED, revised | Browser 1440 h1s Beyondthe code and The notebook; 390 only Beyondthe code. WritingsBook single empty-fragment page and notebook-cover asset. | Plain writing with one page H1. |
| F7 | H1 textContent lacks spacing, but accessible name is correct. | P3 | VERIFIED, refuted accessibility claim | Playwright ariaSnapshot returns heading "Beyond the code" [level=1]. | Use natural spaced heading, preserve accessible name. |
| F8 | Epigraph repeats intro opening and has coloured side stripe. | P2 | VERIFIED, kept | CreatorPage.tsx repeats Same person, off the clock; border-l-2 plus accent. | Remove duplicate epigraph. |
| F9 | Hero uses illustrated avatar. | P2 | VERIFIED, kept | /avatars/artistic-full.webp in hero source and screenshot. | Use owner's real photo. |
| F10 | Story TODO exists; history cannot establish literal authorship of bio/reel labels. | P2 | VERIFIED TODO/history; UNVERIFIED prose authorship | All introduced in 1eb8a7e7146044810af2c470034a98c4b527c7b0 (2026-08-20), author Kirtiraj Chaudhari. Commit attribution does not prove text was personally written. | Omit story/bio, use Reel 1-3 as safe brief default. |
| F11 | Count fixed at 370; YouTube property lookup is empty with fallback hiding it. | P2 | VERIFIED source; INFERRED runtime resolution | shared.ts only has socials.youtube; novel uses nonexistent socials.other?.find(...) ?? ''; page uses fallback URL. | Remove count, use socials.youtube. |
| F12 | Eleven anonymous Post chips. | P2 | VERIFIED, kept | Rendered baseline screenshot shows Post 01-11; no subject labels. | Remove, retain profile link. |
| F13 | Marquee, rotated cards and JS fade reveals; reduced CSS marquee is disabled. | P2 | VERIFIED, revised | Default creator-ticker animation, reduced-motion computed animation names none. Reveal uses useReducedMotion and initial=false when reduce. Tilted card inline transforms remain static. CSS animation-name alone does not measure all JS motion. | Remove repeated effects and keep static fallback first-class. |
| F14 | novel has unrendered exports and artistic dependency. | P2 | VERIFIED, kept | rg src finds novelHero/chapterOneMeta/engineerBeats/techMarquee/finale definitions only (xray comment mentions novelHero). artisticDisciplines is used for only Spotify URL. | Prune unused exports and use direct verified URL. |
| F15 | No creator route metadata/prerender; alias duplicates page. | P2 | VERIFIED source | meta PRERENDERED has 13 pro routes, creator absent. App sends alias and creator to same component; creator sets own title in effect; baseline served shell has home canonical. | Prerender creator and alias with canonical creator; sitemap creator. |
| F16 | Visible copy has long dashes. | P3 | VERIFIED, kept | Browser body.innerText contains six em/en dashes. | Punctuation-only intro edit, prune unsuitable copy. |
| F17 | CLAUDE documentation is stale about gallery/embeds. | P2 | VERIFIED, kept | PhotographyWall latest f03c96b adds local shuffled ArtGallery; earlier ab83776 embeds. Stale CLAUDE Content truth says photographyWall src empty with FilmFrame; portfolio-v2 build log says art-gallery unused, v2.1 says Instagram embeds; re-dev log says creator stays legacy. | Append current state, revise present-tense source-of-truth statements. |


| F18 | One candidate image has an Adobe Firefly watermark; folder membership does not prove photo provenance. | P1 | VERIFIED watermark; UNVERIFIED origin | Natural-resolution review of 20250125-45.webp shows Adobe Firefly bottom left. | Omitted from the selection; retained the original file. Replaced with 20250125-42.webp. |
| F19 | Route-specific CSS must be present in prerendered HTML before hydration. | P1 | VERIFIED source/build | A lazy Creator CSS import was absent from the initial prerender stylesheet. | Import the small, uniquely scoped Creator stylesheet from index.css; preserve no-JS layout and avoid layout shift. |

## Changes tied to findings

- F1/F2/F15: Creator and alias use Page/Header/Footer and pro tokens, both themes. Removed the creator-specific SiteNav branch; experiment routes keep their legacy CSS and fonts.
- F3/F4/F5/F12/F13: native image wall, stable 14-photo selection, transform-only pointer depth and native modal viewer. Reduced motion/touch have no gallery rAF. Removed anonymous post chips because local images have no verified per-post mapping; retained the profile link.
- F6/F7/F8/F9: one natural H1; actual photograph; no duplicated epigraph, ticker, tape or empty book. Writing renders the supplied blurb, account link and only real poemFragments entries.
- F10/F11/F14/F16: unconfirmed prose and stale count omitted, direct YouTube URL, neutral Reel 1–3 labels, novel.ts pruned and artistic.ts dependency removed. Poetry stays empty, without substitute writing.
- F15: both Creator routes prerendered (15 total), canonical /creator, consistent route metadata. Sitemap already included /creator, so no redundant change.
- F3/F14/F17: removed the orphaned component subtree and three/r3f/type packages after source searches, updated content-truth documentation and historical drift annotations.
- F18/F19: excluded the watermarked candidate; made Creator layout CSS available before JS.

## Owner defaults applied

14 selected files, in order (all retained at their existing intrinsic dimensions):

1. 20250126-26.webp (also the hero)
2. 20250125-42.webp
3. 20250125-47.webp
4. 20250126-25.webp
5. 20250126-28.webp
6. 20250126-32.webp
7. 20250126-36.webp
8. 20230911-56.webp
9. 20250702-22.webp
10. 20250721-19.webp
11. 20250927-13.webp
12. 20250930-09.webp
13. 20251007-04.webp
14. 20251022-03.webp

VERIFIED: each selected image was visually inspected at natural resolution. Alt text describes subjects only, without assigning locations or titles. Owner confirmation of the selection and image provenance remains outstanding; no claim of independently verified ownership is made.

Punctuation-only edits (every word retained): `case study — it's` → `case study; it's` in creatorIntro; `Tabla first — years` → `Tabla first: years` in musicSection.body. No poem supplied. Avatar files and public/creator/photos retained. History shows the bio/story/reel prose in an AI-coauthored snapshot, so personal authorship is UNVERIFIED and the supplied omission defaults apply.

## Validation

Final gate evidence is recorded below. Some experimental-route gates remain failed; this is not a full acceptance pass.



### Reproducible validation commands

```sh
npm run build
npm run preview
# Keep npm run dev running on 5173 for Playwright webServer readiness.
LABEL=creator-validation ENFORCE=1 BASE_URL=http://localhost:4173 PW_EXECUTABLE=/usr/bin/chromium npx playwright test scripts/redev.spec.ts scripts/hero-registration.spec.ts scripts/hero-lens.spec.ts scripts/character-smooth.spec.ts --project=chromium
```

VERIFIED: restart the production server after a rebuild. Its compressed-response cache retains HTML by path and can otherwise serve stale asset hashes. An initial run against the stale server was invalid and discarded; it is not counted as application failures.

VERIFIED baseline and final external limitation: `curl -I 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap'` returns proxy CONNECT 403. Legacy browser requests report ERR_TUNNEL_CONNECTION_FAILED. Creator no longer requests Google Fonts. The separate Spotify embed also cannot load through the current policy; its direct links remain in DOM. Do not infer an application failure or a successful external embed from these responses.

VERIFIED resource-isolated retry of the two failed timing checks still failed: character long task 68 ms (budget <=50 ms), idle 480 ms; lens at CPU 4x averaged 59.1 fps, p95 16.8 ms, worst 66.6 ms, one interval >50 ms (the existing test permits zero). These are failed gates on this host; neither experiment's animation code was changed. No assertion, timeout, budget or test was loosened. Initial contended measurements were 63/65 ms character long tasks and lens57.6 fps, worst116.7 ms; the isolated retry is the final evidence.


### Production implementation checks

VERIFIED: `npm run build` passes type-check, client build, SSR build and prerendering of 15 routes. `rg` over TS/TSX/JS/JSX and manifests found no remaining runtime imports of the deleted component subtree or three/r3f. `npm uninstall` removed 20 packages. The Creator chunk fell from 568,570 bytes to 17,671 bytes minified / 8,269 bytes gzip level 6 (about 96.9% smaller minified).

VERIFIED: the full final redev run had 46 passes and two failures. One was the blocked-font legacy console check. The other was a race between the browser scheduling a lazy iframe request and the test reading its request-event array. The test now polls for the same required request rather than asserting synchronously; its targeted retry passed. Thus 47 of 48 redev checks were verified across the full run plus that targeted rerun. After the priority changes, all 12 affected Creator/prerender tests passed again. The last responsive-thumbnail build receives the same affected checks below.

VERIFIED: the viewer initially allowed Tab to leave the document for browser chrome in this Chromium. Explicit first/last Tab wrapping fixed it without relaxing the test. Arrows, Escape, focus return and close button pass. Common Creator tests pass one H1, 320–1440 responsive widths, clean first-load console, axe light/dark, no dashes, theme persistence, stable decoded photo order, no WebGL/Google Fonts, deferred Spotify insertion, and no-JS metadata/canonical markup. Reduced-motion and touch grids schedule zero idle rAF calls. A separate pointer-mode probe measured zero callbacks during 1 second at rest and 700 ms offscreen.

VERIFIED experimental-suite results (unchanged animation code): character 6 passed / 1 failed; lens 7 passed / 1 failed; registration 4 passed / 9 failed. Registration failures are fixed-slot text overfill at all nine sizes; no horizontal overflow or layer drift was observed. Fonts are blocked, so font fallback contributing to line metrics is INFERRED, not an independently proven sole cause. The legacy console test fails with three ERR_TUNNEL_CONNECTION_FAILED font errors. Neither these assertions nor performance thresholds were weakened.

### Mobile performance investigation

All runs use Lighthouse 13.6 default simulated mobile settings, installed Chromium, production `serve-dist.mjs`, no request interception, no throttling changes. The first three runs scored 100/96/95; CLS 0/0/0; LCP 1.377/2.783/2.890 s (median 2.783 s, FAIL). The LCP element was the hero photo, eagerly discoverable with high fetch priority and explicit dimensions.

VERIFIED trace: actual local LCP was about 132 ms, while Lighthouse's slow-network simulation predicted 2.783 s. The secondary font was discovered late and all 13 nonhero gallery originals were prefetched (~0.94 MB) before first paint despite native lazy loading. Moving the hero preload to the document head, preloading Geist Mono on Creator only, and lowering gallery fetch priority produced 100/96/95, CLS 0/0/0, LCP 1.372/2.781/2.977 s. This was still FAIL; priority hints alone did not meet the gate.

Responsive gallery copies address the measured bandwidth: 14 WebP thumbnails at no more than 360 px wide, 283,956 bytes total, generated by proportional Lanczos downsampling at WebP quality 82. No crop, new content, upscale or modification of originals. `srcset` keeps originals for higher-density/larger slots; the modal always uses originals. Hero remains the original small 900×484 photograph. Final three-run measurements follow.


### Final results

| Gate | Final evidence | Result |
|---|---|---|
| Production build | Type-check, client/SSR bundles, 15 prerenders | VERIFIED PASS |
| Affected Creator/prerender tests | 12/12 passed after responsive-thumbnail build | VERIFIED PASS |
| Full redev | 46/48 in last full run; Spotify synchronization fixed and targeted retry passed; 47/48 composed; remaining legacy font console failure | VERIFIED incomplete |
| Character / lens / registration | 6/7, 7/8, 4/13 respectively; isolated timing retry still failed | VERIFIED FAIL |
| Lighthouse Performance | 100 / 96 / 96, median 96 | VERIFIED PASS >=90 |
| Lighthouse CLS | 0 / 0 / 0 | VERIFIED PASS exactly 0 |
| Lighthouse LCP | 1.508 / 2.855 / 2.801 s, median 2.801 s | VERIFIED FAIL <2.0 s |
| LCP element | Hero photograph, source900×484, rendered372×200, eager/high priority/discoverable | VERIFIED |
| Creator first load | No three.js/Google Fonts/WebGL; transfer1,085,559→486,832 bytes (about55% lower) | VERIFIED |
| Six screenshots | 390/1024/1440, light/dark, individually inspected; no overflow, clipping or upscaling | VERIFIED PASS |

Final affected-test command:

```sh
BASE_URL=http://localhost:4173 PW_EXECUTABLE=/usr/bin/chromium npx playwright test scripts/redev.spec.ts --project=chromium --grep 'creator|prerendered'
```

Final Lighthouse command, repeated for N=1,2,3 with all other browser/test work idle:

```sh
CHROME_PATH=/usr/bin/chromium /tmp/creator-lighthouse/node_modules/.bin/lighthouse http://localhost:4175/creator --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance --output=json --output=html --save-assets --output-path=/tmp/creator-lighthouse/responsive-N
```

Lighthouse13.6 default mobile:412×823,DPR1.75,150ms RTT,1.6Mbps,CPU4x. Responsive copies reduced real transfer but did not resolve simulated LCP; the bandwidth hypothesis alone is insufficient. The remaining simulated dependency causing the LCP result is UNVERIFIED. Stop further optimization here under the brief's failed-gate rule; do not claim full acceptance.

Artifacts in this task workspace: `/tmp/creator-build.log`, `/tmp/creator-tests.log` (full combined run), `/tmp/creator-tests-isolated.log` (timing retries), `/tmp/creator-redev-final.log`, `/tmp/creator-spotify-final.log`, `/tmp/creator-redev-responsive.log`, `/tmp/creator-validation.md`, `/tmp/creator-lighthouse/responsive-{1,2,3}.report.{json,html}` and matching traces. Screenshots: `/tmp/creator-shots/{390,1024,1440}-{light,dark}.png`. These local artifacts are not deployed and are not substituted for passing results.

### Remaining limitations and next actions

- LCP<2s remains unresolved, measured2.801s median. A further performance investigation is required before acceptance.
- Apply Google Fonts network access (`fonts.googleapis.com`, `fonts.gstatic.com`) before rerunning the legacy console/registration checks. Fallback contributing to fixed-slot overfill is INFERRED; retry after access changes to confirm. Do not change experiment typography just to fit blocked fonts.
- The unchanged character/lens timing budgets failed on this host even with other browsers idle. No relaxed assertion or passing claim. A separate investigation or suitable runtime is needed.
- Spotify playback and external Instagram/YouTube destinations are UNVERIFIED here. `open.spotify.com` is blocked; direct destination URLs are retained. No secrets are required.
- Real devices, Safari, Firefox, a real GPU, deployed Vercel routing and owner confirmation of selected-photo provenance/copy are UNVERIFIED. All originals and avatars remain intact.
