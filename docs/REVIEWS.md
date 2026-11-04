# Phase 0 independent reviews

All agents were read-only. The lead authored all files, preventing edit conflicts. Reviews completed 2026-11-04; none executed runtime tests.

## Backend architect and database engineer
Agent: backend_database_review. Found missing dashboard APIs, BIGINT serialization ambiguity, database path conflict, UTC window ambiguity and no ownership model. Recommended scoped list/summary APIs, metadata/recent events in stats, stable pagination, decimal-string counts, exact UTC grouping, named UNIQUE collision retries and bounded best-effort click writes. After user clarification, reviewed owner_id and owner/date index, managed JWT boundary and two-user isolation tests. Risks: owner-filter omissions, query plan assumptions, cross-site Auth sessions.

## QA engineer and security reviewer
Agent: qa_security_review. Found privacy promises unsupported by the original schema. Initially proposed local browser history as a smaller nonprivate option; rejected after the user explicitly required private ownership. Reviewed managed sessions, JWT validation, owner-scoped queries, no-store private responses, state clearing/account switching, malicious inputs, sanitized logging and separate test databases. Risks: JWT residual lifetime, restricted cookies, metadata leakage, approximate events and phishing abuse.

## UI/UX designer
Agent: ui_review. Read design-taste-frontend and limited it to the landing page. Recommended light navy/indigo tokens, self-hosted typography, readable product tables, accessible charts, restrained motion, result persistence and all empty/error states. Risks: fabricated preview analytics, unverified mobile/keyboard behavior and pretending a successful build proves visual acceptance.

## Consolidated decisions
Private ownership is user-approved. Managed Neon Auth is the proposed identity integration, with Phase 1 feasibility/browser setup review. No public link enumeration or analytics. Random Base62 takes precedence over historical README notes. Runtime database modules have one canonical path. Current Neon JWT docs were checked through the plugin; SDK package naming and session topology need rechecking during implementation. Proposed contracts/schema/tests reflect these findings.

Affected files: PRD, architecture, design system, API/database contracts, decisions, test/security/deployment plans and tracker. Required later tests are enumerated in TEST_PLAN.md. No claim of runtime or deployed success follows from these reviews.
