# Architecture — Task Management Application

## 1. System Overview

A full-stack task management web application. Users can create tasks with sub-tasks, categories, priorities, and due dates. The system enforces authentication and provides deadline-aware dashboard views.

**Tech stack:** FastAPI (Python) · SQLAlchemy + Alembic · Pydantic v2 · React (TypeScript) · Vite · React Router

---

## 2. High-Level Architecture

```mermaid
graph TB
    subgraph Browser
        UI[React SPA]
    end

    subgraph Backend["Backend (FastAPI / Uvicorn)"]
        Router[Routers]
        CRUD[CRUD Layer]
        Models[ORM Models]
        Schemas[Pydantic Schemas]
    end

    subgraph DB["Database (SQLite / PostgreSQL)"]
        Tables[(Tables)]
    end

    UI -->|"REST JSON (VITE_API_URL)"| Router
    Router --> Schemas
    Router --> CRUD
    CRUD --> Models
    Models --> Tables
```

---

## 3. Backend Layer Diagram

```mermaid
graph LR
    Client -->|HTTP Request| Router["app/routers/"]
    Router -->|"Depends(get_db)"| DB_Dep["app/database.py\nget_db"]
    Router --> CRUD["app/crud/"]
    CRUD --> ORM["app/models/"]
    ORM --> DB[(Database)]
    Router --> Pydantic["app/schemas/\n(response serialisation)"]
    Pydantic -->|JSON| Client
```

### Layer responsibilities

| Layer | Path | Responsibility |
|---|---|---|
| Routers | `app/routers/` | HTTP verbs, request parsing, dependency injection, response shape |
| CRUD | `app/crud/` | All DB read/write; only layer touching the ORM session |
| Models | `app/models/` | SQLAlchemy table definitions, relationships |
| Schemas | `app/schemas/` | Pydantic v2 request/response models, validation rules |
| Database | `app/database.py` | Engine, `SessionLocal`, `get_db` FastAPI dependency |
| Entry point | `app/main.py` | App instantiation, CORS config, router registration |

---

## 4. Frontend Layer Diagram

```mermaid
graph LR
    Router["React Router\nApp.tsx"] --> Pages["src/pages/\n(route views)"]
    Pages --> Components["src/components/\n(reusable UI)"]
    Pages --> API["src/api/\n(fetch wrappers)"]
    API -->|"fetch / axios"| FastAPI["FastAPI Backend"]
```

### Layer responsibilities

| Layer | Path | Responsibility |
|---|---|---|
| App shell | `src/App.tsx` | React Router setup, global providers |
| Pages | `src/pages/` | Route-level views; owns local and server state |
| Components | `src/components/` | Stateless, reusable UI primitives |
| API client | `src/api/` | Thin typed wrappers around HTTP calls; one file per resource |

---

## 5. Domain Model

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string hashed_password
        string session_token
        bool notification_enabled
        datetime created_at
    }

    CATEGORY {
        int id PK
        string name
        int user_id FK
    }

    TASK {
        int id PK
        string title
        string description
        date due_date
        enum priority "High|Medium|Low"
        enum status "Pending|InProgress|Done|Cancelled"
        int category_id FK
        int user_id FK
        datetime completed_at
        bool is_deleted
        datetime deleted_at
        datetime created_at
        datetime updated_at
    }

    SUBTASK {
        int id PK
        string title
        enum status "Done|NotDone"
        int task_id FK
    }

    USER ||--o{ CATEGORY : owns
    USER ||--o{ TASK : owns
    CATEGORY ||--o{ TASK : groups
    TASK ||--o{ SUBTASK : contains
```

---

## 6. API Endpoints

```mermaid
graph LR
    subgraph Auth["/api/v1/auth"]
        A1["POST /register"]
        A2["POST /login"]
        A3["POST /logout"]
    end

    subgraph Tasks["/api/v1/tasks"]
        T1["GET / — list with filters"]
        T2["POST / — create"]
        T3["GET /{id}"]
        T4["PATCH /{id}"]
        T5["DELETE /{id} — soft delete"]
        T6["POST /{id}/restore"]
        T7["GET /{id}/subtasks"]
        T8["POST /{id}/subtasks"]
    end

    subgraph Subtasks["/api/v1/subtasks"]
        S1["PATCH /{id}"]
        S2["DELETE /{id}"]
    end

    subgraph Categories["/api/v1/categories"]
        C1["GET /"]
        C2["POST /"]
        C3["PATCH /{id}"]
        C4["DELETE /{id}"]
    end
```

---

## 7. Task Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending : create
    Pending --> InProgress : start
    Pending --> Cancelled : cancel
    InProgress --> Done : complete
    InProgress --> Cancelled : cancel
    Done --> InProgress : reopen (confirm)
    Cancelled --> Pending : reopen (confirm)
    Done --> [*] : soft-delete
    Cancelled --> [*] : soft-delete
    Pending --> [*] : soft-delete
    InProgress --> [*] : soft-delete
```

> Transitioning back from **Done** or **Cancelled** requires explicit user confirmation.

---

## 8. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API as FastAPI
    participant DB

    User->>Frontend: Enter email + password
    Frontend->>API: POST /auth/login
    API->>DB: Lookup user, verify hash
    DB-->>API: User record
    API-->>Frontend: session_token (HTTP-only cookie)
    Frontend->>API: Subsequent requests (cookie)
    API->>DB: Validate session_token
    DB-->>API: OK
    API-->>Frontend: Protected response
```

---

## 9. Dashboard Sorting Logic

```mermaid
flowchart TD
    Tasks["All active tasks"] --> Overdue{"due_date < today\nAND status ≠ Done/Cancelled"}
    Overdue -->|Yes| G1["Group 1: Overdue"]
    Overdue -->|No| DueToday{"due_date = today"}
    DueToday -->|Yes| G2["Group 2: Due Today"]
    DueToday -->|No| G3["Group 3: Remaining"]

    G1 --> Sort["Sort each group:\nHigh > Medium > Low\nthen due_date ASC"]
    G2 --> Sort
    G3 --> Sort
    Sort --> Render["Rendered dashboard list"]
```

---

## 10. Soft-Delete & Recovery

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant API

    User->>UI: Delete task
    UI->>API: DELETE /tasks/{id}
    API-->>API: Set is_deleted=true, deleted_at=now
    API-->>UI: 204 No Content

    Note over API: Scheduled job: purge tasks where deleted_at < 30 days ago

    User->>UI: View Trash
    UI->>API: GET /tasks?deleted=true
    API-->>UI: Soft-deleted tasks

    User->>UI: Restore task
    UI->>API: POST /tasks/{id}/restore
    API-->>API: Set is_deleted=false, deleted_at=null
    API-->>UI: Restored task
```

---

## 11. Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Session auth vs JWT | Server-managed session token | Safer for browser apps; avoids token-storage XSS risk |
| Soft delete | `is_deleted` + `deleted_at` flags | 30-day recovery requirement; preserves audit trail |
| Category deletion | Tasks become uncategorised (not deleted) | Data preservation; user may re-assign later |
| Parent task deletion | Cascades to sub-tasks (with warning) | Orphaned sub-tasks have no meaning without parent |
| Due date past guard | Block on create, allow on edit | UX: editing an already-overdue task is legitimate |
| Frontend API layer | Isolated `src/api/` wrappers | Components never contain raw `fetch`; easy to mock in tests |
