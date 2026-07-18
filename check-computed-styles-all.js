const { chromium } = require('playwright');

async function checkStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  // Dump ALL glass panels
  const elements = await page.$$('.glass-panel');
  console.log(`Found ${elements.length} elements with .glass-panel`);
  
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
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
    console.log(`\n=== Element ${i + 1} Computed Style ===`);
    console.log(JSON.stringify(styles, null, 2));
  }
  
  await browser.close();
}

checkStyles().catch(console.error);
