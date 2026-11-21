import { test, expect } from '@playwright/test';

/* Production UI regressions. The existing redev gate owns 3D context counts,
   scroll morphs, offscreen idle, accessibility and reduced-motion rendering. */

test('the nav pill keeps home, Contact, Artistic and the theme control at 320px, without About or Work', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  const pill = page.locator('.site-header .navpill');
  const theme = pill.getByRole('button', { name: 'Switch to light theme' });
  await expect(theme).toBeVisible();
  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await theme.click();
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(before);

  for (const label of ['About', 'Work']) await expect(pill.getByRole('link', { name: label, exact: true })).toHaveCount(0);
  for (const label of ['Home', 'Contact', 'Artistic']) {
    const link = pill.getByRole('link', { name: label, exact: true });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box!.height, `${label} touch target`).toBeGreaterThanOrEqual(44);
    expect(box!.x, `${label} on screen`).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width, `${label} on screen`).toBeLessThanOrEqual(320);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await pill.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('main')).toBeFocused();
});

test('the nav pill works before JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  try {
    const page = await context.newPage();
    await page.goto('/about');
    const pill = page.locator('.site-header .navpill');
    await expect(pill.getByRole('link', { name: 'Artistic', exact: true })).toBeVisible();
    await pill.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page.locator('h1')).toHaveText("Let's talk.");
  } finally { await context.close(); }
});

test('About and Work stay reachable from the pages: The full story, Explore my work', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('link', { name: 'The full story' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator('h1')).toHaveText('Machine learning that shows its reasoning.');
  const work = page.getByRole('link', { name: 'Explore my work' });
  const creator = page.getByRole('link', { name: /know the real me/ });
  expect((await work.boundingBox())!.y).toBeLessThan((await creator.boundingBox())!.y);
  await work.click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator('h1')).toHaveText("What I've built, and where I've worked.");
});

test('keyboard route navigation hands focus to the new main content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const contact = page.locator('.site-header .navpill').getByRole('link', { name: 'Contact', exact: true });
  await contact.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('h1')).toHaveText("Let's talk.");
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
    await expect(page.locator('h1')).toHaveText('Machine learning that shows its reasoning.');
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

test('Work project index: arrow keys move the selection, only the button opens a case', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work');
  const list = page.getByRole('list', { name: 'Projects' });
  const first = list.getByRole('button').first();
  await first.focus();
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  const second = list.getByRole('button').nth(1);
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page).toHaveURL(/\/work$/);
  await page.getByRole('link', { name: 'Read the DrishtiManas case' }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/projects\/drishtimanas$/);
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
    await page.locator('#work').evaluate((el) => el.scrollIntoView());
    await expect(page.locator('.stage canvas')).toHaveCount(1);
    const layout = await page.locator('.stage').evaluate((stage) => {
      const copy = stage.querySelector('article.panel .panel-copy')!.getBoundingClientRect();
      const panel = stage.querySelector('article.panel')!.getBoundingClientRect();
      return { wide: getComputedStyle(stage).getPropertyValue('--field-wide').trim(), offset: copy.top - panel.top, right: copy.right, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(layout.wide).toBe(viewport.wide ? '1' : '0');
    expect(layout.overflow).toBeLessThanOrEqual(0);
    if (viewport.wide) expect(layout.right).toBeLessThan(viewport.width * 0.56);
    else expect(layout.offset).toBeGreaterThanOrEqual(viewport.height * 0.4);
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

/* ---- 2026-11-21 fix pass (docs/ui-fix-plan.md) ---- */

for (const viewport of [{ width: 390, height: 844 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
  test(`home figure is released with the last panel at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    // Scroll so the section after the stage sits mid-screen.
    await page.locator('#work + section').evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(page.locator('.stage canvas')).toHaveCount(1);
    await page.waitForTimeout(300);
    const gap = await page.evaluate(() => {
      const pin = document.querySelector('.stage-pin')!.getBoundingClientRect();
      const stage = document.querySelector('.stage')!.getBoundingClientRect();
      const after = document.querySelector('#work + section')!.getBoundingClientRect();
      return { pinPastStage: pin.bottom - stage.bottom, pinOverRecognition: pin.bottom - after.top };
    });
    expect(gap.pinPastStage).toBeLessThanOrEqual(1);
    expect(gap.pinOverRecognition).toBeLessThanOrEqual(0);
  });
}

for (const width of [320, 768, 1024, 1440]) {
  test(`home project titles never break inside a word at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.load('680 80px Archivo'));
    const titles = await page.locator('.panel-title').evaluateAll((els) => els.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
      return { text: el.textContent, lines: lines.size, fits: range.getBoundingClientRect().width <= el.getBoundingClientRect().width + 1 };
    }));
    for (const t of titles) expect(t, t.text ?? '').toMatchObject({ lines: 1, fits: true });
  });
}

test('stacked home frames the whole figure above the copy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  // Bring the first project panel to the top, where its window shows the figure.
  await page.evaluate(() => {
    const panel = document.querySelector('article.panel')!;
    window.scrollTo(0, window.scrollY + panel.getBoundingClientRect().top);
  });
  await expect(page.locator('.stage canvas')).toHaveCount(1);
  const box = await page.evaluate(() => {
    const win = document.querySelector('.stage-window')!.getBoundingClientRect();
    const copy = document.querySelector('article.panel .panel-copy')!.getBoundingClientRect();
    const nav = document.querySelector('.navpill')!.getBoundingClientRect();
    return { winBottom: win.bottom, copyTop: copy.top, winTop: win.top, navBottom: nav.bottom };
  });
  expect(box.winTop).toBeGreaterThanOrEqual(box.navBottom - 1);
  expect(box.winBottom).toBeLessThan(box.copyTop);
});

test('email addresses break only after the @ at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const path of ['/contact', '/about']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.load('660 30px Archivo'));
    const parts = await page.locator('a.t-email').first().evaluate((a) => {
      const range = document.createRange();
      range.selectNodeContents(a);
      const rows = new Map<number, number>();
      for (const r of range.getClientRects()) rows.set(Math.round(r.top), (rows.get(Math.round(r.top)) ?? 0) + r.width);
      return { rows: rows.size, overflow: a.scrollWidth - a.clientWidth, text: a.textContent };
    });
    expect(parts.rows).toBeLessThanOrEqual(2);
    expect(parts.overflow).toBeLessThanOrEqual(0);
  }
});

test('outbound link arrows stay attached to their label when it wraps', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');
  const gaps = await page.locator('section[aria-labelledby="education-title"] ol a.link').evaluateAll((links) => links.map((a) => {
    const icon = a.querySelector('svg')!.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(a.querySelector('span.whitespace-nowrap')!.firstChild!);
    const word = range.getBoundingClientRect();
    return Math.abs(icon.left - word.right);
  }));
  expect(gaps.length).toBeGreaterThan(0);
  for (const g of gaps) expect(g).toBeLessThan(10);
});
