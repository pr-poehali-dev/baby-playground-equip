export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface SubSubcategory {
  name: string;
  image: string;
}

export interface Subcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubcategory[];
}

export const categories = [
  {
    id: 'playground-urban',
    name: 'Игровое оборудование "Classic"',
    icon: 'Smile',
    color: 'from-primary/20 to-primary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/урбанигра.png',
    order: 1,
    subcategories: [
      { name: 'Игровые комплексы', image: 'https://cdn.poehali.dev/files/237.png' },
      { name: 'Балансиры', image: 'https://cdn.poehali.dev/files/мишкаа.png' },
      { name: 'Горки', image: 'https://cdn.poehali.dev/files/0100.png' },
      { name: 'Домики', image: 'https://cdn.poehali.dev/files/домик 2.png' },
      { name: 'Качели', image: 'https://cdn.poehali.dev/files/качели.png' },
      { name: 'Карусели', image: 'https://cdn.poehali.dev/files/карусель.png' },
      { name: 'Качалки', image: 'https://cdn.poehali.dev/files/качалка.png' },
      { name: 'Песочницы', image: 'https://cdn.poehali.dev/files/песочница.png' },
      { name: 'Веревочный парк', image: 'https://cdn.poehali.dev/files/веревочный.png' },
      { name: 'Скалодром', image: 'https://cdn.poehali.dev/files/скалодром.png' },
      { name: 'Полоса препятствий', image: 'https://cdn.poehali.dev/files/полоса.png' },
      { name: 'Техника', image: 'https://cdn.poehali.dev/files/техника.png' },
      { name: 'Лазы', image: 'https://cdn.poehali.dev/files/лазpng.png' },
      { name: 'Игровые элементы', image: '🎮' },
      { name: 'Теневые навесы', image: '⛱️' },
      { name: 'Ограждения', image: '🚧' },
      { name: 'Столики и скамейки', image: '🪑' }
    ]
  },
  {
    id: 'sports-urban',
    name: 'Спортивное оборудование "Classic"',
    icon: 'Dumbbell',
    color: 'from-secondary/20 to-secondary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/урбан спрот1.png',
    order: 2,
    subcategories: [
      { name: 'Workout', image: '💪' },
      { name: 'Ворота, стойки, щиты', image: '🥅' },
      { name: 'Полоса препятствий ГТО', image: '🏅' },
      { 
        name: 'Спортивные комплексы', 
        image: '⛹️', 
        hasChildren: true,
        children: [
          { name: 'Комплексы для младшей возрастной группы', image: '👶' },
          { name: 'Комплексы для старшей возрастной группы', image: '👦' },
          { name: 'Комплексы на металлических стойках', image: '🔩' },
          { name: 'Комплексы-лабиринты', image: '🌀' },
          { name: 'Комплексы-скалодромы', image: '🧗' }
        ]
      },
      { name: 'Скамьи гимнастические', image: '🪑' },
      { name: 'Оборудование для скейт-парков', image: '🛹' },
      { name: 'Спортивные снаряды', image: '🏋️' },
      { 
        name: 'Тренажеры уличные', 
        image: '🚴', 
        hasChildren: true,
        children: [
          { name: 'Одиночные', image: '1️⃣' },
          { name: 'Комбинированные', image: '🔢' },
          { name: 'Детские, силовые, для маломобильной группы', image: '♿' }
        ]
      },
      { name: 'Трибуны сборно-разборные', image: '🏟️' },
      { name: 'Спортивные сетки', image: '🥅' }
    ]
  },
  {
    id: 'playground-eco',
    name: 'Игровое оборудование "Eco"',
    icon: 'TreePine',
    color: 'from-green-500/20 to-green-500/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/экоигра12.png',
    order: 4,
    subcategories: [
      { name: 'Игровые комплексы', image: '🌳' },
      { name: 'Балансиры', image: '🪵' },
      { name: 'Горки', image: '🛝' },
      { name: 'Качели', image: '🌲' },
      { name: 'Карусели', image: '🌿' },
      { name: 'Лазы', image: '🪜' }
    ]
  },
  {
    id: 'sports-eco',
    name: 'Спортивное оборудование "Eco"',
    icon: 'Leaf',
    color: 'from-emerald-500/20 to-emerald-500/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/экоспорт2.png',
    order: 5,
    subcategories: [
      { name: 'Workout', image: '🌳' },
      { name: 'Спортивные комплексы', image: '🪵' },
      { name: 'Тренажеры уличные', image: '🌲' },
      { name: 'Брусья и перекладины', image: '🪜' }
    ]
  },
  {
    id: 'park',
    name: 'Парковое оборудование',
    icon: 'Trees',
    color: 'from-accent/20 to-accent/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/урбанпарк (1).png',
    order: 3,
    subcategories: [
      { name: 'Скамейки', image: '🪑' },
      { name: 'Урны', image: '🗑️' },
      { name: 'Беседки', image: '🏡' },
      { name: 'Навесы', image: '⛱️' },
      { name: 'МАФ', image: '🎨' }
    ]
  },
  {
    id: 'coating',
    name: 'Травмобезопасное покрытие',
    icon: 'Shield',
    color: 'from-secondary/20 to-secondary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/резинка.png',
    order: 6,
    subcategories: [
      { name: 'Резиновое покрытие', image: '🟦' },
      { name: 'Наливное покрытие', image: '🟩' },
      { name: 'Модульная плитка', image: '🟨' },
      { name: 'Искусственная трава', image: '🟢' }
    ]
  }
];

