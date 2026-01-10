import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonEditComponent } from './components/pokemon-edit/pokemon-edit.component';
import { TeamsListComponent } from './components/teams-list/teams-list.component';
import { TeamCreateComponent } from './components/team-create/team-create.component';
import { BattleComponent } from './components/battle/battle.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: 'pokemons', component: PokemonListComponent },
  { path: 'pokemon/:id', component: PokemonEditComponent },
  { path: 'teams', component: TeamsListComponent },
  { path: 'teams/create', component: TeamCreateComponent },
  { path: 'battle', component: BattleComponent },
];