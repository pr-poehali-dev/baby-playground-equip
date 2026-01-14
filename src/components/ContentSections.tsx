import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ContactDialog } from './ContactDialog';

export function ContentSections() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  return (
    <div className="order-4">
      <section id="about" className="pt-4 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-heading mb-6 font-semibold">О компании</h2>
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
                  <div className="text-4xl font-bold text-[#0284c7] mb-2">700+</div>
                  <div className="text-sm text-muted-foreground">товаров</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-7xl"></div>
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg flex items-center justify-center text-7xl"></div>
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg flex items-center justify-center text-7xl"></div>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center text-7xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="certificates" className="pt-4 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading mb-4 font-semibold">Сертификаты</h2>
            <p className="text-lg text-muted-foreground">Вся продукция сертифицирована и соответствует стандартам качества</p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {['ГОСТ Р', 'ТР ТС', 'ISO 9001'].map((cert, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="p-3 md:p-8">
                  <div className="w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                    <Icon name="Award" size={24} className="text-primary md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-sm md:text-xl font-heading font-bold mb-1 md:mb-2">{cert}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Сертификат соответствия</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="pt-4 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading mb-4 font-semibold">Контакты</h2>
            <p className="text-lg text-muted-foreground">Свяжитесь с нами любым удобным способом</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-2 md:p-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-4">
                  <Icon name="Phone" size={16} className="text-primary md:w-8 md:h-8" />
                </div>
                <h3 className="text-xs md:text-base font-bold mb-0.5 md:mb-2">Телефон</h3>
                <a href="tel:+79181151551" className="text-[10px] md:text-base text-primary hover:underline block break-words mb-1 md:mb-3">+7 (918) 115-15-51</a>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[10px] md:text-sm px-1 py-1 h-auto md:h-9 border-[#3eaa03] text-[#3eaa03] hover:bg-[#3eaa03] hover:text-white hover:border-[#3eaa03] active:bg-[#3eaa03] active:text-white"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  Перезвоните мне
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-2 md:p-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-4">
                  <Icon name="Mail" size={16} className="text-secondary md:w-8 md:h-8" />
                </div>
                <h3 className="text-xs md:text-base font-bold mb-0.5 md:mb-2">Email</h3>
                <a href="mailto:info@urban-play.ru" className="text-[10px] md:text-base text-secondary hover:underline break-words">info@urban-play.ru</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-2 md:p-8">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-[#0284c7]/10 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-4">
                  <Icon name="MapPin" size={16} className="text-[#0284c7] md:w-8 md:h-8" />
                </div>
                <h3 className="text-xs md:text-base font-bold mb-0.5 md:mb-2">Адрес</h3>
                <p className="text-[10px] md:text-base text-muted-foreground break-words">г. Краснодар, ул. Кореновская, д. 57 оф. 7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Urban Play. Все права защищены.</p>
        </div>
      </footer>

      <ContactDialog 
        open={isContactDialogOpen} 
        onOpenChange={setIsContactDialogOpen}
      />
    </div>
  );
}