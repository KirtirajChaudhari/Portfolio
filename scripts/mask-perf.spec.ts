import { test, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

/*
 * X-Ray Hero — Loop 1 measurement harness. KEPT, not disposable: Loop 8 item 10
 * re-runs this against the real hero and diffs the numbers against the spike.
 *
 *   npx playwright test scripts/mask-perf.spec.ts
 *
 * Note on API: the plan called for `page.tracing.start()`. That is
 * `context.tracing` in Playwright and it produces a trace-viewer archive —
 * snapshots and screenshots, no paint rects. Paint geometry only comes out of
 * the DevTools protocol, so this uses a CDP session and the
 * `disabled-by-default-devtools.timeline` category instead. Same intent,
 * different door. CDP is Chromium-only, which is why the paint column and the
 * CPU-throttle rows below exist for Chromium and nowhere else.
 */

const SPIKE = pathToFileURL(path.resolve(process.cwd(), 'spike/mask-perf.html')).href;
const OUT = path.resolve(process.cwd(), 'docs/xray-loop1-results.jsonl');

type Row = Record<string, unknown>;

function record(row: Row) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n');
  console.log('ROW ' + JSON.stringify(row));
}

/* Two laps of a circle at ~250Hz-ish input, which is faster than a human but
   that is the point — Loop 3's self-verify is "move the pointer fast in a
   circle." A gentle drift would measure nothing. */
async function driveCircle(page: Page, steps = 300) {
  const vp = page.viewportSize()!;
  const cx = vp.width / 2;
  const cy = vp.height / 2;
  const rad = Math.min(vp.width, vp.height) * 0.32;

  await page.mouse.move(cx + rad, cy);
  await page.waitForTimeout(120);
  await page.evaluate(() => (window as any).__perf.reset());

  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 4;
    await page.mouse.move(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    await page.waitForTimeout(4);
  }
}

/* A Paint event's clip is a quad: [x1,y1,x2,y2,x3,y3,x4,y4]. Bounding-box area
   as a share of the viewport is the whole decision — full-viewport paints every
   frame means the masked layer is being REPAINTED, not composited. */
function summarisePaints(events: any[], vp: { width: number; height: number }) {
  const paints = events.filter((e) => e.name === 'Paint' && e.args?.data?.clip);
  const vpArea = vp.width * vp.height;
  const areas = paints.map((e) => {
    const c = e.args.data.clip as number[];
    const xs = [c[0], c[2], c[4], c[6]];
    const ys = [c[1], c[3], c[5], c[7]];
    return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
  });
  const total = areas.reduce((a, b) => a + b, 0);
  return {
    paintEvents: paints.length,
    meanPaintPctViewport: paints.length ? +((total / paints.length / vpArea) * 100).toFixed(1) : 0,
    maxPaintPctViewport: paints.length ? +((Math.max(...areas) / vpArea) * 100).toFixed(1) : 0,
  };
}

for (const mode of ['none', 'css', 'lite', 'svg', 'svglite'] as const) {
  for (const rate of [1, 4]) {
    test(`${mode} mask @ CPU ${rate}x`, async ({ page, context, browserName }) => {
      test.skip(rate > 1 && browserName !== 'chromium', 'CPU throttling needs CDP (Chromium only)');
      test.setTimeout(90_000);

      await page.goto(`${SPIKE}?mode=${mode}`);
      /* The busy layer carries a 1.8MB PNG. Decode it before measuring, or the
         first lap measures image decode instead of mask cost. */
      await page.waitForTimeout(1200);

      const traceEvents: any[] = [];
      let cdp: any = null;

      if (browserName === 'chromium') {
        cdp = await context.newCDPSession(page);
        if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate });
        cdp.on('Tracing.dataCollected', (e: any) => traceEvents.push(...e.value));
        await cdp.send('Tracing.start', {
          transferMode: 'ReportEvents',
          traceConfig: { includedCategories: ['disabled-by-default-devtools.timeline'] },
        });
      }

      await driveCircle(page);

      let paint: Row = { paintEvents: 'n/a (no CDP)', meanPaintPctViewport: 'n/a', maxPaintPctViewport: 'n/a' };
      if (cdp) {
        const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
        await cdp.send('Tracing.end');
        await done;
        paint = summarisePaints(traceEvents, page.viewportSize()!);
        if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      }

      const stats = await page.evaluate(() => (window as any).__perf.stats());
      record({ browser: browserName, mode, cpu: `${rate}x`, ...stats, ...paint });
    });
  }
}
