import { test, expect, type Page, type Browser } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

/*
 * Verification for the five-task portfolio update: screenshots, console/network
 * hygiene, axe, reduced-motion and touch runs, and the loop-leak test.
 */
const OUT = path.resolve(process.cwd(), 'docs/shots/portfolio-update');
const ROUTES = ['/', '/work', '/about'] as const;
const WIDTHS = [360, 768, 1440] as const;
const slug = (r: string) => (r === '/' ? 'home' : r.slice(1));

function watch(page: Page) {
  const bad: string[] = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) bad.push(`${m.type()}: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => bad.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`HTTP ${r.status()} ${r.url()}`); });
  page.on('requestfailed', (r) => bad.push(`requestfailed ${r.url()}`));
  return bad;
}

async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

test.describe('screenshots, console, network, overflow', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`${route} @ ${width}`, async ({ page }) => {
        fs.mkdirSync(OUT, { recursive: true });
        const bad = watch(page);
        await page.setViewportSize({ width, height: width < 700 ? 760 : 900 });
        await page.goto(route);
        await page.waitForTimeout(route === '/' ? 2500 : 1500);
        await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}-top.png`) });
        if (route !== '/') {
          await scrollThrough(page);
          await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}-full.png`), fullPage: true });
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `horizontal overflow on ${route} @ ${width}`).toBeLessThanOrEqual(0);
        /* Chromium logs "GPU stall due to ReadPixels" when a screenshot reads back a WebGL
           canvas. That is the capture, not the page: the console test below has no
           screenshots and filters nothing. */
        expect(bad.filter((b) => !/GL Driver Message/.test(b)), `console/network on ${route} @ ${width}`).toEqual([]);
      });
    }
  }
});

test.describe('console clean, no screenshots', () => {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      test(`${route} @ ${width}`, async ({ page }) => {
        const bad = watch(page);
        await page.setViewportSize({ width, height: width < 700 ? 760 : 900 });
        await page.goto(route);
        await page.waitForTimeout(1800);
        if (route !== '/') await scrollThrough(page);
        expect(bad, `console/network on ${route} @ ${width}`).toEqual([]);
      });
    }
  }
});

test.describe('axe', () => {
  for (const route of ROUTES) {
    test(`axe ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route);
      await page.waitForTimeout(2200);
      if (route !== '/') await scrollThrough(page);
      const r = await new AxeBuilder({ page }).analyze();
      const rows = r.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0]?.target?.join(' ')}`);
      console.log(`AXE ${route}`, JSON.stringify(rows));
      expect(rows.filter((x) => /\((serious|critical)\)/.test(x)), `axe ${route}`).toEqual([]);
    });
  }
});

async function visible(page: Page, texts: string[]) {
  for (const t of texts) await expect(page.getByText(t, { exact: false }).first(), `"${t}" visible`).toBeVisible();
}

const CONTENT: Record<string, string[]> = {
  '/': ['Kirtiraj', 'Resume'],
  '/work': ['RasaCare', 'Internships', 'Machine Learning'],
  '/about': ['Backed by a technical foundation', 'Education', 'RTCSA-2026'],
};

async function plainRun(browser: Browser, opts: Parameters<Browser['newContext']>[0]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const bad = watch(page);
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(1500);
    if (route !== '/') await scrollThrough(page);
    await visible(page, CONTENT[route]);
  }
  await ctx.close();
  return bad;
}

test('reduced motion: every page fully usable', async ({ browser }) => {
  const bad = await plainRun(browser, { reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  expect(bad).toEqual([]);
});

test('touch (hover: none): every page fully usable, id card is still', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const bad = watch(page);
  expect(await page.evaluate(() => matchMedia('(hover: none)').matches)).toBe(true);
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(1500);
    if (route !== '/') await scrollThrough(page);
    await visible(page, CONTENT[route]);
  }
  /* The card is on screen and not grabbable. */
  await page.goto('/about');
  await page.locator('text=Drag or click the card').waitFor({ state: 'detached', timeout: 4000 }).catch(() => {});
  await page.evaluate(() => document.querySelector('[class*="h-[34rem]"]')?.scrollIntoView());
  await page.waitForTimeout(800);
  expect(await page.locator('.cursor-grab').count()).toBe(0);
  expect(await page.getByText('Kirtiraj Nitin Chaudhari').first().isVisible()).toBe(true);
  await ctx.close();
  expect(bad).toEqual([]);
});

test('loop-leak: 10 navigation cycles return to baseline', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const w = window as any;
    const live = new Set<number>();
    const raf = window.requestAnimationFrame.bind(window);
    const caf = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => { const id = raf((t) => { live.delete(id); cb(t); }); live.add(id); return id; };
    window.cancelAnimationFrame = (id) => { live.delete(id); caf(id); };
    w.__raf = () => live.size;

    const reg = new WeakMap<object, Map<string, Set<unknown>>>();
    let net = 0;
    const add = EventTarget.prototype.addEventListener;
    const rem = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (this: EventTarget, t: string, l: any, o?: any) {
      /* Only long-lived targets: listeners on elements React removes are garbage-collected with them. */
      if (l && (this === window || this === document || this === document.documentElement || this === document.body)) {
        let m = reg.get(this); if (!m) reg.set(this, (m = new Map()));
        let s = m.get(t); if (!s) m.set(t, (s = new Set()));
        if (!s.has(l)) { s.add(l); net++; }
      }
      return add.call(this, t, l, o);
    } as any;
    EventTarget.prototype.removeEventListener = function (this: EventTarget, t: string, l: any, o?: any) {
      const s = reg.get(this)?.get(t);
      if (s && s.delete(l)) net--;
      return rem.call(this, t, l, o);
    } as any;
    w.__listeners = () => net;
    w.__errs = [] as string[];
    window.addEventListener('error', (e) => w.__errs.push(e.message));
    const ce = console.error;
    console.error = (...a: unknown[]) => { w.__errs.push(a.map(String).join(' ').slice(0, 200)); ce(...a); };
  });
  const bad = watch(page);
  const state = async () => page.evaluate(() => ({
    raf: (window as any).__raf() as number,
    listeners: (window as any).__listeners() as number,
    canvases: document.querySelectorAll('canvas').length,
    cards: document.querySelectorAll('.cursor-grab').length,
    glow: document.querySelectorAll('html.glow-cursor').length,
  }));
  const go = async (label: string) => {
    await page.click(`nav[aria-label=Primary] >> text=${label}`);
    await page.waitForTimeout(1400);
  };

  await page.goto('/');
  await page.waitForTimeout(2500);
  const base = await state();
  const log: unknown[] = [{ at: 'home-initial', ...base }];
  const perPage: Record<string, { raf: number; listeners: number }> = {};

  for (let i = 0; i < 10; i++) {
    await go('About');
    await page.evaluate(() => window.scrollTo(0, 1200));          // wakes the lazy card
    await page.waitForTimeout(900);
    const a = await state();
    expect(a.canvases, 'about: stray canvases').toBeLessThanOrEqual(1);   // backdrop only
    expect(a.cards, 'about: id cards').toBeLessThanOrEqual(1);
    if (!perPage.about) perPage.about = a; else { expect(a.listeners).toBeLessThanOrEqual(perPage.about.listeners + 1); }

    await go('Work');
    await page.waitForTimeout(600);
    const w = await state();
    expect(w.cards, 'work: id cards leaked').toBe(0);
    if (!perPage.work) perPage.work = w; else expect(w.listeners).toBeLessThanOrEqual(perPage.work.listeners + 1);

    await page.click('nav[aria-label=Primary] >> [aria-label=Home]');
    await page.waitForTimeout(1600);
    const h = await state();
    expect(h.canvases, 'home: duplicate canvases').toBe(1);
    expect(h.glow, 'home: glow-cursor class').toBe(1);
    log.push({ cycle: i + 1, about: a, work: w, home: h });
    expect(h.listeners, `listeners after cycle ${i + 1}`).toBeLessThanOrEqual(base.listeners + 1);
    expect(h.raf, `rAF after cycle ${i + 1}`).toBeLessThanOrEqual(base.raf + 1);
  }
  await page.goto('/about');
  await page.waitForTimeout(500);
  const errs = await page.evaluate(() => (window as any).__errs as string[]);
  console.log('LEAK-LOG', JSON.stringify(log.slice(0, 3)), '...', JSON.stringify(log[log.length - 1]));
  expect(errs.filter((e) => /unmounted|memory leak/i.test(e))).toEqual([]);
  expect(bad).toEqual([]);
});
