# System Architecture - Job Search Automation Agent

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
│  (Browser: Desktop/Mobile)                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          v
┌─────────────────────────────────────────────────────────────┐
│          FRONTEND LAYER (React 19)                           │
│  Deployment: Vercel (https://yourdomain.vercel.app)         │
│                                                              │
│  Routes:                                                     │
│  - / → Home                                                  │
│  - /profile → User Profile                                  │
│  - /job-search → Job Search Dashboard                       │
│  - /resume → Resume Manager                                 │
│  - /applications → Application Tracker                      │
│                                                              │
│  Components:                                                │
│  - DashboardLayout                                           │
│  - DataTable (jobs, applications)                           │
│  - FileUploader (resume PDF)                                │
│  - AIOutputViewer (tailored resume)                         │
│  - MetricsCard (statistics)                                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ REST API Calls
                          │ JSON Payloads
                          v
┌─────────────────────────────────────────────────────────────┐
│         BACKEND LAYER (Node.js + Express)                   │
│  Deployment: Railway (https://job-agent.up.railway.app)    │
│                                                              │
│  API Endpoints:                                              │
│                                                              │
│  POST /api/parse-resume                                     │
│    - Accept: PDF file                                       │
│    - Return: Resume text + extracted keywords              │
│                                                              │
│  GET /api/jobs                                              │
│    - Params: keyword, location, page                        │
│    - Return: List of jobs with match scores                │
│                                                              │
│  POST /api/tailor-resume                                    │
│    - Body: { resumeId, jobId }                              │
│    - Return: Tailored resume text                           │
│                                                              │
│  POST /api/apply                                            │
│    - Body: { jobId, tailoredResumeId }                      │
│    - Return: Application confirmation                      │
│                                                              │
│  GET /api/applications                                      │
│    - Return: User's application history                     │
│                                                              │
│  POST /api/admin/trigger-search                             │
│    - Manually start job search                              │
│                                                              │
│  Services:                                                   │
│  - resumeParserService (PDF → text)                         │
│  - jobSearchService (API → job listings)                    │
│  - resumeTailorService (Claude API → tailored resume)       │
│  - applicationService (track applications)                  │
└─────────────────────────────────────────────────────────────┘
                          │
                ┌─────────┼─────────┬──────────────┐
                │         │         │              │
                v         v         v              v
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ MongoDB  │ │  Claude  │ │   Job    │ │  Gmail   │
        │  Atlas   │ │   API    │ │   APIs   │ │   API    │
        │ Database │ │Tailoring │ │LinkedIn, │ │ Email    │
        │          │ │ & Analysis│ │ Indeed   │ │Send      │
        │Collections:│          │          │          │
        │- Users   │ │ Anthropic│ │ RapidAPI │ │ Google   │
        │- Resumes │ │          │ │          │ │          │
        │- Jobs    │ │          │ │          │ │          │
        │- Apps    │ │          │ │          │ │          │
        │- Tailored│ │          │ │          │ │          │
        └──────────┘ └──────────┘ └──────────┘ └──────────┘
        Free Tier:  Free Credits  Free/Paid    Free API
        512MB       $5/month       Varied       Quota
```

## Data Flow

### 1. User Uploads Resume
```
User → Browser → POST /api/parse-resume (PDF file)
                    ↓
         Express receives file → PDF Parser
                    ↓
         Extract text → Store in MongoDB (Resumes collection)
                    ↓
         Return: { resumeId, keywords, preview }
                    ↓
         Browser displays resume preview
```

### 2. Job Search
```
User clicks "Search Jobs" → POST /api/search-jobs { keyword, location }
                    ↓
         Express → Job API (LinkedIn/Indeed/RapidAPI)
                    ↓
         Fetch 10-20 job listings
                    ↓
         Store in MongoDB (Jobs collection)
                    ↓
         Return job list to browser
                    ↓
         Browser displays jobs in DataTable
```

### 3. Resume Tailoring
```
User clicks "Tailor Resume" for job → POST /api/tailor-resume { jobId, resumeId }
                    ↓
         Express retrieves:
         - Original resume text (from MongoDB)
         - Job description (from MongoDB)
                    ↓
         Call Claude API with prompt:
         "Tailor this resume for this job..."
                    ↓
         Claude returns tailored resume
                    ↓
         Store in MongoDB (TailoredResumes collection)
                    ↓
         Return tailored resume to browser
                    ↓
         Browser displays diff view: Original vs Tailored
```

### 4. Application Tracking
```
User clicks "Apply" → POST /api/apply { jobId, tailoredResumeId }
                    ↓
         Store application in MongoDB (Applications collection)
         {
           jobId: "123",
           tailoredResumeId: "456",
           status: "applied",
           appliedAt: timestamp
         }
                    ↓
         Optionally: Send email via Gmail API
                    ↓
         Return: Application confirmation
                    ↓
         Browser updates Applications dashboard
```

### 5. Scheduled Automation (Daily)
```
Every day at 9 AM (via node-cron) →
         ↓
Run automateJobSearch() →
         ↓
POST /api/search-jobs (auto with saved keywords) →
         ↓
For each new job:
  - Analyze match score (Claude)
  - If score > 70%:
    - Tailor resume
    - Generate email template
    - Store as draft application
         ↓
Send email notification to user: "New jobs found! Review and apply."
```

## Database Schema (MongoDB)

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: string,
  name: string,
  password: string (bcrypt hashed),
  phone?: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### resumes
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref users),
  originalText: string,           // Full resume text
  originalPDF: Buffer,            // PDF file stored
  keywords: [string],             // Extracted keywords
  uploadedAt: Date,
  updatedAt: Date
}
```

#### jobs
```javascript
{
  _id: ObjectId,
  title: string,                  // "Senior React Developer"
  company: string,                // "Tech Corp"
  description: string,            // Full job description
  salary: string,                 // "120k-150k"
  location: string,               // "San Francisco, CA"
  url: string,                    // LinkedIn/Indeed URL
  source: string,                 // "linkedin" | "indeed" | "rapidapi"
  keywords: [string],             // Extracted requirements
  matchScore: number,             // 0-100 (initially null)
  fetchedAt: Date,
  expiresAt: Date,                // Remove old jobs
  createdAt: Date
}
```

#### tailored_resumes
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref users),
  jobId: ObjectId (ref jobs),
  originalResumeId: ObjectId (ref resumes),
  tailoredText: string,           // Tailored resume
  matchAnalysis: {
    score: number,                // Match percentage
    matchedKeywords: [string],    // What matches
    gaps: [string],               // What's missing
    suggestions: [string]         // Recommendations
  },
  createdAt: Date
}
```

#### applications
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref users),
  jobId: ObjectId (ref jobs),
  tailoredResumeId: ObjectId (ref tailored_resumes),
  status: string,                 // "draft" | "applied" | "rejected" | "interview"
  appliedAt: Date,
  feedbackAt: Date,               // When response received
  notes: string,                  // User notes
  automatedApply: boolean,        // Was it auto-applied?
  createdAt: Date,
  updatedAt: Date
}
```

