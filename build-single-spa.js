const fs = require('fs');
const path = require('path');

// Read the main single-spa TypeScript file
const singleSpaContent = `
import { NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { AppComponent } from './src/app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './src/app/app.routes';

const lifecycles = {
  bootstrap: () => Promise.resolve(),
  mount: () => {
    return bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes)
      ]
    }).then(appRef => {
      (window as any).angularAppRef = appRef;
    });
  },
  unmount: () => {
    if ((window as any).angularAppRef) {
      (window as any).angularAppRef.destroy();
      delete (window as any).angularAppRef;
    }
    return Promise.resolve();
  }
};

export const { bootstrap, mount, unmount } = lifecycles;

// Make it SystemJS compatible
if (typeof System !== 'undefined') {
  System.register([], function(exports) {
    return {
      execute: function() {
        exports(lifecycles);
      }
    };
  });
}
`;

// Write to dist folder
const distPath = path.join(__dirname, 'dist', 'angular-spa-app');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(
  path.join(distPath, 'main-single-spa.js'),
  singleSpaContent
);

console.log('Single-spa bundle created at:', path.join(distPath, 'main-single-spa.js'));