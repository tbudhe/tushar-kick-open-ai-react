# Project Documentation

This folder is the source of truth for architecture, deployment, and day-by-day progress.

## Core Docs

- [Architecture](ARCHITECTURE.md)
- [Deployment & Infrastructure Plan](DEPLOYMENT_INFRASTRUCTURE.md)
- [Project Plan](PROJECT_PLAN.md)
- [CSS Design System](CSS_DESIGN_SYSTEM.md)

## Progress Docs

- [Day 1 Completion](DAY1_COMPLETION.md)
- [Day 1 Verification](DAY1_VERIFICATION.md)
- [Day 2 Completion](DAY2_COMPLETION.md)
- [Day 2 Verification](DAY2_VERIFICATION.md)
- [Day 3 Completion](DAY3_COMPLETION.md)
- [Day 3 Verification](DAY3_VERIFICATION.md)
- [Day 4 Completion](DAY4_COMPLETION.md)
- [Day 4 Verification](DAY4_VERIFICATION.md)
- [Day 5 Completion](DAY5_COMPLETION.md)
- [Day 5 Verification](DAY5_VERIFICATION.md)
- [Day 7 Completion](DAY7_COMPLETION.md)
- [Day 7 Verification](DAY7_VERIFICATION.md)

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

## Real-Time Production Run (Local)

Use this to run exactly like hosted mode:

```bash
npm run build
NODE_ENV=production PORT=3000 npm start
```

Then validate:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/health
curl -i http://localhost:3000/api/does-not-exist
```

Expected API fallback behavior:
- Unknown API routes return JSON `404` (`{"error":"Route not found"}`)
- Frontend SPA routes still return `index.html`
