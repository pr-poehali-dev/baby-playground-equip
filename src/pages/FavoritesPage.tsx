import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link, useNavigate } from 'react-router-dom';

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
  price: string;
  image: string;
  description?: string;
  article?: string;
}

interface FavoritesPageProps {
  favorites: Product[];
  removeFromFavorites: (id: number) => void;
  addToCart: (product: Product) => void;
}

export default function FavoritesPage({ favorites, removeFromFavorites, addToCart }: FavoritesPageProps) {
  const navigate = useNavigate();

  const handleNavigateToCatalog = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('catalog');
      if (element) {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/photo_643632026-01-05_09-32-44.png" 
                alt="Urban Play"
                className="h-16 w-auto"
              />
            </Link>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNavigateToCatalog}
              className="hover:border-primary hover:text-primary hover:bg-transparent h-9 w-9 md:h-10 md:w-auto md:px-4"
            >
              <Icon name="ArrowLeft" size={20} className="md:mr-2" />
              <span className="hidden md:inline">Назад в каталог</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading font-bold mb-8">Избранное</h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon name="Heart" size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Список избранного пуст</h2>
            <p className="text-muted-foreground mb-6">
              Добавляйте товары в избранное, нажимая на сердечко в карточке товара
            </p>
            <Button onClick={handleNavigateToCatalog}>
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Перейти к каталогу
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group">
                <div className="aspect-[4/3] relative overflow-hidden bg-white flex items-center justify-center">
                  {product.image.startsWith('http') ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-5xl">{product.image}</span>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="leading-tight space-y-0">
                    {product.name.includes('\n') ? (
                      <>
                        <p className="text-xs text-muted-foreground leading-tight">{product.name.split('\n')[0]}</p>
                        <h3 className="text-sm font-heading font-bold line-clamp-2 leading-tight">{product.name.split('\n')[1]}</h3>
                      </>
                    ) : (
                      <h3 className="text-sm font-heading font-bold line-clamp-2">{product.name}</h3>
                    )}
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-tight">{product.description}</p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-primary mt-2">{formatPrice(product.price)} ₽</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm"
                      className="flex-1"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" size={14} className="mr-1" />
                      В корзину
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}