# Implementation plan

The user authorized continuing all phases on 2026-11-04, superseding intermediate stop/approval gates. Private ownership remains required. All work belongs inside `Project`. Production deployment retains a separate approval gate. Implementation is in progress; acceptance requires the checks below, not merely generated code.

## Execution order and acceptance
| Phase | Objective and exact file groups | Dependency | Verification / exit | Status |
| --- | --- | --- | --- | --- |
| 0 | Project AGENTS, PRD, DESIGN_SYSTEM, ARCHITECTURE, README; docs/*.md; backend/frontend structure | Read source plan and inspect workspace | Required docs exist, reviews consolidated, ownership clarified, plan approved | Complete |
| 1 | Neon development/test configuration; backend/db/schema.sql; database documentation | Phase 0 approval | Auth availability and session topology assessed; real schema/connectivity, constraints, owned queries, analytics and EXPLAIN verified | Not started |
| 2 | backend/package.json, .env.example, src/app.js, server.js, config, db/pool.js, middleware and route skeletons | Phase 1 accepted | Startup validation, secure pool, health 200/503, graceful shutdown; identity-verification foundation tests | Not started |
| 3 | backend/src/routes, controllers, services, db/queries, utils, auth middleware | Foundation accepted | Create/redirect/private list/summary/stats, ownership, collisions, UTC SQL, errors verified | Not started |
| 4 | backend/tests; backend/postman/Shortly.postman_collection.json; QA/security docs | Backend feature acceptance | Automated real-PostgreSQL and auth-isolation tests pass; Postman exported/run with real evidence | Not started |
| 5 | frontend/package.json, .env.example, index, Vite/TS/Tailwind config; src/app, services/auth, styles, shared layout/ui, landing/auth pages, public assets | Backend QA passed | UI runs, login/session topology works in browsers, responsive landing visually reviewed; show UI | Not started |
| 6 | frontend/pages dashboard/result/analytics/errors; components/dashboard and analytics; types, hooks, services/api.ts | Design foundation accepted | All screens and states; private API models; accessible chart, no fabricated connected data; show UI | Not started |
| 7 | Frontend API/auth integration; backend CORS/config; end-to-end tests | Both systems accepted | Two users independently sign in/create/copy/redirect/view analytics; unauthorized access denied | Not started |
| 8 | Test/config fixes only; relevant documentation | Local integration accepted | Responsive/accessibility/security review, production builds, browser evidence; request deployment approval | Not started |
| 9 | render.yaml, frontend/vercel.json if needed, environment/trusted-origin configuration | Explicit deployment approval | Live frontend/API/database/auth/redirect/analytics journey verified; record actual URLs | Not started |
| 10 | README rewrite, docs/screenshots, API examples, Postman links, interview notes | Demonstrable application | Another developer follows setup successfully; real screenshots and accurate evidence | Not started |

## Parallel versus sequential
Independent backend/database, QA/security and UI reviews ran in parallel during Phase 0 with no file edits. Implementation agents own disjoint backend, frontend and release-documentation files. UI source can be authored while backend work proceeds against the agreed contract, but connected integration acceptance depends on backend verification. Schema/query checks precede endpoint acceptance, and local QA precedes deployment. The user authorized continuous execution; unresolved external configuration remains explicit rather than being reported as success.

## Dependencies and risks
1. Confirm managed Auth support on the chosen project/region without weakening networking controls. Review existing Neon resources before provisioning anything.
2. Verify real JWT issuer/audience and SDK package exports, which may differ from installed skill examples. Issuer is the Auth URL origin; JWKS uses the full Auth base path.
3. Select and test supported first-party auth proxy/shared-domain behavior for restricted-cookie browsers. A direct cross-site demo passing in Chromium is insufficient.
4. Keep database tests on a disposable test branch/database. Do not assume a public redirect implies public analytics.
5. No Git repository exists here. Git initialization and GitHub remote publication belong to an explicitly reviewed repository/deployment setup, not a claimed existing integration.

## Skills/plugins schedule
- Phase 0: landing specification through design-taste-frontend; Neon/neon-auth skills plus read-only Neon documentation plugin lookup.
- Phase 1: neon-postgres and neon-auth for database/identity setup; discover provider tools and verify actual configuration.
- Phases 3–4: Postman API-testing/collection tools when implementing collection and endpoint checks; keep production credentials out of exports.
- Phases 5–6: landing design skill; Higgsfield media tools for requested supporting visuals. If actual video assets are produced, read HyperFrames entry skill first. Use Framer Motion for UI interactions.
- Phase 8: React and end-to-end verification skills where applicable; actual browser inspection.
- Phase 9: Render deployment/Blueprint and Vercel deployment skills/plugins, only after the deployment approval gate.

No extra website-builder platform, ORM, enterprise SSO, or background architecture is introduced.
