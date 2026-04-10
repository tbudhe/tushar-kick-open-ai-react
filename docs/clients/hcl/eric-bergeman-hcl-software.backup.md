# Client: Eric Bergeman — HCL Software

> Pre-Sales File | YU-Next Gen AI | Pre-Sales Engineer View
> **Session Mode:** Discovery Demo — Growth Plan Creator Only
> **Not a sales call. Not a product tour. A working session to understand and co-define Eric's decision challenges.**

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

## 5. Tool Strategy — This Session

### Primary Demo Tool (Deep Dive This Session)

| Tool | Focus |
|---|---|
| **Growth Plan Creator** | The only tool demoed live. Generates a client-specific AI commerce modernization plan in real time. Gives Eric a stakeholder-ready decision document before every enterprise meeting. |

### All Other Tools — Phase 2 Reference (Problem → Solution Map Only)

> These are not demoed in this session. One summary slide only. No deep-dive.

| Eric's Problem | Best-Fit Tool | When to Revisit |
|---|---|---|
| "Deals stall after discovery — I don't know exactly where" | Sales Call Analyzer | Session 2 — after Growth Plan validation |
| "B2B buyers not in pipeline yet — vertical gaps" | Niche Researcher + Cold Email Agent | Session 3 — pipeline expansion |
| "Inbound replies going cold overnight" | AI SDR Inbox | Session 3 — reply automation |
| "Offer message not landing with CFOs" | Offer Creator + Cold Email Writer | Session 3 — messaging refinement |
| "Need post-campaign intelligence on what worked" | Jordan AI — Analyze Mode | Session 4 — optimization layer |

**Why one tool first:**
One tool, one outcome. Growth Plan Creator creates immediate client-facing value without changing Eric's current process. Fastest to validate in a live session. If it improves his next enterprise conversation, everything else becomes a credible next step.

---

## 6. Discovery Demo Flow — Growth Plan Creator Only

> **Session rule:** This is a working session, not a product tour. No selling. No feature walkthrough. One tool, one outcome.

---

### Step 1: Open With His Context (2 minutes)

**Say this exactly:**
"Eric, I want to start by confirming what I heard on the podcast — not to pitch, but to make sure we work on the right problem today. You said transaction integrity is the biggest technical risk in your architecture transition. Your B2B clients are still manually copying orders into SAP. And you need a stronger, faster way to build customized ROI narratives before enterprise meetings. If that's roughly correct, we're going to spend today on one thing that directly helps with all three — and I want you to tell me whether it actually does."

**Goal:** Eric confirms or corrects. No product until he says yes.

---

### Step 2: Five Discovery Questions (5 minutes)

> Ask all five before showing anything. Listen for which pain dominates.

**Q1 — Biggest blocker right now:**
"Which is costing you the most at the moment — confidence in transaction integrity during your architecture transition, getting all the right stakeholders aligned, or the time it takes to build a customized narrative before each enterprise meeting?"

**Q2 — Where deals break:**
"In your last three enterprise deals, where did momentum stall? Was it technical trust — the CTO not confident in the modernization path? ROI justification — the CFO not seeing a clear number? Or internal approvals — the deal stuck in procurement or IT?"

**Q3 — Hardest persona to align:**
"For your buyers, who is the hardest stakeholder to bring on board first — the CTO who needs architecture confidence, the principal engineer who needs upgrade path clarity, or the CFO who needs business impact framing?"

**Q4 — What makes an artifact strong enough:**
"When you walk into a high-stakes enterprise meeting, what would make a pre-sales document useful enough to actually change the conversation — architecture phasing, a business impact narrative, or a stakeholder-by-stakeholder decision summary?"

**Q5 — Success definition for today:**
"If we build one plan live today, what would it need to show for you to say — this is genuinely useful for my next client meeting?"

---

### Step 3: Branching — Growth Plan Positioning (Based on His Answer)

Use the same tool in all three branches. Change the framing only.

#### Branch A — If Eric leads with "transactional integrity / architecture"

**Podcast signal:**
> *"How do you take transactional integrity and apply it in these new models? It's not easy. AI can produce code, but does it produce code that can manage transactional integrity and not lose orders?"*

**Position Growth Plan Creator as:** An architecture planning tool for phased, risk-sequenced modernization decisions.

**Live line:**
"Let's generate an architecture-first plan for one of your target accounts — showing which PBCs to phase first, where to keep manual guardrails, and what should not be AI-generated without validation."

