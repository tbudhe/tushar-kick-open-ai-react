#!/usr/bin/env bash
set -euo pipefail

# Defaults (will be used if not provided in environment)
RAILWAY_PROJECT_NAME_DEFAULT="faithful-imagination"
RAILWAY_PROJECT_ID_DEFAULT="e97b5474-6d9d-4eee-b4be-4e430a050e9b"
RAILWAY_ENVIRONMENT_ID_DEFAULT="786b1e63-7edc-475e-8a46-ce36bd991305"
RAILWAY_SERVICE_ID_DEFAULT="983dae1c-df21-4ed8-a47c-bdb306d33189"
RAILWAY_PUBLIC_DOMAIN_DEFAULT="gen-ai-ik-demo-production-0c69.up.railway.app"

# Pull values from env or fall back to defaults
: "${RAILWAY_API_KEY:=}"
: "${DATABASE_URL:=}"
RAILWAY_PROJECT_NAME="${RAILWAY_PROJECT_NAME:-$RAILWAY_PROJECT_NAME_DEFAULT}"
RAILWAY_PROJECT_ID="${RAILWAY_PROJECT_ID:-$RAILWAY_PROJECT_ID_DEFAULT}"
RAILWAY_ENVIRONMENT="${RAILWAY_ENVIRONMENT:-$RAILWAY_ENVIRONMENT_ID_DEFAULT}"
RAILWAY_SERVICE_ID="${RAILWAY_SERVICE_ID:-$RAILWAY_SERVICE_ID_DEFAULT}"
RAILWAY_PUBLIC_DOMAIN="${RAILWAY_PUBLIC_DOMAIN:-$RAILWAY_PUBLIC_DOMAIN_DEFAULT}"

if [ -z "${RAILWAY_API_KEY:-}" ] || [ -z "${DATABASE_URL:-}" ]; then
  echo "Required env vars: RAILWAY_API_KEY and DATABASE_URL (other values will default)"
  exit 1
fi

echo "Installing Railway CLI..."
npm install -g @railway/cli@latest

echo "Logging into Railway..."
railway login --apiKey "$RAILWAY_API_KEY"

echo "Selecting project/environment..."
echo "Using project: ${RAILWAY_PROJECT_NAME} (${RAILWAY_PROJECT_ID})"
echo "Using environment id: ${RAILWAY_ENVIRONMENT}"
railway use "$RAILWAY_PROJECT_ID" "$RAILWAY_ENVIRONMENT" || true

echo "Setting DATABASE_URL..."
echo "Railway service id (optional): ${RAILWAY_SERVICE_ID}"
railway variables set DATABASE_URL "$DATABASE_URL" || (
  echo "Fallback: trying 'railway env set'"
  railway env set DATABASE_URL "$DATABASE_URL" || true
)

echo "Setting helpful metadata (public domain) as RAILWAY_PUBLIC_DOMAIN (non-secret)"
railway variables set RAILWAY_PUBLIC_DOMAIN "$RAILWAY_PUBLIC_DOMAIN" || true

echo "Done."

echo "Done."
