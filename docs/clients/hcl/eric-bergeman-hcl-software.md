# Client: Eric Bergeman — HCL Software

> Pre-Sales File | YU-Next Gen AI | Pre-Sales Engineer View

---

## 1. Client Snapshot

| Field | Detail |
|---|---|
| **Client Name** | Eric Bergeman (Erik Bergeman) |
| **Company** | HCL Software |
| **Role** | Customer Success Executive & Sales Director |
| **Email** | erik.bergeman@hcl-software.com |
| **LinkedIn** | https://www.linkedin.com/in/erikbergeman/ |
| **Company Website** | https://www.hcl-software.com |
| **Company Revenue** | >$1 Billion |
| **Industry** | Enterprise Software, B2B SaaS, eCommerce Platform |
| **Call Type** | Podcast Interview → Discovery Call Scheduled |
| **Stage** | Discovery |
| **Source** | Podcast: AI Transitions |

---

## 2. What HCL Software Does

HCL Software is a **$1B+ enterprise software company** that acquired IBM's software product portfolio in 2019. Eric leads sales for **HCL Commerce** — an enterprise-grade ecommerce platform spanning both B2B and B2C.

- Serves enterprise clients who require **on-prem, hybrid cloud, and hyperscaler** deployments simultaneously
- HCL Commerce supports B2B complexity: contract pricing, catalog entitlements, quote-to-order, ERP integration (SAP, Oracle, Blue Yonder)
- Also supports B2C: personalization, AI-powered search, frequently-bought-together, editorial content via Studio CMS
- Grew from IBM's software engineering roots — **"frugal development" culture** (disciplined, disciplined, not VC-funded)
- Mid-transformation: decomposing a **30-year-old J2EE monolith** into composable **Package Business Capabilities (PBCs)** — Gartner's model
- **5 embedded AI models** already live — personalized recommendations, frequently bought together, catalog enrichment, and more
- Moving from cyclical quarterly releases to continuous sprint-based PBC releases
- Large base of **enterprise clients who refuse SaaS** — they want on-prem control and own their data center

---

## 3. Pain Points Identified

### Pain Point 1 — Monolith-to-Composable Architecture Is Hard, Slow, and Risky

> *"How do you take transactional integrity and apply it in these new models? It's not easy."*
> *"AI can produce code, but does it produce code that can manage transactional integrity and not lose orders?"*
> *"That's the worst thing you can do in a commerce platform — lose a transaction."*

- Original stack: J2EE monolith on WebSphere Application Server — well-integrated, but unscalable
- Containerized but still monolithic under the hood — scaling means replicating the entire app, not just the bottleneck
- Now decomposing to 18–20 PBCs, each immutable, connected via APIs, GraphQL, Kafka events
- Core risk: transactional integrity across distributed services — compensating transactions do not always work
- DevOps complexity exploded: "We went from 20 developers to needing 150 SRE/DevOps people"
- AI is accelerating the migration (code generation, GraphQL integrations) but hallucinations are a live threat

### Pain Point 2 — AI Hallucinations Threaten Commerce Order Integrity

> *"AI can produce code, but does it produce code that actually can manage transactional integrity and not lose orders? That's the biggest problem with AI."*

- AI code generation used to accelerate PBC decomposition and GraphQL integration work
- Risk: hallucinated logic within ordering, cart, fulfillment, or ERP-sync code = lost orders, broken transactions
- No current systematic way to monitor, score, or validate AI-generated code quality in production workflows
- Human-in-the-loop still required — but does not scale across 18–20 independent PBC development tracks
- Eric explicitly asked: "Would you consider a solution that has already solved that problem?"

### Pain Point 3 — B2B Clients Are Stuck in "Swivel Chair" Operations

> *"Today in a lot of B2B, they're still doing swivel chair — I get the order in ecommerce, then I open SAP and cut and paste the order."*
> *"I have clients who look out the front of their building and see the data center next door and say, that is where my stuff is."*

