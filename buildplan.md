# MASTER BUILD PLAN — SHORTLY
## URL Shortener & Click Analytics Platform

**Role:** You are the Lead Software Architect, Senior Backend Engineer, Frontend Engineer, QA Engineer, and Technical Project Manager.

**Project:** Shortly — URL Shortener with Click Analytics  
**Development environment:** Windows  
**Primary coding agent:** Codex  
**Backend:** Node.js + Express + JavaScript  
**Database:** Neon Serverless PostgreSQL  
**Frontend:** React + Vite + TypeScript  
**Styling:** Tailwind CSS  
**Animations:** Framer Motion  
**Backend deployment:** Render  
**Frontend deployment:** Vercel  
**API testing:** Postman  
**Version control:** Git + GitHub  

---

# PART 1 — YOUR MISSION

Build a complete, production-minded URL shortening platform with click analytics.

A user should be able to:

1. Enter a long URL.
2. Generate a short URL.
3. Copy and share the short URL.
4. Visit the short URL and get redirected to the original destination.
5. Track how many times the short URL was clicked.
6. View daily click statistics.
7. View the most common referrers.
8. View a clean dashboard containing their shortened URLs and analytics.

The finished product must have:

- A reliable REST API.
- A properly designed PostgreSQL database.
- A polished, responsive frontend.
- Meaningful animations and micro-interactions.
- Proper request validation and error handling.
- Automated tests.
- Postman collection.
- Complete technical documentation.
- Deployment-ready configuration.

Do not build everything in one pass.

Work through the phases below in order.

**Your priority order:**

1. Correct architecture.
2. Correct database design.
3. Reliable backend.
4. Complete testing.
5. Excellent frontend experience.
6. Integration.
7. Deployment.
8. Documentation and portfolio readiness.

---

# PART 2 — INITIAL PROJECT INSPECTION

Before modifying anything:

1. Inspect the current working directory.
2. Check whether an existing project exists.
3. Inspect its files, package.json, Git status, and existing documentation.
4. Identify existing dependencies and reusable components.
5. Do not overwrite existing user work.
6. Identify missing requirements.
7. Create a project implementation plan.

If the directory is empty, initialize the project.

If the directory already contains a project, adapt to its existing structure where reasonable.

Do not install unnecessary dependencies.

Do not start implementing features yet.

---

# PART 3 — CREATE THE PROJECT DOCUMENTATION FIRST

Create the following files before feature implementation.

```text
shortly/
│
├── AGENTS.md
├── PRD.md
├── DESIGN_SYSTEM.md
├── ARCHITECTURE.md
│
├── docs/
│   ├── API_CONTRACT.md
│   ├── DATABASE_SCHEMA.md
│   ├── DECISIONS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TASK_TRACKER.md
│   ├── TEST_PLAN.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   ├── CHANGELOG.md
│   └── INTERVIEW_PREPARATION.md
│
├── backend/
│
├── frontend/
│
└── README.md
```

## 3.1 PRD.md — Product Requirements Document

Document:

### Product overview
Shortly is a URL shortening platform that converts long URLs into compact shareable links and provides click analytics.

### Problem
Long URLs are inconvenient to share and difficult to track.

### Target users
- Students.
- Developers.
- Content creators.
- Small businesses.
- Anyone who shares URLs.

### Core features

**URL management**
- Submit long URLs.
- Generate short codes.
- Copy short URLs.
- View created URLs.
- View original destinations.

**Redirect system**
- Resolve short codes.
- Redirect using HTTP 302.
- Record click events.

**Analytics**
- Total clicks.
- Clicks per day.
- Top referrers.
- Recent click activity.

**Frontend**
- Landing page.
- URL shortening form.
- Dashboard.
- URL details and analytics.
- Loading, success, empty, and error states.

### Out of scope for MVP
- Custom domains.
- Paid subscriptions.
- QR code generation.
- Enterprise authentication.
- Geographic analytics.
- Advanced bot detection.

