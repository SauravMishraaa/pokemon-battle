// src/app/components/pokemon-list/pokemon-list.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Pokemon } from '../../models/pokemon.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pokemon-list-container">
      <h1>Pokemon List</h1>
      
      @if (loading()) {
        <div class="loading">Loading pokemons...</div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      
      <div class="pokemon-grid">
        @for (pokemon of pokemons(); track pokemon.id) {
          <div class="pokemon-card">
            @if (pokemon.image) {
              <img [src]="pokemon.image" [alt]="pokemon.name" class="pokemon-image" />
            }
            <h3>{{ pokemon.name }}</h3>
            <p><strong>Power:</strong> {{ pokemon.power }}</p>
            <p><strong>Life:</strong> {{ pokemon.life }}</p>
            <p><strong>Type:</strong> {{ pokemon.type }}</p>
            <button [routerLink]="['/pokemon', pokemon.id]" class="btn-edit">
              Edit
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pokemon-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    
    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .pokemon-card {
      border: 2px solid #ddd;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      background: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .pokemon-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    
    .pokemon-image {
      width: 100px;
      height: 100px;
      object-fit: contain;
      margin-bottom: 10px;
    }
    
    h3 {
      color: #2c5aa0;
      margin: 10px 0;
    }
    
    p {
      margin: 5px 0;
      color: #666;
    }
    
    .btn-edit {
      margin-top: 10px;
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-edit:hover {
      background: #45a049;
    }
    
    .loading, .error {
      text-align: center;
      padding: 20px;
      font-size: 18px;
    }
    
    .error {
      color: #f44336;
    }
  `],
})
export class PokemonListComponent implements OnInit {
  private apiService = inject(ApiService);
  
  pokemons = signal<Pokemon[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.apiService.getPokemons().subscribe({
      next: (data) => {
        this.pokemons.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load pokemons');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}