import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenCatalog: () => void;
}

export function HeroSection({ onOpenCatalog }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-0 pb-16 md:pb-36 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: 'url(https://cdn.poehali.dev/files/19191919.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/30 py-0 px-0 mx-0 my-0"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 my-3">
        <div className="max-w-3xl animate-fade-in">
          <h2 className="md:text-4xl lg:text-6xl font-heading md:mb-6 text-white font-semibold text-2xl my-[65px]">
            Создаём пространство для игры и спорта
          </h2>
          <p className="md:text-xl text-white/90 mb-6 md:mb-8 text-sm">
            Производим качественное детское игровое, спортивное и парковое оборудование. 
            Безопасность, долговечность и яркий дизайн — наши главные приоритеты.
          </p>
          <div className="flex flex-wrap gap-4 my-0">
            <Button size="lg" className="text-lg px-8 hover:brightness-90" style={{ backgroundColor: '#3eaa03' }} onClick={onOpenCatalog}>Каталог</Button>
          </div>
        </div>
      </div>
    </section>
  );
}