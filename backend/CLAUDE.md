# CLAUDE.md — Backend

This file provides guidance to Claude Code when working inside the `backend/` directory. Root-level engineering and code standards are in [`../CLAUDE.md`](../CLAUDE.md).

---

## Setup

```bash
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic alembic pytest ruff bcrypt python-dotenv
```

Copy `.env.example` to `.env` and fill in values before running.

---

## Commands

```bash
# Run API server (development)
uvicorn app.main:app --reload

# Run API server (production)
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Run all tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=term-missing

# Run a specific test
pytest tests/test_tasks.py::test_create_task -v

# Apply all migrations
alembic upgrade head

# Roll back one migration
alembic downgrade -1

# Generate a new migration from model changes
alembic revision --autogenerate -m "add due_date to tasks"

# Lint (check only)
ruff check .

# Lint (auto-fix)
ruff check . --fix

# Format
ruff format .
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py           # App factory, CORS, router registration
│   ├── database.py       # Engine, SessionLocal, get_db dependency
│   ├── config.py         # Pydantic Settings — reads from .env
│   ├── routers/
│   │   ├── auth.py       # POST /auth/register, /login, /logout
│   │   ├── tasks.py      # CRUD + soft-delete + restore for tasks
│   │   ├── subtasks.py   # PATCH/DELETE for subtasks
│   │   └── categories.py # CRUD for categories
│   ├── crud/
│   │   ├── tasks.py
│   │   ├── subtasks.py
│   │   ├── categories.py
│   │   └── users.py
│   ├── models/
│   │   ├── user.py
│   │   ├── task.py       # includes SubTask
│   │   └── category.py
│   ├── schemas/
│   │   ├── task.py       # TaskCreate, TaskUpdate, TaskRead
│   │   ├── subtask.py
│   │   ├── category.py
│   │   └── auth.py       # LoginRequest, TokenResponse
│   └── exceptions.py     # Domain exceptions (TaskNotFound, etc.)
├── tests/
│   ├── conftest.py       # DB fixtures, TestClient
│   ├── crud/
│   └── routers/
├── alembic/
│   └── versions/
├── .env.example
└── pyproject.toml        # ruff config, pytest config
```

---

## Architecture

Strict layered separation — never skip a layer:

```
HTTP Router → CRUD/Service → ORM Model → SQLAlchemy Session → Database
```

1. **Routers** (`app/routers/`) — HTTP only. Parse request, call CRUD, convert ORM → schema, return response. No SQL, no business logic.
2. **CRUD** (`app/crud/`) — All DB reads/writes. Accepts a `Session`, returns ORM objects. Raises domain exceptions (not `HTTPException`).
3. **Models** (`app/models/`) — SQLAlchemy table definitions. Define columns, relationships, and constraints. No methods containing business logic.
4. **Schemas** (`app/schemas/`) — Pydantic v2 models. Enforce request validation and response shape. Never expose raw ORM objects from a router.
5. **Database** (`app/database.py`) — Engine and `get_db` dependency. Routers get a session via `Depends(get_db)`.

---

## Key Conventions

### Sessions
```python
# Always inject — never create manually in a route
@router.get("/tasks/{id}")
def get_task(id: int, db: Session = Depends(get_db)):
    ...
```

### Exception handling
```python
# crud/tasks.py — raise domain exception
def get_task(db: Session, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if task is None:
        raise TaskNotFound(task_id)

# routers/tasks.py — translate to HTTP
@router.get("/{id}", response_model=TaskRead)
def read_task(id: int, db: Session = Depends(get_db)):
    try:
        return crud.tasks.get_task(db, id)
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")
```

### Soft delete
All delete endpoints set `is_deleted=True` and `deleted_at=datetime.utcnow()`. Hard deletes never happen via the API. A purge job cleans records older than 30 days.

### Migrations
Every model change must have a corresponding Alembic migration. Never use `Base.metadata.create_all()` outside of tests.

### Password hashing
Use `bcrypt`. Never store or log plaintext passwords.

---

## Testing

- Use `TestClient` from `starlette.testclient` — not `httpx` directly.
- Tests run against a separate SQLite test database (defined in `conftest.py`).
- Never mock the database — use a real test DB.
- Run `pytest` before every commit; all tests must pass.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLAlchemy connection string, e.g. `sqlite:///./tasks.db` |
| `SECRET_KEY` | Yes | Used for session token signing |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins (default: `http://localhost:5173`) |
| `ENVIRONMENT` | No | `development` or `production` (affects debug output) |
