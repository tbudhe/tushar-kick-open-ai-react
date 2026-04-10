# XAAI Blueprint Documents

This is the single canonical entry point for XAAI platform knowledge in this repository.

## Document Map

- Master blueprint: `docs/xaai-platform-blueprint.md`
- Implementation boundary: `docs/IMPLEMENTATION_STATUS.md`
- Modules index: `docs/modules/index.md`
- Resources index: `docs/resources/index.md`
- Research gaps: `docs/research/gaps.md`
- Verification matrix: `docs/research/verification-matrix.md`

Use this document as the first stop whenever the discussion is about:

- XAAI product architecture
- module ownership
- platform workflows
- GTM system design
- resources and automation assets
- gaps between blueprint knowledge and repo implementation

## Working Position

The XAAI knowledge base is established.

From this point forward, use the following operating rules:

1. Treat XAAI as a documented platform blueprint centered on `https://app.aiacquisition.com/`.
2. Treat the current repository implementation separately unless code proves the XAAI feature exists here.
3. Answer future questions in a coworker style: direct, contextual, and decision-oriented.
4. Use the blueprint documents for product and architecture reasoning.
5. Use the repo code for implementation truth.

## Canonical Base

Primary product prefix:

```text
https://app.aiacquisition.com/
```

Primary captured blueprint source:

`docs/xaai-platform-blueprint.md`

## What This Document Unifies

This document makes the following state official:

- XAAI knowledge base: established
- repo reality vs blueprint: separated
- future responses: coworker-style, direct, contextual, and decision-oriented

## Core Blueprint Documents

### 1. Master Blueprint

- `docs/xaai-platform-blueprint.md`
- Purpose: full captured XAAI platform blueprint with routes, workflows, module details, data entities, and operating assumptions

### 2. Implementation Boundary

- `docs/IMPLEMENTATION_STATUS.md`
- Purpose: clearly separates XAAI blueprint knowledge from the app actually implemented in this repo

### 3. Module Index

- `docs/modules/index.md`
- Purpose: reusable module-by-module map for future architecture and product questions

### 4. Resource Index

- `docs/resources/index.md`
- Purpose: reusable breakdown of the XAAI Resources Hub and its tools

### 5. Research Gaps

- `docs/research/gaps.md`
- Purpose: unresolved questions, provenance issues, and next crawl targets

### 6. Verification Matrix

- `docs/research/verification-matrix.md`
- Purpose: evidence classification for XAAI claims

## Blueprint Layers

The XAAI blueprint currently resolves into these layers:

| Layer | Scope |
|---|---|
| Intelligence | Jordan AI / AI Consultant |
| Go-To-Market | Niche Researcher, Offer Creator |
| Marketing | Cold Email Campaign Agent, AI Ads Maker |
| Sales | AI SDR Inbox, Sales Call Analyzer, Growth Plan Creator |
| CRM | Deals, Appointments, People, Companies, Tasks, Notes |
| Resources | Tactical GTM tools, prompts, calculators, directories, automation assets |
| Settings | Personal settings, workspace settings, agent and billing configuration |

## Standing Interpretation Rule

When we talk about XAAI going forward, use this distinction:

- `Blueprint`: what the XAAI documents say the platform is or should be
- `Repo`: what this codebase actually implements today
- `Unknown`: what still requires authenticated verification or new evidence

## Practical Usage

### Use Blueprint Knowledge For

- feature planning
- architecture discussions
- module scoping
- product decomposition
- workflow mapping
- pre-sales solution framing
- identifying target-state implementation work

### Use Repo Knowledge For

- current routes and APIs
- actual backend and frontend behavior
- deployable features
- bug fixing
- refactors
- code reviews

## Current Best Understanding

At the moment, the strongest interpretation is:

- XAAI is a documented external platform or target-state system
- the current repository is not yet that XAAI platform implementation
- the blueprint remains valuable and should be preserved as the canonical architecture reference

## If Asked Future Questions

Default response posture:

1. Identify whether the question is about blueprint, repo, or both.
2. Answer directly without repeating setup.
3. State assumptions only when they materially change the answer.
4. Call out `Auth-Gated` or `Unknown` areas instead of guessing.
5. Use module and workflow ownership when giving recommendations.

## Canonical Decision

For collaboration purposes, treat this file as the one umbrella document for XAAI blueprint knowledge in this repository.

If future material is added, it should either:

- extend one of the linked supporting docs, or
- be linked from this file so the blueprint remains navigable from one place.