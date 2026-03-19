#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
SYNC_ALL="${SYNC_ALL:-0}"
SKIP_DEPLOYS="${SKIP_DEPLOYS:-0}"

usage() {
  cat <<'EOF'
Sync local environment variables to the linked Railway service.

Usage:
  scripts/set-railway-env.sh [KEY ...]

Examples:
  scripts/set-railway-env.sh DATABASE_URL NODE_ENV
  ENV_FILE=.env.production scripts/set-railway-env.sh
  SYNC_ALL=1 scripts/set-railway-env.sh
  RAILWAY_PROJECT_ID=<id> RAILWAY_ENVIRONMENT_ID=<id> RAILWAY_SERVICE_NAME=<name> scripts/set-railway-env.sh

Behavior:
  - Loads variables from ENV_FILE if it exists (default: .env)
  - Exported shell variables override file values
  - If no KEY arguments are provided, syncs a production-focused default set
  - Set SYNC_ALL=1 to sync every variable found in ENV_FILE and the current shell
  - Requires Railway CLI login: run 'railway login' first if unauthorized

Optional Railway selectors:
  RAILWAY_PROJECT_ID
  RAILWAY_ENVIRONMENT_ID
  RAILWAY_SERVICE_NAME
  RAILWAY_SERVICE_ID
  RAILWAY_WORKSPACE
  SKIP_DEPLOYS=1
EOF
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
  exit 0
fi

if ! command -v railway >/dev/null 2>&1; then
  echo "Railway CLI is not installed. Install it first: npm install -g @railway/cli"
  exit 1
fi

DEFAULT_KEYS=(
  NODE_ENV
  DATABASE_URL
  MONGODB_URI
  MONGO_URI
  SMTP_HOST
  SMTP_PORT
  SMTP_SECURE
  SMTP_USER
  SMTP_PASS
  CONTACT_FROM_EMAIL
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  TWILIO_FROM_PHONE
  FRONTEND_URL
  BACKEND_URL
  CLAUDE_API_KEY
  OPENAI_API_KEY
  GEMINI_API_KEY
  RAPIDAPI_KEY
  RAPIDAPI_HOST
  JWT_SECRET
  JWT_EXPIRES_IN
  RAG_EMBEDDING_PROVIDER
  RAG_VECTOR_BACKEND
  OPENAI_EMBEDDING_MODEL
  GEMINI_EMBEDDING_MODEL
  PINECONE_API_KEY
  PINECONE_INDEX_HOST
  PINECONE_NAMESPACE
  GMAIL_CLIENT_ID
  GMAIL_CLIENT_SECRET
  GMAIL_REFRESH_TOKEN
  SENDGRID_API_KEY
  ALERT_EMAIL_FROM
  ALERT_EMAIL_TO
  LOG_LEVEL
  SENTRY_DSN
  FEATURE_AUTO_APPLY
  FEATURE_EMAIL_NOTIFICATIONS
  FEATURE_INTERVIEW_PREP
  JOB_SEARCH_LIMIT
  JOB_MATCH_THRESHOLD
  RESUME_TAILOR_ENABLED
  JOB_SEARCH_SCHEDULE
  APEX_HOST
  CANONICAL_HOSTS
)

declare -A FILE_VARS=()
declare -A ALL_KEYS=()

trim() {
  local value="$1"
  value="${value#${value%%[![:space:]]*}}"
  value="${value%${value##*[![:space:]]}}"
  printf '%s' "$value"
}

strip_quotes() {
  local value="$1"
  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'.*\' ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

load_env_file() {
  local env_path="$1"
  [ -f "$env_path" ] || return 0

  while IFS= read -r raw_line || [ -n "$raw_line" ]; do
    local line
    line="$(trim "$raw_line")"

    [ -z "$line" ] && continue
    [[ "$line" == \#* ]] && continue
    [[ "$line" != *=* ]] && continue

    local key="${line%%=*}"
    local value="${line#*=}"

    key="$(trim "$key")"
    value="$(trim "$value")"
    value="$(strip_quotes "$value")"

    if [[ ! "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
      continue
    fi

    FILE_VARS["$key"]="$value"
    ALL_KEYS["$key"]=1
  done < "$env_path"
}

get_value() {
  local key="$1"
  if [ -n "${!key+x}" ]; then
    printf '%s' "${!key}"
  elif [ -n "${FILE_VARS[$key]+x}" ]; then
    printf '%s' "${FILE_VARS[$key]}"
  else
    return 1
  fi
}

mask_value() {
  local value="$1"
  local length=${#value}
  if [ "$length" -le 4 ]; then
    printf '****'
  else
    printf '%s****%s' "${value:0:2}" "${value:length-2:2}"
  fi
}

link_if_requested() {
  local link_args=()

  if [ -n "${RAILWAY_PROJECT_ID:-}" ]; then
    link_args+=(--project "$RAILWAY_PROJECT_ID")
  fi
  if [ -n "${RAILWAY_ENVIRONMENT_ID:-}" ]; then
    link_args+=(--environment "$RAILWAY_ENVIRONMENT_ID")
  fi
  if [ -n "${RAILWAY_SERVICE_NAME:-}" ]; then
    link_args+=(--service "$RAILWAY_SERVICE_NAME")
  elif [ -n "${RAILWAY_SERVICE_ID:-}" ]; then
    link_args+=(--service "$RAILWAY_SERVICE_ID")
  fi
  if [ -n "${RAILWAY_WORKSPACE:-}" ]; then
    link_args+=(--workspace "$RAILWAY_WORKSPACE")
  fi

  if [ ${#link_args[@]} -gt 0 ]; then
    echo "Linking current directory to Railway target..."
    railway link "${link_args[@]}"
  fi
}

set_remote_var() {
  local key="$1"
  local value="$2"
  local cmd=(railway variable set "$key" --stdin)

  if [ -n "${RAILWAY_SERVICE_NAME:-}" ]; then
    cmd+=(--service "$RAILWAY_SERVICE_NAME")
  elif [ -n "${RAILWAY_SERVICE_ID:-}" ]; then
    cmd+=(--service "$RAILWAY_SERVICE_ID")
  fi

  if [ -n "${RAILWAY_ENVIRONMENT_ID:-}" ]; then
    cmd+=(--environment "$RAILWAY_ENVIRONMENT_ID")
  fi

  if [ "$SKIP_DEPLOYS" = "1" ]; then
    cmd+=(--skip-deploys)
  fi

  printf '%s' "$value" | "${cmd[@]}" >/dev/null
}

load_env_file "$ENV_FILE"

if ! railway whoami >/dev/null 2>&1; then
  echo "Railway CLI is not authenticated. Run 'railway login' and rerun this script."
  exit 1
fi

link_if_requested

declare -a keys_to_sync=()
declare -A selected_keys=()

if [ "$#" -gt 0 ]; then
  for key in "$@"; do
    selected_keys["$key"]=1
  done
elif [ "$SYNC_ALL" = "1" ]; then
  for key in "${!ALL_KEYS[@]}"; do
    selected_keys["$key"]=1
  done
else
  for key in "${DEFAULT_KEYS[@]}"; do
    selected_keys["$key"]=1
  done
fi

for key in "${!selected_keys[@]}"; do
  keys_to_sync+=("$key")
done

if [ ${#keys_to_sync[@]} -eq 0 ]; then
  echo "No variables selected for sync."
  exit 1
fi

IFS=$'\n' keys_to_sync=($(printf '%s\n' "${keys_to_sync[@]}" | sort))
unset IFS

synced_count=0
skipped_count=0

echo "Using env file: $ENV_FILE"

for key in "${keys_to_sync[@]}"; do
  if value="$(get_value "$key")"; then
    echo "Syncing $key=$(mask_value "$value")"
    set_remote_var "$key" "$value"
    synced_count=$((synced_count + 1))
  else
    echo "Skipping $key (not defined locally)"
    skipped_count=$((skipped_count + 1))
  fi
done

echo "Sync complete. Synced: $synced_count, Skipped: $skipped_count"

