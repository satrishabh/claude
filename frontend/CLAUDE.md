# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in the `frontend/` directory.

## Setup

```bash
npm install
```

## Commands

```bash
# Dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Architecture

React app under `src/`:

- **`api/`** — thin wrappers around `fetch`/`axios` calls to the FastAPI backend; one file per resource
- **`components/`** — reusable UI components
- **`pages/`** — top-level route views that compose components and call API functions
- **`App.tsx`** — router setup (React Router)

The backend URL is configured via `VITE_API_URL` in `.env`. All state management lives in pages; components are kept stateless where possible.
