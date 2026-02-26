# Job Search Automation Agent - Project Plan

## Overview
Build a beginner-friendly job-search automation agent that searches for jobs, tailors your résumé to each job description, and tracks applications. Complete in 1 week with 1 hour/day commitment.

---

## 1-Week Daily Project Plan (1 hour/day)

### DAY 1: Foundation & Setup (1 hour)

#### Tasks Completed
- [x] **20 min**: Create GitHub repo + React frontend structure (DONE)
- [x] **15 min**: Set up Express backend skeleton (DONE)

#### Tasks for Today
- [x] **15 min**: Design system architecture diagram (COMPLETED)
- [x] **20 min**: Set up MongoDB Atlas database (COMPLETED)
- [x] **10 min**: Deploy to Railway (COMPLETED)

### DAY 2: Resume Parser (1 hour)
- **20 min**: Build resume upload component (React)
- **20 min**: Create `/api/parse-resume` endpoint (Node.js)
- **15 min**: Integrate Claude API to extract resume data
- **5 min**: Test with sample resume

### DAY 3: Job Search Integration (1 hour)
- **25 min**: Add job search UI (search bar, filters)
- **20 min**: Integrate free job API (LinkedIn API lite or web scraping with Cheerio)
- **10 min**: Store jobs in database
- **5 min**: Display job list in frontend

### DAY 4: Resume Tailoring (1 hour)
- **25 min**: Build "Preview Tailored Resume" component
- **20 min**: Create `/api/tailor-resume` endpoint (Claude API)
- **10 min**: Compare original vs tailored resume (diff view)
- **5 min**: Save tailored versions to database

### DAY 5: Auto-Apply (Smart Tracking) (1 hour)
- **20 min**: Build application dashboard (status: pending/applied/rejected)
- **20 min**: Create `/api/apply` endpoint (email templates, LinkedIn automation prep)
- **15 min**: Track application history in database
- **5 min**: Test end-to-end workflow

### DAY 6: Scheduling & Automation (1 hour)
- **20 min**: Add cron-job trigger (daily job search)
- **20 min**: Set up email notifications for new applications
- **15 min**: Create admin dashboard (view logs, manual triggers)
- **5 min**: Test automation

### DAY 7: Polish & Deployment (1 hour)
- **20 min**: Bug fixes + error handling
- **15 min**: Optimize database queries
- **15 min**: Final deployment + README
- **10 min**: Portfolio documentation

---

## DAY 1 Detailed Execution Guide

### Step 1: Design System Architecture Diagram (15 min)

Create a visual diagram showing data flow. You can use:
- Excalidraw (free, browser-based)
- Lucidchart (free tier)
- Draw.io (free)
- Miro (free tier)

**Diagram should show:**
```
USER
  |
  v
[React Frontend - Vercel]
  ## Deployment Strategy (Final)

  ### Platform Decision

  This project uses Railway as the active deployment target.

  | Option | Setup Time | Operational Overhead | Current Use |
  |--------|------------|----------------------|-------------|
  | Railway (single platform) | 10-15 min | Low | ✅ Active |
  | Vercel + Railway | 15-25 min | Low-Medium | Optional later |

  ### Recommended Operating Model

  1. Keep backend + static frontend on Railway for now.
  2. Use MongoDB Atlas as external managed database.
  3. Keep CI focused on build/test + Docker image publish.

  ### Railway Standard Setup

  1. Push `main` to GitHub.
  2. Railway deploys from `Dockerfile`.
  3. Set variables in Railway service:
     - `DATABASE_URL`
     - `NODE_ENV=production`
     - Feature/API secrets as needed
  4. Validate endpoints:
     - `/health`
     - `/heartbeat`
     - `/api/health`
     - `/api/menu`

  ### Current Production URL

  - `https://gen-ai-ik-demo-production-0c69.up.railway.app`
  );
  
  return { tailoredResume, jobAnalysis, applicationEmail };
}
```

### Cost Optimization

- **Gemini**: Cheaper for basic text analysis → use for job search
- **Claude**: Best for nuanced resume writing → use for tailoring
- **OpenAI**: Good for emails → use for application copy

### Budget Estimate (1,000 jobs/month)
- Claude: $5-10
- Gemini: $2-5
- OpenAI: $3-5
- **Total**: ~$15/month (well within free credits)

---

## Notion AI for HR Messages & Scheduling

### Answer: NOT Recommended

### Why Notion AI Won't Work
1. **Limited API access** - Notion AI doesn't have agent APIs
2. **No automation triggers** - Can't autonomously reply to messages
3. **No scheduling** - Requires manual activation
4. **Privacy concerns** - Storing HR messages in Notion is risky

### Better Alternative: Use Cron + Email

```typescript
// Use node-cron for scheduling
import cron from 'node-cron';

