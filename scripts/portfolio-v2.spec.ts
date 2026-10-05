import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

/* Portfolio v2: nav order, the two new routes, creative-profile states, a11y, calm modes, and the
   loop / listener / WebGL-context leak test across all five pages. */
const OUT = path.resolve(process.cwd(), 'docs/shots/portfolio-v2');
const ROUTES = ['/', '/about', '/work', '/contact', '/creator'] as const;
const WIDTHS = [360, 768, 1440] as const;
const slug = (r: string) => (r === '/' ? 'home' : r.slice(1));

const CONTENT: Record<string, string[]> = {
  '/': ['Kirtiraj', 'Resume'],
  '/about': ['Backed by a technical foundation', 'Building RasaCare', 'RTCSA-2026', 'Education'],
  '/work': ['RasaCare', 'Internships', 'Machine Learning', 'Knowledge Graphs'],
  '/contact': ["Let's talk.", 'Send message', 'Based in'],
  '/creator': ['Beyond', 'Photography', 'The Musician', 'Poetry'],
};

function watch(page: Page) {
  const bad: string[] = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) bad.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => bad.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`HTTP ${r.status()} ${r.url()}`); });
  page.on('requestfailed', (r) => bad.push(`requestfailed ${r.url()}`));
  return bad;
}

async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

/* Spotify's embed logs a Windows PlayReady notice in Chromium, and Instagram's embed makes its own
   requests and logs its own errors. All of it comes from their frames, not this site. */
const ours = (b: string[]) => b.filter((x) => !/playready/i.test(x)
  && !/requestfailed https:\/\/open\.spotify\.com/.test(x)
  && !/instagram|cdninstagram|fbcdn/i.test(x)
  && !/Feature Policy: Skipping unsupported feature name/.test(x)); /* Firefox, from the Spotify iframe's `allow` list */

test.describe('navigation order', () => {
  for (const [label, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 360, height: 740 }]] as const) {
    test(`About comes before Work, in DOM and in tab order (${label})`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/about');
      await page.waitForTimeout(800);
      const dom = await page.locator('nav[aria-label=Primary] a').allInnerTexts();
      const names = dom.map((t) => t.trim().toLowerCase());
      expect(names.indexOf('about'), `DOM order: ${names}`).toBeGreaterThanOrEqual(0);
      expect(names.indexOf('about')).toBeLessThan(names.indexOf('work'));
      expect(names.indexOf('work')).toBeLessThan(names.indexOf('contact'));

      /* Tab order: Tab from the top until each is focused. */
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const seen: string[] = [];
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
        seen.push((await page.evaluate(() => document.activeElement?.textContent ?? '')).trim().toLowerCase());
      }
      expect(seen.indexOf('about'), `tab order: ${seen}`).toBeGreaterThanOrEqual(0);
      expect(seen.indexOf('about')).toBeLessThan(seen.indexOf('work'));

      const foot = (await page.locator('footer nav[aria-label=Footer] a').allInnerTexts()).map((t) => t.trim().toLowerCase());
      expect(foot.indexOf('about')).toBeLessThan(foot.indexOf('work'));
    });
  }
});

