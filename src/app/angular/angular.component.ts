import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-angular',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="angular-content">
      <h2>Angular Component</h2>
      <p>This is a native Angular component within the shell application.</p>
      <ul>
        <li>Built with Angular 19</li>
        <li>Using standalone components</li>
        <li>Ready for Single-SPA integration</li>
      </ul>
    </div>
  `,
  styles: [`
    .angular-content {
      padding: 20px;
      background-color: #e8f4f8;
      border-radius: 8px;
    }
    ul {
      margin-top: 10px;
    }
  `]
})
export class AngularComponent {}