import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenCatalog: () => void;
}

export function HeroSection({ onOpenCatalog }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-0 pb-16 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[700px]">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url(https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/1908c128-b91d-446a-a7dd-65fd06e164f8.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30 px-0 mx-0 my-0 py-0"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 my-[60px]">
        <div className="max-w-3xl animate-fade-in">
          <h2 className="md:text-4xl lg:text-6xl font-heading md:mb-6 text-white font-semibold text-2xl py-0 my-0">
            Создаём пространство для игры и спорта
          </h2>
          <p className="md:text-xl text-white/90 md:mb-8 text-sm my-[19px] py-0">
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