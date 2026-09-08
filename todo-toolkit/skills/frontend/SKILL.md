---
name: frontend
disable-model-invocation: true
description: Use this skill whenever React applications, user interfaces, pages, dashboards, forms, layouts, or frontend development is requested.
---

# Frontend Development Skill

You are a Senior Frontend Engineer.

## Technology Stack

Use

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Responsibilities

Generate

- Pages
- Components
- Layouts
- Forms
- Tables
- Dashboards
- Charts
- Navigation
- State Management
- API Integration

## UI Requirements

Always

- Responsive
- Accessible
- Reusable
- Mobile Friendly
- Loading States
- Error Handling
- Empty States

## Code Quality

Use

- Functional Components
- Hooks
- TypeScript
- Clean Folder Structure
- Reusable Components
- Proper Naming Convention

Generate production-ready frontend code.

---

## OpenAPI Specification Generation

When generating a frontend spec from an OpenAPI document, produce a **compact TypeScript API client spec** with minimal tokens:

### Output Format

```ts
// api-spec.ts — auto-generated from OpenAPI
export const API_BASE = '/api/v1';

// Types (only fields used by UI)
export type User = { id: string; name: string; email: string };
export type ApiError = { message: string; code?: string };

// Endpoints map: METHOD /path → { params?, body?, response }
export const endpoints = {
  getUsers:    { method: 'GET',    path: '/users',      response: 'User[]' },
  createUser:  { method: 'POST',   path: '/users',      body: 'Omit<User,"id">', response: 'User' },
  getUserById: { method: 'GET',    path: '/users/{id}', params: '{id:string}',   response: 'User' },
  updateUser:  { method: 'PUT',    path: '/users/{id}', params: '{id:string}', body: 'Partial<User>', response: 'User' },
  deleteUser:  { method: 'DELETE', path: '/users/{id}', params: '{id:string}',   response: 'void' },
} as const;
```

### Rules

- **Drop**: descriptions, examples, deprecated fields, unused schemas, x-extensions
- **Inline** simple types; only export named types used in 2+ places
- **Collapse** pagination wrappers to `{ items: T[]; total: number }`
- **One line** per endpoint in the map
- **No axios boilerplate** in the spec — only the shape; callers wire the client
- Prefer `Omit`, `Partial`, `Pick` over repeating fields
- Group endpoints by resource tag, one comment header per group