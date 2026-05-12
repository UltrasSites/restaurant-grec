# Kalamaki Troubas — Commandes sur le site + notification sonore interne

**Date :** 13/05/2026
**Pour :** Tiago — Ultras-Sites
**Sujet :** Possibilité de commande en ligne avec notification sonore au comptoir, sans Telegram ni WhatsApp

---

## TL;DR

**Oui, c'est possible.**
**Oui, c'est entièrement gratuit** (dans le free tier Cloudflare, généreux).
**Aucun service tiers payant n'est nécessaire** (pas de Telegram, pas de WhatsApp, pas de Stripe — paiement comptoir).

---

## 1. Architecture proposée

```
┌──────────────┐     POST /api/order      ┌────────────────────┐
│  Client web  │ ───────────────────────▶ │ Cloudflare Pages   │
│ (souvlaki    │                          │ Function           │
│  + panier)   │ ◀──────── { ok, ref } ── │ → KV (queue)       │
└──────────────┘                          │ → email backup     │
                                          └────────────────────┘
                                                    │
                                          GET /api/orders/poll
                                                    │
                                                    ▼
                                          ┌────────────────────┐
                                          │  Tablette comptoir │
                                          │  /caisse (admin)   │
                                          │  → SON sonore      │
                                          │  → clignote rouge  │
                                          │  → bouton "Pris"   │
                                          └────────────────────┘
```

