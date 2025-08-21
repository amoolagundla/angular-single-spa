const puppeteer = require('puppeteer');

async function testDeployment() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.type(), msg.text());
  });
  
  page.on('pageerror', error => {
    console.error('Browser error:', error.message);
  });

  try {
    console.log('1. Navigating to site...');
    await page.goto('https://jolly-wave-0ac63d010.1.azurestaticapps.net/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('2. Checking page title...');
    const title = await page.title();
    console.log('   Page title:', title);
    
    console.log('3. Checking for SystemJS...');
    const systemJsAvailable = await page.evaluate(() => {
      return {
        System: typeof window.System !== 'undefined',
        SystemConfig: typeof window.System?.config === 'function',
        SystemImport: typeof window.System?.import === 'function'
      };
    });
    console.log('   SystemJS status:', systemJsAvailable);
    
    console.log('4. Checking for Single-SPA...');
    const singleSpaAvailable = await page.evaluate(() => {
      return {
        singleSpa: typeof window.singleSpa !== 'undefined',
        mountRootParcel: typeof window.singleSpa?.mountRootParcel === 'function',
        start: typeof window.singleSpa?.start === 'function'
      };
    });
    console.log('   Single-SPA status:', singleSpaAvailable);
    
    console.log('5. Checking tab buttons...');
    const tabs = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.tab-button');
      return Array.from(buttons).map(btn => ({
        text: btn.textContent,
        id: btn.id,
        hasClickHandler: btn.onclick !== null || btn.hasAttribute('onclick')
      }));
    });
    console.log('   Tabs found:', tabs);
    
    console.log('6. Testing Angular tab (should be active by default)...');
    const angularTabVisible = await page.evaluate(() => {
      const tab = document.getElementById('angular-tab');
      return tab && tab.classList.contains('active');
    });
    console.log('   Angular tab visible:', angularTabVisible);
    
    console.log('7. Clicking React MFE tab...');
    await page.click('#react-btn');
    await page.waitForTimeout(2000);
    
    console.log('8. Checking React container content...');
    const reactContent = await page.evaluate(() => {
      const container = document.getElementById('react-container');
      return {
        exists: container !== null,
        innerHTML: container?.innerHTML?.substring(0, 200),
        hasError: container?.innerHTML?.includes('error') || container?.innerHTML?.includes('Error')
      };
    });
    console.log('   React container:', reactContent);
    
    console.log('9. Checking network requests for react-mfe.js...');
    const reactMfeLoaded = await page.evaluate(async () => {
      try {
        const response = await fetch('/react-mfe/react-mfe.js', { method: 'HEAD' });
        return {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    console.log('   React MFE file status:', reactMfeLoaded);
    
    console.log('10. Attempting to manually load SystemJS if not available...');
    if (!systemJsAvailable.System) {
      await page.evaluate(() => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/system.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      });
      
      const systemJsRecheck = await page.evaluate(() => {
        return typeof window.System !== 'undefined';
      });
      console.log('   SystemJS after manual load:', systemJsRecheck);
    }
    
    console.log('11. Checking for showTab function...');
    const showTabExists = await page.evaluate(() => {
      return typeof window.showTab === 'function';
    });
    console.log('   showTab function exists:', showTabExists);
    
    // Take a screenshot
    await page.screenshot({ path: 'deployment-test.png', fullPage: true });
    console.log('Screenshot saved as deployment-test.png');
    
  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Run the test
testDeployment().catch(console.error);