- HCL's enterprise B2B clients have not automated the commerce → ERP handoff (SAP, Oracle, Blue Yonder)
- Manual order entry is standard practice at large accounts — human touches every transaction
- Agent-to-agent automation (buyer agent → seller agent → ERP agent) is the aspired future state but "a little early yet"
- Eric's sales motion requires showing a credible path: from today's manual workflows to AI-automated order flows
- On-prem clients add complexity — cloud-native AI agents must also support private infrastructure

### Pain Point 4 — Selling AI ROI to Skeptical Enterprise Buyers Is Hard

> *"B2B buyers have changed because those same people are B2C buyers — they want the Amazon experience."*
> *"I have enterprise clients who told me directly: I don't want any SaaS. I want to run this on my beautiful infrastructure."*
> *"If you offer clients that have already solved those problems, that would be helpful."*

- Eric's deals require convincing CFOs and CTOs to fund a multi-year commerce modernization at enterprise scale
- Many clients are anchored to on-prem, skeptical of AI, and have long institutional memory of past project failures
- Eric needs to walk into each deal with a customized, credible AI ROI narrative — not generic slides
- No systematic tool today to generate a prospect-specific AI commerce adoption plan at Eric's scale

### Pain Point 5 — Catalog Management and Answer Engine Optimization (AEO) Gap

> *"How do I have relevant semantic information in machine-readable format so that ChatGPT, Gemini can find my products?"*
> *"Managing catalog data with 47 different versions of descriptions and synonyms — that's a real challenge."*

- HCL Commerce clients sit on decades of unstructured, inconsistent product catalog data
- New requirement: content must be **AEO-ready** — semantically structured for LLM-powered answer engines
- Generative AI can help build this content (images, descriptions, synonyms, SEO + AEO) but no standard workflow exists
- Large catalogs = expensive manual enrichment today — AI-assisted catalog content is the logical next play

---

## 4. Signals & Buying Intent

| Signal | Weight |
|---|---|
| Agreed to discovery call at end of podcast — "Send me an email" | **High** |
| Explicitly asked: "If you have clients who've already solved these problems, I'd love to hear it" | **High** |
| Said "Would you consider it as a solution?" — directly inviting a pitch | **High** |
| 30 years of enterprise software experience — informed buyer, not skeptic | **High** |
| $1B+ revenue company — real budget authority exists | **Medium** |
| "Frugal development" philosophy — will need clear ROI justification | **Context** |
| Enterprise client base requires on-prem flexibility — must confirm XAAI works in their model | **Context** |

---

## 5. XAAI Platform Tools — What to Demo

| Tool | Why It Fits HCL / Eric |
|---|---|
| **Growth Plan Creator** | Generate a customized AI commerce adoption roadmap for one of Eric's real enterprise prospects — in real time during the discovery call. This becomes his pre-sales weapon: walk into every CTO meeting with a client-specific AI modernization plan, not generic slides. |
| **Sales Call Analyzer** | Upload a recent HCL Commerce discovery call recording. AI surfaces objections, buying signals, stalled moments, and specific recommended next steps. Eric has 30 years of instinct — this adds a second set of eyes that never misses a signal. |
| **Niche Researcher** | Identify which B2B verticals (manufacturing, wholesale, industrial distribution) are modernizing commerce at the highest velocity right now — so Eric can prioritize his territory and pipeline. |
| **Cold Email Agent** | Structured outbound campaign targeting IT Directors, VP Commerce, and Digital Transformation leaders at B2B manufacturers and distributors. ABM-style targeting — not mass email — matched to Eric's enterprise buyer profile. |
| **Cold Email Writer** | Craft vertical-specific messaging for HCL Commerce's priority B2B markets — address the "I want B2C experience but I'm a B2B buyer" pain angle. Compliance-safe, peer-to-peer tone for enterprise decision-makers. |
| **AI SDR Inbox** | Autonomous reply handling for enterprise inbound — ensures every response from a Fortune 500 prospect gets an immediate, intelligent follow-up regardless of time zone or business hours. |
| **Offer Creator** | Structure HCL Commerce's AI modernization value proposition into a packaged, repeatable offer — the 5 embedded AI models, composable PBC architecture, AEO enablement — articulated clearly for non-technical executive buyers. |
| **Jordan AI — Analyze Mode** | After the first campaign: which vertical responded? Which message angle drove meetings? Which objections appeared? Use data to sharpen Eric's enterprise sales narrative for the next quarter. |

