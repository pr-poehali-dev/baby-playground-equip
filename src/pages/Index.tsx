import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const categories = [
  {
    id: 'playground',
    name: 'Детское игровое оборудование',
    icon: 'Smile',
    color: 'bg-primary',
    subcategories: ['Качели', 'Карусели', 'Горки', 'Песочницы', 'Игровые комплексы']
  },
  {
    id: 'sports',
    name: 'Спортивное оборудование',
    icon: 'Dumbbell',
    color: 'bg-secondary',
    subcategories: ['Турники', 'Брусья', 'Воркаут', 'Спортивные комплексы', 'Тренажеры']
  },
  {
    id: 'park',
    name: 'Парковое оборудование',
    icon: 'Trees',
    color: 'bg-accent',
    subcategories: ['Скамейки', 'Урны', 'Беседки', 'Навесы', 'МАФ']
  },
  {
    id: 'landscaping',
    name: 'Благоустройство',
    icon: 'Flower2',
    color: 'bg-primary',
    subcategories: ['Клумбы', 'Газоны', 'Дорожки', 'Освещение', 'Озеленение']
  },
  {
    id: 'coating',
    name: 'Травмобезопасное покрытие',
    icon: 'Shield',
    color: 'bg-secondary',
    subcategories: ['Резиновое покрытие', 'Наливное покрытие', 'Модульная плитка', 'Искусственная трава']
  },
  {
    id: 'fencing',
    name: 'Ограждения',
    icon: 'Grid3x3',
    color: 'bg-accent',
    subcategories: ['Заборы', 'Ворота', 'Калитки', 'Сетки', 'Столбики']
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
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
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

  const filteredProducts = selectedCategory && selectedSubcategory
    ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubcategory)
    : selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setCurrentCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      setSelectedSubcategory(subcategory);
      setIsCategoryDialogOpen(false);
    }
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
              <div className="text-4xl">🎪</div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-primary">ДетскиеПлощадки.рф</h1>
                <p className="text-sm text-muted-foreground">Производство игрового оборудования</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#catalog" className="text-foreground hover:text-primary transition-colors font-medium">Каталог</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">О компании</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors font-medium">Услуги</a>
              <a href="#certificates" className="text-foreground hover:text-primary transition-colors font-medium">Сертификаты</a>
              <a href="#contacts" className="text-foreground hover:text-primary transition-colors font-medium">Контакты</a>
            </nav>
            <Button className="hidden md:block">
              <Icon name="Phone" size={16} className="mr-2" />
              8 (800) 123-45-67
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-foreground">
              Создаём радость <span className="text-primary">для детей</span>
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

      <section id="catalog" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl font-heading font-bold mb-4">Каталог продукции</h2>
            <p className="text-lg text-muted-foreground">Широкий ассортимент оборудования для детских площадок и парков</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className={`h-auto py-4 flex flex-col gap-2 transition-all hover:scale-105`}
                onClick={() => handleCategoryClick(cat)}
              >
                <Icon name={cat.icon as any} size={24} />
                <span className="text-sm font-medium text-center leading-tight">{cat.name}</span>
              </Button>
            ))}
          </div>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {currentCategory?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {currentCategory?.subcategories.map((sub) => (
                  <Button
                    key={sub}
                    variant={selectedSubcategory === sub ? 'default' : 'outline'}
                    className="h-auto py-6 text-base font-medium"
                    onClick={() => handleSubcategorySelect(sub)}
                  >
                    {sub}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

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
                    <Button size="sm">
                      <Icon name="Plus" size={16} className="mr-1" />
                      В заказ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                    <a href="mailto:info@detploshad.ru" className="hover:text-secondary transition-colors">info@detploshad.ru</a>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="text-3xl">🎪</div>
                <h3 className="font-heading font-bold text-xl">ДетскиеПлощадки.рф</h3>
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
                <li>info@detploshad.ru</li>
                <li>г. Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
            <p>© 2024 ДетскиеПлощадки.рф — Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
}