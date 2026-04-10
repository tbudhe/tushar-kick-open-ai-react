# XAAI Platform — Complete System Blueprint
> **Crawled:** 2026-04-08 | **Account:** YU-Ex-Gen-AI (Tushar Budhe) | **Source:** https://app.aiacquisition.com

This document is the authoritative reference for all platform modules, data models, workflows, configurations, and resource assets. Use it as the first point of consultation for any architectural decision, pre-sales demo, or engineering task.

Related entry point: `docs/XAAI-BLUEPRINT-DOCUMENTS.md`

Scope note: this document captures the XAAI platform blueprint and observed research state. It should not be treated as proof that the same modules exist in the current repository implementation.

---

## Table of Contents

1. [Platform Architecture Overview](#1-platform-architecture-overview)
2. [Navigation & URL Map](#2-navigation--url-map)
3. [Dashboard — KPIs & Metrics](#3-dashboard--kpis--metrics)
4. [CRM Module](#4-crm-module)
5. [AI Consultant](#5-ai-consultant)
6. [Go-To-Market Layer](#6-go-to-market-layer)
7. [Marketing Layer](#7-marketing-layer)
8. [Sales Layer](#8-sales-layer)
9. [Resources Hub](#9-resources-hub)
10. [Settings & Configuration](#10-settings--configuration)
11. [Data Models & Entities](#11-data-models--entities)
12. [Platform Workflow — End-to-End GTM Engine](#12-platform-workflow--end-to-end-gtm-engine)
13. [Pre-Sales Solution Map](#13-pre-sales-solution-map)
14. [Engineering Notes & Integration Points](#14-engineering-notes--integration-points)

---

## 1. Platform Architecture Overview

XAAI (app.aiacquisition.com) is a **multi-layer AI-powered Go-To-Market Operating System** for B2B service businesses and agencies. It unifies market research, offer creation, outbound lead generation, AI-driven sales development, call analysis, and growth planning in a single workspace.

### Architectural Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTELLIGENCE LAYER                        │
│  Jordan AI (AI Consultant) · Ask AI (Global Assistant)           │
├──────────────┬──────────────────┬──────────────────────────────-┤
│  GO-TO-MARKET│    MARKETING      │         SALES                  │
│  ────────────│  ────────────────│  ──────────────────────────── │
│  Niche       │  Cold Email       │  AI SDR Inbox                  │
│  Researcher  │  Agent            │  Sales Call Analyzer           │
│  ────────────│  ────────────────│  Growth Plan Creator            │
│  Offer       │  AI Ads Maker     │                                │
│  Creator     │                  │                                │
├──────────────┴──────────────────┴───────────────────────────────┤
│                         CRM LAYER                                │
│  Deals (Kanban) · Appointments · People · Companies · Tasks · Notes │
├─────────────────────────────────────────────────────────────────┤
│                       RESOURCES HUB                              │
│  Cold Email Writer · Pricing Calculator · AI Tools Directory     │
│  Hiring Portal · Top 50 Niches · Prompts Directory               │
│  AI Automation Creator (n8n) · AI Automation Library (n8n)       │
├─────────────────────────────────────────────────────────────────┤
│                    SETTINGS & WORKSPACE                          │
│  Profile · Security · Email & Calendar · Members · Billing       │
│  Cold Email Agent Config · AI SDR Config · Email Templates        │
└─────────────────────────────────────────────────────────────────┘
```

### Core Design Principles
- **Agent-First:** Every module is backed by an AI agent that can operate autonomously
- **Multi-Step Wizard Forms:** All generative tools use 2–6 step guided input forms
- **History Tables:** Every AI generation tool maintains a searchable submission history with status and member tracking
- **Workspace Isolation:** All data is scoped to a workspace ID (e.g., `yu-ex-gen-ai-bFTPi`)
- **Campaign → CRM → Deal Pipeline:** Lead generation feeds directly into CRM as deals

---

## 2. Navigation & URL Map

All URLs follow the pattern: `https://app.aiacquisition.com/dashboard/{workspace-id}/{module}`

| Section | Module | URL Slug | Description |
|---|---|---|---|
| — | Dashboard | `/` | Business performance overview |
| — | CRM | `/crm` → `/crm/deals` | Full CRM with kanban pipeline |
| — | AI Consultant | `/ai-growth-consultant` | Jordan AI chat interface |
| Go-To-Market | Niche Researcher | `/niche-researcher` | AI-powered niche analysis |
| Go-To-Market | Offer Creator | `/offer-creator` | Offer generation wizard |
| Marketing | Cold Email Agent | `/cold-email-campaign-agent` | Campaign manager + SDR |
| Marketing | AI Ads Maker | `/ai-ads-maker` | Video script generator |
| Sales | AI SDR Inbox | `/ai-sdr` | Autonomous email reply inbox |
| Sales | Sales Call Analyzer | `/sales-call-analysis` | AI call scoring & insights |
| Sales | Growth Plan Creator | `/growth-plan-creator` | Prospect-specific growth docs |
| — | Resources | `/resources` | 8-tool resource hub |
| — | Settings | `/settings` | Workspace & personal config |

### Resource Sub-URLs

| Resource | URL Slug |
|---|---|
| Cold Email Writer | `/resources/cold-email-writer` |
| Pricing Calculator | `/resources/pricing-calculator` |
| AI Tools Directory | `/resources/ai-tools-directory` |
| Hiring Portal | `/resources/hiring-portal` |
| Top 50 Niches | `/resources/top-50-niches` |
| Prompts Directory | `/resources/prompts-directory` |
| AI Automation Creator | `/resources/n8n-workflow-creator` |
| AI Automation Library | `/resources/n8n-workflow-library` |

### Settings Sub-URLs

| Setting | URL Slug |
|---|---|
| Profile | `/settings/profile` |
| Appearance | `/settings/appearance` |
| Security | `/settings/security` |
| Availability | `/settings/availability` |
| Email & Calendar | `/settings/email-calendar` |
| Conferencing | `/settings/conferencing` |
| General (Workspace) | `/settings/workspace` |
| Members | `/settings/members` |
| Billing | `/settings/billing` |
| Cold Email Agent | `/settings/cold-email-agent` |
| AI SDR Agent | `/settings/ai-sdr-agent` |
| Sales Call Analyzer | `/settings/sales-call-analyzer` |
| Your Niche & Offer | `/settings/niche-offer` |
| Cold Email Blocklist | `/settings/blocklist` |
| Email Templates | `/settings/email-templates` |

---

## 3. Dashboard — KPIs & Metrics

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi`

The dashboard provides a real-time business performance overview scoped to the workspace and a configurable time window (default: Last 30 days).

### KPI Cards (Top Row)

| Metric | Current Value | Trend |
|---|---|---|
| Contacted Leads | 5,483 | +100.00% |
| Positive Replies | 37 | +100.00% |
| Booked Calls | 10 | +100.00% |
| Cash Collected | $0 | 0.00% |

### Conversion Rate Gauges

| Metric | Value | Trend | Target |
|---|---|---|---|
| Positive Reply Rate | 0.67% | +100.00% | 2% |
| Booked Call Rate | 27.03% | +100.00% | 25% |

### Pipeline Performance (Bar Charts)

| Metric | Value | Trend |
|---|---|---|
| Sales Calls | 0 | 0.0% |
| Closed Deals | 0 | 0.0% |

### Sales Performance Summary

| Metric | Value |
|---|---|
| Sales Calls Taken | 0 |
| Close Rate | 0.00% |

**Chart Range:** Mar 9 – Apr 8 (rolling 30 days)

---

## 4. CRM Module

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/crm`

Full-featured CRM with 6 tabs. Auto-populated from Cold Email Agent campaign responses.

### 4.1 Tabs

| Tab | URL | Purpose |
|---|---|---|
| Deals | `/crm/deals` | Kanban pipeline board |
| Appointments | `/crm/appointments` | Calendar scheduling |
| People | `/crm/people` | Contact database |
| Companies | `/crm/companies` | Company records |
| Tasks | `/crm/tasks` | Task management |
| Notes | `/crm/notes` | Free-form notes |

### 4.2 Deals — Pipeline Stages (Kanban)

The pipeline is configured for a **Podcast-led outbound → Discovery → Sales Call** motion. Current pipeline: **34 total deals, $0 Total Value**.

| Stage | Deals | Notes |
|---|---|---|
| Intro / Pre-Podcast Call | 2 | Initial outreach booked |
| Positive Response | 8 | Replied positively, not yet booked |
| Positive Response Ghosting | 1 | Went cold after positive reply |
| Pre-Podcast Call Booked | 7 | Call scheduled |
| Pre-Podcast Call No-Show | 0 | — |
| Pre-Podcast Call Cancelled | 0 | — |
| Pre-Podcast Call Unqualified | 0 | — |
| Pre-Podcast Call Transitioned | 1 | Moved to next stage |
| Podcast Call Booked | 1 | Podcast call confirmed |
| Podcast Call No-Show | 0 | — |
| Podcast Call Cancelled | 0 | — |
| Podcast Call Unqualified | 0 | — |
| Podcast Call Not Transitioned | 0 | — |
| Discovery Call Booked | 0 | — |
| Discovery Call Not Transitioned | 0 | — |
| Discovery Call No-Show | 0 | — |
| Discovery Call Cancelled | 0 | — |
| Discovery Call Unqualified | 0 | — |
| Sales Call Booked | 0 | — |
| Sales Call Not Transitioned | 0 | — |
| Sales Call No-Show | 0 | — |
| Sales Call Cancelled | 0 | — |
| Sales Call Not Closed | 0 | — |
| Follow-up Booked | 0 | — |
| Awaiting Payment | 0 | — |
| Deal Won | 0 | — |
| Deal Lost | 14 | Lost/declined |
| Future Deal | 0 | — |

### 4.3 Deal Card Data Fields

Each deal card contains:
- Deal name (free text)
- Contact name
- Source (e.g., Cold Email Campaign, AI SDR Response, email)
- Pipeline stage
- Deal value ($)
- Age (time since creation)
- Last activity timestamp
- Action menu (open, edit, delete, move)

### 4.4 People — Contact Fields

| Field | Type |
|---|---|
| Name | Text |
| Title | Text |
| Email | Email |
| Phone | Phone |
| Tags | Multi-select |

- Import via CSV: **Import People** button
- Add manually: **+ Add Person** button
- Pagination: 50 rows per page
- Filters: Sort, Filter, Search

---

## 5. AI Consultant

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/ai-growth-consultant`

An AI chat interface powered by **Jordan AI** — a specialist in cold email, sales, and business growth.

### Mode Tabs

| Mode | Purpose |
|---|---|
| Plan | Strategy, roadmapping, GTM planning |
| Automate | Automation workflows, tool setup, integrations |
| Analyze | Data analysis, performance review, insights |
| Learn | Education, frameworks, skill building |

### Sample Pre-Built Prompts

- Write a cold email sequence for reaching financial advisors
- Create LinkedIn ads targeting SaaS founders
- Help me fix email deliverability issues in Instantly
- What's a compelling offer for HVAC companies?
- Build a growth plan for a $3M/year service business

### Capabilities

- Drag & drop file upload (PDFs, docs, transcripts)
- Multi-turn conversation history
- Context-aware responses using workspace data
- Persona: Jordan AI — expert in outbound sales, GTM, AI automation

---

## 6. Go-To-Market Layer

### 6.1 Niche Researcher

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/niche-researcher`

A 2-step AI wizard that identifies the optimal market niche for the user's background and skills.

**Step 1 — Professional Background**

| Field | Required | Description |
|---|---|---|
| Professional Background & Experience | Optional | Past roles, industries worked in |
| Key Professional Skills & Expertise | Optional | Strongest skills and competencies |

**Step 2** — AI generates niche recommendations based on inputs

**History Table Fields:** Date, Status (Completed/Pending), Name, Email

**Current Usage:** 2 completed submissions (Mar 9, Mar 12)

---

### 6.2 Offer Creator

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/offer-creator`

A 2-step wizard to generate a compelling B2B service offer. Supports two input modes:

**Input Mode Toggle:** Manual Input | From Transcript

**Step 1 — Professional Background & Results**

| Field | Required | Guidance |
|---|---|---|
| Specific results achieved | Optional | Quantifiable metrics, client successes, tangible outcomes |
| Skills developed for business growth | Optional | Sales, marketing, operations, leadership |
| Processes / systems implemented | Optional | Standardized workflows, methodologies, frameworks |
| Specific industry knowledge | Optional | Specialized knowledge and industry insights |

**Step 2** — AI generates offer positioning, pricing, and messaging

**History Table Fields:** Date, Status, Name, Email
**Current Usage:** 2 completed submissions (Mar 9, Apr 5)

---

## 7. Marketing Layer

### 7.1 Cold Email Agent

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/cold-email-campaign-agent`

The core outbound engine. Runs autonomous cold email campaigns and tracks all response metrics.

**Aggregate Stats (All Time — YU-Ex-Gen-AI workspace):**

| Metric | Value |
|---|---|
| Contacted Leads | 7,955 |
| Positive Replies | 25 |
| Positive Reply Rate | 0.46% |
| Booked Call Rate | 24.00% |
| Calls Booked | 6 |

**Campaign List Columns:** Campaign Name, Status, Leads Contacted, Replies, Positive Replies, Calls Booked, Started At

**Active Campaigns:**

| Campaign | Status | Leads Contacted | Replies | Positive Replies | Calls Booked | Started |
|---|---|---|---|---|---|---|
| YU-Next-Gen-AI:Podcast-04-03-26 | Draft | 0 | 0 | 0 | 0 | Apr 02, 2026 |
| YU-Next-Gen-AI:Podcast-03-31-26 | Active | 880 | 15 (1.70%) | 2 (0.23%) | 1 | Mar 30, 2026 |
| YU-Next-Gen-AI:Podcast-03-16-26 | Active | 4,603 | 119 (2.59%) | 23 (0.50%) | 5 | Mar 11, 2026 |

**Configuration (via Settings > Cold Email Agent):**
- Feature Credits (usage-based metering)
- Workspace Lead Limit
- Email Accounts management (connected sending accounts)
- Campaign behavior settings

**Campaign Statuses:** Draft, Active, Paused, Completed

---

### 7.2 AI Ads Maker

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/ai-ads-maker`

A 6-step **Video Script Writer** wizard that generates video ad scripts.

**Step 1 — Your Identity & Business**

| Field | Required | Guidance |
|---|---|---|
| Business Name | Required | Official business/brand name |
| Your Name & Title/Expertise | Optional | Used if personal expertise is a selling point |
| Brief Business Overview | Required | 1-2 sentence description of what the business does |

**Steps 2–6** — Audience, Pain Points, Offer, CTA, Script Output (AI-generated)

**History Table:** Status, Member, Date, Name, Email
**Current Usage:** 0 submissions

---

## 8. Sales Layer

### 8.1 AI SDR Inbox

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/ai-sdr`

An autonomous email inbox for managing and responding to outbound campaign replies using AI.

**Layout:** Three-panel (folder list | email list | email preview)

**Folder Structure:**

| Folder | Count | Description |
|---|---|---|
| AI SDR Disabled | 0 | SDR is currently inactive |
| Favourites | 0 | Starred/priority emails |

**Filter:** All Statuses (dropdown)
**Search:** Full-text mail search
**Settings:** Via gear icon (top right)

**AI SDR Configuration (Settings > AI SDR Agent):**
- Agent behavior rules
- Response tone/style
- Escalation thresholds

**Current State:** AI SDR is **Disabled** — no emails in inbox.

---

### 8.2 Sales Call Analyzer

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/sales-call-analysis`

AI-powered call recording analysis. Scores calls across multiple dimensions and tracks performance improvement over time.

**Score Cards by Call Type:**

| Call Type | Score | Trend | Basis |
|---|---|---|---|
| Discovery Calls | 2.0 / 10 | +0.4 | Based on 2 calls |
| Interview Calls | No Data Yet | — | Need ≥2 calls |
| Sales Calls | No Data Yet | — | Need ≥2 calls |
| Podcast Calls | 3.9 / 10 | -0.5 | Based on 4 calls |

**Call Log Columns:** Type, Meeting/Call (Name + Company + Call Type), Status, Date, Duration, Insights, Progress

**Call Records:**

| Call | Company | Call Type | Status | Date | Insights | Progress |
|---|---|---|---|---|---|---|
| Tariq Alinur | BrainCX AI | Podcast Call | Completed | 23h ago | Available | Improving |
| Daniel Walsh | Exepron | Discovery Call | Completed | Apr 7, 12:00 PM | Available | Improving |
| Daniel Walsh | Exepron | Podcast Call | Completed | Apr 1, 4:45 PM | Available | Improving |
| Erik Bergeman | HCL Software | Podcast Call | Completed | Mar 30, 7:15 PM | Available | Improving |
| Doron S | Per Diem | Podcast Call | Completed | Mar 29, 12:00 AM | Available | Stable |
| Erik Bergeman | HCL Software | Podcast Call | Completed | Mar 25, 12:00 AM | Available | — |

**Input Types:** Recording upload, manual form submission
**New Call Button:** Opens call submission form
**Progress States:** Improving, Stable, Declining

---

### 8.3 Growth Plan Creator

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/growth-plan-creator`

A 6-step AI wizard that generates a **customized growth plan document** for a specific prospect. Used in pre-sales and discovery call prep.

**Step 1 — Your Information & Prospect Basics**

| Field | Section | Description |
|---|---|---|
| Your Company | Your Info | Seller's company (e.g., YU-Ex-Gen-AI) |
| Prospect Company Name | Prospect Basics | Exact name — used throughout the document |
| Industry | Prospect Basics | Dropdown: SaaS/Software, E-commerce, Professional Services, Healthcare, Real Estate, Manufacturing, Financial Services, Education, Restaurant/Hospitality, Fitness/Wellness, Creative/Agency, Non-profit, Other |
| Please specify industry | Prospect Basics | Free text for "Other" |
| Contact Name | Prospect Basics | Must match name on transcript if using call input |
| Contact Title | Prospect Basics | e.g., CEO, CMO, Founder — AI tailors language accordingly |

**Steps 2–6:** Challenges, Goals, Current State, Competitive Landscape, Growth Plan Output

**Output:** A fully personalized, company-specific growth plan document

**⚠️ Important:** If providing a transcript, the Contact Name must match the prospect speaking on the call.

**History:** No submissions yet (workspace is being set up)

---

## 9. Resources Hub

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/resources`

8 standalone tools and reference libraries.

---

### 9.1 Cold Email Writer

**URL:** `/resources/cold-email-writer`

Generates cold email copy for specific outreach methods and audiences.

**Step 1 — Email Method & Target**

| Field | Options |
|---|---|
| Cold Email Method | Interview, Podcast, AI Audit, Direct, Masterclass |
| Target Industry | Free text |
| Target Role | Free text |
| Sender: First Name, Last Name, Title, Company Name, Email, Address | Required |
| Contact Info | Optional |

**Step 2** — AI generates email sequences based on selected method

**Variation Mode:** "Create Variations From Existing Script" toggle at top

**Current Usage:** 1 completed submission (Mar 9)

---

### 9.2 Pricing Calculator

**URL:** `/resources/pricing-calculator`

A live ROI calculator to set data-driven pricing for AI services.

**Two Modes:**
1. **Revenue-Generated Services** — For cold email, lead gen, ads, database reactivation, content marketing
2. **Cost Saving Services** — For automation, efficiency, headcount reduction

**Revenue Package Configuration:**

| Input | Default | Description |
|---|---|---|
| Monthly Fixed Fee | $4,400 ($147/day) | Recurring retainer |
| One-Time Setup Fee | $5,000 | Onboarding/setup |
| Bonus Structure | Revenue Share (%) | Can switch to flat bonus |
| Revenue Share % | 10% | Of generated revenue |
| Project Revenue Increase ($) | $500,000 | Client's promised revenue lift |

**Package Summary Output (at defaults):**

| Line Item | Value |
|---|---|
| Setup Fee | $5,000 |
| Monthly Fixed Fee | $4,400 |
| Revenue Share (10%) | $50,000 |
| **Total Package Value** | **$107,800** |
| Monthly Equivalent | $8,983/mo |

**ROI Framing:**
- Revenue Guarantee: 3.6x ROI
- Client invests $107,800, receives $500,000 in new revenue
- Net to client: $392,200

---

### 9.3 AI Tools Directory

**URL:** `/resources/ai-tools-directory`

Curated directory of 60+ AI tools with tags and descriptions. Searchable.

**Tool Categories (Tags Used):**

`AI` · `CRM` · `LLMs` · `Sales` · `Video Ads` · `UGC` · `TextToSpeech` · `VoiceCloning` · `CAD` · `LinkedIn` · `Content Creation` · `Workflow Automation` · `No-Code` · `AI Agents` · `Email` · `Video Editing` · `Transcription` · `Design` · `Coding` · `Meeting Assistant` · `Research` · `Data Analysis` · `Image Generation` · `Voice` · `Web Development`

**Key Tools by Use Case:**

| Use Case | Tools |
|---|---|
| AI Assistants | Claude, ChatGPT, DeepSeek V3, Jordan AI |
| CRM / Sales | Attio, Cargo AI, Gong (via integrations) |
| Video Ads / UGC | Arcads, MakeUGC, Potion, HeyGen, Captions.ai |
| Outreach / Email | Bluecast, Shortwave, Superhuman, Sendspark |
| Transcription | Fathom, Fireflies.ai, Scribe, Transcript LOL |
| Automation / No-Code | Zapier, Make, Lindy AI, Lazy AI, Caret, Marblism |
| Content Creation | OpusClip, Descript, Swell AI, ReelFarm |
| Code / Dev | Cursor, Replit, Lovable, Rork, Create.xyz |
| Research | NotebookLM, Exa Search, Supermemory |
| Design | Framer, Uizard, Relume Library, Playground AI |
| Voice | Vapi.ai, AI Voice, Wispr Flow |
| LinkedIn | Bluecast, Browser Use |
| Browser Automation | Browser Use |
| Meeting Notes | Fathom, Fireflies.ai, Granola, Rewind |

---

### 9.4 Hiring Portal

**URL:** `/resources/hiring-portal`

Tool to find and hire top talent. (Content requires authentication to deep-crawl further.)

---

### 9.5 Top 50 Niches

**URL:** `/resources/top-50-niches`

Ranked list of the 50 most profitable niches for AI agency services, with market data.

**Column Schema:**

| Column | Description |
|---|---|
| Rank | 1–50 |
| Niche | Industry/vertical name |
| Example Companies | 3 representative companies |
| $1M+/Year | Whether companies in niche spend $1M+/yr on services |
| Easy To Target | Targetability rating |
| Market Sophistication | Buyer sophistication (1–5 stars) |
| CAGR | Compound annual growth rate |

**Top 10 Niches:**

| Rank | Niche | CAGR | Sophistication |
|---|---|---|---|
| 1 | AI Consulting Companies | ~20% | ⭐⭐⭐⭐ |
| 2 | Cybersecurity Agencies | ~12% | ⭐⭐⭐⭐ |
| 3 | FinTech | ~16% | ⭐⭐⭐⭐ |
| 4 | Wealth Management Agencies | ~10% | ⭐⭐⭐⭐ |
| 5 | Business Intelligence & Analytics | ~10–12% | ⭐⭐⭐⭐ |
| 6 | Sales Tech | ~11% | ⭐⭐⭐ |
| 7 | MarTech | ~12% | ⭐⭐⭐ |
| 8 | Cloud Computing & Storage | ~13% | ⭐⭐⭐⭐ |
| 9 | PropTech | ~9% | ⭐⭐⭐ |
| 10 | EdTech | ~7–9% | ⭐⭐⭐ |

**Highest CAGR Niches:** AI Consulting (~20%), Quantum Computing Consulting (~18–22%), Mobile App Development (~18%), Podcast Production (~16–20%), Health Tech (~15–17%)

---

### 9.6 Prompts Directory

**URL:** `/resources/prompts-directory`

Library of ready-to-use AI prompts. Searchable, tagged, downloadable.

**Available Prompts (partial list):**

| Prompt | Category | Use Case |
|---|---|---|
| Scroll-Stopping Ad Creatives SOP Generator | SOP Templates, Video Advertising | Thumb-stop video ads |
| Pre-Call Email Sequence Generator | Email Marketing, Pre-Call Nurturing | 3-email follow-up (booking → 4hr → 24hr) |
| Opt-In Sequence Generator | Email Marketing, Lead Nurturing, Funnel Optimization | 5-email VSL funnel opt-in series |
| Talking Head VSL Script Generator | VSL Creation, Direct Response Copywriting | 12–15 minute talking-head video scripts |
| B2C/B2B VSL Script | VSL, Direct Response | Full VSL copy from offer documentation |
| B2B Offer 4-Action Developer | Research, Offer Strategy | 4-action item development |

**Actions per prompt:** Copy Prompt, Download Prompt

---

### 9.7 AI Automation Creator (n8n Workflow Creator)

**URL:** `/resources/n8n-workflow-creator`

A 2-step form that generates a custom n8n automation workflow configuration.

**Step 1 — Basic Information**

| Field | Description |
|---|---|
| Email Address | For sending the workflow configuration |
| Full Name | User identity |
| Workflow Name | e.g., "Daily Sales Report", "New Lead Notification" |
| Workflow Description | Goals, steps, logic of the workflow in detail |

**Step 2** — Additional workflow parameters

**Output:** An n8n workflow JSON sent to the user's email

---

### 9.8 AI Automation Library (n8n Workflow Library)

**URL:** `/resources/n8n-workflow-library`

20 pre-built downloadable n8n workflow templates. Searchable.

**Complete Template Index:**

| # | Workflow | Tags | Use Case |
|---|---|---|---|
| 1 | Automated LinkedIn DM System | LinkedIn, Outreach, Automation | AI-personalized LinkedIn messages at scale |
| 2 | Gmail Auto-Label & Response Drafter | Gmail, AI, Email Automation | Smart labels + AI draft replies |
| 3 | Long Form YouTube AI Creator | YouTube, AI, Video Generation | Auto-generate & upload Top 10 videos |
| 4 | AI Sales Call Analyzer | Sales, AI Analysis, Call Recording | Transcribe + score calls → Google Sheets |
| 5 | Sales Pipeline Automation | Sales Pipeline, Lead Scoring, CRM | Auto-qualify leads, follow-ups, deal progression |
| 6 | WhatsApp AI Sales Chatbot | WhatsApp, AI Chatbot, Sales | Inbound sales qualification via WhatsApp |
| 7 | Automated Sales Meeting Prep | Sales Prep, AI Research, Web Scraping | Auto-brief prospects before meetings |
| 8 | Inbound AI SDR | AI SDR, Cold Email, Lead Enrichment | End-to-end inbound SDR with multi-step follow-up |
| 9 | AI Social Media Content Generator | Social Media, AI Content, Marketing | Generate + schedule multi-platform content |
| 10 | AI Customer Churn Predictor | Churn Prediction, AI Analytics, Customer Retention | Predict churn → trigger retention campaigns |
| 11 | AI Lead Qualification (Google Sheets) | Lead Qualification, AI, Google Sheets | Score & qualify leads → store in Sheets |
| 12 | AI-Powered Short-form Video Clip Generator | Video Editing, AI, Social Media | Auto-generate + publish short-form clips |
| 13 | AI Researched Newsletter Workflow | Newsletter, AI, Content Marketing | Form → fully-researched newsletter → email |
| 14 | AI Review Response Generator | Review Management, AI Responses, Reputation | Auto-respond to reviews across platforms |
| 15 | AI Automated Talent Evaluation | HR, Recruiting, Automation | CV intake → AI assessment → Google Sheets |
| 16 | AI Content Repurposing Engine | Content Marketing, AI Transformation, Multi-format | Long-form → social, newsletter, video, more |
| 17 | Short-Form Video Content Media Engine | Video, Content, Automation | OpenAI + Flux + Kling + ElevenLabs pipeline |
| 18 | Customer Support Ticket Routing | Customer Support, Ticket Management | Auto-route tickets by priority/expertise |
| 19 | Weekly Marketing Reports | Analytics, Reporting, Automation | Google Analytics + Ads + Meta Ads → weekly report |
| 20 | Twitter/X Viral Tweets Scraper | Twitter, Social Media, Data Collection | Scrape + analyze viral tweets by criteria |

---

## 10. Settings & Configuration

**URL:** `https://app.aiacquisition.com/dashboard/yu-ex-gen-ai-bFTPi/settings`

Two-tier settings: **Personal** (user-level) and **Workspace** (org-level).

### Personal Settings

| Setting | Purpose |
|---|---|
| Profile | Name, email, profile picture, danger zone (delete account) |
| Appearance | Theme (light/dark), display preferences |
| Security | Password, 2FA, session management |
| Availability | Working hours, timezone for booking |
| Email & Calendar | Connect email accounts (for AI SDR, call sync) |
| Conferencing | Zoom, Google Meet, Teams integration |

### Workspace Settings

| Setting | Purpose |
|---|---|
| General | Workspace name, logo, general config |
| Members | Invite, manage, remove team members |
| Billing | Subscription plan, payment, usage credits |
| Cold Email Agent | Feature credits, workspace lead limit, provider config |
| AI SDR Agent | SDR behavior rules, tone, escalation settings |
| Sales Call Analyzer | Scoring criteria, call type definitions |
| Your Niche & Offer | Saved niche and offer for AI personalization |
| Cold Email Blocklist | Domains/emails excluded from outreach |
| Email Templates | Saved email template library |

---

## 11. Data Models & Entities

### Deal

```typescript
interface Deal {
  id: string;
  name: string;
  contactName: string;
  contactId: string;
  companyId?: string;
  source: 'Cold Email Campaign' | 'AI SDR Response' | 'email' | 'manual';
  stage: DealStage;
  value: number; // in USD
  age: number; // days
  lastActivity: Date;
  createdAt: Date;
  campaignId?: string;
  workspaceId: string;
}

type DealStage =
  | 'intro-pre-podcast-call'
  | 'positive-response'
  | 'positive-response-ghosting'
  | 'pre-podcast-call-booked'
  | 'pre-podcast-call-no-show'
  | 'pre-podcast-call-cancelled'
  | 'pre-podcast-call-unqualified'
  | 'pre-podcast-call-transitioned'
  | 'podcast-call-booked'
  | 'podcast-call-no-show'
  | 'podcast-call-cancelled'
  | 'podcast-call-unqualified'
  | 'podcast-call-not-transitioned'
  | 'discovery-call-booked'
  | 'discovery-call-not-transitioned'
  | 'discovery-call-no-show'
  | 'discovery-call-cancelled'
  | 'discovery-call-unqualified'
  | 'sales-call-booked'
  | 'sales-call-not-transitioned'
  | 'sales-call-no-show'
  | 'sales-call-cancelled'
  | 'sales-call-not-closed'
  | 'follow-up-booked'
  | 'awaiting-payment'
  | 'deal-won'
  | 'deal-lost'
  | 'future-deal';
```

### Campaign

```typescript
interface Campaign {
  id: string;
  name: string; // e.g., "YU-Next-Gen-AI:Podcast-03-16-26"
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  leadsContacted: number;
  replies: number;
  positiveReplies: number;
  callsBooked: number;
  replyRate: number; // percentage
  positiveReplyRate: number; // percentage
  bookedCallRate: number; // percentage
  startedAt: Date;
  workspaceId: string;
}
```

### SalesCall

```typescript
interface SalesCall {
  id: string;
  type: 'Recording' | 'Manual';
  callType: 'Discovery Call' | 'Interview Call' | 'Sales Call' | 'Podcast Call';
  contactName: string;
  companyName: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  date: Date;
  duration?: number; // minutes
  score?: number; // 0-10
  insights: 'Available' | 'Pending' | 'Not Available';
  progress: 'Improving' | 'Stable' | 'Declining' | null;
  workspaceId: string;
}
```

### WizardSubmission (shared pattern)

```typescript
interface WizardSubmission {
  id: string;
  toolSlug: string; // e.g., 'niche-researcher', 'offer-creator'
  memberId: string;
  memberName: string;
  memberEmail: string;
  status: 'Completed' | 'Pending' | 'Failed';
  submittedAt: Date;
  inputs: Record<string, string>; // Step inputs
  output?: string; // AI-generated content
  workspaceId: string;
}
```

---

## 12. Platform Workflow — End-to-End GTM Engine

The complete flow from market research to closed deal:

```
Step 1: RESEARCH
  └─► Niche Researcher → Identify optimal target market
  └─► Top 50 Niches → Validate market size & CAGR

Step 2: OFFER DESIGN
  └─► Offer Creator → Generate B2B offer positioning & messaging
  └─► Pricing Calculator → Set ROI-based pricing

Step 3: OUTREACH ASSET CREATION
  └─► Cold Email Writer → Generate cold email sequences per method
  └─► AI Ads Maker → Generate video ad scripts for paid acquisition
  └─► Prompts Directory → Pull relevant AI prompts for copy

Step 4: CAMPAIGN EXECUTION
  └─► Cold Email Agent → Launch campaigns (target: 1,000–5,000 leads)
       ├─► Track: Leads Contacted, Replies, Positive Replies, Calls Booked
       └─► CRM Auto-Population: Positive replies → Deals in pipeline

Step 5: REPLY MANAGEMENT
  └─► AI SDR Inbox → AI auto-responds to replies
       ├─► Route to appropriate CRM stage
       └─► Escalate hot leads for human follow-up

Step 6: CALL PREPARATION
  └─► Growth Plan Creator → Generate prospect-specific growth plan
  └─► AI Consultant → Research prospect, prepare objection handling

Step 7: CALL EXECUTION & ANALYSIS
  └─► Sales Call Analyzer → Upload recording
       ├─► AI scores across 6 dimensions
       ├─► Identifies strengths, weaknesses, objections
       └─► Tracks progress: Improving / Stable / Declining

Step 8: PIPELINE MANAGEMENT
  └─► CRM Deals → Move through 27-stage pipeline
       ├─► Discovery Call → Sales Call → Awaiting Payment → Deal Won
       └─► Lost deals → Retrospective via AI Consultant

Step 9: SCALING
  └─► AI Automation Library → Deploy n8n workflows for scale
  └─► AI Tools Directory → Integrate best-in-class point solutions
  └─► Hiring Portal → Add team capacity
```

---

## 13. Pre-Sales Solution Map

Use this map to quickly identify which XAAI module solves a prospect's stated problem.

| Prospect Pain | XAAI Module | Value Prop |
|---|---|---|
| "We don't know what market to target" | Niche Researcher | AI identifies optimal niche based on your background |
| "Our offer isn't converting" | Offer Creator | AI generates compelling offer from your results/skills |
| "We can't generate enough leads" | Cold Email Agent | 1,000–5,000 leads contacted per campaign autonomously |
| "Our reply rate is too low" | Cold Email Writer + Agent | AI-crafted sequences by method (Podcast/Interview/Direct) |
| "We waste time on unqualified replies" | AI SDR Inbox | AI handles all replies, qualifies, escalates hot leads |
| "We don't know why deals don't close" | Sales Call Analyzer | AI scores calls, identifies patterns, tracks improvement |
| "Each prospect pitch is generic" | Growth Plan Creator | Personalized growth plan per company per call |
| "We can't afford a marketing team" | AI Ads Maker | AI generates video ad scripts in minutes |
| "We need to automate more" | AI Automation Library | 20 pre-built n8n workflows ready to deploy |
| "We don't know how to price our services" | Pricing Calculator | ROI-based pricing with 3.6x return framing |
| "We need a CRM that fits our sales motion" | CRM (27-stage pipeline) | Built-in pipeline configured for podcast/discovery motion |
| "We need help with AI strategy" | AI Consultant (Jordan AI) | Expert AI chat for GTM planning, automation, analysis |

---

## 14. Engineering Notes & Integration Points

### Known Integration Surfaces

| Integration | Module | Direction |
|---|---|---|
| Instantly.ai | Cold Email Agent | Outbound: sends emails via connected sending accounts |
| Zoom | Sales Call Analyzer | Inbound: auto-imports call recordings |
| Google Sheets | n8n Workflows (Library) | Bidirectional: lead data, call scores, reports |
| Google Analytics | n8n Workflows (Library) | Inbound: marketing performance data |
| Google Ads / Meta Ads | n8n Workflows (Library) | Inbound: ad performance for weekly reports |
| Gmail | AI SDR Inbox + n8n | Bidirectional: email send/receive |
| LinkedIn | n8n (LinkedIn DM System) | Outbound: AI-personalized DMs |
| WhatsApp | n8n (WhatsApp Chatbot) | Inbound: sales qualification |
| n8n | AI Automation Creator/Library | Export: custom workflow JSON configs |
| Calendar Systems | Settings > Availability | Bidirectional: booking integration |
| Conferencing Tools | Settings > Conferencing | Bidirectional: Zoom/Meet/Teams |

### CRM Auto-Population Flow

```
Cold Email Campaign
  → Lead replies positively
    → AI SDR classifies as "Positive Reply"
      → Deal created in CRM
        → Stage: "Positive Response"
          → AI SDR follows up or escalates
            → Stage: "Pre-Podcast Call Booked" (if call scheduled)
```

### Workspace ID Pattern

All platform data is scoped to a **workspace ID** — a human-readable slug like `yu-ex-gen-ai-bFTPi`. This is embedded in every URL and acts as the primary tenant identifier.

### Feature Credit System

The Cold Email Agent operates on a **credit-based model**:
- Credits consumed per: lead contacted, AI SDR response, call analysis
- Workspace Lead Limit: hard cap on total contacts per billing period
- Credits and limits are managed in Settings > Cold Email Agent

### Call Scoring Dimensions (6 Metrics)

The Sales Call Analyzer scores across 6 key metrics (exact dimensions visible per call in the Insights view). Scores are on a 0–10 scale. Minimum of 2 calls required before aggregate scores display.

### AI Model — Jordan AI

The AI Consultant persona is named **Jordan AI** — a specialized AI agent trained on outbound sales, cold email, GTM strategy, and B2B agency growth. It is context-aware of the workspace's niche, offer, and campaign data.

---

*Blueprint compiled by XAAI Platform Engineering | YU-Ex-Gen-AI workspace*
*Last crawled: 2026-04-08 | All data reflects live platform state*
