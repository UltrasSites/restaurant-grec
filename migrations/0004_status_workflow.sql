-- Trouba — workflow status etendu (new -> seen -> ready -> paid -> cancelled)
-- Ajoute colonne updated_at pour tracer les transitions de statut.

PRAGMA foreign_keys = ON;

ALTER TABLE orders ADD COLUMN updated_at INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_status_updated
  ON orders(status, updated_at);
