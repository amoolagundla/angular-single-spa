import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const System: any;

@Component({
  selector: 'app-react-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="react-wrapper">
      <div #reactContainer id="react-mfe-container"></div>
    </div>
  `,
  styles: [`
    .react-wrapper {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
    #react-mfe-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ReactWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reactContainer', { static: false }) reactContainer!: ElementRef;
  private reactApp: any;

  ngAfterViewInit(): void {
    this.loadReactApp();
  }

  async loadReactApp(): Promise<void> {
    try {
      // Dynamically load the React MFE
      const reactMfeModule = await this.loadRemoteEntry();
      
      if (reactMfeModule && reactMfeModule.mount) {
        const containerElement = this.reactContainer.nativeElement;
        this.reactApp = reactMfeModule.mount(containerElement);
      }
    } catch (error) {
      console.error('Error loading React MFE:', error);
      this.reactContainer.nativeElement.innerHTML = `
        <div style="padding: 20px; color: red;">
          Error loading React MFE. Please ensure the React app is running on port 4202.
        </div>
      `;
    }
  }

  private async loadRemoteEntry(): Promise<any> {
    // First, load the React MFE bundle directly
    return new Promise((resolve, reject) => {
      // Check if already loaded
      // @ts-ignore
      if (window.reactMfeMount) {
        // @ts-ignore
        resolve({ mount: window.reactMfeMount });
        return;
      }

      const script = document.createElement('script');
      script.src = 'http://localhost:4202/main.js';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = async () => {
        // Wait a bit for the script to initialize
        setTimeout(() => {
          // @ts-ignore
          if (window.reactMfeMount) {
            // @ts-ignore
            resolve({ mount: window.reactMfeMount });
          } else {
            // Try loading via remoteEntry
            this.loadViaModuleFederation(resolve, reject);
          }
        }, 100);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load React MFE'));
      };
      
      document.head.appendChild(script);
    });
  }

  private loadViaModuleFederation(resolve: any, reject: any): void {
    const script = document.createElement('script');
    script.src = 'http://localhost:4202/remoteEntry.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = async () => {
      try {
        // @ts-ignore
        const container = window.reactMfe;
        if (container) {
          await container.init({});
          const factory = await container.get('./App');
          const module = factory();
          resolve(module);
        } else {
          reject(new Error('React MFE container not found'));
        }
      } catch (e) {
        reject(e);
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load React MFE remote entry'));
    };
    
    document.head.appendChild(script);
  }

  ngOnDestroy(): void {
    if (this.reactApp && this.reactApp.unmount) {
      this.reactApp.unmount();
    }
  }
}