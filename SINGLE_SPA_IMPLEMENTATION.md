# Single-SPA Integration with Tab-Based Activation

## Overview
This implementation uses **Single-SPA framework** to integrate a React MFE into an Angular shell, activated by tabs (not routes).

## Key Features
✅ **Tab-based activation** - React MFE loads when tab is clicked, not based on URL routes
✅ **Single-SPA lifecycle management** - Proper bootstrap, mount, unmount lifecycle
✅ **Manual control** - Full control over when apps mount/unmount
✅ **No routing conflicts** - Works independently of Angular Router
✅ **Proper cleanup** - Apps unmount when switching tabs

## Architecture

```
Angular Shell (Port 4200)
├── Tab 1: Angular Content
├── Tab 2: React MFE (Direct Mount)
└── Tab 3: React MFE (Single-SPA)
    └── Single-SPA Orchestrator
        └── React MFE (Port 4202)
```

## Implementation Details

### 1. Single-SPA Root Configuration
**File:** `/src/single-spa-root-config.ts`
- Custom activity function (not route-based)
- Manual mount/unmount functions
- SystemJS for dynamic loading

### 2. React MFE with Single-SPA
**File:** `/react-mfe/src/single-spa-entry.tsx`
- Exports Single-SPA lifecycle functions
- Custom container selection
- Error boundary for graceful failures

### 3. Angular Wrapper Component
**File:** `/src/app/single-spa-wrapper/single-spa-wrapper.component.ts`
- Loads SystemJS dynamically
- Registers React MFE on init
- Mounts/unmounts based on component lifecycle

### 4. Webpack Configuration
**File:** `/react-mfe/webpack.config.js`
```javascript
entry: {
  main: './src/index.tsx',
  'react-single-spa': './src/single-spa-entry.tsx'
},
output: {
  libraryTarget: 'system'
},
externals: ['single-spa']
```

## How It Works

1. **User clicks "React MFE (Single-SPA)" tab**
2. **Angular component lifecycle:**
   - `ngOnInit`: Initialize Single-SPA (once)
   - `ngAfterViewInit`: Mount React MFE
   - `ngOnDestroy`: Unmount React MFE

3. **Single-SPA orchestration:**
   - Registers React app with custom activity function
   - Activity function returns `true` when tab is active
   - Single-SPA handles lifecycle transitions

4. **React MFE loading:**
   - SystemJS loads `react-single-spa.js`
   - Single-SPA calls bootstrap → mount
   - React app renders in designated container

## Running the Application

### Start both applications:
```bash
# Terminal 1: React MFE
cd react-mfe
npm start

# Terminal 2: Angular Shell
npm start
```

### Access:
1. Navigate to http://localhost:4200
2. Click "React MFE (Single-SPA)" tab
3. React app loads via Single-SPA

## Testing
```bash
node test-single-spa.js
```

## Benefits Over Other Approaches

| Feature | Single-SPA | Direct Mount | iframe |
|---------|------------|--------------|--------|
| **Lifecycle Management** | ✅ Full | ⚠️ Manual | ❌ None |
| **Framework Agnostic** | ✅ Yes | ❌ No | ✅ Yes |
| **Shared Dependencies** | ✅ Yes | ❌ No | ❌ No |
| **Production Ready** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Tab-Based Loading** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Route Integration** | ✅ Optional | ❌ No | ❌ No |

## Code Examples

### Manual Mount/Unmount
```typescript
// Mount React app
mountReactApp();

// Unmount React app
unmountReactApp();
```

### Custom Activity Function
```typescript
function reactActivityFunction() {
  // Return true when app should be mounted
  return appStates.reactMfe.shouldMount;
}
```

### Tab Change Handler
```typescript
selectTab(index: number) {
  this.selectedTab = index;
  // Single-SPA component handles mount/unmount automatically
}
```

## Troubleshooting

### React MFE not loading:
1. Check browser console for errors
2. Verify SystemJS is loaded
3. Check CORS headers on React dev server
4. Ensure `react-single-spa.js` is being served

### Console errors:
- **"System is not defined"**: SystemJS not loaded
- **"Failed to fetch"**: CORS issue or React app not running
- **"Container not found"**: DOM element missing

### Debug tips:
```javascript
// Check if Single-SPA is initialized
window.singleSpa.getAppNames()

// Check app status
window.singleSpa.getAppStatus('@react-mfe/app')

// Force mount
window.singleSpa.navigateToUrl('#')
```

## Advanced Features

### 1. Inter-App Communication
```javascript
// Publish event from Angular
window.dispatchEvent(new CustomEvent('angular:data', { 
  detail: { message: 'Hello React' }
}));

// Subscribe in React
window.addEventListener('angular:data', (e) => {
  console.log(e.detail.message);
});
```

### 2. Shared State
```javascript
// Global store
window.sharedState = {
  user: null,
  theme: 'light'
};
```

### 3. Dynamic Configuration
```javascript
// Load config before mounting
const config = await fetch('/api/config').then(r => r.json());
registerApplication({
  name: '@react-mfe/app',
  app: () => loadApp(config),
  activeWhen: customActivity
});
```

## Next Steps

1. **Production Build**: Configure for production deployment
2. **Error Handling**: Add comprehensive error boundaries
3. **Performance**: Implement prefetching and lazy loading
4. **Testing**: Add E2E tests for Single-SPA lifecycle
5. **Monitoring**: Add telemetry for app transitions