Document functional requirements, non-functional requirements, user flows, and acceptance criteria.

## 3.2 AGENTS.md — AI Agent Instructions

This file governs how you work throughout the project.

Rules:

1. Read PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, and relevant docs before implementation.
2. Never make major architectural changes without recording the reason.
3. Keep frontend and backend independently runnable.
4. Use modular architecture.
5. Use parameterized SQL queries exclusively.
6. Never hardcode secrets.
7. Validate every external request.
8. Never silently ignore errors.
9. Do not claim a feature works without testing it.
10. Do not remove working functionality to fix unrelated issues.
11. Reuse existing components.
12. Avoid unnecessary abstractions.
13. Keep functions small and focused.
14. Update documentation whenever architecture or behavior changes.
15. Keep TASK_TRACKER.md updated.
16. Record important decisions in DECISIONS.md.
17. Never commit .env files or credentials.
18. Do not deploy or modify production resources without approval.
19. Do not use WSL2. Use native Windows commands.
20. Explain important technical decisions in beginner-friendly language.

### Before every phase

- Read relevant documentation.
- Inspect affected files.
- Identify dependencies.
- State your implementation approach.
- Identify possible risks.
- Implement.
- Run relevant tests.
- Report results.
- Update documentation.

## 3.3 DESIGN_SYSTEM.md — Visual Design Rules

Do not produce a generic dashboard template.

Create a distinctive, premium SaaS experience.

### Brand direction

Brand: Shortly

Visual personality:
- Premium.
- Minimal.
- Modern.
- Developer-friendly.
- Clean typography.
- Generous whitespace.
- Subtle depth.
- Purposeful animations.

Use a light-first interface with a refined dark navy/indigo accent palette. Support a consistent dark theme if practical.

### Visual references

Study the visual quality and interaction patterns of:

- Linear.
- Vercel.
- Stripe.
- Raycast.
- Modern analytics dashboards.

Use them as inspiration, not as templates to copy.

### Typography

Use a professional font pairing or a single well-selected modern font.

Maintain:
- Clear heading hierarchy.
- Readable body text.
- Consistent font weights.
- Proper numerical alignment for analytics.

### Components

Define reusable styles for:

- Buttons.
- Inputs.
- Cards.
- Navigation.
- Modals.
- Dropdowns.
- Toast notifications.
- Tables.
- Charts.
- Loading skeletons.
- Empty states.
- Error states.

### Motion design

Use Framer Motion where it improves the experience.

Include:
- Smooth page transitions.
- Staggered dashboard card entrances.
- Button hover feedback.
- Animated counters.
- Subtle chart entrances.
- Form success animations.
- Copy-to-clipboard feedback.
- Modal transitions.
- Navigation transitions.

Avoid excessive animations.

Respect prefers-reduced-motion.

### Responsive design

Support:

- Mobile: below 640px.
- Tablet: 640–1024px.
- Desktop: above 1024px.

All pages must be usable on mobile.

### Accessibility

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Accessible labels.
- Sufficient contrast.
- Appropriate ARIA attributes.
- Reduced-motion support.

## 3.4 ARCHITECTURE.md — System Architecture

Document:

- System overview.
- Technology stack.
- Frontend architecture.
- Backend architecture.
- Database architecture.
- API communication.
- Environment configuration.
- Deployment architecture.
- Security boundaries.
- Future scalability.

Architecture:

```text
                 USER
                   |
                   v
          React + Vite Frontend
             (Vercel)
                   |
                   | HTTPS / REST
                   v
          Node.js + Express API
                (Render)
                   |
                   v
          Neon PostgreSQL
             /         \
            v           v
          URLs        Clicks
```

The short-link redirect endpoint must be handled by the backend, not the frontend.

---

# PART 4 — ARCHITECTURAL DECISIONS

Before writing production code, record the following decisions in docs/DECISIONS.md.

Use this format:

