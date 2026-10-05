import { test } from '@playwright/test';
const OUT = 'C:/Users/raj02/.claude/jobs/8ec2e058/tmp/burst/';

/* The rAF loop is idle at rest, so writing the blot transform by hand holds a
   chosen k indefinitely. That decouples "what does the edge look like at scale
   k" from "how fast does k move" — two questions the screenshot lag was
   conflating. */
test('hold the blot at fixed scales', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/xray');
  await page.waitForTimeout(1800);
  await page.mouse.move(500, 430);
  await page.waitForTimeout(600);

  const baked = await page.evaluate(() =>
    (document.querySelector('.hero__ink image') as SVGImageElement)?.getAttribute('href')?.slice(0, 22));
  console.log('baked href:', baked);

  for (const k of [0.4, 0.8, 1.2, 1.8, 2.6]) {
    await page.evaluate((kk) => {
      const ink = document.querySelector('.hero__ink') as SVGGElement;
      ink.style.display = 'block';
      const gs = Array.from(ink.querySelectorAll(':scope > g')) as SVGGElement[];
      gs[1].setAttribute('transform', `translate(500 430) scale(${kk})`);
      gs[0].setAttribute('transform', `translate(500 430) scale(${kk * 0.85})`);
    }, k);
    await page.waitForTimeout(250);
    await page.locator('.hero').screenshot({ path: `${OUT}fixed-k${k}.png` });
  }
});
