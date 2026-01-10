// src/app/app.ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="logo">⚡ Pokemon Battle App</h1>
        <ul class="nav-links">
          <li><a routerLink="/pokemons" routerLinkActive="active">Pokemons</a></li>
          <li><a routerLink="/teams" routerLinkActive="active">Teams</a></li>
          <li><a routerLink="/battle" routerLinkActive="active">Battle</a></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .navbar {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      margin: 0;
      font-size: 1.8em;
      color: #333;
      font-weight: bold;
    }
    
    .nav-links {
      list-style: none;
      display: flex;
      gap: 30px;
      margin: 0;
      padding: 0;
    }
    
    .nav-links a {
      text-decoration: none;
      color: #666;
      font-size: 1.1em;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 5px;
      transition: all 0.3s;
    }
    
    .nav-links a:hover {
      color: #2196F3;
      background: #e3f2fd;
    }
    
    .nav-links a.active {
      color: white;
      background: #2196F3;
    }
    
    .main-content {
      padding: 20px;
      min-height: calc(100vh - 80px);
    }
  `],
})
export class App {}