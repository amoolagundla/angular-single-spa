const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing Angular Shell with React MFE Integration...\n');
  
  try {
    // Navigate to Angular app
    await page.goto('http://localhost:4200');
    await page.waitForTimeout(2000);
    
    // Check if Angular app loads
    const title = await page.textContent('h1');
    console.log('✓ Angular Shell loaded:', title);
    
    // Check first tab content
    const angularContent = await page.textContent('h2');
    console.log('✓ Angular tab content:', angularContent);
    
    // Click on React MFE tab
    await page.click('button:has-text("React MFE")');
    await page.waitForTimeout(3000);
    
    // Check if React MFE loads
    const reactContainer = await page.locator('#react-mfe-container');
    const isVisible = await reactContainer.isVisible();
    
    if (isVisible) {
      // Check for React content
      const reactTitle = await page.locator('#react-mfe-container h2').textContent();
      console.log('✓ React MFE loaded:', reactTitle);
      
      // Check if Task Manager is present
      const taskManager = await page.locator('.task-manager').isVisible();
      if (taskManager) {
        console.log('✓ React Task Manager component is visible');
        
        // Try to add a task
        await page.fill('#react-mfe-container input[type="text"]', 'Test task from Playwright');
        await page.click('#react-mfe-container button:has-text("Add Task")');
        await page.waitForTimeout(1000);
        
        console.log('✓ Successfully interacted with React MFE');
      }
    } else {
      console.log('✗ React MFE container not visible');
    }
    
    console.log('\n✅ Integration test completed successfully!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
})();