// Menu data for Kalamaki Troubas — 6 languages
// Greek dish names are KEPT in Greek (gastronomic identity)
// Only section titles + ingredient descriptions are translated.

export const LANGS = ["zh", "el", "fr", "pt", "it", "es"];

export const LANG_LABELS = {
  zh: "中文",
  el: "Ελληνικά",
  fr: "Français",
  pt: "Português",
  it: "Italiano",
  es: "Español",
};

export const LANG_FLAGS = {
  zh: "🇨🇳",
  el: "🇬🇷",
  fr: "🇫🇷",
  pt: "🇵🇹",
  it: "🇮🇹",
  es: "🇪🇸",
};

export const RESTAURANT = {
  name_el: "Το Καλαμάκι Της Τρούμπας",
  name_translit: "To Kalamaki Tis Troumpas",
  address: "Μπουμπουλίνας 8 & Νοταρά — Πειραιάς",
  address_translit: "Bouboulinas 8 & Notara — Piraeus",
  phone: "+30 210 422 2233",
  email: "kalamaki.troubas@gmail.com",
  hours: {
    zh: "周一至周四 11:00–03:00 · 周五至周六 11:00–06:00 · 周日休息",
    el: "Δευ–Πέμ 11:00–03:00 · Παρ–Σαβ 11:00–06:00 · Κυρ Κλειστό",
    fr: "Lun–Jeu 11:00–03:00 · Ven–Sam 11:00–06:00 · Dim Fermé",
    pt: "Seg–Qui 11:00–03:00 · Sex–Sáb 11:00–06:00 · Dom Fechado",
    it: "Lun–Gio 11:00–03:00 · Ven–Sab 11:00–06:00 · Dom Chiuso",
    es: "Lun–Jue 11:00–03:00 · Vie–Sáb 11:00–06:00 · Dom Cerrado",
  },
  tagline: {
    zh: "比雷埃夫斯港的传统希腊烤串",
    el: "Αυθεντική Γεύση Πειραιά",
    fr: "Saveurs Authentiques du Pirée",
    pt: "Sabores Autênticos do Pireu",
    it: "Sapori Autentici del Pireo",
    es: "Sabores Auténticos del Pireo",
  },
  menu_title: {
    zh: "我们的菜单",
    el: "Ο Κατάλογός Μας",
    fr: "Notre Carte",
    pt: "O Nosso Cardápio",
    it: "Il Nostro Menu",
    es: "Nuestra Carta",
  },
  footer_scan: {
    zh: "扫描二维码 · 在线查看菜单",
    el: "Σκανάρετε το QR · Δείτε τον κατάλογο online",
    fr: "Scannez le QR · Voir la carte en ligne",
    pt: "Escaneie o QR · Ver o menu online",
    it: "Scansiona il QR · Vedi il menu online",
    es: "Escanea el QR · Ver la carta online",
  },
};

// Section titles per language
const SECTIONS = {
  drinks:        { zh: "饮料",       el: "Ποτά",                 fr: "Boissons",              pt: "Bebidas",                  it: "Bevande",                 es: "Bebidas" },
  appetizers1:   { zh: "开胃菜 I",   el: "Ορεκτικά Ι",           fr: "Entrées I",             pt: "Entradas I",               it: "Antipasti I",             es: "Entrantes I" },
  appetizers2:   { zh: "开胃菜 II",  el: "Ορεκτικά ΙΙ",          fr: "Entrées II",            pt: "Entradas II",              it: "Antipasti II",            es: "Entrantes II" },
  salads:        { zh: "沙拉",       el: "Σαλάτες",              fr: "Salades",               pt: "Saladas",                  it: "Insalate",                es: "Ensaladas" },
  pita1:         { zh: "卷饼 I",     el: "Πίτες τυλιχτές",       fr: "Pitas Roulées",         pt: "Pitas Enroladas",          it: "Pita Arrotolate",         es: "Pitas Enrolladas" },
  pita2:         { zh: "卷饼 II",    el: "Πίτες τυλιχτές ΙΙ",    fr: "Pitas Roulées II",      pt: "Pitas Enroladas II",       it: "Pita Arrotolate II",      es: "Pitas Enrolladas II" },
  port_skew:     { zh: "份量 — 烤串", el: "Μερίδες — Καλαμάκια", fr: "Portions — Brochettes", pt: "Porções — Espetinhos",     it: "Porzioni — Spiedini",     es: "Raciones — Brochetas" },
  port_special:  { zh: "份量 — 特色", el: "Μερίδες — Σπεσιαλιτέ", fr: "Portions — Spécialités", pt: "Porções — Especialidades", it: "Porzioni — Specialità", es: "Raciones — Especiales" },
  port_pork:     { zh: "份量 — 猪肉", el: "Μερίδες — Χοιρινά",    fr: "Portions — Porc",       pt: "Porções — Porco",          it: "Porzioni — Maiale",       es: "Raciones — Cerdo" },
  burger:        { zh: "汉堡",       el: "Χάμπουργκερ",          fr: "Hamburger",             pt: "Hambúrguer",               it: "Hamburger",               es: "Hamburguesa" },
  veggie:        { zh: "素食菜单",   el: "Veggie Menu",          fr: "Menu Végétarien",       pt: "Menu Vegetariano",         it: "Menu Vegetariano",        es: "Menú Vegetariano" },
  sandwich:      { zh: "三明治 & 卷饼 Skepasti", el: "Σάντουιτς & Σκεπαστή", fr: "Sandwich & Skepasti", pt: "Sanduíche & Skepasti", it: "Sandwich & Skepasti", es: "Sándwich & Skepasti" },
};

