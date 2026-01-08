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
    bgImage: 'https://cdn.poehali.dev/files/экоспорт3.png',
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
