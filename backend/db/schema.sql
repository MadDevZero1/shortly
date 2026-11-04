CREATE TABLE IF NOT EXISTS urls (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id TEXT NOT NULL,
  short_code VARCHAR(8) NOT NULL CONSTRAINT urls_short_code_key UNIQUE CHECK (short_code ~ '^[0-9a-zA-Z]{8}$'),
  long_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_urls_owner_created_at ON urls(owner_id, created_at DESC, id DESC);
CREATE TABLE IF NOT EXISTS clicks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  url_id BIGINT NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  referrer TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clicks_url_id_clicked_at ON clicks(url_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_referrer ON clicks(referrer);
