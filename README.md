Demo : https://jolly-wave-0ac63d010.1.azurestaticapps.net/
# Angular Single-SPA Application with React Microfrontend

This project demonstrates a microfrontend architecture using Single-SPA framework with an Angular shell application and a React microfrontend.

## Project Structure

```
angular-spa-app/
├── src/                    # Angular shell application
│   ├── app/               # Angular components
│   ├── main.ts            # Standard Angular bootstrap
│   └── main.single-spa.ts # Single-SPA Angular bootstrap
├── react-mfe/             # React microfrontend
│   ├── src/              # React components
│   └── webpack.config.js # Webpack configuration for React MFE
├── index.html            # Root Single-SPA configuration
├── angular.json          # Angular configuration
└── package.json          # Dependencies and scripts
```

## Features

- **Angular Shell Application (v19)**: Main container application built with Angular 19
- **React Microfrontend (v18)**: Independent React application loaded as a microfrontend
- **Single-SPA Integration**: Orchestrates multiple frameworks in a single application
- **Routing**: Seamless navigation between Angular and React sections
- **Task Manager**: Demo React component with state management

## Installation

Install dependencies for both applications:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install Angular dependencies
npm install

# Install React MFE dependencies
cd react-mfe
npm install
cd ..
```

## Running the Application

### Option 1: Run all applications together (Recommended)

```bash
npm run start:all
```

This will start:
- Angular app on http://localhost:4200
- React MFE on http://localhost:4202
- Root config on http://localhost:3000

Open http://localhost:3000 to see the full microfrontend application.

### Option 2: Run applications separately

Terminal 1 - Angular Shell:
```bash
npm run start:angular
```

Terminal 2 - React MFE:
```bash
npm run start:react
```

Terminal 3 - Root Config:
```bash
npm run serve:root
```

## Building for Production

```bash
npm run build:all
```

This will build both the Angular shell and React microfrontend.

## Adding Single-SPA to an Existing Angular Project

If you want to add Single-SPA to your existing Angular project, follow these steps:

### Step 1: Install Single-SPA Dependencies

```bash
npm install single-spa single-spa-angular systemjs
```

### Step 2: Create Single-SPA Entry Point

Create a new file `src/main.single-spa.ts`:

```typescript
import { NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const lifecycles = singleSpaAngular({
  bootstrapFunction: () => {
    return bootstrapApplication(AppComponent, {
      providers: [
        getSingleSpaExtraProviders(),
        provideRouter(routes)
      ]
    });
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
```

### Step 3: Create Root HTML Configuration

Create `index.html` in your project root (not in src):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Single-SPA Root Config</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="single-spa-application"></div>

  <script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/system.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/extras/amd.min.js"></script>
  
  <script type="systemjs-importmap">
    {
      "imports": {
        "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.5/lib/system/single-spa.min.js",
        "@your-org/angular-app": "/dist/your-app/main-single-spa.js"
      }
    }
  </script>

  <script>
    System.import('single-spa').then(({ registerApplication, start }) => {
      registerApplication({
        name: '@your-org/angular-app',
        app: () => System.import('@your-org/angular-app'),
        activeWhen: (location) => location.pathname.startsWith('/')
      });
      start();
    });
  </script>
</body>
</html>
```

### Step 4: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start:single-spa": "ng serve --port 4200",
    "serve:root": "npx serve . -p 3000 -s",
    "build:single-spa": "ng build && node build-single-spa.js"
  }
}
```

### Step 5: Create Build Script for Single-SPA

Create `build-single-spa.js` in project root:

```javascript
const fs = require('fs');
const path = require('path');

// Create SystemJS compatible bundle
const singleSpaBundle = `
System.register([], function(exports) {
  return {
    execute: function() {
      // Import your Angular build here
      // This is a simplified version - in production, use webpack
      exports({
        bootstrap: () => Promise.resolve(),
        mount: () => {
          // Load your Angular app
          return import('./dist/your-app/main.js');
        },
        unmount: () => Promise.resolve()
      });
    }
  };
});
`;

fs.writeFileSync(
  path.join(__dirname, 'dist', 'your-app', 'main-single-spa.js'),
  singleSpaBundle
);
```

### Step 6: Configure for Multiple Microfrontends

To add additional microfrontends (React, Vue, etc.), update your root `index.html`:

```javascript
System.import('single-spa').then(({ registerApplication, start }) => {
  // Angular app
  registerApplication({
    name: '@your-org/angular-app',
    app: () => System.import('@your-org/angular-app'),
    activeWhen: ['/angular', '/']
  });

  // React app
  registerApplication({
    name: '@your-org/react-app',
    app: () => System.import('@your-org/react-app'),
    activeWhen: ['/react']
  });

  start();
});
```

### Step 7: Handle Routing Between Microfrontends

In your Angular component, add navigation:

```typescript
@Component({
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/angular">Angular Routes</a>
      <a href="/react">React App</a> <!-- External navigation -->
    </nav>
    <router-outlet></router-outlet>
  `
})
```

### Step 8: Configure CORS for Development

When developing multiple microfrontends locally, ensure CORS headers are set:

```javascript
// webpack.config.js or angular.json devServer config
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
}
```

## Azure Static Web Apps Deployment

The project includes configuration for Azure Static Web Apps deployment:

1. `staticwebapp.config.json` - Routing and MIME type configuration
2. `.github/workflows/azure-static-web-apps.yml` - CI/CD pipeline
3. Deployment token in GitHub secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`

To deploy manually:
```bash
npx @azure/static-web-apps-cli deploy ./dist --deployment-token <your-token>
```

## Common Issues and Solutions

### Issue: "Unexpected token" errors in JavaScript
**Solution**: Ensure all template literals and string concatenations are properly escaped in SystemJS bundles.

### Issue: MIME type errors for JavaScript files
**Solution**: Configure `staticwebapp.config.json` to serve JS files before SPA fallback routes.

### Issue: Microfrontend not loading
**Solution**: Check SystemJS import map URLs and ensure all services are running on correct ports.

### Issue: Routing conflicts between microfrontends
**Solution**: Use unique base paths for each microfrontend and configure `activeWhen` functions properly.

## Technologies Used

### Angular Shell
- Angular 19
- TypeScript
- RxJS
- Single-SPA Angular

### React Microfrontend
- React 18
- TypeScript
- Webpack 5
- Single-SPA React

### Orchestration
- Single-SPA
- SystemJS for module loading
- Webpack Module Federation concepts

## Architecture Benefits

1. **Technology Agnostic**: Mix different frameworks in the same application
2. **Independent Deployment**: Each microfrontend can be deployed separately
3. **Team Autonomy**: Different teams can work on different parts
4. **Incremental Updates**: Migrate or update parts of the application independently
5. **Fault Isolation**: Issues in one microfrontend don't crash the entire application

## Development Tips

- Each microfrontend runs on its own port during development
- CORS headers are configured for cross-origin communication
- The root HTML file orchestrates the loading of microfrontends
- SystemJS handles dynamic module loading
- Use browser DevTools to debug SystemJS module loading issues

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed: `npm run install:all`
2. Check that ports 3000, 4200, and 4202 are available
3. Clear browser cache if routing seems broken
4. Check browser console for module loading errors
5. Verify SystemJS import map URLs in index.html
6. Ensure all JavaScript files are served with correct MIME type
7. Check CORS headers if loading microfrontends from different domains
