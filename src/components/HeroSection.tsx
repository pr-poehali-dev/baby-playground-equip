import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenCatalog: () => void;
}

export function HeroSection({ onOpenCatalog }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-0 pb-2 md:pb-4 overflow-hidden min-h-[225px] md:min-h-[400px]">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url(https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/3dfae01f-ed05-4e73-8732-003e8bd94840.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 px-0 mx-0 bg-[#00000030] py-0 my-0"></div>
      </div>

      <div className="container relative z-10 md:my-[93px] mx-0 py-2.5 my-0 px-2">
        <div className="max-w-3xl animate-fade-in px-0 mx-0">
          <h2 className="md:text-4xl lg:text-6xl font-heading md:mb-6 text-white font-semibold py-0 my-[18px] px-0 mx-0 text-3xl">
            Создаём пространство для игры и спорта
          </h2>
          <p className="md:text-xl text-white/90 md:mb-8 py-0 font-normal my-0 mx-0 px-0.5 text-left text-sm">
            Производим качественное детское игровое, спортивное и парковое оборудование. 
            Безопасность, долговечность и яркий дизайн — наши главные приоритеты.
          </p>
          <div className="flex flex-wrap gap-4 mx-0 my-1 px-0 py-[17px]">
            <Button size="lg" className="text-lg px-8 hover:brightness-90" style={{ backgroundColor: '#3eaa03' }} onClick={onOpenCatalog}>Каталог</Button>
          </div>
        </div>
      </div>
    </section>
  );
}