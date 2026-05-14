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
  "Κολοκυθοκεφτέδες τμχ": "kolokythokeftes",
  "Κολοκυθοκεφτέδες μερίδα 5 τμχ": "kolokythokeftes",
  "Ρεβυθοκεφτέδες τμχ": "revythokeftes",
  "Ρεβυθοκεφτέδες μερίδα 5 τμχ": "revythokeftes",
  "Πίτα στα κάρβουνα": "pita-sketi",

  // === Σαλάτες ===
  "Η σαλάτα της Τρούμπας": "i-salata-tis-troympas",
  "Λάχανο-Καρότο": "lachano-karoto",
  "Μαρούλι": "maroyli",

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
  "Χάμπουργκερ Κλασικό": "burger-moscharisio",
  "Χάμπουργκερ Διπλό": "burger-moscharisio",
  "Cheeseburger της Τρούμπας": "burger-moscharisio",
  "BBQ Burger": "burger-moscharisio",

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

  // === Σάντουιτς & Σκεπαστή ===
  "Σάντουιτς με κρέας της επιλογής σας": "kalamaki-choirino-se-santoyits",
  "Σάντουιτς με διπλό κρέας": "kalamaki-choirino-se-santoyits",
  "Σκεπαστή με κρέας της επιλογής σας": "skepasti-kalamaki-choirino",
  "Σκεπαστή με κρέας της επιλογής σας (διπλό)": "skepasti-mpifteki-moscharisio",
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
