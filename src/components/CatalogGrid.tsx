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

  return (
    <section id="catalog" className="py-16 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12">
          Каталог продукции
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedCategories.map((category, idx) => (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden animate-scale-in border-2 hover:border-primary"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => onCategoryClick(category)}
            >
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} group-hover:scale-110 transition-transform duration-300`}></div>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center bg-white">
                  <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
