import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

declare global {
  interface Window {
    mountRootParcel: any;
    System: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container">
      <h1>Angular Single-SPA Application</h1>
      
      <!-- Tab Navigation -->
      <div class="tab-container">
        <div class="tab-nav">
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'angular'"
            (click)="switchTab('angular')">
            Angular Content
          </button>
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'react'"
            (click)="switchTab('react')">
            React MFE
          </button>
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'both'"
            (click)="switchTab('both')">
            Both Together
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Angular Content Tab -->
          <div *ngIf="activeTab === 'angular'" class="tab-panel">
            <h2>Angular Application Content</h2>
            <p>This is the Angular application running in standalone mode.</p>
            <router-outlet></router-outlet>
          </div>
          
          <!-- React MFE Tab -->
          <div *ngIf="activeTab === 'react'" class="tab-panel">
            <h2>React Microfrontend</h2>
            <div id="react-parcel-container" #reactContainer></div>
          </div>
          
          <!-- Both Together Tab -->
          <div *ngIf="activeTab === 'both'" class="tab-panel">
            <div class="split-view">
              <div class="split-left">
                <h3>Angular App</h3>
                <router-outlet name="split"></router-outlet>
                <p>Angular content here</p>
              </div>
              <div class="split-right">
                <h3>React MFE</h3>
                <div id="react-parcel-split" #reactSplitContainer></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .tab-container {
      margin-top: 20px;
    }
    
    .tab-nav {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .tab-button {
      padding: 12px 24px;
      background: #f5f5f5;
      border: none;
      border-top: 2px solid transparent;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .tab-button:hover {
      background: #e8e8e8;
    }
    
    .tab-button.active {
      background: white;
      border-top: 2px solid #007bff;
      color: #007bff;
    }
    
    .tab-button.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: white;
    }
    
    .tab-content {
      background: white;
      border: 1px solid #e0e0e0;
      border-top: none;
      min-height: 400px;
    }
    
    .tab-panel {
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      height: 100%;
    }
    
    .split-left, .split-right {
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fafafa;
    }
    
    .split-left h3, .split-right h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
    }
    
    #react-parcel-container, #react-parcel-split {
      min-height: 300px;
      padding: 20px;
      border: 2px dashed #ccc;
      border-radius: 4px;
      background: #f9f9f9;
    }
    
    h2 {
      color: #333;
      margin-top: 0;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-spa-app';
  activeTab: 'angular' | 'react' | 'both' = 'angular';
  private reactParcel: any = null;
  private reactSplitParcel: any = null;

  ngOnInit() {
    console.log('Angular App Component initialized');
  }

  ngOnDestroy() {
    this.unmountReactParcels();
  }

  async switchTab(tab: 'angular' | 'react' | 'both') {
    console.log(`Switching to tab: ${tab}`);
    
    // Unmount existing parcels before switching
    this.unmountReactParcels();
    
    this.activeTab = tab;
    
    // Mount React parcels after a brief delay to ensure DOM is ready
    setTimeout(async () => {
      if (tab === 'react') {
        await this.mountReactParcel('react-parcel-container');
      } else if (tab === 'both') {
        await this.mountReactParcel('react-parcel-split');
      }
    }, 100);
  }

  private async mountReactParcel(containerId: string) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
      }

      console.log(`Mounting React parcel in ${containerId}`);
      
      // Import the React MFE module
      const reactModule = await (window as any).System.import('@react-mfe/app');
      
      // Create a parcel config that properly handles lifecycle
      const parcelConfig = {
        bootstrap: reactModule.bootstrap || (async () => {}),
        mount: reactModule.mount,
        unmount: reactModule.unmount,
        update: reactModule.update || (async () => {})
      };
      
      const parcel = window.mountRootParcel(parcelConfig, {
        domElement: container,
        name: '@react-mfe/parcel-' + containerId
      });
      
      // Store reference for cleanup
      if (containerId === 'react-parcel-container') {
        this.reactParcel = parcel;
      } else {
        this.reactSplitParcel = parcel;
      }
      
      console.log(`React parcel mounted successfully in ${containerId}`);
      
    } catch (error) {
      console.error('Error mounting React parcel:', error);
    }
  }

  private unmountReactParcels() {
    if (this.reactParcel) {
      console.log('Unmounting React parcel');
      this.reactParcel.unmount();
      this.reactParcel = null;
    }
    
    if (this.reactSplitParcel) {
      console.log('Unmounting React split parcel');
      this.reactSplitParcel.unmount();
      this.reactSplitParcel = null;
    }
  }
}