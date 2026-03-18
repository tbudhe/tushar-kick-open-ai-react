#!/usr/bin/env bash

set -euo pipefail

# Usage:
# PROJECT_ID=my-gcp-project REGION=us-central1 SERVICE=tushar-ai-app ./scripts/deploy-cloud-run.sh

PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-central1}"
SERVICE="${SERVICE:-tushar-kick-open-ai-react}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "PROJECT_ID is required"
  exit 1
fi

echo "Deploying $SERVICE to Cloud Run in $REGION (project: $PROJECT_ID)"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "PORT=3000"

echo "Deployment complete."
