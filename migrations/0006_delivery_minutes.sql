-- Trouba — séparer temps préparation et temps livraison
-- prep_minutes existait déjà (depuis 0005) : on garde son sens "temps cuisine".
-- delivery_minutes ajouté ici : temps trajet du livreur après prep (0 ou NULL si à emporter).
-- Le client affiche : prêt dans (prep) + livré dans (prep + delivery).

PRAGMA foreign_keys = ON;

ALTER TABLE orders ADD COLUMN delivery_minutes INTEGER;