// Run job search daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  await automateJobSearch();
  await sendEmailNotification('New jobs found!');
});

// For HR messages: Set up email forwarding + webhook
// Forward HR emails → webhook → Claude analysis → auto-reply
```

### Better Tools for This
- **Make (Zapier alternative)**: Free, supports email automation
- **IFTTT**: Simple automation (but limited)
- **Custom Node.js cron jobs**: Full control, free

---

## Free Hosting Options

### Frontend (React)

| Option | Free Tier | Limits | Best For |
|--------|-----------|--------|----------|
| **Vercel** | Yes | 100GB/month | React/Next.js |
| **Netlify** | Yes | 300 min/month | React apps |
| **GitHub Pages** | Yes | 1GB storage | Static sites |
| **Railway** | $5 credit/month | ~500 hours | Full-stack |

**My Pick**: **Vercel** (1-click React deployment, generous free tier)

### Backend (Node.js)

| Option | Free Tier | Limits | Best For |
|--------|-----------|--------|----------|
| **Render** | Yes | 750 hrs/month | Node.js |
| **Railway** | $5 credit/month | Generous | Full-stack |
| **Fly.io** | $3 credit/month | Tight limits | Experienced users |
| **Replit** | Yes | 1 project free | Learning |

**My Pick**: **Railway** (pays credits toward actual usage, great for testing)

### Database (Free)

| Option | Free Tier | Best For |
|--------|-----------|----------|
| **MongoDB Atlas** | 512MB | Production ready |
| **Firebase** | 1GB | Realtime features |
| **Supabase** | 500MB | SQL + Auth |

**My Pick**: **MongoDB Atlas** (most scalable for job data)

### Complete Free Stack
```
Frontend:   Vercel (React)
Backend:    Railway ($5 credit/month)
Database:   MongoDB Atlas (512MB free)
LLM API:    Claude (free $5 credit)
Domain:     Freenom (free domains)
```

**Total Cost**: $0/month (using free tiers + credits)

---

## Hosting on Google Cloud (Free Option)

### Google Cloud's Free Tier

```
✓ Compute Engine: 1 f1-micro instance/month
✓ Cloud Storage: 5GB/month (for resume uploads)
✓ Cloud Functions: 2M invocations/month
✓ Cloud Scheduler: 3 jobs/month
```

### Setup Steps

```bash
# 1. Create Google Cloud account
# 2. Enable APIs: Compute, Cloud Run, Storage

# 3. Deploy Node.js backend using Cloud Run
gcloud run deploy job-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 4. Set up Cloud Scheduler for daily jobs
gcloud scheduler jobs create app-engine daily-job-search \
  --schedule="0 9 * * *" \
  --http-method=POST \
  --uri=https://your-cloud-run-url/api/search-jobs

# 5. Deploy React frontend to Cloud Storage + CDN
gsutil -m cp -r dist gs://your-bucket/
```

### Cost
- **Free tier covers small projects**
- **Overage**: ~$0.10/month for minimal usage
- **Tip**: Use Cloud Run (pay per request, not uptime)

---

## Single Cloud Provider vs Multi-Cloud Deployment

### Current Decision (Day 1 Complete)

Use Railway as the deployment target for this project.

### Why this is locked in

- Deployment is already validated in production.
- Healthcheck endpoints are stable.
- Environment variable workflow is documented and repeatable.
- Lowest operational overhead for Day 2 feature work.

### Supported deployment patterns

1. Railway-only (current)
2. Optional future split: Vercel frontend + Railway backend

### Standard deployment checklist

1. Push latest `main` to GitHub
2. Ensure Railway variables are set (`DATABASE_URL`, `NODE_ENV`, required secrets)
3. Wait for auto-deploy
4. Verify:
   - `GET /health`
   - `GET /heartbeat`
   - `GET /api/health`
   - `GET /api/menu`

### Active production URL

- `https://gen-ai-ik-demo-production-0c69.up.railway.app`

