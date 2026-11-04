# Test plan and evidence

## Status
Implementation and verification are in progress. Automated API and real development-database checks have executed as recorded below. Browser/account-session and production deployment acceptance remain separate; do not infer them from unit-test success.

## Verification layers
- Unit: platform URL validator, secure code generator, bounded collision policy, referrer normalization and environment validation.
- HTTP: Node test runner or Vitest plus Supertest with controlled dependencies; choose one during backend setup, not both.
- PostgreSQL integration: dedicated test branch/database, actual schema, transactions/isolated fixtures and explicit cleanup protection. Mock tests alone do not prove SQL correctness.
- Browser: frontend with actual backend and test PostgreSQL/Auth, two accounts, keyboard/mobile/reduced motion, account/session lifecycle and chart accuracy.
- Postman: collection with baseUrl, shortCode and externally supplied test tokens. Never export secrets. Disable automatic redirect following for 302 assertions.

## Required backend cases
1. Creation: valid HTTPS/HTTP, missing/null/number/array/object longUrl, malformed URL/JSON, unsupported schemes, embedded credentials, control characters, overlength, oversized body, unsupported content type.
2. Codes: exact eight-character alphabet, forced UNIQUE collision succeeds on retry, five-attempt exhaustion, unrelated database failures never retried as collisions, concurrent inserts preserve uniqueness.
3. Redirect: exact stored Location, existing code 302, absent code 404, malformed code 400, GET records one event, HEAD records none, no-store header. Click-write failure still redirects with sanitized operational log; lookup failure returns 503 without Location.
4. Analytics: zero clicks, lifetime totals, 30-day bounds/zero fill, UTC midnight despite session timezone, top-ten stable ordering, latest-twenty ordering, missing/malformed/oversized referrer becomes direct, hostname-only storage. Check decimal-string counts and IDs.
5. Listing: zero-click rows, deterministic pagination/ties, bounded queries, literal search escaping, summaries independent from search, no count multiplication from joins.
6. Security/HTTP: SQL-injection-like strings remain data; safe errors/health; CORS allow/deny and Authorization preflight; explicit method behavior; rate limits/Retry-After; JSON API 404 before redirect routes; database outage/recovery.

## Private ownership gate
Two identities A/B are mandatory for every private endpoint. Neither can list/search/count/read the other's records. Spoofing ownerId in body/query/header cannot assign ownership. Foreign-owned stats and absent stats have the same 404 shape. Unauthenticated access returns 401 with no metadata. Public short links still redirect without authentication.

JWT tests include forged signature, expired/malformed token, wrong issuer/audience, unsupported algorithm, missing/empty subject, anonymous role, unknown signing key, key rotation, and JWKS outage. Verifier failures fail closed; infrastructure outage is distinct from invalid credentials.

## Frontend and journey gate
Registration → sign-in → create → result → copy → public redirect → updated private analytics → reload session → sign-out. Exercise recovery, expired session, token refresh, offline/API failure, 429, invalid input, no links, no matches, zero clicks, missing/foreign-owned code, clipboard refusal and selectable fallback.

Account switching must clear private cache and discard/cancel responses from the previous session. No persistent app-managed bearer token storage. Verify documented residual token lifetime after sign-out rather than claiming immediate revocation.

Inspect 375/768/1024/1440px and zoom, long URLs, keyboard focus/order, labels/errors/live regions, contrast, reduced motion, accessible chart data, and actual screenshots. Verify browser/Auth cookie topology in Chromium and Safari or explicitly record an unverified browser as a release limitation requiring resolution.

## Database checks
UNIQUE/FK/CHECK/cascade work in real PostgreSQL; owner index and click index reviewed through representative EXPLAIN (ANALYZE, BUFFERS). Record plans and observations. Never run destructive fixtures against production; require explicit test database identity rather than a heuristic URL-name check alone.

## Evidence log
| Date | Check | Result |
| --- | --- | --- |
| 2026-11-04 | Workspace inspection | No package.json/application; Node/npm/Git executables available |
| 2026-11-04 | git status / rev-parse | Expected inspection failure: directory is not a Git repository |
| 2026-11-04 | Three independent review agents | Completed read-only; no runtime tests |
| 2026-11-04 | Neon official JWT documentation via plugin | Read; issuer/JWKS/session limitations recorded; no resources changed |
| 2026-11-04 | PowerShell documentation validation | PASS: 16 required/review docs present; all local Markdown links resolve; backend/frontend reserved; 13 decisions; no feature code/manifests |
| 2026-11-04 | backend: npm.cmd test | Lead reported PASS: 9/9 automated tests |
| 2026-11-04 | backend: node scripts/verify-database.js | Lead reported PASS on identified Neon development branch/database: create, scoped search, private 401/404, redirect, HEAD, counts, UTC 30-day series, referrer normalization and summary; transaction rolled back |
| 2026-11-04 | Real database constraints and UTC boundaries | Lead reported PASS: UNIQUE 23505, FK 23503, CHECK 23514, cascade and separate UTC-midnight buckets; transaction rolled back |
| 2026-11-04 | EXPLAIN on fixture | Owner index used for tiny fixture; no production-performance claim |
| 2026-11-04 | Higgsfield supporting image | Generation rejected: connected account requires Basic plan or higher; no image/job produced |

