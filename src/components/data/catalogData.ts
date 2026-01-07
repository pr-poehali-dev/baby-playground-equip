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
      { name: 'Балансиры', image: 'https://cdn.poehali.dev/files/дкб2.png' },
      { name: 'Горки', image: 'https://cdn.poehali.dev/files/121212.png' },
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
    bgImage: 'https://cdn.poehali.dev/files/1620818445_proekt.jpg',
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
    name: 'Балансир ДКб-1',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '31 500',
    description: '2030х360х635',
    image: 'https://cdn.poehali.dev/files/юбюб.png'
  },
  {
    id: 2,
    name: 'Балансир ДКб-2',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '29 900',
    description: '2215х360х790',
    image: 'https://cdn.poehali.dev/files/2.png'
  },
  {
    id: 3,
    name: 'Балансир ДКб-5',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '67 500',
    description: '2700х350х850',
    image: 'https://cdn.poehali.dev/files/66.png'
  },
  {
    id: 4,
    name: 'Балансир "Дельфин"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '42 000',
    description: '2215х390х790',
    image: 'https://cdn.poehali.dev/files/дельфин.png'
  },
  {
    id: 5,
    name: 'Балансир "Карета"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '53 300',
    description: '2215х430х770',
    image: 'https://cdn.poehali.dev/files/карета.png'
  },
  {
    id: 6,
    name: 'Балансир "Медведь"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '54 400',
    description: '2215х315х885',
    image: 'https://cdn.poehali.dev/files/медведь.png'
  },
  {
    id: 7,
    name: 'Балансир "Мишка"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '39 700',
    description: '2215х385х790',
    image: 'https://cdn.poehali.dev/files/мишка.png'
  },
  {
    id: 8,
    name: 'Балансир "Мячик"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '42 200',
    description: '2215х390х790',
    image: 'https://cdn.poehali.dev/files/мячик.png'
  },
  {
    id: 9,
    name: 'Балансир "Собачка"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '33 700',
    description: '2115х360х660',
    image: 'https://cdn.poehali.dev/files/собачка.png'
  },
  {
    id: 10,
    name: 'Балансир "Утята"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '34 600',
    description: '2145х360х660',
    image: 'https://cdn.poehali.dev/files/утята.png'
  },
  {
    id: 11,
    name: 'Балансир "Черепаха"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '46 500',
    description: '2215х410х790',
    image: 'https://cdn.poehali.dev/files/черепаха.png'
  },
  {
    id: 12,
    name: 'Балансир "Якорь"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '42 000',
    description: '2215х425х790',
    image: 'https://cdn.poehali.dev/files/якорь.png'
  },
  {
    id: 13,
    name: 'Балансир-вертушка "Буран"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '58 500',
    description: '2600х330х1570',
    image: 'https://cdn.poehali.dev/files/буран.png'
  },
  {
    id: 14,
    name: 'Балансир-вертушка "Вихрь"',
    category: 'playground',
    subcategory: 'Балансиры',
    price: '56 800',
    description: '2530х170х2460',
    image: 'https://cdn.poehali.dev/files/вихрь.png'
  },
  {
    id: 15,
    name: 'Скамейка парковая',
    category: 'park',
    subcategory: 'Скамейки',
    price: '12 000',
    description: 'Удобная скамейка со спинкой, металл + дерево',
    image: '🪑'
  },
  {
    id: 7,
    name: 'Резиновое покрытие',
    category: 'coating',
    subcategory: 'Резиновое покрытие',
    price: '1 500 / м²',
    description: 'Безопасное покрытие толщиной 30мм, разные цвета',
    image: '🟦'
  },
  {
    id: 8,
    name: 'Забор декоративный',
    category: 'fencing',
    subcategory: 'Заборы',
    price: '3 500 / м',
    description: 'Металлическое ограждение с порошковой покраской',
    image: '🔲'
  }
];