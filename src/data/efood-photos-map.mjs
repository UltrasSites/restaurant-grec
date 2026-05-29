// Mapping nom grec (menu-data.ts) → slug photo e-food (public/photos/efood/{slug}-{size}w.webp)
// Source : public/photos/efood/_plats-manifest.json
// Usage : import { getPhotoSlug, getPhotoSrcSet } from "../data/efood-photos-map.mjs";

// Map principale : nom grec exact (tel qu'il apparaît dans menu-data.ts) → slug photo
export const NAME_TO_SLUG = {
  // === Ορεκτικά Ι ===
  "Φρέσκιες Πατάτες": "patates-tiganites",
  "Πατάτες με τυρί": "patates-tiganites-parmezana",
  "Πατάτες με τσένταρ & μπέικον": "patates-tiganites-cheddar-mpeikon",
  "Φέτα": "feta",
  "Τζατζίκι σπιτικό": "tzatziki",
  "Τυροκαυτερή": "tyrokayteri",

  // === Ορεκτικά ΙΙ ===
  // Fix : la merida (assiette de 5) = la VRAIE photo des 5 fritters sur assiette ; la pièce unique = idem (pas de visuel "1 pièce" dispo)
  "Κολοκυθοκεφτέδες τμχ": "kolokythokeftes",        // photo 5 fritters assiette (cf manifest = "Κολοκυθοκεφτές" 1 piece sans plat)
  "Κολοκυθοκεφτέδες μερίδα 5 τμχ": "kolokythokeftes", // même slug — c'est le visuel correct des fritters sur assiette
  "Ρεβυθοκεφτέδες τμχ": "revythokeftes",
  "Ρεβυθοκεφτέδες μερίδα 5 τμχ": "revythokeftes", // même produit en plus grande quantité — pas de photo merida distincte
  "Πίτα στα κάρβουνα": "pita-sketi",

  // === Σαλάτες ===
  "Η σαλάτα της Τρούμπας": "i-salata-tis-troympas",
  "Λάχανο-Καρότο": "lachano-karoto",
  "Μαρούλι": "maroyli",
  "Χωριάτικη": "choriatiki",
  "Ντάκος": "ntakos",

  // === Πίτες τυλιχτές ===
  "Καλαμάκι χοιρινό": "kalamaki-choirino-se-pita",
  "Καλαμάκι κοτόπουλο μπούτι": "kalamaki-kotopoylo-mpoyti-se-pita",
  "Καλαμάκι κοτομπέικον": "kotompeikon-se-pita",
  "Μπιφτέκι μοσχαρίσιο": "mpifteki-moscharisio-se-pita",

  // === Πίτες τυλιχτές ΙΙ ===
  "Τρουμπάκι — Special μπιφτεκάκι της Τρούμπας": "special-mpifteki-tis-troympas-se-pita",
  "Κεμπάπ Φιλαδέλφεια": "kempap-philadelhia-se-pita",
  "Πανσετάκι χοιρινό": "pansetaki-choirino-se-pita",
  "Μπριζολάκι χοιρινό": "mprizolaki-choirino-se-pita",
  "Λουκάνικο χοιρινό": "loykaniko-choirino-se-pita",

  // === Μερίδες — Καλαμάκια ===
  "Καλαμάκι χοιρινό 4τμχ": "kalamaki-choirino-merida",
  "Καλαμάκι κοτόπουλο μπούτι 4τμχ": "kalamaki-kotopoylo-mpoyti-merida",
  "Καλαμάκι κοτομπέικον 4τμχ": "kotompeikon-merida",

  // === Μερίδες — Σπεσιαλιτέ ===
  "Μπιφτέκι μοσχαρίσιο 2τμχ": "mpifteki-moscharisio-merida",
  "Special μπιφτεκάκι της Τρούμπας 4τμχ": "special-mpifteki-tis-troympas-merida",
  "Κεμπάπ Φιλαδέλφεια 4τμχ": "kempap-philadelphia",

  // === Μερίδες — Χοιρινά ===
  "Πανσετάκι χοιρινό 5τμχ": "pansetakia-choirina-merida",
  "Μπριζολάκι χοιρινό 4τμχ": "mprizolaki-choirino-merida",
  "Λουκάνικο χοιρινό 3τμχ": "loykaniko-choirino-merida",
  "Ποικιλία 2 ατόμων": "soyvlakia",

  // === Χάμπουργκερ ===
  // Une seule photo "burger-moscharisio" : assigner des slugs uniques cousins (mpifteki = galette de viande, special trouba = signature)
  "Χάμπουργκερ Κλασικό": "burger-moscharisio",
  "Χάμπουργκερ Διπλό": "mpifteki-moscharisio",                  // 2 galettes mpifteki
  "Cheeseburger της Τρούμπας": "special-mpifteki-tis-troympas", // version Trouba signature
  "BBQ Burger": "skepasti-special-mpifteki-tis-troympas",       // visuel "scellé" différent du classique

  // === Veggie Menu ===
  "Μπιφτέκι λαχανικών τμχ": "mpifteki-lachanikon",
  "Τυλιχτό Μπιφτέκι λαχανικών": "mpifteki-lachanikon-se-pita",
  "Λουκάνικο σουπιάς τμχ": "loykaniko-soypias-se-pita",
  "Τυλιχτό Λουκάνικο σουπιάς": "loykaniko-soypias-se-pita",
  "Τυλιχτό Ρεβυθοκεφτές": "revythokeftedes-se-pita",
  "Τυλιχτό Κολοκυθοκεφτές": "kolokythokeftedes-se-pita",
  "Τυλιχτό Οικολογικό": "oikologiko-se-pita",
  "Veggie Burger": "veggie-burger",
  "Καλαμάκι Σεϊτάν τμχ": "kalamaki-seitan-se-pita",
  "Κεμπάπ Σεϊτάν": "kempap-seitan-se-pita",
  "Τυλιχτό Σεϊτάν": "kalamaki-seitan-se-pita",
  "Τυλιχτό Σεϊτάν Κεμπάπ": "kempap-seitan-se-pita",
  "Τυλιχτό Σεϊτάν Καλαμάκι": "kalamaki-seitan-se-pita",
  "Τυλιχτό Κολοκυθο-Ρεβυθοκεφτές": "revythokeftedes-se-pita",

  // === Σάντουιτς & Σκεπαστή ===
  "Σάντουιτς με κρέας της επιλογής σας": "kalamaki-choirino-se-santoyits",
  "Σάντουιτς με διπλό κρέας": "kalamaki-kotopoylo-mpoyti-se-santoyits", // 2e variante = poulet pour visuel unique
  "Σκεπαστή με κρέας της επιλογής σας": "skepasti-kalamaki-choirino",
  "Σκεπαστή με κρέας της επιλογής σας (διπλό)": "skepasti-mpifteki-moscharisio",

  // === Ορεκτικά Ι (extra) ===
  // Φέτα ψητή = même base que la φέτα classique (mais grillée), réutilise feta
  "Φέτα ψητή με ντομάτα & πιπεριά": "feta",

  // === Αναψυκτικά & Νερό ===
  // Soft drinks individuels — chaque référence pointe vers l'image visuelle la plus proche dispo
  "Κόκα-Κόλα 330ml": "coca-cola-330ml",
  "Κόκα-Κόλα Light 330ml": "coca-cola-light-330ml",
  "Κόκα-Κόλα Zero 330ml": "coca-cola-zero-330ml",
  "Sprite 330ml": "soda-330ml",                          // can plain silver (pas de visuel Sprite dispo — fallback générique)
  "Fanta Πορτοκαλάδα 330ml": "fanta-portokalada-330ml",
  "Fanta Μπλε 330ml": "fanta-portokalada-mple-330ml",
  "Σόδα 330ml": "soda-330ml",                            // can plain silver = Σόδα générique
  "Κόκα-Κόλα 1.5L": "coca-cola-330ml",                   // pas de visuel 1.5L dispo, ré-utilise can Coca (proxy marque)
  "Αναψυκτικό 1.5L": "coca-cola-330ml",                  // famille soft drinks 1.5L générique
  "Νερό 500ml": "nero-500ml",
  "Νερό 1L": "nero-1lt",

  // === Κρασιά & Μπύρες ===
  "Κρασί 500ml": "krasi-kokkino-imixiro-500ml",
  "Κρασί 1L": "krasi-kokkino-imixiro-1lt",
  "Amstel 330ml": "amstel-330ml",
  "Amstel 500ml": "amstel-fiali-500ml",
  "Alfa 330ml": "alfa-330ml",
  "Alfa 500ml": "alfa-fiali-500ml",
  "Fix 330ml": "fix-330ml",
  "Fix 500ml": "fix-aney-500ml",
  "Heineken 330ml": "heineken-330ml",
  "Heineken 500ml": "heineken-fiali-500ml",
  "Mythos 330ml": "mythos-300ml", // 300ml seul scrap
  "Mythos 500ml": "mythos-500ml",

  // === Κρασιά & Μπύρες (sides) ===
  "Πατάτες τηγανητές": "patates-tiganites", // même photo que Φρέσκιες Πατάτες (Ορεκτικά Ι) — produit identique, juste catégorisation différente
};

