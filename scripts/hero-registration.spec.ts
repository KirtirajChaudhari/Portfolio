import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

/*
 * X-Ray Hero — Loop 2 acceptance.
 *
 * "Screenshot it and look" cannot prove a 2px misregistration, and 2px is the
 * number that kills the illusion. So the registration gate is measured from
 * getBoundingClientRect, and the screenshots exist for the human judgement
 * that measurement cannot make.
 */

/* Dense enough to catch a wrap-count change between breakpoints — a slot
   sized for 1440 that overflows at 1200 is a bug nobody sees until it ships. */
const WIDTHS = [320, 360, 414, 600, 768, 900, 1024, 1280, 1440, 1920, 2560];
const SLOTS = ['.hero__eyebrow', '.hero__title', '.hero__lead', '.hero__actions', '.hero__tags'];
const SHOTS = path.resolve(process.cwd(), 'docs/shots/loop2');

/* A layer swap must not move anything. Half a CSS pixel is the tolerance —
   below that is sub-pixel rounding, above it is a bug. */
const TOL = 0.5;

async function slotBoxes(page: Page, variant: 'pro' | 'art') {
  return page.evaluate(
    ({ variant, slots }) =>
      slots.map((sel) => {
        const el = document.querySelector(`.hero__layer--${variant} ${sel}`) as HTMLElement;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          sel,
          top: +r.top.toFixed(2),
          left: +r.left.toFixed(2),
          height: +r.height.toFixed(2),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          fontFamily: cs.fontFamily,
        };
      }),
    { variant, slots: SLOTS },
  );
}

