import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenCatalog: () => void;
}

export function HeroSection({ onOpenCatalog }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: 'url(https://cdn.poehali.dev/files/Airbrush-IMAGE-ENHANCER-1768087843511-1768087843512.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6 text-white">
            Создаём пространство для игры и спорта
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
            Производим качественное детское игровое, спортивное и парковое оборудование. 
            Безопасность, долговечность и яркий дизайн — наши главные приоритеты.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="text-lg px-8" onClick={onOpenCatalog}>Выбрать оборудование</Button>
          </div>
        </div>
      </div>
    </section>
  );
}