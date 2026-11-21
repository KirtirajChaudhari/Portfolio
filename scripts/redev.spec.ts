import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Acceptance gate for the re-dev pages (docs/redev-plan.md). Run against the
   production build:

     npm run build && npm run preview &
     BASE_URL=http://localhost:4173 npx playwright test scripts/redev.spec.ts --project=chromium
*/

const ROUTES = ['/', '/work', '/projects/rasacare', '/projects/drishtimanas', '/projects/lab-complaint', '/about', '/contact', '/creator', '/not-a-page'];
const WIDTHS = [320, 390, 768, 1024, 1440];

/* The 3D stage sits below the hero and About; its figure is built only once the
   stage is within a screen of the viewport. */
async function reachStage(page: Page) {
  await page.locator('#work').evaluate((el) => el.scrollIntoView());
  await page.waitForFunction(() => document.querySelector('.stage canvas'));
}

function watchConsole(page: Page) {
  const problems: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  return problems;
}

for (const route of ROUTES) {
  test(`${route}: one h1, clean console, no sideways scroll`, async ({ page }) => {
    const problems = watchConsole(page);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(route);
      await page.locator('h1').first().waitFor();
      expect(await page.locator('h1').count(), `h1 count at ${width}`).toBe(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
    expect(problems).toEqual([]);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`${route}: axe, ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto(route);
      await page.locator('h1').first().waitFor();
      const { violations } = await new AxeBuilder({ page }).analyze();
      const bad = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
}

test('no em or en dash in visible copy', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    await page.locator('h1').first().waitFor();
    const text = await page.locator('body').innerText();
    expect(text.match(/[—–]/g) ?? [], route).toEqual([]);
  }
});

test('unknown routes are a real, non-indexed 404', async ({ page }) => {
  await page.goto('/not-a-page');
  await expect(page.locator('h1')).toHaveText('Nothing at this address.');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex');
  await page.goto('/projects/not-a-project');
  await expect(page.locator('h1')).toHaveText('Nothing at this address.');
});

test('home: the headline is the LCP element and the figure is not in the first load', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('/');
  const html = await (await page.request.get('/')).text();
  expect(html).not.toMatch(/assets\/(engine|Field|formations)/);
  const lcp = await page.evaluate(() => new Promise<string>((resolve) => {
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1) as PerformanceEntry & { element?: Element };
      resolve(last.element?.tagName ?? 'none');
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }));
  expect(['H1', 'P']).toContain(lcp);
  await page.waitForTimeout(1500);
  expect(scripts.some((u) => /engine/.test(u)), 'figure code fetched before the stage is near').toBe(false);
  await reachStage(page);
  await expect.poll(() => scripts.some((u) => /engine/.test(u))).toBe(true);
});

test('home: layout does not shift', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2000);
  const cls = await page.evaluate(() => new Promise<number>((resolve) => {
    let total = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) total += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => resolve(total), 300);
  }));
  expect(cls).toBeLessThan(0.01);
});

/* Counts draws and contexts. `window.__FORCE_WEBGL__` exercises the WebGL path
   even on a software rasteriser (see lib/gpu.ts). */
async function instrument(page: Page, forceWebGL: boolean) {
  await page.addInitScript((force) => {
    const w = window as unknown as { __FORCE_WEBGL__?: boolean; __gl: { contexts: number; draws: number; frames: number } };
    if (force) w.__FORCE_WEBGL__ = true;
    w.__gl = { contexts: 0, draws: 0, frames: 0 };
    const getContext = HTMLCanvasElement.prototype.getContext;
    const seen = new WeakSet<object>();
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      const ctx = (getContext as (...a: unknown[]) => unknown).call(this, type, ...rest) as object | null;
      if (ctx && /webgl/.test(type) && this.isConnected && !seen.has(ctx)) { seen.add(ctx); w.__gl.contexts++; }
      return ctx;
    } as typeof getContext;
    const draw = WebGL2RenderingContext.prototype.drawArrays;
    WebGL2RenderingContext.prototype.drawArrays = function (...a) { w.__gl.draws++; return draw.apply(this, a); };
    const raf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => { w.__gl.frames++; return raf(cb); };
  }, forceWebGL);
}
const counters = (page: Page) => page.evaluate(() => ({ ...(window as unknown as { __gl: { contexts: number; draws: number; frames: number } }).__gl }));

test('home: one WebGL context, the loop stops when the stage leaves the screen', async ({ page }) => {
  await instrument(page, true);
  await page.goto('/');
  // The stage sits below the hero and About; the loop runs only while it is on screen.
  await reachStage(page);
  await page.waitForTimeout(1200);
  const running = await counters(page);
  expect(running.contexts).toBe(1);
  expect(running.draws).toBeGreaterThan(5);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  const before = await counters(page);
  await page.waitForTimeout(800);
  const after = await counters(page);
  expect(after.draws - before.draws, 'draws while the stage is off screen').toBe(0);
});

test('home: scroll steps through the three formations', async ({ page }) => {
  await instrument(page, true);
  await page.goto('/');
  await reachStage(page);
  const stage = page.locator('.stage');
  await expect(stage).toHaveAttribute('data-step', '0');
  for (const step of [1, 2, 3]) {
    await page.evaluate((i) => {
      const p = document.querySelectorAll<HTMLElement>('[data-panel]')[i];
      const r = p.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
    }, step);
    await expect(stage).toHaveAttribute('data-step', String(step));
  }
});

test('reduced motion: still frames, no running loop, every step still reachable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await instrument(page, true);
  await page.goto('/');
  await reachStage(page);
  await page.waitForTimeout(800);
  const a = await counters(page);
  await page.waitForTimeout(1000);
  const b = await counters(page);
  expect(b.draws - a.draws, 'draws while idle').toBe(0);
  expect(await page.locator('.hero h1').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');

  await page.evaluate(() => {
    const p = document.querySelectorAll<HTMLElement>('[data-panel]')[2];
    const r = p.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
  });
  await expect(page.locator('.stage')).toHaveAttribute('data-step', '2');
  await expect(page.getByRole('heading', { name: 'DrishtiManas' })).toBeVisible();
});

test('no hardware GPU: the 2D fallback draws and creates no WebGL context', async ({ page }) => {
  await instrument(page, false);
  await page.goto('/');
  await reachStage(page);
  await page.waitForTimeout(600);
  const hardware = await page.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    return !/swiftshader|llvmpipe|software/i.test(String(info ? gl!.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''));
  });
  test.skip(hardware, 'this machine has a real GPU; the fallback path is not taken');
  const painted = await page.locator('.stage canvas').evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  expect(painted).toBeGreaterThan(2000);
});

test('touch: the page is complete without hover', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Explore', exact: true })).toBeVisible();
  for (const name of ['RasaCare', 'DrishtiManas', 'PRAVAAS']) {
    const h = page.getByRole('heading', { name });
    await h.scrollIntoViewIfNeeded();
    await expect(h).toBeVisible();
  }
  await page.goto('/work');
  await expect(page.getByRole('link', { name: 'Read the RasaCare case' })).toBeVisible();
  await ctx.close();
});

test('theme: crimson by default whatever the system says, the light variant survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/about');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const crimson = await bg();
  await page.getByRole('button', { name: 'Switch to light theme' }).first().click();
  const light = await bg();
  expect(light).not.toBe(crimson);
  await page.reload();
  await page.locator('h1').waitFor();
  expect(await bg()).toBe(light);
  await page.getByRole('button', { name: 'Switch to dark theme' }).first().click();
  expect(await bg()).toBe(crimson);
});

test('contact form: errors are tied to their fields', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Open the draft' }).click();
  const name = page.getByLabel('Your name');
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#contact-name-error')).toHaveText('Add your name.');
  await page.getByLabel('Your email').fill('nope');
  await page.getByRole('button', { name: 'Open the draft' }).click();
  await expect(page.locator('#contact-email-error')).toContainText('name@example.com');
});

test('legacy pages still render in their own styles', async ({ page }) => {
  const problems = watchConsole(page);
  await page.goto('/about');
  await page.goto('/xray');
  await expect(page.locator('h1')).toContainText('Models that have to explain themselves');
  await page.goto('/character');
  await expect(page.locator('h1')).toHaveText('Kirtiraj');
  /* Coming back must restore the professional styles even though the legacy sheets are now loaded. */
  await page.goto('/about');
  await page.locator('h1').waitFor();
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('Archivo');
  expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).fontWeight)).toBe('640');
  expect(problems.filter((p) => !/GPU stall|ReadPixels/.test(p))).toEqual([]);
});

test('prerendered pages read correctly with JavaScript off', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const [route, h1, title] of [
    ['/', 'Kirtiraj Chaudhari, AI/ML engineer', 'Kirtiraj Chaudhari · AI/ML Engineer'],
    ['/work', "What I've built, and where I've worked.", 'Work · Kirtiraj Chaudhari'],
    ['/projects/drishtimanas', 'DrishtiManas', 'DrishtiManas · Kirtiraj Chaudhari'],
    ['/about', 'Machine learning that shows its reasoning.', 'About · Kirtiraj Chaudhari'],
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveText(h1);
    await expect(page).toHaveTitle(title);
    expect(await page.locator('link[rel=canonical]').getAttribute('href')).toBe(`https://kirtiraj-chaudhari.vercel.app${route}`);
  }
  await ctx.close();
});


/* Creator: the photographs stay ordinary images with a keyboard-operated
   larger view; no GPU or third-party typography participates in first load. */
const creatorPhotos = (page: Page) => page.locator('#photos button').filter({ has: page.locator('img') });

test('creator: the heading has a readable accessible name and the shared theme persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/creator');
  await expect(page.getByRole('heading', { level: 1, name: 'Beyond the code', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-chapter', 'pro');
  const darkroom = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.getByRole('button', { name: 'Switch to light theme' }).first().click();
  const paper = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(paper).not.toBe(darkroom);
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(paper);
});

test('creator: photograph order survives reloads and every thumbnail decodes', async ({ page }) => {
  await page.goto('/creator');
  const photos = creatorPhotos(page);
  await expect(photos).toHaveCount(14);
  const sources = () => photos.locator('img').evaluateAll((images) => images.map((img) => img.getAttribute('src')));
  const original = await sources();
  expect(new Set(original).size).toBe(original.length);
  for (const image of await photos.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(await image.getAttribute('alt')).toBeTruthy();
  }
  await page.reload();
  await expect(photos).toHaveCount(14);
  expect(await sources()).toEqual(original);
});

test('creator: photograph dialog supports arrows, focus containment, Escape and focus return', async ({ page }) => {
  await page.goto('/creator');
  const photos = creatorPhotos(page);
  const opener = photos.first();
  await opener.scrollIntoViewIfNeeded();
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Photograph viewer' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  const picture = dialog.locator('img');
  const first = await picture.getAttribute('src');
  await page.keyboard.press('ArrowRight');
  await expect(picture).not.toHaveAttribute('src', first!);
  const second = await picture.getAttribute('src');
  await page.keyboard.press('ArrowLeft');
  await expect(picture).toHaveAttribute('src', first!);
  await dialog.getByRole('button', { name: 'Next photograph', exact: true }).click();
  await expect(picture).toHaveAttribute('src', second!);
  await dialog.getByRole('button', { name: 'Previous photograph', exact: true }).click();
  await expect(picture).toHaveAttribute('src', first!);
  // Tabbing repeatedly must stay inside the native modal, in both directions.
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole('button', { name: 'Close photograph', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

async function assertStaticCreator(page: Page) {
  await page.goto('/creator');
  const wall = page.locator('.creator-photo-wall');
  await wall.scrollIntoViewIfNeeded();
  await expect(wall).toHaveAttribute('data-motion', 'static');
  await expect(creatorPhotos(page)).toHaveCount(14);
  await page.waitForTimeout(500);
  // Start counting after hydration and scrolling settle. The static gallery
  // must not keep scheduling frames in an otherwise idle document.
  await page.evaluate(() => {
    const w = window as unknown as { __creatorIdleFrames: number };
    w.__creatorIdleFrames = 0;
    const request = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => { w.__creatorIdleFrames++; return request(callback); };
  });
  await page.mouse.move(160, 400);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => (window as unknown as { __creatorIdleFrames: number }).__creatorIdleFrames)).toBe(0);
  expect(await page.locator('.creator-photo-grid').evaluate((el) => getComputedStyle(el).transform)).toBe('none');
}

test('creator: reduced motion has a static grid without idle animation frames', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await assertStaticCreator(page);
});

test('creator: touch has a static grid without idle animation frames', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true });
  try { await assertStaticCreator(await ctx.newPage()); }
  finally { await ctx.close(); }
});

