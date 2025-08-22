  Prerequisites

  - Existing Angular application (v15+)
  - Node.js and npm installed
  - Basic understanding of Angular components

  ---
  Phase 1: Create the React MFE

  1. Create React MFE Project
  mkdir react-mfe && cd react-mfe
  npm init -y

  2. Install React Dependencies
  npm install react react-dom
  npm install --save-dev webpack webpack-cli webpack-dev-server
  npm install --save-dev @babel/core @babel/preset-react @babel/preset-typescript
  npm install --save-dev babel-loader html-webpack-plugin
  npm install --save-dev typescript @types/react @types/react-dom
  npm install --save-dev style-loader css-loader

  3. Install Single-SPA for React
  npm install single-spa-react

  4. Create React App Structure
  react-mfe/
  ├── src/
  │   ├── App.tsx          # Your React component
  │   ├── App.css          # React styles
  │   ├── index.tsx        # Development entry
  │   └── single-spa-entry.tsx  # Single-SPA entry point
  ├── webpack.config.js
  ├── tsconfig.json
  └── package.json

  5. Configure Webpack for UMD Output
  // webpack.config.js
  module.exports = {
    entry: {
      'react-single-spa': './src/single-spa-entry.tsx'
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'umd',
      library: '[name]',
      publicPath: 'http://localhost:3000/'
    },
    // ... rest of config
  };

  6. Create Single-SPA Entry Point
  // src/single-spa-entry.tsx
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import singleSpaReact from 'single-spa-react';
  import App from './App';

  const lifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: App,
    domElementGetter: () => document.getElementById('react-container')
  });

  export const { bootstrap, mount, unmount } = lifecycles;
  window.reactMfeSingleSpa = lifecycles;

  ---
  Phase 2: Prepare Angular Host

  7. Install Angular Dependencies
  cd angular-app
  npm install single-spa
  npm install --save-dev @angular-builders/custom-webpack

  8. Create Environment Configuration
  // src/environments/environment.ts
  export const environment = {
    production: false,
    reactMfeUrl: 'http://localhost:3000'
  };

  9. Create Single-SPA Config Helper
  // src/single-spa-config.ts
  declare const singleSpa: any;

  const appStates = {
    reactMfe: { shouldMount: false }
  };

  export function registerReactMfe() {
    singleSpa.registerApplication({
      name: '@react-mfe/app',
      app: () => loadReactApp(),
      activeWhen: () => appStates.reactMfe.shouldMount
    });
  }

  export function mountReactApp() {
    appStates.reactMfe.shouldMount = true;
    window.singleSpa?.triggerAppChange();
  }

  export function unmountReactApp() {
    appStates.reactMfe.shouldMount = false;
    window.singleSpa?.triggerAppChange();
  }

  10. Create Angular Wrapper Component
  // src/app/react-wrapper/react-wrapper.component.ts
  @Component({
    selector: 'app-react-wrapper',
    template: `
      <div class="react-container">
        <div id="react-container"></div>
      </div>
    `,
    standalone: true
  })
  export class ReactWrapperComponent implements OnInit, OnDestroy {
    ngOnInit() {
      this.loadSingleSpa();
      this.registerAndMount();
    }

    ngOnDestroy() {
      unmountReactApp();
    }

    private loadSingleSpa() {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/single-spa@5/lib/system/single-spa.min.js';
      document.head.appendChild(script);
    }

    private registerAndMount() {
      setTimeout(() => {
        registerReactMfe();
        mountReactApp();
      }, 500);
    }
  }

  11. Add Tab Navigation in Main Component
  // src/app/app.component.ts
  @Component({
    selector: 'app-root',
    template: `
      <div class="tabs">
        <button (click)="selectedTab = 0" [class.active]="selectedTab === 0">
          Angular Content
        </button>
        <button (click)="selectedTab = 1" [class.active]="selectedTab === 1">
          React MFE
        </button>
      </div>

      <div class="tab-content">
        <div *ngIf="selectedTab === 0">
          <!-- Your Angular content -->
        </div>
        <div *ngIf="selectedTab === 1">
          <app-react-wrapper></app-react-wrapper>
        </div>
      </div>
    `
  })
  export class AppComponent {
    selectedTab = 0;
  }

  ---
  Phase 3: Configure Build & CORS

  12. Update Angular Build Configuration
  // angular.json
  {
    "build": {
      "builder": "@angular-builders/custom-webpack:browser",
      "options": {
        "customWebpackConfig": {
          "path": "./webpack.config.js"
        }
      }
    }
  }

  13. Configure CORS in React Dev Server
  // react-mfe/webpack.config.js
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }

  ---
  Phase 4: Running the Applications

  14. Start React MFE
  cd react-mfe
  npm start  # Runs on http://localhost:3000

  15. Start Angular Host
  cd angular-app
  ng serve  # Runs on http://localhost:4200

  ---
  Phase 5: Production Deployment

  16. Build React MFE for Production
  cd react-mfe
  NODE_ENV=production npm run build

  17. Build Angular with React Bundle
  # Copy React dist to Angular
  cp -r react-mfe/dist angular-app/src/assets/react-mfe

  # Update environment.prod.ts
  reactMfeUrl: '/assets/react-mfe'

  # Build Angular
  ng build --configuration production

  18. Deploy to Static Hosting
  # For Azure Static Web Apps
  swa deploy ./dist/angular-app --env production

  # For AWS S3
  aws s3 sync ./dist/angular-app s3://your-bucket

  # For Nginx
  cp -r ./dist/angular-app/* /var/www/html/

  ---
  Key Configuration Files Summary

  React: package.json scripts
  {
    "scripts": {
      "start": "webpack serve --port 3000",
      "build": "webpack --mode production"
    }
  }

  Angular: Import in module
  imports: [
    CommonModule,
    ReactWrapperComponent  // Import the wrapper
  ]

  Static Web App Config
  // staticwebapp.config.json
  {
    "routes": [
      {
        "route": "/react-mfe/*",
        "headers": {
          "content-type": "application/javascript"
        }
      }
    ]
  }

  ---
  Troubleshooting Tips

  - CORS Issues: Ensure React dev server has proper headers
  - Module Not Found: Check if Single-SPA is loaded before registering
  - React Not Rendering: Verify DOM element exists before mounting
  - Build Errors: Ensure webpack outputs UMD format
  - Tab Not Switching: Check Angular change detection

  ---
  Testing the Integration

  1. Click on "React MFE" tab
  2. React component should load inside Angular
  3. Check console for lifecycle logs
  4. Verify state persists when switching tabs
