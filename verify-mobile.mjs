import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const pageMobile = await contextMobile.newPage();
  
  console.log("Navigating to mobile...");
  await pageMobile.goto("http://localhost:3000/creator", { waitUntil: "load" });
  await pageMobile.waitForTimeout(3000); // Give it a moment to render
  
  console.log("Capturing mobile screenshot...");
  await pageMobile.screenshot({ path: "C:/Users/raj02/.gemini/antigravity-ide/brain/cf7abe63-ad28-45ba-ba3c-458692283758/creator_mobile_fixed.png", fullPage: true });
  
  await contextMobile.close();
  await browser.close();
  console.log("Done.");
})();