---

## 6. Recommended Demo Flow

### Demo 1: Anchor on His Exact Words

**Open with:**
"Eric, you said AI can produce code but you're not sure it can protect transactional integrity. Your B2B clients are still doing swivel chair. And your enterprise buyers want on-prem. We built this demo around those three exact problems."

**Goal:** Confirm we heard it correctly. No solution until Eric says "yes, that's it."

---

### Demo 1A: Branching Examples (From Podcast Research)

Use this branch logic immediately after Demo 1. Keep the same tool (Growth Plan Creator), but change positioning based on what Eric prioritizes.

#### Branch A — If Eric says "transactional integrity / architecture"

**Podcast signal to anchor:**
> *"How do you take transactional integrity and apply it in these new models? It's not easy."*
> *"AI can produce code, but does it produce code that actually can manage transactional integrity and not lose orders?"*

**How to position Growth Plan Creator:**
As an **architecture planning tool** for phased modernization decisions.

**Live line to use:**
"Let's use Growth Plan Creator to produce an architecture-first 90-day plan for one target account, focused on transaction integrity controls: which PBCs to phase first, where to keep stricter guardrails, and what should not be AI-generated without review."

**Expected output emphasis:**
- Capability sequencing for migration
- Transaction-risk checkpoints per phase
- Integration dependency map for ERP touchpoints
- CTO/principal engineer decision notes

#### Branch B — If Eric says "B2B clients / swivel chair"

**Podcast signal to anchor:**
> *"Today in a lot of B2B environments, they're still doing swivel chair. I get the order in ecommerce, then I open SAP and cut and paste the order."*

**How to position Growth Plan Creator:**
As a **client-facing ROI document** that translates workflow pain into a business case.

**Live line to use:**
"Let's generate a client-ready plan that starts from their current manual order flow and shows phased movement to automated handoff, with expected business impact per phase so your buyer sees value before full transformation."

**Expected output emphasis:**
- Current-state pain summary (manual handoffs, delays, errors)
- Future-state process milestones
- Business impact narrative for CFO/operations stakeholders
- Executive summary Eric can use in first and second meetings

#### Branch C — If Eric says "selling / enterprise ROI story"

**Podcast signal to anchor:**
> *"If you offer clients that have already solved those problems, that would be helpful."*
> *"I have enterprise clients who told me directly, I don't want any SaaS. I want to run this on my beautiful infrastructure."*

**How to position Growth Plan Creator:**
As Eric's **sales weapon** for enterprise stakeholder alignment.

**Live line to use:**
"Let's build one plan for your active prospect right now, tuned to their deployment preference and stakeholder map, so you walk into the next call with a customized modernization narrative instead of generic product slides."

**Expected output emphasis:**
- Stakeholder-specific messaging (CTO, principal engineer, CFO)
- ROI story tied to their environment constraints
- On-prem/hybrid-friendly transformation sequence
- First-call to proposal bridge document

---

### Demo 2: Frame Eric's Real Role

**Say this:**
"You're not just managing a product — you're selling a digital transformation story to enterprise buyers who are skeptical of AI, scared of losing orders, and anchored to infrastructure they've built over 20 years. That sales motion is hard without the right pre-sales toolkit."

**Goal:** Position XAAI as a sales productivity platform, not another tool to manage.

---

### Demo 3: Growth Plan Creator — Live, With One of His Real Prospects

**Show:** 2-step wizard → industry, current stack, revenue goal, modernization objective → AI-generated 90-day AI commerce adoption plan

**Talk track:**
"Instead of walking into a CTO meeting with slides about HCL Commerce, walk in with a customized AI commerce roadmap built around their company. Let's build one right now for one of your current prospects."

