# Railway Deployment Guide

This guide explains how to deploy the `tushar-kick-open-ai-react` app to Railway.

## Summary

- Build: compile frontend into `dist/build` and compile `server.ts` to `dist/server.js`.
- Start: serve compiled server which serves the static React build.
- Recommended Railway build command and start command are shown below.

## 1) Create Railway Project & Connect GitHub

1. Sign in at https://railway.app and create a new project.
2. Choose "Deploy from GitHub" and select the `tushar-kick-open-ai-react` repository.
3. Allow Railway to access the repository and select the branch you want to deploy (e.g., `main`).

## 2) Railway Build & Start Commands

Set the **Build Command** to:

```bash
npm ci
npm run build
npm run build:server
```

Set the **Start Command** to:

```bash
npm run serve
```

Notes:
- `npm run build` builds the React frontend into `build/`, then moves it to `dist/build/` (see `package.json`).
- `npm run build:server` runs the TypeScript compiler to produce `dist/server.js`.
- `npm run serve` runs the compiled server which serves `dist/build` (static files) and API routes.

## 3) Required Environment Variables (Railway -> Variables)

Add the following variables in Railway's dashboard (keep secrets hidden):

- `DATABASE_URL` → MongoDB Atlas connection string (mongodb+srv://...)
- `CLAUDE_API_KEY` → Anthropic/Claude API key
- `OPENAI_API_KEY` (optional)
- `RAPIDAPI_KEY` and `RAPIDAPI_HOST` (if using RapidAPI for job search)
- `JWT_SECRET` → strong random string
- `NODE_ENV` → `production`
- `PORT` → `3000` (Railway will map an internal port, but keeping 3000 is fine)
- `FRONTEND_URL` → your frontend origin (optional)
- `BACKEND_URL` → backend origin (optional)
- `FEATURE_AUTO_APPLY`, `FEATURE_EMAIL_NOTIFICATIONS`, etc. (feature flags)

Tip: Use values from `.env.example` as a checklist; only paste secrets into Railway variables, never commit them.

## 4) Railway CLI Quick Deploy (optional)

Install Railway CLI and deploy from your machine:

```bash
# Install
npm install -g railway

# Login
railway login

# From repo root
railway init        # link the project (or use `railway link` to link an existing project)
railway up          # builds and deploys current branch
```

## 5) Healthchecks & Tests

After deployment, verify the service is running:

```bash
# Health endpoint
curl https://<your-railway-url>/health
# API menu endpoint
curl https://<your-railway-url>/api/menu
```

If both endpoints return expected responses (e.g., `OK` and the menu JSON), deployment succeeded.

## 6) Troubleshooting

- Build fails: Check Node version (project requires `node >= 20`). Railway provides settings to pin the Node version; ensure it's >=20.
- Missing `dist` files: Ensure build commands run in the repository root and that `npm run build && npm run build:server` completes without errors.
- MongoDB connection errors: Confirm `DATABASE_URL` is correct and IP whitelist in Atlas includes Railway (or set whitelist to `0.0.0.0/0` during testing).
- Port errors: The server reads `process.env.PORT` — Railway sets a mapped port; keep `PORT` env var or let Railway set it.

## 7) Post-Deploy Recommendations

- Enable auto-deploy on push for your main branch.
- Add monitoring (Sentry) and configure `SENTRY_DSN` in Railway variables.
- Add deploy preview or staging branch for testing before production.

## 8) Rollback & Logs

- Use Railway dashboard to view deployment logs and roll back to previous deploys.

## 9) CI Notes

If you use CI (GitHub Actions), make sure the workflow runs `npm ci && npm run build && npm run build:server` before uploading artifacts, or rely on Railway's build step.

### GitHub Actions: build & push Docker image (example)

This repository includes a workflow that builds the Docker image from the repository `Dockerfile` and pushes it to GitHub Container Registry (GHCR):

- Workflow file: `/.github/workflows/docker-build-push.yml`
- Image target: `ghcr.io/<OWNER>/<REPOSITORY>:latest` (the workflow tags `ghcr.io/${{ github.repository }}:latest`)

Secrets and permissions

- The workflow uses the repository `GITHUB_TOKEN` (no additional secret required) but requires the workflow to have `packages: write` permissions. The workflow file already requests that permission.
- If you prefer Docker Hub, create `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repository secrets and update the login step accordingly.

How to use the image with Railway

- Option A — let Railway build from repo: Connect the GitHub repo in Railway and let Railway run the build commands (`npm ci && npm run build && npm run build:server`) as shown in Section 2.
- Option B — deploy the prebuilt image: push to GHCR (via the workflow) and in Railway create a new service from a container image using the image URL `ghcr.io/<OWNER>/<REPOSITORY>:latest`. For private GHCR images you may need to provide registry credentials.

Quick local test (build & push to GHCR)

```bash
# Build locally
docker build -t ghcr.io/<OWNER>/<REPOSITORY>:latest .
# Push (requires `docker login ghcr.io` with a PAT or use the workflow)
docker push ghcr.io/<OWNER>/<REPOSITORY>:latest
```

---

Save this file and commit to the repo so others can follow the same steps.