**Output to walk:**
- Capability sequencing by risk level
- Transaction integrity checkpoints per phase
- ERP integration dependency map
- CTO and principal engineer decision notes

---

#### Branch B — If Eric leads with "B2B clients / swivel chair"

**Podcast signal:**
> *"Today in a lot of B2B environments, they're still doing swivel chair. I get the order in ecommerce, then I open SAP and cut and paste."*

**Position Growth Plan Creator as:** A client-facing ROI document that translates manual workflow pain into a phased automation business case.

**Live line:**
"Let's generate a plan that starts from their current manual order flow and shows phased movement to automated handoff — with business impact per phase so your buyer sees measurable value before committing to full transformation."

**Output to walk:**
- Current-state pain summary (manual handoffs, order delays, error rates)
- Phase-by-phase automation milestones
- CFO and operations stakeholder impact narrative
- Executive summary Eric can share directly after the meeting

---

#### Branch C — If Eric leads with "selling / enterprise ROI story"

**Podcast signal:**
> *"If you offer clients that have already solved those problems, that would be helpful."*
> *"I have enterprise clients who told me directly: I don't want any SaaS. I want to run this on my beautiful infrastructure."*

**Position Growth Plan Creator as:** Eric's pre-meeting stakeholder alignment weapon — specific, credible, and client-ready.

**Live line:**
"Let's build a plan right now for one of your active prospects, tuned to their deployment preference and stakeholder structure. You walk into the next call with a document built for them, not a generic HCL Commerce deck."

**Output to walk:**
- Stakeholder-specific messaging (CTO, principal engineer, CFO in separate sections)
- On-prem and hybrid-compatible transformation sequence
- ROI narrative tied to their infrastructure constraints
- First-call to proposal bridge document

---

### Step 4: Why Growth Plan First — Positioning Statement

**Say this clearly before generating the live plan:**
"We start with Growth Plan Creator first because it gives you an immediate, client-facing decision document that strengthens your authority in enterprise meetings. It helps you move from generic discussion to structured, stakeholder-specific modernization conversation in one session. Nothing changes in your existing process. You just walk in better prepared."

---

### Step 5: Live Generation (5 minutes)

**Input only the essentials:**
- Prospect company
- Industry
- Contact title
- Current-state challenge (one sentence)
- Desired outcome (one sentence)

**Say during generation:**
"I'm using minimum input intentionally. If this already produces something useful, full input makes it more precise."

**Walk output in this order — pause after each section:**
1. Current-state diagnosis — *"Does this match how you'd describe their situation?"*
2. 90-day phased roadmap — *"Is this sequencing something you could defend with their CTO?"*
3. Stakeholder messaging — *"Which section would change the most in your next client meeting?"*
4. Business outcome narrative — *"Is this framing strong enough for their CFO to act on?"*

---

### Step 6: Phase-2 Tool Map (One Slide — Do Not Demo)

> Reference only. Show this slide briefly. Do not click into any tool.

| Eric's Unsolved Problem | Best-Fit Tool | When |
|---|---|---|
| "Where exactly do my deals die?" | Sales Call Analyzer | Session 2 |
| "I need more qualified enterprise pipeline" | Niche Researcher + Cold Email Agent | Session 3 |
| "Inbound replies going cold" | AI SDR Inbox | Session 3 |
| "Message not landing with CFOs" | Offer Creator + Cold Email Writer | Session 3 |
| "What worked after first campaign?" | Jordan AI — Analyze Mode | Session 4 |

**Say:**
"Everything else stays on this slide for now. Today was about one thing. If that one thing improved your next client conversation, everything else becomes a logical next step."

---

### Step 7: Discovery Close (Not a Sales Close)

**End with these four questions only:**

1. *"What section of the plan was most useful?"*
2. *"What would you change in the format for it to work better in your client meetings?"*
3. *"Is this document strong enough to use in your next enterprise meeting as-is, or does it need one more input?"*
4. *"Do you want to run a second session where we build this for one of your real active accounts end-to-end?"*

**No contract. No commitment. Just answers.**

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

## 7. Objection Prep

