# Database Setup Guide

This project uses **SQLAlchemy** with **Alembic** for database migrations. The schema is version-controlled and can be applied to your Supabase PostgreSQL database.

## Schema Overview

The database includes these tables:

- `agent_runs` - Stores agent execution requests and their status
- `security_evaluations` - Security analysis results for agent actions
- `proposed_actions` - Individual actions proposed by the agent
- `audit_logs` - Audit trail for all operations

## Setup Instructions

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure DATABASE_URL

Your `.env` file should have the Supabase connection string with URL-encoded password:

```env
DATABASE_URL=postgresql://postgres:JKNj*(4h%23h%25%5Eh%26@db.yqbuwydvkodptfixjxdh.supabase.co:5432/postgres
```

**Note:** Special characters in passwords must be URL-encoded:
- `#` → `%23`
- `%` → `%25`
- `^` → `%5E`
- `&` → `%26`

### 3. Create initial migration

```bash
cd backend
alembic revision --autogenerate -m "Initial schema"
```

### 4. Apply migrations to database

```bash
alembic upgrade head
```

### 5. Verify tables were created

Connect to your Supabase database using the SQL Editor or `psql` and run:

```sql
\dt
```

You should see: `agent_runs`, `security_evaluations`, `proposed_actions`, `audit_logs`

## Common Commands

```bash
# Create a new migration after changing models
alembic revision --autogenerate -m "description of change"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current migration version
alembic current

# Show migration history
alembic history
```

## Security Notes

1. **Never commit `.env`** - It contains your database password
2. Use the **anon key** for frontend Supabase client
3. Use the **service role key** only in backend if you need full admin access
4. Connection pooling is configured in `app/db/session.py` (pool_size=5, max_overflow=10)
5. All timestamps use UTC timezone

## Testing the Connection

Run this Python script to test:

```python
from app.db.session import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT version();"))
    print(result.fetchone())
```
