import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  products: string;
  distance: string;
  comment: string;
}

interface ContentSectionsProps {
  orderForm: OrderForm;
  setOrderForm: (form: OrderForm) => void;
  deliveryCost: number;
  handleDistanceChange: (distance: string) => void;
}

export function ContentSections({
  orderForm,
  setOrderForm,
  deliveryCost,
  handleDistanceChange
}: ContentSectionsProps) {
  return (
    <>
      <section id="services" className="pt-4 pb-16 bg-white">
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

      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-heading font-bold mb-6">О компании</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Мы специализируемся на производстве детского игрового и спортивного оборудования на протяжении 5 лет. 
                За это время мы оснастили более 1000 детских площадок по всей России.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Наша продукция соответствует всем стандартам безопасности и имеет необходимые сертификаты. 
                Мы используем только качественные материалы и современные технологии производства.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5+</div>
                  <div className="text-sm text-muted-foreground">лет на рынке</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">1000+</div>
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
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Предоплата 50% после согласования заказа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Оплата оставшихся 50% после доставки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
                      <span>Принимаем наличные, безналичный расчёт, карты</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-primary mt-0.5" />
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
            <p className="text-lg text-muted-foreground">Вся продукция сертифицирована и соответствует стандартам качества</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {['ГОСТ Р', 'ТР ТС', 'ISO 9001'].map((cert, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Award" size={48} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{cert}</h3>
                  <p className="text-sm text-muted-foreground">Сертификат соответствия</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Контакты</h2>
            <p className="text-lg text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Phone" size={32} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">Телефон</h3>
                <a href="tel:88001234567" className="text-primary hover:underline">8 (800) 123-45-67</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mail" size={32} className="text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:info@urbanplay.ru" className="text-secondary hover:underline">info@urbanplay.ru</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MapPin" size={32} className="text-accent" />
                </div>
                <h3 className="font-bold mb-2">Адрес</h3>
                <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Urban Play. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
}
