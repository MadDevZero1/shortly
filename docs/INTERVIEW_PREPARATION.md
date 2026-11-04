# Interview preparation

These describe planned choices. Until later verification, say "designed" rather than "implemented and deployed."

| Feature / concept | What and why | Alternative and trade-off | Scale / interview question |
| --- | --- | --- | --- |
| HTTP methods and REST | POST creates a link; GET reads analytics or follows redirects; HEAD redirects without event | Mutating through GET would be surprising; redirects deliberately record approximate visits | Why 201 for creation and 302 for redirect? |
| Status codes | 400 invalid input, 401 invalid identity, 404 absent/inaccessible, 429 limit, 503 dependency outage | A generic 500 hides useful behavior; foreign-owner 404 avoids a private existence signal | How do clients distinguish validation from retryable failure? |
| Routes, middleware, controllers, services | Routes map paths; middleware verifies identity/limits; controllers map HTTP; services coordinate workflows | One file is simpler initially but becomes difficult to test | Which layer should know HTTP status? |
| Tables and keys | URLs have primary IDs and owner subjects; clicks reference URL IDs | A document store would complicate relational integrity/aggregation | Why does a foreign key prevent orphan clicks? |
| Indexes | UNIQUE code lookup; owner/date listing; URL/date click history | Indexes improve selected reads but cost storage/write work; referrer index needs evidence | What does EXPLAIN ANALYZE actually measure? |
| Parameterized queries | SQL structure stays separate from values | Escaping SQL manually is fragile; LIKE wildcards still need literal-search treatment | Does parameterization enforce ownership? No, owner predicates do |
| Base62 and collisions | Eight secure random characters; database uniqueness with bounded retry | Sequential encoding guarantees uniqueness but exposes order/easy enumeration | Why is check-then-insert unsafe under concurrency? |
| Redirect reliability | Retrieve stored URL, attempt bounded click write, issue 302 despite click-only failure | Strict transaction can block sharing; best effort undercounts | Why can lookup failure not safely redirect? |
| Aggregation and UTC | COUNT/GROUP BY in SQL; zero-filled 30-day UTC chart, lifetime totals | Browser timezone creates inconsistent buckets; history-wide daily payload grows | What happens just before and after UTC midnight? |
| Pool and environment | Reuse pg connections; secrets/config injected per environment | New connection per request adds overhead; excessive pool sizes exhaust database | How do multiple backend replicas change connection counts? |
| CORS and rate limiting | Restrict allowed browser origins and bound requests | CORS is not authentication; per-process limits do not coordinate replicas | Can curl bypass CORS? Why still verify identity? |
| Authentication and ownership | Managed identity verifies who; owner-scoped SQL verifies which records | Local browser history cannot secure cross-device ownership; custom passwords add risk | Can a valid JWT access another user's stats? |
| JWT and browser sessions | Managed session obtains expiring bearer token for separate API; verify signature/issuer/audience/expiry | Decoding is not verification; persistent app token storage increases exposure | Why might logout leave an issued token valid temporarily? |
| Deployment | Vercel SPA, Render API/redirect, Neon database/Auth | Separate hosts require origin, cookie and environment coordination | Why must the short URL use the backend domain? |

For each verified feature later, add the exact files, test evidence, alternatives actually considered, observed limitations and likely next scaling step. Candidate improvements include cursor pagination, pre-aggregated counts, asynchronous durable event ingestion and shared rate limiting, only after measurement warrants them.
