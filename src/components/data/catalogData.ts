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
  hasChildren?: boolean;
  children?: { name: string; image: string }[];
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
        image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/7fe1a07b-eb15-4491-a94b-06fba564d3ca.png',
        hasChildren: true,
        children: [
          {
            name: 'Комплексы 3-7 лет',
            image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/39628bd3-88b4-466d-b88e-79736f7f6893.png',
            hasChildren: true,
            children: [
              { name: 'Классик', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/809d9978-1cc9-4164-b1bf-00682ebb7ac8.png' },
              { name: 'Джунгли', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/6bc179a5-ec3f-4cc4-a8a5-9478913fad63.png' },
              { name: 'Замок', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/6de7cba4-b5ec-44f4-8f52-bc4656fc0189.png' }
            ]
          },
          {
            name: 'Комплексы 5-12 лет',
            image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/4cd730e4-fd3b-4b60-b4c4-0be4b80e5671.png',
            hasChildren: true,
            children: [
              { name: 'Классик', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/b51dd912-5e72-4d57-b5e8-be0e17e01066.png' },
              { name: 'Замок', image: '🏯' },
              { name: 'Джунгли', image: '🌴' },
              { name: 'Морская', image: '🌊' },
              { name: 'Лабиринт', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/227215e9-4c5a-4c37-ae12-1d1a7a7549bc.png' }
            ]
          },
          { name: 'Балансиры', image: 'https://cdn.poehali.dev/files/мишкаа.png' },
          {
            name: 'Горки',
            image: 'https://cdn.poehali.dev/files/0100.png',
            hasChildren: true,
            children: [
              { name: 'h-0.6', image: '🛝' },
              { name: 'h-1.0', image: '🛝' },
              { name: 'h-1.5', image: '🛝' }
            ]
          },
          { name: 'Домики', image: 'https://cdn.poehali.dev/files/%D0%B4%D0%BE%D0%BC%D0%B8%D0%BA%202.png' },
          { name: 'Качели', image: 'https://cdn.poehali.dev/files/%D0%BA%D0%B0%D1%87%D0%B5%D0%BB%D0%B8.png' },
          { name: 'Карусели', image: 'https://cdn.poehali.dev/files/%D0%BA%D0%B0%D1%80%D1%83%D1%81%D0%B5%D0%BB%D1%8C.png' },
          { name: 'Качалки', image: 'https://cdn.poehali.dev/files/%D0%BA%D0%B0%D1%87%D0%B0%D0%BB%D0%BA%D0%B0.png' },
          { name: 'Песочницы', image: 'https://cdn.poehali.dev/files/%D0%BF%D0%B5%D1%81%D0%BE%D1%87%D0%BD%D0%B8%D1%86%D0%B0.png' },
          { name: 'Веревочный парк', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/0bd6ae06-0963-4f77-88c4-0c52782ea1c0.png' },
          { name: 'Скалодром', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/07481213-c392-48be-aebf-6532ed066c5c.png' },
          { name: 'Полоса препятствий', image: 'https://cdn.poehali.dev/files/%D0%BF%D0%BE%D0%BB%D0%BE%D1%81%D0%B0.png' },
          { name: 'Техника', image: 'https://cdn.poehali.dev/files/%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D0%BA%D0%B0.png' },
          { name: 'Лазы', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/8942d22c-3781-4db3-9d74-c3fde653b50e.png' },
          { name: 'Игровые элементы', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/6b219d44-4f58-4412-91d2-f3ed6a0256be.png' },
          { name: 'Теневые навесы', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/88a2a993-e5fe-40d3-9722-30f8d99564c2.png' },
          { name: 'Столики и скамейки', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/3b03c9f0-0fe1-4bfe-ad38-fa775834a0e5.png' }
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
          { name: 'Workout', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/7b34f04e-d5d6-4851-b8a2-6c6f20c1d8eb.png' },
          { name: 'Спортивные снаряды', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/3030b2f2-590c-490e-ac64-c890f700e734.png' },
          {
            name: 'Спортивные комплексы',
            image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/deb57eb0-f487-40cb-8baa-dd409badc4b7.png',
            hasChildren: true,
            children: [
              { name: 'Комплексы 3-7 лет', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/1f72c46c-f0de-4e18-bbe3-cc6faa2d11e2.png' },
              { name: 'Комплексы 5-12 лет', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/09db19b0-395a-48fb-a8f3-b20dfb54b6cc.png' },
              { name: 'Комплексы на трубе', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/5d81654c-59a6-41fa-8bae-9fec5ea21b0e.png' }
            ]
          },
          {
            name: 'Тренажеры уличные',
            image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/4957bc0e-86d4-411b-a2b0-7902e369a099.png',
            hasChildren: true,
            children: [
              { name: 'Одиночные', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/5930076c-f808-41e9-a4fd-a8c3dc99013d.png' },
              { name: 'Комбинированные', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/e7112899-4651-4133-aa76-cb3fe01fd39c.png' },
              { name: 'Силовые', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/ca42d04c-7a6a-416a-a618-5579ceec6025.png' },
              { name: 'Детские', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/a342f17c-3286-4131-8274-a08a2230e2d9.png' }
            ]
          },
          { name: 'Ворота, стойки, щиты', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/2c77178f-ec33-4666-942e-95b4316cecc5.png' },
          { name: 'Полоса препятствий ГТО', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/8a806904-d50c-4881-89b8-396a9dc8afa6.png' },
          { name: 'Трибуны сборно-разборные', image: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/123ffcd2-db4a-4760-b575-a59521c299fd.jpg' }
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