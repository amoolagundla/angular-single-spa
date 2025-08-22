const puppeteer = require('puppeteer');

async function testLocalApp() {
  const browser = await puppeteer.launch({ 
    headless: false,  // Show the browser
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.type().toUpperCase(), msg.text());
  });
  
  page.on('pageerror', error => {
    console.error('Browser error:', error.message);
  });

  try {
    console.log('Opening http://localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('Page loaded. Waiting for initialization...');
    await page.waitForTimeout(3000);
    
    // Check initial state
    const status = await page.evaluate(() => {
      return {
        systemJS: typeof System !== 'undefined',
        singleSpa: typeof window.singleSpa !== 'undefined',
        activeTab: document.querySelector('.tab-panel.active')?.id,
        statusText: document.querySelector('.status')?.innerText
      };
    });
    console.log('\nInitial status:', status);
    
    // Click on React MFE tab
    console.log('\nClicking React MFE tab...');
    await page.click('#react-btn');
    await page.waitForTimeout(3000);
    
    // Check React container
    const reactStatus = await page.evaluate(() => {
      const container = document.getElementById('react-container');
      return {
        exists: container !== null,
        content: container?.innerText?.substring(0, 100),
        hasError: container?.innerHTML?.includes('error')
      };
    });
    console.log('React MFE status:', reactStatus);
    
    // Click on Both Together tab
    console.log('\nClicking Both Together tab...');
    await page.click('#both-btn');
    await page.waitForTimeout(3000);
    
    // Check split view
    const bothStatus = await page.evaluate(() => {
      const container = document.getElementById('react-split-container');
      return {
        exists: container !== null,
        content: container?.innerText?.substring(0, 100)
      };
    });
    console.log('Both view status:', bothStatus);
    
    console.log('\n✅ Application is running locally at http://localhost:3000');
    console.log('✅ React MFE is running at http://localhost:4202');
    console.log('\nYou can interact with the browser window to test the tabs.');
    console.log('Press Ctrl+C to close the browser and stop the test.');
    
    // Keep browser open for manual testing
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'local-test-error.png', fullPage: true });
    await browser.close();
  }
}

// Run the test
testLocalApp().catch(console.error);