-- Trouba — Live tracking + chat patron/client + zones livraison
-- Ajoute :
--   * prep_minutes  : temps de préparation estimé saisi par le patron
--   * accepted_at   : timestamp d'acceptation (status passé à 'seen')
--   * eta_changed_at: dernière mise à jour du temps (pour notif client)
--   * delivery_zone : 'green' | 'red' (zone livraison, applique min€)
-- + table order_messages pour chat bidirectionnel patron ↔ client

PRAGMA foreign_keys = ON;

ALTER TABLE orders ADD COLUMN prep_minutes INTEGER;
ALTER TABLE orders ADD COLUMN accepted_at INTEGER;
ALTER TABLE orders ADD COLUMN eta_changed_at INTEGER;
ALTER TABLE orders ADD COLUMN delivery_zone TEXT;

CREATE TABLE IF NOT EXISTS order_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    TEXT NOT NULL,
  sender      TEXT NOT NULL,                -- 'patron' | 'client' | 'system'
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_msg_order_created
  ON order_messages(order_id, created_at);
