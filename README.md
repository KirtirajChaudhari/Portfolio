# Kirtiraj Chaudhari — portfolio

React 19 + TypeScript + Vite + Tailwind v4.

```
npm run dev       # http://localhost:5173  (add ?noboot=1 to skip the boot curtain in dev)
npm run build     # tsc -b && vite build
npx playwright test scripts/hero-registration.spec.ts --project=chromium
BASE_URL=http://localhost:4173 npx playwright test scripts/portfolio-v2.spec.ts --project=chromium   # against `npm run preview`
```

Routes: `/` (character head-tracker hero), `/work` (internships + projects), `/about` (about, education, skills, certifications, achievements), `/contact`, `/projects/:slug`, `/creator` (artistic profile), `/xray` (lens hero, used by the Playwright specs).

`/` draws pre-extracted WebP frames on a canvas. Regenerate them from
`public/character.mp4` with `python scripts/extract_frames.py` (needs opencv-python).
See `CLAUDE.md` for the repo guardrails.
