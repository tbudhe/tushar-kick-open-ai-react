# Deployment & Infrastructure Plan

This document is the current production runbook for the Railway deployment.

## Active Hosting Direction

- Domain registrar: Porkbun (`yunextgenai.com`)
- Email workspace: Google Workspace (`tbudhe@yunextgenai.com`)
- Application runtime: Railway-hosted Node.js service (single process serving API + frontend build)
- Transactional email provider: Resend
- Database: MongoDB Atlas

### Domain Status

- `yunextgenai.com` is already purchased.
- `yunextgenai.com` and `www.yunextgenai.com` both point to Railway custom domains.
- SSL certificates are issued by Railway/Let's Encrypt for both hostnames.

## Infrastructure Requirements and Decisions

### 1) Hosting Platform

- Railway is the active production host.
- Standard app deploys do not require DNS changes.
- DNS changes are only required when Railway custom domains are removed/re-added or when Railway issues new target values.
- Keep app runtime environment-agnostic (`PORT`, `DATABASE_URL`, `RESEND_API_KEY`, and fallback SMTP env vars).

### 2) Google Workspace Clarification

- Google Workspace is being used for email and productivity services.
- Google Workspace handles domain mailboxes and inbound business email.
- Google Workspace does not host the application itself.
- Resend handles outbound application email while Google Workspace keeps the mailbox domain active.
### 3) MongoDB Cost Confirmation

- Repository code cannot determine billing tier.
- Confirm in MongoDB Atlas console: Billing -> Current Plan.
- If Atlas shows `M0` shared cluster, it is free tier.

### 4) Email Delivery for Contact Workflow

- Contact workflow uses Resend as the primary delivery path.
- SMTP remains configured only as a fallback path for non-Railway environments.
- Google Workspace remains the mailbox provider for `@yunextgenai.com` inboxes.
- Resend domain verification is required before sending to external recipients.

#### Resend Setup (Required on Railway)

1. Open `https://resend.com` and sign in.
2. Open your workspace and go to **API Keys**.
3. Click **Create API Key**.
4. Name it `Railway-Prod` (or similar).
5. Choose **Send access**.
6. Copy the key (format starts with `re_...`).

Add the key to Railway service variables:

1. Open your Railway service.
2. Go to **Variables**.
3. Add `RESEND_API_KEY=<re_...real_key...>`.
4. Save. Railway redeploys automatically.

Also required in Resend before sending:

1. Go to **Domains** in Resend.
2. Add and verify `yunextgenai.com`.
3. Set `CONTACT_FROM_EMAIL` to a verified sender on that domain.
4. Recommended sender: `no-reply@yunextgenai.com`.
5. Temporary fallback for testing only: `CONTACT_FROM_EMAIL=onboarding@resend.dev`.

### 5) Verification Workflow Constraints

- Email verification works through Resend after domain verification.
- Phone verification is temporarily disabled in the user-facing flow.
- SMTP fallback exists in code, but Railway outbound SMTP is not the preferred path.

### 6) Railway Custom Domains

- Add apex domain in Railway as `yunextgenai.com` on port `8080`.
- Add subdomain in Railway as `www.yunextgenai.com` on port `8080`.
- In Porkbun:
  - keep apex as `ALIAS @ -> <railway-apex-target>`
  - keep `www` as `CNAME -> <railway-www-target>`
  - keep `_railway-verify` TXT records for apex and `www`
- After Railway shows both domains active, SSL should attach automatically.

## Required Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=<mongodb-connection-string>

# Contact/Email workflow
RESEND_API_KEY=<re_...real_key...>
CONTACT_FROM_EMAIL=no-reply@yunextgenai.com

# SMTP fallback only
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tbudhe@yunextgenai.com
SMTP_PASS=<app-password-or-relay-secret>
```

## Production Validation Checklist

```bash
curl http://<host>/health
curl http://<host>/api/health
curl http://<host>/api/menu
curl -X POST http://<host>/api/contact/request-code -H 'Content-Type: application/json' -d '{"method":"email","destination":"user@example.com"}'
```

Expected results:

- Health endpoints return success.
- Menu does **not** show Career Hub / Job Search — those routes are currently disabled.
  The label `Career Automation (Soon)` is defined in `routes.ts#careerHubInactive` for future use.
- Contact verification endpoint returns `sessionId` and delivery status.
- A successful email send logs `provider: resend` in the response payload.

### 7) Notifications and CI

- Email notifications with subjects like `CI - main` come from GitHub Actions, not Railway.
- The repo workflow responsible is `.github/workflows/ci.yml`.
- Railway deployment health is checked separately inside the Railway dashboard and service logs.
