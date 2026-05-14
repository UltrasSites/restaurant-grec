-- Trouba — schema initial D1
-- Remplace Workers KV : ORDERS (orders + counter + rate_limit + latest_order_ts)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,            -- K-001, K-002...
  num         INTEGER NOT NULL,            -- numéro séquentiel
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  total       REAL NOT NULL,
  pickup_time TEXT NOT NULL,
  lang        TEXT NOT NULL,
  mode        TEXT NOT NULL,               -- takeaway | delivery
  payment     TEXT NOT NULL,               -- cash | card
  address     TEXT,
  floor       TEXT,
  bell        TEXT,
  notes       TEXT,
  country     TEXT,
  items_json  TEXT NOT NULL,               -- JSON serialized cart
  status      TEXT NOT NULL DEFAULT 'new', -- new | seen
  created_at  INTEGER NOT NULL,
  acked_at    INTEGER,
  expires_at  INTEGER NOT NULL              -- pour cleanup 24h
);

CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON orders(status, created_at);

CREATE INDEX IF NOT EXISTS idx_orders_created
  ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_expires
  ON orders(expires_at);

CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counters (name, value) VALUES ('orders', 0);

CREATE TABLE IF NOT EXISTS rate_limit (
  ip         TEXT PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_expires
  ON rate_limit(expires_at);
