import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  
  // Desktop
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await contextDesktop.newPage();
  
  console.log("Navigating to http://localhost:3000/creator...");
  await page.goto("http://localhost:3000/creator", { waitUntil: "networkidle" });
  
  // Read Computed Style
  console.log("Extracting computed styles...");
  
  const mainBg = await page.evaluate(() => {
    const el = document.querySelector('main[data-chapter="two"]');
    if (!el) return "Element not found";
    return window.getComputedStyle(el).backgroundColor;
  });
  
  const heroBandBg = await page.evaluate(() => {
    const el = document.querySelector('[data-hero-fade].bg-\\[var\\(--crayon-pink\\)\\]');
    if (!el) return "Element not found";
    return window.getComputedStyle(el).backgroundColor;
  });
  
  console.log("--- COMPUTED STYLES ---");
  console.log(`<main> background-color: ${mainBg}`);
  console.log(`Hero Crayon Band background-color: ${heroBandBg}`);
  console.log("-----------------------");
  
  // Wait for animations to settle
  await page.waitForTimeout(2000);
  
  console.log("Capturing desktop screenshot...");
  await page.screenshot({ path: "C:/Users/raj02/.gemini/antigravity-ide/brain/cf7abe63-ad28-45ba-ba3c-458692283758/creator_desktop_fixed.png", fullPage: true });
  await contextDesktop.close();
  
  // Mobile
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto("http://localhost:3000/creator", { waitUntil: "networkidle" });
  await pageMobile.waitForTimeout(2000);
  console.log("Capturing mobile screenshot...");
  await pageMobile.screenshot({ path: "C:/Users/raj02/.gemini/antigravity-ide/brain/cf7abe63-ad28-45ba-ba3c-458692283758/creator_mobile_fixed.png", fullPage: true });
  await contextMobile.close();
  
  await browser.close();
  console.log("Done.");
})();
