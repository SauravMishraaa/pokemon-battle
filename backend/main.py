from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
import models, schemas
from battle import simulate_battle
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/pokemons")
def list_pokemons(db: Session = Depends(get_db)):
    return db.query(models.Pokemon).all()

@app.put("/pokemons/{pokemon_id}")
def update_pokemon(pokemon_id, data: schemas.PokemonUpdate, db: Session = Depends(get_db)):
    p = db.query(models.Pokemon).get(pokemon_id)
    p.power = data.power
    p.life = data.life
    p.type = data.type
    db.commit()
    return p

@app.post("/team")
def create_team(data: schemas.TeamCreate, db: Session = Depends(get_db)):
    if len(data.pokemon_ids) != 6:
        return {"error": "A team must have exactly 6 pokemons."}
    
    team = models.Team(name=data.name)
    db.add(team)
    db.commit()
    db.refresh(team)


    for i, pid in enumerate(data.pokemon_ids):
        db.add(models.TeamPokemon(
            team_id=team.id,
            pokemon_id=pid,
            position=i + 1
        ))
    db.commit()
    return schemas.Team.from_orm(team)

# @app.get("/teams")
# def list_teams(db: Session = Depends(get_db)):
#     results = db.execute(text("""
#         select t.id, sum(p.power) as power
#         from team t
#         join team_pokemon tp on tp.team_id = t.id
#         join pokemon p on p.id = tp.pokemon_id
#         group by t.id
#         order by power desc
#     """)).fetchall()
#     return [{"id": row[0], "power": row[1]} for row in results]

@app.get("/teams")
def list_teams(db: Session = Depends(get_db)):
    teams = db.query(models.Team).all()
    result = []
    
    for team in teams:

        team_pokemons = db.query(models.TeamPokemon).filter(
            models.TeamPokemon.team_id == team.id
        ).order_by(models.TeamPokemon.position).all()
        
        pokemons = []
        total_power = 0
        for tp in team_pokemons:
            pokemon = db.query(models.Pokemon).filter(
                models.Pokemon.id == tp.pokemon_id
            ).first()
            if pokemon:
                pokemons.append({
                    "id": str(pokemon.id),
                    "name": pokemon.name,
                    "type": pokemon.type,
                    "power": pokemon.power,
                    "life": pokemon.life,
                    "position": tp.position
                })
                total_power += pokemon.power
        
        result.append({
            "id": str(team.id),
            "name": team.name,
            "power": total_power,
            "pokemons": pokemons
        })
    
    # Sort by power descending
    result.sort(key=lambda x: x["power"], reverse=True)
    return result


def fetch_team(team_id, db: Session):
    """Fetch a team's pokemon in order with their stats."""
    team_pokemons = db.query(models.TeamPokemon).filter(
        models.TeamPokemon.team_id == team_id
    ).order_by(models.TeamPokemon.position).all()
    
    team = []
    for tp in team_pokemons:
        pokemon = db.query(models.Pokemon).filter(
            models.Pokemon.id == tp.pokemon_id
        ).first()
        if pokemon:
            team.append({
                "id": pokemon.id,
                "name": pokemon.name,
                "type": pokemon.type,
                "power": pokemon.power,
                "life": pokemon.life,
                "image": pokemon.image
            })
    return team

def fetch_weakness_map(db: Session):
    """Fetch weakness factors as a dict (type1, type2) -> factor."""
    weaknesses = db.query(models.Weakness).all()
    weakness_map = {}
    for w in weaknesses:
        weakness_map[(w.type1, w.type2)] = w.factor
    return weakness_map

@app.post("/battle")
def battle(req: schemas.BattleRequest, db: Session = Depends(get_db)):
    team1 = fetch_team(req.team1_id, db)
    team2 = fetch_team(req.team2_id, db)
    weakness = fetch_weakness_map(db)

    return simulate_battle(team1, team2, weakness)