## External API Integrations

### 1. Claude API (Resume Tailoring)
```
Endpoint: https://api.anthropic.com/v1/messages
Method: POST
Auth: Bearer CLAUDE_API_KEY

Request:
{
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 2000,
  messages: [{
    role: "user",
    content: "Tailor this resume for this job..."
  }]
}

Response:
{
  content: [{
    type: "text",
    text: "Tailored resume..."
  }]
}
```

### 2. Job Search APIs
```
Option A: LinkedIn API (requires partnership)
  - Limited free access
  - Enterprise pricing

Option B: RapidAPI Job Search (Recommended)
  - Free tier: 100 requests/month
  - Covers LinkedIn, Indeed, etc.
  - https://rapidapi.com/letscrape-6bam/api/jsearch

Option C: Web Scraping (Cheerio)
  - Scrape LinkedIn job listings
  - Free but slower
  - May violate ToS

Selected: RapidAPI (best balance)
```

### 3. Gmail API (Email Notifications)
```
Endpoint: https://www.googleapis.com/gmail/v1/users/me/messages/send
Auth: OAuth2 (user's Google account)

Functionality:
- Send job notifications
- Send application confirmations
- Send interview reminders
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│            PRODUCTION ENVIRONMENT               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend                Backend        Database│
│  ─────────────           ──────────     ────────│
│  Vercel                  Railway       MongoDB  │
│  https://job-            https://job-  Atlas   │
│  search.vercel.app       agent.up.     512MB   │
│                          railway.app   Free    │
│  Regions:                Regions:              │
│  - US (Virginia)         - US-Central1         │
│  - EU (Frankfurt)        Auto-scaled           │
│  - Asia (Singapore)                           │
│                                                 │
│  CDN: Yes                RAM: 512MB            │
│  SSL: Yes                CPU: Shared            │
│  Auto-scaling: Yes       SSL: Yes              │
│  Environment vars: Yes   Env vars: Yes         │
│                          Backups: Auto         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Security Measures

1. **Environment Variables**: API keys stored in Railway/Vercel, not in code
2. **HTTPS**: All connections encrypted (SSL/TLS)
3. **CORS**: Configured to allow only frontend domain
4. **Authentication**: JWT tokens for user sessions
5. **Database**: MongoDB Atlas network security rules
6. **Rate Limiting**: API endpoints limited to 100 req/min per user
7. **Input Validation**: All inputs sanitized before database storage
8. **PDF Handling**: Malware scanning on uploaded PDFs
9. **API Keys**: Never logged or exposed in error messages

## Performance Optimization

1. **Database Indexing**:
   - userId (frequent queries)
   - jobId (foreign key lookups)
   - createdAt (sorting by date)

2. **Caching**:
   - Cache job listings for 1 hour
   - Cache user resume for session

3. **API Optimization**:
   - Batch job searches (avoid API overuse)
   - Queue resume tailoring (don't overwhelm Claude API)
   - Pagination on job listings

4. **Frontend**:
   - Lazy load components
   - Code splitting by route
   - Image compression

## Monitoring & Logging

```
Frontend (Vercel):
- View logs in Vercel dashboard
- Error tracking: Optional (LogRocket)

Backend (Railway):
- View logs in Railway dashboard
- Error tracking: Optional (Sentry)
- Performance: Optional (New Relic free tier)

Database (MongoDB):
- View metrics in Atlas dashboard
- Query performance insights
- Storage usage monitoring
```

## Future Enhancements

1. **AI Learning**: Store application success rates, learn from patterns
2. **Multi-Resume Support**: Different resumes for different job types
3. **Interview Prep**: AI-generated practice questions
4. **Salary Tracking**: Analyze salary trends
5. **Network Integration**: Connect with recruiters
6. **Mobile App**: React Native for iOS/Android
7. **Browser Extension**: Apply directly from job boards
8. **Cover Letter Generation**: Auto-generate tailored cover letters
9. **Analytics Dashboard**: Track success rates, time to hire, etc.
10. **Integration with LinkedIn**: Direct apply via LinkedIn API

---

**Created**: February 23, 2026
**Status**: DAY 1 - Architecture Designed
**Next Steps**: MongoDB setup, Railway deployment, Backend integration