```text
Decision ID:
Date:
Title:
Context:
Options considered:
Chosen option:
Reason:
Trade-offs:
Consequences:
Status:
```

Record at least these decisions:

### DEC-001: Backend framework
Express with Node.js.

Reason: Direct exposure to HTTP methods, middleware, routes, controllers, and request/response handling.

### DEC-002: Database
Neon PostgreSQL.

Reason: Managed PostgreSQL with a convenient cloud connection.

### DEC-003: Database access
Use node-postgres (pg).

Do not introduce an ORM for the MVP. The goal is to understand SQL, schema design, indexes, joins, and aggregation.

### DEC-004: Short-code generation
Use cryptographically secure random Base62 generation with eight characters initially.

Use the alphabet:

```text
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
```

Insert the generated code into PostgreSQL.

Keep a UNIQUE constraint on short_code.

If PostgreSQL reports a unique violation, generate another code and retry a small bounded number of times.

Do not use a check-then-insert strategy as the sole collision protection.

Explain why random codes are preferable to sequential IDs for public links.

### DEC-005: Redirect status
Use HTTP 302 for short-link redirects.

### DEC-006: Click analytics
Record each redirect as an event in the clicks table.

Store timestamps in PostgreSQL as TIMESTAMPTZ and use UTC consistently.

### DEC-007: Daily analytics
Aggregate click events using PostgreSQL date grouping.

Use a consistent UTC reporting timezone for the MVP.

### DEC-008: Frontend
React + Vite + TypeScript.

### DEC-009: Frontend animations
Framer Motion.

### DEC-010: Deployment
Frontend on Vercel, backend on Render, database on Neon.

If you believe a decision should change, explain the alternatives and trade-offs before changing it.

---

# PART 5 — PARALLEL SUBAGENT STRATEGY

You are the lead agent.

Use specialized subagents when the Codex environment supports them.

Do not assume subagents exist if the environment does not provide them. If unavailable, execute the same responsibilities sequentially.

## Agent 1 — Backend Architect

Responsibilities:
- Review REST API design.
- Design Express folder structure.
- Review route/controller/service separation.
- Identify error-handling requirements.
- Review validation and security.
- Produce backend implementation recommendations.

Deliverable:
backend architecture review.

## Agent 2 — Database Engineer

Responsibilities:
- Design PostgreSQL tables.
- Define data types.
- Define primary and foreign keys.
- Design indexes.
- Review constraints.
- Review analytics queries.
- Identify potential query performance problems.

Deliverable:
DATABASE_SCHEMA.md and schema.sql review.

## Agent 3 — UI/UX Designer

Responsibilities:
- Define the visual direction.
- Design landing page.
- Design dashboard.
- Design analytics views.
- Define reusable components.
- Plan animations.
- Review mobile responsiveness.

Use available design skills or high-fidelity design plugins if they are actually available in the environment.

Do not pretend a plugin was used if it is unavailable.

Deliverable:
UI/UX specification and DESIGN_SYSTEM.md review.

## Agent 4 — QA Engineer

Responsibilities:
- Design API test cases.
- Identify edge cases.
- Review input validation.
- Test redirects.
- Test analytics aggregation.
- Review error handling.
- Design frontend integration tests.

Deliverable:
TEST_PLAN.md and test coverage recommendations.

## Agent 5 — Security Reviewer

Responsibilities:
- Review SQL injection risks.
- Review URL validation.
- Review redirect behavior.
- Review rate limiting.
- Review CORS configuration.
- Review secret handling.
- Review analytics privacy.
- Review abuse prevention.

Deliverable:
SECURITY.md review.

## Parallel execution rules

1. Delegate independent research and review tasks in parallel.
2. Do not allow multiple agents to edit the same files simultaneously.
3. Keep the lead agent responsible for architecture.
4. Consolidate agent findings.
5. Resolve disagreements explicitly.
6. Record final decisions.
7. Assign implementation ownership to one agent per file group.
8. Review all subagent changes before integration.

