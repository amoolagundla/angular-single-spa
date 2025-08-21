# Angular Shell with React MFE - Complete Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Architecture](#architecture)
6. [Integration Approaches](#integration-approaches)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)

## Overview

This project demonstrates an **Angular shell application** with **React micro frontend (MFE)** integration using **three different approaches**:

1. **Direct DOM Mounting** - React app mounts directly into Angular component
2. **Single-SPA Framework** - Industry-standard micro frontend orchestration
3. **Web Components** - Framework-agnostic approach (optional)

The key feature is **tab-based activation** - React MFEs load when tabs are clicked, NOT based on URL routes.

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 19.x (optional, for Angular commands)
- **Git** (for version control)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd angular-spa-app
```

### 2. Install Dependencies

#### Install Angular Shell Dependencies
```bash
npm install
```

#### Install React MFE Dependencies
```bash
cd react-mfe
npm install
cd ..
```

#### Or Install All at Once
```bash
npm run install:all
```

### 3. Verify Installation
```bash
# Check Angular dependencies
npm list @angular/core

# Check React MFE dependencies
cd react-mfe && npm list react
```

## Running the Application

### Option 1: Start Both Applications Manually

#### Terminal 1 - Start React MFE
```bash
cd react-mfe
npm start
# React MFE will run on http://localhost:4202
```

#### Terminal 2 - Start Angular Shell
```bash
npm start
# Angular Shell will run on http://localhost:4200
```

### Option 2: Use the Start Script
```bash
chmod +x start-mfe.sh
./start-mfe.sh
```

### Option 3: Use npm Scripts
```bash
# Start both applications in parallel
npm run start:all
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Angular Shell (Port 4200)             │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │                    Tab Navigation                 │  │
│  ├──────────┬────────────────┬─────────────────────┤  │
│  │  Tab 1   │     Tab 2      │       Tab 3         │  │
│  │ Angular  │  React (Direct) │  React (Single-SPA) │  │
│  └──────────┴────────────────┴─────────────────────┘  │
│                           ║                             │
│                           ║ (Tab Click)                 │
│                           ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Single-SPA Orchestrator               │  │
│  │  - Register Application                          │  │
│  │  - Manage Lifecycle                              │  │
│  │  - Handle Mount/Unmount                          │  │
│  └──────────────────────────────────────────────────┘  │
│                           ║                             │
│                           ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React MFE (Port 4202)                    │  │
│  │  - Task Manager Component                        │  │
│  │  - Single-SPA Lifecycle Functions                │  │
│  │  - UMD Bundle Output                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Integration Approaches

### 1. Direct DOM Mounting (Tab 2)
**Location:** `/src/app/react-wrapper/react-wrapper.component.ts`

- Loads React bundle directly via script tag
- Mounts React app into Angular component's DOM
- Simple and straightforward approach
- Good for POCs and simple integrations

### 2. Single-SPA Framework (Tab 3) ✅ RECOMMENDED
**Location:** `/src/app/single-spa-wrapper/single-spa-wrapper.component.ts`

- Industry-standard micro frontend framework
- Proper lifecycle management (bootstrap, mount, unmount)
- Tab-based activation (NOT route-based)
- Manual control via `mountReactApp()` and `unmountReactApp()`
- Best for production applications

**Key Features:**
- **No routing conflicts** - Works independently of Angular Router
- **Framework agnostic** - Can add Vue, Svelte, or other frameworks
- **Proper cleanup** - Automatic unmounting when switching tabs
- **Scalable** - Can manage multiple MFEs

### 3. Web Components (Optional)
**Location:** `/src/app/react-web-component/react-web-component.ts`

- Wraps React as a custom HTML element
- Shadow DOM for style isolation
- Framework-agnostic approach
- Good for maximum isolation

## Testing

### Run Integration Tests

#### Test Direct Integration
```bash
node test-integration.js
```

#### Test Single-SPA Integration
```bash
node test-single-spa.js
```

#### Debug Single-SPA Integration
```bash
node test-single-spa-debug.js
```

### Manual Testing

1. **Navigate to Angular Shell**
   ```
   http://localhost:4200
   ```

2. **Test Tab Navigation**
   - Click "Angular Content" - Shows Angular component
   - Click "React MFE (Direct)" - Loads React via direct mounting
   - Click "React MFE (Single-SPA)" - Loads React via Single-SPA

3. **Test React Functionality**
   - Add a new task in the Task Manager
   - Mark tasks as complete
   - Delete tasks
   - Verify state persists when switching tabs

## Troubleshooting

### Common Issues and Solutions

#### 1. React MFE Not Loading
```bash
# Check if React app is running
curl http://localhost:4202

# Check browser console for errors
# Open DevTools > Console

# Verify CORS headers
curl -I http://localhost:4202/react-single-spa.js
```

#### 2. Single-SPA Not Working
```javascript
// Check in browser console
window.singleSpa // Should exist
window.singleSpa.getAppNames() // Should show registered apps
window.singleSpa.getAppStatus('@react-mfe/app') // Check app status
```

#### 3. SystemJS Errors
```bash
# Ensure SystemJS is loaded
# Check Network tab for system.min.js

# Verify in console
window.System // Should exist
```

#### 4. Port Already in Use
```bash
# Kill process on port 4200
lsof -i :4200
kill <PID>

# Kill process on port 4202
lsof -i :4202
kill <PID>
```

#### 5. Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
ng cache clean

# Clear React MFE cache
cd react-mfe
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
angular-spa-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts              # Main Angular component with tabs
│   │   ├── react-wrapper/                # Direct mounting approach
│   │   │   └── react-wrapper.component.ts
│   │   ├── single-spa-wrapper/           # Single-SPA approach
│   │   │   └── single-spa-wrapper.component.ts
│   │   └── react-web-component/          # Web Component approach
│   │       └── react-web-component.ts
│   ├── single-spa-root-config.ts         # Single-SPA configuration
│   └── index.html                        # HTML with Single-SPA CDN
│
├── react-mfe/
│   ├── src/
│   │   ├── App.tsx                       # React Task Manager component
│   │   ├── bootstrap.tsx                 # Mount function for direct loading
│   │   ├── single-spa-entry.tsx          # Single-SPA lifecycle exports
│   │   └── index.tsx                     # Entry point
│   ├── webpack.config.js                 # Webpack with UMD output
│   └── package.json                      # React dependencies
│
├── test-integration.js                   # Direct integration test
├── test-single-spa.js                    # Single-SPA test
├── test-single-spa-debug.js              # Debug helper
├── start-mfe.sh                          # Start script
└── package.json                          # Angular dependencies
```

## Configuration Files

### Angular Configuration
**File:** `angular.json`
- Custom webpack configuration enabled
- Port 4200 for development server

### React Webpack Configuration
**File:** `react-mfe/webpack.config.js`
```javascript
{
  output: {
    libraryTarget: 'umd',    // Universal Module Definition
    library: '[name]'         // Exposes as global variable
  },
  devServer: {
    port: 4202,
    headers: {
      'Access-Control-Allow-Origin': '*'  // CORS enabled
    }
  }
}
```

### Single-SPA Configuration
**File:** `src/single-spa-root-config.ts`
```javascript
// Manual activation (not route-based)
function reactActivityFunction() {
  return appStates.reactMfe.shouldMount;
}

// Register application
singleSpa.registerApplication({
  name: '@react-mfe/app',
  app: () => loadReactApp(),
  activeWhen: reactActivityFunction
});
```

## Advanced Features

### Inter-App Communication
```javascript
// From Angular
window.dispatchEvent(new CustomEvent('angular:data', { 
  detail: { message: 'Hello React' }
}));

// In React
window.addEventListener('angular:data', (e) => {
  console.log(e.detail.message);
});
```

### Shared State Management
```javascript
// Global state store
window.sharedState = {
  user: currentUser,
  theme: 'light',
  permissions: []
};
```

### Dynamic Configuration
```javascript
// Load config before mounting
const config = await fetch('/api/config').then(r => r.json());
mountReactApp(config);
```

## Production Deployment

### Build for Production

#### Build Angular Shell
```bash
npm run build
# Output: dist/angular-spa-app/
```

#### Build React MFE
```bash
cd react-mfe
npm run build
# Output: react-mfe/dist/
```

#### Build All
```bash
npm run build:all
```

### Deployment Options

1. **Same Domain**
   - Deploy both to same server
   - Use nginx/Apache to route requests

2. **Different Domains**
   - Deploy Angular to main domain
   - Deploy React MFE to CDN
   - Update remoteEntry URLs

3. **Docker**
   ```dockerfile
   # Angular Shell
   FROM nginx:alpine
   COPY dist/angular-spa-app /usr/share/nginx/html
   
   # React MFE
   FROM nginx:alpine
   COPY react-mfe/dist /usr/share/nginx/html
   ```

## Next Steps

1. **Add More MFEs**
   - Vue.js micro frontend
   - Svelte micro frontend
   - Angular micro frontend

2. **Implement Shared Services**
   - Authentication service
   - API gateway
   - Event bus

3. **Performance Optimization**
   - Lazy loading
   - Prefetching
   - Bundle optimization

4. **Monitoring**
   - Error tracking
   - Performance metrics
   - User analytics

## Support & Resources

- [Single-SPA Documentation](https://single-spa.js.org/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Angular Documentation](https://angular.io/)
- [React Documentation](https://reactjs.org/)

## License

MIT

---

**Created with Angular 19 + React 18 + Single-SPA 5**