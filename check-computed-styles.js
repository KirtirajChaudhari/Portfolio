const { chromium } = require('playwright');

async function checkStyles() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  // Helper to dump computed style
  async function dumpStyle(selector, name) {
    const el = await page.$(selector);
    if (!el) {
      console.log(`[${name}] NOT FOUND (selector: ${selector})`);
      return;
    }
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
    console.log(`\n=== [${name}] Computed Style ===`);
    console.log(JSON.stringify(styles, null, 2));
  }

  // 1. ModeToggle pill (it's inside the header)
  await dumpStyle('header div[role="radiogroup"]', 'ModeToggle');

  // 2. Credential Badge (in JourneyCarousel, has glass-panel and rounded-xl)
  await dumpStyle('.glass-panel.rounded-xl', 'Credential Badge');

  // 3. Metric Chip (in ProjectsGrid, has glass-panel and rounded-full and text-xs)
  await dumpStyle('.glass-panel.rounded-full.text-xs', 'Metric Chip');

  await browser.close();
}

checkStyles().catch(console.error);