---

## Modular Dashboard Architecture: Multi-Project Reusability

### Why Build Modular?

You're planning multiple projects:
1. **Job Search Agent** (current)
2. **Walmart Item Recommendation POC**
3. **Future projects** (recommendation engines, automation tools, etc.)

Instead of rebuilding UI/API patterns, create a **reusable platform** with pluggable dashboards.

---

## Monorepo Structure for Multi-Project Platform

```
ai-platform/                          # Main monorepo
├── packages/
│   ├── shared-ui/                   # Reusable UI components
│   │   ├── src/components/
│   │   │   ├── DashboardLayout/     # Base dashboard wrapper
│   │   │   ├── DataTable/           # Generic table for any data
│   │   │   ├── FileUploader/        # Upload PDFs, CSVs, etc
│   │   │   ├── MetricsCard/         # Stats display
│   │   │   ├── AIOutputViewer/      # Display LLM results
│   │   │   ├── ActionButtons/       # Apply, Compare, Tailor, etc
│   │   │   └── NavBar/              # Multi-project switcher
│   │   └── package.json
│   │
│   ├── shared-api/                  # Reusable backend utilities
│   │   ├── src/
│   │   │   ├── middleware/          # Auth, logging, errors
│   │   │   ├── database/            # MongoDB models base
│   │   │   ├── llm/                 # Claude, OpenAI wrappers
│   │   │   ├── utils/               # Parsers, validators, helpers
│   │   │   └── types/               # Shared TypeScript types
│   │   └── package.json
│   │
│   ├── job-search-agent/            # Job Search Dashboard
│   │   ├── frontend/
│   │   │   ├── src/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── JobSearch.tsx
│   │   │   │   │   ├── ResumeManager.tsx
│   │   │   │   │   ├── Applications.tsx
│   │   │   │   │   └── Dashboard.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useJobSearch.ts
│   │   │   │       ├── useTailorResume.ts
│   │   │   │       └── useApplications.ts
│   │   │   └── package.json
│   │   │
│   │   └── backend/
│   │       ├── src/
│   │       │   ├── routes/
│   │       │   │   ├── jobs.ts
│   │       │   │   ├── resumes.ts
│   │       │   │   ├── tailoring.ts
│   │       │   │   └── applications.ts
│   │       │   ├── services/
│   │       │   │   ├── jobSearchService.ts
│   │       │   │   ├── resumeParserService.ts
│   │       │   │   ├── resumeTailorService.ts
│   │       │   │   └── applicationService.ts
│   │       │   ├── models/
│   │       │   │   ├── Resume.ts
│   │       │   │   ├── Job.ts
│   │       │   │   ├── Application.ts
│   │       │   │   └── TailoredResume.ts
│   │       │   └── server.ts
│   │       └── package.json
│   │
│   ├── walmart-item-recommendation/  # Item Recommendation Dashboard
│   │   ├── frontend/
│   │   │   ├── src/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── ProductSearch.tsx
│   │   │   │   │   ├── RecommendationResults.tsx
│   │   │   │   │   ├── Analytics.tsx
│   │   │   │   │   └── Dashboard.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useProductSearch.ts
│   │   │   │       ├── useRecommendations.ts
│   │   │   │       └── useAnalytics.ts
│   │   │   └── package.json
│   │   │
│   │   └── backend/
│   │       ├── src/
│   │       │   ├── routes/
│   │       │   │   ├── products.ts
│   │       │   │   ├── recommendations.ts
│   │       │   │   └── analytics.ts
│   │       │   ├── services/
│   │       │   │   ├── productSearchService.ts
│   │       │   │   ├── recommendationService.ts
│   │       │   │   └── analyticsService.ts
│   │       │   ├── models/
│   │       │   │   ├── Product.ts
│   │       │   │   ├── UserProfile.ts
│   │       │   │   ├── Recommendation.ts
│   │       │   │   └── Analytics.ts
│   │       │   └── server.ts
│   │       └── package.json
│   │
│   └── future-project-template/     # Template for next projects
│       ├── frontend/
│       │   └── (same structure)
│       └── backend/
│           └── (same structure)
│
├── apps/
│   ├── platform-website/            # Main platform landing page
│   │   ├── index.tsx
│   │   ├── ProjectSelector.tsx      # Switch between dashboards
│   │   └── components/
│   │
│   └── shared-api-gateway/          # Optional: Single API gateway
│       ├── src/
│       │   ├── routes/
│       │   │   ├── /api/job-search/*
│       │   │   ├── /api/walmart/*
│       │   │   └── /api/project-selector
│       │   └── server.ts
│       └── package.json
│
├── shared/
│   ├── types/                       # Shared TypeScript interfaces
│   │   ├── api.types.ts
│   │   ├── database.types.ts
│   │   └── project.types.ts
│   │
│   ├── constants/
│   │   ├── apiEndpoints.ts
│   │   └── projectConfig.ts
│   │
│   └── utils/
│       ├── validators.ts
│       ├── formatters.ts
│       └── helpers.ts
│
├── package.json                     # Root monorepo config
├── turbo.json                       # Turborepo configuration
└── README.md
```