Subagents must return:

- Findings.
- Recommended decisions.
- Risks.
- Files affected.
- Tests required.

Do not delegate the entire project blindly.

---

# PART 6 — DATABASE DESIGN

Implement two primary tables.

## URLs table

```sql
CREATE TABLE urls (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    short_code VARCHAR(8) NOT NULL UNIQUE,

    long_url TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Index:

```sql
CREATE INDEX idx_urls_created_at
ON urls (created_at DESC);
```

Why:

- Primary key provides unique row identification.
- Unique short_code supports fast lookup and prevents duplicate codes.
- created_at index supports chronological URL listing.

## Clicks table

```sql
CREATE TABLE clicks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    url_id BIGINT NOT NULL
        REFERENCES urls(id)
        ON DELETE CASCADE,

    referrer TEXT,

    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Indexes:

```sql
CREATE INDEX idx_clicks_url_id_clicked_at
ON clicks (url_id, clicked_at DESC);

CREATE INDEX idx_clicks_referrer
ON clicks (referrer);
```

Explain:

- url_id is a foreign key.
- ON DELETE CASCADE removes associated click records when a URL is deleted.
- Composite index supports URL-specific analytics and date-range queries.
- Referrer index can help referrer filtering and grouping, although its usefulness depends on data distribution and query plans.

Do not add indexes without explaining their purpose.

Review indexes using EXPLAIN ANALYZE after implementation.

## Database deliverables

Create:

```text
backend/
└── db/
    ├── pool.js
    ├── schema.sql
    └── queries/
```

Use Neon connection string through DATABASE_URL.

Use environment variables.

Support the connection requirements of Neon, including SSL configuration where needed.

Do not expose database credentials to frontend code.

---

# PART 7 — BACKEND IMPLEMENTATION

Use:

- Node.js.
- Express.
- JavaScript.
- pg.
- dotenv.
- cors.
- helmet.
- express-rate-limit.
- A URL validation library if useful.
- A test framework such as Jest or Vitest with Supertest.

## Folder structure

```text
backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── routes/
│   │   ├── url.routes.js
│   │   ├── redirect.routes.js
│   │   └── analytics.routes.js
│   │
│   ├── controllers/
│   │   ├── url.controller.js
│   │   ├── redirect.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/
│   │   ├── url.service.js
│   │   ├── redirect.service.js
│   │   └── analytics.service.js
│   │
│   ├── db/
│   │   ├── pool.js
│   │   └── queries/
│   │
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── not-found.middleware.js
│   │   └── rate-limit.middleware.js
│   │
│   ├── utils/
│   │   ├── short-code.js
│   │   └── url-validator.js
│   │
│   └── config/
│       └── env.js
│
├── tests/
├── package.json
└── .env.example
```

## API 1 — Create short URL

```http
POST /api/shorten
Content-Type: application/json
```

Request:

```json
{
  "longUrl": "https://www.example.com/some/long/path"
}
```

Successful response:

```json
{
  "success": true,
  "data": {
    "shortCode": "a8Kp29Xz",
    "shortUrl": "https://your-domain.com/a8Kp29Xz",
    "longUrl": "https://www.example.com/some/long/path"
  }
}
```

Status: 201 Created.

Validation:

1. Request body must be valid JSON.
2. longUrl must exist.
3. longUrl must be a string.
4. Validate with a URL parser.
5. Only allow HTTP and HTTPS protocols.
6. Reject malformed or unsupported URLs.
7. Set reasonable input length limits.

Do not accept javascript:, data:, file:, or other unsupported protocols.

Return a clear 400 error for invalid input.

## API 2 — Redirect

```http
GET /:shortCode
```

Flow:

1. Read shortCode from request parameters.
2. Find the corresponding URL in PostgreSQL.
3. Return 404 if it does not exist.
4. Record a click event.
5. Redirect to the original long URL.

Successful response:

