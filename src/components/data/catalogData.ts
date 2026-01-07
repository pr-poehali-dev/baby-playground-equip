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
    id: 'playground',
    name: 'Игровое оборудование',
    icon: 'Smile',
    color: 'from-primary/20 to-primary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/_____.jpg',
    subcategories: [
      { 
        name: 'Игровые комплексы', 
        image: '🎢', 
        hasChildren: true,
        children: [
          { name: 'Серия "URBAN"', image: '🏛️' },
          { name: 'Серия "ECO"', image: '🌿' }
        ]
      },
      { name: 'Балансиры', image: 'https://cdn.poehali.dev/files/мишкаа.png' },
      { name: 'Горки', image: 'https://cdn.poehali.dev/files/0100.png' },
      { name: 'Домики', image: '🏠' },
      { name: 'Качели', image: '🎪' },
      { name: 'Карусели', image: '🎠' },
      { name: 'Качалки', image: '🌀' },
      { name: 'Песочницы', image: '🏖️' },
      { name: 'Веревочный парк', image: '🪢' },
      { name: 'Скалодром', image: '🧗‍♀️' },
      { name: 'Полоса препятствий', image: '🏃' },
      { name: 'Техника', image: '🚂' },
      { name: 'Лазы', image: '🧗' },
      { name: 'Игровые элементы', image: '🎮' },
      { name: 'Теневые навесы', image: '⛱️' },
      { name: 'Ограждения', image: '🚧' },
      { name: 'Столики и скамейки', image: '🪑' }
    ]
  },
  {
    id: 'sports',
    name: 'Спортивное оборудование',
    icon: 'Dumbbell',
    color: 'from-secondary/20 to-secondary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/48.jpg',
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
    id: 'park',
    name: 'Парковое оборудование',
    icon: 'Trees',
    color: 'from-accent/20 to-accent/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/29934.0x340.jpg',
    subcategories: [
      { name: 'Скамейки', image: '🪑' },
      { name: 'Урны', image: '🗑️' },
      { name: 'Беседки', image: '🏡' },
      { name: 'Навесы', image: '⛱️' },
      { name: 'МАФ', image: '🎨' }
    ]
  },
  {
    id: 'landscaping',
    name: 'Благоустройство',
    icon: 'Flower2',
    color: 'from-primary/20 to-primary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/Sun002_002_C_Shading_Light_Mix0000_221b44e633.jpg',
    subcategories: [
      { name: 'Клумбы', image: '🌷' },
      { name: 'Газоны', image: '🌿' },
      { name: 'Дорожки', image: '🛤️' },
      { name: 'Освещение', image: '💡' },
      { name: 'Озеленение', image: '🌱' }
    ]
  },
  {
    id: 'coating',
    name: 'Травмобезопасное покрытие',
    icon: 'Shield',
    color: 'from-secondary/20 to-secondary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/i (1).png',
    subcategories: [
      { name: 'Резиновое покрытие', image: '🟦' },
      { name: 'Наливное покрытие', image: '🟩' },
      { name: 'Модульная плитка', image: '🟨' },
      { name: 'Искусственная трава', image: '🟢' }
    ]
  },
  {
    id: 'fencing',
    name: 'Ограждения',
    icon: 'Grid3x3',
    color: 'from-accent/20 to-accent/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/1c96c1-1024x1024.jpg',
    subcategories: [
      { name: 'Заборы', image: '🔲' },
      { name: 'Ворота', image: '🚪' },
      { name: 'Калитки', image: '🚧' },
      { name: 'Сетки', image: '🕸️' },
      { name: 'Столбики', image: '⬜' }
    ]
  }
];

