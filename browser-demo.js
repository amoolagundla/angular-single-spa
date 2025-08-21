const { chromium } = require('playwright');

async function openBrowser() {
    console.log('Opening browser in headed mode...');
    
    // Launch browser in headed mode (visible to user)
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 // Add delay for better visibility
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
        
        // Take screenshot of main page
        await page.screenshot({ path: 'main-page.png', fullPage: true });
        console.log('Screenshot taken: main-page.png');
        
        // Wait a moment for page to fully load
        await page.waitForTimeout(2000);
        
        // Look for Angular navigation link
        const angularLink = await page.locator('a:has-text("Angular"), a[href*="angular"]').first();
        if (await angularLink.isVisible()) {
            console.log('Clicking Angular navigation link...');
            await angularLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'angular-page.png', fullPage: true });
            console.log('Screenshot taken: angular-page.png');
        } else {
            console.log('Angular navigation link not found');
        }
        
        // Look for React navigation link
        const reactLink = await page.locator('a:has-text("React"), a[href*="react"]').first();
        if (await reactLink.isVisible()) {
            console.log('Clicking React navigation link...');
            await reactLink.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'react-page.png', fullPage: true });
            console.log('Screenshot taken: react-page.png');
        } else {
            console.log('React navigation link not found');
        }
        
        // Navigate back to home
        await page.goto('http://localhost:3000');
        
        console.log('\n=== BROWSER OPENED SUCCESSFULLY ===');
        console.log('The browser window is now open and visible.');
        console.log('You can interact with the Single-SPA application.');
        console.log('The browser will remain open until you close this script with Ctrl+C');
        console.log('\nApplication URL: http://localhost:3000');
        console.log('\nPress Ctrl+C to close the browser and exit.');
        
        // Keep the script running so browser stays open
        process.on('SIGINT', async () => {
            console.log('\nClosing browser...');
            await browser.close();
            process.exit(0);
        });
        
        // Keep alive
        await new Promise(() => {});
        
    } catch (error) {
        console.error('Error occurred:', error);
        await page.screenshot({ path: 'error-page.png', fullPage: true });
        console.log('Error screenshot taken: error-page.png');
    }
}

// Run the script
openBrowser().catch(console.error);