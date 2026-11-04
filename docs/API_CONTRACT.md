# API contract

Status: planned, not implemented. API is hosted on the backend origin; short links use `PUBLIC_BASE_URL`.

## Common policy
Success: `{ "success": true, "data": ... }`. Error: `{ "success": false, "error": { "code": "INVALID_URL", "message": "Enter a valid HTTP or HTTPS URL." } }`.

Times are ISO 8601 UTC; daily dates are `YYYY-MM-DD`. IDs/counts are decimal strings (including zero) consistently across endpoints. Codes match `^[0-9a-zA-Z]{8}$`.

Private requests require `Authorization: Bearer <token>`. Verify identity before resource queries. Derive owner from verified `sub`; never accept `ownerId` as authority. Return 401 for missing/invalid/expired identity and 404 for inaccessible or absent owned links. Do not expose analytics publicly by code. Private responses use `Cache-Control: no-store`.

## Endpoints
| Method and path | Access | Behavior |
| --- | --- | --- |
| POST /api/shorten | Authenticated | Create owned link; 201 |
| GET /:shortCode | Public | Stored destination in Location; 302; best-effort click |
| HEAD /:shortCode | Public | Same redirect without creating click |
| GET /api/urls | Authenticated | Paginated own links/search; 200 |
| GET /api/summary | Authenticated | Own lifetime URL/click totals; 200 |
| GET /api/stats/:shortCode | Owner | Own link metadata and analytics; 200 |
| GET /api/health | Public | Safe application/database status; 200 or 503 |

Mount API routes and their not-found handler before redirect routes. Unsupported methods receive 405 with Allow where explicitly registered. Unknown routes return 404. Disable redirect caching with `Cache-Control: no-store` so browser caching does not intentionally bypass click recording.

### Create
JSON body `{ "longUrl": "https://example.com/article" }`. Require object body and string field, trim edges, reject control characters and embedded credentials, cap at 8192 characters, parse using platform URL parser, allow only HTTP/HTTPS with hostname. Store canonical parsed URL; the backend does not fetch the destination. Limit JSON bodies to 16 KiB. Reject unexpected ownership fields rather than trusting them.

201 data: `{ "shortCode": "a8Kp29Xz", "shortUrl": "http://localhost:5000/a8Kp29Xz", "longUrl": "https://example.com/article" }`.

### List and summary
`GET /api/urls?q=&page=1&limit=20`: q at most 200 characters; page and limit positive integers, limit at most 100. Search literal substrings of canonical destination or code; escape SQL LIKE wildcards as well as parameterizing input. Order by created_at DESC, id DESC. Search and totals are owner-scoped.

List data: `{ "items": [{ "id": "1", "shortCode": "a8Kp29Xz", "shortUrl": "...", "longUrl": "...", "createdAt": "2026-11-04T12:00:00Z", "totalClicks": "0" }], "page": 1, "limit": 20, "total": "1" }`.

Summary data: `{ "totalUrls": "1", "totalClicks": "0" }`. Summary is independent of current search/page. No email or owner IDs are returned.

### Analytics
Data includes `shortCode`, `shortUrl`, `longUrl`, `createdAt`, `timezone: "UTC"`, `totalClicks`, `clicksPerDay`, `topReferrers`, `recentClicks`.

`clicksPerDay`: latest 30 UTC calendar days including today, ascending, zero-filled, entries `{ "date": "2026-11-04", "clicks": "0" }`. `totalClicks` is lifetime. `topReferrers`: lifetime top ten, entries `{ "referrer": "example.com", "clicks": "2" }`, ordered by count DESC then hostname ASC. `recentClicks`: latest twenty, ordered by timestamp DESC then id DESC, entries `{ "clickedAt": "...", "referrer": "direct" }`.

Retain only normalized lowercase HTTP/HTTPS referrer hostname; missing, malformed, unsupported or over-2048-character input becomes NULL and reports as `direct`. This label means no usable referrer, not proof of direct navigation. Never expose raw headers.

### Redirect and health failures
Lookup success + click insertion failure still returns stored 302; sanitize/log operational error. Lookup/database unavailability returns 503 without Location. Unknown code returns 404; invalid code returns 400. Health data exposes only safe status, never connection details.

## Error status policy
| Status | Use |
| --- | --- |
| 400 | Invalid JSON/body/URL/code/query |
| 401 | Missing, invalid, expired or anonymous identity |
| 404 | Unknown route, absent or foreign-owned link |
| 405 | Explicit unsupported method |
| 413 | Body exceeds configured limit |
| 415 | Creation body is not application/json |
| 429 | Rate limit, include Retry-After |
| 500 | Unexpected server error; bounded code retry exhaustion |
| 503 | Temporary database/auth-key service unavailable |

Creation limit: proposed 20/minute per user plus 60/minute per IP; private read limit 120/minute per user; public health/redirect protection tuned separately. Authenticate without leaking identity into logs. Keep proxy trust explicit and use separate limiter instances. Production multi-instance limits need a shared store, outside current single-instance scope.
