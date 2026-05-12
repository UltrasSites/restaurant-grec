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
