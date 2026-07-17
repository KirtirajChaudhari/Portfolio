import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  
  // PAGE: Home (Chapter One)
  const pageHome = await context.newPage();
  await pageHome.goto("http://localhost:3000/", { waitUntil: "load" });
  await pageHome.waitForTimeout(2000);
  
  const dividerBorderColor = await pageHome.evaluate(() => {
    const el = document.querySelector('[data-hero-sub]');
    return el ? window.getComputedStyle(el).borderLeftColor : "Element not found";
  });
  
  const ch1PillBgColor = await pageHome.evaluate(() => {
    // The CH. 1 pill dot is the span with bg-accent
    const el = document.querySelector('.bg-accent.rounded-full');
    return el ? window.getComputedStyle(el).backgroundColor : "Element not found";
  });
  
  // PAGE: Creator (Chapter Two)
  const pageCreator = await context.newPage();
  await pageCreator.goto("http://localhost:3000/creator", { waitUntil: "load" });
  await pageCreator.waitForTimeout(2000);
  
  const creatorMainBg = await pageCreator.evaluate(() => {
    const el = document.querySelector('main[data-chapter="two"]');
    return el ? window.getComputedStyle(el).backgroundColor : "Element not found";
  });
  
  console.log("=== COMPUTED STYLES ===");
  console.log("[Chapter One] Vertical Divider (border-left-color):", dividerBorderColor);
  console.log("[Chapter One] CH.1 Pill Dot (background-color):", ch1PillBgColor);
  console.log("[Chapter Two] /creator Page Background (background-color):", creatorMainBg);
  console.log("=======================");
  
  await browser.close();
})();
