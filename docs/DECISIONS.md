# Decision log

All entries dated 2026-11-04. Accepted entries reflect the master plan or explicit user clarification; implementation and plan approval remain separate. Production remains undeployed.

## DEC-001: Backend framework
- Context: educational REST backend with explicit HTTP behavior.
- Options considered: Express, framework with more conventions.
- Chosen option: Node.js + Express + JavaScript.
- Reason: exposes routes, middleware and request handling directly.
- Trade-offs: validation and structure must be explicit.
- Consequences: keep routes/controllers/services focused.
- Status: Accepted from master plan.

## DEC-002: Database
- Context: relational links and click events.
- Options considered: Neon PostgreSQL, self-hosted PostgreSQL.
- Chosen option: Neon PostgreSQL.
- Reason: managed PostgreSQL and isolated development/test branches.
- Trade-offs: external service configuration and connectivity.
- Consequences: use environment-based secure connections.
- Status: Accepted from master plan.

## DEC-003: Database access
- Context: learn SQL, joins, indexes and aggregation.
- Options considered: pg, ORM.
- Chosen option: pg with parameterized SQL.
- Reason: explicit queries and small dependency footprint.
- Trade-offs: manual SQL and migrations.
- Consequences: pool and query modules under backend/src/db.
- Status: Accepted from master plan.

## DEC-004: Short codes
- Context: concurrent creation and public identifiers; old README suggests sequential IDs.
- Options considered: sequential Base62 IDs, random Base62.
- Chosen option: eight random Base62 characters using crypto.randomInt(62), UNIQUE constraint, five bounded insert attempts.
- Reason: master plan wins; random codes reduce trivial enumeration and hide creation order.
- Trade-offs: collisions possible; identifiers are not access control.
- Consequences: retry only the named short-code UNIQUE violation, never unrelated errors.
- Status: Accepted from master plan; supersedes historical README suggestion.

## DEC-005: Redirect status
- Context: clicks should continue reaching backend.
- Options considered: 301, 302.
- Chosen option: 302 with no-store; HEAD redirects without click.
- Reason: temporary redirect avoids deliberately persistent redirect caching.
- Trade-offs: each ordinary navigation contacts API; bots still affect totals.
- Consequences: only use stored validated destinations.
- Status: Accepted.

## DEC-006: Click events
- Context: analytics must not unnecessarily break sharing.
- Options considered: strict transactional click write, bounded best-effort write.
- Chosen option: one event per GET; await bounded insert, log safe failures, still redirect after successful lookup.
- Reason: preserve valid redirects during analytics-write failure.
- Trade-offs: counts can underreport and include bots.
- Consequences: test write failure separately from lookup failure; TIMESTAMPTZ, no raw IP/user agent.
- Status: Accepted.

## DEC-007: Daily reporting
- Context: timezone and unbounded history ambiguity.
- Options considered: browser timezone, UTC; all-history daily series, bounded series.
- Chosen option: SQL UTC aggregation, 30-day zero-filled series; lifetime total/referrer counts.
- Reason: deterministic reporting with bounded UI payload.
- Trade-offs: daily chart and lifetime total cover different windows.
- Consequences: label windows explicitly and test midnight boundaries.
- Status: Accepted.

## DEC-008: Frontend
- Context: independent client and REST backend.
- Options considered: React/Vite, server-rendered full-stack framework.
- Chosen option: React + Vite + TypeScript + Tailwind.
- Reason: requested stack and independent development.
- Trade-offs: client routing/session state need explicit handling.
- Consequences: typed API models and services outside components.
- Status: Accepted from master plan.

## DEC-009: Animation
- Context: useful feedback without distraction.
- Options considered: Framer Motion, custom animation system.
- Chosen option: Framer Motion.
- Reason: requested stack and component state transitions.
- Trade-offs: dependency cost; reduced-motion implementation required.
- Consequences: restrained transform/opacity transitions; no video pipeline for ordinary UI motion.
- Status: Accepted from master plan.

