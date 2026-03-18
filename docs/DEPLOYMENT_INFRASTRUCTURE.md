# Deployment & Infrastructure Plan

This document supersedes the previous Railway-centric deployment guide.

## Active Hosting Direction

- Domain registrar: Porkbun (`yunextgenai.com`)
- Email workspace: Google Workspace (`tbudhe@yunextgenai.com`)
- Application runtime: Self-hosted Node.js service (single process serving API + frontend build)

### Domain Status

- `yunextgenai.com` is already purchased.
- Next required step is DNS mapping from Porkbun to Cloud Run service mapping records.

## Infrastructure Requirements and Decisions

### 1) Remove Railway Dependency

- Railway account has been deleted to stop billing.
- Do not rely on Railway service configuration for production deployment.
- Keep app runtime environment-agnostic (`PORT`, `DATABASE_URL`, and SMTP env vars).
- Historical Railway references remain in day-by-day progress docs only for audit trail.

### 2) Google Workspace Clarification

- Google Workspace is being used for email and productivity services.
- Google Sites (https://sites.google.com/new?tgif=d) can be used to publish simple informational pages.
- Google Workspace and Google Sites are not a deployment runtime for this Node.js application.
- A dedicated application host remains required for production (for example: Google Cloud Run, VM, Render, or Fly.io).
AKfycbymhdMJhpiMYUJusB2Y4DV6jONkEgmtnqA9ztJTGZ_orTgYIV-qe9kdGg3R3W3xZTDh
### 3) MongoDB Cost Confirmation

- Repository code cannot determine billing tier.
- Confirm in MongoDB Atlas console: Billing -> Current Plan.
- If Atlas shows `M0` shared cluster, it is free tier.

### 4) Email Delivery for Contact Workflow

- Contact workflow supports SMTP via environment variables.
- With Google Workspace, you can use Gmail SMTP relay/app-password setup.
- Additional third-party email service is not required if Workspace SMTP limits meet expected volume.
- For high volume or deliverability controls, optional providers include SendGrid, Mailgun, SES.

### 5) Verification Workflow Constraints

- Email verification works through SMTP configuration.
- Phone verification now supports Twilio directly from backend configuration.
- If Twilio credentials are not configured, phone flow falls back to development/log mode.
- Twilio trial is the closest free option (trial credits + verified recipient numbers).

### 6) Hosting Target Selected: Google Cloud Run

- Selected next hosting target: Google Cloud Run.
- Deployment helper script: scripts/deploy-cloud-run.sh.
- Run from repository root:

```bash
chmod +x scripts/deploy-cloud-run.sh
PROJECT_ID=<your-gcp-project-id> REGION=us-central1 SERVICE=yunextgenai-app ./scripts/deploy-cloud-run.sh
```

- After deploy, map domain in Cloud Run and point Porkbun DNS to Cloud Run mapping.
- Keep custom email on Google Workspace (separate from app hosting).

### 7) Custom Domain Mapping Steps (Porkbun + Cloud Run)

From your local machine:

```bash
# 1) Verify domain ownership in Google (one-time)
gcloud domains verify yunextgenai.com

# 2) Map apex domain
gcloud beta run domain-mappings create \
	--service yunextgenai-app \
	--domain yunextgenai.com \
	--region us-central1

# 3) Optional: map www subdomain
gcloud beta run domain-mappings create \
	--service yunextgenai-app \
	--domain www.yunextgenai.com \
	--region us-central1

# 4) Get exact DNS records to add in Porkbun
gcloud beta run domain-mappings describe \
	--domain yunextgenai.com \
	--region us-central1 \
	--format="value(status.resourceRecords)"
```

In Porkbun DNS:

- Add exactly the `A` / `AAAA` / `CNAME` records returned by the command above.
- Do not remove Google Workspace MX records.
- Keep existing Google verification TXT records.

Propagation usually takes a few minutes to a few hours.

## Required Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=<mongodb-connection-string>

# Contact/Email workflow
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tbudhe@yunextgenai.com
SMTP_PASS=<app-password-or-relay-secret>
CONTACT_FROM_EMAIL=tbudhe@yunextgenai.com

# Phone verification (Twilio)
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_FROM_PHONE=<twilio-verified-sender-number>
```

## Production Validation Checklist

```bash
curl http://<host>/health
curl http://<host>/api/health
curl http://<host>/api/menu
curl -X POST http://<host>/api/contact/request-code -H 'Content-Type: application/json' -d '{"method":"email","destination":"user@example.com"}'
curl -X POST http://<host>/api/contact/request-code -H 'Content-Type: application/json' -d '{"method":"phone","destination":"+1XXXXXXXXXX"}'
```

Expected results:

- Health endpoints return success.
- Menu includes `Career Hub (Inactive)` as last item.
- Contact verification endpoint returns `sessionId` and delivery status.