// Description translations dictionary (descriptions reused across items)
const D = (en) => {
  const map = {
    // Ingredients
    "tomato, onion, tzatziki, fries": {
      zh: "番茄、洋葱、酸奶黄瓜酱、薯条",
      fr: "tomate, oignon, tzatziki, frites",
      pt: "tomate, cebola, tzatziki, batatas fritas",
      it: "pomodoro, cipolla, tzatziki, patatine",
      es: "tomate, cebolla, tzatziki, papas fritas",
    },
    "tomato, lettuce, sauce, fries": {
      zh: "番茄、生菜、酱汁、薯条",
      fr: "tomate, salade, sauce, frites",
      pt: "tomate, alface, molho, batatas fritas",
      it: "pomodoro, lattuga, salsa, patatine",
      es: "tomate, lechuga, salsa, papas fritas",
    },
    "tomato, mustard, fries": {
      zh: "番茄、芥末、薯条",
      fr: "tomate, moutarde, frites",
      pt: "tomate, mostarda, batatas fritas",
      it: "pomodoro, senape, patatine",
      es: "tomate, mostaza, papas fritas",
    },
    "tomato, onion, mustard, fries": {
      zh: "番茄、洋葱、芥末、薯条",
      fr: "tomate, oignon, moutarde, frites",
      pt: "tomate, cebola, mostarda, batatas fritas",
      it: "pomodoro, cipolla, senape, patatine",
      es: "tomate, cebolla, mostaza, papas fritas",
    },
    "tomato, lettuce, fries": {
      zh: "番茄、生菜、薯条",
      fr: "tomate, salade, frites",
      pt: "tomate, alface, batatas fritas",
      it: "pomodoro, lattuga, patatine",
      es: "tomate, lechuga, papas fritas",
    },
    "tomato, onion, lettuce, fries": {
      zh: "番茄、洋葱、生菜、薯条",
      fr: "tomate, oignon, salade, frites",
      pt: "tomate, cebola, alface, batatas fritas",
      it: "pomodoro, cipolla, lattuga, patatine",
      es: "tomate, cebolla, lechuga, papas fritas",
    },
    "lettuce, cabbage, tomato, cucumber, onion, peppers, olives, capers & mustard sauce": {
      zh: "生菜、卷心菜、番茄、黄瓜、洋葱、辣椒、橄榄、刺山柑及芥末酱",
      fr: "salade, chou, tomate, concombre, oignon, poivrons, olives, câpres & sauce moutarde",
      pt: "alface, repolho, tomate, pepino, cebola, pimentos, azeitonas, alcaparras & molho de mostarda",
      it: "lattuga, cavolo, pomodoro, cetriolo, cipolla, peperoni, olive, capperi & salsa di senape",
      es: "lechuga, repollo, tomate, pepino, cebolla, pimientos, aceitunas, alcaparras y salsa de mostaza",
    },
    "lettuce, fresh onion, dill": {
      zh: "生菜、鲜洋葱、莳萝",
      fr: "salade, oignon frais, aneth",
      pt: "alface, cebola fresca, endro",
      it: "lattuga, cipolla fresca, aneto",
      es: "lechuga, cebolla fresca, eneldo",
    },
    "beef burger, cheddar cheese, lettuce, tomato, onion": {
      zh: "牛肉饼、切达奶酪、生菜、番茄、洋葱",
      fr: "steak haché de boeuf, cheddar, salade, tomate, oignon",
      pt: "hambúrguer de vaca, queijo cheddar, alface, tomate, cebola",
      it: "hamburger di manzo, formaggio cheddar, lattuga, pomodoro, cipolla",
      es: "hamburguesa de ternera, queso cheddar, lechuga, tomate, cebolla",
    },
    "tomato, lettuce, vegan cheese, ketchup, mustard, fries": {
      zh: "番茄、生菜、素奶酪、番茄酱、芥末、薯条",
      fr: "tomate, salade, fromage végan, ketchup, moutarde, frites",
      pt: "tomate, alface, queijo vegan, ketchup, mostarda, batatas fritas",
      it: "pomodoro, lattuga, formaggio vegano, ketchup, senape, patatine",
      es: "tomate, lechuga, queso vegano, ketchup, mostaza, papas fritas",
    },
    "plant-based meat-like protein": {
      zh: "植物蛋白(肉类替代品)",
      fr: "protéine végétale similaire à la viande",
      pt: "proteína vegetal semelhante à carne",
      it: "proteina vegetale simile alla carne",
      es: "proteína vegetal similar a la carne",
    },
    "tomato, lettuce, sauce, fries & gouda cheese": {
      zh: "番茄、生菜、酱汁、薯条和高达奶酪",
      fr: "tomate, salade, sauce, frites & fromage gouda",
      pt: "tomate, alface, molho, batatas fritas & queijo gouda",
      it: "pomodoro, lattuga, salsa, patatine & formaggio gouda",
      es: "tomate, lechuga, salsa, papas fritas y queso gouda",
    },
    // Notes
    "4 pcs — served with tomato, onion, tzatziki, fries, 2 pita": {
      zh: "4 串 — 配番茄、洋葱、酸奶黄瓜酱、薯条、2 片皮塔饼",
      fr: "4 pcs — servi avec tomate, oignon, tzatziki, frites, 2 pitas",
      pt: "4 pcs — servido com tomate, cebola, tzatziki, batatas fritas, 2 pitas",
      it: "4 pz — servito con pomodoro, cipolla, tzatziki, patatine, 2 pita",
      es: "4 pzs — servido con tomate, cebolla, tzatziki, papas fritas, 2 pitas",
    },
    "Served with fries, pita, salad/sauce": {
      zh: "配薯条、皮塔饼、沙拉/酱汁",
      fr: "Servi avec frites, pita, salade/sauce",
      pt: "Servido com batatas fritas, pita, salada/molho",
      it: "Servito con patatine, pita, insalata/salsa",
      es: "Servido con papas fritas, pita, ensalada/salsa",
    },
    "Served with tomato, onion, tzatziki, fries, 2 pita": {
      zh: "配番茄、洋葱、酸奶黄瓜酱、薯条、2 片皮塔饼",
      fr: "Servi avec tomate, oignon, tzatziki, frites, 2 pitas",
      pt: "Servido com tomate, cebola, tzatziki, batatas fritas, 2 pitas",
      it: "Servito con pomodoro, cipolla, tzatziki, patatine, 2 pita",
      es: "Servido con tomate, cebolla, tzatziki, papas fritas, 2 pitas",
    },
  };
  const v = map[en];
  if (!v) return { zh: en, fr: en, pt: en, it: en, es: en };
  return { ...v, el: null, en };
};

