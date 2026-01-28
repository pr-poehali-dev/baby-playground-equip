import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ContactDialog } from './ContactDialog';

export function ContentSections() {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  return (
    <div className="order-4">
      <section id="about" className="pt-4 pb-8 bg-muted/30">
        <div className="container mx-auto px-0">
          <div className="grid md:grid-cols-2 gap-12 items-center px-3">
            <div className="animate-fade-in px-3">
              <h2 className="font-heading mb-6 font-semibold text-center md:text-left text-2xl">О компании</h2>
              <p className="text-lg text-muted-foreground mb-4">Мы специализируемся на производстве детского игрового и спортивного оборудования на протяжении 5 лет. За это время мы оснастили более 500 детских площадок по всей России.</p>
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
                  <div className="text-4xl font-bold text-secondary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">площадок</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#0284c7] mb-2">700+</div>
                  <div className="text-sm text-muted-foreground">товаров</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="text-center p-6">
                  <div className="text-5xl font-bold text-primary mb-2"></div>
                  <div className="text-sm text-muted-foreground"></div>
                </CardContent>
              </Card>
              <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="text-center p-6">
                  <div className="text-5xl font-bold text-secondary mb-2"></div>
                  <div className="text-sm text-muted-foreground"></div>
                </CardContent>
              </Card>
              <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-[#0284c7]/10 to-[#0284c7]/5">
                <CardContent className="text-center p-6">
                  <div className="text-5xl font-bold text-[#0284c7] mb-2"></div>
                  <div className="text-sm text-muted-foreground"></div>
                </CardContent>
              </Card>
              <Card className="aspect-square flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                <CardContent className="text-center p-6">
                  <div className="text-5xl font-bold text-accent mb-2"></div>
                  <div className="text-sm text-muted-foreground"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="certificates" className="pt-4 pb-8 bg-white">
        <div className="container mx-auto py-0 px-3">
          <div className="text-center mb-12">
            <h2 className="font-heading mb-4 font-semibold text-2xl">Сертификаты</h2>
            <p className="text-lg text-muted-foreground">Вся продукция сертифицирована и соответствует стандартам качества</p>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {['ГОСТ Р', 'ТР ТС', 'ISO 9001'].map((cert, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardContent className="p-3 md:py-4 md:px-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                    <Icon name="Award" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-sm md:text-xl font-heading font-bold mb-1 md:mb-2">{cert}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Сертификат соответствия</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="bg-muted/30 px-3 py-[7px]">
        <div className="container mx-auto px-0 py-0">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-2xl my-0 py-0">Контакты</h2>
            <p className="text-lg text-muted-foreground py-0">Свяжитесь с нами любым удобным способом</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:py-4 md:px-6 py-[15px]">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <h3 className="text-base md:text-base font-bold mb-2 md:mb-2">Телефон</h3>
                <a href="tel:+79181151551" className="md:text-base text-primary hover:underline break-words block text-lg">+7 (918) 115-15-51</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:py-4 md:px-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Icon name="Mail" size={24} className="text-secondary" />
                </div>
                <h3 className="text-base md:text-base font-bold mb-2 md:mb-2">Email</h3>
                <a href="mailto:info@urban-play.ru" className="md:text-base text-secondary hover:underline break-words block text-lg">info@urban-play.ru</a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:py-4 md:px-6 py-[15px]">
                <div className="w-12 h-12 bg-[#0284c7]/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Icon name="MapPin" size={24} className="text-[#0284c7]" />
                </div>
                <h3 className="text-base md:text-base font-bold mb-2 md:mb-2">Адрес</h3>
                <a 
                  href="https://yandex.ru/maps/?pt=38.973389,45.053547&z=16&l=map&text=г.%20Краснодар%2C%20ул.%20Кореновская%2C%20д.%2057" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="md:text-base text-blue-600 hover:underline break-words block text-lg"
                >
                  г. Краснодар, ул. Кореновская, д. 57 оф. 7
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-[5px]" style={{ backgroundColor: '#1a0129', color: '#ffffff' }}>
        <div className="container mx-auto px-4 text-center my-0 py-0">
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