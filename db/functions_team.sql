create or replace function create_team(
  team_name text,
  pokemon_ids uuid[]
) returns uuid as $$
declare
  t_id uuid;
  i int;
begin
  if array_length(pokemon_ids, 1) != 6 then
    raise exception 'Team must contain exactly 6 pokemons';
  end if;

  insert into team(name)
  values (team_name)
  returning id into t_id;

  for i in 1..6 loop
    insert into team_pokemon(team_id, pokemon_id, position)
    values (t_id, pokemon_ids[i], i);
  end loop;

  return t_id;
end;
$$ language plpgsql;

create or replace function get_teams_by_power()
returns table (
  team_id uuid,
  total_power int
) as $$
begin
  return query
  select t.id,
         sum(p.power)::int as total_power
  from team t
  join team_pokemon tp on tp.team_id = t.id
  join pokemon p on p.id = tp.pokemon_id
  group by t.id
  order by total_power desc;
end;
$$ language plpgsql;