**Why it lands:** Eric is a consultative seller. This tool makes him look like the smartest person in the room without extra prep time.

---

### Demo 4: Sales Call Analyzer — Where Are Deals Dying?

**Show:** Upload a recent HCL Commerce discovery call → objection map → buying signal heat map → recommended next action

**Talk track:**
"You've been doing this for 30 years. This tool gives you a second set of eyes on every call — the ones you're too close to see yourself. It shows you exactly where the deal slowed down and what to do next."

**Why it lands:** Eric understands complex enterprise deals. Every missed signal has a cost.

---

### Demo 5: Cold Email Agent — Build the Modernization Pipeline

**Show:** Target list → Instantly.ai campaign → live metrics (leads contacted, reply rate, positive replies, calls booked)

**Talk track:**
"There are thousands of B2B manufacturers and distributors right now facing the exact pressure your clients face — but they haven't started shopping yet. Let's find them before your competitors do."

**Evidence anchor:** YU-Next Gen AI ran 13,000 leads → 4 discovery calls in 7 days → zero paid vendors.

---

### Demo 6: Close With One Clear Ask

**Say:**
"Let's run one 7-day pilot. Growth Plan Creator for three of your live prospects. Sales Call Analyzer on your most recent enterprise deal. Cold Email Agent campaign to 500 VP Commerce and IT Director targets in one HCL Commerce vertical. We review together on Day 7."

**Decision options:**
- Option A: Start the pilot now — Growth Plan Creator + Sales Call Analyzer this week
- Option B: Live walkthrough of Growth Plan Creator for one of Eric's real enterprise prospects
- Option C: Q&A call before the pilot — any questions answered before committing

---

## 7. Objection Prep

| Likely Objection | Response |
|---|---|
| "HCL has a lot of internal sales tools already" | XAAI is not an internal CRM or support ticket system. It's an AI-powered GTM layer for prospecting, call scoring, and deal-specific growth planning. It augments the process; it replaces nothing. |
| "We sell to enterprise — cold email doesn't work at that level" | At enterprise, cold email is ABM-style, not volume email. We target specific VP Commerce and digital transformation leaders at companies already modernizing. Personalization and vertical relevance is the system. |
| "I'm a success/sales leader, not an SDR" | Exactly the use case. Growth Plan Creator and Sales Call Analyzer are for experienced sellers — not to volume-blast, but to make every high-value conversation count more. |
| "We're $1B+ revenue, we don't need pipeline tools" | Even $1B companies have pipeline gaps in specific segments. The question is: which B2B verticals are you under-penetrated in right now? Niche Researcher answers that in minutes. |
| "AI hallucination is a real risk in our product — how do we trust yours?" | XAAI is a sales intelligence platform. Output is sales copy, campaign metrics, and call analysis — it does not touch your transactional systems. The hallucination risk Eric is managing lives in HCL's commerce code, not here. |
| "We need on-prem compatibility" | XAAI is a cloud-based sales platform, not infrastructure deployed on client systems. Eric uses it for his own sales motion — it has no dependency on how HCL's clients deploy their commerce stack. |

---

## 8. Miro Prompt

> Paste this prompt directly into Miro AI to generate the demo document.

---

