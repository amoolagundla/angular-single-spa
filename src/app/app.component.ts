import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container">
      <h1>Angular Single-SPA Application</h1>
      <nav>
        <a routerLink="/">Home</a> |
        <a routerLink="/angular">Angular App</a> |
        <a id="react-nav">React MFE</a>
      </nav>
      <router-outlet></router-outlet>
      <div id="react-mfe"></div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    nav {
      margin: 20px 0;
      padding: 10px;
      background-color: #f0f0f0;
    }
    nav a {
      margin: 0 10px;
      text-decoration: none;
      color: #333;
    }
    nav a:hover {
      color: #007bff;
    }
    #react-mfe {
      margin-top: 20px;
      padding: 20px;
      border: 2px dashed #ccc;
      min-height: 200px;
    }
  `]
})
export class AppComponent {
  title = 'angular-spa-app';
}