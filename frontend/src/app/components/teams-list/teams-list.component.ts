import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Team } from '../../models/pokemon.model';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="teams-container">
      <div class="header">
        <h1>Pokemon Teams</h1>
        <button [routerLink]="['/teams/create']" class="btn-create">
          + Create New Team
        </button>
      </div>
      
      @if (loading()) {
        <div class="loading">Loading teams...</div>
      }
      
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      
      <div class="teams-list">
        @for (team of teams(); track team.id) {
          <div class="team-card">
            <div class="team-header">
              <div class="team-info">
                <h2>{{ team.name }}</h2>
                <p class="team-power">⚡ Total Power: <strong>{{ team.power }}</strong></p>
              </div>
              <button class="btn-battle" [routerLink]="['/battle']">Battle</button>
            </div>
            
            <div class="pokemons-section">
              <h3>Team Members ({{ team.pokemons?.length || 0 }}/6)</h3>
              <div class="pokemons-grid">
                @for (pokemon of team.pokemons; track pokemon.id; let i = $index) {
                  <div class="pokemon-badge">
                    <div class="position">{{ i + 1 }}</div>
                    <div class="pokemon-details">
                      <p class="pokemon-name">{{ pokemon.name }}</p>
                      <p class="pokemon-stats">
                        <span class="power">⚔️ {{ pokemon.power }}</span>
                        <span class="life">❤️ {{ pokemon.life }}</span>
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
      
      @if (teams().length === 0 && !loading()) {
        <div class="no-teams">
          <p>No teams created yet. Create your first team to get started!</p>
          <button [routerLink]="['/teams/create']" class="btn-create">
            Create First Team
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .teams-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    h1 {
      color: #fff;
      margin: 0;
      font-size: 2.5em;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .btn-create {
      padding: 12px 24px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }
    
    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }
    
    .teams-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .team-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s;
      border-left: 5px solid #2196F3;
    }
    
    .team-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .team-info h2 {
      color: #2c5aa0;
      margin: 0 0 8px 0;
      font-size: 1.8em;
    }
    
    .team-power {
      color: #ff6b6b;
      font-size: 1.1em;
      margin: 0;
    }
    
    .btn-battle {
      padding: 10px 20px;
      background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .btn-battle:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    }
    
    .pokemons-section h3 {
      color: #333;
      margin: 0 0 15px 0;
      font-size: 1.2em;
    }
    
    .pokemons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    
    .pokemon-badge {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 2px solid #ddd;
      transition: all 0.2s;
    }
    
    .pokemon-badge:hover {
      border-color: #2196F3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
    }
    
    .position {
      background: #2196F3;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .pokemon-details {
      flex: 1;
    }
    
    .pokemon-name {
      margin: 0 0 5px 0;
      color: #333;
      font-weight: bold;
      font-size: 0.95em;
    }
    
    .pokemon-stats {
      margin: 0;
      display: flex;
      gap: 10px;
      font-size: 0.85em;
      color: #666;
    }
    
    .power {
      background: #ffe082;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .life {
      background: #f8bbd0;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .loading, .no-teams {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      background: white;
      border-radius: 10px;
    }
    
    .error {
      padding: 15px;
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    
    .no-teams {
      background: white;
      color: #666;
    }
    
    .no-teams p {
      margin-bottom: 20px;
      font-size: 1.1em;
    }
  `],
})
export class TeamsListComponent implements OnInit {
  private apiService = inject(ApiService);
  
  teams = signal<Team[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load teams');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}