```
Create a pre-sales discovery and demo document for the following prospect:

CLIENT: Eric Bergeman (Erik Bergeman), Customer Success Executive & Sales Director
COMPANY: HCL Software
INDUSTRY: Enterprise Software, B2B SaaS, eCommerce Platform
REVENUE: >$1 Billion
WEBSITE: https://www.hcl-software.com
EMAIL: erik.bergeman@hcl-software.com
LINKEDIN: https://www.linkedin.com/in/erikbergeman/
SOURCE: Podcast interview — "AI Transitions"

---

COMPANY CONTEXT:
HCL Software is a major enterprise software company that acquired IBM's software
portfolio in 2019. Eric leads sales for HCL Commerce — an enterprise-grade ecommerce
platform serving B2B and B2C. The company follows a "frugal development" philosophy
and serves enterprise clients at Fortune 500 scale. Many clients refuse SaaS and run
private on-prem data centers. HCL is mid-transformation from a 30-year-old J2EE
monolith to a composable PBC (Package Business Capability) architecture.

ERIC'S ROLE:
Eric is a 30-year veteran in enterprise software and sales. He worked at IBM and HCL
for decades. His job is to sell HCL Commerce modernization — specifically AI-powered
composable commerce — to enterprise B2B and B2C buyers who are skeptical of AI,
locked into legacy infrastructure, and managing complex ERP integrations (SAP, Oracle,
Blue Yonder).

---

ERIC'S EXACT WORDS FROM THE PODCAST — open the document with these:

"AI can produce code, but does it produce code that actually can manage transactional
integrity and not lose orders? That's the worst thing you can do in a commerce
platform — lose a transaction."
— Eric Bergeman, HCL Software

"Today in a lot of B2B environments, they're still doing swivel chair. I get the order
in the ecommerce system, then I open SAP and cut and paste the order."
— Eric Bergeman, HCL Software

"I have clients who look out the front of their building and see the data center next
door and say, 'that's where my stuff is.' They trust it. They like it a lot."
— Eric Bergeman, HCL Software

"If you offer clients that have already solved those problems, that would be helpful
in our discovery call."
— Eric Bergeman, HCL Software

---

PRIMARY PAIN POINTS:

1. MONOLITH-TO-COMPOSABLE TRANSITION — TRANSACTIONAL INTEGRITY AT RISK
HCL is decomposing a 30-year J2EE monolith into 18–20 independent PBCs connected
via APIs, GraphQL, and Kafka events. The core challenge is preserving transactional
integrity (zero lost orders) while distributing the system. Compensating transactions
in microservices do not always work. DevOps complexity has exploded — went from 20
developers to needing 150 SRE/DevOps engineers to manage 20+ independent services.

2. AI HALLUCINATIONS IN COMMERCE CODE ARE A LIVE THREAT
AI code generation is accelerating the architecture migration but introduces
hallucination risk in ordering, cart, fulfillment, and ERP-sync logic. There is no
systematic way to monitor or validate AI-generated code quality in production. Human
review does not scale across 18–20 independent PBC tracks.

3. B2B CLIENTS STUCK IN SWIVEL CHAIR OPERATIONS
The majority of HCL's B2B enterprise clients still manually copy-paste orders from
ecommerce into SAP/Oracle. Agent-to-agent automation (buyer agent → seller agent →
ERP agent) is the aspired future state but is "still a little early." Eric needs to
show clients a credible path from today's manual workflow to AI-automated order flow.

4. SELLING AI ROI TO SKEPTICAL ENTERPRISE BUYERS IS HARD
Eric's deals require convincing CFOs and CTOs to fund multi-year commerce
modernization. Many clients are on-prem-first and have long memories of past project
failures. Eric needs a customized, credible AI ROI narrative for every deal — not
generic slides. No systematic tool to generate prospect-specific plans at his scale.

5. CATALOG MANAGEMENT AND ANSWER ENGINE OPTIMIZATION (AEO) GAP
HCL Commerce clients sit on decades of inconsistent, unstructured product catalog data.
New requirement: content must be AEO-ready — semantically structured for LLM answer
engines (ChatGPT, Gemini). AI-assisted catalog enrichment is the logical next play but
no standard workflow exists. Managing 47 versions of product descriptions manually is
not sustainable.

---

XAAI TOOLS TO HIGHLIGHT IN THIS DEMO:

- Growth Plan Creator: Generate a customized AI commerce adoption roadmap for one of
  Eric's real enterprise prospects — in real time during the discovery call. His new
  pre-sales weapon instead of generic slides.

- Sales Call Analyzer: Upload a recent HCL Commerce discovery call recording. AI
  surfaces objections, buying signals, stalled moments, and next step recommendations.
  Second set of eyes for a 30-year seller.

- Niche Researcher: Identify which B2B verticals (manufacturing, wholesale, industrial
  distribution) are modernizing commerce at the highest velocity right now — helps Eric
  prioritize his territory.

- Cold Email Agent: Structured ABM-style outbound campaign targeting VP Commerce, IT
  Directors, and Digital Transformation leaders at B2B manufacturers and distributors
  in active modernization cycles.

- Cold Email Writer: Vertical-specific messaging for HCL Commerce's B2B markets — the
  "B2C experience for B2B buyers" angle, peer-to-peer tone, enterprise decision-maker
  language.

- AI SDR Inbox: Autonomous reply handling for enterprise inbound — immediate
  intelligent follow-up regardless of time zone, even for Fortune 500 prospects.

- Jordan AI — Analyze Mode: Post-campaign analysis — which vertical responded, which
  message angle drove meetings, what to double down on for next quarter.

---

DISCOVERY CALL CONTEXT:
Eric agreed to a discovery call at the end of the podcast. He said: "Send me an email."
The call goal:
1. Validate which of the five pain points is Eric's clearest current priority
2. Show one XAAI tool live — recommended: Growth Plan Creator built in real time for
   one of Eric's actual active enterprise prospects
3. Propose a 7-day pilot: Growth Plan Creator for three prospects + Sales Call Analyzer
   on one real HCL Commerce deal in progress

---

DEMO DOCUMENT — 9 SLIDES — SLIDE BY SLIDE:

SLIDE 1 — COVER
Title: "The Pre-Sales Toolkit for HCL Commerce — Built Around What Eric Said"
Subtitle: "A demo for Eric Bergeman, Sales Director, HCL Software"
Visual: Split layout — deep navy left panel with YU-Next Gen AI mark, electric blue
right panel with HCL Software logo
Footer: "Prepared by Tushar Budhe, YU-Next Gen AI | April 2026"

SLIDE 2 — OPEN WITH HIS EXACT WORDS (do not paraphrase — use the quotes verbatim)
Headline: "This is what Eric said on the podcast."
Layout: Four styled quote cards arranged in a 2×2 grid, each card has one quote,
speaker name, and company logo

Quote 1: "AI can produce code, but does it produce code that can manage transactional
integrity and not lose orders?"
Quote 2: "Today in B2B, they're still doing swivel chair — I get the order, then I
open SAP and cut and paste."
Quote 3: "I have clients who look out their building and see the data center next door.
That's where their stuff is."
Quote 4: "If you have clients who've already solved those problems, that would be very
helpful."

Footer callout bar (electric blue background, white text):
"We did not build a product tour. We built a demo around four things you already told us."

SLIDE 3 — ERIC'S REAL SALES CHALLENGE
Headline: "You are not selling software. You are selling digital transformation to
people who have been burned before."
Three-column layout — each column is one dimension of the challenge:

COLUMN 1 — The Skeptical Buyer
  Icon: shield / lock
  Heading: "On-Prem First"
  Bullets:
    - Enterprise clients refuse SaaS — private data centers are a point of pride
    - AI trust gap: "This will lose our orders"
    - Long institutional memory of failed modernization projects
  Outcome: Every deal requires a customized ROI story — not a product roadmap

COLUMN 2 — The Complex Deal
  Icon: org chart / layers
  Heading: "Multi-Layer Approval"
  Bullets:
    - CFO needs financial ROI. CTO needs architecture clarity.
    - IT Director needs Kubernetes/DevOps cost math
    - All three in the room simultaneously
  Outcome: Generic slides die. Customized plans survive.

COLUMN 3 — The Speed Problem
  Icon: clock / timer
  Heading: "No Time to Prep"
  Bullets:
    - 20+ active enterprise accounts at any time
    - Each needs a different narrative for a different stack
    - No systematic tool to build those narratives at scale
  Outcome: Deals are won or lost in the first 20 minutes

Footer callout:
"Eric has the expertise. He needs the leverage to scale it."

SLIDE 4 — GROWTH PLAN CREATOR (his pre-sales weapon — demo live)
Headline: "A customized AI commerce adoption plan for every prospect — in under 5 minutes."
Visual: Horizontal wizard flow — left to right — with 3 connected steps and one output:

  [Step 1: Client Industry & Stack] ──► [Step 2: Current State & Goals] ──► [Step 3: AI Priorities] ──► [90-Day AI Commerce Plan Generated]

Under the output box:
  "Plan includes: AI capabilities to activate, PBC modernization sequence,
   expected ROI range, integration dependencies, and ERP readiness checklist."

Callout box (bottom right, electric blue):
"Instead of slides about HCL Commerce, Eric walks in with a plan built for that company.
 He is the expert who already understands their business before the meeting starts."

Live demo instruction (bottom, grey text):
"Demo live: Input one of Eric's real active prospects. Generate the plan in the room.
 Let Eric read the first paragraph aloud."

SLIDE 5 — SALES CALL ANALYZER (find where deals are dying)
Headline: "Upload your last discovery call. See exactly where it stalled."
Design: Call analysis dashboard mockup — two panels side by side

Left panel — Call Timeline:
  - 0:00–4:00 | Discovery: strong open, buyer engaged
  - 4:00–12:00 | Architecture discussion: buyer goes quiet at "microservices"
  - 12:00–17:00 | Pricing mention: buyer deflects — "need to loop in IT"
  - 17:00–23:00 | Objection: "We had a bad experience with our last modernization project"
  - Flagged moment (red): 21:40 — "That objection went unanswered for 3 minutes"

Right panel — Recommendations:
  Card 1: "Reframe 'microservices' as 'composable commerce with upgrade protection' — tested with 6 similar buyers"
  Card 2: "At 'loop in IT' — offer to build a technical deep-dive plan before next call"
  Card 3: "Address the failed project objection before it surfaces — open with it proactively"

Footer callout:
"30 years of instinct plus AI analysis. Zero missed signals."

SLIDE 6 — COLD EMAIL AGENT (build the modernization pipeline)
Headline: "Thousands of B2B manufacturers are modernizing right now. Find them first."
Visual: Three-column comparison — Who to Target / How to Reach / What to Expect

COLUMN 1 — WHO TO TARGET
  Tier A: VP of Digital Commerce, Director of eCommerce — active modernization mandate
  Tier B: IT Director / VP Engineering — infrastructure budget authority
  Tier C: Chief Digital Officer / VP Operations — ERP rationalization in progress
  Data source: Niche Researcher + LinkedIn Sales Navigator targeting

COLUMN 2 — HOW TO REACH
  Infrastructure: Instantly.ai — dedicated IPs, automated warmup, sender rotation
  Sequence: 4-touch — pain anchor → proof story → brief case study → specific ask
  Tone: Peer-to-peer. Enterprise-grade. Never vendor-pitch.
  Volume: 500–1,000 targeted leads per vertical per 7-day campaign

COLUMN 3 — WHAT TO EXPECT (based on YU-Next Gen AI's own live campaign)
  Large stat: 13,000 leads → 4 discovery calls in 7 days
  Positive reply rate: 0.67% → call booking rate: 27%
  "These are not projections. These are last week's results."

Footer callout:
"Eric already knows his buyers. This system finds more of them before his competitors do."

SLIDE 7 — PROOF (YU-Next Gen AI's own campaign — real numbers)
Headline: "This is not a demo environment. These are live results."
Design: Full-slide stat block — large numbers, minimalist layout

Four large centered stats in a 2×2 grid:
  13,000       |   4
  Leads        |   Discovery Calls
  Processed    |   Booked
  ──────────────────────────────────
  7            |   $0
  Days         |   Paid to Vendors

Below the grid — one sentence:
"YU-Next Gen AI ran the Cold Email Agent for its own outbound targeting B2B decision-makers.
 These are the results from the past 7 days."

Secondary callout (bottom, styled):
"One client who saw this result said: 'You hit on something that is working.'
 Eric asked for someone who has already solved the problem. This is that someone."

SLIDE 8 — THE 7-DAY PILOT PROPOSAL
Headline: "One pilot. Three tools. Seven days. No platform sprawl."
Layout: Three-step horizontal timeline with icons

STEP 1 — Setup (Day 1–2)
  Icon: gear
  Actions:
    - Growth Plan Creator: generate AI modernization plans for 3 of Eric's active enterprise prospects
    - Cold Email Agent: build lead list — 500 VP Commerce / IT Director targets in one HCL Commerce vertical
    - Instantly.ai infrastructure configured: dedicated domain, automated warmup, sender rotation

STEP 2 — Run (Day 3–6)
  Icon: chart trending up
  Actions:
    - Sales Call Analyzer: upload 2 recent HCL Commerce discovery calls → objection maps and next step recommendations
    - Cold Email Agent campaign live — fully automated, live dashboard from Day 1
    - Growth Plans delivered — Eric uses in real meetings during the pilot window

STEP 3 — Review (Day 7)
  Icon: two people / meeting
  Actions:
    - Joint 30-minute review: Tushar + Eric
    - Review: which Growth Plan got the strongest client reaction? Which call insight changed the sales approach?
    - Cold email signal: how many replies, positive responses, calls booked?
    - Decision: expand to next vertical, tune messaging, or pivot

Callout box (electric blue, bottom right):
"Eric's only input: 30 minutes to set up. 30 minutes to review.
 Everything in between is automated."

SLIDE 9 — NEXT STEPS
Headline: "One decision."
Layout: Three visual decision cards side by side

Card 1 (green left border): "Start the 7-Day Pilot"
  → Growth Plan Creator for 3 active prospects — this week
  → Sales Call Analyzer on most recent discovery call — this week
  → Cold Email Agent campaign launched by Day 3
  → Joint review scheduled for Day 7
  → No contract. No long-term commitment. Just results to evaluate.

Card 2 (blue left border): "Live Walkthrough First"
  → 30-minute live session: Growth Plan Creator built for one of Eric's real prospects
  → Real output, not a sandbox preview
  → Eric reads the first page and decides whether to proceed
  → No commitment until the output speaks for itself

Card 3 (grey left border): "I Have Questions"
  → Any open question answered before next step
  → Availability: this week, Eastern Time
  → Contact: Tushar Budhe, YU-Next Gen AI

Footer (full width, small text):
"There is no wrong answer. Eric sees the output before committing to anything."

---

TONE RULES FOR ALL SLIDES — STRICTLY FOLLOW:
- Peer-to-peer, never vendor-to-prospect. Eric has 30 years of experience.
- Every claim grounded in: Eric's exact words from the transcript, or YU-Next Gen AI's own live results.
- Never use: "revolutionary", "game-changing", "AI-powered" as a standalone adjective, "cutting-edge", "disruptive"
- Short declarative sentences. No filler. No fluffy marketing language.
- If a slide requires more than 30 words of body text, simplify the visual instead of adding more text.
- Enterprise buyers read fast. Dense slides get skipped.

VISUAL DESIGN — STRICTLY FOLLOW:
- Color palette: Deep navy #0A1628 (dark backgrounds), Electric blue #0066FF (accents and callouts), White #FFFFFF (primary text)
- Typography: Inter or Poppins. Headings 32–40px bold. Body 16–18px regular.
- Layout: Spacious. Cards, flow diagrams, comparison tables. No bullet wall slides.
- Icons: Minimal line-style only (Feather or Heroicons). No filled clip art.
- No stock photography. No decorative images. Data and diagrams only.
- Each slide: headline top-left, main visual centered, key callout bottom-right.
- Comparison columns use light tint backgrounds to differentiate (red-tinted vs blue-tinted).

DOCUMENT FORMAT:
- Miro board with 9 frames
- Each frame: 1920 × 1080px
- Frame titles match slide titles above
- Frames ordered 1–9 left to right on the Miro canvas
- No mind maps. No radial diagrams. Presentation frames only.
```
