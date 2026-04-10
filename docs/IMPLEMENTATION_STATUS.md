# XAAI vs Current Repo Implementation Status

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

This document separates three things that should not be conflated:

1. The documented XAAI platform blueprint at `https://app.aiacquisition.com/`
2. The currently implemented application in this repository
3. The open research surface that still requires authenticated crawling or code confirmation

## Status Legend

- `Verified Blueprint`: Documented from captured XAAI research and treated as externally verified product knowledge
- `Implemented In Repo`: Present in the current codebase
- `Auth-Gated`: Likely real, but not directly crawlable from the current environment without login
- `Not Implemented In Repo`: Documented in blueprint, but absent from this codebase

## Executive Summary

The repository currently contains a production-oriented job-search and resume automation application, while `docs/xaai-platform-blueprint.md` documents a separate XAAI go-to-market platform hosted at `https://app.aiacquisition.com/`.

This distinction matters for all future engineering answers:

- Questions about current code behavior must be answered from the repo implementation.
- Questions about XAAI product architecture, workflows, or future-state design can be answered from the blueprint.
- Questions that assume the XAAI modules already exist in this repo should be labeled as future-state unless code confirms otherwise.

## Source-of-Truth Hierarchy

### For XAAI Product Knowledge

1. `docs/xaai-platform-blueprint.md`
2. Authenticated XAAI platform pages under `https://app.aiacquisition.com/`
3. Authenticated Google Sheet resource index

### For Current Repository Behavior

1. `backend/src/`
2. `frontend/src/`
3. `server.ts`
4. Supporting implementation docs under `docs/`

## Module Status Matrix

| Area | XAAI Blueprint Status | Current Repo Status | Notes |
|---|---|---|---|
| Dashboard KPI workspace | Verified Blueprint | Not Implemented In Repo | Repo has learning/job-search pages, not workspace KPI dashboards |
| CRM with deals, people, companies, tasks, notes | Verified Blueprint | Not Implemented In Repo | No CRM domain models or routes found in app code |
| AI Consultant / Jordan AI | Verified Blueprint | Not Implemented In Repo | Repo uses AI for resume/rag flows, not Jordan AI GTM assistant |
| Niche Researcher | Verified Blueprint | Not Implemented In Repo | No wizard flow in current frontend/backend |
| Offer Creator | Verified Blueprint | Not Implemented In Repo | Not present in routes or APIs |
| Cold Email Campaign Agent | Verified Blueprint | Not Implemented In Repo | No outreach or campaign engine code in repo |
| AI Ads Maker | Verified Blueprint | Not Implemented In Repo | No ad-script workflow in repo |
| AI SDR Inbox | Verified Blueprint | Not Implemented In Repo | No inbox or AI reply management in repo |
| Sales Call Analysis | Verified Blueprint | Not Implemented In Repo | No call scoring subsystem in repo |
| Growth Plan Creator | Verified Blueprint | Not Implemented In Repo | No pre-sales growth plan generator in repo |
| Resources Hub | Verified Blueprint | Not Implemented In Repo | Resource tools are documented only |
| Settings workspace model | Verified Blueprint | Partially Implemented In Repo | Repo has app settings/configs, but not XAAI workspace settings model |
| Job search and application tracking | Not Part of XAAI Blueprint | Implemented In Repo | This is the repo's current actual product surface |
| Resume parsing and tailoring | Not Part of XAAI Blueprint | Implemented In Repo | Implemented via backend services and controllers |
| RAG storage and benchmarking | Not Part of XAAI Blueprint | Implemented In Repo | Present in backend controllers/models |

## What To Assume Going Forward

### Safe Assumptions

- XAAI blueprint artifacts are useful as product architecture knowledge.
- The repo does not yet implement the documented XAAI CRM/GTM product surface.
- Future implementation planning can use the XAAI blueprint as a target state.

### Unsafe Assumptions

- Do not assume a documented XAAI route has matching frontend code here.
- Do not assume XAAI data models already exist in Mongo schemas here.
- Do not assume the current deployed repo domain is `app.aiacquisition.com`.

## Recommended Usage

- Start with `docs/XAAI-BLUEPRINT-DOCUMENTS.md` for the full XAAI document map.
- Use `docs/xaai-platform-blueprint.md` for product strategy, system design, discovery, and feature planning.
- Use `docs/modules/index.md` for module-level XAAI navigation.
- Use `docs/resources/index.md` for resource-hub understanding.
- Use `docs/research/gaps.md` for unanswered questions and next crawl targets.

## Immediate Next Steps

1. Confirm whether `app.aiacquisition.com` is a separate production app or an external reference product.
2. Continue turning the XAAI blueprint into smaller reusable docs.
3. Keep tagging every future answer as blueprint-based or code-based when there is any ambiguity.