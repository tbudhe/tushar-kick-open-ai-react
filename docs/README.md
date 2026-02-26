# Project Documentation

This folder is the source of truth for architecture, deployment, and day-by-day progress.

## Core Docs

- [Architecture](ARCHITECTURE.md)
- [Railway Deployment](RAILWAY_DEPLOYMENT.md)
- [Project Plan](PROJECT_PLAN.md)
- [CSS Design System](CSS_DESIGN_SYSTEM.md)

## Progress Docs

- [Day 1 Completion](DAY1_COMPLETION.md)
- [Day 1 Verification](DAY1_VERIFICATION.md)
- [Day 2 Completion](DAY2_COMPLETION.md)

## Current Runtime Snapshot

- Frontend build tool: Vite (`frontend/src`)
- Backend API: Express + TypeScript (`backend/src`)
- Server entrypoint: `server.ts` (root)
- Deployment mode: Single-port Node server on `PORT` (default `3000`)
- API Docs: Swagger UI at `/api/docs/`

## Recommended Local Commands

```bash
npm install
npm run build
npm start
```

For split-port development (optional):

```bash
npm run dev:full
```
