const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.error('❌ Console Error:', text);
    } else if (type === 'warning') {
      console.warn('⚠️  Console Warning:', text);
    } else if (text.includes('Single-SPA') || text.includes('React') || text.includes('SystemJS')) {
      console.log('📝 Console:', text);
    }
  });

  // Enable error logging
  page.on('pageerror', error => {
    console.error('❌ Page Error:', error.message);
  });

  console.log('🔍 Debugging Single-SPA Integration...\n');
  
  try {
    // Navigate to Angular app
    await page.goto('http://localhost:4200');
    await page.waitForTimeout(2000);
    
    // Check what scripts are loaded
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => s.src).filter(s => s);
    });
    console.log('📦 Loaded scripts:', scripts);
    
    // Click on Single-SPA tab
    await page.click('button:has-text("React MFE (Single-SPA)")');
    console.log('✓ Clicked on Single-SPA tab');
    
    // Wait for potential loading
    await page.waitForTimeout(3000);
    
    // Check if SystemJS is loaded
    const hasSystemJS = await page.evaluate(() => {
      // @ts-ignore
      return typeof window.System !== 'undefined';
    });
    console.log('SystemJS loaded:', hasSystemJS);
    
    // Check if single-spa is loaded
    const hasSingleSpa = await page.evaluate(() => {
      // @ts-ignore
      return typeof window.singleSpa !== 'undefined';
    });
    console.log('Single-SPA loaded:', hasSingleSpa);
    
    // Check container
    const containerExists = await page.locator('#single-spa-react-container').isVisible();
    console.log('Container visible:', containerExists);
    
    // Check container content
    const containerContent = await page.locator('#single-spa-react-container').textContent();
    console.log('Container content:', containerContent || '(empty)');
    
    // Try to check single-spa app status
    const appStatus = await page.evaluate(() => {
      // @ts-ignore
      if (window.singleSpa) {
        // @ts-ignore
        const apps = window.singleSpa.getAppNames();
        // @ts-ignore
        const status = apps.map(name => ({ name, status: window.singleSpa.getAppStatus(name) }));
        return { apps, status };
      }
      return null;
    });
    console.log('Single-SPA apps:', appStatus);
    
    // Check for React MFE script
    const reactScriptLoaded = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script'))
        .some(s => s.src.includes('react-single-spa.js'));
    });
    console.log('React Single-SPA script loaded:', reactScriptLoaded);
    
    // Check global variables
    const globals = await page.evaluate(() => {
      return {
        // @ts-ignore
        hasReactMfeSingleSpa: typeof window.reactMfeSingleSpa !== 'undefined',
        // @ts-ignore
        hasReactMfeMount: typeof window.reactMfeMount !== 'undefined'
      };
    });
    console.log('Global variables:', globals);
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
  
  console.log('\n📊 Debug Summary Complete');
  await page.waitForTimeout(5000);
  await browser.close();
})();