---

## How to Reuse Components & APIs

### 1. Shared UI Components

**File**: `packages/shared-ui/src/components/index.ts`

```typescript
// Export components usable across all projects
export { DashboardLayout } from './DashboardLayout';
export { DataTable } from './DataTable';
export { FileUploader } from './FileUploader';
export { MetricsCard } from './MetricsCard';
export { AIOutputViewer } from './AIOutputViewer';
export { ActionButtons } from './ActionButtons';
export { NavBar } from './NavBar';
```

**Usage in Job Search**:
```tsx
import { DashboardLayout, DataTable, FileUploader } from '@ai-platform/shared-ui';

- **Frontend on Vercel**: Optimized for React, CDN included, free tier is generous.
- **Backend on Railway**: Node.js is optimized, cheaper than Vercel for APIs.
    <FileUploader 
      accept=".pdf" 
      onUpload={handleResumeUpload}
      label="Upload Your Resume"
    />
    <DataTable 
      columns={['Title', 'Company', 'Match %', 'Actions']}
      data={jobs}
      onRowClick={handleJobSelect}
    />
  </DashboardLayout>
);
```

**Usage in Walmart Recommendation**:
```tsx
import { DashboardLayout, DataTable, MetricsCard } from '@ai-platform/shared-ui';

export const WalmartDashboard = () => (
  <DashboardLayout projectName="Item Recommendation">
    <MetricsCard title="Recommendations Generated" value={1250} />
    <DataTable 
      columns={['Product', 'Match %', 'Category', 'Actions']}
      data={recommendations}
      onRowClick={handleProductSelect}
    />
  </DashboardLayout>
);
```

---

### 2. Shared API Utilities

**File**: `packages/shared-api/src/llm/claudeWrapper.ts`

```typescript
// Reusable Claude API wrapper
import Anthropic from '@anthropic-ai/sdk';

interface LLMRequest {
  prompt: string;
  maxTokens?: number;
  context?: Record<string, any>;
}

export const callClaude = async (request: LLMRequest) => {
  const client = new Anthropic();
  
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: request.maxTokens || 2000,
    messages: [{
      role: 'user',
      content: request.prompt
    }]
  });
  
  return response.content[0].text;
};
```

**Usage in Job Search**:
```typescript
// job-search-agent/backend/src/services/resumeTailorService.ts
import { callClaude } from '@ai-platform/shared-api';

export const tailorResume = async (resume: string, jobDesc: string) => {
  const prompt = `Tailor resume for: ${jobDesc}\n\nResume: ${resume}`;
  return await callClaude({ 
    prompt,
    maxTokens: 2000
  });
};
```

**Usage in Walmart**:
```typescript
// walmart-item-recommendation/backend/src/services/recommendationService.ts
import { callClaude } from '@ai-platform/shared-api';

export const generateRecommendations = async (userProfile: any, products: any[]) => {
  const prompt = `Given user profile: ${JSON.stringify(userProfile)}\n` +
                 `Recommend from: ${JSON.stringify(products)}`;
  return await callClaude({ 
    prompt,
    maxTokens: 1500
  });
};
```

