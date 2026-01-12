# Pokemon Battle Arena

A full-stack web application for creating Pokemon teams and simulating battles between them. Built with Angular 21 (frontend) and FastAPI (backend).
## Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Sync with uv (if using uv package manager)
uv sync

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start FastAPI server
uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server
npm start
```

Frontend will run on: **http://localhost:4200**

---

## Features

**List all pokemons** - View pokemon with their stats (power, life, type)  
**Edit pokemon** - Adjust power, life, and type  
**Create teams** - Build teams of exactly 6 pokemons  
**View teams** - See all teams with member pokemons and total power  
**Battle simulation** - Watch detailed round-by-round battles with pokemon images and health bars  
**Winner display** - See battle results and damage calculations

---

## Project Structure

```
pokemon/
├── backend/                 # FastAPI application
│   ├── main.py             # FastAPI routes
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic schemas
│   ├── battle.py           # Battle simulation logic
│   ├── db.py               # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── pyproject.toml       # Project configuration
│
└── frontend/               # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── components/  # UI components (pokemon, teams, battle)
    │   │   ├── services/    # API service
    │   │   ├── models/      # TypeScript interfaces
    │   │   └── app.ts       # Root component
    │   ├── main.ts          # Application entry point
    │   └── styles.css       # Global styles
    └── package.json         # Node dependencies
```

---

## Prerequisites

- **Python 3.8+** - For backend
- **Node.js 18+** - For frontend  
- **npm 11+** - Node package manager
- **uv** (optional) - Fast Python package manager

---

## Environment Setup

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.gvrayrpuascufmfclesy.supabase.co:5432/postgres

```


## API Endpoints

### Pokemons
- `GET /pokemons` - List all pokemons
- `PUT /pokemons/{pokemon_id}` - Update pokemon (power, life, type)

### Teams
- `GET /teams` - List all teams with pokemons and total power
- `POST /team` - Create new team (must have exactly 6 pokemons)

### Battle
- `POST /battle` - Simulate battle between two teams

---

## Data Structure & Schema


### Models

```python
Pokemon:
  - id (UUID)
  - name (string)
  - type (UUID → PokemonType)
  - power (int)
  - life (int)
  - image (optional string)

Team:
  - id (UUID)
  - name (string)

TeamPokemon:
  - team_id (FK)
  - pokemon_id (FK)
  - position (1-6, determines battle order)

Weakness:
  - type1 (UUID)
  - type2 (UUID)
  - factor (float)
```

---

## Battle Algorithm

### How Battles Work

```
1. Start with team1 and team2 pokemons in order (positions 1-6)
2. Current pokemon from each team fight each round:
   - Calculate damage: power × type_weakness_factor
   - Both pokemon attack simultaneously
   - Apply damage to both
   - Record round stats (before/after life)
3. When a pokemon's life ≤ 0, next pokemon enters
4. Battle ends when one team has no pokemon left
5. Winner = team with remaining pokemon
```

### Example

```
Team 1: [Pikachu(power:10), Charizard(power:15)]
Team 2: [Squirtle(power:12)]

Weakness: Fire→Water: 0.5x, Water→Fire: 2.0x, Electric→Water: 0.5x

Round 1:
  Pikachu (Electric) vs Squirtle (Water)
  - Pikachu damage: 10 × 0.5 = 5 (weak)
  - Squirtle damage: 12 × 2.0 = 24 (super effective!)
  - Pikachu: 100 → 76 life
  - Squirtle: 50 → 45 life

Round 2:
  (Battle continues until one team has no pokemon)
```

**Why this design?**
- **Simultaneous attacks**: More strategic, defeated pokemon can still deal damage
- **Type weakness system**: Makes team composition matter, not just total power
- **Deterministic results**: Same teams always produce same outcome
- **Weakness stored in DB**: Can be updated without code changes

---

## Frontend Architecture

### Components
- **PokemonListComponent** - Display all pokemons
- **PokemonEditComponent** - Edit pokemon stats
- **TeamsListComponent** - View teams with members and power
- **TeamCreateComponent** - Create team of 6 pokemons
- **BattleComponent** - Simulate and display battles

### Features
- **State Management** - Angular Signals for reactive state
- **Http Client** - Centralized API service
- **Responsive Design** - Works on desktop and tablet
- **Animations** - Floating pokemon, health bars, battle effects

---

## Technologies

- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Frontend**: Angular 21, TypeScript, RxJS, CSS3
- **Database**: Supabase


## Database

SQL scripts are located in `/db`

- `schema_team.sql`  
  Creates team and team_pokemon tables

- `functions_team.sql`  
  PostgreSQL functions for inserting teams and listing teams by power (Requirement 5)
