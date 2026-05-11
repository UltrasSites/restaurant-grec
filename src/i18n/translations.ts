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
};

const ui: Record<Lang, RestaurantTranslations> = {
  el: {
    meta_title: 'Το Καλαμάκι Της Τρούμπας – Αυθεντικά Σουβλάκια Πειραιάς',
    meta_description: 'Αυθεντικά καλαμάκια, γύρος και πίτες στην καρδιά της Τρούμπας Πειραιά. Μπουμπουλίνας 8 & Νοταρά. Δευ–Πέμ 11:00–03:00 · Παρ–Σαβ 11:00–06:00.',
    nav_home: 'Αρχική',
    nav_ambiance: 'Ιστορία',
    nav_carte: 'Κατάλογος',
    nav_contact: 'Επικοινωνία',
    nav_reserver: 'Κράτηση',
    nav_menu: 'Μενού',
    nav_aria_phone: 'Τηλέφωνο',
    voir_carte: 'Δες τον κατάλογο',
    hero_badge: 'Σουβλάκι · Γύρος · Πίτα · Τρούμπα Πειραιά',
    hero_title: 'Γεύση & Μεράκι.',
    hero_lead: 'Στη Τρούμπα, στη γωνία Μπουμπουλίνας & Νοταρά. Φρέσκα κρέατα, σπιτικές σάλτσες και τιμές που δεν πιστεύεις. Αυτό είναι το καλαμάκι του Πειραιά.',
    hero_demo_note: 'Παράδειγμα ιστοσελίδας · ultras-sites.com',
    resa_title: 'Επικοινωνία & Κράτηση',
    resa_subtitle: 'Κλείσε τραπέζι ή κάνε παραγγελία.',
    resa_address: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς 185 35',
    resa_phone: '+30 210 422 2233',
    resa_hours: 'Δευ–Πέμ: 11:00–03:00 · Παρ–Σαβ: 11:00–06:00 · Κυρ: Κλειστό',
    resa_label_address: 'Διεύθυνση',
    resa_label_phone: 'Τηλέφωνο',
    resa_label_hours: 'Ώρες λειτουργίας',
    resa_cta1: 'Παραγγελία online',
    resa_cta2: 'Στείλε μήνυμα',
    resa_cta3: 'Δες τον κατάλογο',
    story_label: 'Η ιστορία μας',
    story_title: 'Χρόνια γεύση, αθηναϊκό μεράκι.',
    story_p1: 'Στη Τρούμπα, κάθε βράδυ η μυρωδιά των κάρβουνων φτάνει μέχρι το λιμάνι. Φρέσκα κρέατα, σπιτικές σάλτσες και πίτα ψημένη τη στιγμή — η συνταγή μας δεν άλλαξε ποτέ.',
    story_p2: 'Δεν υπάρχει μυστικό. Μόνο καλά υλικά, γρήγορο χέρι και η γεύση που ξέρεις από πάντα. Τιμές που δεν πιστεύεις.',
    blog_label: 'Ατμόσφαιρα & Γεύσεις',
    blog_title: 'Στιγμές από την Τρούμπα',
    blog_lead: 'Αυθεντικές γεύσεις Πειραιά κάθε μέρα. Στη δική σου σελίδα: τα δικά σου φωτογραφίες και βίντεο.',
    card1_title: 'Καλαμάκι Πειραιώτικο',
    card1_desc: 'Χοιρινό ή κοτόπουλο ψητό στα κάρβουνα. Μαρινάδα που μαθεύτηκε από γενιά σε γενιά.',
    card2_title: 'Πίτα Γύρος',
    card2_desc: 'Γύρος με τζατζίκι, τομάτα, κρεμμύδι, τηγανητές πατάτες. Πίτα φρέσκια κάθε φορά.',
    card3_title: 'Ατμόσφαιρα Τρούμπας',
    card3_desc: 'Γεμάτα τραπέζια κάθε βράδυ. Πελάτες από όλο τον Πειραιά που έγιναν παρέα.',
    card4_title: 'Τζατζίκι Σπιτικό',
    card4_desc: 'Φτιαγμένο κάθε πρωί με γιαούρτι, αγγούρι, σκόρδο και ελαιόλαδο Κρήτης.',
    card5_title: 'Γκρίλ & Κάρβουνο',
    card5_desc: 'Η ζωντανή φλόγα, το άρωμα του ψητού. Σχάρα που δουλεύει ακατάπαυστα από τις 11:00.',
    card6_title: 'Μπιφτέκι "Τρουμπάκι"',
    card6_desc: 'Χειροποίητο μπιφτέκι με μουστάρδα. Η υπογραφή μας για όσους θέλουν κάτι διαφορετικό.',
    carte_label: 'Ο κατάλογός μας',
    carte_title: 'Αυθεντική Γεύση Πειραιά.',
    carte_lead: 'Φρέσκα υλικά κάθε μέρα, τιμές που σε κάνουν να γυρνάς.',
    carte_service_note: 'Ψήσιμο στα κάρβουνα · Φρέσκα υλικά καθημερινά · Τιμές χωρίς έκπληξη',
    carte_download: 'Κατέβασε τον κατάλογο',
    carte_reserver: 'Κράτηση τραπεζιού',
    carte_scan: 'Σκανάρισε για τον κατάλογο',
    contact_title: 'Έλα να μας βρεις.',
    contact_lead: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς. Είμαστε ανοιχτά από τις 11:00 κάθε μέρα εκτός Κυριακής. Κάλεσε ή παράγγειλε online.',
    contact_email: 'kalamaki.troubas@gmail.com',
    contact_demo: '+30 210 422 2233',
    contact_hours: 'Δευ–Πέμ: 11:00–03:00 · Παρ–Σαβ: 11:00–06:00 · Κυρ: Κλειστό',
    form_name: 'Το όνομά σου',
    form_guests: 'Άτομα (π.χ. 2)',
    form_confirm: 'Επιβεβαίωση κράτησης',
    footer_brand: 'Το Καλαμάκι',
    footer_demo: 'Παράδειγμα · ultras-sites.com',
    footer_lead: 'Ψητοπωλείο στην καρδιά της Τρούμπας. Αυθεντικά σουβλάκια, γύρος και πίτες — Πειραιάς.',
    footer_restaurant: 'Ψητοπωλείο',
    footer_story: 'Η Ιστορία',
    footer_find: 'Πώς να μας βρεις',
    footer_find_lead: 'Μπουμπουλίνας 8 & Νοταρά, Πειραιάς 185 35',
    footer_copyright: 'Το Καλαμάκι Της Τρούμπας ·',
    drawer_theme: 'Αλλαγή θέματος',
    drawer_brand: 'Το Καλαμάκι Της Τρούμπας',
  },
  en: {
    meta_title: 'To Kalamaki Tis Troumpas – Authentic Greek Souvlaki Piraeus',
    meta_description: 'Authentic souvlaki, gyros and pita in the heart of Troumpa, Piraeus. Bouboulinas 8 & Notara. Mon–Thu 11:00–03:00 · Fri–Sat 11:00–06:00.',
    nav_home: 'Home',
    nav_ambiance: 'Our Story',
    nav_carte: 'Menu',
    nav_contact: 'Contact',
    nav_reserver: 'Book',
    nav_menu: 'Menu',
    nav_aria_phone: 'Call us',
    voir_carte: 'View menu',
    hero_badge: 'Souvlaki · Gyros · Pita · Troumpa Piraeus',
    hero_title: 'Flavour & Passion.',
    hero_lead: 'In Troumpa, at the corner of Bouboulinas & Notara. Fresh meat, homemade sauces and prices you won\'t believe. This is Piraeus souvlaki at its best.',
    hero_demo_note: 'Demo site template · ultras-sites.com',
    resa_title: 'Contact & Reservations',
    resa_subtitle: 'Book a table or order online.',
    resa_address: 'Bouboulinas 8 & Notara, Piraeus 185 35',
    resa_phone: '+30 210 422 2233',
    resa_hours: 'Mon–Thu: 11:00–03:00 · Fri–Sat: 11:00–06:00 · Sun: Closed',
    resa_label_address: 'Address',
    resa_label_phone: 'Phone',
    resa_label_hours: 'Opening hours',
    resa_cta1: 'Order online',
    resa_cta2: 'Send a message',
    resa_cta3: 'View menu',
    story_label: 'Our story',
    story_title: 'Decades of flavour, Athenian spirit.',
    story_p1: 'In Troumpa, every evening the scent of charcoal drifts all the way to the port. Fresh meat, homemade sauces and pita baked to order — our recipe has never changed.',
    story_p2: 'No secret here. Just good ingredients, a quick hand and the flavour you have always known. Prices that make you come back.',
    blog_label: 'Atmosphere & Food',
    blog_title: 'Moments from Troumpa',
    blog_lead: 'Authentic Piraeus flavours every day. On your site: your own photos and videos.',
    card1_title: 'Piraeus Souvlaki',
    card1_desc: 'Pork or chicken charcoal-grilled. A marinade passed down through generations.',
    card2_title: 'Gyros in Pita',
    card2_desc: 'Gyros with tzatziki, tomato, onion, and fries. Fresh-baked pita every time.',
    card3_title: 'Troumpa Atmosphere',
    card3_desc: 'Tables full every evening. Customers from all over Piraeus who became regulars.',
    card4_title: 'Homemade Tzatziki',
    card4_desc: 'Made fresh each morning with yoghurt, cucumber, garlic and Cretan olive oil.',
    card5_title: 'Grill & Charcoal',
    card5_desc: 'Live flame, the scent of char. Our grill runs non-stop from 11:00 every day.',
    card6_title: 'Burger "Troubaki"',
    card6_desc: 'Handmade burger with mustard. Our signature for those who want something different.',
    carte_label: 'Our menu',
    carte_title: 'Authentic Piraeus Flavour.',
    carte_lead: 'Fresh ingredients every day, prices that bring you back.',
    carte_service_note: 'Charcoal grilled · Fresh ingredients daily · No hidden charges',
    carte_download: 'Download menu',
    carte_reserver: 'Book a table',
    carte_scan: 'Scan to open the menu',
    contact_title: 'Come find us.',
    contact_lead: 'Bouboulinas 8 & Notara, Piraeus. Open from 11:00 every day except Sunday. Call or order online.',
    contact_email: 'kalamaki.troubas@gmail.com',
    contact_demo: '+30 210 422 2233',
    contact_hours: 'Mon–Thu: 11:00–03:00 · Fri–Sat: 11:00–06:00 · Sun: Closed',
    form_name: 'Your name',
    form_guests: 'Guests (e.g. 2)',
    form_confirm: 'Confirm reservation',
    footer_brand: 'To Kalamaki',
    footer_demo: 'Demo · ultras-sites.com',
    footer_lead: 'Souvlaki restaurant in the heart of Troumpa. Authentic skewers, gyros and pitas — Piraeus.',
    footer_restaurant: 'Restaurant',
    footer_story: 'Our story',
    footer_find: 'Find us',
    footer_find_lead: 'Bouboulinas 8 & Notara, Piraeus 185 35',
    footer_copyright: 'To Kalamaki Tis Troumpas ·',
    drawer_theme: 'Change theme',
    drawer_brand: 'To Kalamaki Tis Troumpas',
  },
};

