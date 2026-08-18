// Source of truth: prisma/menu.raw.txt
// Base language is Azerbaijani (title). English and Russian translations
// can be filled in per-item from the admin panel later.
//
// Set menus (Rus seti, Nastoyka seti, Çay dəstgahı) get isSet=true and
// render as premium cards on the public menu.

export interface SeedItem {
  title: string
  titleEn?: string
  titleRu?: string
  subtitle?: string
  subtitleEn?: string
  subtitleRu?: string
  description?: string
  descriptionEn?: string
  descriptionRu?: string
  price: number
  priceLabel?: string
  isSet?: boolean
}

export interface SeedCategory {
  slug: string
  name: string
  nameEn: string
  nameRu: string
  items: SeedItem[]
}

export const menuData: SeedCategory[] = [
  {
    slug: 'sorbalar',
    name: 'Şorbalar',
    nameEn: 'Soups',
    nameRu: 'Супы',
    items: [
      { title: 'Borş', price: 10 },
      { title: 'Toyuq şorbası', price: 6 },
      { title: 'Düşbərə', price: 6 },
    ],
  },
  {
    slug: 'soyuq-qelyanaltilar',
    name: 'Soyuq qəlyanaltılar',
    nameEn: 'Cold Appetizers',
    nameRu: 'Холодные закуски',
    items: [
      { title: 'Tərəvəz buketi', price: 10 },
      { title: 'Turşu assortisi', price: 12 },
      { title: 'Zeytun assortisi', price: 6 },
      { title: 'Badımcan ikrası', price: 5 },
      { title: 'Leço', price: 5 },
      { title: 'Dana ciyəri paşteti', price: 10 },
      { title: 'Toyuq və fındıqlı paştet', price: 10 },
      { title: 'Ət assortisi', price: 22 },
      { title: 'Kolbasa assortisi', price: 20 },
      { title: 'Yerli pendir tabağı', price: 15 },
      { title: 'Avropa pendirləri tabağı', price: 18 },
    ],
  },
  {
    slug: 'salatlar',
    name: 'Salatlar',
    nameEn: 'Salads',
    nameRu: 'Салаты',
    items: [
      { title: 'Pabeda ət salatı', price: 20 },
      { title: 'Abşeron salatı', price: 7 },
      { title: 'Paytaxt salatı', price: 8 },
      { title: 'Mimoza, toyuq ilə', price: 8 },
      { title: 'Femi', price: 10 },
      { title: 'Fit salatı', subtitle: 'avokado, toyuq, kinoa', price: 14 },
      { title: 'Şuba, siyənək ilə', price: 9 },
      { title: 'Gürcü salatı', price: 9 },
      { title: 'Xırt-xırt badımcan salatı', price: 11 },
      { title: 'Popkorn salatı, toyuq ilə', price: 16 },
      { title: 'Popkorn salatı, krevet ilə', price: 20 },
      { title: 'Sezar, toyuq ilə', price: 16 },
      { title: 'Sezar, krevet ilə', price: 20 },
      { title: 'Sezar, qızıl balıq ilə', price: 20 },
    ],
  },
  {
    slug: 'tez-bazar',
    name: 'Tez-bazar',
    nameEn: 'Quick Bites',
    nameRu: 'Быстрые закуски',
    items: [
      { title: 'Pabeda Burger, fri ilə', price: 18 },
      { title: 'Sezar Roll, fri ilə', price: 14 },
      { title: 'Nagetslər, fri ilə', price: 9 },
      { title: 'Pendir çubuqları', price: 10 },
      { title: 'Toyuq qanadları', subtitle: 'BBQ / acılı', price: 12 },
      { title: 'Kartof fri', price: 5 },
    ],
  },
  {
    slug: 'isti-yemekler',
    name: 'İsti yeməklər',
    nameEn: 'Hot Dishes',
    nameRu: 'Горячие блюда',
    items: [
      { title: 'Pabeda Steak', price: 45 },
      { title: 'Pabeda medalyonları', price: 32 },
      { title: 'Brisket', price: 20 },
      { title: 'Parça ət', price: 20 },
      { title: 'Asobuko', price: 22 },
      { title: 'Sümüyetto', price: 16 },
      { title: 'Can əti qutab və pendirli', price: 25 },
      { title: 'Jarko, quzu əti ilə', price: 21 },
      { title: 'Jarko, can əti ilə', price: 25 },
      { title: 'Vişnəli can əti', price: 25 },
      { title: 'İspanaqlı can əti', price: 25 },
      { title: 'Zirincili dana', price: 20 },
      { title: 'Nar qovurma', price: 17 },
      { title: 'Tuşonka', price: 17 },
      { title: 'Ciz-biz', price: 12 },
    ],
  },
  {
    slug: 'toyuq-yemekleri',
    name: 'Toyuq yeməkləri',
    nameEn: 'Chicken Dishes',
    nameRu: 'Блюда из курицы',
    items: [
      { title: 'Çolpa, limonlu', price: 20 },
      { title: 'Mərakeş toyuğu', price: 22 },
      { title: 'Kənd toyuğu çığırtması', price: 22 },
      { title: 'Tabaka, kartof ilə', price: 22 },
      { title: 'Kiyev kotleti, kartof püresi ilə', price: 16 },
      { title: 'Toyuq kotleti', price: 10 },
    ],
  },
  {
    slug: 'et-ve-kotletler',
    name: 'Ət və kotletlər',
    nameEn: 'Meat & Cutlets',
    nameRu: 'Мясо и котлеты',
    items: [
      { title: 'Yarpaq dolması', price: 12 },
      { title: 'Ət kotleti, tərəvəz ilə', price: 16 },
      { title: 'Balıq kotleti, kartof püresi ilə', price: 16 },
    ],
  },
  {
    slug: 'baliq-ve-deniz-mehsullari',
    name: 'Balıq və dəniz məhsulları',
    nameEn: 'Fish & Seafood',
    nameRu: 'Рыба и морепродукты',
    items: [
      { title: 'Salmon, qara düyü ilə', price: 24 },
      { title: 'Qızıl balıq steyki', price: 28 },
      { title: 'Forel, tavada', price: 24 },
      { title: 'Dorado, tavada', price: 26 },
      { title: 'Krevetka Tempura', price: 18 },
      { title: 'Krevetka Sarımsaqlı', price: 19 },
      { title: 'Krevetka Dəniz', price: 13 },
      { title: 'Krevetka Okean', price: 18 },
      { title: 'Krevetka Dinamik', price: 20 },
      { title: 'Kalmar halqaları', price: 10 },
    ],
  },
  {
    slug: 'qarnirler',
    name: 'Qarnirlər',
    nameEn: 'Sides',
    nameRu: 'Гарниры',
    items: [
      { title: 'Ev sayağı kartof', price: 5 },
      { title: 'Kartof püresi', price: 5 },
      { title: 'Sadə düyü', price: 5 },
      { title: 'Tərəvəzli düyü', price: 5 },
      { title: 'Qarabaşaq', price: 5 },
      { title: 'Qril tərəvəzləri', price: 5 },
    ],
  },
  {
    slug: 'sovet-klassikasi',
    name: 'Sovet klassikası',
    nameEn: 'Soviet Classics',
    nameRu: 'Советская классика',
    items: [
      { title: 'Siyənək, kartof ilə', price: 12 },
      {
        title: 'Rus seti, 2 nəfərlik',
        titleRu: 'Русский сет, на 2 персон',
        titleEn: 'Russian Set, for 2',
        price: 30,
        isSet: true,
      },
      {
        title: 'Rus seti, 4 nəfərlik',
        titleRu: 'Русский сет, на 4 персон',
        titleEn: 'Russian Set, for 4',
        price: 50,
        isSet: true,
      },
      { title: 'Ədviyyatlı salo', price: 10 },
      { title: 'Pelmeni, pendirli', price: 14 },
      { title: 'Pelmeni, bulyonlu', price: 12 },
      { title: 'Blinçik, göbələkli', price: 7 },
      { title: 'Blinçik, toyuqlu', price: 8 },
      { title: 'Blinçik, ətli', price: 9 },
    ],
  },
  {
    slug: 'sosis-cesidleri',
    name: 'Sosis çeşidləri',
    nameEn: 'Sausages',
    nameRu: 'Сосиски',
    items: [
      { title: 'İveriya', price: 12 },
      { title: 'Südlü', price: 9 },
      { title: 'Ovçu', price: 9 },
      { title: 'Sardelka', price: 14 },
    ],
  },
  {
    slug: 'pive-mezeleri',
    name: 'Pivə məzələri',
    nameEn: 'Beer Snacks',
    nameRu: 'Закуски к пиву',
    items: [
      { title: 'Toyuq çipsi', price: 7 },
      { title: 'Toyuq popkornu', price: 8 },
      { title: 'Göbələk çipsi', price: 5 },
      { title: 'Kolbasa çipsi', price: 8 },
      { title: 'Krakov topları, pendirli', price: 15 },
      { title: 'Krakov topları, tomat sousunda', price: 13 },
      { title: 'Pendirli qrenki', price: 6 },
      { title: 'Saçaqlı pendir, sadə', price: 5 },
      { title: 'Saçaqlı pendir, qızardılmış', price: 6 },
      { title: 'Boğaz, qızardılmış', price: 6 },
      { title: 'Boğaz, hisə verilmiş', price: 8 },
      { title: 'Dorado, hisə verilmiş', price: 20 },
      { title: 'Forel, hisə verilmiş', price: 18 },
      { title: 'Mini çorat qutabı', subtitle: '3 ədəd', price: 5 },
      { title: 'Ət basdırması', price: 8 },
      { title: 'Düşbərə', price: 7 },
      { title: 'Gürzə', price: 8 },
      { title: 'Püstə', price: 8 },
      { title: 'Potənək, sadə', price: 6 },
      { title: 'Potənək, zoğal turşulu', price: 7 },
      { title: 'Noxud', price: 4 },
    ],
  },
  {
    slug: 'buterbrodlar',
    name: 'Buterbrodlar',
    nameEn: 'Sandwiches',
    nameRu: 'Бутерброды',
    items: [
      { title: 'Sprot ilə', price: 8 },
      { title: 'Tuna ilə', price: 13 },
      { title: 'Krevet ilə', price: 16 },
      { title: 'Hisə verilmiş nərə balığı ilə', price: 18 },
      { title: 'Hisə verilmiş qızıl balıq ilə', price: 17 },
    ],
  },
  {
    slug: 'suzmeli-pive',
    name: 'Süzməli pivə',
    nameEn: 'Draught Beer',
    nameRu: 'Разливное пиво',
    items: [
      { title: 'Xırdalan N/F', subtitle: '0.3 / 0.5 L', price: 3.5, priceLabel: '3.50 / 4.00 ₼' },
      { title: 'Xırdalan', subtitle: '0.3 / 0.5 L', price: 3.5, priceLabel: '3.50 / 4.00 ₼' },
      { title: 'Brevl N/F', subtitle: '0.3 / 0.5 L', price: 3.5, priceLabel: '3.50 / 6.00 ₼' },
      { title: 'Brevl', subtitle: '0.3 / 0.5 L', price: 3.5, priceLabel: '3.50 / 6.00 ₼' },
      { title: 'Blanc 1664', subtitle: '0.3 / 0.5 L', price: 7.5, priceLabel: '7.50 / 8.50 ₼' },
      { title: 'Alivaria N/F', subtitle: '0.3 / 0.5 L', price: 5.5, priceLabel: '5.50 / 6.50 ₼' },
      { title: 'Erdinger', subtitle: '0.3 / 0.5 L', price: 7.5, priceLabel: '7.50 / 8.50 ₼' },
    ],
  },
  {
    slug: 'susse-pive',
    name: 'Şüşə pivə',
    nameEn: 'Bottled Beer',
    nameRu: 'Бутылочное пиво',
    items: [
      { title: 'Efes Zero', subtitle: '0.33 L', price: 6 },
      { title: 'Heineken', subtitle: '0.33 L', price: 7 },
      { title: 'Corona', subtitle: '0.33 L', price: 8 },
      { title: 'Erdinger', subtitle: '0.33 L', price: 9 },
    ],
  },
  {
    slug: 'vodka',
    name: 'Vodka',
    nameEn: 'Vodka',
    nameRu: 'Водка',
    items: [
      { title: 'Absolut', subtitle: '50 ml / 0.5 L / 1 L', price: 7, priceLabel: '7 / 55 / 90 ₼' },
      { title: 'Finlandia', subtitle: '50 ml / 0.5 L / 1 L', price: 7, priceLabel: '7 / 55 / 90 ₼' },
      { title: 'Russkiy Standart', subtitle: '50 ml / 0.7 L / 1 L', price: 6, priceLabel: '6 / 60 / 85 ₼' },
      { title: 'Grey Goose', subtitle: '50 ml / 1 L', price: 10, priceLabel: '10 / 160 ₼' },
      { title: 'Louvre', subtitle: '0.5 / 0.7 / 1 L', price: 40, priceLabel: '40 / 54 / 63 ₼' },
      { title: 'Bolşoy Qorod', subtitle: '0.5 / 0.7 / 1 L', price: 36, priceLabel: '36 / 45 / 54 ₼' },
    ],
  },
  {
    slug: 'nastoyka',
    name: 'Nastoyka',
    nameEn: 'Nastoyka',
    nameRu: 'Настойки',
    items: [
      { title: 'Feyxoa', subtitle: '50 ml / 0.7 L', price: 5, priceLabel: '5 / 60 ₼' },
      { title: 'Şaftalı', subtitle: '50 ml / 0.7 L', price: 5, priceLabel: '5 / 60 ₼' },
      { title: 'Albalı', subtitle: '50 ml / 0.7 L', price: 5, priceLabel: '5 / 60 ₼' },
      { title: 'Qarağilə', subtitle: '50 ml / 0.7 L', price: 5, priceLabel: '5 / 60 ₼' },
      { title: 'Moruq', subtitle: '50 ml / 0.7 L', price: 5, priceLabel: '5 / 60 ₼' },
      {
        title: 'Nastoyka seti',
        subtitle: '6 ədəd',
        subtitleEn: '6 pieces',
        subtitleRu: '6 штук',
        titleEn: 'Nastoyka Set',
        titleRu: 'Сет настоек',
        price: 28,
        isSet: true,
      },
    ],
  },
  {
    slug: 'serab-ve-sampan',
    name: 'Şərab & Şampan',
    nameEn: 'Wine & Champagne',
    nameRu: 'Вино и Шампанское',
    items: [
      { title: 'Savalan Aleatico, qırmızı', price: 10, priceLabel: '10 / 40 ₼' },
      { title: 'Savalan Moscato, ağ', price: 10, priceLabel: '10 / 40 ₼' },
      { title: 'Savalan Rosé, çəhrayı', price: 10, priceLabel: '10 / 40 ₼' },
      { title: 'Meysari Marcan, qırmızı', price: 42 },
      { title: 'Meysari Sanam, çəhrayı', price: 42 },
      { title: 'Prosecco', price: 15, priceLabel: '15 / 70 ₼' },
      { title: 'Moët & Chandon', price: 200 },
    ],
  },
  {
    slug: 'viski',
    name: 'Viski',
    nameEn: 'Whisky',
    nameRu: 'Виски',
    items: [
      { title: 'Jameson', subtitle: '50 ml / 0.5 L / 1 L', price: 9, priceLabel: '9 / 70 / 130 ₼' },
      { title: 'Jack Daniel’s', subtitle: '50 ml / 0.5 L / 1 L', price: 10, priceLabel: '10 / 80 / 140 ₼' },
      { title: 'Chivas Regal 12', subtitle: '50 ml / 0.5 L / 1 L', price: 11, priceLabel: '11 / 95 / 150 ₼' },
      { title: 'Chivas Regal 18', subtitle: '50 ml / 1 L', price: 17, priceLabel: '17 / 250 ₼' },
      { title: 'Monkey Shoulder', subtitle: '50 ml / 1 L', price: 10, priceLabel: '10 / 200 ₼' },
      { title: 'Glenfiddich 12', subtitle: '50 ml / 1 L', price: 12, priceLabel: '12 / 180 ₼' },
      { title: 'Macallan 12', subtitle: '50 ml / 0.7 L', price: 20, priceLabel: '20 / 300 ₼' },
      { title: 'Glenmorangie', subtitle: '50 ml / 0.7 L', price: 20, priceLabel: '20 / 290 ₼' },
    ],
  },
  {
    slug: 'import-spirtli',
    name: 'İmport spirtli',
    nameEn: 'Imported Spirits',
    nameRu: 'Импортный алкоголь',
    items: [
      { title: 'Olmeca Silver / Gold', subtitle: '50 ml / 0.5 L / 1 L', price: 9, priceLabel: '9 / 70 / 130 ₼' },
      { title: 'Patrón Silver', subtitle: '50 ml / 0.7 L / 1 L', price: 12, priceLabel: '12 / 170 / 200 ₼' },
      { title: 'Hennessy X.O.', subtitle: '50 ml', price: 18 },
      { title: 'Hennessy V.S.O.P.', subtitle: '50 ml', price: 11 },
      { title: 'Don Julio Silver', subtitle: '50 ml / 0.7 L', price: 15, priceLabel: '15 / 190 ₼' },
      { title: 'Gordon’s', subtitle: '50 ml / 1 L', price: 7, priceLabel: '7 / 100 ₼' },
      { title: 'Hendrick’s', subtitle: '50 ml / 1 L', price: 10, priceLabel: '10 / 160 ₼' },
      { title: 'Jägermeister', subtitle: '50 ml / 0.5 L / 1 L', price: 9, priceLabel: '9 / 70 / 130 ₼' },
      { title: 'Campari', subtitle: '50 ml', price: 7 },
      { title: 'Martini Rosso', subtitle: '50 ml', price: 9 },
    ],
  },
  {
    slug: 'limonad-ve-soyuq-ickiler',
    name: 'Limonad & soyuq içkilər',
    nameEn: 'Lemonades & Cold Drinks',
    nameRu: 'Лимонады и холодные напитки',
    items: [
      { title: 'Limonad', subtitle: 'Tərxun, Düşes, Portağal — 0.33 L / 1 L', price: 8, priceLabel: '8 / 16 ₼' },
      { title: 'Soyuq çay', subtitle: 'Limon, Şaftalı, Qarpız — 0.33 L / 1 L', price: 6, priceLabel: '6 / 12 ₼' },
      { title: 'Təbii sıxma şirə', subtitle: 'Nar / Portağal / Alma', price: 6, priceLabel: '6 / 8 / 6 ₼' },
      { title: 'Turşməzə bir şey', price: 8 },
    ],
  },
  {
    slug: 'sular-ve-alkoqolsuz',
    name: 'Sular & alkoqolsuz içkilər',
    nameEn: 'Waters & Soft Drinks',
    nameRu: 'Вода и безалкогольные',
    items: [
      { title: 'Sirab qazlı / qazsız', subtitle: '0.33 / 0.75 L', price: 5, priceLabel: '5 / 7 ₼' },
      { title: 'Coca-Cola / Fanta / Sprite', subtitle: '0.33 L', price: 5 },
      { title: 'Kompot', subtitle: '0.25 / 1 L', price: 4, priceLabel: '4 / 10 ₼' },
      { title: 'Fuse Tea', subtitle: '0.33 L', price: 5 },
      { title: 'Sarıkız', subtitle: '0.2 L', price: 4 },
      { title: 'Red Bull', subtitle: '0.225 L', price: 8 },
      { title: 'Təbii şirə', subtitle: '0.25 / 1 L', price: 4, priceLabel: '4 / 10 ₼' },
      { title: 'Borjomi', subtitle: '0.5 L', price: 5 },
      { title: 'Tonik', subtitle: '0.33 L', price: 5 },
    ],
  },
  {
    slug: 'isti-ickiler',
    name: 'İsti içkilər',
    nameEn: 'Hot Drinks',
    nameRu: 'Горячие напитки',
    items: [
      { title: 'Çay, qara / yaşıl', price: 10 },
      { title: 'İsti şokolad', price: 5 },
      { title: 'Kakao', price: 5 },
    ],
  },
  {
    slug: 'cay-destgahi',
    name: 'Çay dəstgahı',
    nameEn: 'Tea Ceremonies',
    nameRu: 'Чайная церемония',
    items: [
      {
        title: 'Çay dəstgahı',
        titleEn: 'Tea Ceremony',
        titleRu: 'Чайная церемония',
        description: 'Çay, quru meyvə, çərəz, mürəbbə, Napoleon, paxlava',
        descriptionEn: 'Tea, dried fruits, nuts, jam, Napoleon, baklava',
        descriptionRu: 'Чай, сухофрукты, орехи, варенье, Наполеон, пахлава',
        price: 50,
        isSet: true,
      },
      {
        title: 'Çay dəstgahı + qəlyan',
        titleEn: 'Tea Ceremony + Hookah',
        titleRu: 'Чайная церемония + кальян',
        description: 'Çay, mürəbbə, 2 ədəd paxlava, çərəz, quru meyvə, qəlyan',
        descriptionEn: 'Tea, jam, 2 pieces of baklava, nuts, dried fruits, hookah',
        descriptionRu: 'Чай, варенье, 2 шт. пахлавы, орехи, сухофрукты, кальян',
        price: 75,
        isSet: true,
      },
    ],
  },
  {
    slug: 'sirniyyat',
    name: 'Şirniyyat',
    nameEn: 'Desserts',
    nameRu: 'Десерты',
    items: [
      { title: 'Ballı tort', price: 7 },
      { title: 'Napoleon', price: 5 },
      { title: 'Mürəbbə', price: 7 },
      { title: 'Halva', price: 5 },
      { title: 'Çərəz', price: 12 },
      { title: 'Quru meyvə', price: 12 },
      { title: 'Meyvə tabağı', price: 18 },
      { title: 'Dondurma', price: 7 },
      { title: 'Paxlava', subtitle: 'milli / türk / südlü', price: 7 },
    ],
  },
  {
    slug: 'qelyan',
    name: 'Qəlyan',
    nameEn: 'Hookah',
    nameRu: 'Кальян',
    items: [
      { title: 'Premium', price: 45 },
      { title: 'Sadə', price: 35 },
    ],
  },
  {
    slug: 'eylence-menyusu',
    name: 'Pabeda əyləncə menyusu 😄',
    nameEn: 'Pabeda Fun Menu 😄',
    nameRu: 'Развлекательное меню Победы 😄',
    items: [
      {
        title: 'Qarsonu qov getsin',
        description: '"Gör nə edirsən..." işdən azad etmək.',
        price: 1000,
      },
      {
        title: 'Aşbazı spisat eləmək',
        description: '"Gör nə edirsən..." işdən azad etmək.',
        price: 3000,
      },
      {
        title: 'Meneceri qaraltmaq',
        description: '"Gör nə edirsən..." işdən azad etmək.',
        price: 5000,
      },
    ],
  },
]

