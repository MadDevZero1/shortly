# Deployment plan

Status: frontend deployed to Vercel at https://shortly-vault-cf00.vercel.app; backend is not deployed. Production Neon branch production (br-orange-glade-b51u6yff) now has a separate shortly database with application schema and managed Auth on neondb. Existing neondb application tables were preserved. Render cannot fetch the private GitHub repository until its integration has repository access.

## Approval gates
The user authorized continuous implementation on 2026-11-04. Deployment starts only after local integration, tests, browser review and production builds pass, and the user approves deployment. Do not alter production resources during development setup.

## Phase 1 development prerequisites
Inspect existing Neon account/project configuration before selecting resources. Confirm supported managed Auth availability without disabling existing network restrictions. Use isolated development and test branches. Validate actual subject/issuer/audience, configured JWKS, managed session behavior and SDK exports. Apply reviewed schema only to the identified development/test target; never print connection secrets.

## Environment inventory
| Backend variable | Purpose |
| --- | --- |
| PORT | Local default 5000; platform provides deployment port |
| NODE_ENV | development/test/production |
| DATABASE_URL | Secret pg connection for correct branch |
| FRONTEND_URL | Explicit frontend CORS allowlist configuration |
| PUBLIC_BASE_URL | Public Render redirect origin, not frontend origin |
| NEON_AUTH_BASE_URL | Full managed branch Auth URL |
| NEON_AUTH_JWKS_URL | Trusted full JWKS endpoint |
| NEON_AUTH_ISSUER | Expected issuer origin, not full Auth path |
| NEON_AUTH_AUDIENCE | Expected issued audience, verified from branch |
| TEST_DATABASE_URL | Dedicated test-only connection; not production |
| TRUST_PROXY_HOPS | Local 0; proposed Render 1, verify actual proxy topology |

Frontend uses public `VITE_API_BASE_URL` (local http://localhost:5000) and `VITE_NEON_AUTH_URL`. No database credentials, signing keys, passwords or access tokens in VITE variables. Future .env.example files document exact implemented names with no secrets. Keep actual .env files ignored.

## Render backend, after approval
Project/render.yaml defines a Node web service, free compute plan, npm ci --omit=dev build, npm start, /api/health, manual deployment trigger, and secret placeholders. The Git root is Project and the Render rootDir is backend. No migration runs automatically at service start; apply reviewed schema to the approved production target separately.

Node 22 or later is required by the backend package. Confirm service name does not unintentionally match an existing Blueprint-managed resource. Register actual FRONTEND_URL and PUBLIC_BASE_URL, deliberate proxy trust and verified HTTPS Auth settings. Test health, authenticated creation, public 302 and private analytics on the deployed service.

Current Render HTML Blueprint and environment-variable references were read on 2026-11-04 after Markdown fetches were unsupported. Public schema retrieval succeeded; full schema/platform validation of the completed YAML is still pending. Run render blueprints validate Project/render.yaml with current Render CLI before sync. Validation does not deploy. Sources: [Blueprint reference](https://render.com/docs/blueprint-spec), [environment variables](https://render.com/docs/configure-environment-variables).

## Vercel frontend, after approval
Configure frontend root and actual Vite build/output, SPA deep-link fallback and API/Auth configuration. Register exact frontend trusted origins in Auth and backend CORS. Verify production cookie/session topology in restricted browsers; if a supported same-origin auth proxy/shared-domain setup is needed, implement and verify it before release. Configure production email/recovery requirements using current provider guidance; no mail-delivery success claims without a real test.

Implemented: frontend/api/auth.js is a Node Web Request/Response gateway, routed by frontend/vercel.json from /neon-auth/:path*. Set server-side NEON_AUTH_BASE_URL to the approved production branch Auth URL, alongside VITE_NEON_AUTH_URL and VITE_API_BASE_URL. The gateway forwards only to that configured HTTPS provider, bounds requests, keeps responses uncached and rewrites cookie Domain/Path for first-party sessions. A local gateway unit test passes; actual Vercel routing, cookies and Safari remain deployment acceptance checks. The browser always calls /neon-auth; Vite supplies the equivalent development proxy. Application APIs stay on Render.

## Release verification and rollback
Two test accounts must remain isolated through registration, sign-in, reload, create, copy, redirect, analytics, recovery and sign-out on live hosts. Confirm short links use Render origin and sensitive endpoints cannot be fetched anonymously. Record actual URLs, build revisions, test evidence, limitations and approval. Keep prior deployments/configuration recoverable; database changes must be reviewed separately from code rollback. No destructive rollback assumptions.
