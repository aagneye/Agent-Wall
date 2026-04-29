# Agent Firewall

Agent Firewall is an AI security layer for autonomous Web3 agents with wallet access.

This repository is a production-grade MVP foundation only. Core business logic is intentionally not implemented yet.

## Tech Stack

- Frontend: Next.js, TypeScript, TailwindCSS, RainbowKit, Wagmi
- Backend: FastAPI, Python
- Database: Supabase
- Deployment: Vercel (frontend), Railway (backend)

## Repository Layout

```text
.
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- hooks/
|   |-- lib/
|   |   |-- api/
|   |   `-- wallet/
|   `-- utils/
|-- backend/
|   `-- app/
|       |-- agents/
|       |-- api/
|       |-- config/
|       |-- db/
|       |-- models/
|       |-- schemas/
|       `-- services/
|-- .env.example
|-- vercel.json
`-- railway.toml
```

## Getting Started

### 1) Clone and configure environment

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### 3) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000`.

## Quality Checks

Frontend:

```bash
npm --prefix frontend run lint
npm --prefix frontend run typecheck
```

Backend:

```bash
cd backend
ruff check .
mypy app
```

## Deployment

- Vercel config is defined in `vercel.json`
- Railway config is defined in `railway.toml`
