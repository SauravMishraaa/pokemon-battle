// src/app/components/pokemon-edit/pokemon-edit.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-container">
      <h1>Edit Pokemon</h1>
      
      @if (pokemon()) {
        <form (ngSubmit)="savePokemon()" class="edit-form">
          <div class="form-group">
            <label>Name:</label>
            <input type="text" [value]="pokemon()!.name" disabled />
          </div>
          
          <div class="form-group">
            <label>Type (UUID):</label>
            <input type="text" [(ngModel)]="editForm.type" name="type" required />
          </div>
          
          <div class="form-group">
            <label>Power:</label>
            <input type="number" [(ngModel)]="editForm.power" name="power" required min="1" />
          </div>
          
          <div class="form-group">
            <label>Life:</label>
            <input type="number" [(ngModel)]="editForm.life" name="life" required min="1" />
          </div>
          
          <div class="button-group">
            <button type="submit" class="btn-save">Save Changes</button>
            <button type="button" (click)="cancel()" class="btn-cancel">Cancel</button>
          </div>
          
          @if (successMessage()) {
            <div class="success">{{ successMessage() }}</div>
          }
          
          @if (errorMessage()) {
            <div class="error">{{ errorMessage() }}</div>
          }
        </form>
      } @else {
        <div class="loading">Loading...</div>
      }
    </div>
  `,
  styles: [`
    .edit-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    
    .edit-form {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .btn-save, .btn-cancel {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-save {
      background: #4CAF50;
      color: white;
    }
    
    .btn-save:hover {
      background: #45a049;
    }
    
    .btn-cancel {
      background: #f44336;
      color: white;
    }
    
    .btn-cancel:hover {
      background: #da190b;
    }
    
    .success {
      margin-top: 20px;
      padding: 10px;
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      border-radius: 5px;
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
export class PokemonEditComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  pokemon = signal<Pokemon | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  
  editForm = {
    type: '',
    power: 0,
    life: 0,
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemon(id);
    }
  }

  loadPokemon(id: string) {
    this.apiService.getPokemons().subscribe({
      next: (pokemons) => {
        const found = pokemons.find((p) => p.id === id);
        if (found) {
          this.pokemon.set(found);
          this.editForm = {
            type: found.type,
            power: found.power,
            life: found.life,
          };
        }
      },
      error: (err) => {
        this.errorMessage.set('Failed to load pokemon');
        console.error(err);
      },
    });
  }

  savePokemon() {
    if (!this.pokemon()) return;
    
    this.apiService.updatePokemon(this.pokemon()!.id, this.editForm).subscribe({
      next: () => {
        this.successMessage.set('Pokemon updated successfully!');
        setTimeout(() => {
          this.router.navigate(['/pokemons']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage.set('Failed to update pokemon');
        console.error(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/pokemons']);
  }
}