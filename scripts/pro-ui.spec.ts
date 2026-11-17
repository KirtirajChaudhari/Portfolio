import { test, expect } from '@playwright/test';

/* Production UI regressions. The existing redev gate owns 3D context counts,
   scroll morphs, offscreen idle, accessibility and reduced-motion rendering. */

test('mobile navigation exposes every primary destination and the theme control', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/about');
  const header = page.locator('.site-header');
  const theme = header.getByRole('button', { name: 'Switch to dark theme' });
  await expect(theme).toBeVisible();
  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await theme.click();
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(before);

  const menu = header.locator('.mobile-nav');
  const summary = menu.locator('summary');
  await summary.click();
  await expect(menu).toHaveJSProperty('open', true);
  for (const label of ['About', 'Work', 'Contact', 'Artistic']) {
    const link = menu.getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box!.height, `${label} touch target`).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveJSProperty('open', false);
  await expect(summary).toBeFocused();

  await summary.click();
  await page.mouse.click(5, 500);
  await expect(menu).toHaveJSProperty('open', false);
  await summary.click();
  await menu.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('main')).toBeFocused();
  await expect(menu).toHaveJSProperty('open', false);
});

test('mobile disclosure remains useful before JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  try {
    const page = await context.newPage();
    await page.goto('/about');
    const menu = page.locator('.site-header .mobile-nav');
    await menu.locator('summary').click();
    await expect(menu.getByRole('link', { name: 'Artistic', exact: true })).toBeVisible();
    await menu.getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('Work');
  } finally { await context.close(); }
});

test('keyboard route navigation hands focus to the new main content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const work = page.locator('.site-header .desktop-nav').getByRole('link', { name: 'Work', exact: true });
  await work.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator('h1')).toHaveText('Work');
  await expect(page.locator('main')).toBeFocused();
});

test('encoded or malformed fragments do not break pages and reduced motion avoids smooth scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const w = window as unknown as { __fragmentScrolls: { id: string; behavior?: string }[] };
    w.__fragmentScrolls = [];
    const scroll = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
      w.__fragmentScrolls.push({ id: this.id, behavior: typeof options === 'object' ? options.behavior : undefined });
      scroll.call(this, options);
    };
  });
  await page.goto('/about#%6Dain');
  await expect.poll(() => page.evaluate(() => (window as unknown as { __fragmentScrolls: { id: string }[] }).__fragmentScrolls.some((call) => call.id === 'main'))).toBe(true);
  const scrolls = await page.evaluate(() => (window as unknown as { __fragmentScrolls: { behavior?: string }[] }).__fragmentScrolls);
  expect(scrolls.some((call) => call.behavior === 'smooth')).toBe(false);
  for (const hash of ['#[', '#%E0%A4%A']) {
    await page.goto(`/about${hash}`);
    await expect(page.locator('h1')).toHaveText('Kirtiraj Nitin Chaudhari');
    // The old selector lookup threw on its first animation frame.
    await page.waitForTimeout(100);
  }
  expect(errors).toEqual([]);
});

test('all nine case studies and their next-project links fit a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const slug of ['rasacare', 'drishtimanas', 'pravaas', 'bhojansetu', 'id-boundary', 'lab-complaint', 'autonomous-driving', 'preserving-heritage', 'sales-forecasting']) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.evaluate(() => {
      const title = document.querySelector('h1')!;
      const arrow = document.querySelector('nav[aria-label="Next project"] svg')!.getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth - innerWidth, titleOverflow: title.scrollWidth - title.clientWidth, arrowRight: arrow.right };
    });
    expect(bounds.overflow, slug).toBeLessThanOrEqual(0);
    expect(bounds.titleOverflow, `${slug} title`).toBeLessThanOrEqual(0);
    expect(bounds.arrowRight, `${slug} next arrow`).toBeLessThanOrEqual(320);
  }
});

test('Work reserves clear space below moving figure plates', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work');
  await page.evaluate(() => document.fonts.ready);
  const gaps = await page.locator('article .enter').evaluateAll((plates) => plates.map((plate) => {
    const heading = plate.closest('article')!.querySelector('h3')!;
    return heading.getBoundingClientRect().top - plate.getBoundingClientRect().bottom;
  }));
  expect(gaps).toHaveLength(2);
  for (const gap of gaps) expect(gap, 'offscreen entrance must not cover the next heading').toBeGreaterThan(0);
});

for (const viewport of [
  { width: 1024, height: 1366, wide: false },
  { width: 1024, height: 900, wide: false },
  { width: 844, height: 390, wide: false },
  { width: 1440, height: 900, wide: true },
]) {
  test(`home framing keeps its copy clear at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('.stage canvas')).toHaveCount(1);
    const layout = await page.locator('.stage').evaluate((stage) => {
      const copy = stage.querySelector('.panel-hero .panel-copy')!.getBoundingClientRect();
      return { wide: getComputedStyle(stage).getPropertyValue('--field-wide').trim(), top: copy.top, right: copy.right, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(layout.wide).toBe(viewport.wide ? '1' : '0');
    expect(layout.overflow).toBeLessThanOrEqual(0);
    if (viewport.wide) expect(layout.right).toBeLessThan(viewport.width * 0.56);
    else expect(layout.top).toBeGreaterThanOrEqual(viewport.height * 0.4);
    await expect(page.getByRole('link', { name: 'Read the RasaCare case', exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Read the DrishtiManas case', exact: true })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Read the PRAVAAS case', exact: true })).toHaveCount(1);
  });
}

test('Contact announces clipboard denial instead of silently failing', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Clipboard denied', 'NotAllowedError'); } } });
  });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Copy address', exact: true }).click();
  await expect(page.locator('#copy-address-status')).toHaveText('Copy failed. Select the address above.');
  await expect(page.locator('#copy-address-status')).toHaveAttribute('role', 'status');
});

test('Contact repeated copying keeps success visible for the latest attempt', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __copiedAddresses: string[] };
    w.__copiedAddresses = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { w.__copiedAddresses.push(value); } } });
  });
  await page.goto('/contact');
  await expect(page.locator('h1')).toBeVisible();
  await page.clock.install();
  const button = page.locator('button[aria-describedby="copy-address-status"]');
  await button.click();
  await expect(page.locator('#copy-address-status')).toHaveText('Email address copied.');
  await page.clock.fastForward(1500);
  await button.click();
  await page.clock.fastForward(750);
  await expect(page.locator('#copy-address-status')).toHaveText('Email address copied.');
  await page.clock.fastForward(1500);
  await expect(page.locator('#copy-address-status')).toBeEmpty();
  expect(await page.evaluate(() => (window as unknown as { __copiedAddresses: string[] }).__copiedAddresses)).toEqual(['mrkirtirajchaudhari@gmail.com', 'mrkirtirajchaudhari@gmail.com']);
});

test('Contact clears only corrected valid field errors and marks required controls', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Open the draft', exact: true }).click();
  for (const name of ['name', 'email', 'subject', 'message']) {
    await expect(page.locator(`#contact-${name}`)).toHaveAttribute('required', '');
    await expect(page.locator(`#contact-${name}`)).toHaveAttribute('aria-invalid', 'true');
  }
  await page.locator('#contact-name').fill('   ');
  await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#contact-name').fill('A visitor');
  await expect(page.locator('#contact-name')).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#contact-name-error')).toHaveCount(0);
  await expect(page.locator('#contact-subject')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#contact-email').fill('incomplete@');
  await expect(page.locator('#contact-email')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#contact-email').fill('visitor@example.com');
  await expect(page.locator('#contact-email')).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('#contact-message')).toHaveAttribute('aria-invalid', 'true');
});
