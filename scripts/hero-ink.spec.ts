import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

/*
 * X-Ray Hero — Loop 4 acceptance (ink spill).
 *
 * The interesting measurements here are all about the EXPANSION, which lasts
 * ~450ms. Sampling it from Node over CDP round-trips would measure the harness,
 * so every sampler below runs inside the page on its own rAF and reports once.
 */

const URL_ = '/xray';
const SHOTS = path.resolve(process.cwd(), 'docs/shots/loop4');

async function installProbe(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;

    /* Long tasks, for the "no long task > 50ms" gate. */
    w.__long = [] as number[];
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) w.__long.push(+e.duration.toFixed(1));
      }).observe({ entryTypes: ['longtask'] });
    } catch { /* not supported — the frame sampler still catches stalls */ }

    /* In-page frame sampler. Records raw deltas so the worst frame is a real
       observation, not an average hiding a stall. */
    w.__f = { on: false, samples: [] as number[] };
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (w.__f.on && dt > 0 && dt < 2000) w.__f.samples.push(+dt.toFixed(2));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    /* Reads the blot's live scale straight off the transform attribute — the
       single number that describes the spill's progress. */
    w.__k = () => {
      const g = document.querySelector('.hero__ink > g:last-child') as SVGGElement | null;
      const m = g?.getAttribute('transform')?.match(/scale\(([\d.]+)\)/);
      return m ? +m[1] : 0;
    };
    /* Per-frame trace of k, for release-continuity checks. */
    w.__trace = { on: false, samples: [] as number[] };
    const trace = () => {
      if (w.__trace.on) w.__trace.samples.push(w.__k());
      requestAnimationFrame(trace);
    };
    requestAnimationFrame(trace);
  });
}

const stats = (s: number[]) => {
  const sorted = [...s].sort((a, b) => a - b);
  return {
    frames: s.length,
    avgFps: +(1000 / (s.reduce((a, b) => a + b, 0) / s.length)).toFixed(1),
    p95: sorted[Math.floor(sorted.length * 0.95)],
    worst: sorted[sorted.length - 1],
    over50: s.filter((d) => d > 50).length,
  };
};

async function open(page: Page) {
  await page.goto(URL_);
  await page.waitForTimeout(900);
  const vp = page.viewportSize()!;
  await page.mouse.move(vp.width / 2, vp.height / 2);
  await page.waitForTimeout(500);
  return vp;
}

test('the ink edge is baked once, and idles at zero cost', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await open(page);
  await page.waitForTimeout(600); /* the bake is idle-scheduled */
  const state = await page.evaluate(() => {
    const g = document.querySelector('.hero__ink') as SVGGElement;
    return {
      display: getComputedStyle(g).display,
      /* A live SVG filter anywhere in the hero is the Loop 4 regression: it
         measured 26.6fps with 105ms long tasks. */
      liveFilters: document.querySelectorAll('.hero [filter], .hero feTurbulence').length,
      baked: (document.querySelector('.hero__ink image') as SVGImageElement | null)
        ?.getAttribute('href')?.startsWith('data:image/png') ?? false,
      fallbacksLeft: document.querySelectorAll('.hero__ink-fallback').length,
    };
  });
  console.log(`INK rest ${JSON.stringify(state)}`);
  expect(state.baked, 'the ink texture never baked').toBe(true);
  expect(state.liveFilters, 'a live SVG filter is back in the hero').toBe(0);
  expect(state.fallbacksLeft, 'the pre-bake circles were left behind').toBe(0);
  expect(state.display, 'the blots are rasterising before anyone asked').toBe('none');
});

test('expansion holds the frame budget', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP + frame timing');
  test.setTimeout(60_000);
  await installProbe(page);
  const vp = await open(page);

  await page.evaluate(() => {
    (window as any).__f.on = true;
    (window as any).__f.samples = [];
    (window as any).__long = [];
  });
  await page.mouse.down();
  await page.waitForTimeout(1200);
  await page.mouse.up();
  await page.waitForTimeout(900);
  await page.evaluate(() => { (window as any).__f.on = false; });

  const samples = await page.evaluate(() => (window as any).__f.samples);
  const long = await page.evaluate(() => (window as any).__long);
  const s = stats(samples);
  console.log(`INK expand ${JSON.stringify(s)} longTasks=${JSON.stringify(long)}`);

  expect(s.over50, `frames over 50ms during the spill: ${s.worst}ms worst`).toBe(0);
  expect(long.filter((d: number) => d > 50).length, 'long task during the spill').toBe(0);
  expect(vp.width).toBeGreaterThan(0);
});

