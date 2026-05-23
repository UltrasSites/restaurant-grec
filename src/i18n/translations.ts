import type { Lang } from './utils';

export type MenuSection = { category: string; items: { name: string; price: string; desc: string }[] };

type RestaurantTranslations = {
  meta_title: string;
  meta_description: string;
  nav_home: string;
  nav_ambiance: string;
  nav_carte: string;
  nav_contact: string;
  nav_reserver: string;
  nav_menu: string;
  nav_aria_phone: string;
  voir_carte: string;
  hero_badge: string;
  hero_title: string;
  hero_lead: string;
  hero_demo_note: string;
  resa_title: string;
  resa_subtitle: string;
  resa_address: string;
  resa_phone: string;
  resa_hours: string;
  resa_label_address: string;
  resa_label_phone: string;
  resa_label_hours: string;
  resa_cta1: string;
  resa_cta2: string;
  resa_cta3: string;
  story_label: string;
  story_title: string;
  story_p1: string;
  story_p2: string;
  blog_label: string;
  blog_title: string;
  blog_lead: string;
  card1_title: string;
  card1_desc: string;
  card2_title: string;
  card2_desc: string;
  card3_title: string;
  card3_desc: string;
  card4_title: string;
  card4_desc: string;
  card5_title: string;
  card5_desc: string;
  card6_title: string;
  card6_desc: string;
  carte_label: string;
  carte_title: string;
  carte_lead: string;
  carte_service_note: string;
  carte_download: string;
  carte_reserver: string;
  carte_scan: string;
  contact_title: string;
  contact_lead: string;
  contact_email: string;
  contact_demo: string;
  contact_hours: string;
  form_name: string;
  form_guests: string;
  form_confirm: string;
  footer_brand: string;
  footer_demo: string;
  footer_lead: string;
  footer_restaurant: string;
  footer_story: string;
  footer_find: string;
  footer_find_lead: string;
  footer_copyright: string;
  drawer_theme: string;
  drawer_brand: string;
  // Commander online
  order_cta: string;
  order_title: string;
  order_subtitle: string;
  order_cart: string;
  order_cart_empty: string;
  order_cart_total: string;
  order_validate: string;
  order_form_title: string;
  order_form_name: string;
  order_form_phone: string;
  order_form_pickup: string;
  order_form_pickup_15: string;
  order_form_pickup_30: string;
  order_form_pickup_45: string;
  order_form_pickup_60: string;
  order_form_submit: string;
  order_form_back: string;
  order_form_pay_note: string;
  order_success_title: string;
  order_success_body: string;
  order_success_back: string;
  order_error: string;
  order_add: string;
  order_remove: string;
};

