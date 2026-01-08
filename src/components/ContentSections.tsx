import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export function ContentSections() {
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
                <a href="tel:+79181151551" className="text-primary hover:underline">+7 (918) 115-15-51</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mail" size={32} className="text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <a href="mailto:info@urban-play.ru" className="text-secondary hover:underline">info@urban-play.ru</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MapPin" size={32} className="text-accent" />
                </div>
                <h3 className="font-bold mb-2">Адрес</h3>
                <p className="text-muted-foreground">г. Краснодар, ул. Кореновская, д. 57 оф. 7</p>
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