/* Releasing mid-expansion is the failure the spring exists to prevent: a
   timeline would restart from its own clock and jump. Sample k every frame
   across the release and assert no single frame moves more than the fastest
   frame of the expansion itself. */
for (const holdMs of [100, 300, 700]) {
  test(`release at ${holdMs}ms produces no jump`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'measure once');
    await installProbe(page);
    await open(page);

    await page.evaluate(() => { (window as any).__trace.on = true; (window as any).__trace.samples = []; });
    await page.mouse.down();
    await page.waitForTimeout(holdMs);
    await page.mouse.up();
    await page.waitForTimeout(900);
    await page.evaluate(() => { (window as any).__trace.on = false; });

    const k: number[] = await page.evaluate(() => (window as any).__trace.samples);
    const active = k.filter((v) => v > 0);
    expect(active.length, 'the spill never started').toBeGreaterThan(5);

    const steps = active.slice(1).map((v, i) => Math.abs(v - active[i]));
    const worst = Math.max(...steps);
    const peak = Math.max(...active);
    /* A jump means one frame carried a large share of the whole travel. Any
       continuous integrator stays far below this; a restarted timeline does not. */
    console.log(`INK hold=${holdMs}ms peakK=${peak.toFixed(2)} worstStep=${worst.toFixed(3)} frames=${active.length}`);
    expect(worst / peak, 'a single frame moved too much of the travel — that is a jump').toBeLessThan(0.25);
    expect(active[active.length - 1], 'the spill never receded').toBeLessThan(peak * 0.5);
  });
}

test('rapid clicks do not queue or stick', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await installProbe(page);
  await open(page);

  for (let i = 0; i < 10; i++) {
    await page.mouse.down();
    await page.waitForTimeout(30);
    await page.mouse.up();
    await page.waitForTimeout(30);
  }
  /* Enough time for one settle, not ten queued ones. */
  await page.waitForTimeout(900);
  const k = await page.evaluate(() => (window as any).__k());
  const display = await page.evaluate(
    () => getComputedStyle(document.querySelector('.hero__ink') as SVGGElement).display,
  );
  console.log(`INK after 10 clicks k=${k} display=${display}`);
  expect(k, 'the spill is stuck open after rapid clicks').toBeLessThan(0.05);
  expect(display, 'the blots never went back to sleep').toBe('none');
});

test('data-flooded gates the artistic layer, and clears', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'measure once');
  await open(page);

  const before = await page.evaluate(() => document.querySelector('.hero')!.hasAttribute('data-flooded'));
  await page.mouse.down();
  await page.waitForTimeout(700);
  const during = await page.evaluate(() => ({
    flooded: document.querySelector('.hero')!.hasAttribute('data-flooded'),
    ring: (document.querySelector('.hero__ring') as HTMLElement).style.opacity,
  }));
  await page.mouse.up();
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => document.querySelector('.hero')!.hasAttribute('data-flooded'));

  console.log(`INK flooded before=${before} during=${JSON.stringify(during)} after=${after}`);
  expect(before).toBe(false);
  expect(during.flooded, 'the hero never reported itself flooded').toBe(true);
  expect(during.ring, 'the ring should retire once the lens has become the room').toBe('0');
  expect(after).toBe(false);
});

test('ink spill screenshots', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'shoot once');
  const vp = await open(page);
  await page.mouse.move(vp.width * 0.42, vp.height * 0.42);
  await page.waitForTimeout(400);

  await page.locator('.hero').screenshot({ path: path.join(SHOTS, 'ink-0-rest.png') });
  await page.mouse.down();
  for (const [name, wait] of [['1-early', 90], ['2-mid', 160], ['3-flooded', 700]] as const) {
    await page.waitForTimeout(wait);
    await page.locator('.hero').screenshot({ path: path.join(SHOTS, `ink-${name}.png`) });
  }
  await page.mouse.up();
  await page.waitForTimeout(180);
  await page.locator('.hero').screenshot({ path: path.join(SHOTS, 'ink-4-receding.png') });
});
