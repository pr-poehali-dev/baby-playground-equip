import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  bgImage: string;
  order?: number;
}

interface CatalogGridProps {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
}

export function CatalogGrid({ categories, onCategoryClick }: CatalogGridProps) {
  const sortedCategories = [...categories].sort((a, b) => (a.order || 999) - (b.order || 999));

  const categoryColors: Record<string, string> = {
    'playground': 'bg-green-100',
    'sport': 'bg-purple-100',
    'park': 'bg-blue-100',
    'improvement': 'bg-gray-100',
    'coating': 'bg-yellow-100',
    'fencing': 'bg-slate-100'
  };

  return (
    <section id="catalog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
          Каталог продукции
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12">
          Широкий ассортимент детского игрового и спортивного оборудования
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sortedCategories.slice(0, 6).map((category, idx) => (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden animate-scale-in border-0 rounded-2xl"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => onCategoryClick(category)}
            >
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={category.bgImage} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 py-4 text-center ${categoryColors[category.id] || 'bg-gray-100'}`}>
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}