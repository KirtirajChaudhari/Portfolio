import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/*
 * Character head-tracker smoothness. Run once on the old code (LABEL=before) to
 * record the baseline, then on the new code (LABEL=after ENFORCE=1) to gate it.
 *
 * Everything is measured from inside the page: drawImage is wrapped to log which
 * frame was painted, requestAnimationFrame is wrapped to count outstanding ids,
 * and pointer paths are dispatched from a timer, not from Node round trips.
 */
const LABEL = process.env.LABEL ?? 'after';
const ENFORCE = process.env.ENFORCE === '1';
const OUT = path.resolve(process.cwd(), 'docs/shots/character');
const N = 64;

async function boot(page: Page, hz = 0) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript((simHz: number) => {
    const w = window as any;
    w.__m = { draws: [] as { t: number; k: string }[], long: [] as number[] };
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (this: CanvasRenderingContext2D, img: any, ...a: any[]) {
      const src: string = img?.src ?? '';
      const m = /frame-(\d+)\.webp/.exec(src);
      const k = m ? m[1] : /center\.webp/.test(src) ? 'c' : '?';
      w.__m.draws.push({ t: performance.now(), k });
      return (draw as any).call(this, img, ...a);
    } as any;

    /* Timer-based fake vsync is useless on Windows (15.6ms timer granularity turns
       "60Hz" into ~32Hz). When a rate is simulated, ticks are pumped from a
       MessageChannel against performance.now(), which is exact to the microsecond. */
    const live = new Map<number, number>();
    const queue = new Map<number, FrameRequestCallback>();
    let n = 0;
    const raf = window.requestAnimationFrame.bind(window);
    const caf = window.cancelAnimationFrame.bind(window);
    const ch = new MessageChannel();
    let pumping = false;
    let nextTick = 0;
    const period = simHz ? 1000 / simHz : 0;
    ch.port1.onmessage = () => {
      const now = performance.now();
      if (queue.size && now >= nextTick) {
        nextTick = Math.max(nextTick + period, now - period);
        const due = [...queue.entries()];
        queue.clear();
        for (const [, cb] of due) cb(now);
      }
      if (queue.size) ch.port2.postMessage(0); else pumping = false;
    };
    window.requestAnimationFrame = (cb) => {
      const id = ++n;
      if (simHz) {
        queue.set(id, cb);
        if (!pumping) {
          pumping = true;
          if (nextTick < performance.now()) nextTick = performance.now() + period;
          ch.port2.postMessage(0);
        }
      } else {
        live.set(id, raf((t) => { live.delete(id); cb(t); }));
      }
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      if (simHz) { queue.delete(id); return; }
      const h = live.get(id);
      if (h === undefined) return;
      live.delete(id);
      caf(h);
    };
    const ids = { get size() { return simHz ? queue.size : live.size; } };
    w.__outstanding = () => ids.size;

    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) w.__m.long.push(+e.duration.toFixed(1)); })
        .observe({ entryTypes: ['longtask'] });
    } catch { /* unsupported */ }

    /* Pointer driver. `fn(t)` returns {x,y} or null (= pointerleave) for t in ms. */
    w.__drive = (fn: (t: number) => { x: number; y: number } | null, ms: number) =>
      new Promise<void>((resolve) => {
        const t0 = performance.now();
        let left = false;
        const id = window.setInterval(() => {
          const t = performance.now() - t0;
          const p = fn(t);
          if (p) {
            left = false;
            window.dispatchEvent(new PointerEvent('pointermove', { clientX: p.x, clientY: p.y, pointerType: 'mouse' }));
          } else if (!left) {
            left = true;
            document.documentElement.dispatchEvent(new PointerEvent('pointerleave'));
          }
          if (t >= ms) { clearInterval(id); resolve(); }
        }, 4);
      });
  }, hz);
  await page.goto('/');
  await page.waitForFunction(() => document.querySelectorAll('canvas').length === 1);
  /* All ring frames must be in, or the nearest-neighbour fallback skews every number. */
  await page.waitForFunction(async () => {
    const r = await Promise.all(Array.from({ length: 64 }, (_, k) =>
      fetch(`/frames/frame-${String(k).padStart(2, '0')}.webp`).then((x) => x.ok)));
    return r.every(Boolean);
  });
  await page.waitForTimeout(1500);
}

