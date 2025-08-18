import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Make single-spa functions available globally
declare global {
  interface Window {
    mountRootParcel: any;
    System: any;
  }
}

// Bootstrap Angular application directly (not as a single-spa app)
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).then(() => {
  console.log('Angular application bootstrapped successfully');
}).catch(err => {
  console.error('Error bootstrapping Angular app:', err);
});