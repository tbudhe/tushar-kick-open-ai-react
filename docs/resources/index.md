# XAAI Resources Hub Index

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

This document breaks down the XAAI Resources Hub into discrete tools and reusable assets.

Primary source: `docs/xaai-platform-blueprint.md`

Scope note: this is a blueprint-side resource map and not proof that these tools are implemented in the current repo.

## Hub Overview

Base route:

```text
https://app.aiacquisition.com/dashboard/{workspace-id}/resources
```

The Resources Hub is not a single feature. It is a collection of tactical GTM utilities that support the larger campaign, sales, and automation workflow.

## Resource Inventory

| Resource | Route | Primary Use | Output Type | Status |
|---|---|---|---|---|
| Cold Email Writer | `/resources/cold-email-writer` | Generate outreach copy by method and audience | Email sequences | Verified Blueprint |
| Pricing Calculator | `/resources/pricing-calculator` | Build ROI-backed service pricing | Pricing model and ROI framing | Verified Blueprint |
| AI Tools Directory | `/resources/ai-tools-directory` | Discover third-party tools by use case | Searchable reference directory | Verified Blueprint |
| Hiring Portal | `/resources/hiring-portal` | Find and hire talent | Auth-gated talent workflow | Partially Verified |
| Top 50 Niches | `/resources/top-50-niches` | Evaluate attractive markets | Ranked niche table | Verified Blueprint |
| Prompts Directory | `/resources/prompts-directory` | Reuse GTM and copywriting prompts | Prompt library | Verified Blueprint |
| n8n Workflow Creator | `/resources/n8n-workflow-creator` | Generate custom automations | Workflow JSON delivered by email | Verified Blueprint |
| n8n Workflow Library | `/resources/n8n-workflow-library` | Reuse prebuilt automations | Downloadable workflow templates | Verified Blueprint |

## Resource-by-Resource Notes

### Cold Email Writer

- Designed for method-specific outbound generation.
- Supports multiple outreach methods: Interview, Podcast, AI Audit, Direct, Masterclass.
- Likely acts as a copy asset generator for the Cold Email Campaign Agent rather than a standalone campaign runner.

### Pricing Calculator

- Supports both revenue-generation and cost-saving service models.
- Encodes ROI framing directly into the sales process.
- Bridges pre-sales positioning with commercial packaging.

### AI Tools Directory

- Appears to be an internal operator reference library.
- Helps users assemble external tooling around XAAI workflows.
- Important categories include AI, CRM, email, automation, transcription, research, design, and coding.

### Hiring Portal

- Research capture indicates the tool exists, but detailed content is auth-gated.
- Treat this as a real module with incomplete visibility.

### Top 50 Niches

- Supports ICP and niche validation.
- Includes market sophistication and CAGR, which implies the output is intended for sales strategy, not just inspiration.
- Highest-growth highlighted niches include AI Consulting, Quantum Computing Consulting, Mobile App Development, Podcast Production, and Health Tech.

### Prompts Directory

- Stores reusable prompts for ad creation, nurture sequences, VSL writing, and offer strategy.
- Indicates that prompt assets are treated as productized intellectual property within the platform.

### n8n Workflow Creator

- Appears to collect workflow requirements and return a generated n8n workflow JSON by email.
- Suggests a services or fulfillment layer behind the UI rather than immediate in-browser automation assembly.

### n8n Workflow Library

- Contains 20 downloadable workflows spanning outreach, sales, content, support, and analytics.
- Most directly supports the platform's scaling phase.

## Strategic Role In The GTM System

| GTM Phase | Supporting Resources |
|---|---|
| Research | Top 50 Niches, AI Tools Directory |
| Offer and packaging | Pricing Calculator, Prompts Directory |
| Outreach creation | Cold Email Writer, Prompts Directory |
| Reply and sales enablement | AI Tools Directory, Workflow Library |
| Automation and scale | n8n Workflow Creator, n8n Workflow Library |
| Team expansion | Hiring Portal |

## Workflow Library Highlights

The most strategically important workflow templates captured in the blueprint are:

- Automated LinkedIn DM System
- Gmail Auto-Label and Response Drafter
- AI Sales Call Analyzer
- Sales Pipeline Automation
- Inbound AI SDR
- Automated Sales Meeting Prep
- Weekly Marketing Reports
- Customer Support Ticket Routing

These templates imply that the XAAI platform is designed to extend itself through workflow automation rather than keeping all capabilities strictly native.

## Research Gaps

- Which resource outputs are immediate downloads versus asynchronous fulfillment?
- Which tools are simple wrappers over prompts versus backed by dedicated services?
- Whether the resource hub is intended for internal operator usage, customer self-service, or both.
- Whether the Hiring Portal is native or integration-backed.