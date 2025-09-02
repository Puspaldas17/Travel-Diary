# NATPAC Travel Diary (Frontend + Backend)

A modern, mobile-first app to capture trip information for transportation planning. Users record trip number, origin/destination, time, mode, and accompanying travellers with consent. Data is stored locally and can be synced to a server API for NATPAC scientists.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, React Router, TailwindCSS, Radix UI, Lucide Icons, React Query
- Backend: Express (TypeScript) mounted into Vite during dev, standalone server in production
- Validation: Zod

## Project Structure

```
client/                  # Frontend SPA
  components/           # Reusable UI + domain components
  pages/                # Routes (Index.tsx = Home, Trips.tsx)
  lib/                  # Utilities (local storage for trips)
  App.tsx               # App bootstrap + routing + layout

server/                  # Backend API
  routes/               # Express route handlers
    demo.ts             # Example
    trips.ts            # Trips API (CRUD + bulk sync)
  index.ts              # Express app factory
  node-build.ts         # Production server (serves SPA + API)

shared/                  # Shared types between client and server
  api.ts                # Trip/Companion interfaces

index.html               # SPA entry
vite.config.ts           # Vite + Express integration in dev (single port)
vite.config.server.ts    # Server build config
```

## Key Features

- Capture trips with consent, companions, mode, and GPS auto-detect helpers
- Local-first: trips saved to localStorage; attempt server sync immediately
- Trips list with per-trip sync, bulk sync, and delete
- Responsive UI with a fresh teal/blue theme

## API Endpoints

- GET /api/ping — health check
- GET /api/demo — demo endpoint
- GET /api/trips — list stored trips (in-memory store)
- GET /api/trips/:id — get trip
- POST /api/trips — upsert one trip (validated)
- POST /api/trips/bulk — sync multiple trips (validated)
- DELETE /api/trips/:id — delete trip

## Running Locally (VS Code)

1. Prereqs: Node 18+ and pnpm installed (`npm i -g pnpm`).
2. Install deps: `pnpm install`
3. Start dev (single port: frontend + backend): `pnpm dev`
   - Open the preview URL shown by Vite. The API is available under the same origin at `/api`.
4. Typecheck: `pnpm typecheck` | Tests: `pnpm test`

### Production build

- Build: `pnpm build` (outputs SPA to `dist/spa` and server to `dist/server`)
- Run: `pnpm start` (serves the SPA and the API on one port)

## Notes

- Dev: Express is mounted into Vite via a plugin, so the frontend calls `/api/...` without CORS hassles.
- Prod: `server/node-build.ts` serves static SPA and routes `/api/*` to Express.
- Configure env (optional) by setting variables before running (`PING_MESSAGE`, etc.).

## Folder Separation & Connection

- Frontend is under `client/`; backend is under `server/`. They share types in `shared/` via path aliases `@` and `@shared`.
- Frontend uses `fetch('/api/trips')`. In dev, Vite forwards to Express; in prod, Express serves both SPA and API.

## Troubleshooting

- Double root warning in dev: fixed by reusing a single React root (HMR-safe) in `client/App.tsx`.
- If API calls fail in dev, ensure `pnpm dev` is running (Express attaches to Vite).
- If API calls fail in prod, ensure `pnpm build && pnpm start` and check logs.