test('creator: first load needs no WebGL, Google Fonts, or gallery library', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    const w = window as unknown as { __creatorWebGLAttempts: number };
    w.__creatorWebGLAttempts = 0;
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (/webgl/i.test(type)) w.__creatorWebGLAttempts++;
      return (getContext as (...args: unknown[]) => unknown).call(this, type, ...args);
    } as typeof getContext;
  });
  await page.goto('/creator');
  await expect(page.locator('h1')).toBeVisible();
  await page.waitForTimeout(500);
  expect(requests.filter((url) => /fonts\.googleapis\.com|fonts\.gstatic\.com|three(?:\.module)?(?:[-.]|\/)|art-gallery/i.test(url))).toEqual([]);
  await page.locator('#photos').scrollIntoViewIfNeeded();
  await creatorPhotos(page).last().scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => (window as unknown as { __creatorWebGLAttempts: number }).__creatorWebGLAttempts)).toBe(0);
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('creator: Spotify is deferred until the music section approaches', async ({ page }) => {
  const spotifyRequests: string[] = [];
  page.on('request', (request) => { if (request.url().startsWith('https://open.spotify.com/embed/')) spotifyRequests.push(request.url()); });
  await page.goto('/creator');
  await expect(page.locator('h1')).toBeVisible();
  expect(spotifyRequests).toEqual([]);
  await expect(page.locator('iframe[src^="https://open.spotify.com/embed/"]')).toHaveCount(0);
  await page.locator('#music').scrollIntoViewIfNeeded();
  // The artist profile and the debut single, each titled, each with a reload control.
  const player = page.locator('iframe[src^="https://open.spotify.com/embed/"]');
  await expect(player).toHaveCount(2);
  await expect(page.locator('iframe[src*="/embed/artist/"]')).toHaveAttribute('title', /artist profile/i);
  await expect(page.locator('iframe[src*="/embed/track/"]')).toHaveAttribute('title', /.+/);
  await expect(page.getByRole('button', { name: /Reload the .* player/ })).toHaveCount(2);
  await expect.poll(() => spotifyRequests.length).toBeGreaterThan(0);
});

test('creator and profile-2 keep canonical, readable HTML with JavaScript off', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await ctx.newPage();
    for (const route of ['/creator', '/profile-2']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1, name: 'Beyond the code', exact: true })).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle('Creator · Kirtiraj Chaudhari');
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://kirtiraj-chaudhari.vercel.app/creator');
      await expect(page.locator('#photos img')).toHaveCount(14);
      await expect(page.getByRole('link', { name: /Musical Kirtiraj|YouTube/ }).first()).toHaveAttribute('href', 'https://www.youtube.com/@MusicalKirtiraj');
    }
  } finally { await ctx.close(); }
});