// Plats vedettes pour la section "Nos Spécialités" (HOME)
// Sélection : 8 plats emblématiques + traduction EN
export const SPECIALITIES = [
  {
    slug: "kalamaki-choirino-se-pita",
    name_el: "Καλαμάκι χοιρινό σε πίτα",
    name_en: "Pork souvlaki in pita",
  },
  {
    slug: "i-salata-tis-troympas",
    name_el: "Η σαλάτα της Τρούμπας",
    name_en: "Trouba's salad",
  },
  {
    slug: "patates-tiganites",
    name_el: "Φρέσκιες Πατάτες",
    name_en: "Hand-cut fries",
  },
  {
    slug: "kempap-philadelhia-se-pita",
    name_el: "Κεμπάπ Philadelphia σε πίτα",
    name_en: "Kebap Philadelphia in pita",
  },
  {
    slug: "special-mpifteki-tis-troympas-se-pita",
    name_el: "Special μπιφτέκι της Τρούμπας",
    name_en: "Trouba's special burger",
  },
  {
    slug: "soyvlakia",
    name_el: "Ποικιλία στα κάρβουνα",
    name_en: "Charcoal mixed grill",
  },
  {
    slug: "veggie-burger",
    name_el: "Veggie Burger",
    name_en: "Veggie burger",
  },
  {
    slug: "tzatziki",
    name_el: "Τζατζίκι σπιτικό",
    name_en: "Homemade tzatziki",
  },
];

// Helpers
export function getPhotoSlug(name_el) {
  return NAME_TO_SLUG[name_el] || null;
}

// Retourne le path 800w par défaut, ou null si aucune photo
export function getPhotoSrc(name_el, size = 800) {
  const slug = getPhotoSlug(name_el);
  if (!slug) return null;
  return `/photos/efood/${slug}-${size}w.webp`;
}

// Retourne {src, srcset, sizes} prêts à l'emploi
export function getPhotoData(name_el) {
  const slug = getPhotoSlug(name_el);
  if (!slug) return null;
  return {
    slug,
    src: `/photos/efood/${slug}-800w.webp`,
    srcset: `/photos/efood/${slug}-400w.webp 400w, /photos/efood/${slug}-800w.webp 800w, /photos/efood/${slug}-1600w.webp 1600w`,
  };
}