```http
HTTP/1.1 302 Found
Location: https://www.example.com/
```

Consider logging failure separately from redirect failure.

A click logging database failure should not unnecessarily prevent a valid redirect. Implement a deliberate best-effort logging strategy and record operational errors.

Never redirect to a URL that was not retrieved from the stored URL record.

## API 3 — Analytics

```http
GET /api/stats/:shortCode
```

Response example:

```json
{
  "success": true,
  "data": {
    "shortCode": "a8Kp29Xz",
    "totalClicks": 120,
    "clicksPerDay": [
      {
        "date": "2026-11-01",
        "clicks": 25
      }
    ],
    "topReferrers": [
      {
        "referrer": "google.com",
        "clicks": 50
      },
      {
        "referrer": "direct",
        "clicks": 30
      }
    ]
  }
}
```

Use SQL aggregation.

Do not fetch every click into JavaScript and calculate statistics there.

Use:

- COUNT(*) for total clicks.
- DATE_TRUNC or appropriate UTC date grouping for daily counts.
- GROUP BY referrer for referrer counts.
- ORDER BY and LIMIT for top referrers.

Normalize missing referrers as direct traffic.

Define how malformed or unavailable referrer headers are handled.

Return 404 when the short code does not exist.

## API 4 — Health check

```http
GET /api/health
```

Return application health and a safe database connectivity status.

Never expose credentials or internal connection details.

---

# PART 8 — HTTP STATUS CODE POLICY

Implement and document:

| Scenario | Status |
|---|---:|
| Short URL created | 201 |
| Redirect successful | 302 |
| Analytics retrieved | 200 |
| Health check successful | 200 |
| Invalid request body | 400 |
| Invalid URL | 400 |
| Invalid short code format | 400 |
| Short code not found | 404 |
| Unknown API route | 404 |
| Unsupported HTTP method | 405 where explicitly handled |
| Rate limit exceeded | 429 |
| Database/server failure | 500 |
| Temporary service unavailable | 503 where appropriate |

Use consistent JSON error responses for API endpoints.

Do not convert every error into a generic 500 response.

---

# PART 9 — BACKEND TESTING

Do not proceed to frontend integration until backend tests pass.

Test:

1. Valid URL creation.
2. Missing longUrl.
3. Null longUrl.
4. Numeric longUrl.
5. Malformed URL.
6. Unsupported protocol.
7. Very long URL.
8. Successful redirect.
9. Unknown short code.
10. Duplicate short-code collision.
11. Click event creation.
12. Total click aggregation.
13. Daily click aggregation.
14. Referrer aggregation.
15. Missing referrer.
16. Database failure.
17. Rate limiting.
18. Unknown API route.

Use a test database or isolated test fixtures.

Do not run destructive test cleanup against production data.

Record actual results in TEST_PLAN.md.

---

# PART 10 — POSTMAN COLLECTION

Create and maintain:

```text
backend/postman/
    Shortly.postman_collection.json
```

Include requests for:

- Health check.
- Create short URL.
- Invalid URL.
- Redirect.
- Nonexistent short code.
- Analytics.
- Rate-limit behavior.

Use Postman variables:

```text
baseUrl
shortCode
longUrl
```

Add automated assertions for expected status codes and response fields.

Export the actual collection into the repository.

Do not create a fake collection containing requests that have not been tested.

---

# PART 11 — FRONTEND DEVELOPMENT

The frontend must feel like a real SaaS product.

Do not start UI implementation before the design system and user flows are defined.

## Required pages

### Page 1 — Landing page

Include:

- Shortly logo.
- Navigation.
- Hero section.
- Main URL input.
- Shorten button.
- Clear value proposition.
- Product preview.
- Feature sections.
- Analytics preview.
- Footer.

The main shortening action must work with the actual backend.

### Page 2 — Dashboard

Include:

- Sidebar or responsive navigation.
- Total URLs created.
- Total clicks.
- Recent URLs.
- URL search.
- Copy buttons.
- Shorten URL action.
- Analytics entry points.

