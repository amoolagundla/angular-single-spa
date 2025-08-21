import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Web Component approach for React MFE
@Component({
  selector: 'app-react-web-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="web-component-wrapper">
      <react-mfe-element #reactElement></react-mfe-element>
    </div>
  `,
  styles: [`
    .web-component-wrapper {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
    react-mfe-element {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ReactWebComponentWrapper implements AfterViewInit, OnDestroy {
  @ViewChild('reactElement', { static: false }) reactElement!: ElementRef;
  private scriptLoaded = false;

  ngAfterViewInit(): void {
    this.loadReactAsWebComponent();
  }

  private async loadReactAsWebComponent(): Promise<void> {
    if (this.scriptLoaded) return;
    
    try {
      // Load React and ReactDOM first
      await this.loadScript('https://unpkg.com/react@18/umd/react.development.js');
      await this.loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js');
      
      // Define the web component
      this.defineWebComponent();
      
      this.scriptLoaded = true;
    } catch (error) {
      console.error('Error loading React as Web Component:', error);
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private defineWebComponent(): void {
    // Check if already defined
    if (customElements.get('react-mfe-element')) {
      return;
    }

    class ReactMfeElement extends HTMLElement {
      private root: any;
      
      connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.loadReactApp();
      }

      async loadReactApp() {
        try {
          // Load the React MFE
          const response = await fetch('http://localhost:4202/main.js');
          const scriptText = await response.text();
          
          // Create a container in shadow DOM
          const container = document.createElement('div');
          container.id = 'react-root';
          container.style.width = '100%';
          container.style.height = '100%';
          
          // Add styles
          const style = document.createElement('style');
          style.textContent = `
            :host {
              display: block;
              width: 100%;
              height: 100%;
            }
            #react-root {
              width: 100%;
              height: 100%;
            }
          `;
          
          this.shadowRoot!.appendChild(style);
          this.shadowRoot!.appendChild(container);
          
          // Execute the React app in the shadow DOM context
          // @ts-ignore
          if (window.reactMfeMount) {
            // @ts-ignore
            this.root = window.reactMfeMount(container);
          }
        } catch (error) {
          console.error('Error loading React app in Web Component:', error);
          this.shadowRoot!.innerHTML = '<div style="color: red; padding: 20px;">Error loading React MFE</div>';
        }
      }

      disconnectedCallback() {
        if (this.root && this.root.unmount) {
          this.root.unmount();
        }
      }
    }

    customElements.define('react-mfe-element', ReactMfeElement);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}