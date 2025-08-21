import 'zone.js';
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

// SystemJS expects these exports
(window as any).bootstrap = lifecycles.bootstrap;
(window as any).mount = lifecycles.mount;
(window as any).unmount = lifecycles.unmount;

// Also export normally
export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

// Export default for SystemJS
export default {
  bootstrap: lifecycles.bootstrap,
  mount: lifecycles.mount,
  unmount: lifecycles.unmount
};