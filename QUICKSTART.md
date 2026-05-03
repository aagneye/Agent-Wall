# Agent Firewall - Quick Start Guide

## Your Database Connection

Your `.env` is already configured with your Supabase credentials:

```env
SUPABASE_URL=https://yqbuwydvkodptfixjxdh.supabase.co
DATABASE_URL=postgresql://postgres:JKNj*(4h%23h%25%5Eh%26@db.yqbuwydvkodptfixjxdh.supabase.co:5432/postgres
```

**Password (raw):** `JKNj*(4h#h%^h&`  
**Password (URL-encoded in DATABASE_URL):** `JKNj*(4h%23h%25%5Eh%26`

---

## 1. Install Backend Dependencies

```powershell
cd "C:\Projects\Agnet Wall\backend"
& "C:\Users\aagne\AppData\Local\Programs\Python\Python310\python.exe" -m pip install -r requirements.txt
```

---

## 2. Create Database Schema

Choose one method:

### Option A: Using Alembic (Recommended for production)

```powershell
cd "C:\Projects\Agnet Wall\backend"

# Ensure Alembic is installed in this venv (creates alembic.exe under Scripts\)
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt

# Migrations (use module form; reliable on all shells)
& ".\.venv\Scripts\python.exe" -m alembic revision --autogenerate -m "Initial schema"
& ".\.venv\Scripts\python.exe" -m alembic upgrade head
```

### Option B: Direct creation (Quick for development)

```powershell
cd "C:\Projects\Agnet Wall\backend"
& ".\.venv\Scripts\python.exe" scripts/init_db.py
```

---

## 3. Verify Database

Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/yqbuwydvkodptfixjxdh/sql/new) and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `agent_runs`
- `security_evaluations`
- `proposed_actions`
- `audit_logs`

---

## 4. Run Backend

```powershell
cd "C:\Projects\Agnet Wall\backend"
& ".\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

---

## 5. Run Frontend

In a **separate terminal**:

```powershell
cd "C:\Projects\Agnet Wall"
npm run dev:frontend
```

Frontend: **http://localhost:3000**

---

## Schema Summary

### `agent_runs`
Stores every agent execution request and its status.

**Columns:**
- `id` (PK, auto-increment)
- `run_id` (unique string identifier)
- `prompt` (user input)
- `wallet_address` (optional)
- `status` (pending/running/completed/failed)
- `created_at`, `updated_at`

### `security_evaluations`
Security analysis results for agent actions.

**Columns:**
- `id` (PK)
- `run_id` (FK to agent_runs)
- `wallet_address`
- `risk_score` (0-100)
- `risk_explanation`
- `approval_recommendation` (approve/needs_human_review/reject)
- `risk_findings` (JSON)
- `policy_findings` (JSON)
- `deterministic` (boolean)
- `created_at`

### `proposed_actions`
Individual actions proposed by the agent.

**Columns:**
- `id` (PK)
- `evaluation_id` (FK to security_evaluations)
- `action_id`, `action_type`, `protocol`
- `contract_address`, `target_address`
- `token_symbol`, `amount_usd`
- `approval_amount_usd`, `approval_scope`
- `approval_expires_in_minutes`
- `wallet_balance_usd`
- `created_at`

### `audit_logs`
Audit trail for all operations.

**Columns:**
- `id` (PK)
- `run_id`
- `event_type` (indexed)
- `wallet_address` (optional, indexed)
- `description`
- `metadata` (JSON, optional)
- `created_at` (indexed)

---

## Troubleshooting

### Python not found
Use the full path:
```powershell
& "C:\Users\aagne\AppData\Local\Programs\Python\Python310\python.exe"
```

### Database connection fails
1. Check that special characters in `.env` DATABASE_URL are URL-encoded
2. Test connection from Supabase dashboard
3. Ensure your IP is allowed in Supabase Network Restrictions

### CORS errors
Ensure `BACKEND_CORS_ORIGINS=http://localhost:3000` is set in `backend/.env`

---

## Security Notes

- ✅ `.env` is in `.gitignore` (never commit it)
- ✅ Use `SUPABASE_ANON_KEY` for frontend
- ✅ Database password is URL-encoded in connection string
- ✅ All timestamps use UTC
- ✅ Connection pooling configured (pool_size=5, max_overflow=10)
