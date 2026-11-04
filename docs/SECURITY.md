# Security and reliability

Status: backend security behavior implemented with automated and real development-database checks recorded in TEST_PLAN.md. Full real-provider browser/session verification remains pending. No penetration-test or production-readiness claim.

## Boundaries
Private management/analytics require verified identity plus owner-scoped SQL. Short codes are public identifiers; knowing a code permits redirect to its destination, not reading its analytics. Never advertise destination secrecy. No global link enumeration or cross-user totals.

Managed Neon Auth handles credentials and browser sessions. Express validates short-lived bearer JWTs with cached configured JWKS, EdDSA, expiry, expected issuer/audience and nonempty subject; reject anonymous identities. Issuer is the Auth URL origin, while JWKS is under the full Auth base path. Verify actual branch-issued claims before implementation acceptance. Never follow key URLs from an untrusted token.

Private API responses use Cache-Control: no-store. Clear client state on logout/account change and cancel/discard previous-user requests. Keep API tokens in memory; do not introduce persistent localStorage tokens. Sign-out does not inherently revoke an issued JWT immediately; the currently documented provider lifetime is fifteen minutes. No immediate-revocation claim without additional server checks.

Cross-site cookies can fail in restricted browsers. Verify supported SDK/proxy/shared-domain configuration and trusted origins; credentials flags alone do not override browser cookie policy.

## Input and transport
HTTP/HTTPS destinations only; canonical platform parsing, hostname required, 8192-character cap, no embedded credentials/control characters. No destination fetching, previews or server-side URL probes: avoids introducing a fetch-based SSRF surface. This is a deliberate redirect service, not a malicious-site scanner.

All SQL values are parameters; literal LIKE searches need wildcard escaping too. Require JSON and 16 KiB body cap. Referrers are untrusted, capped and reduced to lowercase hostname; missing/invalid values become NULL. Do not store raw IPs, user agents, full referrer paths/query strings, tokens or passwords.

Helmet, HTTPS production, explicit frontend-origin CORS, separate creation/read limits, and deliberate Render proxy trust are required. CORS controls browser access, not identity or authorization. IPs may be processed transiently for limiting but are not analytics storage. Single-process limits do not provide distributed enforcement.

## Reliability and secrets
One pg pool with timeouts and graceful shutdown; preserve certificate verification. Safe health probes report dependency availability. Handle database errors centrally. Bounded click writes may fail without blocking valid redirects; log an operation/error identifier without destination, body, credentials or private response data. No fire-and-forget rejected promises.

Use ignored .env files and deployment secret stores; examples have blank values only. No secrets in frontend config or Postman exports. No raw exceptions/stack traces/database details in HTTP responses. Test only on isolated databases/Auth branches; never run cleanup against production.

## Known limitations
No malware/phishing detection, advanced bots/geo analysis, enterprise SSO, immediate JWT revocation, automated managed-account orphan cleanup, or proven distributed abuse controls. Analytics may undercount during failures and include bots. URL validation is not destination safety. Account removal and data retention policies need explicit design before public operation at scale. Deployment requires a separate approval and review of these limits.
