# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in the `backend/` directory.

## Setup

```bash
pip install fastapi uvicorn sqlalchemy pydantic alembic pytest ruff
```

## Commands

```bash
# Run API server
uvicorn app.main:app --reload

# Run all tests
pytest

# Run a single test
pytest tests/test_todos.py::test_create_todo -v

# Apply migrations
alembic upgrade head

# Generate a new migration
alembic revision --autogenerate -m "description"

# Lint / format
ruff check .
ruff format .
```

## Architecture

Layered FastAPI structure under `app/`:

- **`main.py`** — app instantiation, CORS config, router registration
- **`routers/`** — route handlers per resource (`todos.py`); call CRUD functions and return Pydantic schemas
- **`crud/`** — all database read/write logic; accepts a SQLAlchemy session, returns ORM objects
- **`models/`** — SQLAlchemy ORM table definitions
- **`schemas/`** — Pydantic request/response models (separate from ORM models)
- **`database.py`** — engine, `SessionLocal`, and `get_db` FastAPI dependency

Routers inject a DB session via `Depends(get_db)`. CRUD functions are the only layer that touches the ORM; routers convert ORM objects to Pydantic schemas before returning.