const ui: Record<Lang, RestaurantTranslations> = {
  el: {
    meta_title: 'Σουβλάκι Τρούμπα · Παραγγελία online · Πειραιάς | Καλαμάκι',
    meta_description: 'Καλαμάκι Της Τρούμπας — αυθεντική πίτα, γύρος και σουβλάκι στην καρδιά της Τρούμπας Πειραιά. Παραγγειλε online, γρήγορη παράδοση στον Πειραιά, 0% προμήθεια πλατφόρμας. Μπουμπουλίνας 8.',
    nav_home: 'Αρχική',
    nav_ambiance: 'Ιστορία',
    nav_carte: 'Κατάλογος',
    nav_contact: 'Επικοινωνία',
    nav_reserver: 'Κράτηση',
    nav_menu: 'Μενού',
    nav_aria_phone: 'Τηλέφωνο',
    voir_carte: 'Δες τον κατάλογο',
    hero_badge: 'Σουβλάκι · Γύρος · Πίτα · Τρούμπα Πειραιά',
    hero_title: 'Γεύση & Μεράκι',
    hero_lead: 'Στην Τρούμπα, στη γωνία Μπουμπουλίνας & Νοταρά. Φρέσκα κρέατα, σπιτικές σάλτσες και τιμές που σε γυρνάνε πίσω. Αυτό είναι το καλαμάκι του Πειραιά.',
    hero_demo_note: '',
    resa_title: 'Επικοινωνία & Κράτηση',
    resa_subtitle: 'Κλείσε τραπέζι ή παράγγειλε online.',
    resa_address: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς 185 35',
    resa_phone: '+30 210 422 2233',
    resa_hours: 'Δευ–Πέμ: 13:00–02:30 · Παρ: 13:00–04:00 · Σαβ: 20:00–05:00 · Κυρ: Κλειστό',
    resa_label_address: 'Διεύθυνση',
    resa_label_phone: 'Τηλέφωνο',
    resa_label_hours: 'Ώρες λειτουργίας',
    resa_cta1: 'Παράγγειλε online',
    resa_cta2: 'Στείλε μήνυμα',
    resa_cta3: 'Δες τον κατάλογο',
    story_label: 'Η ιστορία μας',
    story_title: 'Χρόνια γεύση, πειραιώτικο μεράκι.',
    story_p1: 'Στην Τρούμπα, κάθε βράδυ η μυρωδιά απ\'τα κάρβουνα φτάνει μέχρι το λιμάνι. Φρέσκο κρέας, σπιτικές σάλτσες και πίτα ψημένη τη στιγμή — η συνταγή μας δεν άλλαξε ποτέ.',
    story_p2: 'Δεν υπάρχει μυστικό. Καλά υλικά, γρήγορο χέρι και η γεύση που ξέρεις από πάντα. Τιμές που σε κάνουν να γυρνάς.',
    blog_label: 'Ατμόσφαιρα & Γεύσεις',
    blog_title: 'Στιγμές από την Τρούμπα',
    blog_lead: 'Αυθεντικές γεύσεις Πειραιά κάθε μέρα. Στιγμές απ\'το μαγαζί μας — φωτογραφίες και βίντεο.',
    card1_title: 'Καλαμάκι πειραιώτικο',
    card1_desc: 'Χοιρινό ή κοτόπουλο στα κάρβουνα. Μαρινάδα από συνταγή γενιών.',
    card2_title: 'Πίτα γύρος',
    card2_desc: 'Γύρος με τζατζίκι, ντομάτα, κρεμμύδι, πατάτες. Πίτα φρεσκοψημένη κάθε φορά.',
    card3_title: 'Ατμόσφαιρα Τρούμπας',
    card3_desc: 'Γεμάτα τραπέζια κάθε βράδυ. Πελάτες απ\'όλο τον Πειραιά που έγιναν παρέα.',
    card4_title: 'Τζατζίκι σπιτικό',
    card4_desc: 'Φτιάχνεται κάθε πρωί με γιαούρτι, αγγούρι, σκόρδο κι ελαιόλαδο Κρήτης.',
    card5_title: 'Στα κάρβουνα',
    card5_desc: 'Ζωντανή φλόγα, μυρωδιά ψητού. Η σχάρα δουλεύει ασταμάτητα από τις 13:00.',
    card6_title: 'Μπιφτέκι "Τρουμπάκι"',
    card6_desc: 'Χειροποίητο μπιφτέκι με μουστάρδα. Η υπογραφή μας — για όσους ψάχνουν κάτι διαφορετικό.',
    carte_label: 'Ο κατάλογός μας',
    carte_title: 'Αυθεντική γεύση Πειραιά.',
    carte_lead: 'Φρέσκα υλικά κάθε μέρα, τιμές που σε κάνουν να γυρνάς.',
    carte_service_note: 'Ψήσιμο στα κάρβουνα · Φρέσκα υλικά καθημερινά · Καθαρές τιμές, χωρίς έκπληξη',
    carte_download: 'Κατέβασε τον κατάλογο',
    carte_reserver: 'Κράτηση τραπεζιού',
    carte_scan: 'Σκάναρε για τον κατάλογο',
    contact_title: 'Έλα να μας βρεις.',
    contact_lead: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς. Δευτέρα έως Πέμπτη από τις 13:00, Παρασκευή από τις 13:00, Σάββατο από τις 20:00 (Κυριακή κλειστά). Πάρε τηλέφωνο ή παράγγειλε online.',
    contact_email: 'kalamaki.troubas@gmail.com',
    contact_demo: '+30 210 422 2233',
    contact_hours: 'Δευ–Πέμ: 13:00–02:30 · Παρ: 13:00–04:00 · Σαβ: 20:00–05:00 · Κυρ: Κλειστό',
    form_name: 'Το όνομά σου',
    form_guests: 'Άτομα (π.χ. 2)',
    form_confirm: 'Επιβεβαίωση κράτησης',
    footer_brand: 'Το Καλαμάκι Της Τρούμπας',
    footer_demo: '',
    footer_lead: 'Ψητοπωλείο στην καρδιά της Τρούμπας. Αυθεντικά καλαμάκια, γύρος και πίτες — Πειραιάς.',
    footer_restaurant: 'Ψητοπωλείο',
    footer_story: 'Η Ιστορία',
    footer_find: 'Πώς να μας βρεις',
    footer_find_lead: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς 185 35',
    footer_copyright: 'Το Καλαμάκι Της Τρούμπας ·',
    drawer_theme: 'Αλλαγή θέματος',
    drawer_brand: 'Το Καλαμάκι Της Τρούμπας',
    order_cta: 'Παράγγειλε online',
    order_title: 'Παραγγελία online',
    order_subtitle: 'Διάλεξε, πλήρωσε στο μαγαζί, σε λίγα λεπτά είναι έτοιμο.',
    order_cart: 'Το καλάθι σου',
    order_cart_empty: 'Το καλάθι είναι άδειο.',
    order_cart_total: 'Σύνολο',
    order_validate: 'Επιβεβαίωση παραγγελίας',
    order_form_title: 'Τα στοιχεία σου',
    order_form_name: 'Όνομα',
    order_form_phone: 'Τηλέφωνο',
    order_form_pickup: 'Ώρα παραλαβής',
    order_form_pickup_15: 'σε 15 λεπτά',
    order_form_pickup_30: 'σε 30 λεπτά',
    order_form_pickup_45: 'σε 45 λεπτά',
    order_form_pickup_60: 'σε 1 ώρα',
    order_form_submit: 'Επιβεβαίωση',
    order_form_back: '← Πίσω στο μενού',
    order_form_pay_note: 'Πληρωμή στο κατάστημα κατά την παραλαβή.',
    order_success_title: 'Η παραγγελία σου επιβεβαιώθηκε',
    order_success_body: 'Παραγγελία #{ID} — Πρόκειται να σε καλέσουμε σύντομα.',
    order_success_back: '← Επιστροφή στην αρχική',
    order_error: 'Σφάλμα — δοκίμασε ξανά.',
    order_add: 'Προσθήκη',
    order_remove: 'Αφαίρεση',
  },
  en: {
    meta_title: 'Souvlaki Trouba · Online order & delivery · Piraeus | Kalamaki',
    meta_description: 'Kalamaki Tis Troumpas — authentic pita, gyros and souvlaki in the heart of Troumpa Piraeus. Order online, fast delivery in Piraeus, 0% platform fees. 8 Bouboulinas & Notara.',
    nav_home: 'Home',
    nav_ambiance: 'Our Story',
    nav_carte: 'Menu',
    nav_contact: 'Contact',
    nav_reserver: 'Book',
    nav_menu: 'Menu',
    nav_aria_phone: 'Call us',
    voir_carte: 'View menu',
    hero_badge: 'Souvlaki · Gyros · Pita · Troumpa Piraeus',
    hero_title: 'Flavour & Passion',
    hero_lead: 'In Troumpa, on the corner of Bouboulinas & Notara. Fresh meat, homemade sauces and prices that bring you back. This is Piraeus souvlaki at its best.',
    hero_demo_note: '',
    resa_title: 'Contact & Reservations',
    resa_subtitle: 'Book a table or order online.',
    resa_address: 'Bouboulinas 8 & Notara, Piraeus 185 35',
    resa_phone: '+30 210 422 2233',
    resa_hours: 'Mon–Thu: 13:00–02:30 · Fri: 13:00–04:00 · Sat: 20:00–05:00 · Sun: Closed',
    resa_label_address: 'Address',
    resa_label_phone: 'Phone',
    resa_label_hours: 'Opening hours',
    resa_cta1: 'Order online',
    resa_cta2: 'Send a message',
    resa_cta3: 'View menu',
    story_label: 'Our story',
    story_title: 'Years of flavour, Piraeus spirit.',
    story_p1: 'In Troumpa, every evening the smell of the charcoal drifts down to the port. Fresh meat, homemade sauces and pita warmed on the grill — our recipe has never changed.',
    story_p2: 'No secret to it. Just good ingredients, quick hands and the flavour you have always known. Prices that bring you back.',
    blog_label: 'Atmosphere & Food',
    blog_title: 'Moments from Troumpa',
    blog_lead: 'Authentic Piraeus flavours every day. Photos and videos straight from our shop.',
    card1_title: 'Piraeus skewers',
    card1_desc: 'Pork or chicken, char-grilled. A marinade passed down through generations.',
    card2_title: 'Gyros pita wrap',
    card2_desc: 'Gyros with tzatziki, tomato, onion and chips. Fresh pita off the grill every time.',
    card3_title: 'Troumpa atmosphere',
    card3_desc: 'Full tables every night. Locals from across Piraeus who became regulars.',
    card4_title: 'Homemade tzatziki',
    card4_desc: 'Made fresh every morning with yoghurt, cucumber, garlic and Cretan olive oil.',
    card5_title: 'Over the coals',
    card5_desc: 'Open flame and the smell of grilling meat. Our charcoal grill runs non-stop from 13:00 (Sat from 20:00).',
    card6_title: 'Greek burger "Troubaki"',
    card6_desc: 'Hand-pressed Greek-style burger with mustard. Our signature, for something a bit different.',
    carte_label: 'Our menu',
    carte_title: 'Authentic Piraeus flavour.',
    carte_lead: 'Fresh ingredients every day, prices that bring you back.',
    carte_service_note: 'Charcoal grilled · Fresh ingredients daily · No hidden charges',
    carte_download: 'Download the menu',
    carte_reserver: 'Book a table',
    carte_scan: 'Scan to open the menu',
    contact_title: 'Come and find us.',
    contact_lead: 'Bouboulinas 8 & Notara, Piraeus. Mon–Thu from 13:00, Fri from 13:00, Sat from 20:00 (Sun closed). Give us a ring or order online.',
    contact_email: 'kalamaki.troubas@gmail.com',
    contact_demo: '+30 210 422 2233',
    contact_hours: 'Mon–Thu: 13:00–02:30 · Fri: 13:00–04:00 · Sat: 20:00–05:00 · Sun: Closed',
    form_name: 'Your name',
    form_guests: 'Guests (e.g. 2)',
    form_confirm: 'Confirm reservation',
    footer_brand: 'Το Καλαμάκι Της Τρούμπας',
    footer_demo: '',
    footer_lead: 'Traditional souvlaki shop in the heart of Troumpa. Authentic skewers, gyros and pita wraps — Piraeus.',
    footer_restaurant: 'Restaurant',
    footer_story: 'Our story',
    footer_find: 'Find us',
    footer_find_lead: 'Bouboulinas 8 & Notara, Piraeus 185 35',
    footer_copyright: 'To Kalamaki Tis Troumpas ·',
    drawer_theme: 'Change theme',
    drawer_brand: 'To Kalamaki Tis Troumpas',
    order_cta: 'Order online',
    order_title: 'Order online',
    order_subtitle: 'Pick what you like, pay at the counter, collect it in minutes.',
    order_cart: 'Your cart',
    order_cart_empty: 'Cart is empty.',
    order_cart_total: 'Total',
    order_validate: 'Confirm order',
    order_form_title: 'Your details',
    order_form_name: 'Name',
    order_form_phone: 'Phone',
    order_form_pickup: 'Pickup time',
    order_form_pickup_15: 'in 15 min',
    order_form_pickup_30: 'in 30 min',
    order_form_pickup_45: 'in 45 min',
    order_form_pickup_60: 'in 1 hour',
    order_form_submit: 'Confirm',
    order_form_back: '← Back to menu',
    order_form_pay_note: 'Pay at the counter when you collect your order.',
    order_success_title: 'Order confirmed',
    order_success_body: 'Order #{ID} — We will call you shortly.',
    order_success_back: '← Back to home',
    order_error: 'Error — please try again.',
    order_add: 'Add',
    order_remove: 'Remove',
  },
};

