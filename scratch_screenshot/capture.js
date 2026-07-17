const { chromium, devices } = require('playwright');
const fs = require('fs');

const sites = [
  { name: 'karolinahess', url: 'https://karolinahess.com/about' },
  { name: 'xhulia', url: 'https://www.xhulia.com/#work' },
  { name: 'toryloves', url: 'https://toryloves.art/' },
  { name: 'bureaudimanche', url: 'https://bureaudimanche.com/en/' },
  { name: 'yaros', url: 'https://yaros.me/' }
];

(async () => {
  const browser = await chromium.launch();
  
  for (const site of sites) {
    console.log(`Processing ${site.name}...`);
    try {
      // Desktop
      const contextDesktop = await browser.newContext({
        viewport: { width: 1280, height: 800 }
      });
      const pageDesktop = await contextDesktop.newPage();
      await pageDesktop.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
      await pageDesktop.waitForTimeout(2000); // Let animations settle
      await pageDesktop.screenshot({ path: `${site.name}_desktop.png`, fullPage: true });
      await contextDesktop.close();
      
      // Mobile
      const contextMobile = await browser.newContext({
        ...devices['iPhone 12']
      });
      const pageMobile = await contextMobile.newPage();
      await pageMobile.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
      await pageMobile.waitForTimeout(2000);
      await pageMobile.screenshot({ path: `${site.name}_mobile.png`, fullPage: true });
      await contextMobile.close();
      
      console.log(`Saved screenshots for ${site.name}`);
    } catch (err) {
      console.error(`Error on ${site.name}:`, err.message);
    }
  }
  
  await browser.close();
  console.log('Done!');
})();
