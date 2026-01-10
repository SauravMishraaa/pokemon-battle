// src/app/components/battle/battle.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Team, BattleResult } from '../../models/pokemon.model';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="battle-container">
      <h1>⚡ Pokemon Battle Arena ⚡</h1>
      
      <div class="battle-setup">
        <div class="team-selection">
          <h2>Select Team 1</h2>
          <select [(ngModel)]="team1Id" class="team-select">
            <option value="">-- Select Team 1 --</option>
            @for (team of teams(); track team.id) {
              <option [value]="team.id">
                {{ team.name }} (Power: {{ team.power }})
              </option>
            }
          </select>
        </div>
        
        <div class="vs">VS</div>
        
        <div class="team-selection">
          <h2>Select Team 2</h2>
          <select [(ngModel)]="team2Id" class="team-select">
            <option value="">-- Select Team 2 --</option>
            @for (team of teams(); track team.id) {
              <option [value]="team.id">
                {{ team.name }} (Power: {{ team.power }})
              </option>
            }
          </select>
        </div>
      </div>
      
      <div class="battle-action">
        <button 
          (click)="startBattle()" 
          class="btn-battle"
          [disabled]="!team1Id || !team2Id || team1Id === team2Id || battling()"
        >
          {{ battling() ? '⏳ Battle in Progress...' : '⚔️ Start Battle!' }}
        </button>
      </div>
      
      @if (errorMessage()) {
        <div class="error">{{ errorMessage() }}</div>
      }
      
      @if (battleResult()) {
        <div class="battle-results">
          <div class="final-winner">
            <h2>🏆 {{ battleResult()!.winner === 'team1' ? 'Team 1' : 'Team 2' }} Wins! 🏆</h2>
          </div>
          
          <h3>Battle Rounds</h3>
          
          <div class="rounds-container">
            @for (round of battleResult()!.rounds; track round.round) {
              <div class="round-card">
                <div class="round-number">Round {{ round.round }}</div>
                
                <div class="battle-arena">
                  <!-- Team 1 Pokemon -->
                  <div class="pokemon-container team1-side">
                    <div class="pokemon-wrapper" [class.defeated]="round.team1.life_after <= 0">
                      @if (round.team1.pokemon.image) {
                        <img [src]="round.team1.pokemon.image" [alt]="round.team1.pokemon.name" class="pokemon-img" />
                      } @else {
                        <div class="pokemon-placeholder">No Image</div>
                      }
                    </div>
                    <div class="pokemon-info">
                      <p class="pokemon-name">{{ round.team1.pokemon.name }}</p>
                      <div class="health-bar">
                        <div class="health-fill" [style.width]="(round.team1.life_after / round.team1.life_before * 100) + '%'"></div>
                      </div>
                      <p class="health-text">
                        {{ round.team1.life_after | number:'1.0-0' }} / {{ round.team1.life_before | number:'1.0-0' }}
                      </p>
                      @if (round.team1.life_after <= 0) {
                        <p class="defeated-badge">💀 DEFEATED</p>
                      }
                    </div>
                  </div>

                  <!-- VS Badge -->
                  <div class="vs-badge">⚔️</div>

                  <!-- Team 2 Pokemon -->
                  <div class="pokemon-container team2-side">
                    <div class="pokemon-wrapper" [class.defeated]="round.team2.life_after <= 0">
                      @if (round.team2.pokemon.image) {
                        <img [src]="round.team2.pokemon.image" [alt]="round.team2.pokemon.name" class="pokemon-img" />
                      } @else {
                        <div class="pokemon-placeholder">No Image</div>
                      }
                    </div>
                    <div class="pokemon-info">
                      <p class="pokemon-name">{{ round.team2.pokemon.name }}</p>
                      <div class="health-bar">
                        <div class="health-fill" [style.width]="(round.team2.life_after / round.team2.life_before * 100) + '%'"></div>
                      </div>
                      <p class="health-text">
                        {{ round.team2.life_after | number:'1.0-0' }} / {{ round.team2.life_before | number:'1.0-0' }}
                      </p>
                      @if (round.team2.life_after <= 0) {
                        <p class="defeated-badge">💀 DEFEATED</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .battle-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      color: #fff;
      font-size: 3em;
      margin-bottom: 30px;
      text-shadow: 3px 3px 8px rgba(0,0,0,0.4);
    }
    
    .battle-setup {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 20px;
      align-items: center;
      margin-bottom: 30px;
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .team-selection h2 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    
    .team-select {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      background: white;
      cursor: pointer;
      transition: border-color 0.3s;
    }
    
    .team-select:focus {
      border-color: #2196F3;
      outline: none;
    }
    
    .vs {
      font-size: 2.5em;
      font-weight: bold;
      color: #d32f2f;
      text-align: center;
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    
    .battle-action {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .btn-battle {
      padding: 18px 70px;
      font-size: 1.3em;
      font-weight: bold;
      background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(211, 47, 47, 0.4);
      transition: all 0.3s;
    }
    
    .btn-battle:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(211, 47, 47, 0.6);
    }
    
    .btn-battle:disabled {
      background: #ccc;
      cursor: not-allowed;
      box-shadow: none;
    }
    
    .error {
      padding: 15px;
      background: #f8d7da;
      color: #721c24;
      border: 2px solid #f5c6cb;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: bold;
    }
    
    .battle-results {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .final-winner {
      text-align: center;
      background: linear-gradient(135deg, #fff9c4 0%, #f0f4c3 100%);
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 30px;
      border: 3px solid #ffc107;
      animation: bounce 1s infinite;
    }
    
    .final-winner h2 {
      color: #f57f17;
      font-size: 2.5em;
      margin: 0;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .battle-results h3 {
      color: #333;
      margin: 30px 0 25px 0;
      font-size: 1.5em;
      text-align: center;
    }
    
    .rounds-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    
    .round-card {
      border: 3px solid #e0e0e0;
      border-radius: 15px;
      padding: 25px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .round-number {
      text-align: center;
      color: #d32f2f;
      font-size: 1.4em;
      font-weight: bold;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(211, 47, 47, 0.3);
    }
    
    .battle-arena {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 20px;
      align-items: center;
    }
    
    .pokemon-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .pokemon-wrapper {
      width: 150px;
      height: 150px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s;
      position: relative;
    }
    
    .pokemon-wrapper.defeated {
      opacity: 0.6;
      filter: grayscale(100%);
      transform: scale(0.95);
    }
    
    .pokemon-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    
    .pokemon-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      color: #999;
      font-size: 14px;
    }
    
    .pokemon-info {
      text-align: center;
      width: 100%;
    }
    
    .pokemon-name {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.3em;
      font-weight: bold;
    }
    
    .health-bar {
      width: 100%;
      height: 25px;
      background: #e0e0e0;
      border-radius: 15px;
      overflow: hidden;
      border: 2px solid #333;
      margin-bottom: 8px;
    }
    
    .health-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
    
    .health-text {
      margin: 0;
      color: #666;
      font-size: 0.9em;
      font-weight: bold;
    }
    
    .defeated-badge {
      margin: 10px 0 0 0;
      color: #f44336;
      font-weight: bold;
      font-size: 1.1em;
      animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .vs-badge {
      font-size: 3em;
      text-align: center;
      animation: spin 2s linear infinite;
      height: fit-content;
    }
    
    @keyframes spin {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); }
    }
    
    .team1-side {
      justify-items: flex-end;
    }
    
    .team2-side {
      justify-items: flex-start;
    }
  `],
})
export class BattleComponent implements OnInit {
  private apiService = inject(ApiService);
  
  teams = signal<Team[]>([]);
  battleResult = signal<any>(null);
  battling = signal(false);
  errorMessage = signal('');
  
  team1Id = '';
  team2Id = '';

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams.set(data);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load teams');
        console.error(err);
      },
    });
  }

  startBattle() {
    if (!this.team1Id || !this.team2Id || this.team1Id === this.team2Id) {
      this.errorMessage.set('Please select two different teams');
      return;
    }

    this.battling.set(true);
    this.errorMessage.set('');
    this.battleResult.set(null);

    this.apiService
      .battle({
        team1_id: this.team1Id,
        team2_id: this.team2Id,
      })
      .subscribe({
        next: (result) => {
          this.battleResult.set(result);
          this.battling.set(false);
        },
        error: (err) => {
          this.errorMessage.set('Battle failed: ' + (err.error?.detail || 'Unknown error'));
          this.battling.set(false);
          console.error(err);
        },
      });
  }
}