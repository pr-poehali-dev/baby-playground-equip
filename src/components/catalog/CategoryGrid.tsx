import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
  price: string;
  image: string;
  description?: string;
  dimensions?: string;
  article?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  bgImage: string;
  subcategories: any[];
  order?: number;
}

interface CategoryGridProps {
  selectedCategory: string | null;
  categories: Category[];
  filtersRef: RefObject<HTMLDivElement>;
  selectedSeries: string | null;
  setSelectedSeries: (series: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleResetFilters: () => void;
  selectedSubcategory: string | null;
  selectedSubSubcategory: string | null;
  productsRef: RefObject<HTMLDivElement>;
  filteredProducts: Product[];
  handleProductClick: (product: Product) => void;
  handleAddToCart: (product: Product) => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  setSelectedSubSubcategory: (value: string | null) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function CategoryGrid({
  selectedCategory,
  categories,
  filtersRef,
  selectedSeries,
  setSelectedSeries,
  searchQuery,
  setSearchQuery,
  handleResetFilters,
  selectedSubcategory,
  selectedSubSubcategory,
  productsRef,
  filteredProducts,
  handleProductClick,
  handleAddToCart,
  favorites,
  toggleFavorite,
  setSelectedSubSubcategory,
}: CategoryGridProps) {
  if (!selectedCategory) return null;

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentSubcategory = currentCategory?.subcategories.find(s => s.name === selectedSeries);
  const availableSubSubcategories = currentSubcategory?.children || [];

  const handleReset = () => {
    if (searchQuery) {
      setSearchQuery('');
    } else {
      handleResetFilters();
    }
  };

  return (
    <div id="products" className="container mx-auto px-4 pt-2">
      <div ref={filtersRef}>
        <div className="sticky top-[84px] bg-white z-40 pb-3 pt-2 -mx-4 px-4">
          <h2 className="text-4xl font-heading font-bold mb-4">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-2">
              <Button
                variant={(selectedSeries?.includes('Classic')) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSeries(selectedSeries?.includes('Classic') ? null : 'Серия "Classic"')}
                className={selectedSeries?.includes('Classic') ? 'series-filter-active' : 'series-filter'}
              >
                Classic
              </Button>
              <Button
                variant={(selectedSeries?.includes('Eco')) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSeries(selectedSeries?.includes('Eco') ? null : 'Серия "Eco"')}
                className={selectedSeries?.includes('Eco') ? 'series-filter-active' : 'series-filter'}
              >
                Eco
              </Button>
            </div>
            {availableSubSubcategories.length > 0 && (
              <Select
                value={selectedSubSubcategory || 'all'}
                onValueChange={(value) => setSelectedSubSubcategory(value === 'all' ? null : value)}
              >
                <SelectTrigger className="w-52 h-9">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {availableSubSubcategories.map((subSub) => (
                    <SelectItem key={subSub.name} value={subSub.name}>
                      {subSub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="relative w-80 ml-auto">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Сбросить
            </Button>
          </div>
        </div>

        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.some(f => f.id === product.id);
            return (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group border-2 border-transparent hover:border-primary"
              >
                <div 
                  className="aspect-square bg-white flex items-center justify-center relative overflow-hidden"
                  onClick={() => handleProductClick(product)}
                >
                  {product.image.startsWith('http') ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                  >
                    <Icon name="Heart" size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs mb-2">{product.name.split('\n')[0]}</Badge>
                    <h3 className="font-semibold text-base line-clamp-2 min-h-[48px]">{product.name.split('\n')[1] || product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xl font-bold text-primary flex-shrink-0">{formatPrice(product.price)} ₽</p>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <Icon name="ShoppingCart" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Icon name="PackageX" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Товары не найдены</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}