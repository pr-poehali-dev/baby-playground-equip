export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  article?: string;
}

export interface SubSubSubcategory {
  name: string;
  image: string;
}

export interface SubSubcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubSubcategory[];
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
    name: 'Игра',
    icon: 'Smile',
    color: 'from-primary/20 to-primary/5',
    image: 'https://cdn.poehali.dev/files/%D0%B8%D0%B3%D1%80%D0%B0%20(2).png',
    bgImage: 'https://cdn.poehali.dev/files/%D0%B8%D0%B3%D1%80%D0%B0%20(2).png',
    order: 1,
    subcategories: [
      { 
        name: 'Серия "Classic"', 
        image: 'https://cdn.poehali.dev/files/%D0%B8%D0%B3%D1%80%D0%B0%20ciassic.png',
        hasChildren: true,
        children: [
          { 
            name: 'Игровые комплексы', 
            image: 'https://cdn.poehali.dev/files/ененпре.png',
            hasChildren: true,
            children: [
              {
                name: '3-7 лет',
                image: '👶',
                hasChildren: true,
                children: [
                  { name: 'Классик', image: '🏰' },
                  { name: 'Джунгли', image: '🌴' },
                  { name: 'Замок', image: '🏯' },
                  { name: 'Сказка', image: '📖' },
                  { name: 'Техника', image: '🚗' },
                  { name: 'Космос', image: '🚀' }
                ]
              },
              {
                name: '5-12 лет',
                image: '👦',
                hasChildren: true,
                children: [
                  { name: 'Классик', image: '🏰' },
                  { name: 'Замок', image: '🏯' },
                  { name: 'Джунгли', image: '🌴' },
                  { name: 'Сказка', image: '📖' },
                  { name: 'Морская', image: '🌊' },
                  { name: 'Техника', image: '🚗' },
                  { name: 'Космос', image: '🚀' },
                  { name: 'Лабиринт', image: '🌀' },
                  { name: 'Карандаши', image: '✏️' },
                  { name: 'Спорт', image: '⚽' }
                ]
              }
            ]
          },
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
          { name: 'Столики и скамейки', image: '🪑' }
        ]
      },
      { 
        name: 'Серия "Eco"', 
        image: 'https://cdn.poehali.dev/files/%D0%B8%D0%B3%D1%80%D0%B0%20Eco.png',
        hasChildren: true,
        children: [
          { name: 'Игровые комплексы', image: '🌳' },
          { name: 'Балансиры', image: '🪵' },
          { name: 'Горки', image: '🛝' },
          { name: 'Качели', image: '🌲' },
          { name: 'Карусели', image: '🌿' },
          { name: 'Лазы', image: '🪜' }
        ]
      }
    ]
  },
  {
    id: 'sport',
    name: 'Спорт',
    icon: 'Dumbbell',
    color: 'from-secondary/20 to-secondary/5',
    image: 'https://cdn.poehali.dev/files/%D1%81%D0%BF%D0%BE%D1%80%D1%82.png',
    bgImage: 'https://cdn.poehali.dev/files/%D1%81%D0%BF%D0%BE%D1%80%D1%82.png',
    order: 2,
    subcategories: [
      { 
        name: 'Серия "Classic Sport"', 
        image: 'https://cdn.poehali.dev/files/%D1%81%D0%BF%D0%BE%D1%80%D1%82%20Classic.png',
        hasChildren: true,
        children: [
          { name: 'Workout', image: '💪' },
          { name: 'Ворота, стойки, щиты', image: '🥅' },
          { name: 'Полоса препятствий ГТО', image: '🏅' },
          { name: 'Спортивные комплексы', image: '⛹️' },
          { name: 'Скамьи гимнастические', image: '🪑' },
          { name: 'Оборудование для скейт-парков', image: '🛹' },
          { name: 'Спортивные снаряды', image: '🏋️' },
          { name: 'Тренажеры уличные', image: '🚴' },
          { name: 'Трибуны сборно-разборные', image: '🏟️' },
          { name: 'Спортивные сетки', image: '🥅' }
        ]
      },
      { 
        name: 'Серия "Eco Sport"', 
        image: 'https://cdn.poehali.dev/files/%D1%81%D0%BF%D0%BE%D1%80%D1%82%20Eco.png',
        hasChildren: true,
        children: [
          { name: 'Workout', image: '🌳' },
          { name: 'Спортивные комплексы', image: '🪵' },
          { name: 'Тренажеры уличные', image: '🌲' },
          { name: 'Брусья и перекладины', image: '🪜' }
        ]
      }
    ]
  },
  {
    id: 'park',
    name: 'Парк',
    icon: 'Trees',
    color: 'from-accent/20 to-accent/5',
    image: 'https://cdn.poehali.dev/files/%D0%BF%D0%B0%D1%80%D0%BA.png',
    bgImage: 'https://cdn.poehali.dev/files/%D0%BF%D0%B0%D1%80%D0%BA.png',
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
    id: 'improvement',
    name: 'Благоустройство',
    icon: 'Hammer',
    color: 'from-blue-500/20 to-blue-500/5',
    image: 'https://cdn.poehali.dev/files/%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE.png',
    bgImage: 'https://cdn.poehali.dev/files/%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D1%83%D1%81%D1%82%D1%80%D0%BE%D0%B9%D1%81%D1%82%D0%B2%D0%BE.png',
    order: 4,
    subcategories: []
  },
  {
    id: 'coating',
    name: 'Покрытие',
    icon: 'Shield',
    color: 'from-purple-500/20 to-purple-500/5',
    image: 'https://cdn.poehali.dev/files/%D0%BF%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.png',
    bgImage: 'https://cdn.poehali.dev/files/%D0%BF%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.png',
    order: 5,
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
    icon: 'Box',
    color: 'from-gray-500/20 to-gray-500/5',
    image: 'https://cdn.poehali.dev/files/%D0%BE%D0%B3%D1%80%D0%B0%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.png',
    bgImage: 'https://cdn.poehali.dev/files/%D0%BE%D0%B3%D1%80%D0%B0%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5.png',
    order: 6,
    subcategories: []
  }
];