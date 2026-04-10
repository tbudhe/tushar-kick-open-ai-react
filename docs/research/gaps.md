# XAAI Research Gaps Log

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

This file tracks unresolved questions, contradictions, and next crawl targets for understanding the XAAI platform accurately.

## Current High-Confidence Facts

- `docs/xaai-platform-blueprint.md` contains a detailed platform blueprint for XAAI at `https://app.aiacquisition.com/`.
- The current repository implementation is primarily a job-search/resume automation application, not the documented XAAI CRM/GTM stack.
- Publicly reachable app pages from this environment are limited to auth pages; deeper XAAI product surfaces appear auth-gated.
- The referenced Google Sheet resource index is also auth-gated from this environment.
- XAAI module slugs such as `niche-researcher`, `offer-creator`, `ai-sdr`, and `sales-call-analysis` do not appear in `backend/**` or `frontend/**`.
- `docs/xaai-platform-blueprint.md` currently has no visible committed git history from this worktree and appears to be newly introduced research material.

## Major Open Questions

### Platform Relationship

- Is `app.aiacquisition.com` a separate production system unrelated to this repo?
- Is the XAAI blueprint a customer research artifact, a prior internal product, or a future-state product target?
- Was this repo forked or repurposed from an earlier XAAI effort?

### Product Reality vs Research Capture

- Which blueprint modules are based on direct observation of a live system versus reconstructed notes?
- Are the KPI values and workflow counts stable product features or point-in-time workspace data only?
- Is Jordan AI a user-facing brand only, or is there a distinct service architecture behind it?

### Architecture Questions

- What authentication and tenant model powers the XAAI workspace pattern?
- What persistence layer stores deals, campaigns, calls, and wizard submissions?
- Which integrations are mandatory for a functioning workspace?
- Which modules are natively implemented and which are orchestration layers over partner services?

### Resource Questions

- What exactly is in the Google Sheet resource index?
- Does the sheet map to the Resources Hub only, or to deeper docs, videos, and operating procedures?
- Which resource links fan out into additional platform documentation worth preserving in repo docs?

## Evidence Anchors

### Blueprint-Side Evidence

- `docs/xaai-platform-blueprint.md`
- `.vscode/Agents/xaai-platform-engineer.md`

### Current Repo Implementation Evidence

- `backend/src/routes/api.routes.ts`
- `frontend/src/App.tsx`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_PLAN.md`
- `docs/DAY7_COMPLETION.md`
- `docs/DAY7_VERIFICATION.md`
- repo-wide searches showing no XAAI module slug matches in `backend/**` and `frontend/**`
- working tree status showing `docs/xaai-platform-blueprint.md` as newly added research material

## Recommended Next Actions

1. Inspect git history for when `docs/xaai-platform-blueprint.md` was introduced.
2. Search `.env`, scripts, and deployment files for `aiacquisition` references.
3. Continue creating reusable XAAI docs from the blueprint so future Q&A is faster.
4. If authenticated access becomes available, crawl the Google Sheet and dashboard routes in 3-minute research passes.
5. Build a verification matrix that tags each XAAI claim as `Observed Live`, `Captured In Blueprint`, `Auth-Gated`, or `Not In Repo`.

## Provenance Implication

Until contrary evidence appears, the strongest interpretation is:

- the XAAI blueprint is a valuable research or target-state artifact,
- the current repository is not yet the implementation of that XAAI platform,
- future engineering work should explicitly declare whether it is operating on the current repo or the XAAI target architecture.


## Working Rule

Until new evidence appears, answer with this distinction:

- `Blueprint`: what the XAAI platform documentation says
- `Repo`: what this codebase actually implements
- `Unknown`: what still needs authenticated verification