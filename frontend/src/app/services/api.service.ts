import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Pokemon,
  Team,
  TeamCreate,
  BattleRequest,
  BattleResult,
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000';

  // Pokemon endpoints
  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}/pokemons`);
  }

  updatePokemon(
    id: string,
    data: { power: number; life: number; type: string }
  ): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${this.apiUrl}/pokemons/${id}`, data);
  }

  // Team endpoints
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }

  createTeam(data: TeamCreate): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/team`, data);
  }

  // Battle endpoint
  battle(data: BattleRequest): Observable<BattleResult> {
    return this.http.post<BattleResult>(`${this.apiUrl}/battle`, data);
  }
}