export function getMenu(lang: Lang): MenuSection[] {
  const menus: Record<Lang, MenuSection[]> = {
    el: [
      { category: 'Ορεκτικά', items: [
        { name: 'Τζατζίκι σπιτικό', price: '2.50€', desc: 'Γιαούρτι, αγγούρι, σκόρδο, ελαιόλαδο Κρήτης.' },
        { name: 'Τυροκαυτερή', price: '2.50€', desc: 'Φέτα, πιπεριές Φλωρίνης, ελαιόλαδο.' },
        { name: 'Χωριάτικη σαλάτα', price: '4.50€', desc: 'Ντομάτα, αγγούρι, ελιές, κρεμμύδι, φέτα.' },
        { name: 'Κολοκυθοκεφτέδες', price: '3.50€', desc: 'Σπιτικοί, τηγανητοί, με σάλτσα γιαουρτιού.' },
      ]},
      { category: 'Καλαμάκια & Πίτες', items: [
        { name: 'Καλαμάκι χοιρινό (1 σούβλα)', price: '1.80€', desc: 'Ψητό στα κάρβουνα, μαρινάδα της ώρας.' },
        { name: 'Καλαμάκι κοτόπουλο (1 σούβλα)', price: '1.80€', desc: 'Μπούτι κοτόπουλο, μαριναρισμένο.' },
        { name: 'Πίτα χοιρινή', price: '1.90€', desc: 'Καλαμάκι, τζατζίκι, ντομάτα, κρεμμύδι, πατάτες.' },
        { name: 'Πίτα κοτόπουλο', price: '1.90€', desc: 'Καλαμάκι κοτόπουλο, σάλτσα της επιλογής σου.' },
        { name: 'Πίτα μπιφτέκι "Τρουμπάκι"', price: '3.50€', desc: 'Χειροποίητο μπιφτέκι, μουστάρδα, ντομάτα.' },
      ]},
      { category: 'Μερίδες', items: [
        { name: 'Μερίδα χοιρινή', price: '7.50€', desc: '3 καλαμάκια χοιρινά, πίτα, πατάτες, τζατζίκι.' },
        { name: 'Μερίδα κοτόπουλο', price: '7.50€', desc: '3 καλαμάκια κοτόπουλο, πίτα, πατάτες, σαλάτα.' },
        { name: 'Μερίδα μικτή', price: '8.50€', desc: 'Χοιρινό & κοτόπουλο, πίτα, πατάτες.' },
        { name: 'Τηγανητές πατάτες', price: '2.50€', desc: 'Τραγανές, σπιτικές.' },
      ]},
      { category: 'Γλυκά & Ποτά', items: [
        { name: 'Μπακλαβάς σπιτικός', price: '2.00€', desc: 'Με μέλι και ξηρούς καρπούς.' },
        { name: 'Λεμονάδα σπιτική', price: '2.00€', desc: 'Φρέσκια, φτιάχνεται κάθε μέρα.' },
        { name: 'Μπύρα (Fix / Μύθος / Άλφα)', price: '2.50€', desc: 'Παγωμένη.' },
        { name: 'Κρασί χύμα', price: '3.00€', desc: 'Λευκό ή κόκκινο, ανά καράφα.' },
      ]},
    ],
    en: [
      { category: 'Starters', items: [
        { name: 'Homemade tzatziki', price: '2.50€', desc: 'Yoghurt, cucumber, garlic, Cretan olive oil.' },
        { name: 'Tyrokafteri (spicy feta dip)', price: '2.50€', desc: 'Feta, Florina peppers, olive oil.' },
        { name: 'Greek salad', price: '4.50€', desc: 'Tomato, cucumber, olives, onion, feta.' },
        { name: 'Courgette fritters', price: '3.50€', desc: 'Homemade, lightly fried, with yoghurt dip.' },
      ]},
      { category: 'Skewers & pita wraps', items: [
        { name: 'Pork kalamaki (1 skewer)', price: '1.80€', desc: 'Char-grilled, fresh marinade.' },
        { name: 'Chicken kalamaki (1 skewer)', price: '1.80€', desc: 'Marinated chicken thigh.' },
        { name: 'Pork pita wrap', price: '1.90€', desc: 'Skewer, tzatziki, tomato, onion, chips.' },
        { name: 'Chicken pita wrap', price: '1.90€', desc: 'Chicken skewer, sauce of your choice.' },
        { name: 'Greek burger pita "Troubaki"', price: '3.50€', desc: 'Hand-pressed Greek burger, mustard, tomato.' },
      ]},
      { category: 'Plates', items: [
        { name: 'Pork plate', price: '7.50€', desc: '3 pork skewers, pita, chips, tzatziki.' },
        { name: 'Chicken plate', price: '7.50€', desc: '3 chicken skewers, pita, chips, salad.' },
        { name: 'Mixed plate', price: '8.50€', desc: 'Pork & chicken skewers, pita, chips.' },
        { name: 'Chips', price: '2.50€', desc: 'Crispy, homemade.' },
      ]},
      { category: 'Sweets & Drinks', items: [
        { name: 'Homemade baklava', price: '2.00€', desc: 'With honey and mixed nuts.' },
        { name: 'Homemade lemonade', price: '2.00€', desc: 'Fresh, made daily.' },
        { name: 'Beer (Fix / Mythos / Alfa)', price: '2.50€', desc: 'Ice cold.' },
        { name: 'House wine', price: '3.00€', desc: 'White or red, per carafe.' },
      ]},
    ],
  };
  return menus[lang];
}

export const translations = ui;