---

### 3. Shared Database Models

**File**: `packages/shared-api/src/database/BaseModel.ts`

```typescript
import mongoose from 'mongoose';

export interface BaseDocument {
  _id?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const baseSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const baseOptions = {
  timestamps: true,
  collection: undefined // Override in child models
};
```

**Job Search Model**:
```typescript
// job-search-agent/backend/src/models/Job.ts
import mongoose from 'mongoose';
import { baseSchema, baseOptions } from '@ai-platform/shared-api';

const jobSchema = new mongoose.Schema({
  ...baseSchema.obj,
  title: { type: String, required: true },
  company: String,
  description: String,
  salary: String,
  matchScore: Number
}, { ...baseOptions, collection: 'jobs' });

export const Job = mongoose.model('Job', jobSchema);
```

**Walmart Product Model**:
```typescript
// walmart-item-recommendation/backend/src/models/Product.ts
import mongoose from 'mongoose';
import { baseSchema, baseOptions } from '@ai-platform/shared-api';

const productSchema = new mongoose.Schema({
  ...baseSchema.obj,
  sku: { type: String, required: true },
  name: String,
  category: String,
  price: Number,
  description: String
}, { ...baseOptions, collection: 'walmart_products' });

export const Product = mongoose.model('Product', productSchema);
```

---

### 4. Project Selector NavBar

**File**: `packages/shared-ui/src/components/NavBar/index.tsx`

```tsx
import { Link } from 'react-router-dom';

interface ProjectConfig {
  name: string;
  path: string;
  icon: string;
  description: string;
}

interface NavBarProps {
  currentProject: string;
  projects: ProjectConfig[];
}

export const NavBar: React.FC<NavBarProps> = ({ currentProject, projects }) => (
  <nav style={styles.navbar}>
    <div style={styles.brand}>AI Platform</div>
    <div style={styles.projects}>
      {projects.map(project => (
        <Link 
          key={project.path}
          to={project.path}
          style={{
            ...styles.projectLink,
            ...(currentProject === project.name && styles.active)
          }}
        >
          {project.icon} {project.name}
        </Link>
      ))}
    </div>
  </nav>
);

const styles = {
  navbar: { 
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    color: '#fff'
  },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', marginRight: '2rem' },
  projects: { display: 'flex', gap: '1rem' },
  projectLink: { padding: '0.5rem 1rem', textDecoration: 'none', color: '#fff' },
  active: { backgroundColor: '#0066cc', borderRadius: '4px' }
};
```

---

## Deployment Strategy: One Platform, Multiple Dashboards

### Option A: Single Backend, Multiple Frontends

```
API Gateway (Railway)
├── /api/job-search/* → Job Search Service
├── /api/walmart/* → Walmart Service
└── /api/auth/* → Shared Auth

Frontends (Vercel)
├── job-search.yourdomain.com
└── walmart.yourdomain.com
```

**Deployment**:
```bash
# Deploy shared API
cd packages/shared-api
railway link
railway deploy

# Deploy job search frontend
cd packages/job-search-agent/frontend
vercel --prod --env PROJECT=job-search

# Deploy walmart frontend
cd packages/walmart-item-recommendation/frontend
vercel --prod --env PROJECT=walmart
```

### Option B: Monolithic Platform (All in One)

```
Single App (Railway)
├── Frontend: React Router with Project Switcher
│   ├── /job-search/* → Job Search Pages
│   └── /walmart/* → Walmart Pages
├── Backend: Express with Project-Based Routes
│   ├── /api/job-search/* → Job Search Endpoints
│   └── /api/walmart/* → Walmart Endpoints
└── Database: MongoDB with projectId field
```

**Deployment**:
```bash
# Single deployment
cd .
railway deploy
# Live at: https://ai-platform.up.railway.app
```

---

## Development Workflow

### Add New Project (e.g., Freelance Marketplace)

