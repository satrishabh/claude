# CLAUDE.md — Frontend

This file provides guidance to Claude Code when working inside the `frontend/` directory. Root-level engineering and code standards are in [`../CLAUDE.md`](../CLAUDE.md).

---

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set `VITE_API_URL` before running.

---

## Commands

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Type-check (no emit)
npx tsc --noEmit

# Run tests (watch mode)
npm test

# Run tests (CI / single pass)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npx prettier --write src/

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx               # React Router setup, global providers
│   ├── main.tsx              # ReactDOM.createRoot entry point
│   ├── api/
│   │   ├── client.ts         # Base fetch wrapper (base URL, error handling, auth header)
│   │   ├── tasks.ts          # Task CRUD + soft-delete + restore
│   │   ├── subtasks.ts
│   │   ├── categories.ts
│   │   └── auth.ts
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main task list with deadline grouping
│   │   ├── TaskDetail.tsx    # Single task view + subtasks
│   │   ├── Trash.tsx         # Soft-deleted tasks + restore
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── components/
│   │   ├── TaskCard.tsx
│   │   ├── SubtaskList.tsx
│   │   ├── CategoryBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── StatusSelect.tsx
│   │   └── ui/               # Generic: Button, Input, Modal, Spinner, etc.
│   ├── hooks/
│   │   ├── useTasks.ts       # Fetch + mutation hooks wrapping api/tasks.ts
│   │   └── useAuth.ts
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types mirroring backend schemas
│   └── utils/
│       ├── dates.ts          # Due date formatting, overdue detection
│       └── sorting.ts        # Dashboard group + sort logic
├── .env.example
├── tsconfig.json             # strict: true
├── vite.config.ts
└── package.json
```

---

## Architecture

Strict separation of concerns across four layers:

```
Page (state + layout)
  └── Component (pure render)
  └── Hook (async state bridge)
       └── API module (HTTP)
            └── FastAPI backend
```

| Layer | Owns | Must not |
|---|---|---|
| `api/` | HTTP calls, request/response serialisation | Render anything, hold state |
| `hooks/` | Loading/error/data state, refetch logic | Make fetch calls directly, render JSX |
| `pages/` | Route-level state, compose layout | Contain business logic, call `fetch` directly |
| `components/` | Render props, fire callbacks | Call API, manage async state |

---

## Key Conventions

### API calls
All HTTP goes through `src/api/client.ts`. Never call `fetch()` directly in a component or page.

```ts
// api/tasks.ts
export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  return client.get('/tasks', { params: filters });
}

// hooks/useTasks.ts
export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ...
}
```

### Four UI states — always handle all four
```tsx
if (loading) return <Spinner />;
if (error)   return <ErrorMessage message={error} onRetry={refetch} />;
if (!tasks.length) return <EmptyState />;
return <TaskList tasks={tasks} />;
```

### TypeScript
- `strict: true` enforced.
- No `any`. Use `unknown` at API boundaries and narrow with type guards.
- Types in `src/types/index.ts` mirror the Pydantic schemas exactly.
- Props interfaces named `{ComponentName}Props`.

### Forms
- Validate on submit (not on every keystroke unless UX requires it).
- Show field-level errors returned from the API, not just frontend validation errors.
- Disable the submit button while a request is in flight.
- Clear form state on successful submission.

### Status transitions
Transitioning a task back from Done or Cancelled to an active state must show a confirmation dialog before calling the API.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL, e.g. `http://localhost:8000` |

All variables must be prefixed with `VITE_` to be exposed to the browser. Never put secrets here.

---

## Testing

- Test files co-located with source: `Dashboard.tsx` → `Dashboard.test.tsx`.
- Use Vitest + Testing Library.
- Query by role, label, or text — never by CSS class or test ID unless unavoidable.
- Test user behaviour: what a user sees and does, not internal component state.
- Mock API modules (`vi.mock('../api/tasks')`) — do not make real HTTP calls in unit tests.
- Run `npm run test:run` before every commit; all tests must pass.
