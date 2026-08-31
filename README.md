# Polar Nexus

Smart India Hackathon 2026 prototype. A full-stack portal that unifies polar datasets,
publications, scientists, expeditions, research stations and environmental events, with
role-based access, an admin approval workflow for researchers and nightly automated data
synchronisation from public science APIs.

Everything runs **natively** — no Docker required.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router), React 18, TypeScript, TailwindCSS 3.4, Radix UI / shadcn-style components, Framer Motion |
| State & forms | Zustand, TanStack React Query, React Hook Form, Zod |
| Maps | Leaflet + React-Leaflet with MapTiler tiles (coloured polar regions, no pin markers) |
| 3D | Three.js + React Three Fiber (`@react-three/drei`) |
| Charts | Chart.js (`react-chartjs-2`) + Recharts |
| Backend | FastAPI 0.109, Python 3.11, Uvicorn, Pydantic v2 |
| Auth | OAuth2 password flow, JWT access/refresh tokens, bcrypt (passlib), python-jose |
| Background jobs | Celery + Redis, APScheduler (in-process daily job) |
| Database | PostgreSQL 15, SQLAlchemy 2.0 (async via asyncpg), Alembic |
| External APIs | NSIDC, NOAA, ORCID, Crossref, Semantic Scholar |

## Project structure

```text
polar-nexus/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    auth, users, datasets, publications, scientists,
│   │   │                        expeditions, stations, events, dashboard, ai_assistant
│   │   ├── core/                config, database, security, deps, celery_app, pagination
│   │   ├── models/              user.py, science.py (datasets, publications, stations, …)
│   │   ├── schemas/             Pydantic v2 request/response models
│   │   ├── services/            auth_service, daily_update_service, ai_assistant_service
│   │   ├── tasks/               daily_updates.py, data_sync.py (Celery tasks)
│   │   └── main.py              FastAPI app, CORS, APScheduler bootstrap
│   ├── alembic/                 migration environment
│   ├── scripts/                 seed_admin.py, seed_data.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/                     App Router: landing, (auth), (dashboard)
│   ├── components/              ui/, layout/, charts/, maps/, three/
│   ├── lib/                     api.ts, auth.ts, types.ts, utils.ts
│   ├── store/useAuthStore.ts
│   └── package.json
├── database/init.sql            full PostgreSQL schema + enums + indexes
├── .env.example
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15 running on `localhost:5432`
- Redis 7 running on `localhost:6379`

## Quick start (native)

### 1. Database

```bash
createdb polar_nexus
psql -d polar_nexus -f database/init.sql
```

### 2. Backend (terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate           # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # then edit DB_PASSWORD, SECRET_KEY, ADMIN_PASSWORD
uvicorn app.main:app --reload --port 8000
```

### 3. Celery worker (terminal 2)

```bash
cd backend && source venv/bin/activate
celery -A app.core.celery_app worker --loglevel=info
```

Optional beat scheduler (daily 02:30 UTC refresh + hourly station readings):

```bash
celery -A app.core.celery_app beat --loglevel=info
```

APScheduler also runs the daily job inside the API process when `ENABLE_SCHEDULER=true`,
so Celery beat is optional for a local demo.

### 4. Seed data (terminal 3)

```bash
cd backend && source venv/bin/activate
python scripts/seed_admin.py       # creates the administrator account from .env
python scripts/seed_data.py        # demo users, stations, datasets, papers, 365 days of sea ice
```

### 5. Frontend (terminal 4)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

### 6. Open

- App: http://localhost:3000
- API docs (Swagger): http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Accounts

The administrator is created by `scripts/seed_admin.py` from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
in `backend/.env`. `scripts/seed_data.py` additionally creates demo `researcher@…`,
`educator@…` and `public@…` accounts — see the script output for their credentials.
Change every password before any public deployment.

## Roles and access control

| Role | Access |
| --- | --- |
| `public` | Public datasets, map, publications, scientists, expeditions, assistant |
| `educator` | Everything above plus educator-level datasets |
| `researcher` | Full dataset access, dataset/expedition/event creation |
| `admin` | User management, researcher approvals, manual sync triggers, deletions |

Signing up as a researcher does **not** grant researcher access: it files a
`researcher_application` that an administrator approves or rejects from
`/dashboard/admin`. Approval promotes the user's role and marks them verified.

## Daily automated updates

`app/services/daily_update_service.py` runs four steps and records each one in
`daily_update_logs`:

1. `sync_sea_ice` — Arctic/Antarctic sea ice extent observations (NSIDC-derived; falls back
   to a deterministic seasonal model when the network is unavailable so demos always work).
2. `sync_publications` — recent polar papers from Crossref (Semantic Scholar/ORCID supported
   through the same configuration).
3. `refresh_stations` — station temperature/wind readings.
4. `detect_events` — flags anomalies in the observation series as environmental events.

Trigger it manually from the admin console or with:

```bash
curl -X POST http://localhost:8000/api/v1/dashboard/trigger-daily-update \
  -H "Authorization: Bearer <admin token>"
```

## API surface

`/api/v1` — `auth`, `users`, `datasets`, `publications`, `scientists`, `expeditions`,
`stations` (including `/stations/map-config` and `/stations/region-summary`), `events`,
`dashboard`, `ai-assistant`. Full interactive documentation at `/docs`.

## Maps and 3D

- `/stations/map-config` returns MapTiler basemap/satellite tile URLs plus region colours,
  so the API key stays configurable server-side.
- The map renders polar regions as coloured polygons (Arctic, Antarctic, Third Pole,
  Southern Ocean) with station circles instead of pin markers.
- The landing page renders a Three.js / React Three Fiber polar globe with an animated
  wireframe shell and starfield.

## Data assistant

`/api/v1/ai-assistant/ask` answers questions by querying PostgreSQL directly (sea ice trends,
dataset/publication counts, expeditions, events, scientists, stations). It is deterministic
and needs no external LLM key.
