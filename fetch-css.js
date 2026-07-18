const { chromium } = require('playwright');

async function fetchCSS() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  const css = await page.evaluate(() => {
    let result = '';
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.cssText.includes('.glass-panel')) {
            result += rule.cssText + '\n';
          }
        }
      } catch (e) {}
    }
    return result;
  });
  
  console.log('CSS Rules for .glass-panel found in browser:');
  console.log(css || 'NONE FOUND');

  await browser.close();
}

fetchCSS().catch(console.error);