```bash
# 1. Copy template
cp -r packages/future-project-template packages/freelance-marketplace

# 2. Update package.json
cd packages/freelance-marketplace/frontend
npm init
npm install @ai-platform/shared-ui @ai-platform/shared-api

# 3. Create pages and services
mkdir -p src/pages src/hooks src/services

# 4. Build UI using shared components
# frontend/src/pages/FreelancerDashboard.tsx
import { DashboardLayout, DataTable } from '@ai-platform/shared-ui';

# 5. Create backend routes
# backend/src/routes/freelancers.ts
import { callClaude } from '@ai-platform/shared-api';

# 6. Link in monorepo
cd ../../../
npm run build

# 7. Deploy
vercel --prod --scope=your-scope
```

---

## Benefits of This Architecture

1. **Write Once, Use Everywhere**
   - UI components in 3+ projects
   - API utilities (Claude, auth, parsing) reused
   - Database models shared

2. **Easy to Add Projects**
   - Copy template folder
   - Plug in shared UI and API
   - Deploy independently

3. **Consistent UX**
   - Same NavBar, layout, styling
   - Same data table, file uploader
   - Users recognize the platform

4. **Scalable Backend**
   - One API gateway handles all projects
   - Database indexes by projectId
   - Easy to add new routes

5. **Fast Development**
   - Job Search: 1 week
   - Walmart POC: 3 days (reusing components)
   - Next project: 2 days (proven templates)

---

## Configuration File: `shared/constants/projectConfig.ts`

```typescript
export const PROJECTS = {
  JOB_SEARCH: {
    id: 'job-search',
    name: 'Job Search Agent',
    path: '/job-search',
    icon: 'briefcase',
    description: 'Automate job applications',
    apiEndpoint: '/api/job-search',
    features: ['resume-parser', 'job-search', 'tailoring', 'applications']
  },
  WALMART: {
    id: 'walmart',
    name: 'Item Recommendation',
    path: '/walmart',
    icon: 'shopping-cart',
    description: 'Walmart product recommendations',
    apiEndpoint: '/api/walmart',
    features: ['product-search', 'recommendations', 'analytics']
  },
  FREELANCE: {
    id: 'freelance',
    name: 'Freelance Marketplace',
    path: '/freelance',
    icon: 'users',
    description: 'Match freelancers with projects',
    apiEndpoint: '/api/freelance',
    features: ['matching', 'messaging', 'ratings']
  }
};

export const getProjectConfig = (projectId: string) => {
  return Object.values(PROJECTS).find(p => p.id === projectId);
};
```

Good luck! Build modular, ship fast.

### Answer: No, Anthropic is NOT a hosting provider

### What Anthropic Does
- Provides Claude API (LLM)
- Does NOT provide servers/hosting
- Does NOT host websites

### Why the Confusion
Many people think "AI company" = hosting, but Anthropic focuses solely on the language model.

### Anthropic's Role in Your Project

```
Your App (Vercel/Railway)
    ↓
  Calls Claude API
    ↓
Anthropic's Servers (inference only)
    ↓
Returns resume suggestions
```

---

## Reusable Frontend for Future Projects

### Best Approach: Monorepo Architecture

```
job-agent-monorepo/
├── packages/
│   ├── ui/              ← Reusable component library
│   ├── job-agent/       ← Your job search app
│   └── future-project/  ← Next project
└── package.json
```

### Step 1: Create a Reusable UI Library

```typescript
// packages/ui/src/components/index.ts
export { JobCard } from './JobCard';
export { ResumeUploader } from './ResumeUploader';
export { ApplicationDashboard } from './ApplicationDashboard';
export { AITailorButton } from './AITailorButton';
```

### Step 2: Use in Current Project

```tsx
import { JobCard, ResumeUploader } from '@job-agent/ui';

// Use in your app
<ResumeUploader onUpload={handleUpload} />
```

### Step 3: Reuse in Next Project

```tsx
import { JobCard } from '@job-agent/ui';

// Use in a freelance platform, recruitment app, etc.
<JobCard job={job} />
```

### Tools for Component Libraries
- **Storybook**: Document & test components
- **Turborepo**: Manage monorepo builds
- **npm workspaces**: Link packages locally

### Simpler Alternative (Start Here)
Create a `src/components/shared/` folder in your current project, then extract to a separate npm package later when you have a second project.

---

## Complete Architecture for Your Project

