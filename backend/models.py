from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from db import Base

class PokemonType(Base):
    __tablename__ = "pokemon_type"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)

    pokemons = relationship("Pokemon", back_populates="type_rel")


class Pokemon(Base):
    __tablename__ = "pokemon"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    type = Column(UUID(as_uuid=True), ForeignKey("pokemon_type.id"), nullable=False)
    image = Column(String, nullable=True)
    power = Column(Integer, nullable=False)
    life = Column(Integer, nullable=False)

    type_rel = relationship("PokemonType", back_populates="pokemons")

class Team(Base):
    __tablename__ = "team"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)

class TeamPokemon(Base):
    __tablename__ = "team_pokemon"
    team_id = Column(UUID(as_uuid=True), ForeignKey("team.id"), primary_key=True)
    pokemon_id = Column(UUID(as_uuid=True), ForeignKey("pokemon.id"), primary_key=True)
    position = Column(Integer, nullable=False)

class Weakness(Base):
    __tablename__ = "weakness"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type1= Column(UUID(as_uuid=True))
    type2= Column(UUID(as_uuid=True))
    factor = Column(Float, nullable=False)