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

Primary target: Railway.

Production stack:
- Railway hosts the Node.js app and serves the built frontend from the same process.
- Porkbun manages DNS for `yunextgenai.com` and `www.yunextgenai.com`.
- MongoDB Atlas stores application data.
- Resend handles outbound verification and contact emails.
- Google Workspace handles mailbox delivery for the custom domain.

Required variables:
- `DATABASE_URL` (or `MONGODB_URI` / `MONGO_URI`)
- `NODE_ENV=production`
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `SMTP_*` as fallback only
- Optional AI keys (e.g. `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`)

Operational notes:
- Phone verification is temporarily disabled in the public contact flow.
- GitHub failure emails labeled `CI` come from GitHub Actions workflow runs, not from Railway runtime health checks.
- DNS changes are not required for normal Railway code deploys. Reconfigure DNS only if Railway issues new custom-domain targets.

Health endpoints:
- `/health`
- `/heartbeat`
- `/api/health`

---

## Contact Module Technical Flow

The Contact module provides a verified message-send workflow between a visitor and the site owner.

### Components

| Layer | File | Responsibility |
|-------|------|----------------|
| Frontend page | `frontend/src/components/pages/ContactPage.tsx` | Form UI + submission |
| Rate-limit middleware | `backend/src/middlewares/contact-form-rate-limit.ts` | Throttle per IP |
| Controller | `backend/src/controllers/contact-form.controller.ts` | Validate + dispatch |
| Service (form) | `backend/src/services/contact-form.service.ts` | Business logic, email send |
| Service (audit) | `backend/src/services/contact-audit.service.ts` | Persist audit record |
| Service (send) | `backend/src/services/contact.service.ts` | Core send & OTP logic |
| Email template | `backend/src/emails/contact-email-template.tsx` | React-email template |

### Request Flow

```
Browser (ContactPage)
    │  POST /api/contact/send
    ▼
contact-form-rate-limit middleware   ← blocks > N requests / IP / window
    │
    ▼
ContactFormController.send()
    │  validates body (name, email, message)
    ├─► ContactAuditService.record()  ← persists attempt to MongoDB
    └─► ContactFormService.send()
            │
            ├─► Resend API  ← sends email to CONTACT_FROM_EMAIL inbox
            │       email rendered via contact-email-template.tsx
            └─► returns { success: true } to browser
```

### Scaling Notes

- **Rate limiting**: configured in `contact-form-rate-limit.ts`; tune `windowMs` and `max`
  to adjust throughput before enabling high-traffic campaigns.
- **Phone verification**: stub exists in `contact.service.ts` but is intentionally disabled
  in the public flow. Re-enable by wiring the OTP send/verify endpoints and adding the
  phone field back to `ContactPage.tsx`.
- **Spam protection**: add reCAPTCHA or hCaptcha as a middleware step before the controller
  for production hardening.
- **Storage**: audit records are written to MongoDB. Add a TTL index on the `createdAt`
  field of the audit collection to auto-expire old records if storage is a concern.