export function getMenu(lang: Lang): MenuSection[] {
  const menus: Record<Lang, MenuSection[]> = {
    el: [
      { category: 'Ορεκτικά', items: [
        { name: 'Τζατζίκι σπιτικό', price: '2.50€', desc: 'Γιαούρτι, αγγούρι, σκόρδο, ελαιόλαδο Κρήτης.' },
        { name: 'Τυροκαυτερή', price: '2.50€', desc: 'Φέτα, πιπεριές φλωρίνης, ελαιόλαδο.' },
        { name: 'Χωριάτικη σαλάτα', price: '4.50€', desc: 'Τομάτα, αγγούρι, ελιές, κρεμμύδι, φέτα.' },
        { name: 'Κολοκυθοκεφτέδες', price: '3.50€', desc: 'Σπιτικοί, τηγανητοί, με σάλτσα γιαουρτιού.' },
      ]},
      { category: 'Σούβλες & Πίτες', items: [
        { name: 'Καλαμάκι χοιρινό (1 σούβλα)', price: '1.80€', desc: 'Ψητό στα κάρβουνα, μαρινάδα της ώρας.' },
        { name: 'Καλαμάκι κοτόπουλο (1 σούβλα)', price: '1.80€', desc: 'Μηρός κοτόπουλου, μαριναρισμένος.' },
        { name: 'Πίτα χοιρινό', price: '1.90€', desc: 'Σούβλα, τζατζίκι, τομάτα, κρεμμύδι, πατάτες.' },
        { name: 'Πίτα κοτόπουλο', price: '1.90€', desc: 'Σούβλα κοτόπουλου, σάλτσα αρεσκείας σου.' },
        { name: 'Πίτα μπιφτέκι "Τρουμπάκι"', price: '3.50€', desc: 'Χειροποίητο μπιφτέκι, μουστάρδα, τομάτα.' },
      ]},
      { category: 'Πιάτα', items: [
        { name: 'Πλατέ χοιρινό', price: '7.50€', desc: '3 σούβλες χοιρινές, πίτα, πατάτες, τζατζίκι.' },
        { name: 'Πλατέ κοτόπουλο', price: '7.50€', desc: '3 σούβλες κοτόπουλου, πίτα, πατάτες, σαλάτα.' },
        { name: 'Πλατέ μικτό', price: '8.50€', desc: 'Χοιρινό & κοτόπουλο, πίτα, πατάτες.' },
        { name: 'Τηγανητές πατάτες', price: '2.50€', desc: 'Τραγανές, σπιτικές.' },
      ]},
      { category: 'Γλυκά & Ποτά', items: [
        { name: 'Μπακλαβάς σπιτικός', price: '2.00€', desc: 'Με μέλι και ξηρούς καρπούς.' },
        { name: 'Σπιτική λεμονάδα', price: '2.00€', desc: 'Φρέσκια, ετοιμάζεται καθημερινά.' },
        { name: 'Μπύρα (Fix / Mythos / Alfa)', price: '2.50€', desc: 'Παγωμένη.' },
        { name: 'Κρασί χύμα', price: '3.00€', desc: 'Λευκό ή κόκκινο, ανά καράφα.' },
      ]},
    ],
    en: [
      { category: 'Starters', items: [
        { name: 'Homemade tzatziki', price: '2.50€', desc: 'Yoghurt, cucumber, garlic, Cretan olive oil.' },
        { name: 'Spicy cheese dip (tyrokafteri)', price: '2.50€', desc: 'Feta, Florina peppers, olive oil.' },
        { name: 'Greek salad', price: '4.50€', desc: 'Tomato, cucumber, olives, onion, feta.' },
        { name: 'Courgette fritters', price: '3.50€', desc: 'Homemade, fried, with yoghurt dip.' },
      ]},
      { category: 'Skewers & Pitas', items: [
        { name: 'Pork kalamaki (1 skewer)', price: '1.80€', desc: 'Charcoal grilled, fresh-made marinade.' },
        { name: 'Chicken kalamaki (1 skewer)', price: '1.80€', desc: 'Thigh meat, marinated.' },
        { name: 'Pork pita', price: '1.90€', desc: 'Skewer, tzatziki, tomato, onion, fries.' },
        { name: 'Chicken pita', price: '1.90€', desc: 'Chicken skewer, sauce of your choice.' },
        { name: 'Burger pita "Troubaki"', price: '3.50€', desc: 'Handmade burger, mustard, tomato.' },
      ]},
      { category: 'Plates', items: [
        { name: 'Pork plate', price: '7.50€', desc: '3 pork skewers, pita, fries, tzatziki.' },
        { name: 'Chicken plate', price: '7.50€', desc: '3 chicken skewers, pita, fries, salad.' },
        { name: 'Mixed plate', price: '8.50€', desc: 'Pork & chicken skewers, pita, fries.' },
        { name: 'Fries', price: '2.50€', desc: 'Crispy, homemade.' },
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