| Likely Objection | Response |
|---|---|
| "HCL has internal sales tools already" | Growth Plan Creator is not a CRM or support tool. It generates a client-specific modernization plan before each meeting — nothing in HCL's internal stack does that. |
| "I don't have time to learn a new tool" | Input takes 2 minutes. The plan generates automatically. No training, no configuration. It fits inside your existing meeting prep routine. |
| "Will this actually match what our clients care about?" | We input their real company, stack, and constraints. The plan reflects their environment — not a generic HCL template. That's the point. |
| "AI output won't be accurate enough for enterprise clients" | You review the plan before you use it. It is a starting framework you validate and adjust — not a document you hand over without reading. |
| "What if the plan is wrong for the client?" | Wrong in what way? Let's generate one now and you tell me what to fix. That feedback shapes how we tune the inputs for your accounts. |

---

## 8. Miro Prompt — Growth Plan Creator Discovery Demo

> Paste this prompt directly into Miro AI to generate the discovery demo document.
> **Session type:** Discovery demo — Growth Plan Creator only. No Sales Call Analyzer. No Cold Email Agent.

---

```
Create a discovery-first demo document for a single tool: Growth Plan Creator.

This is NOT a sales pitch. It is a working session to understand and co-define
the prospect's decision challenges. The tone is peer-to-peer, executive-technical,
and consultative. No hype language. No hard sell.

---

PROSPECT: Eric Bergeman (Erik Bergeman)
TITLE: Customer Success Executive & Sales Director
COMPANY: HCL Software
REVENUE: >$1 Billion
INDUSTRY: Enterprise Software, B2B SaaS, eCommerce Platform
SOURCE: Podcast — "AI Transitions"

---

ERIC'S SITUATION IN HIS OWN WORDS:

"AI can produce code, but does it produce code that can manage transactional
integrity and not lose orders? That's the worst thing you can do in a commerce
platform — lose a transaction."

"Today in B2B, they're still doing swivel chair. I get the order in ecommerce,
then I open SAP and cut and paste."

"I have clients who look out their building and see the data center next door.
That's where their stuff is. They trust it."

"If you offer clients that have already solved those problems, that would be
helpful in our discovery call."

---

THREE CORE PROBLEMS BEHIND ALL FIVE PAIN POINTS:

1. Transaction integrity confidence — Architecture transformation is risky.
   Eric's team and their clients fear distributing a system that must never
   lose an order.

2. Stakeholder complexity — Every deal requires CTO, principal engineer,
   AND CFO alignment simultaneously. There is no single slide that speaks
   to all three.

3. Pre-meeting prep speed — Eric manages 20+ active enterprise accounts.
   Each needs a different narrative. Building custom ROI stories manually
   is not sustainable.

---

WHY GROWTH PLAN CREATOR FIRST (explicit reasoning — include this on a slide):

- One tool, one outcome — reduces noise and builds trust in the first session
- Creates immediate, client-facing value without changing Eric's current process
- Transforms scattered technical and business concerns into one structured document
- Fastest to validate with one real prospect example in a live call
- Improves Eric's credibility in front of clients — he is the most prepared
  person in the room before the meeting even begins

Exact positioning statement to include verbatim:
"We start with Growth Plan Creator first because it gives you an immediate,
client-facing decision document that strengthens your authority in enterprise
meetings. It helps you move from generic discussion to structured,
stakeholder-specific modernization conversation in one session."

---

FIVE DISCOVERY QUESTIONS (must appear as a dedicated slide — ask before demo):

Q1: "Which is the biggest blocker right now: transaction integrity confidence,
stakeholder alignment, or pre-meeting prep speed?"

Q2: "In your last 3 enterprise deals, where did momentum break: technical trust,
ROI justification, or internal approvals?"

Q3: "Which buyer persona is hardest to align first: CTO, principal engineer,
or CFO?"

Q4: "What makes a pre-sales artifact strong enough for your client meetings:
architecture clarity, phased roadmap, or business impact narrative?"

Q5: "If we build one plan live today, what would it need to show for you to say:
this helps my next client conversation?"

---

GROWTH PLAN CREATOR — LIVE DEMO SEQUENCE (one slide per section):

Section 1: Current-state diagnosis
- Ask: "Does this match how you'd describe their situation?"

Section 2: 90-day phased roadmap
- Ask: "Is this sequencing something you could defend with their CTO?"

Section 3: Stakeholder-specific messaging (CTO / principal engineer / CFO)
- Ask: "Which section would change the most in your next client meeting?"

Section 4: Business outcome and decision path
- Ask: "Is this framing strong enough for their CFO to act on?"

---

ALL OTHER TOOLS — ONE SUMMARY SLIDE ONLY (no deep demo):

| Eric's Unsolved Problem | Best-Fit Tool | When |
|---|---|---|
| "Where exactly do my deals die?" | Sales Call Analyzer | Session 2 |
| "I need more qualified enterprise pipeline" | Niche Researcher + Cold Email Agent | Session 3 |
| "Inbound replies going cold" | AI SDR Inbox | Session 3 |
| "Message not landing with CFOs" | Offer Creator + Cold Email Writer | Session 3 |
| "What worked after first campaign?" | Jordan AI — Analyze Mode | Session 4 |

Label this slide: "Everything Else — Phase 2 After Growth Plan Validation"

---

DISCOVERY CLOSE CRITERIA (not a sales close — dedicated closing slide):

End the session with these four questions only:
1. What section of the plan was most useful?
2. What would you change in the format for it to work better in your client meetings?
3. Is this document strong enough for your next enterprise meeting as-is?
4. Do you want a second session where we build this for one of your real active accounts?

No contract. No commitment. Just answers.

---

DEMO STRUCTURE — 7 FRAMES — MIRO BOARD:

FRAME 1 — COVER
Title: "Growth Plan Creator — Discovery Working Session"
Subtitle: "Eric Bergeman × YU-Next Gen AI | April 2026"
Visual: Split layout — deep navy left, electric blue right
Footer: "This is a working session. Not a pitch."

FRAME 2 — ERIC'S CONTEXT (his exact words — no paraphrase)
Headline: "What you said on the podcast."
Layout: Three large quote cards — left to right
Quote 1: "AI can produce code, but does it produce code that can manage
transactional integrity and not lose orders?"
Quote 2: "Today in B2B, they're still doing swivel chair into SAP."
Quote 3: "If you have clients who've already solved those problems, that
would be helpful."
Footer callout: "This session is built around these three statements."

FRAME 3 — THE REAL CHALLENGE
Headline: "You are not selling software. You are selling digital transformation
to people who have been burned before."
Three columns: The Skeptical Buyer / The Complex Deal / The Speed Problem
(use existing content from Eric's pain points)
Footer: "Eric has the expertise. He needs the leverage to scale it."

FRAME 4 — FIVE DISCOVERY QUESTIONS
Headline: "Before we build anything — five questions."
Layout: Five numbered question cards stacked vertically
Each card: question text + one sentence on why it matters
Footer callout: "Your answers determine which section of the plan we focus on first."

FRAME 5 — WHY GROWTH PLAN CREATOR FIRST
Headline: "One tool. One outcome. One session."
Layout: Three-column reasoning cards:
  Column 1: "Immediate value" — generates a client-ready document, not a report
  Column 2: "No process change" — fits inside your existing meeting prep
  Column 3: "Fastest validation" — one real example tells you more than any demo
Verbatim positioning statement in center callout box (electric blue):
"We start with Growth Plan Creator first because it gives you an immediate,
client-facing decision document that strengthens your authority in enterprise meetings."

FRAME 6 — GROWTH PLAN CREATOR LIVE OUTPUT WALKTHROUGH
Headline: "Built for [Prospect Company] — generated in this session."
Layout: Four-section document preview mockup:
  Section 1: Current-state diagnosis
  Section 2: 90-day phased roadmap
  Section 3: Stakeholder messaging (CTO / principal engineer / CFO)
  Section 4: Business outcome and decision path
After each section: discovery question in a callout bubble

FRAME 7 — PHASE 2 MAP + CLOSE
Top half: Problem → Tool summary table (all other tools, no deep demo)
Bottom half: Discovery close — four questions in styled cards
Footer: "No contract. No commitment. Just answers about what was useful."

---

TONE RULES — STRICTLY FOLLOW:
- Peer-to-peer. Eric has 30 years of enterprise experience.
- Every claim backed by his exact words or YU-Next Gen AI's own results.
- No: "revolutionary", "disruptive", "AI-powered" as a standalone adjective, "cutting-edge"
- Short declarative sentences. No filler.
- Treat this as a working session document, not a sales deck.

VISUAL DESIGN:
- Deep navy #0A1628 | Electric blue #0066FF | White #FFFFFF
- Inter or Poppins. Headings 32–40px bold. Body 16–18px regular.
- Spacious layouts. Cards, flow diagrams, question stacks.
- No stock photography. No decorative images.
- 7 frames, 1920 × 1080px each, ordered left to right.
- No mind maps. No radial diagrams. Presentation frames only.
```
