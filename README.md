# Shortly

URL shortening with private per-user management and click analytics. React/Vite/TypeScript frontend, Node.js/Express API, parameterized PostgreSQL queries through pg, managed Neon Auth identity, and Framer Motion interactions.

The application root is this `Project` directory. Public short links redirect to their destinations; only the owner can list links or read analytics. Short codes are identifiers, not authorization credentials.

## Current verification

Local implementation includes 11 passing backend tests, real Neon SQL/constraints, two-user managed identity/API integration, and an earlier passing Chrome browser journey. Link deletion and stricter registration password checks were added afterward; the latest browser rerun reached registration and creation but hit a temporary backend error before completion. TypeScript/Vite builds succeed and dependency audit reports zero vulnerabilities. Landing, dashboard and analytics screenshots are in [docs/screenshots](docs/screenshots). The [Vercel frontend](https://shortly-vault-cf00.vercel.app) is deployed; the Render backend is pending private GitHub repository access, so the live app journey is not yet verified. See [TEST_PLAN.md](docs/TEST_PLAN.md).

## Local setup on Windows

Use Node.js 22 or later. From this directory:

```powershell
cd backend
npm.cmd ci
Copy-Item .env.example .env
```

Populate the ignored `.env` with a development PostgreSQL connection and the managed Auth settings described in [DEPLOYMENT.md](docs/DEPLOYMENT.md). Do not print or commit its contents. Use a connection with certificate verification enabled (`sslmode=verify-full` on the configured Neon connection).

```powershell
npm.cmd run db:migrate
npm.cmd test
npm.cmd start
```

Migration targets the database in `DATABASE_URL`; inspect that target before running it. Use an isolated development/test database, never an unidentified production connection. For the current development setup, application tables are in database `shortly` on branch `shortly-development`; inherited `neondb` tables are not application migration targets.

In a second terminal from Project:

```powershell
cd frontend
npm.cmd ci
Copy-Item .env.example .env
```

Set `VITE_API_BASE_URL=http://localhost:5000` and `VITE_NEON_AUTH_URL` to the development managed Auth URL, then:

```powershell
npm.cmd run dev
```

Open http://localhost:5173 for the configured development setup. Register that exact origin with managed Auth and backend CORS. The development server proxies /neon-auth to the provider to keep cookies on the frontend origin. Public frontend configuration is not a secret; database URLs and passwords must never appear in VITE variables.

## Commands and verification

| Location | Command | Purpose |
| --- | --- | --- |
| backend | npm.cmd test | Automated HTTP/security/service checks |
| backend | npm.cmd run db:migrate | Apply checked-in schema to configured development database |
| backend | node scripts/verify-database.js | Transaction-rolled-back verification against the real configured development database |
| backend | npm.cmd start | API at port 5000 unless PORT overrides it |
| frontend | npm.cmd run build | TypeScript and production Vite build |
| frontend | npm.cmd run dev | Local frontend |
| backend | npm.cmd run test:provider | Real managed identity and two-user API smoke; creates synthetic development accounts |
| qa | npm.cmd ci; npm.cmd test | Chrome browser journey; requires both local servers and installed Chrome |
| qa | npm.cmd run test:proxy | Production auth gateway unit check |

The real database verifier uses a transaction and rolls back its fixtures. It is still a database operation and must target the identified development database. API tests use controlled dependencies; they do not replace database or browser tests.

## API

Create with `POST /api/shorten`, JSON `{ "longUrl": "https://example.com/article" }`, and `Authorization: Bearer <managed-auth-token>`. Successful creation returns 201 with shortCode, shortUrl and longUrl. Follow `GET /:shortCode` publicly for a 302 redirect. Private endpoints are `GET /api/urls`, `GET /api/summary`, and `GET /api/stats/:shortCode`. Safe health is `GET /api/health`.

See [API contract](docs/API_CONTRACT.md), [Postman collection](backend/postman/Shortly.postman_collection.json), [architecture](ARCHITECTURE.md), [database schema](docs/DATABASE_SCHEMA.md), and [technical decisions](docs/DECISIONS.md).

## Deploying after approval

[render.yaml](render.yaml) prepares the Express web service with manual deploys and secret placeholders. The Git repository root is this Project directory, so Render uses `backend` and Vercel uses `frontend` as their root directories. The frontend build command is `npm run build` and output is `dist`.

The Blueprint is source configuration, not proof of a successful platform deployment. Configure real production origins, secure environment values and Auth session topology before live verification. See [deployment instructions](docs/DEPLOYMENT.md).

The Vercel frontend also needs server-side NEON_AUTH_BASE_URL for api/auth.js. Its /neon-auth rewrite proxies managed sessions with first-party cookies; application data APIs and public short links still run on Render. Verify this route on the actual deployment before claiming restricted-browser support. The installed SDK's token() returned cached session data during browser QA, so services/auth.ts obtains JWTs through the provider's documented /token endpoint.

## Limits

Analytics are approximate and may include automated traffic or miss events during write failures. The service does not scan destinations for phishing or malware. Public redirects reveal their destinations. Managed sessions require real browser verification across deployment domains; signing out does not immediately revoke already-issued short-lived JWTs. Supporting Higgsfield image generation was attempted but the connected plan rejected generation, so no generated media asset is claimed.

