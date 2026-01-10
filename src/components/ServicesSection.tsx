import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export function ServicesSection() {
  return (
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
  );
}
