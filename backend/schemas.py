from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class PokemonUpdate(BaseModel):
    power: int
    life: int
    type: str

class TeamCreate(BaseModel):
    name: str
    pokemon_ids: List[UUID]

class BattleRequest(BaseModel):
    team1_id: UUID
    team2_id: UUID

class Team(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True

class PokemonResponse(BaseModel):
    id: UUID
    name: str
    power: int
    life: int
    type: str
    image: str | None

    class Config:
        from_attributes = True