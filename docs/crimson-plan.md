# Crimson redesign (2026-11-21, branch `re-dev`)

Owner brief: bring back the look and elements of `f03c96b`, keep the re-dev 3D
project figure, redesign the whole site neatly. Decisions from the owner:

- **Home** = the avatar head-tracker hero, redesigned to invite exploring; scroll
  into an About block (hanging ID card + typing keyboard); scroll into the projects
  told by the existing 3D point figure. Case-study pages restyled to match.
- **Theme** = crimson dark (the f03c96b look) as the default, plus a light variant
  behind the toggle.
- **Creator** = selective redesign: f03c96b hero type ("BEYOND THE CODE") with the
  avatar replaced by a composition of the three crafts (swappable when the owner
  supplies art); artistic section headers; Photography unchanged; Music redesigned
  hard, with the debut-single cover visible and the Spotify artist profile loading
  with a reload control; Writing rebuilt around the f03c96b book.

## Design system

One token set in `styles/site.css`, both themes through `light-dark()`:

| token | crimson (default) | light |
|---|---|---|
| paper | #12090a oxblood-black | warm blush #fbf5f3 |
| card | white 4% over paper | white |
| fg / fg-2 / fg-3 | warm white / 72% / 52% | ink / 68% / 50% |
| signal | ember #ff6a55 | crimson #b41d1c |

- Fixed ambient backdrop: the f03c96b radial crimson glows as CSS layers, slowly
  drifting by `transform` only (still under reduced motion). No WebGL backdrop:
  Home already owns the one WebGL context per page.
- Type: Archivo (already self-hosted) at normal width for a neutral grotesk like
  f03c96b; Geist Mono for small uppercase labels; Dancing Script for the hero name;
  Antonio / Spectral / Caveat on Creator, all self-hosted from `@fontsource`
  (OFL) and subset. No Google Fonts requests.
- Shapes: rounded-full pill buttons and chips, 1.5rem cards, hairline rules.
- Nav: the floating glass pill from f03c96b (avatar monogram, About, Work,
  Contact, divider, Artistic chip) plus the theme toggle inside the pill. On
  Creator the pill shows Photos / Music / Writing and a Professional chip. Fits
  320px without a disclosure.
- Footer: the f03c96b one-line footer; Contact and Home end on the ASCII avatar
  band with the big name.

## Pages

1. **Home** `/`: hero (contained `CharacterCanvas`, script name, one-line bio,
   Explore + Résumé, "scroll to explore" cue with section chips) -> About block
   (ID card, bio, facts, keyboard typing the tools, link to full About) -> the
   3D project stage, restyled (renderer, formations and easing untouched) -> more
   work -> closing band.
2. **About**: sticky ID card column + numbered chapters 01 Education (logo
   timeline), 02 Tools (keyboard, logo grid, categories), 03 Certifications,
   04 Recognition, then "know the real me" link to Creator.
3. **Work**: f03c96b headline, project index with preview pane (RasaCare shot,
   3D stills for the others), alternating internship timeline with logos,
   bento of expertise with real figures.
4. **Case study**: kicker + title + pill buttons, plate (shot or 3D still),
   two-column rows, Next card.
5. **Contact**: card hero with the email pill, direct list, form card, ASCII
   footer band. 404 restyled.
6. **Creator**: as above. Book pages carry only real text: the verbatim notebook
   line and the link to @introvert.balak; each supplied `poemFragments` entry
   becomes a page. Reduced motion / touch / narrow get the same text as a card.

## Constraints kept

Content only from `src/content/`; no em/en dashes in visible copy; h1 is LCP and
never fades from 0; one WebGL context; reduced motion and touch are complete
static pages; prerendering, no-JS markup and hydration unchanged.

## Validation

Build; `scripts/pro-ui.spec.ts` and `scripts/redev.spec.ts` updated where the
markup intentionally changed (assertions on behaviour kept); screenshots of every
route at 390 / 768 / 1440 in both themes; overflow checks. Spotify cannot be
reached from this sandbox, so the live embed is verified only for markup and the
reload control; the owner must confirm it in a browser.

## Outcome

Implemented as planned. Files: `styles/site.css` (tokens, backdrop, pill nav, hero,
stage, timeline), `components/site/{Header,Footer,Page}`, `views/*`, `views/CreatorPage.css`,
ported `components/ui/{hanging-id-card,typing-keyboard,interactive-book,animated-footer,
research-bento-grid}` and `components/{about,work,contact}` from f03c96b, rethemed to
tokens and without opacity-from-zero entrances. New: `components/creator/{CraftCollage,
Vinyl,SpotifyPlayer}`, `content/{facts,tools}.ts`. Renderer, formations, point count and
easing of the 3D figure are untouched; it now mounts only when the stage is within a
screen of the viewport (its 274 ms build task left the first load). `CharacterCanvas`
gained a `contained` mode (sized to the hero, idle off screen); `/character` is unchanged
and its smoothness gate passes. The debut cover was in the repo all along as
`public/creator/spotify-artist.jpg` (renamed `debut-single-cover.jpg`).

### Validation evidence (production build, `npm run preview` server)

- VERIFIED build: TypeScript, client + SSR bundles, 15 prerendered routes.
- VERIFIED `scripts/pro-ui.spec.ts` + `scripts/redev.spec.ts`: 71/71. Specs changed only
  where markup changed by design (pill nav replaces the disclosure, crimson default, new
  h1 texts, stage below the hero, two Spotify players); every behavioural assertion kept,
  and new ones added (320px pill targets >= 44px, project-index keys, figure code not
  fetched before the stage is near). `scripts/character-smooth.spec.ts`: 7/7.
- VERIFIED screenshots: every route at 1440 in both themes, 390 and 768 crimson, 320
  light; zero horizontal overflow (two 320px overflows found and fixed: outcome chips,
  the Writing grid). Head-tracker follows the pointer in the hero and returns to centre.
- Lighthouse mobile, three-run median, default (simulated) throttling:
  home 98 / LCP 2.23s, about 92 / 3.26s, work 96 / 2.66s, contact 98 / 2.02s,
  creator 90 / 3.42s, drishtimanas 96 / 2.02s. CLS 0.000 on all six.
  Applied (DevTools) throttling, one run: home 98 / 1.0s, about 100 / 1.6s,
  work 100 / 1.7s, contact 99 / 2.0s, creator 99 / 1.9s.
- NOT MET: the LCP < 2.0s gate under Lighthouse's simulated model. In every trace the
  LCP element is the page headline and it is the first paint (observed 0.13 to 0.24s);
  the simulated estimate charges the main script to first paint. Not resolved here.
- NOT VERIFIED: the Spotify players. open.spotify.com is blocked by this sandbox's
  proxy, so only the markup, deferral, titles and reload controls are tested. A blocked
  frame that still fires `load` (an error page) shows as a blank player; the reload
  button and the direct links are the fallback. Needs a check in a real browser.
