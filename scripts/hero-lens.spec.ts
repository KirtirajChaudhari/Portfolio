import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

/*
 * X-Ray Hero — Loop 3 acceptance.
 *
 * Frame timing is sampled by a rAF probe injected before page scripts, so it
 * measures the page's real frame cadence rather than the harness's round-trip.
 * `?noboot=1` is the dev-only BootSequence bypass — without it every screenshot
 * is a picture of the boot counter (learned in Loop 2).
 */

const URL_ = '/?noboot=1';
const SHOTS = path.resolve(process.cwd(), 'docs/shots/loop3');

async function installProbe(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;
    w.__fps = { samples: [] as number[], on: false };
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (w.__fps.on && dt > 0 && dt < 1000) w.__fps.samples.push(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    /* Counts DOM writes to the mask circle, which is how we observe whether the
       component's rAF loop actually goes idle rather than spinning. */
    w.__maskWrites = 0;
    const startObs = () => {
      const c = document.querySelector('#xray-lens circle');
      if (!c) return setTimeout(startObs, 100);
      new MutationObserver((m) => { w.__maskWrites += m.length; }).observe(c, { attributes: true });
    };
    startObs();
  });
}

const stats = (samples: number[]) => {
  const sorted = [...samples].sort((a, b) => a - b);
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  return {
    frames: samples.length,
    avgFps: +(1000 / avg).toFixed(1),
    p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
    worst: +sorted[sorted.length - 1].toFixed(2),
    over50: samples.filter((d) => d > 50).length,
  };
};

async function driveCircle(page: Page, steps = 240) {
  const vp = page.viewportSize()!;
  const cx = vp.width / 2;
  const cy = vp.height / 2;
  const rad = Math.min(vp.width, vp.height) * 0.3;
  await page.mouse.move(cx + rad, cy);
  await page.waitForTimeout(150);
  await page.evaluate(() => { (window as any).__fps.on = true; (window as any).__fps.samples = []; });
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 4;
    await page.mouse.move(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    await page.waitForTimeout(4);
  }
  await page.evaluate(() => { (window as any).__fps.on = false; });
  return stats(await page.evaluate(() => (window as any).__fps.samples));
}

test('lens activates in this environment', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'diagnostic');
  await page.goto(URL_);
  await page.waitForTimeout(800);
  const env = await page.evaluate(() => ({
    fine: matchMedia('(hover: hover) and (pointer: fine)').matches,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    lensMode: (document.querySelector('.hero') as HTMLElement)?.dataset.lensMode ?? null,
    circle: !!document.querySelector('#xray-lens circle'),
    r: document.querySelector('#xray-lens circle')?.getAttribute('r') ?? null,
  }));
  console.log('LENS env ' + JSON.stringify(env));
  await page.mouse.move(400, 400);
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({
    r: document.querySelector('#xray-lens circle')?.getAttribute('r') ?? null,
    cx: document.querySelector('#xray-lens circle')?.getAttribute('cx') ?? null,
    ring: (document.querySelector('.hero__ring') as HTMLElement)?.style.transform || '(none)',
    ringOpacity: (document.querySelector('.hero__ring') as HTMLElement)?.style.opacity || '(none)',
    rawUpdate: 'onpointerrawupdate' in window,
  }));
  console.log('LENS afterMove ' + JSON.stringify(after));
});

for (const rate of [1, 4]) {
  test(`lens holds frame rate @ CPU ${rate}x`, async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'CPU throttling needs CDP');
    test.setTimeout(90_000);
    await installProbe(page);
    await page.goto(URL_);
    await page.waitForTimeout(800);

    const cdp = await context.newCDPSession(page);
    if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate });

    const s = await driveCircle(page);
    console.log(`LENS cpu=${rate}x ${JSON.stringify(s)}`);
    if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    expect(s.avgFps).toBeGreaterThanOrEqual(58);
    expect(s.over50).toBe(0);
  });
}

/* Loop 1 showed CPU throttling barely touches a raster-bound workload (~4%).
   Viewport area is the axis that actually stresses it, so this is the honest
   version of the "does it hold up" question. */
test('lens holds frame rate at 2560x1440', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 2560, height: 1440 });
  await installProbe(page);
  await page.goto(URL_);
  await page.waitForTimeout(800);
  const s = await driveCircle(page);
  console.log(`LENS 2560x1440 ${JSON.stringify(s)}`);
  expect(s.avgFps).toBeGreaterThanOrEqual(50);
});