const FACE = { x: 0.4948 * 1600 - 80, y: 0.4648 * 900 }; /* cover transform at 1440x900 */

const circ = (a: number, b: number) => { const d = Math.abs(a - b) % N; return Math.min(d, N - d); };

async function run(page: Page, fn: string, ms: number) {
  await page.evaluate(() => { (window as any).__m.draws.length = 0; (window as any).__m.long.length = 0; });
  await page.evaluate(([f, d]) => (window as any).__drive(new Function('t', `return (${f})(t)`), d), [fn, ms] as [string, number]);
  await page.waitForTimeout(900);
  return page.evaluate(() => ({ draws: (window as any).__m.draws as { t: number; k: string }[], long: (window as any).__m.long as number[] }));
}

function stats(draws: { t: number; k: string }[]) {
  const seq = draws.filter((d, i) => i === 0 || d.k !== draws[i - 1].k);
  let maxStep = 0, ringSteps = 0, centreSwaps = 0, reversals = 0;
  let lastDir = 0;
  for (let i = 1; i < seq.length; i++) {
    const a = seq[i - 1].k, b = seq[i].k;
    if (a === 'c' || b === 'c') { centreSwaps++; continue; }
    const d = circ(+a, +b);
    maxStep = Math.max(maxStep, d);
    ringSteps++;
    const signed = ((+b - +a + N + N / 2) % N) - N / 2;
    const dir = Math.sign(signed);
    if (lastDir && dir && dir !== lastDir) reversals++;
    if (dir) lastDir = dir;
  }
  return { draws: seq.length, maxStep, ringSteps, centreSwaps, reversals };
}

const results: Record<string, unknown> = {};

test.afterAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `metrics-${LABEL}.json`), JSON.stringify(results, null, 2));
  console.log('CHAR-METRICS', LABEL, JSON.stringify(results));
});

test('fast swipe never jumps more than 2 frames per tick', async ({ page }) => {
  await boot(page);
  const R = 360;
  /* Over-the-top arc, 180 degrees in 250ms (~2.5k px/s at the rim), with a rest at each end. */
  const arc = `(t) => { const a = Math.PI - Math.min(1, t / 250) * Math.PI; return { x: ${FACE.x} + ${R} * Math.cos(a), y: ${FACE.y} - ${R} * Math.sin(a) }; }`;
  const r = await run(page, arc, 700);
  const s = stats(r.draws);
  results.swipeArc = s;
  /* A teleport: the cursor appears on the opposite side in one event. */
  const jump = `(t) => t < 200 ? { x: ${FACE.x} - ${R}, y: ${FACE.y} } : { x: ${FACE.x} + ${R}, y: ${FACE.y} - 40 }`;
  const j = await run(page, jump, 900);
  results.teleport = stats(j.draws);
  if (ENFORCE) {
    expect(s.maxStep).toBeLessThanOrEqual(2);
    expect((results.teleport as any).maxStep).toBeLessThanOrEqual(2);
  }
});

test('no flicker on the deadzone boundary', async ({ page }) => {
  await boot(page);
  /* Park outside, then oscillate +-8px around the enter radius and the exit radius. */
  const enter = 0.12 * 1440, exit = 0.14 * 1440;
  for (const [label, base] of [['enter', enter], ['exit', exit]] as const) {
    const fn = `(t) => ({ x: ${FACE.x} + ${base} + 8 * Math.sin(t / 55), y: ${FACE.y} })`;
    const r = await run(page, fn, 2000);
    const s = stats(r.draws);
    results[`jitter-${label}`] = s;
    if (ENFORCE) expect(s.centreSwaps).toBeLessThanOrEqual(2);
  }
});

