# Database specification

Status: schema applied and verified on the identified development database shortly, branch shortly-development (br-curly-shadow-b5yw3o0l) in project red-pine-03467712. UNIQUE/FK/CHECK/cascade, UTC boundaries and owner-scoped query checks passed with rolled-back fixtures. User-approved private ownership supersedes the master's anonymous two-table design. Production schema has not been applied.

```sql
CREATE TABLE urls (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id TEXT NOT NULL,
    short_code VARCHAR(8) NOT NULL UNIQUE
        CHECK (short_code ~ '^[0-9a-zA-Z]{8}$'),
    long_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_urls_owner_created_at
    ON urls (owner_id, created_at DESC, id DESC);

CREATE TABLE clicks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url_id BIGINT NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    referrer TEXT,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clicks_url_id_clicked_at
    ON clicks (url_id, clicked_at DESC);

CREATE INDEX idx_clicks_referrer ON clicks (referrer);
```

`owner_id` is the verified managed-identity subject, not user input. Accounts and sessions live in provider-managed tables, not in custom application password tables. Avoid a brittle foreign key into a managed schema until provider types and deletion semantics are verified. Consequently orphan-owner cleanup is not automatic; account deletion is outside the MVP. Do not promise cascading account deletion.

## Index rationale
Primary keys identify rows. UNIQUE creates the code lookup index and atomically arbitrates collisions; no extra short_code index is necessary. Owner/created/id supports private chronological pagination and replaces the master's global-created index because there is no global listing. The click composite supports per-link history and range queries. The master-requested standalone referrer index is retained provisionally; it may not help per-link aggregation. Measure rather than claim an improvement.

Foreign key rejects orphan clicks; ON DELETE CASCADE prevents orphan events if an administrative link deletion occurs. There is no public deletion API.

## Query rules
- Always bind values through pg parameters. No interpolated user SQL, owner IDs, pagination, or search strings.
- All private URL predicates include owner_id; click analytics join/filter through an owned URL. Check ownership before aggregating.
- COUNT and GROUP BY remain in PostgreSQL. Use `(clicked_at AT TIME ZONE 'UTC')::date` for daily grouping, with UTC half-open boundaries and zero-filled 30-day series.
- List uses LEFT JOIN/aggregate so zero-click links appear; count URLs separately to avoid counting click rows as links.
- Lifetime totals/referrers differ deliberately from the bounded daily window; limit recent rows and top referrers.
- Serialize BIGINTs and counts as decimal strings, not unchecked Number conversions.

## Phase 1 verification
Apply `backend/db/schema.sql` only to an identified development/test database, after Auth feasibility/configuration review. Test unique codes, format check, FK/cascade, two-owner isolation, zero-click links, search/pagination, UTC midnight, and aggregation. Use EXPLAIN (ANALYZE, BUFFERS) on representative disposable data; record actual plans and index observations. Use an isolated test branch and never destructive cleanup against production.
