-- Trouba — historique anonymisé des commandes (50 jours)
-- Pour traçabilité comptable / preuves en cas de litige.
-- ZÉRO donnée personnelle : pas de nom, téléphone, adresse, items.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS orders_history (
  id          TEXT PRIMARY KEY,            -- K-001, K-002... (même que orders.id)
  total       REAL NOT NULL,               -- montant total
  created_at  INTEGER NOT NULL,            -- timestamp création (ms)
  acked_at    INTEGER,                     -- timestamp acquittement (ms), NULL si jamais ack
  status      TEXT NOT NULL DEFAULT 'new', -- new | seen | completed | cancelled
  expires_at  INTEGER NOT NULL             -- created_at + 50 jours (cleanup auto)
);

CREATE INDEX IF NOT EXISTS idx_history_created
  ON orders_history(created_at);

CREATE INDEX IF NOT EXISTS idx_history_expires
  ON orders_history(expires_at);