### System Overview

```
Frontend (Vercel)
├── React app
├── Upload resume
├── View tailored versions
└── Track applications

    ↓ API calls ↓

Backend (Railway/GCP)
├── POST /api/parse-resume → Claude
├── POST /api/search-jobs → Job API
├── POST /api/tailor-resume → Claude
├── GET /api/jobs
└── POST /api/apply

    ↓ ↓ ↓

External Services
├── Claude API (resume tailoring)
├── Job API (LinkedIn, Indeed scraper, or API)
├── Gmail API (send applications)
└── MongoDB Atlas (store data)

    ↓ Cron Jobs ↓

Scheduled Tasks
├── Daily job search (Cloud Scheduler)
├── Email notifications
└── Auto-apply to matches
```

### Key Endpoints

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout

// Resume Management
POST /api/parse-resume         // Upload and parse resume
GET /api/resume/original
GET /api/resume/tailored/:jobId
PUT /api/resume/tailored/:jobId

// Job Search
POST /api/search-jobs          // Search jobs with filters
GET /api/jobs                  // Get paginated jobs
GET /api/jobs/:id              // Get job details

// Resume Tailoring
POST /api/tailor-resume        // Tailor resume for job
POST /api/compare-resumes      // Get diff view

// Applications
POST /api/apply                // Apply to job
GET /api/applications          // Get all applications
PATCH /api/applications/:id    // Update application status

// Admin/Scheduling
POST /api/admin/trigger-search // Manual job search
GET /api/admin/logs            // View automation logs
PATCH /api/admin/settings      // Update settings
```

---

## Technology Stack

### Frontend
```
Framework:      React 19
Build Tool:     Vite or create-react-app
Routing:        react-router-dom
UI Components:  Material-UI or Tailwind CSS
State:          React hooks
File Upload:    react-dropzone
Diff View:      react-diff-viewer
Deployment:     Vercel
```

### Backend
```
Runtime:        Node.js (v20+)
Framework:      Express
Language:       TypeScript
Database:       MongoDB
Scheduling:     node-cron
PDF Parsing:    pdfparse or pdf-parse
Web Scraping:   Cheerio (if needed)
API Calls:      node-fetch or axios
Deployment:     Railway or Google Cloud Run
```

### External APIs
```
LLM:            Claude API (Anthropic)
Job Search:     LinkedIn API / Indeed scraper / Job API
Email:          Gmail API or SendGrid
Authentication: JWT or OAuth
```

---

## Database Schema (MongoDB)

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Resumes Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref Users),
  originalText: string,
  originalPDF: Buffer,
  uploadedAt: Date,
  updatedAt: Date
}
```

### Jobs Collection
```typescript
{
  _id: ObjectId,
  title: string,
  company: string,
  description: string,
  salary: string,
  location: string,
  url: string,
  source: string,
  keywords: [string],
  matchScore: number,
  fetchedAt: Date,
  expiresAt: Date
}
```

### TailoredResumes Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref Users),
  jobId: ObjectId (ref Jobs),
  tailoredText: string,
  matchAnalysis: {
    score: number,
    matchedKeywords: [string],
    gaps: [string]
  },
  createdAt: Date
}
```

### Applications Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref Users),
  jobId: ObjectId (ref Jobs),
  tailoredResumeId: ObjectId (ref TailoredResumes),
  status: 'draft' | 'applied' | 'rejected' | 'interview',
  appliedAt: Date,
  feedbackAt: Date,
  notes: string,
  createdAt: Date
}
```

---

## Implementation Tips

### Resume Parsing
```typescript
import pdf from 'pdf-parse';

const parseResume = async (pdfBuffer) => {
  const data = await pdf(pdfBuffer);
  return data.text; // Returns raw text
};
```

