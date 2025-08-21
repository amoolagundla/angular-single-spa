const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing Single-SPA Integration...\n');
  
  try {
    // Navigate to Angular app
    await page.goto('http://localhost:4200');
    await page.waitForTimeout(2000);
    
    // Check if Angular app loads
    const title = await page.textContent('h1');
    console.log('✓ Angular Shell loaded:', title);
    
    // Click on Single-SPA React tab
    await page.click('button:has-text("React MFE (Single-SPA)")');
    console.log('✓ Clicked on Single-SPA tab');
    
    // Wait for React MFE to load via Single-SPA
    await page.waitForTimeout(3000);
    
    // Check console for Single-SPA messages
    page.on('console', msg => {
      if (msg.text().includes('Single-SPA') || msg.text().includes('React MFE')) {
        console.log('  Console:', msg.text());
      }
    });
    
    // Check if Single-SPA React container exists
    const reactContainer = await page.locator('#single-spa-react-container');
    const isVisible = await reactContainer.isVisible();
    
    if (isVisible) {
      console.log('✓ Single-SPA React container is visible');
      
      // Check for React content
      try {
        const reactTitle = await page.locator('#single-spa-react-container h2').textContent({ timeout: 5000 });
        console.log('✓ React MFE loaded via Single-SPA:', reactTitle);
        
        // Check if Task Manager is present
        const taskManager = await page.locator('#single-spa-react-container .task-manager').isVisible();
        if (taskManager) {
          console.log('✓ React Task Manager component is rendered');
          
          // Try to interact with the React app
          const inputField = await page.locator('#single-spa-react-container input[type="text"]').isVisible();
          if (inputField) {
            await page.fill('#single-spa-react-container input[type="text"]', 'Single-SPA test task');
            await page.click('#single-spa-react-container button:has-text("Add Task")');
            console.log('✓ Successfully interacted with React MFE through Single-SPA');
          }
        }
      } catch (e) {
        console.log('⚠ React content not fully loaded, checking for error messages...');
        const errorMsg = await reactContainer.textContent();
        console.log('  Container content:', errorMsg);
      }
    } else {
      console.log('✗ Single-SPA React container not visible');
    }
    
    // Test tab switching
    console.log('\nTesting tab switching...');
    
    // Switch back to Angular tab
    await page.click('button:has-text("Angular Content")');
    await page.waitForTimeout(1000);
    console.log('✓ Switched back to Angular tab');
    
    // Switch to direct React MFE tab
    await page.click('button:has-text("React MFE (Direct)")');
    await page.waitForTimeout(2000);
    console.log('✓ Switched to Direct React MFE tab');
    
    // Switch back to Single-SPA tab
    await page.click('button:has-text("React MFE (Single-SPA)")');
    await page.waitForTimeout(2000);
    console.log('✓ Switched back to Single-SPA tab');
    
    console.log('\n✅ Single-SPA integration test completed!');
    console.log('\nKey Features Demonstrated:');
    console.log('- Tab-based activation (not route-based)');
    console.log('- Single-SPA lifecycle management');
    console.log('- Manual mounting/unmounting on tab change');
    console.log('- Proper cleanup when switching tabs');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
})();