test.describe('screenshots, overflow', () => {
  for (const route of ['/contact', '/creator'] as const) {
    for (const width of WIDTHS) {
      test(`${route} @ ${width}`, async ({ page }) => {
        fs.mkdirSync(OUT, { recursive: true });
        await page.setViewportSize({ width, height: width < 700 ? 760 : 900 });
        await page.goto(route);
        await page.waitForTimeout(1800);
        await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}-top.png`) });
        await scrollThrough(page);
        await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}-full.png`), fullPage: true });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `overflow ${route} @ ${width}`).toBeLessThanOrEqual(0);
      });
    }
  }
  for (const width of WIDTHS) {
    for (const route of ['/about', '/work'] as const) {
      test(`${route} @ ${width} (screenshots)`, async ({ page }) => {
        await page.setViewportSize({ width, height: width < 700 ? 760 : 900 });
        await page.goto(route);
        await page.waitForTimeout(1500);
        await scrollThrough(page);
        await page.screenshot({ path: path.join(OUT, `${slug(route)}-${width}-full.png`), fullPage: true });
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe('creative profile states', () => {
  test('writings book opens by keyboard and by click; photos and book fall back cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const bad = watch(page);
    await page.goto('/creator');
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.getElementById('poetry')?.scrollIntoView());
    await page.waitForTimeout(1200);
    const cover = page.getByRole('button', { name: /Open The notebook/i });
    await expect(cover).toBeVisible();
    await cover.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1900);
    await page.screenshot({ path: path.join(OUT, 'creator-book-open-1440.png') });
    await expect(page.getByRole('button', { name: /Next page/i })).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, 'creator-book-page-1440.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(900);
    await expect(page.getByRole('button', { name: /Open The notebook/i })).toBeVisible();
    /* Every Instagram frame is a real link, and the book's words are in the DOM for screen readers. */
    expect(await page.getByRole('list', { name: 'Photographs on Instagram' }).getByRole('link').count()).toBe(11);
    expect(await page.locator('.sr-only', { hasText: 'Filling notebooks with lines' }).count()).toBeGreaterThan(0);
    expect(ours(bad)).toEqual([]);
  });
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
        expect(ours(bad), `console/network ${route} @ ${width}`).toEqual([]);
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
      /* Spotify's own embed is third-party markup (aria-required-children inside their list); not ours to fix. */
      const r = await new AxeBuilder({ page }).exclude('iframe[src*="spotify"]').exclude('iframe[src*="instagram"]').exclude('.instagram-media').analyze();
      const rows = r.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes[0]?.target?.join(' ')}`);
      console.log(`AXE ${route}`, JSON.stringify(rows));
      expect(rows.filter((x) => /\((serious|critical)\)/.test(x)), `axe ${route}`).toEqual([]);
    });
  }
});

async function everyPage(page: Page) {
  for (const route of ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(1500);
    if (route !== '/') await scrollThrough(page);
    for (const t of CONTENT[route]) await expect(page.getByText(t, { exact: false }).first(), `"${t}" on ${route}`).toBeVisible();
  }
}

test('reduced motion: every page complete', async ({ browser }) => {
  test.setTimeout(120_000);
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const bad = watch(page);
  await everyPage(page);
  /* No ticker, no book, no keyboard animation: the calm versions. */
  await page.goto('/creator');
  expect(await page.locator('.creator-ticker').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.evaluate(() => document.getElementById('poetry')?.scrollIntoView());
  await expect(page.getByRole('button', { name: /Open The notebook/i })).toHaveCount(0);
  await expect(page.getByText('Read them on Instagram').first()).toBeVisible();
  await ctx.close();
  expect(ours(bad)).toEqual([]);
});

test('touch (hover: none): every page complete, no swinging card, no auto-typing', async ({ browser }) => {
  test.setTimeout(120_000);
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const bad = watch(page);
  expect(await page.evaluate(() => matchMedia('(hover: none)').matches)).toBe(true);
  await everyPage(page);
  await page.goto('/about');
  await page.locator('#skills').waitFor();              // the route is lazy: wait for it before scrolling
  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
  await page.waitForTimeout(1500);
  expect(await page.locator('.cursor-grab').count()).toBe(0);
  /* The still keyboard shows the finished text, not a half-typed one. */
  const screenText = await page.locator('.tk-screen').first().textContent();
  expect(screenText).toContain('Python');
  expect(screenText).toContain('Git');
  await ctx.close();
  expect(ours(bad)).toEqual([]);
});

test('loop, listener and WebGL-context leak: 10 cycles across five pages', async ({ page }) => {
  test.setTimeout(420_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const w = window as any;
    w.__FORCE_WEBGL__ = true;           // exercise the WebGL pages even under a software rasteriser
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
    const durable = (t: unknown) => t === window || t === document || t === document.documentElement || t === document.body;
    EventTarget.prototype.addEventListener = function (this: EventTarget, t: string, l: any, o?: any) {
      if (l && durable(this)) {
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

    const gl = new Set<HTMLCanvasElement>();
    let created = 0;
    const gc = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...a: any[]) {
      const ctx = (gc as any).call(this, type, ...a);
      if (ctx && /webgl/.test(type) && !gl.has(this)) { gl.add(this); created++; }
      return ctx;
    } as any;
    w.__gl = () => ({ connected: [...gl].filter((c) => c.isConnected).length, created });
    w.__errs = [] as string[];
    const ce = console.error;
    console.error = (...a: unknown[]) => { w.__errs.push(a.map(String).join(' ').slice(0, 200)); ce(...a); };
  });
  const state = () => page.evaluate(() => ({
    raf: (window as any).__raf() as number,
    listeners: (window as any).__listeners() as number,
    gl: (window as any).__gl() as { connected: number; created: number },
    cards: document.querySelectorAll('.cursor-grab').length,
    books: document.querySelectorAll('[aria-label="Book controls"]').length,
    canvases: document.querySelectorAll('canvas').length,
  }));
  const go = async (label: string, wait = 1800) => {
    await page.click(`nav[aria-label=Primary] >> text=${label}`);
    await page.waitForTimeout(wait);
  };

  await page.goto('/');
  await page.waitForTimeout(2500);
  const base = await state();
  const log: unknown[] = [{ at: 'home', ...base }];
  const per: Record<string, { listeners: number }> = {};

  for (let i = 0; i < 10; i++) {
    await go('About');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1200);
    const a = await state();
    expect(a.cards, 'about: id cards').toBeLessThanOrEqual(1);
    expect(a.gl.connected, 'about: WebGL contexts').toBeLessThanOrEqual(1);

    await go('Work');
    const w = await state();
    expect(w.cards).toBe(0);
    expect(w.gl.connected, 'work: WebGL contexts').toBeLessThanOrEqual(1);

    await go('Contact', 2600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const c = await state();
    expect(c.gl.connected, 'contact: WebGL contexts').toBeLessThanOrEqual(1);

    await go('Profile 2', 1200);
    await page.evaluate(() => document.getElementById('photos')?.scrollIntoView());
    await page.waitForTimeout(2600);
    const p = await state();
    expect(p.gl.connected, 'creator: WebGL contexts').toBeLessThanOrEqual(1);
    expect(p.books, 'creator: books').toBeLessThanOrEqual(1);

    await page.click('nav[aria-label=Primary] >> text=KC');
    await page.waitForTimeout(1800);
    const h = await state();
    expect(h.canvases, 'home: canvases').toBe(1);
    expect(h.gl.connected, 'home: WebGL contexts').toBe(0);
    log.push({ cycle: i + 1, about: a, work: w, contact: c, creator: p, home: h });

    for (const [k, v] of Object.entries({ about: a, work: w, contact: c, creator: p })) {
      if (!per[k]) per[k] = { listeners: v.listeners };
      else expect(v.listeners, `${k} listeners drifted in cycle ${i + 1}`).toBeLessThanOrEqual(per[k].listeners + 1);
    }
    expect(h.listeners, `home listeners, cycle ${i + 1}`).toBeLessThanOrEqual(base.listeners + 1);
    expect(h.raf, `home rAF, cycle ${i + 1}`).toBeLessThanOrEqual(base.raf + 1);
  }
  const errs = await page.evaluate(() => (window as any).__errs as string[]);
  console.log('LEAK2', JSON.stringify(log[1]), '...', JSON.stringify(log[log.length - 1]));
  expect(errs.filter((e) => /unmounted|memory leak|WebGL context lost/i.test(e))).toEqual([]);
});
