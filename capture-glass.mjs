import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\raj02\\.gemini\\antigravity-ide\\brain\\541c0eff-b06b-4bf0-b303-0117367e16db';

async function capture() {
  const browser = await chromium.launch();
  
  // Chapter 1
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000/', { waitUntil: 'load' });
  await pageDesktop.waitForTimeout(1000);
  
  // Scroll down to where we see Timeline (Experience/Education) and Projects
  // Taking a full page screenshot to show everything in context
  await pageDesktop.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch1_desktop.png'), fullPage: true });
  await contextDesktop.close();

  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3000/', { waitUntil: 'load' });
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch1_mobile.png'), fullPage: true });
  await contextMobile.close();
  
  // Chapter 2
  const contextDesktop2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pageDesktop2 = await contextDesktop2.newPage();
  await pageDesktop2.goto('http://localhost:3000/creator', { waitUntil: 'load' });
  await pageDesktop2.waitForTimeout(1000);
  await pageDesktop2.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2_desktop.png'), fullPage: true });
  await contextDesktop2.close();

  const contextMobile2 = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMobile2 = await contextMobile2.newPage();
  await pageMobile2.goto('http://localhost:3000/creator', { waitUntil: 'load' });
  await pageMobile2.waitForTimeout(1000);
  await pageMobile2.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2_mobile.png'), fullPage: true });
  await contextMobile2.close();

  await browser.close();
}

capture().catch(console.error);
