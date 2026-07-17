import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = process.argv[2] || process.cwd();

async function capture() {
  const browser = await chromium.launch();
  const pages = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'creator', url: 'http://localhost:3000/creator' },
    { name: 'project', url: 'http://localhost:3000/projects/rasacare' },
  ];

  for (const pageInfo of pages) {
    // Desktop
    const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pageDesktop = await contextDesktop.newPage();
    await pageDesktop.goto(pageInfo.url, { waitUntil: 'load' });
    await pageDesktop.waitForTimeout(2000);
    await pageDesktop.screenshot({ path: path.join(ARTIFACTS_DIR, `${pageInfo.name}_desktop.png`) });
    await contextDesktop.close();

    // Mobile
    const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(pageInfo.url, { waitUntil: 'load' });
    await pageMobile.waitForTimeout(2000);
    await pageMobile.screenshot({ path: path.join(ARTIFACTS_DIR, `${pageInfo.name}_mobile.png`) });
    await contextMobile.close();
  }

  await browser.close();
}

capture().catch(console.error);
