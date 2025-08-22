import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSpaWrapperComponent } from './single-spa-wrapper/single-spa-wrapper.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SingleSpaWrapperComponent],
  template: `
    <div class="container">
      <h1>Angular Shell with Micro Frontends</h1>
      
      <div class="tabs">
        <div class="tab-list">
          <button 
            class="tab-button" 
            [class.active]="selectedTab === 0"
            (click)="selectTab(0)">
            Angular Content
          </button>
          <button 
            class="tab-button" 
            [class.active]="selectedTab === 1"
            (click)="selectTab(1)">
            React MFE (Single-SPA)
          </button>
        </div>
        
        <div class="tab-panels">
          <div class="tab-panel" [hidden]="selectedTab !== 0">
            <h2>Welcome to Angular Shell</h2>
            <p>This is the main Angular application serving as a shell for micro frontends.</p>
            <div class="feature-list">
              <h3>Features:</h3>
              <ul>
                <li>Angular 19 Application</li>
                <li>Micro Frontend Architecture</li>
                <li>React Integration via iframe</li>
                <li>Dynamic MFE Loading</li>
              </ul>
            </div>
          </div>
          
          <div class="tab-panel" [hidden]="selectedTab !== 1">
            <app-single-spa-wrapper></app-single-spa-wrapper>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      color: #3f51b5;
      margin-bottom: 30px;
    }
    
    .tab-content {
      padding: 20px;
      min-height: 400px;
    }
    
    .feature-list {
      margin-top: 20px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    
    .feature-list h3 {
      color: #333;
      margin-bottom: 10px;
    }
    
    .feature-list ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .feature-list li {
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .feature-list li:last-child {
      border-bottom: none;
    }
    
    .tabs {
      margin-top: 20px;
    }
    
    .tab-list {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 0;
    }
    
    .tab-button {
      padding: 12px 24px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      transition: all 0.3s ease;
      margin-right: 8px;
    }
    
    .tab-button:hover {
      background-color: #f5f5f5;
    }
    
    .tab-button.active {
      color: #3f51b5;
      border-bottom-color: #3f51b5;
      font-weight: 500;
    }
    
    .tab-panels {
      background: white;
      border-radius: 0 0 8px 8px;
      min-height: 400px;
    }
    
    .tab-panel {
      padding: 20px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'angular-shell';
  selectedTab = 0;

  ngOnInit() {
    // Set React MFE URL globally for components that need it
    (window as any).reactMfeUrl = environment.reactMfeUrl;
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }
}