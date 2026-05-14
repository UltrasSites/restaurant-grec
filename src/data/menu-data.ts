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
    photo: "/photos/efood-00-800w.webp",
    items: [
      { el: "Αναψυκτικά 330ml", en: "Soft drinks 330ml", desc_el: "Coca-Cola, Sprite, Fanta, Soda — δροσερό κουτάκι", desc_en: "Coca-Cola, Sprite, Fanta, Soda — ice-cold can", price: "1,60€" },
      { el: "Αναψυκτικά 500ml", en: "Soft drinks 500ml", desc_el: "Coca-Cola, Sprite, Fanta — μπουκάλι 500ml", desc_en: "Coca-Cola, Sprite, Fanta — 500ml bottle", price: "1,60€" },
      { el: "Αναψυκτικά 1.5L", en: "Soft drinks 1.5L", desc_el: "Οικογενειακή φιάλη για μοιρασιά", desc_en: "Family-size bottle to share", price: "2,50€" },
      { el: "Νερό 500ml", en: "Mineral Water 500ml", desc_el: "Φυσικό μεταλλικό νερό", desc_en: "Natural mineral water", price: "0,50€" },
      { el: "Νερό 1L", en: "Mineral Water 1L", desc_el: "Φυσικό μεταλλικό νερό — μεγάλη φιάλη", desc_en: "Natural mineral water — large bottle", price: "1,00€" },
      { el: "Κρασί 500ml", en: "Wine 500ml", desc_el: "Λευκό ή κόκκινο σπιτικό κρασί — καράφα 500ml", desc_en: "House white or red wine — 500ml carafe", price: "3,00€" },
      { el: "Κρασί 1L", en: "Wine 1L", desc_el: "Λευκό ή κόκκινο σπιτικό κρασί — καράφα 1L", desc_en: "House white or red wine — 1L carafe", price: "6,00€" },
      { el: "Amstel 330ml", en: "Amstel 330ml", desc_el: "Ελληνική lager — ελαφριά, ξηρή", desc_en: "Greek lager — light, dry", price: "2,30€" },
      { el: "Amstel 500ml", en: "Amstel 500ml", desc_el: "Ελληνική lager — μεγάλη φιάλη", desc_en: "Greek lager — large bottle", price: "3,00€" },
      { el: "Alfa 330ml", en: "Alfa 330ml", desc_el: "Κλασική ελληνική μπύρα από 1961", desc_en: "Classic Greek beer since 1961", price: "2,30€" },
      { el: "Alfa 500ml", en: "Alfa 500ml", desc_el: "Κλασική ελληνική μπύρα — 500ml", desc_en: "Classic Greek beer — 500ml", price: "3,00€" },
      { el: "Fix 330ml", en: "Fix 330ml", desc_el: "Η αρχαιότερη ελληνική μπύρα — από 1864", desc_en: "Greece's oldest beer — since 1864", price: "2,30€" },
      { el: "Fix 500ml", en: "Fix 500ml", desc_el: "Η αρχαιότερη ελληνική μπύρα — μεγάλη", desc_en: "Greece's oldest beer — large bottle", price: "3,00€" },
      { el: "Heineken 330ml", en: "Heineken 330ml", desc_el: "Διεθνής ολλανδική premium lager", desc_en: "International Dutch premium lager", price: "2,30€" },
      { el: "Heineken 500ml", en: "Heineken 500ml", desc_el: "Διεθνής ολλανδική premium lager — 500ml", desc_en: "International Dutch premium lager — 500ml", price: "3,00€" },
      { el: "Mythos 330ml", en: "Mythos 330ml", desc_el: "Δροσερή ελληνική pilsner, lightly hopped", desc_en: "Crisp Greek pilsner, lightly hopped", price: "2,30€" },
      { el: "Mythos 500ml", en: "Mythos 500ml", desc_el: "Δροσερή ελληνική pilsner — μεγάλη φιάλη", desc_en: "Crisp Greek pilsner — large bottle", price: "3,00€" },
    ],
  },
  {
    title_el: "Ορεκτικά Ι",
    title_en: "Appetizers I",
    photo: "/photos/efood-05-800w.webp",
    items: [
      { el: "Φρέσκιες Πατάτες", en: "Fresh Fried Potatoes", desc_el: "Χειροποίητες πατάτες κομμένες την ώρα, τηγανιτές σε φρέσκο λάδι, αλάτι θαλάσσιο", desc_en: "Hand-cut fries made to order, fried in fresh oil, sea salt", price: "3,50€" },
      { el: "Πατάτες με τυρί", en: "Fries with cheese", desc_el: "Φρέσκιες πατάτες με λιωμένο κίτρινο τυρί από επάνω", desc_en: "Fresh fries topped with melted yellow cheese", price: "4,00€" },
      { el: "Πατάτες με τσένταρ & μπέικον", en: "Fries with cheddar & bacon", desc_el: "Πατάτες σε στρώσεις cheddar που λιώνει και τραγανό μπέικον", desc_en: "Loaded fries with melted cheddar and crispy bacon", price: "4,50€" },
      { el: "Φέτα", en: "Feta cheese", desc_el: "Παραδοσιακή ελληνική φέτα ΠΟΠ από πρόβειο γάλα, ρίγανη, ελαιόλαδο", desc_en: "Traditional Greek PDO feta from sheep's milk, oregano, olive oil", price: "3,50€" },
      { el: "Φέτα ψητή με ντομάτα & πιπεριά", en: "Roasted Feta with tomato & peppers", desc_el: "Φέτα ψημένη στο φούρνο με φρέσκια ντομάτα, πιπεριά Φλωρίνης, ρίγανη και ελαιόλαδο", desc_en: "Oven-baked feta with fresh tomato, Florina peppers, oregano and olive oil", price: "4,50€" },
      { el: "Τζατζίκι σπιτικό", en: "Tzatziki (homemade)", desc_el: "Σπιτικό στραγγιστό γιαούρτι, φρέσκο αγγούρι τριμμένο, σκόρδο, άνηθος, ελαιόλαδο", desc_en: "Homemade strained yogurt, freshly grated cucumber, garlic, dill, olive oil", price: "3,50€" },
      { el: "Τυροκαυτερή", en: "Hot Pepper Cheese", desc_el: "Πικάντικη κρέμα τυριού φέτα με ψητές καυτερές πιπεριές, ελαιόλαδο", desc_en: "Spicy feta cheese spread with roasted hot peppers and olive oil", price: "3,50€" },
    ],
  },
  {
    title_el: "Ορεκτικά ΙΙ",
    title_en: "Appetizers II",
    photo: "/photos/efood-08-800w.webp",
    items: [
      { el: "Κολοκυθοκεφτέδες τμχ", en: "Zucchini Fritter pc", desc_el: "Σπιτικά κεφτεδάκια κολοκυθιού με φέτα, δυόσμο και άνηθο, τηγανιτά", desc_en: "Homemade zucchini fritter with feta, mint and dill, pan-fried", price: "1,20€" },
      { el: "Κολοκυθοκεφτέδες μερίδα 5 τμχ", en: "Zucchini Fritters portion 5 pcs", desc_el: "5 σπιτικά κολοκυθοκεφτέδες σε μερίδα — σερβίρονται με τζατζίκι", desc_en: "Portion of 5 homemade zucchini fritters — served with tzatziki", price: "6,00€" },
      { el: "Ρεβυθοκεφτέδες τμχ", en: "Chickpea Fritter pc", desc_el: "Παραδοσιακό κεφτεδάκι ρεβιθιού με κρεμμύδι, μυρωδικά — χορτοφαγικό", desc_en: "Traditional chickpea fritter with onion and herbs — vegetarian", price: "1,20€" },
      { el: "Ρεβυθοκεφτέδες μερίδα 5 τμχ", en: "Chickpea Fritters portion 5 pcs", desc_el: "5 ρεβυθοκεφτέδες — χορτοφαγική επιλογή με τζατζίκι", desc_en: "5 chickpea fritters — vegetarian option served with tzatziki", price: "6,00€" },
      { el: "Πίτα στα κάρβουνα", en: "Grilled pita bread", desc_el: "Παραδοσιακή πίτα ψημένη πάνω από κάρβουνα, ζεστή και αφράτη", desc_en: "Traditional pita bread grilled over charcoal, warm and fluffy", price: "0,60€" },
    ],
  },
  {
    title_el: "Σαλάτες",
    title_en: "Salads",
    photo: "/photos/efood-25-800w.webp",
    items: [
      { el: "Η σαλάτα της Τρούμπας", en: "Trouba's salad", desc_el: "Η σπεσιαλιτέ μας : μαρούλι, λάχανο, ντομάτα, αγγούρι, κρεμμύδι, πιπεριά, ελιές Καλαμάτας, κάπαρη και σπιτική σως μουστάρδας", desc_en: "Our house special: lettuce, cabbage, tomato, cucumber, onion, peppers, Kalamata olives, capers and homemade mustard dressing", price: "7,50€" },
      { el: "Λάχανο-Καρότο", en: "Cabbage-Carrot Salad", desc_el: "Φρέσκο λάχανο και καρότο ψιλοκομμένο, ελαιόλαδο, λεμόνι", desc_en: "Finely sliced fresh cabbage and carrot, olive oil, lemon", price: "4,50€" },
      { el: "Μαρούλι", en: "Lettuce Salad", desc_el: "Μαρούλι, φρέσκο κρεμμύδι, άνηθος — η κλασική ελληνική πράσινη σαλάτα", desc_en: "Lettuce, fresh spring onion, dill — the classic Greek green salad", price: "4,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές",
    title_en: "Wrapped Pita",
    photo: "/photos/efood-01-800w.webp",
    note_el: "Τυλιχτές σε φρέσκια πίτα ψημένη στα κάρβουνα, με σπιτικές πατάτες",
    note_en: "Wrapped in fresh charcoal-grilled pita, served with house fries",
    items: [
      { el: "Καλαμάκι χοιρινό", en: "Skewered pork", desc_el: "Σουβλάκι χοιρινό μαριναρισμένο σε ρίγανη και λεμόνι, ψημένο στα κάρβουνα, με ντομάτα, κρεμμύδι, τζατζίκι και πατάτες", desc_en: "Pork souvlaki marinated in oregano and lemon, charcoal-grilled — tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι", en: "Skewered chicken thigh", desc_el: "Ζουμερό κοτόπουλο από μπούτι (πιο γευστικό από το στήθος), ντομάτα, μαρούλι, σπιτική σως, πατάτες", desc_en: "Juicy chicken thigh (more flavourful than breast), tomato, lettuce, house sauce, fries", price: "3,50€" },
      { el: "Καλαμάκι κοτομπέικον", en: "Skewered chicken with bacon", desc_el: "Κοτόπουλο τυλιγμένο με τραγανό μπέικον, ντομάτα, μαρούλι, σως, πατάτες", desc_en: "Chicken wrapped in crispy bacon, tomato, lettuce, sauce, fries", price: "3,80€" },
      { el: "Μπιφτέκι μοσχαρίσιο", en: "Beef Burger pc", desc_el: "Σπιτικό μπιφτέκι από φρέσκο μοσχαρίσιο κιμά με μυρωδικά, ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Homemade beef patty from fresh ground beef with herbs, tomato, onion, tzatziki, fries", price: "3,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές ΙΙ",
    title_en: "Wrapped Pita II",
    photo: "/photos/efood-03-800w.webp",
    note_el: "Οι σπεσιαλιτέ της Τρούμπας — δοκίμασε το Τρουμπάκι",
    note_en: "Trouba's specials — try the signature Trouba burger",
    items: [
      { el: "Τρουμπάκι — Special μπιφτεκάκι της Τρούμπας", en: "Trouba's special burger", desc_el: "Η σπεσιαλιτέ του καταστήματος : μικρό μπιφτεκάκι με μυστική συνταγή μυρωδικών, ντομάτα, μουστάρδα, πατάτες", desc_en: "Our signature: mini burger with secret herb mix, tomato, mustard, fries", price: "3,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια", en: "Kebap Philadelphia", desc_el: "Αρωματικό κεμπάπ στιλ Φιλαδέλφειας με ανατολίτικα μπαχαρικά, ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Aromatic Philadelphia-style kebab with eastern spices, tomato, onion, tzatziki, fries", price: "3,80€" },
      { el: "Πανσετάκι χοιρινό", en: "Pork Belly", desc_el: "Λεπτή φέτα χοιρινής πανσέτας στα κάρβουνα, ζουμερή και τραγανή στις άκρες — ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Thin slice of charcoal-grilled pork belly, juicy with crispy edges — tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Μπριζολάκι χοιρινό", en: "Pork Chop", desc_el: "Μικρή χοιρινή μπριζόλα μαριναρισμένη, ψημένη στα κάρβουνα — ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Small marinated pork chop grilled on charcoal — tomato, onion, tzatziki, fries", price: "3,50€" },
      { el: "Λουκάνικο χοιρινό", en: "Pork Sausage", desc_el: "Χωριάτικο χοιρινό λουκάνικο με πορτοκάλι και πράσο, στα κάρβουνα — ντομάτα, κρεμμύδι, μουστάρδα, πατάτες", desc_en: "Village-style pork sausage with orange and leek, charcoal-grilled — tomato, onion, mustard, fries", price: "3,80€" },
    ],
  },
  {
    title_el: "Μερίδες — Καλαμάκια",
    title_en: "Portions — Skewers",
    photo: "/photos/efood-06-800w.webp",
    note_el: "Πλήρες πιάτο : 4 τεμάχια — με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες και 2 πίτες στα κάρβουνα",
    note_en: "Full plate: 4 skewers — with tomato, onion, tzatziki, fries and 2 charcoal-grilled pitas",
    items: [
      { el: "Καλαμάκι χοιρινό 4τμχ", en: "Skewered pork 4pcs", desc_el: "4 σουβλάκια χοιρινό μαριναρισμένο σε ρίγανη και λεμόνι, ψημένα στα κάρβουνα", desc_en: "4 pork souvlaki marinated in oregano and lemon, charcoal-grilled", price: "9,00€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι 4τμχ", en: "Skewered chicken thigh 4pcs", desc_el: "4 σουβλάκια κοτόπουλο από ζουμερό μπούτι", desc_en: "4 chicken souvlaki from juicy thigh meat", price: "9,00€" },
      { el: "Καλαμάκι κοτομπέικον 4τμχ", en: "Skewered chicken with bacon 4pcs", desc_el: "4 σουβλάκια κοτόπουλο τυλιγμένα με μπέικον", desc_en: "4 chicken souvlaki wrapped in bacon", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Σπεσιαλιτέ",
    title_en: "Portions — Specials",
    photo: "/photos/efood-60-800w.webp",
    note_el: "Συνοδεύεται με πατάτες, πίτα στα κάρβουνα και σαλάτα/σάλτσα",
    note_en: "Served with fries, charcoal-grilled pita and salad/sauce",
    items: [
      { el: "Μπιφτέκι μοσχαρίσιο 2τμχ", en: "Beef Burger 2pcs", desc_el: "2 σπιτικά μπιφτέκια από φρέσκο μοσχαρίσιο κιμά με μυρωδικά", desc_en: "2 homemade beef patties from fresh ground beef with herbs", price: "9,00€" },
      { el: "Special μπιφτεκάκι της Τρούμπας 4τμχ", en: "Trouba's special 4pcs", desc_el: "4 μικρά Τρουμπάκια με μυστική συνταγή — η σπεσιαλιτέ μας", desc_en: "4 mini Trouba burgers with our secret recipe — house specialty", price: "9,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια 4τμχ", en: "Kebap Philadelphia 4pcs", desc_el: "4 κεμπάπ Φιλαδέλφειας με ανατολίτικα μπαχαρικά", desc_en: "4 Philadelphia-style kebabs with eastern spices", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Χοιρινά",
    title_en: "Portions — Pork",
    photo: "/photos/efood-62-800w.webp",
    note_el: "Συνοδεύεται με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες και 2 πίτες",
    note_en: "Served with tomato, onion, tzatziki, fries and 2 pitas",
    items: [
      { el: "Πανσετάκι χοιρινό 5τμχ", en: "Pork Belly 5pcs", desc_el: "5 φέτες χοιρινής πανσέτας στα κάρβουνα — ζουμερές, τραγανές, με ρίγανη", desc_en: "5 slices of charcoal-grilled pork belly — juicy, crispy edges, oregano", price: "9,50€" },
      { el: "Μπριζολάκι χοιρινό 4τμχ", en: "Pork Chop 4pcs", desc_el: "4 μικρές χοιρινές μπριζόλες μαριναρισμένες, ψημένες στα κάρβουνα", desc_en: "4 small marinated pork chops grilled on charcoal", price: "9,50€" },
      { el: "Λουκάνικο χοιρινό 3τμχ", en: "Pork Sausage 3pcs", desc_el: "3 χωριάτικα λουκάνικα με πορτοκάλι και πράσο, στα κάρβουνα", desc_en: "3 village-style sausages with orange and leek, charcoal-grilled", price: "9,50€" },
      { el: "Ποικιλία 2 ατόμων", en: "Charcoal plate for 2", desc_el: "Μεγάλη ποικιλία για 2 : σουβλάκι, μπιφτέκι, πανσέτα, λουκάνικο — με όλες τις γαρνιτούρες", desc_en: "Generous charcoal plate for 2: souvlaki, burger, pork belly, sausage — with all the trimmings", price: "16,00€" },
    ],
  },
  {
    title_el: "Χάμπουργκερ",
    title_en: "Hamburger",
    photo: "/photos/efood-42-800w.webp",
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
    photo: "/photos/efood-32-800w.webp",
    note_el: "Χορτοφαγικές και vegan επιλογές — φτιαγμένες με την ίδια φροντίδα",
    note_en: "Vegetarian and vegan options — made with the same care",
    items: [
      { el: "Μπιφτέκι λαχανικών τμχ", en: "Vegetable Stick pc", desc_el: "Σπιτικό μπιφτέκι λαχανικών με καρότο, κολοκυθάκι, πατάτα και μυρωδικά", desc_en: "Homemade vegetable patty with carrot, zucchini, potato and herbs", price: "2,00€" },
      { el: "Τυλιχτό Μπιφτέκι λαχανικών", en: "Wrapped Vegetable Burger", desc_el: "Πίτα τυλιχτή με μπιφτέκι λαχανικών, ντομάτα, μαρούλι και πατάτες", desc_en: "Wrapped pita with vegetable patty, tomato, lettuce and fries", price: "3,50€" },
      { el: "Λουκάνικο σουπιάς τμχ", en: "Sepia Sausage pc", desc_el: "Θαλασσινό λουκάνικο από σουπιά — υφή λεπτή, γεύση θαλασσινή", desc_en: "Seafood sausage made from sepia (cuttlefish) — delicate texture, sea flavour", price: "2,30€" },
      { el: "Τυλιχτό Λουκάνικο σουπιάς", en: "Wrapped Sepia Sausage", desc_el: "Πίτα με λουκάνικο σουπιάς, ντομάτα, μαρούλι, πατάτες", desc_en: "Pita wrap with sepia sausage, tomato, lettuce, fries", price: "3,80€" },
      { el: "Τυλιχτό Ρεβυθοκεφτές", en: "Wrapped Chickpea Fritter", desc_el: "Πίτα με σπιτικούς ρεβυθοκεφτέδες (vegan), ντομάτα, μαρούλι, πατάτες", desc_en: "Pita with homemade chickpea fritters (vegan), tomato, lettuce, fries", price: "3,50€" },
      { el: "Τυλιχτό Κολοκυθοκεφτές", en: "Wrapped Zucchini Fritter", desc_el: "Πίτα με σπιτικούς κολοκυθοκεφτέδες (περιέχει φέτα), ντομάτα, μαρούλι, πατάτες", desc_en: "Pita with homemade zucchini fritters (contains feta), tomato, lettuce, fries", price: "3,50€" },
      { el: "Τυλιχτό Οικολογικό", en: "Wrapped pita without meat", desc_el: "Vegan επιλογή χωρίς κρέας : ντομάτα, κρεμμύδι, μαρούλι, πατάτες σε πίτα", desc_en: "Vegan option without meat: tomato, onion, lettuce, fries in a pita", price: "2,50€" },
      { el: "Veggie Burger", en: "Veggie Burger", desc_el: "Μεγάλος vegan burger : ντομάτα, πράσινη σαλάτα, νηστίσιμο τυρί, κέτσαπ, μουστάρδα, πατάτες", desc_en: "Generous vegan burger: tomato, lettuce, vegan cheese, ketchup, mustard, fries", price: "7,00€" },
      { el: "Καλαμάκι Σεϊτάν τμχ", en: "Seitan skewer pc", desc_el: "Σουβλάκι σεϊτάν — φυτική πρωτεΐνη γλουτένης που μοιάζει με κρέας, στα κάρβουνα", desc_en: "Seitan skewer — plant-based wheat protein with meaty texture, charcoal-grilled", price: "2,60€" },
      { el: "Κεμπάπ Σεϊτάν", en: "Seitan kebab", desc_el: "Κεμπάπ από σεϊτάν με ανατολίτικα μπαχαρικά — vegan", desc_en: "Seitan kebab with eastern spices — vegan", price: "2,60€" },
      { el: "Τυλιχτό Σεϊτάν", en: "Wrapped Seitan", desc_el: "Πίτα τυλιχτή με σεϊτάν, ντομάτα, μαρούλι και πατάτες — vegan", desc_en: "Wrapped pita with seitan, tomato, lettuce and fries — vegan", price: "3,80€" },
    ],
  },
  {
    title_el: "Σάντουιτς & Σκεπαστή",
    title_en: "Sandwich & Skepasti",
    photo: "/photos/efood-47-800w.webp",
    note_el: "Η σκεπαστή είναι πίτα γεμιστή και κλειστή στη σχάρα — μια ιδιαιτερότητα του Πειραιά",
    note_en: "Skepasti is a stuffed pita closed and pressed on the grill — a Piraeus specialty",
    items: [
      { el: "Σάντουιτς με κρέας της επιλογής σας", en: "Sandwich with meat of your choice", desc_el: "Σπιτικό ψωμί ψημένο, με το κρέας της επιλογής σας (χοιρινό/κοτόπουλο/γύρος), ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "Toasted house bread with your choice of meat (pork/chicken/gyros), tomato, lettuce, tzatziki, fries", price: "4,50€" },
      { el: "Σάντουιτς με διπλό κρέας", en: "Sandwich with double meat", desc_el: "Σάντουιτς με διπλή μερίδα κρέατος, ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "Double-meat sandwich, tomato, lettuce, tzatziki, fries", price: "5,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας", en: "Skepasti with meat of your choice", desc_el: "Πίτα γεμιστή με κρέας, ντομάτα, μαρούλι, σπιτική σως, πατάτες, τυρί γκούντα που λιώνει — κλειστή στη σχάρα", desc_en: "Pita stuffed with meat, tomato, lettuce, house sauce, fries, melted gouda — pressed closed on the grill", price: "7,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας (διπλό)", en: "Skepasti — double meat", desc_el: "Σκεπαστή με διπλή μερίδα κρέατος — πιο γενναιόδωρη, ίδιες γαρνιτούρες", desc_en: "Double-meat skepasti — more generous, same toppings", price: "9,50€" },
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