### Page 3 — URL analytics

Display:

- Short URL.
- Original URL.
- Total clicks.
- Daily click chart.
- Top referrers.
- Recent click activity.

Use a chart library if it improves the result.

Do not fabricate analytics numbers in the actual connected application.

Use clearly identified mock data only during isolated UI prototyping.

### Page 4 — Short URL result

Display:

- Generated short URL.
- Copy action.
- Original URL.
- Success feedback.
- Link to analytics.

### Page 5 — Error and empty states

Create proper UI for:

- No URLs created.
- No clicks recorded.
- Invalid URL.
- Backend unavailable.
- Loading.
- Missing short code.

## Frontend architecture

```text
frontend/
│
├── src/
│   ├── app/
│   ├── pages/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   └── analytics/
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── main.tsx
│
├── public/
├── package.json
└── .env.example
```

Keep API calls outside UI components.

Use typed API response models.

Create reusable components.

Implement loading, error, empty, and success states.

Use environment variables for the backend API base URL.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Never place secrets in VITE_ environment variables.

---

# PART 12 — HIGH-FIDELITY UI AND MOTION

Treat visual quality as a separate engineering requirement.

Before implementation:

1. Inspect available design skills and tools.
2. If a high-fidelity design skill/plugin is available, use it.
3. Define the design direction.
4. Establish component patterns.
5. Plan page layouts.
6. Implement the visual system consistently.

Create meaningful animations with Framer Motion.

Examples:

- Landing hero content entrance.
- Floating or subtly animated product preview.
- Button hover and press interactions.
- Animated success state after shortening.
- Dashboard cards entering with staggered motion.
- Number counters.
- Chart reveal animations.
- Smooth modal opening and closing.
- Copy button feedback.

Avoid:

- Excessive gradients.
- Random floating objects.
- Overly large rounded cards everywhere.
- Unnecessary animations.
- Distracting motion.
- Poor contrast.
- Generic AI-generated dashboard appearance.

### Visual acceptance gate

Before proceeding to deployment:

- Check the landing page.
- Check dashboard layout.
- Check analytics layout.
- Check mobile layout.
- Check all interactions.
- Check typography.
- Check visual consistency.
- Check loading and error states.

Run the application locally and inspect it in a browser if browser tooling is available.

Do not declare the UI complete merely because the build succeeds.

---

# PART 13 — FRONTEND AND BACKEND INTEGRATION

Connect the frontend to the actual backend.

Required integration flow:

```text
User enters long URL
        |
        v
Frontend validation
        |
        v
POST /api/shorten
        |
        v
Express controller
        |
        v
PostgreSQL INSERT
        |
        v
Short URL response
        |
        v
Display result
        |
        v
User opens short URL
        |
        v
Backend redirects + records click
        |
        v
Frontend fetches analytics
        |
        v
Display charts and statistics
```

Integration requirements:

1. Use the actual API.
2. Configure CORS for the frontend origin.
3. Handle network errors.
4. Handle loading states.
5. Avoid hardcoded API responses.
6. Ensure the generated short URL points to the deployed backend domain.
7. Test the entire user journey.
8. Verify analytics update after redirects.

---

# PART 14 — ENVIRONMENT VARIABLES

Backend:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=
FRONTEND_URL=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5000
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Create .env.example files.

Ensure .env is included in .gitignore.

Validate required environment variables at application startup.

Do not commit actual secrets.

---

# PART 15 — SECURITY AND RELIABILITY

Implement:

- Helmet security headers.
- CORS allowlist.
- Rate limiting on URL creation.
- Rate limiting on analytics endpoints where appropriate.
- Parameterized SQL.
- URL validation.
- Request size limits.
- Centralized error handling.
- Environment-based secrets.
- Safe logging.
- Database connection management.

Analytics privacy:

