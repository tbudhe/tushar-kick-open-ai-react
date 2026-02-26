# Architecture Overview

## Runtime Model

This project runs as a single Node.js service in production:

- Express API + static file hosting from the same process
- Frontend built with Vite and served from `dist/build`
- Server entrypoint at repository root: `server.ts`

Production port is controlled by `PORT` (default `3000`).

---

## Code Layout

```text
.
├── server.ts                    # Startup orchestration
├── backend/
│   ├── openapi/swagger.json     # Generated OpenAPI contract
│   └── src/
│       ├── app.ts               # Express app wiring
│       ├── config/              # DB + environment configuration
│       ├── controllers/         # HTTP controllers
│       ├── routes/              # Express routers
│       ├── services/            # Business logic + parsers
│       ├── middlewares/         # Upload/error middleware
│       ├── helpers/             # Shared response helpers
│       └── contracts/           # TSOA contract source
└── frontend/
    ├── index.html               # Vite entry HTML
    ├── public/                  # Static assets
    └── src/                     # React application
```

---

## Request Flow

### 1) UI + API in Production (Single Port)

1. Browser requests `http://host:3000/`
2. Express serves static frontend from `dist/build`
3. Frontend calls `/api/*` on same origin
4. API response returns from backend controllers/services

### 2) Resume Parsing Flow

`POST /api/parse-resume`

Supported inputs:
- JSON body (`resumeText`, optional `fileName`)
- Multipart form (`resumeFile`, optional `resumeText`)

Extraction path:
- `.txt/.md/.json/.rtf` → UTF-8 decode
- `.pdf` → `pdf-parse`
- `.docx` → `mammoth`
- `.doc` → guidance error (convert to `.docx`)

Parsing strategy:
- Claude API (when API key is available and valid)
- Fallback parser (deterministic extraction)

---

## API Contract and Docs

OpenAPI contract is generated via TSOA:

- Generate: `npm run build:contract`
- Contract file: `backend/openapi/swagger.json`
- JSON endpoint: `/api/openapi.json`
- Swagger UI: `/api/docs/`

---

## Deployment

Primary target: Railway using Docker.

Required variables:
- `DATABASE_URL` (or `MONGODB_URI` / `MONGO_URI`)
- `NODE_ENV=production`
- Optional AI keys (e.g. `ANTHROPIC_API_KEY`)

Health endpoints:
- `/health`
- `/heartbeat`
- `/api/health`
