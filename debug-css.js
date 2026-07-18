const { chromium } = require('playwright');

async function debugStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  const rules = await page.evaluate(() => {
    const el = document.querySelector('.glass-panel');
    if (!el) return 'Element not found';
    
    // Instead of getting computed style, let's inject a test to see if the rule is valid
    const testDiv = document.createElement('div');
    testDiv.style.backdropFilter = 'blur(16px) saturate(140%)';
    const isValidWithoutVar = testDiv.style.backdropFilter;
    
    testDiv.style.backdropFilter = 'blur(var(--glass-blur)) saturate(140%)';
    const isValidWithVar = testDiv.style.backdropFilter;
    
    return {
      isValidWithoutVar,
      isValidWithVar,
      elementComputedFilter: window.getComputedStyle(el).backdropFilter
    };
  });
  
  console.log('Debug Output:', JSON.stringify(rules, null, 2));

  await browser.close();
}

debugStyles().catch(console.error);
