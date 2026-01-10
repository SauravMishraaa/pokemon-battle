create table if not exists team (
  id uuid primary key default gen_random_uuid(),
  name text
);

create table if not exists team_pokemon (
  team_id uuid references team(id) on delete cascade,
  pokemon_id uuid references pokemon(id),
  position int check (position between 1 and 6),
  primary key (team_id, position)
);
