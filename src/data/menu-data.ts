// Données menu partagées entre MenuBook (visuel) et /commander (panier).
// IMPORTANT : single source of truth. Si tu modifies les prix ici, le panier suit.

export type MenuItem = {
  el: string;
  en: string;
  desc_el?: string;
  desc_en?: string;
  price: string; // format "3,50€" ou "+0,70€" ou "2,30€ / 3,00€"
};

export type MenuPage = {
  title_el: string;
  title_en: string;
  photo: string;
  note_el?: string;
  note_en?: string;
  items: MenuItem[];
};

export const menuPages: MenuPage[] = [
  {
    title_el: "Ποτά",
    title_en: "Drinks",
    photo: "/photos/efood-08-800w.webp",
    items: [
      { el: "Αναψυκτικά 330ml", en: "Soft drinks 330ml", price: "1,60€" },
      { el: "Αναψυκτικά 500ml", en: "Soft drinks 500ml", price: "1,60€" },
      { el: "Αναψυκτικά 1.5L", en: "Soft drinks 1.5L", price: "2,50€" },
      { el: "Νερό 500ml", en: "Mineral Water 500ml", price: "0,50€" },
      { el: "Νερό 1L", en: "Mineral Water 1L", price: "1,00€" },
      { el: "Κρασί 500ml", en: "Wine 500ml", price: "3,00€" },
      { el: "Κρασί 1L", en: "Wine 1L", price: "6,00€" },
      { el: "Amstel 330ml", en: "Amstel 330ml", price: "2,30€" },
      { el: "Amstel 500ml", en: "Amstel 500ml", price: "3,00€" },
      { el: "Alfa 330ml", en: "Alfa 330ml", price: "2,30€" },
      { el: "Alfa 500ml", en: "Alfa 500ml", price: "3,00€" },
      { el: "Fix 330ml", en: "Fix 330ml", price: "2,30€" },
      { el: "Fix 500ml", en: "Fix 500ml", price: "3,00€" },
      { el: "Heineken 330ml", en: "Heineken 330ml", price: "2,30€" },
      { el: "Heineken 500ml", en: "Heineken 500ml", price: "3,00€" },
      { el: "Mythos 330ml", en: "Mythos 330ml", price: "2,30€" },
      { el: "Mythos 500ml", en: "Mythos 500ml", price: "3,00€" },
    ],
  },
  {
    title_el: "Ορεκτικά Ι",
    title_en: "Appetizers I",
    photo: "/photos/efood-01-800w.webp",
    items: [
      { el: "Φρέσκιες Πατάτες", en: "Fresh Fried Potatoes", price: "3,50€" },
      { el: "Πατάτες με τυρί", en: "Fries with cheese", price: "4,00€" },
      { el: "Πατάτες με τσένταρ & μπέικον", en: "Fries with cheddar & bacon", price: "4,50€" },
      { el: "Φέτα", en: "Feta cheese", price: "3,50€" },
      { el: "Φέτα ψητή με ντομάτα & πιπεριά", en: "Roasted Feta with tomato & peppers", price: "4,50€" },
      { el: "Τζατζίκι σπιτικό", en: "Tzatziki (homemade)", price: "3,50€" },
      { el: "Τυροκαυτερή", en: "Hot Pepper Cheese", price: "3,50€" },
    ],
  },
  {
    title_el: "Ορεκτικά ΙΙ",
    title_en: "Appetizers II",
    photo: "/photos/efood-03-800w.webp",
    items: [
      { el: "Κολοκυθοκεφτέδες τμχ", en: "Zucchini Fritter pc", price: "1,20€" },
      { el: "Κολοκυθοκεφτέδες μερίδα 5 τμχ", en: "Zucchini Fritters portion 5 pcs", price: "6,00€" },
      { el: "Ρεβυθοκεφτέδες τμχ", en: "Chickpea Fritter pc", price: "1,20€" },
      { el: "Ρεβυθοκεφτέδες μερίδα 5 τμχ", en: "Chickpea Fritters portion 5 pcs", price: "6,00€" },
      { el: "Πίτα στα κάρβουνα", en: "Grilled pita bread", price: "0,60€" },
    ],
  },
  {
    title_el: "Σαλάτες",
    title_en: "Salads",
    photo: "/photos/efood-05-800w.webp",
    items: [
      { el: "Η σαλάτα της Τρούμπας", en: "Trouba's salad", desc_el: "μαρούλι, λάχανο, ντομάτα, αγγούρι, κρεμμύδι, πιπεριά, ελιές, κάπαρη & σως μουστάρδας", desc_en: "lettuce, cabbage, tomato, cucumber, onion, peppers, olives, capers & mustard sauce", price: "7,50€" },
      { el: "Λάχανο-Καρότο", en: "Cabbage-Carrot Salad", price: "4,50€" },
      { el: "Μαρούλι", en: "Lettuce Salad", desc_el: "μαρούλι, φρέσκο κρεμμύδι, άνηθος", desc_en: "lettuce, fresh onion, dill", price: "4,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές",
    title_en: "Wrapped Pita",
    photo: "/photos/efood-10-800w.webp",
    items: [
      { el: "Καλαμάκι χοιρινό", en: "Skewered pork", desc_el: "ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι", en: "Skewered chicken thigh", desc_el: "ντομάτα, μαρούλι, σως, πατάτες", desc_en: "tomato, lettuce, sauce, fries", price: "3,50€" },
      { el: "Καλαμάκι κοτομπέικον", en: "Skewered chicken with bacon", desc_el: "ντομάτα, μαρούλι, σως, πατάτες", desc_en: "tomato, lettuce, sauce, fries", price: "3,80€" },
      { el: "Μπιφτέκι μοσχαρίσιο", en: "Beef Burger pc", desc_el: "ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "tomato, onion, tzatziki, fries", price: "3,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές ΙΙ",
    title_en: "Wrapped Pita II",
    photo: "/photos/efood-15-800w.webp",
    items: [
      { el: "Τρουμπάκι — Special μπιφτεκάκι της Τρούμπας", en: "Trouba's special burger", desc_el: "ντομάτα, μουστάρδα, πατάτες", desc_en: "tomato, mustard, fries", price: "3,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια", en: "Kebap Philadelphia", desc_el: "ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "tomato, onion, tzatziki, fries", price: "3,80€" },
      { el: "Πανσετάκι χοιρινό", en: "Pork Belly", desc_el: "ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Μπριζολάκι χοιρινό", en: "Pork Chop", desc_el: "ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Λουκάνικο χοιρινό", en: "Pork Sausage", desc_el: "ντομάτα, κρεμμύδι, μουστάρδα, πατάτες", desc_en: "tomato, onion, mustard, fries", price: "3,80€" },
    ],
  },
  {
    title_el: "Μερίδες — Καλαμάκια",
    title_en: "Portions — Skewers",
    photo: "/photos/efood-20-800w.webp",
    note_el: "4 τμχ — συνοδεύεται με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες, 2 πίτες",
    note_en: "4 pcs — served with tomato, onion, tzatziki, fries, 2 pita",
    items: [
      { el: "Καλαμάκι χοιρινό 4τμχ", en: "Skewered pork 4pcs", price: "9,00€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι 4τμχ", en: "Skewered chicken thigh 4pcs", price: "9,00€" },
      { el: "Καλαμάκι κοτομπέικον 4τμχ", en: "Skewered chicken with bacon 4pcs", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Σπεσιαλιτέ",
    title_en: "Portions — Specials",
    photo: "/photos/efood-25-800w.webp",
    note_el: "Συνοδεύεται με πατάτες, πίτα, σαλάτα/σάλτσα",
    note_en: "Served with fries, pita, salad/sauce",
    items: [
      { el: "Μπιφτέκι μοσχαρίσιο 2τμχ", en: "Beef Burger 2pcs", price: "9,00€" },
      { el: "Special μπιφτεκάκι της Τρούμπας 4τμχ", en: "Trouba's special 4pcs", price: "9,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια 4τμχ", en: "Kebap Philadelphia 4pcs", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Χοιρινά",
    title_en: "Portions — Pork",
    photo: "/photos/efood-30-800w.webp",
    note_el: "Συνοδεύεται με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες, 2 πίτες",
    note_en: "Served with tomato, onion, tzatziki, fries, 2 pita",
    items: [
      { el: "Πανσετάκι χοιρινό 5τμχ", en: "Pork Belly 5pcs", price: "9,50€" },
      { el: "Μπριζολάκι χοιρινό 4τμχ", en: "Pork Chop 4pcs", price: "9,50€" },
      { el: "Λουκάνικο χοιρινό 3τμχ", en: "Pork Sausage 3pcs", price: "9,50€" },
      { el: "Ποικιλία 2 ατόμων", en: "Mix grill for 2 persons", price: "16,00€" },
    ],
  },
  {
    title_el: "Χάμπουργκερ",
    title_en: "Hamburger",
    photo: "/photos/efood-35-800w.webp",
    items: [
      { el: "Χάμπουργκερ Κλασικό", en: "Classic Hamburger", desc_el: "μπιφτέκι μοσχαρίσιο, τυρί cheddar, πράσινη σαλάτα, ντομάτα, κρεμμύδι, πατάτες", desc_en: "beef burger, cheddar cheese, lettuce, tomato, onion, fries", price: "7,00€" },
      { el: "Χάμπουργκερ Διπλό", en: "Double Hamburger", desc_el: "διπλό μπιφτέκι, διπλό cheddar, πράσινη σαλάτα, ντομάτα, κρεμμύδι, πατάτες", desc_en: "double beef burger, double cheddar, lettuce, tomato, onion, fries", price: "9,50€" },
      { el: "Cheeseburger της Τρούμπας", en: "Trouba's Cheeseburger", desc_el: "μπιφτέκι, διπλό cheddar, μπέικον, αυγό τηγανητό, πατάτες", desc_en: "burger, double cheddar, bacon, fried egg, fries", price: "8,50€" },
      { el: "BBQ Burger", en: "BBQ Burger", desc_el: "μπιφτέκι, καπνιστό τυρί, καραμελωμένο κρεμμύδι, BBQ sauce, πατάτες", desc_en: "burger, smoked cheese, caramelised onion, BBQ sauce, fries", price: "8,50€" },
      { el: "+ Έξτρα μπέικον", en: "+ extra bacon", price: "+0,70€" },
      { el: "+ Έξτρα cheddar", en: "+ extra cheddar", price: "+0,70€" },
      { el: "+ Έξτρα αυγό", en: "+ extra fried egg", price: "+0,80€" },
    ],
  },
  {
    title_el: "Veggie Menu",
    title_en: "Veggie Menu",
    photo: "/photos/efood-40-800w.webp",
    items: [
      { el: "Μπιφτέκι λαχανικών τμχ", en: "Vegetable Stick pc", price: "2,00€" },
      { el: "Τυλιχτό Μπιφτέκι λαχανικών", en: "Wrapped Vegetable Burger", desc_el: "ντομάτα, μαρούλι, πατάτες", desc_en: "tomato, lettuce, fries", price: "3,50€" },
      { el: "Λουκάνικο σουπιάς τμχ", en: "Sepia Sausage pc", price: "2,30€" },
      { el: "Τυλιχτό Λουκάνικο σουπιάς", en: "Wrapped Sepia Sausage", desc_el: "ντομάτα, μαρούλι, πατάτες", desc_en: "tomato, lettuce, fries", price: "3,80€" },
      { el: "Τυλιχτό Ρεβυθοκεφτές", en: "Wrapped Chickpea Fritter", desc_el: "ντομάτα, μαρούλι, πατάτες", desc_en: "tomato, lettuce, fries", price: "3,50€" },
      { el: "Τυλιχτό Κολοκυθοκεφτές", en: "Wrapped Zucchini Fritter", desc_el: "ντομάτα, μαρούλι, πατάτες", desc_en: "tomato, lettuce, fries", price: "3,50€" },
      { el: "Τυλιχτό Οικολογικό", en: "Wrapped pita without meat", desc_el: "ντομάτα, κρεμμύδι, μαρούλι, πατάτες", desc_en: "tomato, onion, lettuce, fries", price: "2,50€" },
      { el: "Veggie Burger", en: "Veggie Burger", desc_el: "ντομάτα, πράσινη σαλάτα, νηστίσιμο τυρί, κέτσαπ, μουστάρδα, πατάτες", desc_en: "tomato, lettuce, vegan cheese, ketchup, mustard, fries", price: "7,00€" },
      { el: "Καλαμάκι Σεϊτάν τμχ", en: "Seitan skewer pc", desc_el: "φυτικής πρωτεΐνης που μοιάζει με κρέας", desc_en: "plant-based meat-like protein", price: "2,60€" },
      { el: "Κεμπάπ Σεϊτάν", en: "Seitan kebab", price: "2,60€" },
      { el: "Τυλιχτό Σεϊτάν", en: "Wrapped Seitan", price: "3,80€" },
    ],
  },
  {
    title_el: "Σάντουιτς & Σκεπαστή",
    title_en: "Sandwich & Skepasti",
    photo: "/photos/efood-45-800w.webp",
    items: [
      { el: "Σάντουιτς με κρέας της επιλογής σας", en: "Sandwich with meat of your choice", desc_el: "ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "tomato, lettuce, tzatziki, fries", price: "4,50€" },
      { el: "Σάντουιτς με διπλό κρέας", en: "Sandwich with double meat", desc_el: "ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "tomato, lettuce, tzatziki, fries", price: "5,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας", en: "Skepasti with meat of your choice", desc_el: "ντομάτα, μαρούλι, σως, πατάτες & τυρί γκούντα", desc_en: "tomato, lettuce, sauce, fries & gouda cheese", price: "7,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας (διπλό)", en: "Skepasti — double meat", desc_el: "ντομάτα, μαρούλι, σως, πατάτες & τυρί γκούντα", desc_en: "tomato, lettuce, sauce, fries & gouda cheese", price: "9,50€" },
    ],
  },
];

// Parse "3,50€" ou "+0,70€" -> 3.50 ou 0.70
export function parsePrice(s: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/[^\d,.-]/g, "").replace(",", ".").replace(/^\+/, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function formatPrice(n: number): string {
  return n.toFixed(2).replace(".", ",") + "€";
}

// Génère un ID stable pour un item (utilisé dans le panier).
// Format : "p<page>-i<item>" → court, stable tant que l'ordre du menu ne change pas.
export function itemId(pageIdx: number, itemIdx: number): string {
  return `p${pageIdx}-i${itemIdx}`;
}
