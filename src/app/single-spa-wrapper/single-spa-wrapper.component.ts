import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  registerReactMfe, 
  mountReactApp, 
  unmountReactApp, 
  initializeSingleSpa,
  isReactAppMounted 
} from '../../single-spa-root-config';

@Component({
  selector: 'app-single-spa-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="single-spa-container">
      <div id="single-spa-react-container" #reactContainer></div>
    </div>
  `,
  styles: [`
    .single-spa-container {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
    #single-spa-react-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class SingleSpaWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reactContainer', { static: false }) reactContainer!: ElementRef;
  private static initialized = false;
  private mounted = false;

  ngOnInit(): void {
    // Initialize single-spa only once
    if (!SingleSpaWrapperComponent.initialized) {
      this.initializeSingleSpa();
      SingleSpaWrapperComponent.initialized = true;
    }
  }

  ngAfterViewInit(): void {
    // Mount the React app after view is initialized
    this.mountReactMfe();
  }

  private initializeSingleSpa(): void {
    // Check if single-spa is available
    // @ts-ignore
    if (!window.singleSpa) {
      console.error('Single-SPA not available, loading it first...');
      this.loadSingleSpa().then(() => {
        this.loadSystemJS().then(() => {
          registerReactMfe();
          initializeSingleSpa();
        });
      });
    } else {
      // Load SystemJS first
      this.loadSystemJS().then(() => {
        // Register the React MFE
        registerReactMfe();
        // Initialize single-spa
        initializeSingleSpa();
      }).catch(error => {
        console.error('Failed to initialize Single-SPA:', error);
      });
    }
  }
  
  private loadSingleSpa(): Promise<void> {
    return new Promise((resolve) => {
      // Wait for single-spa to be available (loaded from index.html)
      const checkInterval = setInterval(() => {
        // @ts-ignore
        if (window.singleSpa) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5000);
    });
  }

  private loadSystemJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if SystemJS is already loaded
      // @ts-ignore
      if (window.System) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/system.min.js';
      script.onload = () => {
        console.log('SystemJS loaded successfully');
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load SystemJS'));
      document.head.appendChild(script);
    });
  }

  private mountReactMfe(): void {
    // Use a timeout to ensure DOM is ready
    setTimeout(() => {
      if (!this.mounted && !isReactAppMounted()) {
        console.log('Mounting React MFE via Single-SPA...');
        mountReactApp();
        this.mounted = true;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.mounted) {
      console.log('Unmounting React MFE via Single-SPA...');
      unmountReactApp();
      this.mounted = false;
    }
  }
}