### Resume Tailoring with Claude
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const tailorResume = async (originalResume, jobDescription) => {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Tailor this resume for the following job:
      
RESUME:
${originalResume}

JOB DESCRIPTION:
${jobDescription}

Rewrite the resume to highlight relevant skills and experience.`
    }]
  });
  
  return response.content[0].text;
};
```

### Job Search Scheduling
```typescript
import cron from 'node-cron';

// Run daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  const newJobs = await searchJobs();
  const matchedJobs = await analyzeMatches(newJobs);
  await notifyUser(matchedJobs);
});
```

---

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-railway-api.com
REACT_APP_CLAUDE_API_KEY=sk-ant-...
```

### Backend (.env)
```
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/jobagent
CLAUDE_API_KEY=sk-ant-...
GMAIL_API_KEY=...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

---

## Deployment Checklist

### Before Deploying

- [ ] All endpoints tested locally
- [ ] Environment variables set on hosting platform
- [ ] Database indexes created
- [ ] Error handling added to all API routes
- [ ] API rate limiting implemented
- [ ] CORS configured correctly
- [ ] Sensitive data removed from code
- [ ] README updated with setup instructions

### Vercel Deployment (Frontend)
```bash
# Connect repo to Vercel
# Set environment variables in Vercel dashboard
# Deploy: git push origin main
```

### Railway Deployment (Backend)
```bash
# 1. Create Railway account and project
# 2. Connect GitHub repo
# 3. Set environment variables
# 4. Railway auto-deploys on push
```

---

## Testing Strategy

### Unit Tests (Jest)
```typescript
test('should parse resume correctly', async () => {
  const text = await parseResume(pdfBuffer);
  expect(text).toContain('Software Engineer');
});
```

### API Tests (Supertest)
```typescript
test('POST /api/search-jobs should return jobs', async () => {
  const response = await request(app)
    .post('/api/search-jobs')
    .send({ keyword: 'React' });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('jobs');
});
```

### Integration Tests
- Test resume parsing → tailoring → application flow
- Test database operations
- Test API responses

---

## Monitoring & Debugging

### Logs to Monitor
- API request/response times
- Resume parsing errors
- Claude API failures
- Job search results count
- Application success/failure rates
- Scheduled job execution

### Tools
```
Production Logs:  Railway/Google Cloud built-in logging
Error Tracking:   Sentry or LogRocket
Performance:      New Relic or DataDog free tier
```

---

## Success Metrics

- [ ] Day 1: Backend running on Railway, frontend on Vercel
- [ ] Day 2: Upload resume, parse and store in database
- [ ] Day 3: Fetch 10+ jobs and display in frontend
- [ ] Day 4: Tailor resume for each job (manual trigger)
- [ ] Day 5: Track applications in dashboard
- [ ] Day 6: Cron job runs daily, sends email notifications
- [ ] Day 7: Everything deployed, ready for portfolio

---

## Future Enhancements

1. **Authentication**: Add login/signup with OAuth
2. **Email Integration**: Send applications directly via Gmail
3. **LinkedIn Integration**: Auto-apply to LinkedIn jobs
4. **Analytics**: Track application success rates
5. **Cover Letters**: Generate tailored cover letters
6. **Interview Prep**: AI-generated interview questions
7. **Mobile App**: React Native version
8. **Webhook Support**: Real-time job notifications
9. **Multiple Resumes**: Support different resume versions
10. **Salary Analysis**: Track salary trends for roles

---

## Resources & Links

### Job APIs
- [LinkedIn Jobs API](https://docs.microsoft.com/en-us/linkedin/)
- [Indeed API](https://opensource.indeedeng.io/api-documentation/)
- [JSearch API](https://rapidapi.com/letscrape-6bam/api/jsearch)
- [Job Board Scraper](https://www.npmjs.com/package/job-scraper)

### LLM APIs
- [Claude API Docs](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/)

### Hosting Guides
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments/overview)
- [Railway Docs](https://docs.railway.app/)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)

### Tutorials
- [Building Agents with Claude](https://docs.anthropic.com/en/docs/build-a-basic-ai-chatbot)
- [Node.js Resume Parser](https://github.com/EyeOfMidas/pdf-parse)
- [Express TypeScript Boilerplate](https://github.com/typestack/routing-controllers)

---

## Questions? Next Steps

1. **Start with Day 1**: Set up Vercel + Railway accounts
2. **Fork this template**: Create GitHub repo with basic structure
3. **Test locally**: `npm run dev` and `npm run start:server`
4. **Deploy skeleton**: Get frontend and backend deployed before coding
5. **Iterate daily**: Follow the 1-week plan

Good luck!