test.describe('hero layer registration', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'geometry is engine-independent; measure once');

  for (const width of WIDTHS) {
    test(`registers at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 700 ? 720 : 900 });
      await page.goto('/');
      /* BootSequence.vue paints a full-screen curtain at z-index 70. Element
         screenshots capture whatever overlays the box, so without this every
         "hero" screenshot is a picture of the boot counter. */
      await page.waitForSelector('.boot', { state: 'detached', timeout: 15_000 });
      await page.waitForFunction(() => document.fonts.status === 'loaded');
      await page.waitForTimeout(300);

      const pro = await slotBoxes(page, 'pro');
      const art = await slotBoxes(page, 'art');

      const drift: string[] = [];
      for (let i = 0; i < SLOTS.length; i++) {
        const p = pro[i];
        const a = art[i];
        expect(p, `${SLOTS[i]} missing in pro layer`).toBeTruthy();
        expect(a, `${SLOTS[i]} missing in art layer`).toBeTruthy();
        const dTop = Math.abs(p!.top - a!.top);
        const dLeft = Math.abs(p!.left - a!.left);
        const dHeight = Math.abs(p!.height - a!.height);
        if (dTop > TOL || dLeft > TOL || dHeight > TOL) {
          drift.push(`${SLOTS[i]}: Δtop=${dTop.toFixed(2)} Δleft=${dLeft.toFixed(2)} Δheight=${dHeight.toFixed(2)}`);
        }
      }

      /* The headline must also be the same face at the same size — same box
         with different metrics still reads as two websites. */
      expect(pro[1]!.fontSize).toBe(art[1]!.fontSize);
      expect(pro[1]!.lineHeight).toBe(art[1]!.lineHeight);
      expect(pro[1]!.letterSpacing).toBe(art[1]!.letterSpacing);
      expect(pro[1]!.fontFamily).toBe(art[1]!.fontFamily);

      /* Fixed slots have TWO failure modes and the first run only checked one.
         Overflow clips the text; under-fill leaves a hole that reads as a
         layout bug rather than as air. A slot may be at most one line taller
         than the tallest of the two layers' content. */
      const fill = await page.evaluate(() => {
        const out: { key: string; lines: number; slotLines: number }[] = [];
        for (const v of ['pro', 'art']) {
          for (const sel of ['.hero__title', '.hero__lead']) {
            const el = document.querySelector(`.hero__layer--${v} ${sel}`) as HTMLElement;
            if (!el) continue;
            const lh = parseFloat(getComputedStyle(el).lineHeight);
            /* Grid items stretch to fill their row, so scrollHeight measures
               the BOX and always equals the slot — it reported 3/3 for a
               headline that visibly used 2 lines. A Range over the contents
               measures the text itself. */
            const range = document.createRange();
            range.selectNodeContents(el);
            out.push({
              key: `${v}${sel}`,
              lines: Math.round(range.getBoundingClientRect().height / lh),
              slotLines: Math.round(el.clientHeight / lh),
            });
          }
        }
        return out;
      });

      const overflow = fill
        .filter((f) => f.lines > f.slotLines)
        .map((f) => `${f.key}: ${f.lines} lines in a ${f.slotLines}-line slot (overflow)`);
      const underfill = ['.hero__title', '.hero__lead']
        .map((sel) => {
          const both = fill.filter((f) => f.key.endsWith(sel));
          const used = Math.max(...both.map((f) => f.lines));
          const slot = both[0].slotLines;
          return slot - used > 1 ? `${sel}: ${slot}-line slot holding ${used} lines (hole)` : null;
        })
        .filter(Boolean) as string[];

      /* No horizontal overflow at any width. */
      const hOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      fs.mkdirSync(SHOTS, { recursive: true });
      /* .5 opacity is the naked-eye check the loop asks for: at 50% both
         headlines are visible at once and any drift reads as a ghost. */
      await page.evaluate(() => {
        const art = document.querySelector('.hero__layer--art') as HTMLElement;
        art.style.opacity = '0.5';
      });
      await page.locator('.hero').screenshot({ path: path.join(SHOTS, `${width}-overlay.png`) });
      await page.evaluate(() => {
        const art = document.querySelector('.hero__layer--art') as HTMLElement;
        art.style.opacity = '0';
      });
      await page.locator('.hero').screenshot({ path: path.join(SHOTS, `${width}-pro.png`) });
      await page.evaluate(() => {
        const art = document.querySelector('.hero__layer--art') as HTMLElement;
        art.style.opacity = '1';
      });
      await page.locator('.hero').screenshot({ path: path.join(SHOTS, `${width}-art.png`) });

      console.log(
        `WIDTH ${width} drift=${drift.length ? drift.join(' | ') : 'none'} ` +
        `fill=${fill.map((f) => `${f.key}:${f.lines}/${f.slotLines}`).join(' ')} ` +
        `underfill=${underfill.length ? underfill.join(' | ') : 'none'} hScroll=${hOverflow}`,
      );

      expect(drift, `layers drifted at ${width}px`).toEqual([]);
      expect(overflow, `content overflows its slot at ${width}px`).toEqual([]);
      expect(underfill, `slot is taller than its content at ${width}px`).toEqual([]);
      expect(hOverflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
    });
  }
});

test('cumulative layout shift is zero', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'layout-shift API is Chromium-only');

  /* addInitScript, not evaluate-after-load: a buffered layout-shift entry keeps
     its value but loses its source nodes, which is how the first run produced a
     number with `sources: []` and nothing to act on. */
  await page.addInitScript(() => {
    (window as any).__cls = 0;
    (window as any).__clsSources = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as any[]) {
        if (e.hadRecentInput) continue;
        (window as any).__cls += e.value;
        for (const src of e.sources ?? []) {
          const n = src.node as HTMLElement | null;
          (window as any).__clsSources.push({
            value: +e.value.toFixed(5),
            node: n ? `${n.tagName.toLowerCase()}.${(n.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.')}` : '(detached)',
            inHero: n ? !!n.closest?.('.hero') : false,
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const cls = await page.evaluate(() => (window as any).__cls);
  const sources = await page.evaluate(() => (window as any).__clsSources);
  const heroCls = sources.filter((s: any) => s.inHero).reduce((a: number, s: any) => a + s.value, 0);
  console.log(`CLS total=${cls} hero=${heroCls} sources=${JSON.stringify(sources)}`);

  /* The gate is the hero. Shifts elsewhere on the page predate Loop 2 and are
     reported, not silently absorbed into this loop's pass. */
  expect(heroCls).toBeLessThanOrEqual(0.001);
});

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const summarise = (violations: any[]) =>
  violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, target: v.nodes[0]?.target?.join(' ') }));

test('axe: no violations in the hero', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'run the a11y gate once');
  await page.goto('/');
  await page.waitForSelector('.boot', { state: 'detached', timeout: 15_000 });
  await page.waitForTimeout(500);

  /* The GATE is the hero — that is what this loop built and what it may not
     regress. The page-wide scan runs too, but as a report: violations outside
     .hero predate Loop 2 and fixing them is not this loop's licence. */
  const hero = await new AxeBuilder({ page }).include('.hero').withTags(TAGS).analyze();
  const page_ = await new AxeBuilder({ page }).withTags(TAGS).analyze();

  console.log('AXE hero ' + JSON.stringify(summarise(hero.violations), null, 2));
  console.log('AXE page (informational, includes pre-existing) ' + JSON.stringify(summarise(page_.violations), null, 2));

  expect(summarise(hero.violations)).toEqual([]);
});
