# Railway Deployment Guide (Validated)

This is the validated deployment process for `tushar-kick-open-ai-react` on Railway.

## 1) Service Setup

1. Create project in Railway and connect GitHub repo (`main` branch).
2. Railway detects `Dockerfile` automatically and builds from repository root.
3. Keep healthcheck path as `/heartbeat`.

## 2) Build and Start Behavior

Current Dockerfile already performs:

- Frontend build: `npm run build` (outputs to `dist/`)
- Server compile: `npx tsc` (outputs `dist/server.js`)
- Runtime command: `node dist/server.js`

No custom Start Command is required when using Docker deployment.

## 3) Required Variables

Set these in Railway service variables:

- `DATABASE_URL` (MongoDB Atlas URI)
- `NODE_ENV=production`
- App secrets used by features (`JWT_SECRET`, API keys, etc.)

Supported DB keys in code:

- `DATABASE_URL` (preferred)
- `MONGODB_URI`
- `MONGO_URI`

## 4) Validation Checks

After deployment, verify:

```bash
curl https://<railway-domain>/health
curl https://<railway-domain>/heartbeat
curl https://<railway-domain>/api/health
curl https://<railway-domain>/api/menu
```

Expected:

- `/health` returns `OK`
- `/heartbeat` returns JSON status
- `/api/health` returns healthy/degraded JSON

## 5) Known Failure Modes (and Fixes)

### A) `Missing MongoDB connection string`

Cause: DB variable not available in running service/environment.

Fix:

1. Set `DATABASE_URL` for the correct service/environment.
2. Redeploy service.
3. Confirm with Railway CLI:

```bash
railway run sh -lc 'env | grep -E "^(DATABASE_URL|MONGODB_URI|MONGO_URI)="'
```

### B) `bad auth : authentication failed`

Cause: wrong MongoDB user/password in URI.

Fix:

1. Rotate Atlas password.
2. Update Railway variable value.
3. Redeploy and retest.

### C) Blank page with runtime JS error

Cause fixed in commit history (`Home.tsx` self-import issue).

Fix: ensure deployment uses latest `main` commit.

## 6) Railway CLI Helpers

Useful commands:

```bash
railway status
railway variable list
railway deployment list
railway logs --latest --lines 200
railway deployment redeploy --service <service-id>
```

## 7) Day-1 Final State

- Production deployment is working.
- Database connectivity from Railway is verified.
- Healthcheck and static app serving are operational.