export const products = [
  {
    id: 110,
    name: 'Арт. 0110\nКачели',
    category: 'playground',
    subcategory: 'Качели',
    price: '52 100',
    description: '1885х1100х1990',
    image: 'https://cdn.poehali.dev/files/кач.png'
  },
  {
    id: 111,
    name: 'Арт. 0111\nКачели',
    category: 'playground',
    subcategory: 'Качели',
    price: '52 100',
    description: '1540х1240х2010',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 112,
    name: 'Арт. 0112\nКачели двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '71 150',
    description: '2640х1100х1990',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 113,
    name: 'Арт. 0113\nКачели двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '71 150',
    description: '2645х1240х2010',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 114,
    name: 'Арт. 0114\nКачели двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '89 600',
    description: '3015х1100х1985',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 115,
    name: 'Арт. 0115\nКачели "Гнездо"',
    category: 'playground',
    subcategory: 'Качели',
    price: '144 500',
    description: '1885х1100х1990',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 116,
    name: 'Арт. 0116\nКачели на брусе',
    category: 'playground',
    subcategory: 'Качели',
    price: '84 300',
    description: '1645х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 117,
    name: 'Арт. 0117\nКачели на брусе двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '103 850',
    description: '2745х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 118,
    name: 'Арт. 0118\nКачели на брусе двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '226 400',
    description: '4250х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 119,
    name: 'Арт. 0119\nКачели "Штурвал"',
    category: 'playground',
    subcategory: 'Качели',
    price: '109 750',
    description: '2740х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 120,
    name: 'Арт. 0120\nКачели "Гнездо"',
    category: 'playground',
    subcategory: 'Качели',
    price: '172 300',
    description: '2740х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 121,
    name: 'Арт. 0121\nКачели на брусе',
    category: 'playground',
    subcategory: 'Качели',
    price: '73 900',
    description: '1645х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 122,
    name: 'Арт. 0122\nКачели на брусе двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '83 400',
    description: '2745х1300х2110',
    image: 'https://cdn.poehali.dev/files/image.png'
  },
  {
    id: 123,
    name: 'Арт. 0123\nСиденье качели "Гнездо" антивандальное',
    category: 'playground',
    subcategory: 'Качели',
    price: '98 700',
    description: '1000х1000х100',
    image: 'https://cdn.poehali.dev/files/гнездо.png'
  },
  {
    id: 124,
    name: 'Арт. 0124\nСиденье качели',
    category: 'playground',
    subcategory: 'Качели',
    price: '10 250',
    description: '380х400х310',
    image: 'https://cdn.poehali.dev/files/124 (2).png'
  },
  {
    id: 125,
    name: 'Арт. 0125\nСиденье прорезиненное "Люлька"',
    category: 'playground',
    subcategory: 'Качели',
    price: '28 900',
    description: '440х290х230',
    image: 'https://cdn.poehali.dev/files/128.png'
  },
  {
    id: 126,
    name: 'Арт. 0126\nСиденье прорезиненное',
    category: 'playground',
    subcategory: 'Качели',
    price: '8 700',
    description: '450х180х27',
    image: 'https://cdn.poehali.dev/files/126 (2).png'
  },
  {
    id: 127,
    name: 'Арт. 0127\nСиденье пластиковое "Люлька"',
    category: 'playground',
    subcategory: 'Качели',
    price: '22 500',
    description: '320х260х190',
    image: 'https://cdn.poehali.dev/files/127 (2).png'
  },
  {
    id: 128,
    name: 'Арт. 0128\nСиденье гибкое без спинки',
    category: 'playground',
    subcategory: 'Качели',
    price: '8 400',
    description: '670х140х8',
    image: 'https://cdn.poehali.dev/files/125 (2).png'
  },
  {
    id: 1,
    name: 'Арт. 0130\nБалансир "Металл"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '31 500',
    description: '2030х360х635',
    image: 'https://cdn.poehali.dev/files/юбюб.png'
  },
  {
    id: 2,
    name: 'Арт. 0131\nБалансир "Классик"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '29 900',
    description: '2215х360х790',
    image: 'https://cdn.poehali.dev/files/2.png'
  },
  {
    id: 5,
    name: 'Арт. 0132\nБалансир "Карета"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '53 300',
    description: '2215х430х770',
    image: 'https://cdn.poehali.dev/files/карета.png'
  },
  {
    id: 7,
    name: 'Арт. 0133\nБалансир "Мишка"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '39 700',
    description: '2215х385х790',
    image: 'https://cdn.poehali.dev/files/мишкаа.png'
  },
  {
    id: 8,
    name: 'Арт. 0134\nБалансир "Мячик"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '42 200',
    description: '2215х390х790',
    image: 'https://cdn.poehali.dev/files/мячикк.png'
  },
  {
    id: 9,
    name: 'Арт. 0135\nБалансир "Собачка"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '33 700',
    description: '2115х360х660',
    image: 'https://cdn.poehali.dev/files/собачкаа.png'
  },
  {
    id: 10,
    name: 'Арт. 0136\nБалансир "Утята"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '34 600',
    description: '2145х360х660',
    image: 'https://cdn.poehali.dev/files/утята.png'
  },
  {
    id: 12,
    name: 'Арт. 0137\nБалансир "Якорь"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '42 000',
    description: '2215х425х790',
    image: 'https://cdn.poehali.dev/files/якорь.png'
  },
  {
    id: 13,
    name: 'Арт. 0138\nБалансир-вертушка "Буран"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '58 500',
    description: '2600х330х1570',
    image: 'https://cdn.poehali.dev/files/буран.png'
  },
  {
    id: 14,
    name: 'Арт. 0139\nБалансир-вертушка "Вихрь"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '56 800',
    description: '2530х170х2460',
    image: 'https://cdn.poehali.dev/files/вихрь.png'
  },
  {
    id: 100,
    name: 'Арт. 0100\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '125 550',
    description: '2785х900х1915',
    image: 'https://cdn.poehali.dev/files/0100.png'
  },
  {
    id: 101,
    name: 'Арт. 0100/1\nГорка h-1.5',
    category: 'playground',
    subcategory: 'Горки',
    price: '179 800',
    description: '4055х900х2410',
    image: 'https://cdn.poehali.dev/files/0100.png'
  },
  {
    id: 102,
    name: 'Арт. 0101\nГорка h-0.6',
    category: 'playground',
    subcategory: 'Горки',
    price: '120 900',
    description: '2460х930х1510',
    image: 'https://cdn.poehali.dev/files/0101.png'
  },
  {
    id: 103,
    name: 'Арт. 0101/1\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '164 300',
    description: '3570х930х1930',
    image: 'https://cdn.poehali.dev/files/0101.png'
  },
  {
    id: 104,
    name: 'Арт. 0101/2\nГорка h-1.5',
    category: 'playground',
    subcategory: 'Горки',
    price: '224 750',
    description: '4800х930х2410',
    image: 'https://cdn.poehali.dev/files/0101.png'
  },
  {
    id: 105,
    name: 'Арт. 0102\nГорка h-0.6',
    category: 'playground',
    subcategory: 'Горки',
    price: '158 100',
    description: '2455х1150х2480',
    image: 'https://cdn.poehali.dev/files/0102.png'
  },
  {
    id: 106,
    name: 'Арт. 0102/1\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '196 850',
    description: '3570х1150х3030',
    image: 'https://cdn.poehali.dev/files/0102.png'
  },
  {
    id: 107,
    name: 'Арт. 0102/2\nГорка h-1.5',
    category: 'playground',
    subcategory: 'Горки',
    price: '258 850',
    description: '4800х1150х3630',
    image: 'https://cdn.poehali.dev/files/0102.png'
  },
  {
    id: 108,
    name: 'Арт. 0103\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '125 550',
    description: '3300х680х1790',
    image: 'https://cdn.poehali.dev/files/0103.png'
  },
  {
    id: 109,
    name: 'Арт. 0104\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '210 800',
    description: '2980х2925х1930',
    image: 'https://cdn.poehali.dev/files/0104.png'
  },
  {
    id: 110,
    name: 'Арт. 0105\nГорка h-1.0',
    category: 'playground',
    subcategory: 'Горки',
    price: '137 950',
    description: '3215х680х1875',
    image: 'https://cdn.poehali.dev/files/105.png'
  },
  {
    id: 200,
    name: 'Арт. 0200\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '241 800',
    description: '3320х3000х3030',
    image: 'https://cdn.poehali.dev/files/200.png'
  },
  {
    id: 201,
    name: 'Арт. 0201\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '268 150',
    description: '4400х4240х3030',
    image: 'https://cdn.poehali.dev/files/201.png'
  },
  {
    id: 202,
    name: 'Арт. 0202\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '291 400',
    description: '4130х3000х3030',
    image: 'https://cdn.poehali.dev/files/202.png'
  },
  {
    id: 203,
    name: 'Арт. 0203\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '257 300',
    description: '3330х1835х3030',
    image: 'https://cdn.poehali.dev/files/203.png'
  },
  {
    id: 204,
    name: 'Арт. 0204\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '320 850',
    description: '3280х3800х3030',
    image: 'https://cdn.poehali.dev/files/204.png'
  },
  {
    id: 205,
    name: 'Арт. 0205\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '291 400',
    description: '3340х4410х3030',
    image: 'https://cdn.poehali.dev/files/205.png'
  },
  {
    id: 206,
    name: 'Арт. 0206\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '277 450',
    description: '4380х1830х3030',
    image: 'https://cdn.poehali.dev/files/206.png'
  },
  {
    id: 207,
    name: 'Арт. 0207\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '263 500',
    description: '2585х3575х3030',
    image: 'https://cdn.poehali.dev/files/207.png'
  },
  {
    id: 208,
    name: 'Арт. 0208\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '308 450',
    description: '4400х4390х3030',
    image: 'https://cdn.poehali.dev/files/208.png'
  },
  {
    id: 209,
    name: 'Арт. 0209\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '345 650',
    description: '3815х3080х3030',
    image: 'https://cdn.poehali.dev/files/209.png'
  },
  {
    id: 210,
    name: 'Арт. 0210\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '291 400',
    description: '4820х3000х2410',
    image: 'https://cdn.poehali.dev/files/210.png'
  },
  {
    id: 211,
    name: 'Арт. 0211\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '227 850',
    description: '2940х3560х2160',
    image: 'https://cdn.poehali.dev/files/211.png'
  },
  {
    id: 212,
    name: 'Арт. 0212\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '277 450',
    description: '4470х3570х2160',
    image: 'https://cdn.poehali.dev/files/212.png'
  },
  {
    id: 213,
    name: 'Арт. 0213\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '393 700',
    description: '7445х1950х2410',
    image: 'https://cdn.poehali.dev/files/213.png'
  },
  {
    id: 214,
    name: 'Арт. 0214\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '299 150',
    description: '4940х2715х3030',
    image: 'https://cdn.poehali.dev/files/214.png'
  },
  {
    id: 215,
    name: 'Арт. 0215\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '227 850',
    description: '3590х2910х2160',
    image: '🎢'
  },
  {
    id: 216,
    name: 'Арт. 0216\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '246 450',
    description: '3560х3510х2695',
    image: '🎢'
  },
  {
    id: 217,
    name: 'Арт. 0217\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '485 150',
    description: '5400х2815х3630',
    image: '🎢'
  },
  {
    id: 218,
    name: 'Арт. 0218\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '323 950',
    description: '3570х3440х3030',
    image: '🎢'
  },
  {
    id: 219,
    name: 'Арт. 0219\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '458 800',
    description: '5475х3420х3030',
    image: '🎢'
  },
  {
    id: 220,
    name: 'Арт. 0220\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '319 300',
    description: '3565х2630х3030',
    image: '🎢'
  },
  {
    id: 221,
    name: 'Арт. 0221\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '485 150',
    description: '5475х3540х3030',
    image: '🎢'
  },
  {
    id: 222,
    name: 'Арт. 0222\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '385 950',
    description: '6390х3080х3030',
    image: '🎢'
  },
  {
    id: 223,
    name: 'Арт. 0223\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '323 950',
    description: '3570х3420х3030',
    image: '🎢'
  },
  {
    id: 224,
    name: 'Арт. 0224\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '313 100',
    description: '5310х1380х3030',
    image: '🎢'
  },
  {
    id: 225,
    name: 'Арт. 0225\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '365 800',
    description: '6020х3570х3030',
    image: '🎢'
  },
  {
    id: 226,
    name: 'Арт. 0226\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '384 400',
    description: '6020х3565х3030',
    image: '🎢'
  },
  {
    id: 227,
    name: 'Арт. 0227\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '434 000',
    description: '4780х3555х3030',
    image: '🎢'
  },
  {
    id: 228,
    name: 'Арт. 0228\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '342 550',
    description: '4395х3440х3030',
    image: '🎢'
  },
  {
    id: 229,
    name: 'Арт. 0229\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '336 350',
    description: '3960х3440х3030',
    image: '🎢'
  },
  {
    id: 230,
    name: 'Арт. 0230\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '654 100',
    description: '8750х5590х3030',
    image: '🎢'
  },
  {
    id: 231,
    name: 'Арт. 0231\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '401 450',
    description: '5770х3330х3030',
    image: '🎢'
  },
  {
    id: 232,
    name: 'Арт. 0232\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '401 450',
    description: '4105х4395х3030',
    image: '🎢'
  },
  {
    id: 233,
    name: 'Арт. 0233\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '373 550',
    description: '4390х3415х3030',
    image: '🎢'
  },
  {
    id: 234,
    name: 'Арт. 0234\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '595 200',
    description: '5685х3550х3030',
    image: '🎢'
  },
  {
    id: 235,
    name: 'Арт. 0235\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '612 250',
    description: '6245х5475х3030',
    image: '🎢'
  },
  {
    id: 236,
    name: 'Арт. 0236\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '575 050',
    description: '5970х5720х3030',
    image: '🎢'
  },
  {
    id: 237,
    name: 'Арт. 0237\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '607 600',
    description: '6795х4085х3030',
    image: 'https://cdn.poehali.dev/files/237.png'
  },
  {
    id: 238,
    name: 'Арт. 0238\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '506 850',
    description: '5340х4780х2685',
    image: '🎢'
  },
  {
    id: 239,
    name: 'Арт. 0239\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '472 750',
    description: '5340х4450х3030',
    image: '🎢'
  },
  {
    id: 240,
    name: 'Арт. 0240\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '647 900',
    description: '5525х3320х2710',
    image: '🎢'
  },
  {
    id: 241,
    name: 'Арт. 0241\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '866 450',
    description: '9970х4750х3030',
    image: '🎢'
  },
  {
    id: 242,
    name: 'Арт. 0242\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 041 600',
    description: '11570х4865х3030',
    image: '🎢'
  },
  {
    id: 243,
    name: 'Арт. 0243\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 088 100',
    description: '7845х6765х3030',
    image: '🎢'
  },
  {
    id: 244,
    name: 'Арт. 0244\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '982 700',
    description: '8260х6640х3620',
    image: '🎢'
  },
  {
    id: 245,
    name: 'Арт. 0245\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '2 343 600',
    description: '11885х10400х3630',
    image: '🎢'
  },
  {
    id: 246,
    name: 'Арт. 0246\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 309 750',
    description: '12040х7060х3630',
    image: '🎢'
  },
  {
    id: 247,
    name: 'Арт. 0247\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '457 250',
    description: '4690х3530х3890',
    image: '🎢'
  },
  {
    id: 248,
    name: 'Арт. 0248\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '947 050',
    description: '7095х6015х3890',
    image: '🎢'
  },
  {
    id: 249,
    name: 'Арт. 0249\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 240 000',
    description: '7680х7490х3890',
    image: '🎢'
  },
  {
    id: 250,
    name: 'Арт. 0250\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '872 650',
    description: '7780х6470х3890',
    image: '🎢'
  },
  {
    id: 251,
    name: 'Арт. 0251\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 297 350',
    description: '9425х9330х3890',
    image: '🎢'
  },
  {
    id: 252,
    name: 'Арт. 0252\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 782 500',
    description: '10455х9705х3890',
    image: '🎢'
  },
  {
    id: 253,
    name: 'Арт. 0253\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 240 000',
    description: '8520х6675х3890',
    image: '🎢'
  },
  {
    id: 254,
    name: 'Арт. 0254\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '482 050',
    description: '5105х3300х3565',
    image: '🎢'
  },
  {
    id: 255,
    name: 'Арт. 0255\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '610 700',
    description: '6685х4330х3560',
    image: '🎢'
  },
  {
    id: 256,
    name: 'Арт. 0256\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    price: '1 023 000',
    description: '8555х6210х3560',
    image: '🎢'
  },
  {
    id: 43,
    name: 'Скамейка парковая',
    category: 'park',
    subcategory: 'Скамейки',
    price: '12 000',
    description: 'Удобная скамейка со спинкой, металл + дерево',
    image: '🪑'
  },
  {
    id: 300,
    name: 'Резиновое покрытие',
    category: 'coating',
    subcategory: 'Резиновое покрытие',
    price: '1 500 / м²',
    description: 'Безопасное покрытие толщиной 30мм, разные цвета',
    image: '🟦'
  },
  {
    id: 301,
    name: 'Забор декоративный',
    category: 'fencing',
    subcategory: 'Заборы',
    price: '3 500 / м',
    description: 'Металлическое ограждение с порошковой покраской',
    image: '🔲'
  }
];