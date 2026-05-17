-- Ajoute la colonne notes_translated pour les notes traduites en grec
-- (alimentée par /api/order quand lang !== 'el').
ALTER TABLE orders ADD COLUMN notes_translated TEXT;
