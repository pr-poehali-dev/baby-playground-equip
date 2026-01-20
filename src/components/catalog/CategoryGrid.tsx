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
  selectedProduct: Product | null;
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
  selectedProduct,
}: CategoryGridProps) {
  if (!selectedCategory) return null;

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const availableSeries = currentCategory?.subcategories || [];
  const currentSubcategory = currentCategory?.subcategories.find(s => s.name === selectedSeries);
  const availableSubSubcategories = currentSubcategory?.children || [];
  
  const selectedSubSubParts = selectedSubSubcategory?.split(' > ') || [];
  const selectedSubSubLevel1 = selectedSubSubParts[0] || null;
  const selectedSubSubLevel2 = selectedSubSubParts[1] || null;
  
  // Найти текущую категорию
  const currentSubSub = availableSubSubcategories.find(s => s.name === selectedSubSubLevel1);
  let availableSubSubSubcategories: any[] = [];
  
  // Если у выбранной категории есть дети (темы)
  if (selectedSubSubLevel1 && currentSubSub?.children) {
    availableSubSubSubcategories = currentSubSub.children;
  }
  
  // Значение для первого селекта
  const firstSelectValue = selectedSubSubLevel1 || 'all';

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
        {/* Заголовок - скрывается при скролле на мобильных */}
        <h2 className="text-4xl font-heading sm:block font-semibold my-2.5">
          {categories.find(c => c.id === selectedCategory)?.name}
        </h2>
        
        <div className="sticky top-[84px] bg-white z-40 -mx-4 px-4 my-0 py-5">
          {/* Поиск и сброс - мобильная версия */}
          <div className="flex sm:hidden items-center gap-2 mb-3">
            <div className="relative flex-1">
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
              className="hover:border-primary hover:text-primary hover:bg-transparent"
            >
              Сбросить
            </Button>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 mb-4 py-0">
            {availableSeries.length > 0 && (
              <Select
                value={selectedSeries || 'all-series'}
                onValueChange={(value) => {
                  setSelectedSeries(value === 'all-series' ? null : value);
                }}
              >
                <SelectTrigger className={`w-[30%] sm:w-52 h-9 hover:border-secondary hover:text-secondary hover:bg-white focus:ring-0 focus:ring-offset-0 ${selectedSeries ? 'text-[#1d2025]' : ''}`}>
                  <SelectValue placeholder="Серии" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-series">Все серии</SelectItem>
                  {availableSeries.map((series) => (
                    <SelectItem key={series.name} value={series.name}>
                      {series.name.replace('Серия "', '').replace('"', '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {availableSubSubcategories.length > 0 && (
              <Select
                value={firstSelectValue}
                onValueChange={(value) => {
                  setSelectedSubSubcategory(value === 'all' ? null : value);
                }}
              >
                <SelectTrigger className={`w-[35%] sm:w-52 h-9 hover:border-secondary hover:text-secondary hover:bg-white focus:ring-0 focus:ring-offset-0 ${selectedSubSubLevel1 ? 'text-[#1d2025]' : ''}`}>
                  <SelectValue placeholder="Категории" />
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
            {availableSubSubSubcategories.length > 0 && selectedSubSubLevel1 && (
              <Select
                value={selectedSubSubLevel2 || 'all-themes'}
                onValueChange={(value) => {
                  if (value === 'all-themes') {
                    setSelectedSubSubcategory(selectedSubSubLevel1);
                  } else {
                    setSelectedSubSubcategory(`${selectedSubSubLevel1} > ${value}`);
                  }
                }}
              >
                <SelectTrigger className={`w-[35%] sm:w-52 h-9 hover:border-secondary hover:text-secondary hover:bg-white focus:ring-0 focus:ring-offset-0 ${selectedSubSubLevel2 ? 'text-[#1d2025]' : ''}`}>
                  <SelectValue placeholder="Темы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-themes">Все серии</SelectItem>
                  {availableSubSubSubcategories.map((subSubSub) => (
                    <SelectItem key={subSubSub.name} value={subSubSub.name}>
                      {subSubSub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

          </div>
        </div>

        <div ref={productsRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-0 pb-2">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.some(f => f.id === product.id);
            const isSelected = selectedProduct?.id === product.id;
            return (
              <Card 
                key={product.id} 
                className={`overflow-hidden transition-all cursor-pointer group border-2 hover:shadow-xl rounded-md ${
                  isSelected ? 'border-gray-200 hover:border-gray-200' : 'border-gray-200 hover:border-gray-200'
                }`}
                style={isSelected ? { borderColor: '#3eaa03' } : {}}
              >
                <div 
                  className="aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden p-2"
                  onClick={() => handleProductClick(product)}
                >
                  {product.image.startsWith('http') ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-transparent hover:bg-transparent hover:text-red-500 z-10 border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                  >
                    <Icon name="Heart" size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                  </Button>
                </div>
                <CardContent className="py-1.5 px-2 sm:p-3">
                  <p className="mb-0.5 leading-tight text-xs text-[#5a098c]">{product.name.split('\n')[0]}</p>
                  <h3 className="font-semibold line-clamp-1 mb-1 leading-tight text-sm sm:text-base">{product.name.split('\n')[1] || product.name}</h3>
                  <p className="text-sm sm:text-base font-bold text-primary mb-1.5">{formatPrice(product.price)} ₽</p>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="gap-1 w-full h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Icon name="ShoppingCart" size={14} />
                    <span>В корзину</span>
                  </Button>
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