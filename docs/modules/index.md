# XAAI Modules Index

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

This index decomposes the XAAI blueprint into reusable platform modules so future questions can be answered by module rather than by searching a single large document.

Primary source: `docs/xaai-platform-blueprint.md`

Scope note: this is a blueprint index, not a statement that the listed modules exist in the current repo implementation.

## Platform Layers

| Layer | Modules | Role in System |
|---|---|---|
| Intelligence | AI Consultant / Jordan AI | Strategy, analysis, learning, automation guidance |
| Go-To-Market | Niche Researcher, Offer Creator | Define ICP, positioning, offer design |
| Marketing | Cold Email Campaign Agent, AI Ads Maker | Generate and run outbound acquisition programs |
| Sales | AI SDR Inbox, Sales Call Analyzer, Growth Plan Creator | Manage replies, score calls, prep tailored pitches |
| CRM | Deals, Appointments, People, Companies, Tasks, Notes | Operational system of record for pipeline execution |
| Resources | 8 tool resource hub | Templates, calculators, prompts, tools, automation assets |
| Settings | Personal and workspace settings | Configure identity, integrations, billing, agents |

## Module Inventory

| Module | Primary Route | Inputs | Outputs | Key Dependencies | Status |
|---|---|---|---|---|---|
| Dashboard | `/dashboard/{workspace-id}` | Workspace context, time range | KPI cards, conversion gauges, pipeline charts | Campaign metrics, deals, revenue tracking | Verified Blueprint |
| CRM | `/dashboard/{workspace-id}/crm` | Contacts, companies, deals, activities | 27-stage pipeline and operational records | Cold Email Agent, AI SDR, users, workspace | Verified Blueprint |
| AI Consultant | `/dashboard/{workspace-id}/ai-growth-consultant` | Prompts, uploaded files, workspace context | Strategic and analytical responses | Workspace data, Jordan AI persona | Verified Blueprint |
| Niche Researcher | `/dashboard/{workspace-id}/niche-researcher` | Background and skill inputs | Niche recommendations | Wizard submission model | Verified Blueprint |
| Offer Creator | `/dashboard/{workspace-id}/offer-creator` | Results, skills, process knowledge, transcript mode | Offer positioning and messaging | Wizard submission model | Verified Blueprint |
| Cold Email Campaign Agent | `/dashboard/{workspace-id}/cold-email-campaign-agent` | Campaign settings, leads, sending accounts | Campaign metrics and booked calls | Email providers, credits, CRM | Verified Blueprint |
| AI Ads Maker | `/dashboard/{workspace-id}/ai-ads-maker` | Business, audience, pain points, CTA | Video ad scripts | Wizard submission model | Verified Blueprint |
| AI SDR Inbox | `/dashboard/{workspace-id}/ai-sdr` | Incoming replies, rules, tone config | Drafted or automated email responses | Email integration, CRM stages | Verified Blueprint |
| Sales Call Analyzer | `/dashboard/{workspace-id}/sales-call-analysis` | Call recordings or manual call data | Scores, insights, trend signals | Call ingestion, scoring rubric | Verified Blueprint |
| Growth Plan Creator | `/dashboard/{workspace-id}/growth-plan-creator` | Prospect details, challenges, transcript data | Personalized growth plan document | Wizard submission model, call prep workflow | Verified Blueprint |
| Resources Hub | `/dashboard/{workspace-id}/resources` | Resource selection and form inputs | Tool-specific outputs and reference assets | Resource subtools | Verified Blueprint |
| Settings | `/dashboard/{workspace-id}/settings` | User/workspace config | Saved preferences and operational settings | Billing, integrations, agent configs | Verified Blueprint |

## CRM Detail

### Tabs

- Deals
- Appointments
- People
- Companies
- Tasks
- Notes

### CRM Dependencies

- Positive replies from Cold Email Campaign Agent can create deals.
- AI SDR can classify and advance leads through CRM stages.
- Sales workflows ultimately converge in the CRM pipeline.

### Key Design Implication

CRM is the execution backbone of the GTM system rather than a standalone database. The blueprint treats outreach, reply handling, and pipeline management as one connected system.

## Wizard-Based Modules

These tools share a common pattern:

- Niche Researcher
- Offer Creator
- AI Ads Maker
- Growth Plan Creator
- Cold Email Writer
- n8n Workflow Creator

Shared characteristics:

- Guided multi-step input flow
- Submission history table
- Member attribution
- Status tracking
- AI-generated output artifact

This suggests a reusable product primitive: `WizardSubmission` plus per-tool configuration.

## Data Backbone

The blueprint explicitly documents four reusable data entities:

- `Deal`
- `Campaign`
- `SalesCall`
- `WizardSubmission`

These should be treated as the minimum domain model set for any future XAAI implementation work.

## Workflow Ownership Map

| Workflow Step | Owning Module |
|---|---|
| Market research | Niche Researcher, Top 50 Niches |
| Offer design | Offer Creator, Pricing Calculator |
| Outreach asset creation | Cold Email Writer, AI Ads Maker, Prompts Directory |
| Campaign execution | Cold Email Campaign Agent |
| Reply management | AI SDR Inbox |
| Call preparation | Growth Plan Creator, AI Consultant |
| Call review | Sales Call Analyzer |
| Pipeline advancement | CRM |
| Scale-up automation | AI Automation Library, AI Tools Directory, Hiring Portal |

## Open Questions

- Which parts of the blueprint reflect live production behavior versus a curated research capture?
- Is Jordan AI a dedicated backend service, a prompt layer, or both?
- Which integrations are hard dependencies versus optional connectors?
- Which module should be implemented first if this repo adopts the XAAI target architecture?