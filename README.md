# Kirtiraj Chaudhari: portfolio

React 19, TypeScript, Vite 8, Tailwind v4. The professional and Creator pages are rendered to static
HTML at build time and hydrated; the home-page figure is raw WebGL2 with no library. Creator's
photography gallery uses HTML images, CSS depth and a native dialog, without a gallery library.

```
npm run dev        # http://localhost:5173 (client-rendered, no prerender)
npm run build      # type-check, client build, server build, prerender 15 routes (including alias)
npm run preview    # serve dist/ with production routing on http://localhost:4173

# Acceptance gate, against the build:
BASE_URL=http://localhost:4173 npx playwright test scripts/redev.spec.ts --project=chromium
# Lens and head-tracker gates:
BASE_URL=http://localhost:4173 npx playwright test scripts/hero-registration.spec.ts scripts/hero-lens.spec.ts scripts/character-smooth.spec.ts --project=chromium
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Statement, the pinned point-cloud figure stepping through the three lead projects, recognition, experience |
| `/work` | Lead projects, six more, internships, expertise |
| `/projects/:slug` | Case study |
| `/about` | Bio, recognition, education, tools, certifications |
| `/contact` | Email, links, mailto form |
| `/creator`, `/profile-2` | Photography, music and writing on the shared site system; alias canonical is `/creator` |
| `/xray`, `/character` | Two earlier experiments: the lens hero and the head-tracker |

## Where things live

- `src/styles/site.css`: the design system for the professional pages (tokens, type, components).
- `src/styles/legacy.css`: the older stylesheets, loaded only with `/xray` and `/character`.
- `src/components/field/`: the figure. `formations.ts` generates the points, `engine.ts` draws them.
- `src/components/site/`: header, footer, page frame, tilt, screenshot and figure components.
- `src/components/creator/PhotoGallery.tsx`: stable photo grid, pointer depth and keyboard dialog.
- `src/content/photographs.ts`: the 14 selected local photographs, dimensions and descriptive alt text.
- `src/content/`: every fact on the site. `meta.ts` holds titles and descriptions per route.
- `scripts/prerender.mjs`, `scripts/serve-dist.mjs`: the build step and the local production server.
- `docs/redev-audit.md`, `docs/redev-plan.md`: the audit of the previous site and the plan this build follows.
- `docs/creator-plan.md`: Creator review, owner defaults, implementation decisions and gate evidence.
