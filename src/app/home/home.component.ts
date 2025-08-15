import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home">
      <h2>Welcome to Angular Single-SPA Application</h2>
      <p>This is the main Angular shell application that hosts microfrontends.</p>
      <p>Navigate using the menu above to see different parts of the application.</p>
    </div>
  `,
  styles: [`
    .home {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
  `]
})
export class HomeComponent {}