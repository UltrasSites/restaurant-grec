# IndexNow — kalamakitroubas.gr

IndexNow notifie automatiquement Bing, Yandex et Seznam des nouvelles URLs ou
des URLs mises à jour.

## Clé du site

- Clé : `3d9a60c1c513043e7918985f073bb476`
- Hébergée : <https://kalamakitroubas.gr/3d9a60c1c513043e7918985f073bb476.txt>
- Fichier local : `public/3d9a60c1c513043e7918985f073bb476.txt`

## Lancer manuellement

Après chaque deploy production :

```bash
node scripts/submit-indexnow.mjs
```

Le script lit le `sitemap.xml` live et POST les URLs sur
`https://api.indexnow.org/indexnow`.
