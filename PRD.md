# Shortly product requirements

Status: Phase 0 specification, awaiting implementation-plan approval.
Source: [master build plan](buildplan.md). The user's 2026-11-04 clarification requires private ownership.

## Product and audience
Shortly converts long URLs into shareable short links and helps students, developers, creators, and small businesses understand their traffic. Long URLs are awkward to share and otherwise provide little click visibility.

## Scope
- Email/password account registration, sign-in, session restoration, sign-out, and recovery through managed identity.
- Authenticated users create links, copy results, search their paginated links, and view their own totals and analytics across devices.
- Anyone holding a short URL can follow its public HTTP 302 redirect. Public redirects reveal the destination; private ownership protects management and analytics, not destination confidentiality.
- Analytics include lifetime clicks, a zero-filled 30-day UTC series, top ten referrer hostnames, and latest twenty click events.
- Landing, authentication, dashboard, result, analytics, and missing-page screens; responsive navigation and loading/error/empty/success states.

No custom domains, subscriptions, QR codes, enterprise SSO, geographic analytics, advanced bot detection, link editing, or deletion UI in this MVP. Basic authentication is now in scope; enterprise authentication remains out of scope.

## User flows
1. Visitor enters a destination on the landing page. If signed out, invite sign-in before creation and preserve the draft in session storage (warn against sensitive URLs; clear after success).
2. Signed-in user submits a valid HTTP/HTTPS URL, receives a short link, and copies it or selects it if clipboard access fails.
3. A recipient opens the short link; the API retrieves the stored destination, attempts a bounded click insert, then redirects.
4. The owner opens the dashboard or analytics; the server verifies identity and filters all results by owner.
5. Sign-out clears application state; visiting a protected screen prompts sign-in. Already-issued API tokens can remain valid until expiry.

## Functional acceptance
- Valid creation returns 201; invalid input returns a useful 400 without inserting a row.
- Eight-character random Base62 codes are protected by a UNIQUE constraint and bounded collision retries.
- GET redirect returns 302 and records one click when storage works. HEAD redirects without recording a click.
- A click-write failure does not prevent an otherwise valid redirect; a failed destination lookup never invents a redirect.
- Missing/invalid identity returns 401. Another user's link returns the same 404 as a nonexistent link on private endpoints.
- Search, pagination, counts, analytics, and recent activity expose only the signed-in user's records.
- Connected UI never displays fabricated analytics. Zero clicks and no matches have separate states.

## Non-functional acceptance
Parameterized SQL only; no client database credentials; startup environment validation; safe logs; bounded inputs, queries and database operations; explicit CORS; rate limiting; keyboard navigation; reduced motion; readable mobile layouts. No latency or uptime claims before measurement.

Automated API and real PostgreSQL tests precede frontend integration. Browser verification covers complete account and link journeys, two-user isolation, and cross-site session behavior. Deployment requires separate approval after local QA.