## DEC-010: Hosting
- Context: separately hosted frontend/API/database.
- Options considered: Vercel + Render + Neon, all-in-one host.
- Chosen option: Vercel frontend, Render backend, Neon database.
- Reason: requested learning/deployment architecture.
- Trade-offs: CORS, auth origins and independent configuration.
- Consequences: test real deployed journey; require deployment approval.
- Status: Accepted architecture; deployment pending.

## DEC-011: Private ownership and identity
- Context: user explicitly chose private per-user links after review found no ownership model.
- Options considered: shared public workspace, browser-local history, authenticated private ownership.
- Chosen option: private ownership; propose managed Neon Auth email/password sessions and bearer JWTs to Express, urls.owner_id from verified subject.
- Reason: cross-device identity and actual server-side authorization without custom password handling.
- Trade-offs: adds auth setup, login/recovery UI, token and cross-origin-session verification. Public redirects still reveal destinations. Token logout is not immediate JWT revocation.
- Consequences: authenticated create/list/summary/stats; foreign-owner 404; owner-scoped index; managed accounts rather than app password tables. Basic auth now in scope.
- Status: Private ownership approved by user; provider/integration design proposed, feasibility gate in Phase 1.

## DEC-012: Repository layout and scope
- Context: documentation repository already exists and is not a Git working tree.
- Options considered: nested shortly directory, existing root.
- Chosen option: use Project as application root; SQL in backend/db and runtime SQL modules in backend/src/db, relative to Project.
- Reason: user explicitly requested all generated project work inside Project; avoid conflicting database module paths.
- Trade-offs: original README remains historical until final documentation phase.
- Consequences: preserve supplied files, add a current-status pointer, no Git initialization or remote publication in Phase 0.
- Status: Accepted local layout.

## DEC-013: Dashboard contract and serialization
- Context: three original feature endpoints cannot populate private lists/totals.
- Options considered: client-side global data, dedicated scoped read APIs.
- Chosen option: GET /api/urls and /api/summary; metadata/recent events in stats; decimal-string IDs/counts.
- Reason: minimal real API support with correct ownership and BIGINT precision.
- Trade-offs: offset pagination is simple but not ideal at large scale.
- Consequences: documented query bounds, stable ordering, two-owner tests.
- Status: Accepted by the user's instruction to continue all phases.

## DEC-014: Continuous implementation authorization
- Date: 2026-11-04.
- Context: the user requested continuation through all phases after reviewing Phase 0.
- Options considered: repeated intermediate approvals, continuous implementation with verification reports.
- Chosen option: continue implementation and verification continuously inside Project.
- Reason: explicit user instruction supersedes intermediate stops in the original plan.
- Trade-offs: external configuration or unavailable services can still prevent verified acceptance.
- Consequences: report actual evidence and unresolved gates; production deployment still requires separate approval.
- Status: Accepted.

## DEC-015: Verified SDK and first-party sessions
- Date: 2026-11-04.
- Context: dependency audit found legacy SDK advisories; Chrome QA found token() returned cached session data.
- Options considered: keep legacy SDK, use current managed SDK and documented token endpoint.
- Chosen option: @neon/neon-js 0.10.2, compatible audited dependency patch, managed SDK sessions with direct credentialed /token retrieval, same-origin Auth proxy in development and prepared Vercel gateway.
- Reason: real browser evidence and clean dependency audit; avoid relying on third-party session cookies.
- Trade-offs: one small fixed-provider gateway; actual Vercel and Safari behavior still requires release verification.
- Consequences: server-side NEON_AUTH_BASE_URL on Vercel, no persisted application JWTs; token values never logged. Local gateway test and Chrome journey pass.
- Status: Implemented and locally verified; deployment acceptance pending.

## Sources checked for implementation
Neon plugin search_docs/get_doc verified managed JWT suitability for separate domains, SDK token retrieval, and JWKS validation. [Official JWT guide](https://neon.com/docs/auth/guides/plugins/jwt), checked 2026-11-04. It also warns about cross-site session cookies; Phase 1 must verify the installed SDK and supported proxy/shared-domain setup rather than copy inconsistent examples blindly.
