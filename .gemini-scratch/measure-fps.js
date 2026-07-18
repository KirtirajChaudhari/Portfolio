const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser with 4x CPU throttle...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log("Navigating to http://localhost:3000 ...");
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    // wait for skill balls to load
    await new Promise(r => setTimeout(r, 5000));
  } catch (e) {
    console.error("Navigation failed:", e.message);
    await browser.close();
    process.exit(1);
  }

  console.log("Measuring scroll FPS for 5 seconds...");
  
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frames = 0;
      let start = performance.now();
      
      // Auto-scroll logic
      let y = 0;
      const scrollStep = 10;
      const scrollInterval = setInterval(() => {
        y += scrollStep;
        window.scrollTo(0, y);
      }, 16);

      const loop = () => {
        frames++;
        if (performance.now() - start < 5000) {
          requestAnimationFrame(loop);
        } else {
          clearInterval(scrollInterval);
          resolve(frames / 5); // average FPS
        }
      };
      
      requestAnimationFrame(loop);
    });
  });

  console.log(`\n=== RESULTS ===`);
  console.log(`Average FPS under 4x CPU throttle: ${fpsResult.toFixed(2)} FPS`);
  if (fpsResult < 45) {
    console.log(`WARNING: Framerate degraded below 45 FPS target. Glass scope reduction may be required.`);
  } else {
    console.log(`SUCCESS: Performance holds steady.`);
  }
  
  await browser.close();
})();
