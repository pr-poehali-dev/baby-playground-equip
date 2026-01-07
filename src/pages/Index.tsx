import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface SubSubcategory {
  name: string;
  image: string;
}

interface Subcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubcategory[];
}

const categories = [
  {
    id: 'playground',
    name: 'Детское игровое оборудование',
    icon: 'Smile',
    color: 'from-primary/20 to-primary/5',
    image: '',
    bgImage: 'https://cdn.poehali.dev/files/_____.jpg',
    subcategories: [
      { name: 'Качалки-балансиры', image: '⚖️' },
      { name: 'Веранды (теневые навесы)', image: '⛱️' },
      { name: 'Веревочные парки', image: '🪢' },
      { name: 'Горки', image: '🛝' },
      { name: 'Декор для клумбы', image: '🌸' },
      { name: 'Домики игровые', image: '🏠' },
      { 
        name: 'Игровые комплексы', 
        image: '🎢', 
        hasChildren: true,
        children: [
          { name: 'Комплексы для младшей возрастной группы', image: '👶' },
          { name: 'Серия "Классика" (младшие)', image: '🏛️' },
          { name: 'Серия "Джунгли" (младшие)', image: '🌴' },
          { name: 'Серия "Замки" (младшие)', image: '🏰' },
          { name: 'Комплексы различной тематики (младшие)', image: '🎨' },
          { name: 'Комплексы для старшей возрастной группы', image: '👦' },
          { name: 'Серия "Классика" (старшие)', image: '🏛️' },
          { name: 'Серия "Замки" (старшие)', image: '🏰' },
          { name: 'Серия "Космос и авиация"', image: '🚀' },
          { name: 'Серия "Мир джунглей"', image: '🦁' },
          { name: 'Серия "Морская"', image: '⚓' },
          { name: 'Комплексы различной тематики (старшие)', image: '🎨' },
          { name: 'Комплексы-лабиринты', image: '🌀' }
        ]
      },
      { name: 'Игровые элементы', image: '🎮' },
      { name: 'Карусели', image: '🎠' },
      { name: 'Качалки на пружине', image: '🌀' },
      { name: 'Качели уличные', image: '🎪' },
      { name: 'Лазы, рукоходы', image: '🧗' },
      { name: 'Обустройство территории', image: '🏗️' },
      { name: 'Ограждения детской площадки', image: '🚧' },
      { name: 'Песочницы', image: '🏖️' },
      { name: 'Песочные городки (дворики)', image: '🏰' },
      { name: 'Полоса препятствий', image: '🏃' },
      { name: 'Развивающие элементы', image: '🧩' },
      { name: 'Скалодромы', image: '🧗‍♀️' },
      { name: 'Скамейки и столики', image: '🪑' },
      { name: 'Машинки, паровозики', image: '🚂' }
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
    bgImage: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/839bbc18-ef11-4c12-a1b5-d71174e7aba3.jpg',
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
    bgImage: 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/98fa23f0-e44e-4b54-86b3-8b43cf022492.jpg',
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
    bgImage: 'https://cdn.poehali.dev/files/figura-iz-rezinovoy-kroshki-sfera-038-foto-38e7.jpg',
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

const products = [
  {
    id: 1,
    name: 'Качели двойные',
    category: 'playground',
    subcategory: 'Качели',
    price: '25 000',
    description: 'Прочные металлические качели с сиденьями из пластика',
    image: '🎪'
  },
  {
    id: 2,
    name: 'Карусель классическая',
    category: 'playground',
    subcategory: 'Карусели',
    price: '45 000',
    description: 'Вращающаяся карусель на 6 мест, яркие цвета',
    image: '🎠'
  },
  {
    id: 3,
    name: 'Горка пластиковая',
    category: 'playground',
    subcategory: 'Горки',
    price: '35 000',
    description: 'Безопасная горка высотой 2м с широким спуском',
    image: '🛝'
  },
  {
    id: 4,
    name: 'Турник уличный',
    category: 'sports',
    subcategory: 'Турники',
    price: '15 000',
    description: 'Металлический турник с регулируемой высотой',
    image: '🏋️'
  },
  {
    id: 5,
    name: 'Воркаут комплекс',
    category: 'sports',
    subcategory: 'Воркаут',
    price: '85 000',
    description: 'Полный комплекс для воркаута: турники, брусья, рукоходы',
    image: '💪'
  },
  {
    id: 6,
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

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubSubcategoryDialogOpen, setIsSubSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    products: '',
    distance: '0',
    comment: ''
  });
  const [deliveryCost, setDeliveryCost] = useState(0);

  const filteredProducts = selectedCategory && selectedSubSubcategory
    ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubSubcategory)
    : selectedCategory && selectedSubcategory
    ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubcategory)
    : selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setCurrentCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleSubcategorySelect = (sub: Subcategory) => {
    if (sub.hasChildren && sub.children) {
      setCurrentSubcategory(sub);
      setIsSubSubcategoryDialogOpen(true);
      setIsCategoryDialogOpen(false);
    } else {
      if (currentCategory) {
        setSelectedCategory(currentCategory.id);
        setSelectedSubcategory(sub.name);
        setSelectedSubSubcategory(null);
        setIsCategoryDialogOpen(false);
      }
    }
  };

  const handleSubSubcategorySelect = (subSubName: string) => {
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      setSelectedSubcategory(currentSubcategory?.name || null);
      setSelectedSubSubcategory(subSubName);
      setIsSubSubcategoryDialogOpen(false);
    }
  };

  const handleTreeCategorySelect = (categoryId: string, categoryData: typeof categories[0]) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setCurrentCategory(categoryData);
    setIsSideMenuOpen(false);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTreeSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, sub: Subcategory) => {
    if (sub.hasChildren) {
      const key = `${categoryId}-${subName}`;
      setExpandedSubcategories(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subName);
      setSelectedSubSubcategory(null);
      setCurrentCategory(categoryData);
      setIsSideMenuOpen(false);
      const catalogSection = document.getElementById('catalog');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTreeSubSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, subSubName: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subName);
    setSelectedSubSubcategory(subSubName);
    setCurrentCategory(categoryData);
    setCurrentSubcategory(categoryData.subcategories.find(s => s.name === subName) || null);
    setIsSideMenuOpen(false);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        image: product.image
      }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      return sum + (price * item.quantity);
    }, 0);
  };

  const generateKP = () => {
    const total = calculateTotal();
    const date = new Date().toLocaleDateString('ru-RU');
    
    let kpText = `КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ\n`;
    kpText += `Дата: ${date}\n`;
    kpText += `От: Urban Play\n\n`;
    kpText += `Товары:\n`;
    kpText += `${'='.repeat(50)}\n`;
    
    cart.forEach((item, idx) => {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      const itemTotal = price * item.quantity;
      kpText += `${idx + 1}. ${item.name}\n`;
      kpText += `   Цена: ${item.price} ₽\n`;
      kpText += `   Количество: ${item.quantity} шт.\n`;
      kpText += `   Сумма: ${itemTotal.toLocaleString('ru-RU')} ₽\n\n`;
    });
    
    kpText += `${'='.repeat(50)}\n`;
    kpText += `ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n`;
    
    if (deliveryCost > 0) {
      kpText += `Доставка: ${deliveryCost.toLocaleString('ru-RU')} ₽\n`;
      kpText += `ВСЕГО К ОПЛАТЕ: ${(total + deliveryCost).toLocaleString('ru-RU')} ₽\n\n`;
    }
    
    kpText += `Условия оплаты:\n`;
    kpText += `- Предоплата 50% после согласования заказа\n`;
    kpText += `- Оплата оставшихся 50% после доставки\n`;
    kpText += `- Принимаем наличные, безналичный расчёт, карты\n`;
    kpText += `- Гарантия 2 года на всё оборудование\n\n`;
    kpText += `Контакты:\n`;
    kpText += `Телефон: 8 (800) 123-45-67\n`;
    kpText += `Email: info@urbanplay.ru\n`;
    kpText += `Адрес: г. Москва, ул. Примерная, д. 1\n`;
    
    const blob = new Blob([kpText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `КП_${date.replace(/\./g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateDelivery = (distance: string) => {
    const dist = parseInt(distance) || 0;
    if (dist === 0) return 0;
    if (dist <= 50) return 2000;
    if (dist <= 100) return 4000;
    if (dist <= 200) return 7000;
    return 10000;
  };

  const handleDistanceChange = (distance: string) => {
    setOrderForm({ ...orderForm, distance });
    setDeliveryCost(calculateDelivery(distance));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/20">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/photo_2026-01-05_09-32-44.png" 
                alt="Urban Play"
                className="h-16 w-auto"
              />
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors font-medium">Каталог</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">О компании</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors font-medium">Услуги</a>
              <a href="#certificates" className="text-foreground hover:text-primary transition-colors font-medium">Сертификаты</a>
              <a href="#contacts" className="text-foreground hover:text-primary transition-colors font-medium">Контакты</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsSideMenuOpen(true)}
                className="md:hidden"
              >
                <Icon name="Menu" size={20} />
              </Button>
              
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                  </SheetHeader>
                  
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground">Корзина пуста</p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-6">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <Card key={item.id}>
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-4xl shrink-0">
                                  {item.image}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2">{item.price} ₽</p>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      className="ml-auto"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-primary">{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                        </div>
                        
                        {deliveryCost > 0 && (
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Доставка:</span>
                            <span>{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}
                        
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => {
                            generateKP();
                            setIsCartOpen(false);
                          }}
                        >
                          <Icon name="FileText" size={20} className="mr-2" />
                          Скачать коммерческое предложение
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              
              <Button className="hidden md:block">
                <Icon name="Phone" size={16} className="mr-2" />
                8 (800) 123-45-67
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-7xl md:text-8xl font-heading font-black mb-6 leading-tight">
              <span className="text-primary">Urban</span>{' '}
              <span className="text-secondary">Play</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-primary">
              Создаём пространство <span className="text-secondary">для игры и спорта</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Производим качественное детское игровое, спортивное и парковое оборудование. 
              Безопасность, долговечность и яркий дизайн — наши главные приоритеты.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8">
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Смотреть каталог
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Phone" size={20} className="mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[300px] opacity-5 pointer-events-none">
          🎠
        </div>
      </section>

      <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-heading">Каталог</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-2">
            {categories.map((cat) => {
              const isExpanded = expandedCategories.includes(cat.id);
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => toggleCategory(cat.id)}
                    >
                      <Icon 
                        name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                        size={16} 
                      />
                    </Button>
                    <button
                      className={`flex-1 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 ${
                        selectedCategory === cat.id && !selectedSubcategory ? 'bg-primary/10 text-primary font-semibold' : ''
                      }`}
                      onClick={() => handleTreeCategorySelect(cat.id, cat)}
                    >
                      <span className="text-2xl">{cat.image}</span>
                      <span className="text-sm flex-1">{cat.name}</span>
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-10 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => {
                        const subKey = `${cat.id}-${sub.name}`;
                        const isSubExpanded = expandedSubcategories.includes(subKey);
                        
                        return (
                          <div key={sub.name}>
                            <div className="flex items-center gap-1">
                              {sub.hasChildren && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-6 h-6 p-0"
                                  onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                                >
                                  <Icon 
                                    name={isSubExpanded ? "ChevronDown" : "ChevronRight"} 
                                    size={14} 
                                  />
                                </Button>
                              )}
                              <button
                                className={`flex-1 text-left px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                                  !sub.hasChildren ? 'ml-6' : ''
                                } ${
                                  selectedCategory === cat.id && selectedSubcategory === sub.name && !selectedSubSubcategory 
                                    ? 'bg-primary/10 text-primary font-semibold' 
                                    : ''
                                }`}
                                onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                              >
                                <span className="text-lg">{sub.image}</span>
                                <span className="flex-1">{sub.name}</span>
                              </button>
                            </div>
                            
                            {isSubExpanded && sub.children && (
                              <div className="ml-8 mt-1 space-y-1">
                                {sub.children.map((subSub) => (
                                  <button
                                    key={subSub.name}
                                    className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors flex items-center gap-2 ${
                                      selectedCategory === cat.id && 
                                      selectedSubcategory === sub.name && 
                                      selectedSubSubcategory === subSub.name
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : ''
                                    }`}
                                    onClick={() => handleTreeSubSubcategorySelect(cat.id, cat, sub.name, subSub.name)}
                                  >
                                    <span>{subSub.image}</span>
                                    <span className="flex-1">{subSub.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <section id="catalog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsSideMenuOpen(true)}
                className="hidden md:flex"
              >
                <Icon name="Menu" size={20} className="mr-2" />
                Открыть меню категорий
              </Button>
            </div>
            <h2 className="text-4xl font-heading font-bold mb-4">Каталог продукции</h2>
            <p className="text-lg text-muted-foreground">Широкий ассортимент оборудования для детских площадок и парков</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className={`cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden group ${
                  selectedCategory === cat.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className={`aspect-[16/9] bg-gradient-to-br ${cat.color} flex items-center justify-center relative overflow-hidden`}>
                  <img 
                    src={cat.bgImage} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <h3 className="relative z-10 text-2xl font-heading font-bold text-white drop-shadow-lg px-4 text-center">{cat.name}</h3>
                </div>

              </Card>
            ))}
          </div>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-heading text-center mb-2">
                  {currentCategory?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {currentCategory?.subcategories.map((sub) => (
                  <Card
                    key={sub.name}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden relative ${
                      selectedSubcategory === sub.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSubcategorySelect(sub)}
                  >
                    {sub.hasChildren && (
                      <Badge className="absolute top-2 right-2 z-10" variant="secondary">
                        <Icon name="ChevronRight" size={12} />
                      </Badge>
                    )}
                    <div className={`aspect-square bg-gradient-to-br ${currentCategory.color} flex items-center justify-center`}>
                      <div className="text-6xl">{sub.image}</div>
                    </div>
                    <CardHeader className="text-center py-3">
                      <CardTitle className="text-sm font-medium leading-tight">{sub.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSubSubcategoryDialogOpen} onOpenChange={setIsSubSubcategoryDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsSubSubcategoryDialogOpen(false);
                      setIsCategoryDialogOpen(true);
                    }}
                  >
                    <Icon name="ArrowLeft" size={16} />
                  </Button>
                  <DialogTitle className="text-3xl font-heading text-center flex-1">
                    {currentSubcategory?.name}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {currentSubcategory?.children?.map((subSub) => (
                  <Card
                    key={subSub.name}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden ${
                      selectedSubSubcategory === subSub.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSubSubcategorySelect(subSub.name)}
                  >
                    <div className={`aspect-square bg-gradient-to-br ${currentCategory?.color} flex items-center justify-center`}>
                      <div className="text-6xl">{subSub.image}</div>
                    </div>
                    <CardHeader className="text-center py-3">
                      <CardTitle className="text-sm font-medium leading-tight">{subSub.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {selectedCategory && (selectedSubcategory || selectedSubSubcategory) && (
            <div className="space-y-6">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                        setSelectedSubSubcategory(null);
                      }}
                    >
                      Каталог
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      className="cursor-pointer hover:text-primary"
                      onClick={() => {
                        setSelectedSubcategory(null);
                        setSelectedSubSubcategory(null);
                      }}
                    >
                      {currentCategory?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {selectedSubcategory && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {selectedSubSubcategory ? (
                          <BreadcrumbLink 
                            className="cursor-pointer hover:text-primary"
                            onClick={() => setSelectedSubSubcategory(null)}
                          >
                            {selectedSubcategory}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{selectedSubcategory}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </>
                  )}
                  {selectedSubSubcategory && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{selectedSubSubcategory}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-heading font-bold">
                    {selectedSubSubcategory || selectedSubcategory}
                  </h3>
                  <p className="text-muted-foreground">Найдено товаров: {filteredProducts.length}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSelectedSubSubcategory(null);
                  }}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтр
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-8xl">
                      {product.image}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">{product.subcategory}</Badge>
                      </div>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">{product.price} ₽</div>
                        <Button size="sm" onClick={() => addToCart(product)}>
                          <Icon name="Plus" size={16} className="mr-1" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-heading font-bold mb-6">О компании</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Мы специализируемся на производстве детского игрового и спортивного оборудования уже более 15 лет. 
                За это время мы оснастили более 5000 детских площадок по всей России.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Наша продукция соответствует всем стандартам безопасности и имеет необходимые сертификаты. 
                Мы используем только качественные материалы и современные технологии производства.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">лет на рынке</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">площадок</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">качество</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-7xl">🎪</div>
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg flex items-center justify-center text-7xl">🏋️</div>
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center text-7xl">🛝</div>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-7xl">🎠</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Наши услуги</h2>
            <p className="text-lg text-muted-foreground">Полный цикл работ от проектирования до установки</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Ruler', title: 'Проектирование', desc: 'Разработка индивидуальных проектов детских площадок' },
              { icon: 'Factory', title: 'Производство', desc: 'Собственное производство из качественных материалов' },
              { icon: 'Truck', title: 'Доставка', desc: 'Доставка по всей России в удобное время' },
              { icon: 'Wrench', title: 'Монтаж', desc: 'Профессиональная установка и гарантия качества' }
            ].map((service, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={service.icon as any} size={32} className="text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Оформить заказ</h2>
              <p className="text-lg text-muted-foreground">Заполните форму и мы рассчитаем стоимость доставки</p>
            </div>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Форма заказа</CardTitle>
                <CardDescription>Укажите контактные данные и список товаров</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input 
                      id="name" 
                      placeholder="Иван Петров"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+7 (999) 123-45-67"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@example.com"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <Input 
                      id="city" 
                      placeholder="Москва"
                      value={orderForm.city}
                      onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">Товары для заказа *</Label>
                  <Textarea 
                    id="products" 
                    placeholder="Укажите интересующие товары и количество"
                    rows={4}
                    value={orderForm.products}
                    onChange={(e) => setOrderForm({ ...orderForm, products: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance">Расстояние для доставки (км)</Label>
                  <Input 
                    id="distance" 
                    type="number" 
                    placeholder="0"
                    value={orderForm.distance}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                  />
                  {deliveryCost > 0 && (
                    <div className="p-4 bg-secondary/10 rounded-lg mt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Стоимость доставки:</span>
                        <span className="text-2xl font-bold text-secondary">{deliveryCost.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea 
                    id="comment" 
                    placeholder="Дополнительная информация или пожелания"
                    rows={3}
                    value={orderForm.comment}
                    onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                  />
                </div>

                <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                  <h3 className="font-heading font-bold text-lg">Условия оплаты</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>Предоплата 50% после согласования заказа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>Оплата оставшихся 50% после доставки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>Принимаем наличные, безналичный расчёт, карты</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
                      <span>Гарантия 2 года на всё оборудование</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full" size="lg">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="certificates" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Сертификаты</h2>
            <p className="text-lg text-muted-foreground">Наша продукция соответствует всем требованиям безопасности</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((cert) => (
              <Card key={cert} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center p-6">
                  <Icon name="Award" size={48} className="text-primary mb-4" />
                  <p className="text-center text-sm font-medium">Сертификат соответствия №{cert}</p>
                  <p className="text-center text-xs text-muted-foreground mt-2">ГОСТ Р 52169-2012</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold mb-4">Контакты</h2>
              <p className="text-lg text-muted-foreground">Свяжитесь с нами удобным способом</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Phone" size={32} className="text-primary" />
                  </div>
                  <CardTitle>Телефон</CardTitle>
                  <CardDescription className="text-base">
                    <a href="tel:88001234567" className="hover:text-primary transition-colors">8 (800) 123-45-67</a>
                    <br />
                    <span className="text-sm">Бесплатно по РФ</span>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Mail" size={32} className="text-secondary" />
                  </div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription className="text-base">
                    <a href="mailto:info@urbanplay.ru" className="hover:text-secondary transition-colors">info@urbanplay.ru</a>
                    <br />
                    <span className="text-sm">Ответим в течение часа</span>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="MapPin" size={32} className="text-accent" />
                  </div>
                  <CardTitle>Адрес</CardTitle>
                  <CardDescription className="text-base">
                    г. Москва, ул. Примерная, д. 1
                    <br />
                    <span className="text-sm">Пн-Пт: 9:00 - 18:00</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <img 
                  src="https://cdn.poehali.dev/files/photo_2026-01-05_09-32-44.png" 
                  alt="Urban Play"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-sm text-background/70">
                Производство детского игрового и спортивного оборудования с 2009 года
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Игровое оборудование</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Спортивное оборудование</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Парковое оборудование</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Покрытия</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><a href="#about" className="hover:text-background transition-colors">О нас</a></li>
                <li><a href="#services" className="hover:text-background transition-colors">Услуги</a></li>
                <li><a href="#certificates" className="hover:text-background transition-colors">Сертификаты</a></li>
                <li><a href="#contacts" className="hover:text-background transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>8 (800) 123-45-67</li>
                <li>info@urbanplay.ru</li>
                <li>г. Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
            <p>© 2024 Urban Play — Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
}