- Do not store raw IP addresses in the MVP.
- Do not collect unnecessary personal data.
- Do not store full user-agent strings unless justified.
- Treat referrer information as untrusted input.
- Document that analytics are approximate and may include bots or automated requests.

URL shorteners can be abused for phishing.

Document the MVP's abuse limitations and possible future protections.

Do not claim production-grade abuse prevention without implementing it.

---

# PART 16 — DEPLOYMENT

Deployment should begin only after local integration and tests pass.

## Neon

1. Create a Neon PostgreSQL project.
2. Obtain the connection string.
3. Configure DATABASE_URL securely.
4. Run schema.sql.
5. Verify connectivity.
6. Verify indexes and constraints.

## Render

1. Push backend to GitHub.
2. Create a Render Web Service.
3. Configure build and start commands.
4. Add environment variables.
5. Configure production database connection.
6. Configure frontend CORS origin.
7. Configure PUBLIC_BASE_URL.
8. Deploy.
9. Test health endpoint.
10. Test URL creation and redirect.

## Vercel

1. Import frontend repository/project.
2. Configure the correct root directory.
3. Configure build settings.
4. Set VITE_API_BASE_URL to the Render API URL.
5. Deploy.
6. Test frontend-to-backend communication.
7. Verify analytics.

Never claim deployment succeeded unless the actual deployed service has been verified.

Keep local, staging, and production environment variables separate.

---

# PART 17 — DOCUMENTATION MAINTENANCE

Every phase must update relevant documentation.

## docs/IMPLEMENTATION_PLAN.md

Record:

- Phase.
- Objective.
- Tasks.
- Dependencies.
- Acceptance criteria.
- Completion status.

## docs/TASK_TRACKER.md

Use:

```text
[ ] Not started
[~] In progress
[x] Completed
[!] Blocked
```

Every task should have an owner and verification status.

## docs/CHANGELOG.md

Record meaningful changes:

- Date.
- Feature.
- Files changed.
- Reason.
- Tests performed.

## docs/INTERVIEW_PREPARATION.md

For each major technical feature, document:

1. What was implemented?
2. Why was it implemented?
3. What alternatives were considered?
4. Why was this approach chosen?
5. What trade-offs exist?
6. How would it scale?
7. What questions might an interviewer ask?

Include explanations of:

- HTTP methods.
- REST API.
- Status codes.
- Express routes.
- Middleware.
- Controllers and services.
- PostgreSQL tables.
- Primary and foreign keys.
- Indexes.
- Unique constraints.
- Parameterized queries.
- Base62.
- Collision handling.
- HTTP redirects.
- SQL aggregation.
- Database connection pooling.
- Environment variables.
- CORS.
- Rate limiting.
- Deployment.

Keep explanations simple and technically accurate.

---

# PART 18 — EXECUTION PHASES AND APPROVAL GATES

Follow these phases in order.

## PHASE 0 — Discovery and documentation

Tasks:
- Inspect repository.
- Create project structure.
- Create all required documentation.
- Define architecture.
- Record decisions.
- Obtain subagent reviews.

Acceptance:
- Documentation exists.
- Architecture is consistent.
- No conflicting decisions.
- Implementation plan approved.

STOP and report.

## PHASE 1 — Database

Tasks:
- Configure Neon.
- Create tables.
- Create constraints.
- Create indexes.
- Test database connectivity.
- Test queries.

Acceptance:
- Tables exist.
- Foreign key works.
- Unique constraint works.
- Analytics queries work.
- Connection configuration is secure.

STOP and report.

## PHASE 2 — Backend foundation

Tasks:
- Initialize Express.
- Configure environment.
- Set up database pool.
- Implement middleware.
- Set up routes.
- Set up controllers.
- Set up services.
- Add centralized error handling.

Acceptance:
- Server starts.
- Health endpoint works.
- Database connectivity is verified.

STOP and report.

## PHASE 3 — Backend functionality

Tasks:
- URL validation.
- Short-code generation.
- URL creation.
- Redirect handling.
- Click recording.
- Analytics endpoints.

