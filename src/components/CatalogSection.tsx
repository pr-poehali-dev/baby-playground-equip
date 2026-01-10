import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { ContactDialog } from './ContactDialog';

interface SubSubcategory {
  name: string;
  image: string;
}

interface Subcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubcategory[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  bgImage: string;
  subcategories: Subcategory[];
  order?: number;
}

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

interface CatalogSectionProps {
  categories: Category[];
  products: Product[];
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedSubSubcategory: string | null;
  setSelectedSubSubcategory: (value: string | null) => void;
  handleTreeCategorySelect: (id: string, cat: Category) => void;
  expandedSubcategories: string[];
  handleTreeSubcategorySelect: (catId: string, cat: Category, subName: string, sub: Subcategory) => void;
  handleTreeSubSubcategorySelect: (catId: string, cat: Category, subName: string, subSubName: string) => void;
  isCategoryDialogOpen: boolean;
  setIsCategoryDialogOpen: (open: boolean) => void;
  currentCategory: Category | null;
  handleCategoryClick: (cat: Category) => void;
  handleSubcategoryClick: (sub: Subcategory) => void;
  isSubSubcategoryDialogOpen: boolean;
  setIsSubSubcategoryDialogOpen: (open: boolean) => void;
  currentSubcategory: Subcategory | null;
  handleSubSubcategoryClick: (subSubName: string) => void;
  filteredProducts: Product[];
  handleAddToCart: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleResetFilters: () => void;
  selectedSeries: string | null;
  setSelectedSeries: (series: string | null) => void;
  availableCategories: string[];
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function CatalogSection({
  categories,
  products,
  isSideMenuOpen,
  setIsSideMenuOpen,
  expandedCategories,
  toggleCategory,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  setSelectedSubSubcategory,
  handleTreeCategorySelect,
  expandedSubcategories,
  handleTreeSubcategorySelect,
  handleTreeSubSubcategorySelect,
  isCategoryDialogOpen,
  setIsCategoryDialogOpen,
  currentCategory,
  handleCategoryClick,
  handleSubcategoryClick,
  isSubSubcategoryDialogOpen,
  setIsSubSubcategoryDialogOpen,
  currentSubcategory,
  handleSubSubcategoryClick,
  filteredProducts,
  handleAddToCart,
  searchQuery,
  setSearchQuery,
  handleResetFilters,
  selectedSeries,
  setSelectedSeries,
  availableCategories,
  favorites,
  toggleFavorite,
}: CatalogSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery && productsRef.current) {
      setTimeout(() => {
        const element = productsRef.current;
        if (element) {
          const yOffset = -90;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchQuery]);

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
    setCurrentImageIndex(0);
    setProductImages([]);
    
    const article = product.name.split('\n')[0]?.replace('Арт. ', '');
    if (article) {
      try {
        const response = await fetch(`https://functions.poehali.dev/686e9704-6a8f-429d-a2d2-88f49ab86fd8?article=${article}`);
        const data = await response.json();
        if (data.success && data.images.length > 0) {
          setProductImages(data.images);
        }
      } catch (error) {
        console.error('Failed to load product images:', error);
      }
    }
  };
  return (
    <>
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: 'url(https://cdn.poehali.dev/files/%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0.png)' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6 text-white">
              Создаём пространство для игры и спорта
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8">
              Производим качественное детское игровое, спортивное и парковое оборудование. 
              Безопасность, долговечность и яркий дизайн — наши главные приоритеты.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg px-8" onClick={() => setIsSideMenuOpen(true)}>
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Смотреть каталог
              </Button>
            </div>
          </div>
        </div>

      </section>

      <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-heading">Каталог</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-2">
            {categories.map((cat) => {
              const isExpanded = expandedCategories.includes(cat.id);
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => toggleCategory(cat.id)}
                    >
                      <Icon 
                        name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                        size={16} 
                      />
                    </Button>
                    <button
                      className={`flex-1 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 bg-white ${
                        selectedCategory === cat.id && !selectedSubcategory ? 'bg-primary/10 text-primary font-semibold' : ''
                      }`}
                      onClick={() => handleTreeCategorySelect(cat.id, cat)}
                    >
                      <span className="text-base flex-1">{cat.name}</span>
                    </button>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-10 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => {
                        const subKey = `${cat.id}-${sub.name}`;
                        const isSubExpanded = expandedSubcategories.includes(subKey);
                        
                        return (
                          <div key={sub.name}>
                            <div className="flex items-center gap-1">
                              {sub.hasChildren && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-6 h-6 p-0"
                                  onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                                >
                                  <Icon 
                                    name={isSubExpanded ? "ChevronDown" : "ChevronRight"} 
                                    size={14} 
                                  />
                                </Button>
                              )}
                              <button
                                className={`flex-1 text-left px-2 py-1.5 rounded text-base hover:bg-muted transition-colors flex items-center gap-2 bg-white ${
                                  !sub.hasChildren ? 'ml-6' : ''
                                } ${
                                  (selectedSeries && sub.name.includes(selectedSeries.replace('Серия "', '').replace('"', ''))) || (selectedCategory === cat.id && selectedSubcategory === sub.name && !selectedSubSubcategory)
                                    ? 'bg-primary/10 text-primary font-semibold' 
                                    : ''
                                }`}
                                onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                              >
                                <span className="flex-1">{sub.name}</span>
                              </button>
                            </div>
                            
                            {isSubExpanded && sub.children && (
                              <div className="ml-8 mt-1 space-y-1">
                                {sub.children.map((subSub) => (
                                  <button
                                    key={subSub.name}
                                    className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2 bg-white ${
                                      selectedCategory === cat.id && 
                                      selectedSubcategory === sub.name && 
                                      selectedSubSubcategory === subSub.name
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : ''
                                    }`}
                                    onClick={() => handleTreeSubSubcategorySelect(cat.id, cat, sub.name, subSub.name)}
                                  >
                                    <span className="flex-1">{subSub.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <section id="catalog" className="pt-16 pb-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl font-heading font-bold mb-4">Каталог продукции</h2>
            <p className="text-lg text-muted-foreground">Широкий ассортимент детского игрового и спортивного оборудования </p>
          </div>

          <div className="space-y-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.filter(cat => [1, 2, 3].includes(cat.order || 0)).map((cat) => (
                <Card
                  key={cat.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 overflow-hidden group border-2 ${
                    selectedCategory === cat.id ? 'border-primary shadow-xl' : 'border-transparent hover:border-primary/20'
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src={cat.bgImage} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className={`py-3 px-4 bg-gradient-to-br ${cat.color} relative flex items-center justify-center border-t-2 border-gray-200 group-hover:border-primary/30 transition-colors`}>
                    <h3 className="text-base font-heading font-bold text-center text-foreground leading-tight group-hover:scale-105 transition-transform duration-300">{cat.name}</h3>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.filter(cat => [4, 5, 6].includes(cat.order || 0)).map((cat) => (
                <Card
                  key={cat.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 overflow-hidden group border-2 ${
                    selectedCategory === cat.id ? 'border-primary shadow-xl' : 'border-transparent hover:border-primary/20'
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src={cat.bgImage} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className={`py-3 px-4 bg-gradient-to-br ${cat.color} relative flex items-center justify-center border-t-2 border-gray-200 group-hover:border-primary/30 transition-colors`}>
                    <h3 className="text-base font-heading font-bold text-center text-foreground leading-tight group-hover:scale-105 transition-transform duration-300">{cat.name}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-heading text-center mb-2">
                  {currentCategory?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {currentCategory?.subcategories.map((sub) => (
                  <Card
                    key={sub.name}
                    className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden group border-2 border-transparent hover:border-primary"
                    onClick={() => handleSubcategoryClick(sub)}
                  >
                    <div className="aspect-[3/2] relative overflow-hidden bg-white flex items-center justify-center">
                      {sub.image.startsWith('http') ? (
                        <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{sub.image}</span>
                      )}
                    </div>
                    <div className="py-4 px-4 bg-white">
                      <h4 className="text-xl font-semibold text-center">{sub.name}</h4>
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSubSubcategoryDialogOpen} onOpenChange={setIsSubSubcategoryDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-heading text-center mb-2">
                  {currentSubcategory?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {currentSubcategory?.children?.map((subSub) => (
                  <Card
                    key={subSub.name}
                    className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden group border-2 border-transparent hover:border-primary"
                    onClick={() => handleSubSubcategoryClick(subSub.name)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center">
                      {subSub.image.startsWith('http') ? (
                        <img src={subSub.image} alt={subSub.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{subSub.image}</span>
                      )}
                    </div>
                    <div className="py-2 px-3 bg-white">
                      <h4 className="text-sm font-semibold text-center">{subSub.name}</h4>
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {selectedCategory && (
            <div id="products" className="container mx-auto px-4">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-4 mt-8">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <div className="sticky top-[85px] bg-white z-40 pb-4 pt-4 -mx-4 px-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="Поиск по артикулу или названию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {(selectedSubSubcategory || selectedSeries || searchQuery) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Сбросить
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Button
                    variant={(selectedSeries?.includes('Classic')) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSeries(selectedSeries?.includes('Classic') ? null : 'Серия "Classic"')}
                    className={selectedSeries?.includes('Classic') ? 'bg-secondary hover:bg-secondary/90' : ''}
                  >
                    Classic
                  </Button>
                  <Button
                    variant={(selectedSeries?.includes('Eco')) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSeries(selectedSeries?.includes('Eco') ? null : 'Серия "Eco"')}
                    className={selectedSeries?.includes('Eco') ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    Eco
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableCategories.includes('Игровые комплексы') && (
                    <Button
                      variant={selectedSubSubcategory === 'Игровые комплексы' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Игровые комплексы' ? null : 'Игровые комплексы')}
                      className={selectedSubSubcategory === 'Игровые комплексы' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Комплексы
                    </Button>
                  )}
                  {availableCategories.includes('Качели') && (
                    <Button
                      variant={selectedSubSubcategory === 'Качели' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Качели' ? null : 'Качели')}
                      className={selectedSubSubcategory === 'Качели' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Качели
                    </Button>
                  )}
                  {availableCategories.includes('Карусели') && (
                    <Button
                      variant={selectedSubSubcategory === 'Карусели' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Карусели' ? null : 'Карусели')}
                      className={selectedSubSubcategory === 'Карусели' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Карусели
                    </Button>
                  )}
                  {availableCategories.includes('Балансиры') && (
                    <Button
                      variant={selectedSubSubcategory === 'Балансиры' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Балансиры' ? null : 'Балансиры')}
                      className={selectedSubSubcategory === 'Балансиры' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Балансиры
                    </Button>
                  )}
                  {availableCategories.includes('Горки') && (
                    <Button
                      variant={selectedSubSubcategory === 'Горки' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Горки' ? null : 'Горки')}
                      className={selectedSubSubcategory === 'Горки' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Горки
                    </Button>
                  )}
                  {availableCategories.includes('Workout') && (
                    <Button
                      variant={selectedSubSubcategory === 'Workout' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubSubcategory(selectedSubSubcategory === 'Workout' ? null : 'Workout')}
                      className={selectedSubSubcategory === 'Workout' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                      Workout
                    </Button>
                  )}
                </div>
              </div>

              <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                      <div 
                        className="aspect-[4/3] relative overflow-hidden bg-white flex items-center justify-center"
                        onClick={() => handleProductClick(product)}
                      >
                        {product.image.startsWith('http') ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${product.id === 110 ? 'p-0' : 'p-4'}`}
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-5xl">{product.image}</span>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="leading-tight space-y-0" onClick={() => handleProductClick(product)}>
                          {product.name.includes('\n') ? (
                            <>
                              <p className="text-xs text-muted-foreground leading-tight">{product.name.split('\n')[0]}</p>
                              <h3 className="text-sm font-heading font-bold line-clamp-2 leading-tight">{product.name.split('\n')[1]}</h3>
                            </>
                          ) : (
                            <h3 className="text-sm font-heading font-bold line-clamp-2">{product.name}</h3>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary mt-2">{formatPrice(product.price)} ₽</p>
                        <Button 
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <Icon name="ShoppingCart" size={14} className="mr-1" />
                          В корзину
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                    <p className="text-muted-foreground mb-4">
                      В выбранной категории пока нет товаров
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

        </div>
      </section>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square relative overflow-hidden bg-white rounded-lg border flex items-center justify-center">
                  {productImages.length > 0 ? (
                    <img 
                      src={productImages[currentImageIndex]} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain p-8"
                      style={{ imageRendering: 'high-quality' }}
                    />
                  ) : selectedProduct.image.startsWith('http') ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className={`w-full h-full object-contain ${selectedProduct.id === 110 ? 'p-0' : 'p-8'}`}
                      style={{ imageRendering: 'high-quality' }}
                    />
                  ) : (
                    <span className="text-9xl">{selectedProduct.image}</span>
                  )}
                </div>
                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                          idx === currentImageIndex ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  {selectedProduct.name.includes('\n') ? (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">{selectedProduct.name.split('\n')[0]}</p>
                      <h2 className="text-3xl font-heading font-bold">{selectedProduct.name.split('\n')[1]}</h2>
                    </>
                  ) : (
                    <h2 className="text-3xl font-heading font-bold">{selectedProduct.name}</h2>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{formatPrice(selectedProduct.price)} ₽</span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg"
                    className="flex-1"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setIsProductDialogOpen(false);
                    }}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    Добавить в заявку
                  </Button>
                  <Button 
                    size="lg"
                    variant={favorites.some(f => f.id === selectedProduct.id) ? "default" : "outline"}
                    onClick={() => toggleFavorite(selectedProduct)}
                  >
                    <Icon name="Heart" size={20} className={favorites.some(f => f.id === selectedProduct.id) ? "fill-current" : ""} />
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-heading font-bold mb-4">Техническая информация</h3>
                  {selectedProduct.dimensions && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {selectedProduct.dimensions.split('х').map((dim, idx) => (
                        <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            {idx === 0 ? 'Ширина' : idx === 1 ? 'Длина' : 'Высота'}
                          </p>
                          <p className="text-lg font-bold">{dim.trim()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedProduct.description && (
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <p className="text-muted-foreground mb-4">
                    Если появились вопросы, вы можете получить консультацию руководителя проекта:
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      setIsProductDialogOpen(false);
                      setIsContactDialogOpen(true);
                    }}
                  >
                    <Icon name="Phone" size={20} className="mr-2" />
                    Перезвоните мне
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ContactDialog 
        open={isContactDialogOpen} 
        onOpenChange={setIsContactDialogOpen}
      />
    </>
  );
}