// src/app/models/pokemon.model.ts
export interface PokemonType {
  id: string;
  name: string;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string;
  image?: string;
  power: number;
  life: number;
}

export interface Team {
  id: string;
  name: string;
  power?: number;
  pokemons?: Pokemon[];
}

export interface TeamCreate {
  name: string;
  pokemon_ids: string[];
}

export interface BattleRequest {
  team1_id: string;
  team2_id: string;
}

export interface RoundInfo {
  round: number;
  team1: {
    pokemon: Pokemon;
    life_before: number;
    life_after: number;
  };
  team2: {
    pokemon: Pokemon;
    life_before: number;
    life_after: number;
  };
}

export interface BattleResult {
  winner: 'team1' | 'team2';
  rounds: RoundInfo[];
}