Acceptance:
- All required API behaviors work.
- Correct status codes.
- SQL is parameterized.
- Collision handling is implemented.

STOP and report.

## PHASE 4 — Backend QA and Postman

Tasks:
- Automated tests.
- Edge-case tests.
- Postman collection.
- Database query review.
- Security review.

Acceptance:
- Critical backend tests pass.
- Postman collection is exported.
- Actual test results are documented.

STOP and report.

## PHASE 5 — Frontend design and foundation

Tasks:
- Define design tokens.
- Build layout.
- Build reusable components.
- Build landing page.
- Build responsive navigation.
- Add animations.

Acceptance:
- UI runs locally.
- Visual direction is consistent.
- Mobile layout works.

STOP and show the UI.

## PHASE 6 — Dashboard and analytics UI

Tasks:
- Dashboard.
- URL list.
- Analytics page.
- Charts.
- Empty states.
- Loading states.
- Error states.

Acceptance:
- All required screens exist.
- Components are reusable.
- No fabricated connected analytics data.

STOP and show the UI.

## PHASE 7 — Integration

Tasks:
- Connect API.
- Configure CORS.
- Test URL creation.
- Test redirect.
- Test analytics.
- Test error handling.
- Test full user journey.

Acceptance:
- Actual frontend/backend/database integration works.

STOP and report.

## PHASE 8 — Final QA and optimization

Tasks:
- Responsive testing.
- Accessibility review.
- Performance review.
- Security review.
- Build verification.
- Documentation update.

Acceptance:
- No known critical bugs.
- Production builds succeed.
- Test evidence is recorded.

STOP and request deployment approval.

## PHASE 9 — Deployment

Tasks:
- Deploy backend on Render.
- Configure Neon production database.
- Deploy frontend on Vercel.
- Configure production environment variables.
- Test deployed endpoints.
- Verify complete user journey.

Acceptance:
- Live frontend works.
- Live API works.
- Live database works.
- Redirects work.
- Analytics work.

## PHASE 10 — Portfolio readiness

Tasks:
- Complete README.
- Add architecture diagram.
- Add screenshots.
- Add API examples.
- Add Postman collection.
- Document setup instructions.
- Document technical decisions.
- Prepare interview explanations.

Acceptance:
- Another developer can clone and run the project.
- The repository explains architecture and implementation.
- The project is ready to demonstrate.

---

# PART 19 — HOW YOU MUST COMMUNICATE WITH ME

I am a student learning backend engineering.

Do not just write code and disappear.

For every phase, use this response format:

### 1. What we are building
Explain the objective in simple language.

### 2. Technical decisions
Explain what you chose and why.

### 3. Implementation plan
List the exact files you will create or modify.

### 4. Subagent findings
Summarize relevant independent reviews.

### 5. Implementation
Execute the approved work.

### 6. Verification
Show:
- Commands executed.
- Tests executed.
- Tests passed.
- Tests failed.
- Known limitations.

### 7. Documentation
List updated documentation files.

### 8. Interview explanation
Explain the main concepts I should understand and defend.

### 9. Next phase
Tell me what comes next and whether approval is needed.

Use concise, beginner-friendly explanations.

Do not overwhelm me with unnecessary theory.

Do not claim a task is completed merely because code was generated.

---

# PART 20 — MASTER EXECUTION RULES

1. Start with Phase 0 only.
2. Do not immediately generate the entire application.
3. Create documentation before implementation.
4. Ask me only when a genuinely important decision cannot be safely resolved.
5. Use sensible defaults for minor decisions.
6. Do not change the selected technology stack without approval.
7. Keep a clear decision log.
8. Use parallel subagents for independent work.
9. Prevent conflicting file edits.
10. Test each phase before moving forward.
11. Maintain documentation continuously.
12. Preserve all working code.
13. Never fabricate test results.
14. Never fabricate deployment success