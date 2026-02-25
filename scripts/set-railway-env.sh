#!/usr/bin/env bash
set -euo pipefail

if [ -z "${RAILWAY_API_KEY:-}" ] || [ -z "${DATABASE_URL:-}" ] || [ -z "${RAILWAY_PROJECT_ID:-}" ] || [ -z "${RAILWAY_ENVIRONMENT:-}" ]; then
  echo "Required env vars: RAILWAY_API_KEY, DATABASE_URL, RAILWAY_PROJECT_ID, RAILWAY_ENVIRONMENT"
  exit 1
fi

echo "Installing Railway CLI..."
npm install -g @railway/cli@latest

echo "Logging into Railway..."
railway login --apiKey "$RAILWAY_API_KEY"

echo "Selecting project/environment..."
railway use "$RAILWAY_PROJECT_ID" "$RAILWAY_ENVIRONMENT" || true

echo "Setting DATABASE_URL..."
railway variables set DATABASE_URL "$DATABASE_URL" || (
  echo "Fallback: trying 'railway env set'"
  railway env set DATABASE_URL "$DATABASE_URL"
)

echo "Done."
