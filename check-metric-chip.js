const { chromium } = require('playwright');

async function checkMetricChip() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  // Find metric chips which have backdrop-blur-[16px]
  const elements = await page.$$('span[class*="backdrop-blur-"]');
  console.log(`Found ${elements.length} metric chips with backdrop-blur utility.`);
  
  if (elements.length > 0) {
    const el = elements[0];
    const styles = await el.evaluate(node => {
      const cs = window.getComputedStyle(node);
      return {
        className: node.className,
        backgroundColor: cs.backgroundColor,
        backdropFilter: cs.backdropFilter,
        webkitBackdropFilter: cs.webkitBackdropFilter,
        borderTop: cs.borderTop,
      };
    });
    console.log(`\n=== Metric Chip Computed Style ===`);
    console.log(JSON.stringify(styles, null, 2));
  }
  
  await browser.close();
}

checkMetricChip().catch(console.error);