// Default settings seeded on first run. All are editable from the admin
// settings page. Colors are stored here so they can be changed without a redeploy.
export const defaultSettings: Record<string, string> = {
  shop_name: 'PABEDA',
  shop_name_en: 'PABEDA',
  shop_name_ru: 'PABEDA',

  tagline: 'Nostalji atmosfer, klassik dadlar',
  tagline_en: 'Nostalgic atmosphere, classic tastes',
  tagline_ru: 'Ностальгическая атмосфера, классические вкусы',

  about:
    'Pabeda — Bakının qəlbində, hər süfrədən ev istiliyi gələn bir yerdir. Ənənəvi Azərbaycan və Sovet mətbəxinin ən yaxşı yeməklərini müasir təqdimatla birlikdə təklif edirik.',
  about_en:
    'Pabeda sits in the heart of Baku, where every table carries the warmth of home. We serve the best of traditional Azerbaijani and Soviet cuisine with a modern touch.',
  about_ru:
    'Pabeda — в сердце Баку, где за каждым столом чувствуется тепло дома. Лучшее из традиционной азербайджанской и советской кухни в современной подаче.',

  hours: 'Hər gün 15:00 – 02:00',
  hours_en: 'Every day 15:00 – 02:00',
  hours_ru: 'Ежедневно 15:00 – 02:00',

  address: 'Bəsti Bağırova küç. 2A, Bakı',
  address_en: 'Basti Bagirova st. 2A, Baku',
  address_ru: 'ул. Бести Багировой 2А, Баку',

  phone: '+994 50 702 72 22',
  email: '',
  whatsapp: 'https://wa.me/994507027222',
  instagram: 'https://www.instagram.com/pabeda.restoran/',
  facebook: '',

  service_charge_note: '10% xidmət haqqı hesabınıza əlavə olunur.',
  service_charge_note_en: 'A 10% service charge is added to your bill.',
  service_charge_note_ru: 'К счёту добавляется 10% за обслуживание.',

  currency_symbol: '₼',
  default_locale: 'az',

  theme_primary: '#D91E1E',
  theme_accent: '#C89632',
}