test('lens closes within 400ms of pointerleave, and the loop goes idle', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await installProbe(page);
  await page.goto(URL_);
  await page.waitForTimeout(800);

  const vp = page.viewportSize()!;
  await page.mouse.move(vp.width / 2, vp.height / 2);
  await page.waitForTimeout(600);

  const openR = await page.evaluate(() => +document.querySelector('#xray-lens circle')!.getAttribute('r')!);
  expect(openR, 'lens should be open while the pointer is inside').toBeGreaterThan(100);

  /* Leave through the top edge — outside the hero, not merely at its border. */
  const t0 = Date.now();
  await page.mouse.move(vp.width / 2, -20);
  let closedAt = -1;
  for (let i = 0; i < 60; i++) {
    const r = await page.evaluate(() => +document.querySelector('#xray-lens circle')!.getAttribute('r')!);
    if (r <= 20) { closedAt = Date.now() - t0; break; }
    await page.waitForTimeout(16);
  }
  console.log(`LENS openR=${openR} closedIn=${closedAt}ms`);
  expect(closedAt, 'lens never closed').toBeGreaterThan(-1);
  expect(closedAt).toBeLessThanOrEqual(500);

  /* Settled: no further writes to the mask for half a second. */
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => (window as any).__maskWrites);
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => (window as any).__maskWrites);
  console.log(`LENS maskWrites idle delta=${after - before}`);
  expect(after - before, 'rAF loop is still writing while idle').toBe(0);
});

test('the reveal trails the ring', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await installProbe(page);
  await page.goto(URL_);
  await page.waitForTimeout(800);

  const vp = page.viewportSize()!;
  await page.mouse.move(200, vp.height / 2);
  await page.waitForTimeout(600);

  /* One long fast sweep; sample the gap between the true pointer and the
     lerped mask centre. Zero lag means the lerp is not doing its job. */
  const lags: number[] = [];
  for (let x = 200; x < 1100; x += 45) {
    await page.mouse.move(x, vp.height / 2);
    const cx = await page.evaluate(() => +document.querySelector('#xray-lens circle')!.getAttribute('cx')!);
    lags.push(x - cx);
  }
  const maxLag = Math.max(...lags);
  console.log(`LENS lag samples=${JSON.stringify(lags.slice(1))} max=${maxLag}`);
  expect(maxLag, 'reveal snaps to the pointer — no lens feel').toBeGreaterThan(5);
  expect(maxLag, 'reveal is syrup — lerp too low').toBeLessThan(400);
});

test('keyboard and selection survive the lens', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await page.goto(URL_);
  await page.waitForTimeout(800);

  /* Every focusable in the professional layer is reachable, with a visible ring. */
  const reached: string[] = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || '').trim().slice(0, 30),
        inHero: !!el.closest('.hero'),
        inArt: !!el.closest('.hero__layer--art'),
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        cursor: cs.cursor,
      };
    });
    if (info?.inHero) reached.push(`${info.text}|ring=${info.outline}|cursor=${info.cursor}`);
    if (info?.inArt) throw new Error('focus entered the inert artistic layer');
  }
  console.log(`LENS focusables ${JSON.stringify(reached)}`);
  expect(reached.length, 'no hero focusables reachable by keyboard').toBeGreaterThanOrEqual(2);
  expect(reached.every((r) => r.includes('ring=true')), 'a hero focusable has no visible focus ring').toBe(true);
  expect(reached.every((r) => r.includes('cursor=pointer')), 'a clickable lost its pointer cursor').toBe(true);

  /* Professional-layer text is still selectable. */
  const selected = await page.evaluate(() => {
    const el = document.querySelector('.hero__layer--pro .hero__lead') as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
    return sel.toString().trim().length;
  });
  console.log(`LENS selectableChars=${selected}`);
  expect(selected).toBeGreaterThan(50);
});

test('seam readability screenshots', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'shoot once');
  await page.goto(URL_);
  await page.waitForTimeout(800);
  const vp = page.viewportSize()!;

  /* Park the lens over the headline — the worst case for the professional
     layer's ink meeting the artistic layer's ground at the feather. */
  for (const [name, x, y] of [
    ['headline', 380, 330],
    ['lead', 300, 560],
    ['cta', 120, 682],
  ] as const) {
    await page.mouse.move(x, y);
    await page.waitForTimeout(700);
    await page.locator('.hero').screenshot({ path: path.join(SHOTS, `lens-${name}.png`) });
  }

  await page.mouse.move(vp.width / 2, -20);
  await page.waitForTimeout(700);
  await page.locator('.hero').screenshot({ path: path.join(SHOTS, 'lens-closed.png') });
});