test('leave and re-enter walk, they do not snap', async ({ page }) => {
  await boot(page);
  const fn = `(t) => t < 500 ? { x: ${FACE.x} + 380, y: ${FACE.y} - 120 } : t < 900 ? null : { x: ${FACE.x} - 380, y: ${FACE.y} + 100 }`;
  const r = await run(page, fn, 1500);
  const s = stats(r.draws);
  results.leaveReenter = s;
  if (ENFORCE) expect(s.maxStep).toBeLessThanOrEqual(2);
});

test('no long task, and the loop goes idle', async ({ page }) => {
  await boot(page);
  const idleBefore = await page.evaluate(() => (window as any).__outstanding());
  const wander = `(t) => ({ x: ${FACE.x} + 330 * Math.cos(t / 300), y: ${FACE.y} + 300 * Math.sin(t / 420) })`;
  await page.evaluate(() => { (window as any).__m.long.length = 0; });
  await page.evaluate(([f, d]) => (window as any).__drive(new Function('t', `return (${f})(t)`), d), [wander, 5000] as [string, number]);
  /* The pointer stops where it was moving. The loop must stop within 600ms of that. */
  const t0 = Date.now();
  let idleAt = -1;
  while (Date.now() - t0 < 3000) {
    if ((await page.evaluate(() => (window as any).__outstanding())) <= idleBefore) { idleAt = Date.now() - t0; break; }
    await page.waitForTimeout(10);
  }
  const r = { long: await page.evaluate(() => (window as any).__m.long as number[]) };
  results.longTasks = r.long;
  results.idleAfterMs = idleAt;
  results.idleBaselineOutstanding = idleBefore;
  if (ENFORCE) {
    expect(r.long.filter((d) => d > 50)).toEqual([]);
    expect(idleAt).toBeGreaterThanOrEqual(0);
    expect(idleAt).toBeLessThanOrEqual(600);
  }
});

test('resting pixels are unchanged', async ({ page }) => {
  await boot(page);
  await page.evaluate(() => (window as any).__drive(() => ({ x: 720, y: 420 }), 400));
  await page.waitForTimeout(900);
  const hash = await page.evaluate(async () => {
    const c = document.querySelector('canvas')!;
    const bytes = new TextEncoder().encode(c.toDataURL('image/png'));
    const d = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, '0')).join('');
  });
  results.centreHash = hash;
  const basePath = path.join(OUT, 'metrics-before.json');
  if (ENFORCE && fs.existsSync(basePath)) {
    expect(hash).toBe(JSON.parse(fs.readFileSync(basePath, 'utf8')).centreHash);
  }
});

for (const hz of [60, 144]) {
  test(`time to settle on a target is the same at ${hz}Hz`, async ({ page }) => {
    await boot(page, hz);
    const R = 360;
    const park = `(t) => ({ x: ${FACE.x} - ${R}, y: ${FACE.y} })`;
    await run(page, park, 600);
    /* Jump to the opposite side, then time how long the picture keeps changing. */
    await page.evaluate(() => { (window as any).__m.draws.length = 0; });
    const jump = `(t) => ({ x: ${FACE.x} + ${R}, y: ${FACE.y} - 40 })`;
    await page.evaluate(([f]) => (window as any).__drive(new Function('t', `return (${f})(t)`), 800), [jump]);
    await page.waitForTimeout(600);
    const d: { t: number; k: string }[] = await page.evaluate(() => (window as any).__m.draws);
    const settleMs = d.length ? d[d.length - 1].t - d[0].t : -1;
    results[`settle${hz}`] = { settleMs: Math.round(settleMs), draws: d.length };
  });
}

test.afterAll(() => {
  const a = (results.settle60 as any)?.settleMs, b = (results.settle144 as any)?.settleMs;
  if (ENFORCE && a > 0 && b > 0) expect(Math.abs(a - b) / Math.max(a, b)).toBeLessThan(0.15);
});