**Composants :**
- **Frontend client** : panier → POST `/api/order` avec nom, téléphone, articles, créneau retrait
- **Backend** : Cloudflare Pages Function reçoit, stocke dans Cloudflare KV, envoie aussi un email backup
- **Frontend admin** (`/caisse`) : page que le restaurateur garde ouverte sur tablette/PC au comptoir
  - Polling toutes les 3 secondes via fetch
  - Quand nouvelle commande détectée : **Web Audio API joue un son aigu** (en boucle jusqu'à acquittement)
  - L'écran clignote en rouge avec le détail de la commande
  - Bouton "Commande prise en charge" → marque comme `seen` dans KV

---

## 2. Pourquoi c'est gratuit

| Service | Free tier | Notre usage estimé |
|---|---|---|
| Cloudflare Pages (hébergement) | Illimité builds | 1 site |
| Cloudflare Pages Functions | 100 000 req/jour | ~200 req/jour max |
| Cloudflare KV (stockage commandes) | 100 000 lectures/jour, 1 000 écritures/jour, 1 GB | ~500 lectures + 50 écritures/jour |
| MailChannels (email backup) | Gratuit pour CF Pages | ~50 emails/jour |
| Web Audio API (son) | Natif navigateur | — |

**Pas de Stripe** : paiement comptoir uniquement → 0€ de frais transaction.

---

## 3. Notification sonore — comment ça marche concrètement

### Au comptoir : tablette ou PC ouvert sur `kalamakitroubas.gr/caisse`

1. Le restaurateur ouvre la page `/caisse` au démarrage du service
2. Saisie d'un mot de passe simple (stocké dans une env var Cloudflare)
3. La page reste affichée sur la tablette/PC connecté à un haut-parleur

### Quand une commande arrive :

1. Le client valide son panier → POST `/api/order`
2. Cloudflare KV stocke `{ id, name, phone, items, total, pickup_time, status: "new" }`
3. La page `/caisse` qui poll `/api/orders/poll?since=…` reçoit la nouvelle commande
4. **Déclenchement du son** via Web Audio API :
   ```js
   const ctx = new AudioContext();
   const osc = ctx.createOscillator();
   osc.frequency.value = 880; // La aigu
   osc.connect(ctx.destination);
   osc.start();
   setTimeout(() => osc.stop(), 400);
   // Répété toutes les 2s tant que la commande est non acquittée
   ```
5. L'écran affiche la commande en grand, avec un bouton géant **"COMMANDE PRISE"**
6. Le restaurateur clique → fetch POST `/api/orders/{id}/ack` → KV met `status: "seen"` → son s'arrête

### Si la tablette est fermée / en veille

- Le navigateur peut continuer à jouer un son uniquement si l'onglet est ouvert (pas en veille profonde).
- Pour une **fiabilité 100%**, on installe le site comme **PWA** (icône sur écran d'accueil de la tablette) + **Service Worker** qui envoie une push notification système (vibreur + son OS).
- Mais en pratique, garder l'onglet ouvert sur une vieille tablette branchée suffit largement.

---

## 4. Sécurité

- La page `/caisse` est protégée par un mot de passe simple (env var Cloudflare)
- Les endpoints `/api/orders/*` vérifient un cookie/token signé
- Pas de données bancaires stockées (paiement au comptoir → rien à sécuriser côté carte)
- Rate-limiting via Cloudflare WAF (gratuit) pour bloquer le spam de commandes

---

## 5. Avantages vs Telegram / WhatsApp

| | Site (proposition) | Telegram | WhatsApp Business |
|---|---|---|---|
| Coût | **Gratuit** | Gratuit | Gratuit jusqu'à 1000 conv/mois |
| Pas de compte tiers | ✅ | ❌ besoin Telegram | ❌ besoin numéro WA |
| Personnalisé à la marque | ✅ | ❌ générique | ❌ générique |
| Son configurable | ✅ son fort en boucle | ❌ son standard | ❌ son standard |
| Pas de risque d'oubli (clignotement écran) | ✅ | ❌ | ❌ |
| Statistiques commandes | ✅ dashboard intégré | ❌ | ❌ |

---

## 6. Plan d'implémentation (à venir)

### Phase 1 — Site V1 (push demain) — **fait**
- ✅ Mentions légales + CGV (FR + EN)
- ✅ Note Google 4.3
- ✅ Logo nom + cadre noir
- ✅ Instagram supprimé
- ✅ Thème clair : fix hero texte blanc
- ✅ Formulaire branché → email direct via Cloudflare Function (kalamaki.troubas@gmail.com)
- ✅ Section veggie : Seitan ajouté (3 produits)

### Phase 2 — Commandes en ligne (à venir, ~6h de travail)
- Création des pages `/menu-commande` et `/caisse`
- KV namespace `ORDERS` dans Cloudflare
- Cloudflare Pages Function `/api/order` (POST) et `/api/orders/poll` (GET)
- Web Audio + UI clignotante
- Mot de passe `/caisse` via env var Cloudflare
- PWA + Service Worker pour push system

### Phase 3 — Menu PDF multilangue (à venir, ~3h)
- 6 langues : 🇨🇳 中文, 🇬🇷 Ελληνικά, 🇫🇷 Français, 🇵🇹 Português, 🇮🇹 Italiano, 🇪🇸 Español
- Page intermédiaire `/menu-pdf` avec choix de langue
- 6 PDF générés (PDFKit côté build, ou Canva si tu préfères les éditer toi-même)
- QR code pointe vers `/menu-pdf` (pas vers le PDF directement)

### Phase 4 — Intégration photos réelles
- Pull photos e-food + Google Business Profile + Facebook
- Remplacement de toutes les photos Unsplash dans :
  - Hero carrousel
  - Section "Ambiance"
  - MenuBook (photo par section)
  - Cards "Spécialités"

---

## 7. Setup nécessaire côté DNS (kalamakitroubas.gr)

Une fois le domaine accessible :

```
Type  | Nom                     | Valeur
------+-------------------------+----------------------------------------------
A     | @                       | (IP Cloudflare auto)
CNAME | www                     | kalamakitroubas.gr
TXT   | @                       | v=spf1 a mx include:relay.mailchannels.net ~all
TXT   | _mailchannels           | v=mc1 cfid=kalamakitroubas-gr.pages.dev
TXT   | mailchannels._domainkey | (clé DKIM générée par MailChannels)
```

Le SPF + MailChannels DKIM permettent au formulaire d'envoyer depuis `noreply@kalamakitroubas.gr` sans finir en spam.

---

## 8. Alternative encore plus simple (si tu veux zéro setup DNS)

Au lieu de MailChannels (qui demande SPF), tu peux brancher **Resend** (3 000 emails/mois gratuit) :
1. Créer un compte sur resend.com
2. Vérifier le domaine kalamakitroubas.gr (Resend te donne 3 enregistrements DNS à copier-coller)
3. Récupérer une API key
4. Dans Cloudflare Pages > Settings > Environment variables :
   - `RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxx`
5. La fonction `/api/contact` détecte la clé et bascule automatiquement sur Resend

La fonction est déjà codée pour les deux : si `RESEND_API_KEY` est présent, Resend est utilisé en priorité ; sinon fallback MailChannels.

---

## 9. Décisions à prendre

| # | Décision | Recommandation |
|---|---|---|
| 1 | Resend ou MailChannels ? | **Resend** (plus simple, meilleure deliverabilité) |
| 2 | PWA + Service Worker pour /caisse ? | Oui (en phase 2) — fiabilité 100% même si onglet fermé |
| 3 | Stocker historique commandes ? | Oui, 30 jours dans KV, puis purge auto |
| 4 | Login /caisse : password unique ou compte par employé ? | Password unique simple — pas la peine de compliquer |
| 5 | Notifications créneau retrait ? | SMS Twilio ? Mais payant. Pour V1 : email seulement |

---

## En résumé

- ✅ **Commande sur site sans Telegram/WhatsApp = possible**
- ✅ **Notification sonore au comptoir = possible et configurable** (volume, fréquence, son personnalisé)
- ✅ **Paiement comptoir = retrait + paiement sur place** (zéro frais bancaires)
- ✅ **Gratuit jusqu'à plusieurs centaines de commandes/jour** (free tier Cloudflare)
- ⏱️ **Temps d'implémentation Phase 2 (commandes) : ~6h** une fois que tu valides le design

Je propose de :
1. Push le site V1 maintenant (toutes les corrections de cette session)
2. Démarrer Phase 2 dès que tu me dis "go" — je te montrerai un mockup `/caisse` avant le code

— Claude

---

## ✅ PHASE 2 — IMPLÉMENTÉE (13/05/2026)

### Ce qui est en ligne
- `/{lang}/commander` (el + en) — menu interactif + panier + checkout + confirmation
- `/caisse` — login password + dashboard temps réel avec son aigu (880Hz, toutes les 2s)
- Pages Functions :
  - `POST /api/order` — création commande (KV `ORDERS`, ID court `K-001…`, TTL 24h, rate-limit 5/IP/10min)
  - `GET /api/orders/poll?since=<ts>` — long-poll 25s, retourne les commandes `status=new`
  - `POST /api/orders/{id}/ack` — marque `status=seen`, arrête le son
  - `POST /api/caisse-login` — vérifie password, set cookie `caisse_auth` 12h
- Liens depuis `index.astro` : bouton "Commander en ligne" prioritaire + FAB flottant en bas à droite (clignote)

### Sécurité
- Cookie auth httpOnly + Secure + SameSite=Lax (12h)
- Rate-limit 5 commandes / IP / 10min via KV
- Sanitize tous les inputs (XSS, tags, control chars, longueurs max)
- Recalcul du total côté serveur (impossible de spoofer le prix)
- Validation pickup_time strict (15/30/45/60)
- `noindex, nofollow` sur `/caisse`
- Délai 500ms sur mauvais password (anti-bruteforce léger)

### Données menu
Le menu est désormais centralisé dans `src/data/menu-data.ts` (single source of truth).
`MenuBook.astro` et `/commander` consomment la même source.
**Important** : les bières (Amstel/Alfa/Fix/Heineken/Mythos) sont désormais en lignes séparées 330ml et 500ml (pour permettre l'ajout au panier sans ambiguïté).

---

## 🚨 ÉTAPES OBLIGATOIRES À FAIRE PAR TIAGO

### 1. Créer le KV namespace `ORDERS`

```bash
cd "C:\Users\User\Desktop\CODE ENTREPRISES\restaurant-grec"
npx wrangler kv namespace create ORDERS
```

Copie l'ID retourné (du genre `id = "abc123…"`).

**OU** via le dashboard Cloudflare :
1. Workers & Pages → KV → Create namespace
2. Nom : `ORDERS`
3. Copier l'ID

### 2. Binder le KV au projet Pages

Dans Cloudflare Dashboard :
1. **Workers & Pages → restaurant-grec → Settings → Functions**
2. Section **KV namespace bindings** :
   - Variable name : `ORDERS`
   - KV namespace : sélectionner `ORDERS` créé à l'étape 1
3. **Save**

### 3. Setter la variable `ADMIN_KEY`

Dans Cloudflare Dashboard :
1. **Workers & Pages → restaurant-grec → Settings → Environment variables**
2. Production → Add variable :
   - Variable name : `ADMIN_KEY`
   - Value : choisir un password fort (ex: `Troumpa2026!K`)
   - Type : **Encrypt** (important)
3. **Save**

Note : c'est le même genre de var que Sara — réutilise un password fort.

### 4. Redéployer

Après avoir setté KV + ADMIN_KEY, **redéploie** pour que les bindings soient pris en compte :

```bash
npx wrangler pages deploy dist --project-name restaurant-grec --branch main
```

### 5. Tester

- Site public : `https://restaurant-grec.pages.dev/el/commander`
  - Ajouter 2-3 items, valider, remplir nom/tel, confirmer → message "Votre commande #K-001 est confirmée"
- Dashboard caisse : `https://restaurant-grec.pages.dev/caisse`
  - Saisir l'`ADMIN_KEY`
  - L'onglet doit afficher la commande, clignoter rouge, émettre un bip aigu toutes les 2s
  - Cliquer "✓ COMMANDE PRISE EN CHARGE" → le son s'arrête, la carte disparaît
- Important : sur mobile/tablette, le son démarre seulement après la première interaction utilisateur (politique navigateur). Le login compte comme interaction → ok.

### 6. Installation tablette (recommandation)

Sur la tablette du comptoir :
1. Ouvrir `/caisse` dans Chrome
2. Menu Chrome → "Ajouter à l'écran d'accueil" (devient une PWA)
3. Lancer l'app, se connecter, brancher la tablette au chargeur et au haut-parleur
4. L'onglet reste ouvert toute la journée

---

## 📁 Fichiers ajoutés/modifiés

**Nouveaux** :
- `src/data/menu-data.ts` — source de vérité du menu
- `src/pages/[lang]/commander.astro` — page commande client
- `src/pages/caisse.astro` — dashboard admin plein écran
- `functions/api/order.ts` — POST création commande
- `functions/api/orders/poll.ts` — GET long-poll
- `functions/api/orders/[id]/ack.ts` — POST acquittement
- `functions/api/caisse-login.ts` — POST login admin
- `public/caisse-sw.js` — service worker minimal (PWA)

**Modifiés** :
- `src/components/MenuBook.astro` — utilise menu-data.ts
- `src/i18n/translations.ts` — clés `order_*` ajoutées (el + en)
- `src/pages/[lang]/index.astro` — bouton "Commander online" en CTA principal + FAB flottant

