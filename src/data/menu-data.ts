// Données menu partagées entre MenuBook (visuel) et /delivery (panier).
// IMPORTANT : single source of truth. Si tu modifies les prix ici, le panier suit.

export type MenuItem = {
  el: string;
  en: string;
  de?: string;
  ru?: string;
  ja?: string;
  desc_el?: string;
  desc_en?: string;
  desc_de?: string;
  desc_ru?: string;
  desc_ja?: string;
  price: string; // format "3,50€" ou "+0,70€" ou "2,30€ / 3,00€"
};

export type MenuPage = {
  title_el: string;
  title_en: string;
  title_de?: string;
  title_ru?: string;
  title_ja?: string;
  photo: string;
  note_el?: string;
  note_en?: string;
  note_de?: string;
  note_ru?: string;
  note_ja?: string;
  items: MenuItem[];
};

export const menuPages: MenuPage[] = [
  {
    title_el: "Αναψυκτικά & Νερό",
    title_en: "Soft Drinks & Water",
    title_de: "Erfrischungsgetränke & Wasser",
    title_ru: "Безалкогольные напитки и вода",
    title_ja: "ソフトドリンク＆水",
    photo: "/photos/efood/coca-cola-330ml-800w.webp",
    items: [
      { el: "Κόκα-Κόλα 330ml", en: "Coca-Cola 330ml", de: "Coca-Cola 330ml", ru: "Кока-Кола 330мл", ja: "コカ・コーラ 330ml", desc_el: "Δροσερό κουτάκι Coca-Cola Original Taste", desc_en: "Ice-cold can of Coca-Cola Original Taste", desc_de: "Eiskalte Dose Coca-Cola Original Taste", desc_ru: "Ледяная баночка Кока-Кола Original Taste", desc_ja: "冷えたコカ・コーラ・オリジナルテイスト缶", price: "1,60€" },
      { el: "Κόκα-Κόλα Light 330ml", en: "Coca-Cola Light 330ml", de: "Coca-Cola Light 330ml", ru: "Кока-Кола Лайт 330мл", ja: "コカ・コーラ ライト 330ml", desc_el: "Δροσερό κουτάκι Coca-Cola Light χωρίς ζάχαρη", desc_en: "Ice-cold can of Coca-Cola Light, no sugar", desc_de: "Eiskalte Dose Coca-Cola Light, ohne Zucker", desc_ru: "Ледяная баночка Кока-Кола Лайт без сахара", desc_ja: "砂糖不使用コカ・コーラ ライト 冷えた缶", price: "1,60€" },
      { el: "Κόκα-Κόλα Zero 330ml", en: "Coca-Cola Zero 330ml", de: "Coca-Cola Zero 330ml", ru: "Кока-Кола Зеро 330мл", ja: "コカ・コーラ ゼロ 330ml", desc_el: "Δροσερό κουτάκι Coca-Cola Zero Sugar", desc_en: "Ice-cold can of Coca-Cola Zero Sugar", desc_de: "Eiskalte Dose Coca-Cola Zero Sugar", desc_ru: "Ледяная баночка Кока-Кола Zero Sugar", desc_ja: "コカ・コーラ ゼロ シュガー 冷えた缶", price: "1,60€" },
      { el: "Sprite 330ml", en: "Sprite 330ml", de: "Sprite 330ml", ru: "Спрайт 330мл", ja: "スプライト 330ml", desc_el: "Δροσερό κουτάκι Sprite lemon-lime", desc_en: "Ice-cold can of Sprite lemon-lime", desc_de: "Eiskalte Dose Sprite Zitrone-Limette", desc_ru: "Ледяная баночка Спрайт лимон-лайм", desc_ja: "スプライト レモンライム 冷えた缶", price: "1,60€" },
      { el: "Fanta Πορτοκαλάδα 330ml", en: "Fanta Orange 330ml", de: "Fanta Orange 330ml", ru: "Фанта апельсин 330мл", ja: "ファンタ オレンジ 330ml", desc_el: "Δροσερό κουτάκι Fanta Πορτοκαλάδα", desc_en: "Ice-cold can of Fanta Orange", desc_de: "Eiskalte Dose Fanta Orange", desc_ru: "Ледяная баночка Фанта Апельсин", desc_ja: "ファンタ オレンジ 冷えた缶", price: "1,60€" },
      { el: "Fanta Μπλε 330ml", en: "Fanta Blue 330ml", de: "Fanta Blue 330ml", ru: "Фанта синяя 330мл", ja: "ファンタ ブルー 330ml", desc_el: "Δροσερό κουτάκι Fanta Blue (μπλούκι)", desc_en: "Ice-cold can of Fanta Blue", desc_de: "Eiskalte Dose Fanta Blue", desc_ru: "Ледяная баночка Фанта Блю", desc_ja: "ファンタ ブルー 冷えた缶", price: "1,60€" },
      { el: "Σόδα 330ml", en: "Soda Water 330ml", de: "Sodawasser 330ml", ru: "Содовая 330мл", ja: "ソーダ 330ml", desc_el: "Δροσερό κουτάκι ανθρακούχα σόδα", desc_en: "Ice-cold can of sparkling soda water", desc_de: "Eiskalte Dose Soda mit Kohlensäure", desc_ru: "Ледяная баночка газированной содовой", desc_ja: "炭酸ソーダウォーター 冷えた缶", price: "1,50€" },
      { el: "Κόκα-Κόλα 1.5L", en: "Coca-Cola 1.5L", de: "Coca-Cola 1.5L", ru: "Кока-Кола 1.5л", ja: "コカ・コーラ 1.5L", desc_el: "Οικογενειακή φιάλη Coca-Cola για μοιρασιά", desc_en: "Family-size Coca-Cola bottle to share", desc_de: "Familienflasche Coca-Cola zum Teilen", desc_ru: "Семейная бутылка Кока-Кола", desc_ja: "シェアできるコカ・コーラ ファミリーサイズ", price: "2,80€" },
      { el: "Αναψυκτικό 1.5L", en: "Soft drink 1.5L", de: "Erfrischungsgetränk 1.5L", ru: "Безалкогольный напиток 1.5л", ja: "ソフトドリンク 1.5L", desc_el: "Οικογενειακή φιάλη — Sprite, Fanta, Schweppes (διαθέσιμα)", desc_en: "Family-size bottle — Sprite, Fanta, Schweppes (subject to availability)", desc_de: "Familienflasche — Sprite, Fanta, Schweppes (je nach Verfügbarkeit)", desc_ru: "Семейная бутылка — Спрайт, Фанта, Швепс (по наличию)", desc_ja: "ファミリーボトル — スプライト、ファンタ、シュウェップス（在庫次第）", price: "2,50€" },
      { el: "Νερό 500ml", en: "Mineral Water 500ml", de: "Mineralwasser 500ml", ru: "Минеральная вода 500мл", ja: "ミネラルウォーター 500ml", desc_el: "Φυσικό μεταλλικό νερό", desc_en: "Natural mineral water", desc_de: "Natürliches Mineralwasser", desc_ru: "Натуральная минеральная вода", desc_ja: "天然ミネラルウォーター", price: "0,50€" },
      { el: "Νερό 1L", en: "Mineral Water 1L", de: "Mineralwasser 1L", ru: "Минеральная вода 1л", ja: "ミネラルウォーター 1L", desc_el: "Φυσικό μεταλλικό νερό — μεγάλη φιάλη", desc_en: "Natural mineral water — large bottle", desc_de: "Natürliches Mineralwasser — große Flasche", desc_ru: "Натуральная минеральная вода — большая бутылка", desc_ja: "天然ミネラルウォーター — 大ボトル", price: "1,00€" },
    ],
  },
  {
    title_el: "Κρασιά & Μπύρες",
    title_en: "Wines & Beers",
    title_de: "Weine & Biere",
    title_ru: "Вина и пиво",
    title_ja: "ワインとビール",
    photo: "/photos/efood/heineken-330ml-800w.webp",
    note_el: "Ελληνικές & διεθνείς μπύρες, σπιτικό κρασί καράφα",
    note_en: "Greek & international beers, house wine in carafe",
    note_de: "Griechische & internationale Biere, Hauswein in der Karaffe",
    note_ru: "Греческое и международное пиво, домашнее вино в графине",
    note_ja: "ギリシャ・各国のビール、自家製ワインのカラフェ",
    items: [
      { el: "Κρασί 500ml", en: "Wine 500ml", de: "Wein 500ml", ru: "Вино 500мл", ja: "ワイン 500ml", desc_el: "Λευκό ή κόκκινο σπιτικό κρασί — καράφα 500ml", desc_en: "House white or red wine — 500ml carafe", desc_de: "Weiß- oder Rotwein vom Haus — 500ml Karaffe", desc_ru: "Домашнее белое или красное вино — графин 500мл", desc_ja: "ハウスワイン（白または赤）— 500mlカラフェ", price: "3,00€" },
      { el: "Κρασί 1L", en: "Wine 1L", de: "Wein 1L", ru: "Вино 1л", ja: "ワイン 1L", desc_el: "Λευκό ή κόκκινο σπιτικό κρασί — καράφα 1L", desc_en: "House white or red wine — 1L carafe", desc_de: "Weiß- oder Rotwein vom Haus — 1L Karaffe", desc_ru: "Домашнее белое или красное вино — графин 1л", desc_ja: "ハウスワイン（白または赤）— 1Lカラフェ", price: "6,00€" },
      { el: "Amstel 330ml", en: "Amstel 330ml", de: "Amstel 330ml", ru: "Amstel 330мл", ja: "アムステル 330ml", desc_el: "Ελληνική lager — ελαφριά, ξηρή", desc_en: "Greek lager — light, dry", desc_de: "Griechisches Lager — leicht, trocken", desc_ru: "Греческий лагер — лёгкий, сухой", desc_ja: "ギリシャのラガー — 軽くドライ", price: "2,30€" },
      { el: "Amstel 500ml", en: "Amstel 500ml", de: "Amstel 500ml", ru: "Amstel 500мл", ja: "アムステル 500ml", desc_el: "Ελληνική lager — μεγάλη φιάλη", desc_en: "Greek lager — large bottle", desc_de: "Griechisches Lager — große Flasche", desc_ru: "Греческий лагер — большая бутылка", desc_ja: "ギリシャのラガー — 大ボトル", price: "3,00€" },
      { el: "Alfa 330ml", en: "Alfa 330ml", de: "Alfa 330ml", ru: "Alfa 330мл", ja: "アルファ 330ml", desc_el: "Κλασική ελληνική μπύρα από 1961", desc_en: "Classic Greek beer since 1961", desc_de: "Klassisches griechisches Bier seit 1961", desc_ru: "Классическое греческое пиво с 1961 года", desc_ja: "1961年から続くギリシャの定番ビール", price: "2,30€" },
      { el: "Alfa 500ml", en: "Alfa 500ml", de: "Alfa 500ml", ru: "Alfa 500мл", ja: "アルファ 500ml", desc_el: "Κλασική ελληνική μπύρα — 500ml", desc_en: "Classic Greek beer — 500ml", desc_de: "Klassisches griechisches Bier — 500ml", desc_ru: "Классическое греческое пиво — 500мл", desc_ja: "クラシックなギリシャビール — 500ml", price: "3,00€" },
      { el: "Fix 330ml", en: "Fix 330ml", de: "Fix 330ml", ru: "Fix 330мл", ja: "フィックス 330ml", desc_el: "Η αρχαιότερη ελληνική μπύρα — από 1864", desc_en: "Greece's oldest beer — since 1864", desc_de: "Griechenlands ältestes Bier — seit 1864", desc_ru: "Самое старое греческое пиво — с 1864 года", desc_ja: "1864年創業、ギリシャ最古のビール", price: "2,30€" },
      { el: "Fix 500ml", en: "Fix 500ml", de: "Fix 500ml", ru: "Fix 500мл", ja: "フィックス 500ml", desc_el: "Η αρχαιότερη ελληνική μπύρα — μεγάλη", desc_en: "Greece's oldest beer — large bottle", desc_de: "Griechenlands ältestes Bier — große Flasche", desc_ru: "Самое старое греческое пиво — большая бутылка", desc_ja: "ギリシャ最古のビール — 大ボトル", price: "3,00€" },
      { el: "Heineken 330ml", en: "Heineken 330ml", de: "Heineken 330ml", ru: "Heineken 330мл", ja: "ハイネケン 330ml", desc_el: "Διεθνής ολλανδική premium lager", desc_en: "International Dutch premium lager", desc_de: "Internationales niederländisches Premium-Lager", desc_ru: "Международный голландский премиум-лагер", desc_ja: "オランダ産プレミアム・ラガー", price: "2,30€" },
      { el: "Heineken 500ml", en: "Heineken 500ml", de: "Heineken 500ml", ru: "Heineken 500мл", ja: "ハイネケン 500ml", desc_el: "Διεθνής ολλανδική premium lager — 500ml", desc_en: "International Dutch premium lager — 500ml", desc_de: "Internationales niederländisches Premium-Lager — 500ml", desc_ru: "Международный голландский премиум-лагер — 500мл", desc_ja: "オランダ産プレミアム・ラガー — 500ml", price: "3,00€" },
      { el: "Mythos 330ml", en: "Mythos 330ml", de: "Mythos 330ml", ru: "Mythos 330мл", ja: "ミトス 330ml", desc_el: "Δροσερή ελληνική pilsner, lightly hopped", desc_en: "Crisp Greek pilsner, lightly hopped", desc_de: "Frisches griechisches Pils, leicht gehopft", desc_ru: "Освежающий греческий пилснер, лёгкий хмель", desc_ja: "ホップ控えめのすっきりとしたギリシャのピルスナー", price: "2,30€" },
      { el: "Mythos 500ml", en: "Mythos 500ml", de: "Mythos 500ml", ru: "Mythos 500мл", ja: "ミトス 500ml", desc_el: "Δροσερή ελληνική pilsner — μεγάλη φιάλη", desc_en: "Crisp Greek pilsner — large bottle", desc_de: "Frisches griechisches Pils — große Flasche", desc_ru: "Освежающий греческий пилснер — большая бутылка", desc_ja: "すっきりとしたギリシャのピルスナー — 大ボトル", price: "3,00€" },
      { el: "Πατάτες τηγανητές", en: "Homemade fries", de: "Hausgemachte Pommes", ru: "Картофель фри", ja: "自家製フライドポテト", desc_el: "Φρέσκες χειροποίητες πατάτες, τηγανισμένες στιγμής — η ιδανική συνοδεία στην μπύρα", desc_en: "Hand-cut fresh potatoes, fried to order — the perfect side for a cold beer", desc_de: "Frisch handgeschnittene Pommes, knusprig frittiert — die ideale Begleitung zum kühlen Bier", desc_ru: "Свежий картофель ручной нарезки, обжаренный — идеальная закуска к холодному пиву", desc_ja: "手切りの新鮮なじゃがいもをその場で揚げます — 冷えたビールに最高のお供", price: "4,00€" },
    ],
  },
  {
    title_el: "Ορεκτικά Ι",
    title_en: "Appetizers I",
    title_de: "Vorspeisen I",
    title_ru: "Закуски I",
    title_ja: "前菜 I",
    photo: "/photos/efood/patates-tiganites-cheddar-mpeikon-800w.webp",
    items: [
      { el: "Φρέσκιες Πατάτες", en: "Fresh Fried Potatoes", de: "Frische Pommes Frites", ru: "Свежий картофель фри", ja: "フレッシュ・フライドポテト", desc_el: "Χειροποίητες πατάτες κομμένες την ώρα, τηγανιτές σε φρέσκο λάδι, αλάτι θαλάσσιο", desc_en: "Hand-cut fries made to order, fried in fresh oil, sea salt", desc_de: "Handgeschnittene Pommes auf Bestellung, in frischem Öl frittiert, Meersalz", desc_ru: "Картофель фри ручной нарезки, обжаренный в свежем масле, морская соль", desc_ja: "手切りのじゃがいもを新鮮な油でその場で揚げ、海塩で味付け", price: "3,50€" },
      { el: "Πατάτες με τυρί", en: "Fries with cheese", de: "Pommes mit Käse", ru: "Картофель с сыром", ja: "チーズ・フライドポテト", desc_el: "Φρέσκιες πατάτες με λιωμένο κίτρινο τυρί από επάνω", desc_en: "Fresh fries topped with melted yellow cheese", desc_de: "Frische Pommes mit geschmolzenem gelben Käse", desc_ru: "Свежий картофель фри с плавленым жёлтым сыром сверху", desc_ja: "揚げたてポテトに溶けたイエローチーズをトッピング", price: "4,00€" },
      { el: "Πατάτες με τσένταρ & μπέικον", en: "Fries with cheddar & bacon", de: "Pommes mit Cheddar & Speck", ru: "Картофель с чеддером и беконом", ja: "チェダー＆ベーコン・フライドポテト", desc_el: "Πατάτες σε στρώσεις cheddar που λιώνει και τραγανό μπέικον", desc_en: "Loaded fries with melted cheddar and crispy bacon", desc_de: "Pommes belegt mit geschmolzenem Cheddar und knusprigem Speck", desc_ru: "Картофель фри с плавленым чеддером и хрустящим беконом", desc_ja: "とろけるチェダーチーズとカリカリベーコンをのせたボリュームポテト", price: "4,50€" },
      { el: "Φέτα", en: "Feta cheese", de: "Feta-Käse", ru: "Сыр фета", ja: "フェタチーズ", desc_el: "Παραδοσιακή ελληνική φέτα ΠΟΠ από πρόβειο γάλα, ρίγανη, ελαιόλαδο", desc_en: "Traditional Greek PDO feta from sheep's milk, oregano, olive oil", desc_de: "Traditioneller griechischer g.U.-Feta aus Schafsmilch, Oregano, Olivenöl", desc_ru: "Традиционная греческая фета DOP из овечьего молока, орегано, оливковое масло", desc_ja: "羊乳から作られた伝統的なギリシャPDOフェタ、オレガノ、オリーブオイル", price: "3,50€" },
      { el: "Φέτα ψητή με ντομάτα & πιπεριά", en: "Roasted Feta with tomato & peppers", de: "Gebackener Feta mit Tomate & Paprika", ru: "Запечённая фета с томатом и перцем", ja: "焼きフェタのトマト＆パプリカ添え", desc_el: "Φέτα ψημένη στο φούρνο με φρέσκια ντομάτα, πιπεριά Φλωρίνης, ρίγανη και ελαιόλαδο", desc_en: "Oven-baked feta with fresh tomato, Florina peppers, oregano and olive oil", desc_de: "Im Ofen gebackener Feta mit frischer Tomate, Florina-Paprika, Oregano und Olivenöl", desc_ru: "Запечённая в духовке фета со свежим помидором, перцем Флорина, орегано и оливковым маслом", desc_ja: "オーブンで焼いたフェタに新鮮なトマト、フロリナ唐辛子、オレガノ、オリーブオイル", price: "4,50€" },
      { el: "Τζατζίκι σπιτικό", en: "Tzatziki (homemade)", de: "Tzatziki (hausgemacht)", ru: "Цацики (домашнее)", ja: "ツァジキ（自家製）", desc_el: "Σπιτικό στραγγιστό γιαούρτι, φρέσκο αγγούρι τριμμένο, σκόρδο, άνηθος, ελαιόλαδο", desc_en: "Homemade strained yogurt, freshly grated cucumber, garlic, dill, olive oil", desc_de: "Hausgemachter abgetropfter Joghurt, frisch geriebene Gurke, Knoblauch, Dill, Olivenöl", desc_ru: "Домашний процеженный йогурт, свежий тёртый огурец, чеснок, укроп, оливковое масло", desc_ja: "自家製水切りヨーグルト、おろしたての新鮮なきゅうり、ニンニク、ディル、オリーブオイル", price: "3,50€" },
      { el: "Τυροκαυτερή", en: "Hot Pepper Cheese", de: "Scharfer Käse-Dip", ru: "Острая закуска из феты", ja: "ホットペッパーチーズ", desc_el: "Πικάντικη κρέμα τυριού φέτα με ψητές καυτερές πιπεριές, ελαιόλαδο", desc_en: "Spicy feta cheese spread with roasted hot peppers and olive oil", desc_de: "Würzige Feta-Creme mit gerösteten scharfen Paprika und Olivenöl", desc_ru: "Острая паста из феты с запечёнными острыми перцами и оливковым маслом", desc_ja: "ローストした唐辛子とオリーブオイルを混ぜたスパイシーなフェタチーズスプレッド", price: "3,50€" },
    ],
  },
  {
    title_el: "Ορεκτικά ΙΙ",
    title_en: "Appetizers II",
    title_de: "Vorspeisen II",
    title_ru: "Закуски II",
    title_ja: "前菜 II",
    photo: "/photos/efood-veggie-fritters-800w.webp",
    items: [
      { el: "Κολοκυθοκεφτέδες τμχ", en: "Zucchini Fritter pc", de: "Zucchini-Puffer Stück", ru: "Кабачковая оладья шт.", ja: "ズッキーニフリッター 1個", desc_el: "Σπιτικά κεφτεδάκια κολοκυθιού με φέτα, δυόσμο και άνηθο, τηγανιτά", desc_en: "Homemade zucchini fritter with feta, mint and dill, pan-fried", desc_de: "Hausgemachter Zucchini-Puffer mit Feta, Minze und Dill, in der Pfanne gebraten", desc_ru: "Домашняя кабачковая оладья с фетой, мятой и укропом, обжаренная", desc_ja: "フェタ、ミント、ディル入りの自家製ズッキーニフリッター、揚げ焼き", price: "1,20€" },
      { el: "Κολοκυθοκεφτέδες μερίδα 5 τμχ", en: "Zucchini Fritters portion 5 pcs", de: "Zucchini-Puffer Portion 5 St.", ru: "Кабачковые оладьи порция 5 шт.", ja: "ズッキーニフリッター 5個盛り", desc_el: "5 σπιτικά κολοκυθοκεφτέδες σε μερίδα — σερβίρονται με τζατζίκι", desc_en: "Portion of 5 homemade zucchini fritters — served with tzatziki", desc_de: "Portion von 5 hausgemachten Zucchini-Puffern — mit Tzatziki serviert", desc_ru: "Порция из 5 домашних кабачковых оладий — с цацики", desc_ja: "自家製ズッキーニフリッター5個盛り — ツァジキ添え", price: "6,00€" },
      { el: "Ρεβυθοκεφτέδες τμχ", en: "Chickpea Fritter pc", de: "Kichererbsen-Puffer Stück", ru: "Нутовая оладья шт.", ja: "ひよこ豆フリッター 1個", desc_el: "Παραδοσιακό κεφτεδάκι ρεβιθιού με κρεμμύδι, μυρωδικά — χορτοφαγικό", desc_en: "Traditional chickpea fritter with onion and herbs — vegetarian", desc_de: "Traditioneller Kichererbsen-Puffer mit Zwiebel und Kräutern — vegetarisch", desc_ru: "Традиционная нутовая оладья с луком и зеленью — вегетарианская", desc_ja: "玉ねぎとハーブ入りの伝統的なひよこ豆フリッター — ベジタリアン", price: "1,20€" },
      { el: "Ρεβυθοκεφτέδες μερίδα 5 τμχ", en: "Chickpea Fritters portion 5 pcs", de: "Kichererbsen-Puffer Portion 5 St.", ru: "Нутовые оладьи порция 5 шт.", ja: "ひよこ豆フリッター 5個盛り", desc_el: "5 ρεβυθοκεφτέδες — χορτοφαγική επιλογή με τζατζίκι", desc_en: "5 chickpea fritters — vegetarian option served with tzatziki", desc_de: "5 Kichererbsen-Puffer — vegetarische Option mit Tzatziki", desc_ru: "5 нутовых оладий — вегетарианский вариант с цацики", desc_ja: "ひよこ豆フリッター5個 — ツァジキ添えのベジタリアン選択", price: "6,00€" },
      { el: "Πίτα στα κάρβουνα", en: "Grilled pita bread", de: "Pita-Brot vom Holzkohlegrill", ru: "Пита на углях", ja: "炭火焼きピタブレッド", desc_el: "Παραδοσιακή πίτα ψημένη πάνω από κάρβουνα, ζεστή και αφράτη", desc_en: "Traditional pita bread grilled over charcoal, warm and fluffy", desc_de: "Traditionelles Pita-Brot über Holzkohle gegrillt, warm und fluffig", desc_ru: "Традиционная пита, обжаренная на углях, тёплая и пышная", desc_ja: "炭火で焼いた伝統的なピタパン、温かくふんわり", price: "0,60€" },
    ],
  },
  {
    title_el: "Σαλάτες",
    title_en: "Salads",
    title_de: "Salate",
    title_ru: "Салаты",
    title_ja: "サラダ",
    photo: "/photos/efood-25-800w.webp",
    items: [
      { el: "Η σαλάτα της Τρούμπας", en: "Trouba's salad", de: "Trouba-Salat", ru: "Салат Трумбы", ja: "トルンバのサラダ", desc_el: "Η σπεσιαλιτέ μας : μαρούλι, λάχανο, ντομάτα, αγγούρι, κρεμμύδι, πιπεριά, ελιές Καλαμάτας, κάπαρη και σπιτική σως μουστάρδας", desc_en: "Our house special: lettuce, cabbage, tomato, cucumber, onion, peppers, Kalamata olives, capers and homemade mustard dressing", desc_de: "Unsere Spezialität: Salat, Kohl, Tomate, Gurke, Zwiebel, Paprika, Kalamata-Oliven, Kapern und hausgemachtes Senf-Dressing", desc_ru: "Наша фирменная: салат, капуста, помидор, огурец, лук, перец, оливки Каламата, каперсы и домашняя горчичная заправка", desc_ja: "当店スペシャル：レタス、キャベツ、トマト、きゅうり、玉ねぎ、ピーマン、カラマタオリーブ、ケーパー、自家製マスタードドレッシング", price: "7,50€" },
      { el: "Χωριάτικη", en: "Greek Salad (Choriatiki)", de: "Griechischer Bauernsalat (Choriatiki)", ru: "Греческий салат (Хориатики)", ja: "ギリシャ風サラダ（ホリアティキ）", desc_el: "Η αυθεντική ελληνική σαλάτα : ντομάτα, αγγούρι, κρεμμύδι, πιπεριά, ελιές Καλαμάτας, φέτα ΠΟΠ, ρίγανη, παρθένο ελαιόλαδο", desc_en: "The authentic Greek salad: tomato, cucumber, onion, peppers, Kalamata olives, PDO feta, oregano, virgin olive oil", desc_de: "Der authentische griechische Salat: Tomate, Gurke, Zwiebel, Paprika, Kalamata-Oliven, g.U.-Feta, Oregano, natives Olivenöl", desc_ru: "Аутентичный греческий салат: помидор, огурец, лук, перец, оливки Каламата, фета DOP, орегано, оливковое масло extra virgin", desc_ja: "本格ギリシャ風サラダ：トマト、きゅうり、玉ねぎ、ピーマン、カラマタオリーブ、PDOフェタ、オレガノ、エキストラバージンオリーブオイル", price: "7,50€" },
      { el: "Ντάκος", en: "Cretan Dakos", de: "Kretischer Dakos", ru: "Критский Дакос", ja: "クレタ風ダコス", desc_el: "Παραδοσιακή κρητική σαλάτα : κριθαροκουλούρα, φρέσκια ντομάτα τριμμένη, ξινομυζήθρα, ελιές, ρίγανη, ελαιόλαδο", desc_en: "Traditional Cretan salad: barley rusk, grated fresh tomato, xinomizithra cheese, olives, oregano, olive oil", desc_de: "Traditioneller kretischer Salat: Gerstenzwieback, geriebene frische Tomate, Xinomizithra-Käse, Oliven, Oregano, Olivenöl", desc_ru: "Традиционный критский салат: ячменный сухарь, тёртый свежий помидор, сыр ксиномизитра, оливки, орегано, оливковое масло", desc_ja: "伝統的クレタ風サラダ：大麦ラスク、おろしたて新鮮トマト、シノミジスラチーズ、オリーブ、オレガノ、オリーブオイル", price: "6,50€" },
      { el: "Λάχανο-Καρότο", en: "Cabbage-Carrot Salad", de: "Kohl-Karotten-Salat", ru: "Салат из капусты и моркови", ja: "キャベツ＆人参サラダ", desc_el: "Φρέσκο λάχανο και καρότο ψιλοκομμένο, ελαιόλαδο, λεμόνι", desc_en: "Finely sliced fresh cabbage and carrot, olive oil, lemon", desc_de: "Fein geschnittener frischer Kohl und Karotte, Olivenöl, Zitrone", desc_ru: "Тонко нарезанные свежая капуста и морковь, оливковое масло, лимон", desc_ja: "細切りの新鮮なキャベツと人参、オリーブオイル、レモン", price: "4,50€" },
      { el: "Μαρούλι", en: "Lettuce Salad", de: "Kopfsalat", ru: "Салат из латука", ja: "レタスサラダ", desc_el: "Μαρούλι, φρέσκο κρεμμύδι, άνηθος — η κλασική ελληνική πράσινη σαλάτα", desc_en: "Lettuce, fresh spring onion, dill — the classic Greek green salad", desc_de: "Salat, frische Frühlingszwiebel, Dill — der klassische griechische grüne Salat", desc_ru: "Латук, свежий зелёный лук, укроп — классический греческий зелёный салат", desc_ja: "レタス、新鮮なネギ、ディル — 定番のギリシャ風グリーンサラダ", price: "4,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές",
    title_en: "Wrapped Pita",
    title_de: "Pita-Wraps",
    title_ru: "Пита-роллы",
    title_ja: "ピタラップ",
    photo: "/photos/efood-04-800w.webp",
    note_el: "Τυλιχτές σε φρέσκια πίτα ψημένη στα κάρβουνα, με σπιτικές πατάτες",
    note_en: "Wrapped in fresh charcoal-grilled pita, served with house fries",
    note_de: "Eingewickelt in frische Pita vom Holzkohlegrill, mit hausgemachten Pommes",
    note_ru: "Завёрнуто в свежую питу с углей, с домашним картофелем фри",
    note_ja: "炭火焼きの新鮮なピタで包み、自家製ポテト添え",
    items: [
      { el: "Καλαμάκι χοιρινό", en: "Skewered pork", de: "Schweinespieß", ru: "Свиной шашлычок", ja: "豚肉串", desc_el: "Σουβλάκι χοιρινό μαριναρισμένο σε ρίγανη και λεμόνι, ψημένο στα κάρβουνα, με ντομάτα, κρεμμύδι, τζατζίκι και πατάτες", desc_en: "Pork souvlaki marinated in oregano and lemon, charcoal-grilled — tomato, onion, tzatziki, fries", desc_de: "Schweine-Souvlaki mariniert in Oregano und Zitrone, über Holzkohle gegrillt — Tomate, Zwiebel, Tzatziki, Pommes", desc_ru: "Свиной сувлаки, маринованный в орегано и лимоне, на углях — помидор, лук, цацики, картофель фри", desc_ja: "オレガノとレモンでマリネした炭火焼きの豚スブラキ — トマト、玉ねぎ、ツァジキ、ポテト", price: "3,50€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι", en: "Skewered chicken thigh", de: "Hähnchenschenkel-Spieß", ru: "Шашлычок из куриного бедра", ja: "鶏もも肉串", desc_el: "Ζουμερό κοτόπουλο από μπούτι (πιο γευστικό από το στήθος), ντομάτα, μαρούλι, σπιτική σως, πατάτες", desc_en: "Juicy chicken thigh (more flavourful than breast), tomato, lettuce, house sauce, fries", desc_de: "Saftiges Hähnchenschenkel (geschmackvoller als Brust), Tomate, Salat, Hausssauce, Pommes", desc_ru: "Сочное куриное бедро (вкуснее грудки), помидор, салат, фирменный соус, картофель фри", desc_ja: "ジューシーな鶏もも肉（胸肉より美味）、トマト、レタス、自家製ソース、ポテト", price: "3,50€" },
      { el: "Καλαμάκι κοτομπέικον", en: "Skewered chicken with bacon", de: "Hähnchenspieß mit Speck", ru: "Шашлычок из курицы с беконом", ja: "鶏肉ベーコン巻き串", desc_el: "Κοτόπουλο τυλιγμένο με τραγανό μπέικον, ντομάτα, μαρούλι, σως, πατάτες", desc_en: "Chicken wrapped in crispy bacon, tomato, lettuce, sauce, fries", desc_de: "Hähnchen umwickelt mit knusprigem Speck, Tomate, Salat, Sauce, Pommes", desc_ru: "Курица, обёрнутая хрустящим беконом, помидор, салат, соус, картофель фри", desc_ja: "カリカリベーコンで巻いた鶏肉、トマト、レタス、ソース、ポテト", price: "3,80€" },
      { el: "Μπιφτέκι μοσχαρίσιο", en: "Beef Burger pc", de: "Rinder-Burger Stück", ru: "Говяжья котлета шт.", ja: "ビーフバーガー 1個", desc_el: "Σπιτικό μπιφτέκι από φρέσκο μοσχαρίσιο κιμά με μυρωδικά, ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Homemade beef patty from fresh ground beef with herbs, tomato, onion, tzatziki, fries", desc_de: "Hausgemachtes Rinder-Patty aus frischem Hackfleisch mit Kräutern, Tomate, Zwiebel, Tzatziki, Pommes", desc_ru: "Домашняя котлета из свежего говяжьего фарша с зеленью, помидор, лук, цацики, картофель фри", desc_ja: "ハーブ入りの新鮮挽肉から作る自家製ビーフパティ、トマト、玉ねぎ、ツァジキ、ポテト", price: "3,50€" },
    ],
  },
  {
    title_el: "Πίτες τυλιχτές ΙΙ",
    title_en: "Wrapped Pita II",
    title_de: "Pita-Wraps II",
    title_ru: "Пита-роллы II",
    title_ja: "ピタラップ II",
    photo: "/photos/efood-03-800w.webp",
    note_el: "Οι σπεσιαλιτέ της Τρούμπας — δοκίμασε το Τρουμπάκι",
    note_en: "Trouba's specials — try the signature Trouba burger",
    note_de: "Trouba-Spezialitäten — probieren Sie den Signature-Trouba-Burger",
    note_ru: "Фирменные блюда Трумбы — попробуйте фирменный бургер Трубаки",
    note_ja: "トルンバの特製 — シグネチャーのトルバキバーガーをぜひ",
    items: [
      { el: "Τρουμπάκι — Special μπιφτεκάκι της Τρούμπας", en: "Trouba's special burger", de: "Trouba-Spezial-Burger", ru: "Фирменный бургер Трубаки", ja: "トルバキ — トルンバ特製バーガー", desc_el: "Η σπεσιαλιτέ του καταστήματος : μικρό μπιφτεκάκι με μυστική συνταγή μυρωδικών, ντομάτα, μουστάρδα, πατάτες", desc_en: "Our signature: mini burger with secret herb mix, tomato, mustard, fries", desc_de: "Unsere Spezialität: Mini-Burger mit geheimer Kräutermischung, Tomate, Senf, Pommes", desc_ru: "Наш фирменный: мини-бургер с секретной смесью трав, помидор, горчица, картофель фри", desc_ja: "当店のシグネチャー：秘伝のハーブブレンドを使ったミニバーガー、トマト、マスタード、ポテト", price: "3,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια", en: "Kebap Philadelphia", de: "Kebap Philadelphia", ru: "Кебаб Филадельфия", ja: "ケバブ・フィラデルフィア", desc_el: "Αρωματικό κεμπάπ στιλ Φιλαδέλφειας με ανατολίτικα μπαχαρικά, ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Aromatic Philadelphia-style kebab with eastern spices, tomato, onion, tzatziki, fries", desc_de: "Aromatischer Kebab im Philadelphia-Stil mit östlichen Gewürzen, Tomate, Zwiebel, Tzatziki, Pommes", desc_ru: "Ароматный кебаб в стиле Филадельфия с восточными специями, помидор, лук, цацики, картофель фри", desc_ja: "東洋のスパイスを使った香り高いフィラデルフィア風ケバブ、トマト、玉ねぎ、ツァジキ、ポテト", price: "3,80€" },
      { el: "Πανσετάκι χοιρινό", en: "Pork Belly", de: "Schweinebauch", ru: "Свиная грудинка", ja: "豚バラ肉", desc_el: "Λεπτή φέτα χοιρινής πανσέτας στα κάρβουνα, ζουμερή και τραγανή στις άκρες — ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Thin slice of charcoal-grilled pork belly, juicy with crispy edges — tomato, onion, tzatziki, fries", desc_de: "Dünne Scheibe Schweinebauch vom Holzkohlegrill, saftig mit knusprigen Rändern — Tomate, Zwiebel, Tzatziki, Pommes", desc_ru: "Тонкий ломтик свиной грудинки на углях, сочный с хрустящими краями — помидор, лук, цацики, картофель фри", desc_ja: "薄切り炭火焼き豚バラ、ジューシーで縁がカリッと — トマト、玉ねぎ、ツァジキ、ポテト", price: "3,50€" },
      { el: "Μπριζολάκι χοιρινό", en: "Pork Chop", de: "Schweinekotelett", ru: "Свиная отбивная", ja: "ポークチョップ", desc_el: "Μικρή χοιρινή μπριζόλα μαριναρισμένη, ψημένη στα κάρβουνα — ντομάτα, κρεμμύδι, τζατζίκι, πατάτες", desc_en: "Small marinated pork chop grilled on charcoal — tomato, onion, tzatziki, fries", desc_de: "Kleines mariniertes Schweinekotelett vom Holzkohlegrill — Tomate, Zwiebel, Tzatziki, Pommes", desc_ru: "Маленькая маринованная свиная отбивная на углях — помидор, лук, цацики, картофель фри", desc_ja: "炭火で焼いた小ぶりのマリネ豚肉 — トマト、玉ねぎ、ツァジキ、ポテト", price: "3,50€" },
      { el: "Λουκάνικο χοιρινό", en: "Pork Sausage", de: "Schweinewurst", ru: "Свиная колбаска", ja: "ポークソーセージ", desc_el: "Χωριάτικο χοιρινό λουκάνικο με πορτοκάλι και πράσο, στα κάρβουνα — ντομάτα, κρεμμύδι, μουστάρδα, πατάτες", desc_en: "Village-style pork sausage with orange and leek, charcoal-grilled — tomato, onion, mustard, fries", desc_de: "Hausgemachte Schweinewurst mit Orange und Lauch vom Holzkohlegrill — Tomate, Zwiebel, Senf, Pommes", desc_ru: "Деревенская свиная колбаска с апельсином и луком-пореем на углях — помидор, лук, горчица, картофель фри", desc_ja: "オレンジとリーキ入りの田舎風ポークソーセージを炭火焼き — トマト、玉ねぎ、マスタード、ポテト", price: "3,80€" },
    ],
  },
  {
    title_el: "Μερίδες — Καλαμάκια",
    title_en: "Portions — Skewers",
    title_de: "Portionen — Spieße",
    title_ru: "Блюда — Шашлычки",
    title_ja: "プレート — 串焼き",
    photo: "/photos/efood-66-800w.webp",
    note_el: "Πλήρες πιάτο : 4 τεμάχια — με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες και 2 πίτες στα κάρβουνα",
    note_en: "Full plate: 4 skewers — with tomato, onion, tzatziki, fries and 2 charcoal-grilled pitas",
    note_de: "Voller Teller: 4 Spieße — mit Tomate, Zwiebel, Tzatziki, Pommes und 2 Pitas vom Holzkohlegrill",
    note_ru: "Полная тарелка: 4 шашлычка — с помидором, луком, цацики, картофелем фри и 2 питами на углях",
    note_ja: "ボリュームプレート：串焼き4本 — トマト、玉ねぎ、ツァジキ、ポテト、炭火焼きピタ2枚付き",
    items: [
      { el: "Καλαμάκι χοιρινό 4τμχ", en: "Skewered pork 4pcs", de: "Schweinespieß 4 St.", ru: "Свиной шашлычок 4 шт.", ja: "豚肉串 4本", desc_el: "4 σουβλάκια χοιρινό μαριναρισμένο σε ρίγανη και λεμόνι, ψημένα στα κάρβουνα", desc_en: "4 pork souvlaki marinated in oregano and lemon, charcoal-grilled", desc_de: "4 Schweine-Souvlaki mariniert in Oregano und Zitrone, vom Holzkohlegrill", desc_ru: "4 свиных сувлаки, маринованных в орегано и лимоне, на углях", desc_ja: "オレガノとレモンでマリネした炭火焼き豚スブラキ4本", price: "9,00€" },
      { el: "Καλαμάκι κοτόπουλο μπούτι 4τμχ", en: "Skewered chicken thigh 4pcs", de: "Hähnchenschenkel-Spieß 4 St.", ru: "Шашлычок из куриного бедра 4 шт.", ja: "鶏もも肉串 4本", desc_el: "4 σουβλάκια κοτόπουλο από ζουμερό μπούτι", desc_en: "4 chicken souvlaki from juicy thigh meat", desc_de: "4 Hähnchen-Souvlaki aus saftigem Schenkelfleisch", desc_ru: "4 куриных сувлаки из сочного бедра", desc_ja: "ジューシーな鶏もも肉のスブラキ4本", price: "9,00€" },
      { el: "Καλαμάκι κοτομπέικον 4τμχ", en: "Skewered chicken with bacon 4pcs", de: "Hähnchenspieß mit Speck 4 St.", ru: "Шашлычок из курицы с беконом 4 шт.", ja: "鶏肉ベーコン巻き串 4本", desc_el: "4 σουβλάκια κοτόπουλο τυλιγμένα με μπέικον", desc_en: "4 chicken souvlaki wrapped in bacon", desc_de: "4 Hähnchen-Souvlaki umwickelt mit Speck", desc_ru: "4 куриных сувлаки, обёрнутых беконом", desc_ja: "ベーコンで巻いた鶏スブラキ4本", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Σπεσιαλιτέ",
    title_en: "Portions — Specials",
    title_de: "Portionen — Spezialitäten",
    title_ru: "Блюда — Фирменные",
    title_ja: "プレート — スペシャル",
    photo: "/photos/efood/mpifteki-moscharisio-merida-800w.webp",
    note_el: "Συνοδεύεται με πατάτες, πίτα στα κάρβουνα και σαλάτα/σάλτσα",
    note_en: "Served with fries, charcoal-grilled pita and salad/sauce",
    note_de: "Serviert mit Pommes, Pita vom Holzkohlegrill und Salat/Sauce",
    note_ru: "Подаётся с картофелем фри, питой на углях и салатом/соусом",
    note_ja: "ポテト、炭火焼きピタ、サラダ／ソース付き",
    items: [
      { el: "Μπιφτέκι μοσχαρίσιο 2τμχ", en: "Beef Burger 2pcs", de: "Rinder-Burger 2 St.", ru: "Говяжья котлета 2 шт.", ja: "ビーフバーガー 2個", desc_el: "2 σπιτικά μπιφτέκια από φρέσκο μοσχαρίσιο κιμά με μυρωδικά", desc_en: "2 homemade beef patties from fresh ground beef with herbs", desc_de: "2 hausgemachte Rinder-Patties aus frischem Hackfleisch mit Kräutern", desc_ru: "2 домашние котлеты из свежего говяжьего фарша с зеленью", desc_ja: "ハーブ入りの新鮮挽肉から作る自家製ビーフパティ2個", price: "9,00€" },
      { el: "Special μπιφτεκάκι της Τρούμπας 4τμχ", en: "Trouba's special 4pcs", de: "Trouba-Spezial 4 St.", ru: "Фирменный Трубаки 4 шт.", ja: "トルンバ特製 4個", desc_el: "4 μικρά Τρουμπάκια με μυστική συνταγή — η σπεσιαλιτέ μας", desc_en: "4 mini Trouba burgers with our secret recipe — house specialty", desc_de: "4 Mini-Trouba-Burger nach unserem Geheimrezept — Hausspezialität", desc_ru: "4 мини-бургера Трубаки по нашему секретному рецепту — фирменное блюдо", desc_ja: "秘伝のレシピで作るミニ・トルバキバーガー4個 — 当店のスペシャル", price: "9,50€" },
      { el: "Κεμπάπ Φιλαδέλφεια 4τμχ", en: "Kebap Philadelphia 4pcs", de: "Kebap Philadelphia 4 St.", ru: "Кебаб Филадельфия 4 шт.", ja: "ケバブ・フィラデルフィア 4個", desc_el: "4 κεμπάπ Φιλαδέλφειας με ανατολίτικα μπαχαρικά", desc_en: "4 Philadelphia-style kebabs with eastern spices", desc_de: "4 Kebabs im Philadelphia-Stil mit östlichen Gewürzen", desc_ru: "4 кебаба в стиле Филадельфия с восточными специями", desc_ja: "東洋のスパイスを使ったフィラデルフィア風ケバブ4個", price: "9,50€" },
    ],
  },
  {
    title_el: "Μερίδες — Χοιρινά",
    title_en: "Portions — Pork",
    title_de: "Portionen — Schwein",
    title_ru: "Блюда — Свинина",
    title_ja: "プレート — 豚肉",
    photo: "/photos/efood/pansetakia-choirina-merida-800w.webp",
    note_el: "Συνοδεύεται με ντομάτα, κρεμμύδι, τζατζίκι, πατάτες και 2 πίτες",
    note_en: "Served with tomato, onion, tzatziki, fries and 2 pitas",
    note_de: "Serviert mit Tomate, Zwiebel, Tzatziki, Pommes und 2 Pitas",
    note_ru: "Подаётся с помидором, луком, цацики, картофелем фри и 2 питами",
    note_ja: "トマト、玉ねぎ、ツァジキ、ポテト、ピタ2枚付き",
    items: [
      { el: "Πανσετάκι χοιρινό 5τμχ", en: "Pork Belly 5pcs", de: "Schweinebauch 5 St.", ru: "Свиная грудинка 5 шт.", ja: "豚バラ肉 5切れ", desc_el: "5 φέτες χοιρινής πανσέτας στα κάρβουνα — ζουμερές, τραγανές, με ρίγανη", desc_en: "5 slices of charcoal-grilled pork belly — juicy, crispy edges, oregano", desc_de: "5 Scheiben Schweinebauch vom Holzkohlegrill — saftig, knusprige Ränder, Oregano", desc_ru: "5 ломтиков свиной грудинки на углях — сочные, с хрустящими краями, орегано", desc_ja: "炭火焼き豚バラ5切れ — ジューシーで縁カリッ、オレガノ風味", price: "9,50€" },
      { el: "Μπριζολάκι χοιρινό 4τμχ", en: "Pork Chop 4pcs", de: "Schweinekotelett 4 St.", ru: "Свиная отбивная 4 шт.", ja: "ポークチョップ 4個", desc_el: "4 μικρές χοιρινές μπριζόλες μαριναρισμένες, ψημένες στα κάρβουνα", desc_en: "4 small marinated pork chops grilled on charcoal", desc_de: "4 kleine marinierte Schweinekoteletts vom Holzkohlegrill", desc_ru: "4 маленькие маринованные свиные отбивные на углях", desc_ja: "炭火で焼いた小ぶりのマリネ豚肉4個", price: "9,50€" },
      { el: "Λουκάνικο χοιρινό 3τμχ", en: "Pork Sausage 3pcs", de: "Schweinewurst 3 St.", ru: "Свиная колбаска 3 шт.", ja: "ポークソーセージ 3本", desc_el: "3 χωριάτικα λουκάνικα με πορτοκάλι και πράσο, στα κάρβουνα", desc_en: "3 village-style sausages with orange and leek, charcoal-grilled", desc_de: "3 hausgemachte Würstchen mit Orange und Lauch vom Holzkohlegrill", desc_ru: "3 деревенские колбаски с апельсином и луком-пореем, на углях", desc_ja: "オレンジとリーキ入りの田舎風ソーセージ3本を炭火焼き", price: "9,50€" },
      { el: "Ποικιλία 2 ατόμων", en: "Charcoal plate for 2", de: "Holzkohle-Platte für 2", ru: "Тарелка на углях на 2 персоны", ja: "炭火プレート 2人前", desc_el: "Μεγάλη ποικιλία για 2 : σουβλάκι, μπιφτέκι, πανσέτα, λουκάνικο — με όλες τις γαρνιτούρες", desc_en: "Generous charcoal plate for 2: souvlaki, burger, pork belly, sausage — with all the trimmings", desc_de: "Großzügige Holzkohle-Platte für 2: Souvlaki, Burger, Schweinebauch, Wurst — mit allen Beilagen", desc_ru: "Щедрая тарелка на углях на 2 персоны: сувлаки, бургер, грудинка, колбаска — со всеми гарнирами", desc_ja: "2人前のたっぷり炭火プレート：スブラキ、バーガー、豚バラ、ソーセージ — 全付け合わせ付き", price: "16,00€" },
    ],
  },
  {
    title_el: "Χάμπουργκερ",
    title_en: "Hamburger",
    title_de: "Hamburger",
    title_ru: "Гамбургеры",
    title_ja: "ハンバーガー",
    photo: "/photos/efood-64-800w.webp",
    items: [
      { el: "Χάμπουργκερ Κλασικό", en: "Classic Hamburger", de: "Klassischer Hamburger", ru: "Классический гамбургер", ja: "クラシック・ハンバーガー", desc_el: "μπιφτέκι μοσχαρίσιο, τυρί cheddar, πράσινη σαλάτα, ντομάτα, κρεμμύδι, πατάτες", desc_en: "beef burger, cheddar cheese, lettuce, tomato, onion, fries", desc_de: "Rinder-Burger, Cheddar-Käse, Salat, Tomate, Zwiebel, Pommes", desc_ru: "говяжья котлета, сыр чеддер, салат, помидор, лук, картофель фри", desc_ja: "ビーフパティ、チェダーチーズ、レタス、トマト、玉ねぎ、ポテト", price: "7,00€" },
      { el: "Χάμπουργκερ Διπλό", en: "Double Hamburger", de: "Doppel-Hamburger", ru: "Двойной гамбургер", ja: "ダブル・ハンバーガー", desc_el: "διπλό μπιφτέκι, διπλό cheddar, πράσινη σαλάτα, ντομάτα, κρεμμύδι, πατάτες", desc_en: "double beef burger, double cheddar, lettuce, tomato, onion, fries", desc_de: "doppelter Rinder-Burger, doppelter Cheddar, Salat, Tomate, Zwiebel, Pommes", desc_ru: "двойная говяжья котлета, двойной чеддер, салат, помидор, лук, картофель фри", desc_ja: "ダブルビーフパティ、ダブルチェダー、レタス、トマト、玉ねぎ、ポテト", price: "9,50€" },
      { el: "Cheeseburger της Τρούμπας", en: "Trouba's Cheeseburger", de: "Trouba-Cheeseburger", ru: "Чизбургер Трумбы", ja: "トルンバ・チーズバーガー", desc_el: "μπιφτέκι, διπλό cheddar, μπέικον, αυγό τηγανητό, πατάτες", desc_en: "burger, double cheddar, bacon, fried egg, fries", desc_de: "Burger, doppelter Cheddar, Speck, Spiegelei, Pommes", desc_ru: "котлета, двойной чеддер, бекон, жареное яйцо, картофель фри", desc_ja: "パティ、ダブルチェダー、ベーコン、目玉焼き、ポテト", price: "8,50€" },
      { el: "BBQ Burger", en: "BBQ Burger", de: "BBQ-Burger", ru: "BBQ Бургер", ja: "BBQバーガー", desc_el: "μπιφτέκι, καπνιστό τυρί, καραμελωμένο κρεμμύδι, BBQ sauce, πατάτες", desc_en: "burger, smoked cheese, caramelised onion, BBQ sauce, fries", desc_de: "Burger, geräucherter Käse, karamellisierte Zwiebel, BBQ-Sauce, Pommes", desc_ru: "котлета, копчёный сыр, карамелизированный лук, BBQ соус, картофель фри", desc_ja: "パティ、スモークチーズ、キャラメル玉ねぎ、BBQソース、ポテト", price: "8,50€" },
      { el: "+ Έξτρα μπέικον", en: "+ extra bacon", de: "+ Extra Speck", ru: "+ доп. бекон", ja: "+ ベーコン追加", price: "+0,70€" },
      { el: "+ Έξτρα cheddar", en: "+ extra cheddar", de: "+ Extra Cheddar", ru: "+ доп. чеддер", ja: "+ チェダー追加", price: "+0,70€" },
      { el: "+ Έξτρα αυγό", en: "+ extra fried egg", de: "+ Extra Spiegelei", ru: "+ доп. жареное яйцо", ja: "+ 目玉焼き追加", price: "+0,80€" },
    ],
  },
  {
    title_el: "Veggie Menu",
    title_en: "Veggie Menu",
    title_de: "Veggie-Menü",
    title_ru: "Вегетарианское меню",
    title_ja: "ベジメニュー",
    photo: "/photos/efood-veggie-mix-800w.webp",
    note_el: "Χορτοφαγικές και vegan επιλογές — φτιαγμένες με την ίδια φροντίδα",
    note_en: "Vegetarian and vegan options — made with the same care",
    note_de: "Vegetarische und vegane Optionen — mit der gleichen Sorgfalt zubereitet",
    note_ru: "Вегетарианские и веганские варианты — приготовлены с той же заботой",
    note_ja: "ベジタリアン・ヴィーガン対応 — 同じ心遣いで調理",
    items: [
      { el: "Μπιφτέκι λαχανικών τμχ", en: "Vegetable Stick pc", de: "Gemüse-Patty Stück", ru: "Овощная котлета шт.", ja: "野菜パティ 1個", desc_el: "Σπιτικό μπιφτέκι λαχανικών με καρότο, κολοκυθάκι, πατάτα και μυρωδικά", desc_en: "Homemade vegetable patty with carrot, zucchini, potato and herbs", desc_de: "Hausgemachtes Gemüse-Patty mit Karotte, Zucchini, Kartoffel und Kräutern", desc_ru: "Домашняя овощная котлета с морковью, кабачком, картофелем и зеленью", desc_ja: "人参、ズッキーニ、じゃがいも、ハーブ入りの自家製野菜パティ", price: "2,00€" },
      { el: "Τυλιχτό Μπιφτέκι λαχανικών", en: "Wrapped Vegetable Burger", de: "Gemüse-Burger im Pita-Wrap", ru: "Овощной бургер в пите", ja: "野菜バーガー・ピタラップ", desc_el: "Πίτα τυλιχτή με μπιφτέκι λαχανικών, ντομάτα, μαρούλι και πατάτες", desc_en: "Wrapped pita with vegetable patty, tomato, lettuce and fries", desc_de: "Pita-Wrap mit Gemüse-Patty, Tomate, Salat und Pommes", desc_ru: "Пита-ролл с овощной котлетой, помидором, салатом и картофелем фри", desc_ja: "野菜パティ、トマト、レタス、ポテトをピタで包んだラップ", price: "3,50€" },
      { el: "Λουκάνικο σουπιάς τμχ", en: "Sepia Sausage pc", de: "Tintenfisch-Wurst Stück", ru: "Колбаска из каракатицы шт.", ja: "セピア（イカ）ソーセージ 1本", desc_el: "Θαλασσινό λουκάνικο από σουπιά — υφή λεπτή, γεύση θαλασσινή", desc_en: "Seafood sausage made from sepia (cuttlefish) — delicate texture, sea flavour", desc_de: "Meeresfrüchte-Wurst aus Tintenfisch — feine Textur, Meeresgeschmack", desc_ru: "Морская колбаска из каракатицы — нежная текстура, морской вкус", desc_ja: "コウイカで作る海の幸ソーセージ — 繊細な食感と海の風味", price: "2,30€" },
      { el: "Τυλιχτό Λουκάνικο σουπιάς", en: "Wrapped Sepia Sausage", de: "Tintenfisch-Wurst im Pita-Wrap", ru: "Колбаска из каракатицы в пите", ja: "セピアソーセージ・ピタラップ", desc_el: "Πίτα με λουκάνικο σουπιάς, ντομάτα, μαρούλι, πατάτες", desc_en: "Pita wrap with sepia sausage, tomato, lettuce, fries", desc_de: "Pita-Wrap mit Tintenfisch-Wurst, Tomate, Salat, Pommes", desc_ru: "Пита-ролл с колбаской из каракатицы, помидор, салат, картофель фри", desc_ja: "セピアソーセージ、トマト、レタス、ポテトのピタラップ", price: "3,80€" },
      { el: "Τυλιχτό Ρεβυθοκεφτές", en: "Wrapped Chickpea Fritter", de: "Kichererbsen-Puffer im Pita-Wrap", ru: "Нутовая оладья в пите", ja: "ひよこ豆フリッターのピタラップ", desc_el: "Πίτα με σπιτικούς ρεβυθοκεφτέδες (vegan), ντομάτα, μαρούλι, πατάτες", desc_en: "Pita with homemade chickpea fritters (vegan), tomato, lettuce, fries", desc_de: "Pita mit hausgemachten Kichererbsen-Puffern (vegan), Tomate, Salat, Pommes", desc_ru: "Пита с домашними нутовыми оладьями (веган), помидор, салат, картофель фри", desc_ja: "自家製ひよこ豆フリッター（ヴィーガン）、トマト、レタス、ポテトのピタ", price: "3,50€" },
      { el: "Τυλιχτό Κολοκυθοκεφτές", en: "Wrapped Zucchini Fritter", de: "Zucchini-Puffer im Pita-Wrap", ru: "Кабачковая оладья в пите", ja: "ズッキーニフリッターのピタラップ", desc_el: "Πίτα με σπιτικούς κολοκυθοκεφτέδες (περιέχει φέτα), ντομάτα, μαρούλι, πατάτες", desc_en: "Pita with homemade zucchini fritters (contains feta), tomato, lettuce, fries", desc_de: "Pita mit hausgemachten Zucchini-Puffern (enthält Feta), Tomate, Salat, Pommes", desc_ru: "Пита с домашними кабачковыми оладьями (содержит фету), помидор, салат, картофель фри", desc_ja: "自家製ズッキーニフリッター（フェタを含む）、トマト、レタス、ポテトのピタ", price: "3,50€" },
      { el: "Τυλιχτό Κολοκυθο-Ρεβυθοκεφτές", en: "Wrapped Zucchini-Chickpea Fritters", de: "Zucchini-Kichererbsen-Puffer im Pita-Wrap", ru: "Кабачково-нутовые оладьи в пите", ja: "ズッキーニ＆ひよこ豆フリッターのピタラップ", desc_el: "Πίτα με συνδυασμό κολοκυθοκεφτέδων και ρεβυθοκεφτέδων — κολοκυθάκι & φαλάφελ μαζί, ντομάτα, μαρούλι, πατάτες", desc_en: "Pita with both zucchini and chickpea fritters — zucchini & falafel combo, tomato, lettuce, fries", desc_de: "Pita mit Zucchini- und Kichererbsen-Puffern — Zucchini & Falafel kombiniert, Tomate, Salat, Pommes", desc_ru: "Пита с кабачковыми и нутовыми оладьями — комбо кабачок и фалафель, помидор, салат, картофель фри", desc_ja: "ズッキーニとひよこ豆のフリッター — ズッキーニ＆ファラフェルの組み合わせ、トマト、レタス、ポテトのピタ", price: "3,80€" },
      { el: "Τυλιχτό Οικολογικό", en: "Wrapped pita without meat", de: "Pita-Wrap ohne Fleisch", ru: "Пита без мяса", ja: "ノーミートピタラップ", desc_el: "Vegan επιλογή χωρίς κρέας : ντομάτα, κρεμμύδι, μαρούλι, πατάτες σε πίτα", desc_en: "Vegan option without meat: tomato, onion, lettuce, fries in a pita", desc_de: "Vegane Option ohne Fleisch: Tomate, Zwiebel, Salat, Pommes in einer Pita", desc_ru: "Веганский вариант без мяса: помидор, лук, салат, картофель фри в пите", desc_ja: "肉なしのヴィーガン選択：トマト、玉ねぎ、レタス、ポテトをピタで", price: "2,50€" },
      { el: "Veggie Burger", en: "Veggie Burger", de: "Veggie-Burger", ru: "Веган бургер", ja: "ベジバーガー", desc_el: "Μεγάλος vegan burger : ντομάτα, πράσινη σαλάτα, νηστίσιμο τυρί, κέτσαπ, μουστάρδα, πατάτες", desc_en: "Generous vegan burger: tomato, lettuce, vegan cheese, ketchup, mustard, fries", desc_de: "Großzügiger veganer Burger: Tomate, Salat, veganer Käse, Ketchup, Senf, Pommes", desc_ru: "Сытный веган-бургер: помидор, салат, веган сыр, кетчуп, горчица, картофель фри", desc_ja: "ボリュームたっぷりのヴィーガンバーガー：トマト、レタス、ヴィーガンチーズ、ケチャップ、マスタード、ポテト", price: "7,00€" },
      { el: "Καλαμάκι Σεϊτάν τμχ", en: "Seitan skewer pc", de: "Seitan-Spieß Stück", ru: "Шашлычок сейтан шт.", ja: "セイタン串 1本", desc_el: "Σουβλάκι σεϊτάν — φυτική πρωτεΐνη γλουτένης που μοιάζει με κρέας, στα κάρβουνα", desc_en: "Seitan skewer — plant-based wheat protein with meaty texture, charcoal-grilled", desc_de: "Seitan-Spieß — pflanzliches Weizenprotein mit fleischiger Textur, vom Holzkohlegrill", desc_ru: "Шашлычок из сейтана — растительный пшеничный белок с мясной текстурой, на углях", desc_ja: "セイタン串 — 肉に似た食感の植物性小麦タンパクを炭火焼き", price: "2,60€" },
      { el: "Κεμπάπ Σεϊτάν", en: "Seitan kebab", de: "Seitan-Kebab", ru: "Кебаб сейтан", ja: "セイタン・ケバブ", desc_el: "Κεμπάπ από σεϊτάν με ανατολίτικα μπαχαρικά — vegan", desc_en: "Seitan kebab with eastern spices — vegan", desc_de: "Seitan-Kebab mit östlichen Gewürzen — vegan", desc_ru: "Кебаб из сейтана с восточными специями — веган", desc_ja: "東洋スパイス使用のセイタンケバブ — ヴィーガン", price: "2,60€" },
      { el: "Τυλιχτό Σεϊτάν Κεμπάπ", en: "Wrapped Seitan Kebab", de: "Seitan-Kebab im Pita-Wrap", ru: "Кебаб сейтан в пите", ja: "セイタンケバブのピタラップ", desc_el: "Πίτα τυλιχτή με κεμπάπ σεϊτάν, ανατολίτικα μπαχαρικά, ντομάτα, μαρούλι και πατάτες — vegan", desc_en: "Wrapped pita with seitan kebab, eastern spices, tomato, lettuce and fries — vegan", desc_de: "Pita-Wrap mit Seitan-Kebab, östlichen Gewürzen, Tomate, Salat und Pommes — vegan", desc_ru: "Пита-ролл с кебабом сейтан, восточные специи, помидор, салат и картофель фри — веган", desc_ja: "セイタンケバブ、東洋スパイス、トマト、レタス、ポテトのピタラップ — ヴィーガン", price: "3,80€" },
      { el: "Τυλιχτό Σεϊτάν Καλαμάκι", en: "Wrapped Seitan Skewer", de: "Seitan-Spieß im Pita-Wrap", ru: "Сейтан шашлычок в пите", ja: "セイタン串のピタラップ", desc_el: "Πίτα τυλιχτή με καλαμάκι σεϊτάν στα κάρβουνα, ντομάτα, μαρούλι και πατάτες — vegan", desc_en: "Wrapped pita with charcoal-grilled seitan skewer, tomato, lettuce and fries — vegan", desc_de: "Pita-Wrap mit Seitan-Spieß vom Holzkohlegrill, Tomate, Salat und Pommes — vegan", desc_ru: "Пита-ролл с сейтан-шашлычком на углях, помидор, салат и картофель фри — веган", desc_ja: "炭火焼きセイタン串、トマト、レタス、ポテトのピタラップ — ヴィーガン", price: "3,80€" },
    ],
  },
  {
    title_el: "Σάντουιτς & Σκεπαστή",
    title_en: "Sandwich & Skepasti",
    title_de: "Sandwich & Skepasti",
    title_ru: "Сэндвич и Скепасти",
    title_ja: "サンドイッチ＆スケパスティ",
    photo: "/photos/efood-sandwich-skepasti-800w.webp",
    note_el: "Η σκεπαστή είναι πίτα γεμιστή και κλειστή στη σχάρα — μια ιδιαιτερότητα του Πειραιά",
    note_en: "Skepasti is a stuffed pita closed and pressed on the grill — a Piraeus specialty",
    note_de: "Skepasti ist eine gefüllte und auf dem Grill geschlossene Pita — eine Spezialität aus Piräus",
    note_ru: "Скепасти — это пита с начинкой, прижатая на гриле — фирменное блюдо Пирея",
    note_ja: "スケパスティとは具を詰めてグリルでプレスして閉じたピタ — ピレウスの名物",
    items: [
      { el: "Σάντουιτς με κρέας της επιλογής σας", en: "Sandwich with meat of your choice", de: "Sandwich mit Fleisch nach Wahl", ru: "Сэндвич с мясом на ваш выбор", ja: "お好みの肉のサンドイッチ", desc_el: "Σπιτικό ψωμί ψημένο, με το κρέας της επιλογής σας (χοιρινό/κοτόπουλο/γύρος), ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "Toasted house bread with your choice of meat (pork/chicken/gyros), tomato, lettuce, tzatziki, fries", desc_de: "Geröstetes Hausbrot mit Fleisch nach Wahl (Schwein/Hähnchen/Gyros), Tomate, Salat, Tzatziki, Pommes", desc_ru: "Поджаренный домашний хлеб с мясом на выбор (свинина/курица/гирос), помидор, салат, цацики, картофель фри", desc_ja: "自家製パンをトーストし、お好みの肉（豚/鶏/ギロス）、トマト、レタス、ツァジキ、ポテト", price: "4,50€" },
      { el: "Σάντουιτς με διπλό κρέας", en: "Sandwich with double meat", de: "Sandwich mit doppeltem Fleisch", ru: "Сэндвич с двойным мясом", ja: "ダブルミートサンドイッチ", desc_el: "Σάντουιτς με διπλή μερίδα κρέατος, ντομάτα, μαρούλι, τζατζίκι, πατάτες", desc_en: "Double-meat sandwich, tomato, lettuce, tzatziki, fries", desc_de: "Sandwich mit doppelter Fleischportion, Tomate, Salat, Tzatziki, Pommes", desc_ru: "Сэндвич с двойной порцией мяса, помидор, салат, цацики, картофель фри", desc_ja: "ダブルミートのサンドイッチ、トマト、レタス、ツァジキ、ポテト", price: "5,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας", en: "Skepasti with meat of your choice", de: "Skepasti mit Fleisch nach Wahl", ru: "Скепасти с мясом на ваш выбор", ja: "お好みの肉のスケパスティ", desc_el: "Πίτα γεμιστή με κρέας, ντομάτα, μαρούλι, σπιτική σως, πατάτες, τυρί γκούντα που λιώνει — κλειστή στη σχάρα", desc_en: "Pita stuffed with meat, tomato, lettuce, house sauce, fries, melted gouda — pressed closed on the grill", desc_de: "Gefüllte Pita mit Fleisch, Tomate, Salat, Hausssauce, Pommes, geschmolzenem Gouda — auf dem Grill verschlossen", desc_ru: "Пита с мясной начинкой, помидор, салат, фирменный соус, картофель фри, плавленая гауда — закрыта на гриле", desc_ja: "肉、トマト、レタス、自家製ソース、ポテト、溶けたゴーダを詰めたピタ — グリルでプレス", price: "7,50€" },
      { el: "Σκεπαστή με κρέας της επιλογής σας (διπλό)", en: "Skepasti — double meat", de: "Skepasti — doppeltes Fleisch", ru: "Скепасти — двойное мясо", ja: "スケパスティ — ダブルミート", desc_el: "Σκεπαστή με διπλή μερίδα κρέατος — πιο γενναιόδωρη, ίδιες γαρνιτούρες", desc_en: "Double-meat skepasti — more generous, same toppings", desc_de: "Skepasti mit doppelter Fleischportion — großzügiger, gleiche Beläge", desc_ru: "Скепасти с двойной порцией мяса — щедрее, та же начинка", desc_ja: "ダブルミートのスケパスティ — ボリュームアップ、同じトッピング", price: "9,50€" },
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