export const products = [
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
    subsubcategory: 'Серия "URBAN"',
    price: '241 800',
    description: '3320х3000х3030',
    image: '🎢'
  },
  {
    id: 201,
    name: 'Арт. 0201\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '268 150',
    description: '4400х4240х3030',
    image: '🎢'
  },
  {
    id: 202,
    name: 'Арт. 0202\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '291 400',
    description: '4130х3000х3030',
    image: '🎢'
  },
  {
    id: 203,
    name: 'Арт. 0203\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '257 300',
    description: '3330х1835х3030',
    image: '🎢'
  },
  {
    id: 204,
    name: 'Арт. 0204\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '320 850',
    description: '3280х3800х3030',
    image: '🎢'
  },
  {
    id: 205,
    name: 'Арт. 0205\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '291 400',
    description: '3340х4410х3030',
    image: '🎢'
  },
  {
    id: 206,
    name: 'Арт. 0206\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '277 450',
    description: '4380х1830х3030',
    image: '🎢'
  },
  {
    id: 207,
    name: 'Арт. 0207\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '263 500',
    description: '2585х3575х3030',
    image: '🎢'
  },
  {
    id: 208,
    name: 'Арт. 0208\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '308 450',
    description: '4400х4390х3030',
    image: '🎢'
  },
  {
    id: 209,
    name: 'Арт. 0209\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '345 650',
    description: '3815х3080х3030',
    image: '🎢'
  },
  {
    id: 210,
    name: 'Арт. 0210\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '291 400',
    description: '4820х3000х2410',
    image: '🎢'
  },
  {
    id: 211,
    name: 'Арт. 0211\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '227 850',
    description: '2940х3560х2160',
    image: '🎢'
  },
  {
    id: 212,
    name: 'Арт. 0212\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '277 450',
    description: '4470х3570х2160',
    image: '🎢'
  },
  {
    id: 213,
    name: 'Арт. 0213\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '393 700',
    description: '7445х1950х2410',
    image: '🎢'
  },
  {
    id: 214,
    name: 'Арт. 0214\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '299 150',
    description: '4940х2715х3030',
    image: '🎢'
  },
  {
    id: 215,
    name: 'Арт. 0215\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '227 850',
    description: '3590х2910х2160',
    image: '🎢'
  },
  {
    id: 216,
    name: 'Арт. 0216\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '246 450',
    description: '3560х3510х2695',
    image: '🎢'
  },
  {
    id: 217,
    name: 'Арт. 0217\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '485 150',
    description: '5400х2815х3630',
    image: '🎢'
  },
  {
    id: 218,
    name: 'Арт. 0218\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '323 950',
    description: '3570х3440х3030',
    image: '🎢'
  },
  {
    id: 219,
    name: 'Арт. 0219\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '458 800',
    description: '5475х3420х3030',
    image: '🎢'
  },
  {
    id: 220,
    name: 'Арт. 0220\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '319 300',
    description: '3565х2630х3030',
    image: '🎢'
  },
  {
    id: 221,
    name: 'Арт. 0221\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '485 150',
    description: '5475х3540х3030',
    image: '🎢'
  },
  {
    id: 222,
    name: 'Арт. 0222\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '385 950',
    description: '6390х3080х3030',
    image: '🎢'
  },
  {
    id: 223,
    name: 'Арт. 0223\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '323 950',
    description: '3570х3420х3030',
    image: '🎢'
  },
  {
    id: 224,
    name: 'Арт. 0224\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '313 100',
    description: '5310х1380х3030',
    image: '🎢'
  },
  {
    id: 225,
    name: 'Арт. 0225\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '365 800',
    description: '6020х3570х3030',
    image: '🎢'
  },
  {
    id: 226,
    name: 'Арт. 0226\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '384 400',
    description: '6020х3565х3030',
    image: '🎢'
  },
  {
    id: 227,
    name: 'Арт. 0227\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '434 000',
    description: '4780х3555х3030',
    image: '🎢'
  },
  {
    id: 228,
    name: 'Арт. 0228\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '342 550',
    description: '4395х3440х3030',
    image: '🎢'
  },
  {
    id: 229,
    name: 'Арт. 0229\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '336 350',
    description: '3960х3440х3030',
    image: '🎢'
  },
  {
    id: 230,
    name: 'Арт. 0230\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '654 100',
    description: '8750х5590х3030',
    image: '🎢'
  },
  {
    id: 231,
    name: 'Арт. 0231\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '401 450',
    description: '5770х3330х3030',
    image: '🎢'
  },
  {
    id: 232,
    name: 'Арт. 0232\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '401 450',
    description: '4105х4395х3030',
    image: '🎢'
  },
  {
    id: 233,
    name: 'Арт. 0233\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '373 550',
    description: '4390х3415х3030',
    image: '🎢'
  },
  {
    id: 234,
    name: 'Арт. 0234\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '595 200',
    description: '5685х3550х3030',
    image: '🎢'
  },
  {
    id: 235,
    name: 'Арт. 0235\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '612 250',
    description: '6245х5475х3030',
    image: '🎢'
  },
  {
    id: 236,
    name: 'Арт. 0236\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '575 050',
    description: '5970х5720х3030',
    image: '🎢'
  },
  {
    id: 237,
    name: 'Арт. 0237\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '607 600',
    description: '6795х4085х3030',
    image: '🎢'
  },
  {
    id: 238,
    name: 'Арт. 0238\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '506 850',
    description: '5340х4780х2685',
    image: '🎢'
  },
  {
    id: 239,
    name: 'Арт. 0239\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '472 750',
    description: '5340х4450х3030',
    image: '🎢'
  },
  {
    id: 240,
    name: 'Арт. 0240\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '647 900',
    description: '5525х3320х2710',
    image: '🎢'
  },
  {
    id: 241,
    name: 'Арт. 0241\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '866 450',
    description: '9970х4750х3030',
    image: '🎢'
  },
  {
    id: 242,
    name: 'Арт. 0242\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 041 600',
    description: '11570х4865х3030',
    image: '🎢'
  },
  {
    id: 243,
    name: 'Арт. 0243\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 088 100',
    description: '7845х6765х3030',
    image: '🎢'
  },
  {
    id: 244,
    name: 'Арт. 0244\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '982 700',
    description: '8260х6640х3620',
    image: '🎢'
  },
  {
    id: 245,
    name: 'Арт. 0245\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '2 343 600',
    description: '11885х10400х3630',
    image: '🎢'
  },
  {
    id: 246,
    name: 'Арт. 0246\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 309 750',
    description: '12040х7060х3630',
    image: '🎢'
  },
  {
    id: 247,
    name: 'Арт. 0247\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '457 250',
    description: '4690х3530х3890',
    image: '🎢'
  },
  {
    id: 248,
    name: 'Арт. 0248\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '947 050',
    description: '7095х6015х3890',
    image: '🎢'
  },
  {
    id: 249,
    name: 'Арт. 0249\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 240 000',
    description: '7680х7490х3890',
    image: '🎢'
  },
  {
    id: 250,
    name: 'Арт. 0250\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '872 650',
    description: '7780х6470х3890',
    image: '🎢'
  },
  {
    id: 251,
    name: 'Арт. 0251\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 297 350',
    description: '9425х9330х3890',
    image: '🎢'
  },
  {
    id: 252,
    name: 'Арт. 0252\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 782 500',
    description: '10455х9705х3890',
    image: '🎢'
  },
  {
    id: 253,
    name: 'Арт. 0253\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '1 240 000',
    description: '8520х6675х3890',
    image: '🎢'
  },
  {
    id: 254,
    name: 'Арт. 0254\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '482 050',
    description: '5105х3300х3565',
    image: '🎢'
  },
  {
    id: 255,
    name: 'Арт. 0255\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
    price: '610 700',
    description: '6685х4330х3560',
    image: '🎢'
  },
  {
    id: 256,
    name: 'Арт. 0256\nИгровой комплекс',
    category: 'playground',
    subcategory: 'Игровые комплексы',
    subsubcategory: 'Серия "URBAN"',
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