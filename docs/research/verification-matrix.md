# XAAI Verification Matrix

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

This matrix tags important XAAI claims by evidence quality so future answers can distinguish live observations from blueprint-only knowledge.

## Status Tags

- `Observed Live`: directly observed from reachable pages in this environment
- `Captured In Blueprint`: documented in `docs/xaai-platform-blueprint.md`
- `Auth-Gated`: likely exists, but blocked by authentication from this environment
- `Not In Repo`: not found in the current codebase implementation
- `Implemented In Repo`: present in the current repository implementation

## Claims Matrix

| Claim | Status | Evidence | Notes |
|---|---|---|---|
| Public auth pages exist at `app.aiacquisition.com` | Observed Live | Public fetch of sign-in, sign-up, forgot-password routes | Login shell is directly reachable |
| Google Sheet resource index exists but requires auth | Observed Live | Fetch redirected to Google login | Sheet contents not directly inspectable here |
| XAAI uses dashboard routes under `/dashboard/{workspace-id}/{module}` | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not validated from live authenticated session in this environment |
| Workspace ID pattern like `yu-ex-gen-ai-bFTPi` exists | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Blueprint-only in current environment |
| CRM with deals, appointments, people, companies, tasks, notes is part of XAAI | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | No implementation found in current repo |
| Niche Researcher exists as a 2-step wizard | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| Offer Creator exists as a 2-step wizard | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| Cold Email Campaign Agent exists with campaign metrics | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| AI Ads Maker exists as a 6-step script wizard | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| AI SDR Inbox exists as a reply-management module | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| Sales Call Analyzer exists with scored call logs | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| Growth Plan Creator exists as a pre-sales doc generator | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Not found in repo code |
| Resource Hub contains eight tools | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Several routes remain auth-gated |
| Hiring Portal has deeper content | Auth-Gated | Blueprint note says deeper crawl requires auth | Needs logged-in access |
| Jordan AI is the AI consultant persona | Captured In Blueprint | `docs/xaai-platform-blueprint.md` | Service implementation unknown |
| Current repo frontend implements XAAI module routes | Not In Repo | `frontend/**` slug searches returned no matches | Current frontend appears to be a different app |
| Current repo backend implements XAAI module APIs | Not In Repo | `backend/**` slug searches returned no matches | No CRM/GTM modules found |
| Current repo implements job search, resume, profile, contact, and RAG flows | Implemented In Repo | `backend/src/`, `frontend/src/`, implementation docs under `docs/` | This is current repo behavior, not XAAI blueprint behavior |

## Interpretation Rule

When answering future questions:

- Use `Observed Live` when something was directly reachable.
- Use `Captured In Blueprint` for product knowledge derived from the XAAI research document.
- Use `Auth-Gated` when existence is likely but direct validation is blocked.
- Use `Not In Repo` when the current codebase does not support the claim.
- Use `Implemented In Repo` only for features proven by the current codebase.