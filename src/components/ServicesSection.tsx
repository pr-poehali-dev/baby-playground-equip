import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/30 order-1 md:order-1 py-2.5">
      <div className="container mx-auto px-3">
        <h2 className="font-heading font-semibold text-center mb-4 text-3xl">Услуги</h2>
        <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto md:whitespace-nowrap">
          Полный цикл работ — от идеи до установки. Мы обеспечиваем качество на каждом этапе
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: 'Ruler', title: 'Проектирование', desc: 'Разработка индивидуальных проектов детских площадок', color: 'text-[#44aa02]', bg: 'bg-[#44aa02]/10' },
            { icon: 'Factory', title: 'Производство', desc: 'Собственное производство из качественных материалов', color: 'text-[#ea580c]', bg: 'bg-[#ea580c]/10' },
            { icon: 'Truck', title: 'Доставка', desc: 'Доставка по всей России в удобное время', color: 'text-[#58078a]', bg: 'bg-[#58078a]/10' },
            { icon: 'Wrench', title: 'Монтаж', desc: 'Профессиональная установка и гарантия качества', color: 'text-[#0284c7]', bg: 'bg-[#0284c7]/10' }
          ].map((service, idx) => (
            <Card key={idx} className="text-center hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${idx * 0.15}s` }}>
              <CardHeader className="py-3 px-4">
                <div className={`w-12 h-12 ${service.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon name={service.icon as any} size={24} className={service.color} />
                </div>
                <CardTitle className="text-base mb-1">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-snug">{service.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}