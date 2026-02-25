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
# Try non-interactive login methods supported by different CLI versions.
# Attempt --apiKey, then --token, then fall back to interactive login.
if [ -n "${RAILWAY_API_KEY:-}" ]; then
  if railway login --apiKey "$RAILWAY_API_KEY" 2>/dev/null; then
    echo "Logged in with --apiKey"
  elif railway login --token "$RAILWAY_API_KEY" 2>/dev/null; then
    echo "Logged in with --token"
  else
    echo "Non-interactive login failed; attempting interactive login..."
    railway login || true
  fi
else
  railway login || true
fi

echo "Selecting project/environment..."
echo "Using project: ${RAILWAY_PROJECT_NAME} (${RAILWAY_PROJECT_ID})"
echo "Using environment id: ${RAILWAY_ENVIRONMENT}"
railway use "$RAILWAY_PROJECT_ID" "$RAILWAY_ENVIRONMENT" || true

echo "Setting DATABASE_URL..."
echo "Railway service id (optional): ${RAILWAY_SERVICE_ID}"
set_var_with_variants() {
  local key="$1"; shift
  local value="$1"; shift

  local cmds=(
    "railway variables set \"$key\" \"$value\""
    "railway variables:set \"$key\" \"$value\""
    "railway env set \"$key\" \"$value\""
    "railway env variables set \"$key\" \"$value\""
    "railway environment variables set \"$key\" \"$value\""
    "railway environment variable set \"$key\" \"$value\""
    "railway variables add \"$key\" \"$value\""
    "railway variable set \"$key\" \"$value\""
  )

  for c in "${cmds[@]}"; do
    echo "Trying: $c"
    if bash -c "$c" >/tmp/railway-cmd.out 2>/tmp/railway-cmd.err; then
      echo "Success: $c"
      return 0
    else
      echo "Failed: $c"
      sed -n '1,200p' /tmp/railway-cmd.err
    fi
  done

  echo "All CLI variants failed for setting $key"
  return 1
}

if set_var_with_variants "DATABASE_URL" "$DATABASE_URL"; then
  echo "DATABASE_URL set successfully"
else
  echo "Could not set DATABASE_URL via Railway CLI variants"
fi

echo "Setting helpful metadata (public domain) as RAILWAY_PUBLIC_DOMAIN (non-secret)"
if set_var_with_variants "RAILWAY_PUBLIC_DOMAIN" "$RAILWAY_PUBLIC_DOMAIN"; then
  echo "RAILWAY_PUBLIC_DOMAIN set successfully"
else
  echo "Could not set RAILWAY_PUBLIC_DOMAIN via Railway CLI variants"
fi

echo "Done."