Development target: Neon project `red-pine-03467712`, branch `shortly-development` (`br-curly-shadow-b5yw3o0l`), application database `shortly`. Managed Auth enabled on the development branch's neondb. Existing inherited tables were preserved. No credentials are included here.

Future commands and pass/fail totals must be entered after execution. Planned test cases above are not passing-test evidence.

## Local implementation evidence, 2026-11-04
- backend/npm.cmd test: **10 passed, 0 failed**, including controlled HTTP journeys, collision/error policies and real EdDSA/JWKS cryptographic verification.
- backend/npm.cmd run test:database: actual Neon create/search/summary/analytics, anonymous and cross-owner denial, redirect/HEAD, normalized referrers, 30 UTC dates; UNIQUE, FK, CHECK, midnight grouping and cascade passed in a rolled-back transaction. EXPLAIN used the owner index on a tiny fixture; no production performance claim.
- backend/npm.cmd run test:provider: **passed** real managed registration, token acquisition, backend JWKS verification, two-user isolation, public redirect, updated click count and sign-out. Synthetic accounts/links remain on development only.
- qa/npm.cmd test: **passed** Chrome reduced-motion journey through landing, registration, create/result, 302, private analytics, reload, sign-out and sign-in again. Landing widths 375/768/1024/1440 and mobile dashboard/analytics have no horizontal overflow. Empty search passed, with no JavaScript page exceptions. Real screenshots under docs/screenshots inspected by lead.
- qa/npm.cmd run test:proxy: **1 passed, 0 failed**, fixed upstream target, method/path guards and first-party cookie rewrite/no-store behavior.
- frontend/npm.cmd run build: **passed** TypeScript and Vite. Bundle warning about approximately 603kB JS before gzip remains a performance improvement candidate, not a measured latency result.
- frontend/npm.cmd audit fix --legacy-peer-deps: compatible patch applied; **0 vulnerabilities** reported. Replaced legacy SDK with @neon/neon-js 0.10.2. Backend and QA install audits also reported zero vulnerabilities.
- Postman collection exported with assertions; **not executed** with Postman/Newman. Higgsfield generation rejected by account plan; no generated asset claimed.

Not verified: Safari, recovery email delivery/reset against a received message, full accessibility audit, clean-machine clone/setup, Render Blueprint platform validation and production performance.

## Deployment progress, 2026-11-04
- Private GitHub repository `space-rock-0/shortly` received commit `a510a3d` on main; no .env, node_modules, dist or browser-failure image was tracked.
- Backend tests after deletion feature: **11 passed, 0 failed**; TypeScript/Vite production build passed. The browser run covering the new flow reached registration and link creation, then failed on a transient backend service error while loading the dashboard. Deletion in a real browser remains to be rerun.
- Production Neon branch has isolated shortly database with urls/clicks schema and managed Auth on neondb. No production user journey has been completed.
- Vercel production deployment `dpl_BFvz3RWGH581RxWJ9YbEP6meKSLp` reached READY. Public landing page returned HTTP 200 and `/neon-auth/get-session` returned JSON with HTTP 200. The backend is still unavailable, so authenticated app flow on live hosts is unverified.
- Render service creation returned `repository URL is invalid or unfetchable` for the private repository. Its GitHub integration needs access before creation can continue.

## Live release verification, 2026-11-04
- Public repository `MadDevZero1/shortly` main at `e6f7996` contains 71 source/documentation files and no screenshots. Local screenshots are ignored and retained on disk.
- Render service `srv-dblm5lp5efls73e6e9eg` deployed commit `e6f7996` to https://shortly-api-stbw.onrender.com. `/api/health` returned 200 with database available; CORS allowed the exact frontend origin and DELETE method.
- Vercel production deployment `dpl_FxxePnyzmEp9aEMjdDJAVX7AnsgX` reached READY at https://shortly-vault-cf00.vercel.app. Its public page and same-origin Auth gateway returned 200.
- Approved synthetic production browser test passed sign-up with password confirmation/rules and show/hide, session restoration, creation, short URL 302 to the destination, private analytics, owner deletion, deleted URL 404, sign-out and sign-in again. No page exceptions or mobile horizontal overflow at checked widths. The test link was deleted; the synthetic Auth account remains on production.
- The password complexity checks are enforced by the app UI for sign-up and reset. Managed Neon Auth is the identity provider; its direct sign-up endpoint may have a different password policy.
- A backend test rerun inside the restricted shell failed with loopback `EACCES`; the same unchanged suite passed **11/11** when rerun with local socket access.