// Item label translations — keep Greek dish names, translate generic labels only
const itemName = (el, en, others = {}) => ({
  zh: others.zh || en,
  el: el,
  fr: others.fr || en,
  pt: others.pt || en,
  it: others.it || en,
  es: others.es || en,
});

// Helper: dish stays in original Greek for all
const greek = (el, en) => ({ zh: el, el: el, fr: el, pt: el, it: el, es: el, en: en });

// Generic translatable items (drinks etc.)
export const PAGES = [
  {
    title: SECTIONS.drinks,
    items: [
      { name: itemName("Αναψυκτικά 330ml", "Soft drinks 330ml", { zh: "软饮 330ml", fr: "Soda 330ml", pt: "Refrigerantes 330ml", it: "Bibite 330ml", es: "Refrescos 330ml" }), price: "1,60€" },
      { name: itemName("Αναψυκτικά 500ml", "Soft drinks 500ml", { zh: "软饮 500ml", fr: "Soda 500ml", pt: "Refrigerantes 500ml", it: "Bibite 500ml", es: "Refrescos 500ml" }), price: "1,60€" },
      { name: itemName("Αναψυκτικά 1.5L",  "Soft drinks 1.5L",  { zh: "软饮 1.5L",  fr: "Soda 1.5L",  pt: "Refrigerantes 1.5L",  it: "Bibite 1.5L",  es: "Refrescos 1.5L" }),  price: "2,50€" },
      { name: itemName("Νερό 500ml",       "Mineral Water 500ml", { zh: "矿泉水 500ml", fr: "Eau minérale 500ml", pt: "Água mineral 500ml", it: "Acqua minerale 500ml", es: "Agua mineral 500ml" }), price: "0,50€" },
      { name: itemName("Νερό 1L",          "Mineral Water 1L",    { zh: "矿泉水 1L",    fr: "Eau minérale 1L",    pt: "Água mineral 1L",    it: "Acqua minerale 1L",    es: "Agua mineral 1L" }),    price: "1,00€" },
      { name: itemName("Κρασί 500ml",      "Wine 500ml",          { zh: "葡萄酒 500ml", fr: "Vin 500ml",          pt: "Vinho 500ml",        it: "Vino 500ml",            es: "Vino 500ml" }),         price: "3,00€" },
      { name: itemName("Κρασί 1L",         "Wine 1L",             { zh: "葡萄酒 1L",    fr: "Vin 1L",             pt: "Vinho 1L",           it: "Vino 1L",               es: "Vino 1L" }),            price: "6,00€" },
      { name: greek("Amstel 330ml / 500ml", "Amstel 330ml / 500ml"), price: "2,30€ / 3,00€" },
      { name: greek("Alfa 330ml / 500ml",   "Alfa 330ml / 500ml"),   price: "2,30€ / 3,00€" },
      { name: greek("Fix 330ml / 500ml",    "Fix 330ml / 500ml"),    price: "2,30€ / 3,00€" },
      { name: greek("Heineken 330ml / 500ml","Heineken 330ml / 500ml"), price: "2,30€ / 3,00€" },
      { name: greek("Mythos 330ml / 500ml", "Mythos 330ml / 500ml"), price: "2,30€ / 3,00€" },
    ],
  },
  {
    title: SECTIONS.appetizers1,
    items: [
      { name: itemName("Φρέσκιες Πατάτες", "Fresh Fried Potatoes", { zh: "新鲜炸薯条", fr: "Frites maison", pt: "Batatas fritas frescas", it: "Patatine fresche", es: "Papas fritas frescas" }), price: "3,50€" },
      { name: itemName("Πατάτες με τυρί", "Fries with cheese", { zh: "薯条配奶酪", fr: "Frites au fromage", pt: "Batatas com queijo", it: "Patatine con formaggio", es: "Papas con queso" }), price: "4,00€" },
      { name: itemName("Πατάτες με τσένταρ & μπέικον", "Fries with cheddar & bacon", { zh: "薯条配切达奶酪和培根", fr: "Frites cheddar & bacon", pt: "Batatas com cheddar & bacon", it: "Patatine cheddar & bacon", es: "Papas con cheddar y bacon" }), price: "4,50€" },
      { name: itemName("Φέτα", "Feta cheese", { zh: "菲达奶酪", fr: "Feta", pt: "Queijo feta", it: "Feta", es: "Queso feta" }), price: "3,50€" },
      { name: itemName("Φέτα ψητή με ντομάτα & πιπεριά", "Roasted Feta with tomato & peppers", { zh: "烤菲达奶酪配番茄和辣椒", fr: "Feta rôtie tomate & poivrons", pt: "Feta assada com tomate & pimentos", it: "Feta al forno con pomodoro & peperoni", es: "Feta asada con tomate y pimientos" }), price: "4,50€" },
      { name: greek("Τζατζίκι σπιτικό", "Tzatziki (homemade)"), price: "3,50€" },
      { name: itemName("Τυροκαυτερή", "Hot Pepper Cheese", { zh: "辣椒奶酪酱", fr: "Fromage au piment", pt: "Queijo picante", it: "Crema di formaggio piccante", es: "Queso picante" }), price: "3,50€" },
    ],
  },
  {
    title: SECTIONS.appetizers2,
    items: [
      { name: itemName("Κολοκυθοκεφτέδες τμχ", "Zucchini Fritter pc", { zh: "西葫芦丸子 (单个)", fr: "Beignet de courgette (pièce)", pt: "Bolinho de abóbora (un)", it: "Frittella di zucchine (pz)", es: "Buñuelo de calabacín (ud)" }), price: "1,20€" },
      { name: itemName("Κολοκυθοκεφτέδες μερίδα 5 τμχ", "Zucchini Fritters portion 5 pcs", { zh: "西葫芦丸子 5 个", fr: "Beignets courgette 5 pcs", pt: "Bolinhos abóbora 5 un", it: "Frittelle zucchine 5 pz", es: "Buñuelos calabacín 5 uds" }), price: "6,00€" },
      { name: itemName("Ρεβυθοκεφτέδες τμχ", "Chickpea Fritter pc", { zh: "鹰嘴豆丸子 (单个)", fr: "Beignet pois chiche (pièce)", pt: "Bolinho de grão-de-bico (un)", it: "Frittella di ceci (pz)", es: "Buñuelo de garbanzo (ud)" }), price: "1,20€" },
      { name: itemName("Ρεβυθοκεφτέδες μερίδα 5 τμχ", "Chickpea Fritters portion 5 pcs", { zh: "鹰嘴豆丸子 5 个", fr: "Beignets pois chiche 5 pcs", pt: "Bolinhos grão 5 un", it: "Frittelle di ceci 5 pz", es: "Buñuelos garbanzo 5 uds" }), price: "6,00€" },
      { name: itemName("Πίτα στα κάρβουνα", "Grilled pita bread", { zh: "炭烤皮塔饼", fr: "Pita grillée au charbon", pt: "Pita grelhada", it: "Pita alla griglia", es: "Pita a la brasa" }), price: "0,60€" },
    ],
  },
  {
    title: SECTIONS.salads,
    items: [
      { name: itemName("Η σαλάτα της Τρούμπας", "Trouba's salad", { zh: "特鲁巴特色沙拉", fr: "Salade de Trouba", pt: "Salada da Trouba", it: "Insalata di Trouba", es: "Ensalada de Trouba" }), desc: D("lettuce, cabbage, tomato, cucumber, onion, peppers, olives, capers & mustard sauce"), price: "7,50€" },
      { name: itemName("Λάχανο-Καρότο", "Cabbage-Carrot Salad", { zh: "卷心菜胡萝卜沙拉", fr: "Salade chou-carotte", pt: "Salada de repolho e cenoura", it: "Insalata cavolo-carota", es: "Ensalada de repollo y zanahoria" }), price: "4,50€" },
      { name: itemName("Μαρούλι", "Lettuce Salad", { zh: "生菜沙拉", fr: "Salade verte", pt: "Salada de alface", it: "Insalata di lattuga", es: "Ensalada de lechuga" }), desc: D("lettuce, fresh onion, dill"), price: "4,50€" },
    ],
  },
  {
    title: SECTIONS.pita1,
    items: [
      { name: greek("Καλαμάκι χοιρινό", "Skewered pork"), desc: D("tomato, onion, tzatziki, fries"), price: "3,50€" },
      { name: greek("Καλαμάκι κοτόπουλο μπούτι", "Skewered chicken thigh"), desc: D("tomato, lettuce, sauce, fries"), price: "3,50€" },
      { name: greek("Καλαμάκι κοτομπέικον", "Skewered chicken with bacon"), desc: D("tomato, lettuce, sauce, fries"), price: "3,80€" },
      { name: greek("Μπιφτέκι μοσχαρίσιο", "Beef Burger pc"), desc: D("tomato, onion, tzatziki, fries"), price: "3,50€" },
    ],
  },
  {
    title: SECTIONS.pita2,
    items: [
      { name: greek("Τρουμπάκι — Special μπιφτεκάκι της Τρούμπας", "Trouba's special burger"), desc: D("tomato, mustard, fries"), price: "3,50€" },
      { name: greek("Κεμπάπ Φιλαδέλφεια", "Kebap Philadelphia"), desc: D("tomato, onion, tzatziki, fries"), price: "3,80€" },
      { name: greek("Πανσετάκι χοιρινό", "Pork Belly"), desc: D("tomato, onion, tzatziki, fries"), price: "3,50€" },
      { name: greek("Μπριζολάκι χοιρινό", "Pork Chop"), desc: D("tomato, onion, tzatziki, fries"), price: "3,50€" },
      { name: greek("Λουκάνικο χοιρινό", "Pork Sausage"), desc: D("tomato, onion, mustard, fries"), price: "3,80€" },
    ],
  },
  {
    title: SECTIONS.port_skew,
    note: D("4 pcs — served with tomato, onion, tzatziki, fries, 2 pita"),
    items: [
      { name: greek("Καλαμάκι χοιρινό 4τμχ", "Skewered pork 4pcs"), price: "9,00€" },
      { name: greek("Καλαμάκι κοτόπουλο μπούτι 4τμχ", "Skewered chicken thigh 4pcs"), price: "9,00€" },
      { name: greek("Καλαμάκι κοτομπέικον 4τμχ", "Skewered chicken with bacon 4pcs"), price: "9,50€" },
    ],
  },
  {
    title: SECTIONS.port_special,
    note: D("Served with fries, pita, salad/sauce"),
    items: [
      { name: greek("Μπιφτέκι μοσχαρίσιο 2τμχ", "Beef Burger 2pcs"), price: "9,00€" },
      { name: greek("Special μπιφτεκάκι της Τρούμπας 4τμχ", "Trouba's special 4pcs"), price: "9,50€" },
      { name: greek("Κεμπάπ Φιλαδέλφεια 4τμχ", "Kebap Philadelphia 4pcs"), price: "9,50€" },
    ],
  },
  {
    title: SECTIONS.port_pork,
    note: D("Served with tomato, onion, tzatziki, fries, 2 pita"),
    items: [
      { name: greek("Πανσετάκι χοιρινό 5τμχ", "Pork Belly 5pcs"), price: "9,50€" },
      { name: greek("Μπριζολάκι χοιρινό 4τμχ", "Pork Chop 4pcs"), price: "9,50€" },
      { name: greek("Λουκάνικο χοιρινό 3τμχ", "Pork Sausage 3pcs"), price: "9,50€" },
      { name: itemName("Ποικιλία 2 ατόμων", "Mix grill for 2 persons", { zh: "双人烤肉拼盘", fr: "Assortiment pour 2 personnes", pt: "Variedade para 2 pessoas", it: "Misto griglia per 2", es: "Variedad para 2 personas" }), price: "16,00€" },
    ],
  },
  {
    title: SECTIONS.burger,
    items: [
      { name: itemName("Χάμπουργκερ", "Hamburger", { zh: "汉堡", fr: "Hamburger", pt: "Hambúrguer", it: "Hamburger", es: "Hamburguesa" }), desc: D("beef burger, cheddar cheese, lettuce, tomato, onion"), price: "7,00€" },
      { name: itemName("+ Έξτρα μπέικον", "+ extra bacon", { zh: "+ 加培根", fr: "+ bacon extra", pt: "+ bacon extra", it: "+ bacon extra", es: "+ bacon extra" }), price: "+0,70€" },
    ],
  },
  {
    title: SECTIONS.veggie,
    items: [
      { name: itemName("Μπιφτέκι λαχανικών τμχ", "Vegetable Stick pc", { zh: "蔬菜饼 (单个)", fr: "Steak de légumes (pièce)", pt: "Hambúrguer de legumes (un)", it: "Burger di verdure (pz)", es: "Hamburguesa de verduras (ud)" }), price: "2,00€" },
      { name: itemName("Τυλιχτό Μπιφτέκι λαχανικών", "Wrapped Vegetable Burger", { zh: "蔬菜饼卷饼", fr: "Pita roulée légumes", pt: "Pita enrolada vegetal", it: "Pita arrotolata verdure", es: "Pita enrollada verduras" }), desc: D("tomato, lettuce, fries"), price: "3,50€" },
      { name: itemName("Λουκάνικο σουπιάς τμχ", "Sepia Sausage pc", { zh: "墨鱼香肠 (单个)", fr: "Saucisse de seiche (pièce)", pt: "Salsicha de chocos (un)", it: "Salsiccia di seppia (pz)", es: "Salchicha de sepia (ud)" }), price: "2,30€" },
      { name: itemName("Τυλιχτό Λουκάνικο σουπιάς", "Wrapped Sepia Sausage", { zh: "墨鱼香肠卷饼", fr: "Pita roulée saucisse de seiche", pt: "Pita enrolada salsicha de chocos", it: "Pita arrotolata salsiccia di seppia", es: "Pita enrollada salchicha de sepia" }), desc: D("tomato, lettuce, fries"), price: "3,80€" },
      { name: itemName("Τυλιχτό Ρεβυθοκεφτές", "Wrapped Chickpea Fritter", { zh: "鹰嘴豆丸子卷饼", fr: "Pita roulée pois chiches", pt: "Pita enrolada grão-de-bico", it: "Pita arrotolata di ceci", es: "Pita enrollada de garbanzos" }), desc: D("tomato, lettuce, fries"), price: "3,50€" },
      { name: itemName("Τυλιχτό Κολοκυθοκεφτές", "Wrapped Zucchini Fritter", { zh: "西葫芦丸子卷饼", fr: "Pita roulée courgette", pt: "Pita enrolada abóbora", it: "Pita arrotolata zucchine", es: "Pita enrollada calabacín" }), desc: D("tomato, lettuce, fries"), price: "3,50€" },
      { name: itemName("Τυλιχτό Οικολογικό", "Wrapped pita without meat", { zh: "素卷饼", fr: "Pita roulée sans viande", pt: "Pita enrolada sem carne", it: "Pita arrotolata senza carne", es: "Pita enrollada sin carne" }), desc: D("tomato, onion, lettuce, fries"), price: "2,50€" },
      { name: itemName("Veggie Burger", "Veggie Burger", { zh: "素食汉堡", fr: "Veggie Burger", pt: "Hambúrguer vegetariano", it: "Burger vegetariano", es: "Hamburguesa vegetariana" }), desc: D("tomato, lettuce, vegan cheese, ketchup, mustard, fries"), price: "7,00€" },
      { name: itemName("Καλαμάκι Σεϊτάν τμχ", "Seitan skewer pc", { zh: "麦麸烤串 (单个)", fr: "Brochette de seitan (pièce)", pt: "Espetinho de seitan (un)", it: "Spiedino di seitan (pz)", es: "Brocheta de seitán (ud)" }), desc: D("plant-based meat-like protein"), price: "2,60€" },
      { name: itemName("Κεμπάπ Σεϊτάν", "Seitan kebab", { zh: "麦麸烤肉串", fr: "Kebab de seitan", pt: "Kebab de seitan", it: "Kebab di seitan", es: "Kebab de seitán" }), price: "2,60€" },
      { name: itemName("Τυλιχτό Σεϊτάν", "Wrapped Seitan", { zh: "麦麸卷饼", fr: "Pita roulée seitan", pt: "Pita enrolada seitan", it: "Pita arrotolata seitan", es: "Pita enrollada seitán" }), price: "3,80€" },
    ],
  },
  {
    title: SECTIONS.sandwich,
    items: [
      { name: itemName("Σάντουιτς με κρέας της επιλογής σας", "Sandwich with meat of your choice", { zh: "三明治 (自选肉类)", fr: "Sandwich viande au choix", pt: "Sanduíche com carne à escolha", it: "Sandwich con carne a scelta", es: "Sándwich con carne a elegir" }), price: "4,50€" },
      { name: itemName("Σάντουιτς με διπλό κρέας της επιλογής σας", "Sandwich with double meat of your choice", { zh: "双份肉三明治 (自选肉类)", fr: "Sandwich double viande au choix", pt: "Sanduíche carne dupla à escolha", it: "Sandwich doppia carne a scelta", es: "Sándwich doble carne a elegir" }), price: "5,50€" },
      { name: greek("Σκεπαστή με κρέας της επιλογής σας", "Skepasti with meat of your choice"), desc: D("tomato, lettuce, sauce, fries & gouda cheese"), price: "7,50€" },
    ],
  },
];

// Helper to extract value for a given lang from a dict {zh,el,fr,pt,it,es} or string
export function pick(dictOrString, lang) {
  if (!dictOrString) return "";
  if (typeof dictOrString === "string") return dictOrString;
  return dictOrString[lang] || dictOrString.en || dictOrString.el || "";
}
