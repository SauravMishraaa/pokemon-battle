// src/app/components/team-create/team-create.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-container">
      <h1>Create New Team</h1>
      
      <div class="create-form">
        <div class="form-group">
          <label>Team Name:</label>
          <input type="text" [(ngModel)]="teamName" placeholder="Enter team name" />
        </div>
        
        <h2>Select 6 Pokemons</h2>
        <p class="info">Selected: {{ selectedPokemons().length }}/6</p>
        
        @if (loading()) {
          <div class="loading">Loading pokemons...</div>
        }
        
        <div class="pokemon-selection">
          @for (pokemon of pokemons(); track pokemon.id) {
            <div 
              class="pokemon-item"
              [class.selected]="isSelected(pokemon.id)"
              (click)="togglePokemon(pokemon.id)"
            >
              @if (pokemon.image) {
                <img [src]="pokemon.image" [alt]="pokemon.name" />
              }
              <div class="pokemon-info">
                <h4>{{ pokemon.name }}</h4>
                <p>Power: {{ pokemon.power }} | Life: {{ pokemon.life }}</p>
              </div>
              @if (isSelected(pokemon.id)) {
                <div class="check-mark">✓</div>
              }
            </div>
          }
        </div>
        
        <div class="button-group">
          <button 
            (click)="createTeam()" 
            class="btn-create"
            [disabled]="selectedPokemons().length !== 6 || !teamName"
          >
            Create Team
          </button>
          <button (click)="cancel()" class="btn-cancel">Cancel</button>
        </div>
        
        @if (errorMessage()) {
          <div class="error">{{ errorMessage() }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .create-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    
    h2 {
      color: #555;
      margin: 20px 0 10px 0;
    }
    
    .create-form {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 30px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .info {
      color: #2196F3;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .pokemon-selection {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
      max-height: 500px;
      overflow-y: auto;
      padding: 10px;
    }
    
    .pokemon-item {
      border: 2px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .pokemon-item:hover {
      border-color: #2196F3;
      transform: scale(1.02);
    }
    
    .pokemon-item.selected {
      border-color: #4CAF50;
      background: #e8f5e9;
    }
    
    .pokemon-item img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }
    
    .pokemon-info {
      flex: 1;
    }
    
    .pokemon-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    
    .pokemon-info p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .check-mark {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
    }
    
    .btn-create, .btn-cancel {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .btn-create {
      background: #4CAF50;
      color: white;
    }
    
    .btn-create:hover:not(:disabled) {
      background: #45a049;
    }
    
    .btn-create:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .btn-cancel {
      background: #f44336;
      color: white;
    }
    
    .btn-cancel:hover {
      background: #da190b;
    }
    
    .error {
      margin-top: 20px;
      padding: 10px;
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
    }
  `],
})
export class TeamCreateComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  pokemons = signal<Pokemon[]>([]);
  selectedPokemons = signal<string[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  teamName = '';

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
        this.errorMessage.set('Failed to load pokemons');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  isSelected(id: string): boolean {
    return this.selectedPokemons().includes(id);
  }

  togglePokemon(id: string) {
    const selected = this.selectedPokemons();
    if (selected.includes(id)) {
      this.selectedPokemons.set(selected.filter((pid) => pid !== id));
    } else if (selected.length < 6) {
      this.selectedPokemons.set([...selected, id]);
    }
  }

  createTeam() {
    if (this.selectedPokemons().length !== 6 || !this.teamName) {
      this.errorMessage.set('Please select exactly 6 pokemons and provide a team name');
      return;
    }

    this.apiService
      .createTeam({
        name: this.teamName,
        pokemon_ids: this.selectedPokemons(),
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/teams']);
        },
        error: (err) => {
          this.errorMessage.set('Failed to create team: ' + (err.error?.error || 'Unknown error'));
          console.error(err);
        },
      });
  }

  cancel() {
    this.router.navigate(['/teams']);
  }
}