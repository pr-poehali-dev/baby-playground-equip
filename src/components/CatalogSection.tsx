import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Icon from '@/components/ui/icon';

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
}

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
  price: string;
  image: string;
  tags: string[];
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
  handleTreeCategorySelect: (id: string, cat: Category) => void;
  expandedSubcategories: string[];
  handleTreeSubcategorySelect: (catId: string, cat: Category, subName: string, sub: Subcategory) => void;
  handleTreeSubSubcategorySelect: (catId: string, cat: Category, subName: string, subSubName: string) => void;
  isCategoryDialogOpen: boolean;
  setIsCategoryDialogOpen: (open: boolean) => void;
  currentCategory: Category | null;
  handleCategoryClick: (cat: Category) => void;
  handleSubcategoryClick: (cat: Category, sub: Subcategory) => void;
  isSubSubcategoryDialogOpen: boolean;
  setIsSubSubcategoryDialogOpen: (open: boolean) => void;
  currentSubcategory: Subcategory | null;
  handleSubSubcategoryClick: (cat: Category, sub: Subcategory, subSub: SubSubcategory) => void;
  filteredProducts: Product[];
  handleAddToCart: (product: Product) => void;
  handleResetFilters: () => void;
}

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
  handleResetFilters,
}: CatalogSectionProps) {
  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://cdn.poehali.dev/files/_____.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">
              Создаём пространство для игры и спорта
            </h2>
            <p className="text-xl text-white/90 mb-8">
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
                      className={`flex-1 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 ${
                        selectedCategory === cat.id && !selectedSubcategory ? 'bg-primary/10 text-primary font-semibold' : ''
                      }`}
                      onClick={() => handleTreeCategorySelect(cat.id, cat)}
                    >
                      <span className="text-xl">{cat.image}</span>
                      <Icon name={cat.icon as any} size={20} className="shrink-0" />
                      <span className="text-sm flex-1">{cat.name}</span>
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
                                className={`flex-1 text-left px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                                  !sub.hasChildren ? 'ml-6' : ''
                                } ${
                                  selectedCategory === cat.id && selectedSubcategory === sub.name && !selectedSubSubcategory 
                                    ? 'bg-primary/10 text-primary font-semibold' 
                                    : ''
                                }`}
                                onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                              >
                                <span className="text-lg">{sub.image}</span>
                                <span className="flex-1">{sub.name}</span>
                              </button>
                            </div>
                            
                            {isSubExpanded && sub.children && (
                              <div className="ml-8 mt-1 space-y-1">
                                {sub.children.map((subSub) => (
                                  <button
                                    key={subSub.name}
                                    className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted transition-colors flex items-center gap-2 ${
                                      selectedCategory === cat.id && 
                                      selectedSubcategory === sub.name && 
                                      selectedSubSubcategory === subSub.name
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : ''
                                    }`}
                                    onClick={() => handleTreeSubSubcategorySelect(cat.id, cat, sub.name, subSub.name)}
                                  >
                                    <span>{subSub.image}</span>
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
            <p className="text-lg text-muted-foreground">Широкий ассортимент оборудования для детских площадок и парков</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className={`cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden group border-2 ${
                  selectedCategory === cat.id ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src={cat.bgImage} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className={`py-3 px-4 bg-gradient-to-br ${cat.color} relative flex items-center justify-center border-t-2 border-gray-200`}>
                  <h3 className="text-lg font-heading font-bold text-center text-foreground leading-tight">{cat.name}</h3>
                </div>
              </Card>
            ))}
          </div>

          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-heading text-center mb-2">
                  {currentCategory?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {currentCategory?.subcategories.map((sub) => (
                  <Card
                    key={sub.name}
                    className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden group border-2 border-transparent hover:border-primary"
                    onClick={() => handleSubcategoryClick(currentCategory, sub)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{sub.image}</span>
                    </div>
                    <div className="py-2 px-3 bg-white">
                      <h4 className="text-sm font-semibold text-center">{sub.name}</h4>
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
                    onClick={() => handleSubSubcategoryClick(currentCategory!, currentSubcategory, subSub)}
                  >
                    <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{subSub.image}</span>
                    </div>
                    <div className="py-2 px-3 bg-white">
                      <h4 className="text-sm font-semibold text-center">{subSub.name}</h4>
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {(selectedCategory || selectedSubcategory || selectedSubSubcategory) && (
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); handleResetFilters(); }}>
                        Все категории
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {selectedCategory && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {selectedSubcategory ? (
                            <BreadcrumbLink href="#" onClick={(e) => { 
                              e.preventDefault(); 
                              const cat = categories.find(c => c.id === selectedCategory);
                              if (cat) handleTreeCategorySelect(cat.id, cat);
                            }}>
                              {categories.find(c => c.id === selectedCategory)?.name}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>
                              {categories.find(c => c.id === selectedCategory)?.name}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </>
                    )}
                    {selectedSubcategory && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {selectedSubSubcategory ? (
                            <BreadcrumbLink href="#" onClick={(e) => { 
                              e.preventDefault(); 
                              const cat = categories.find(c => c.id === selectedCategory);
                              const sub = cat?.subcategories.find(s => s.name === selectedSubcategory);
                              if (cat && sub) handleTreeSubcategorySelect(cat.id, cat, sub.name, sub);
                            }}>
                              {selectedSubcategory}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{selectedSubcategory}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </>
                    )}
                    {selectedSubSubcategory && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{selectedSubSubcategory}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetFilters}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-heading font-bold mb-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">{product.price}</p>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory || selectedSubcategory || selectedSubSubcategory 
                    ? 'В выбранной категории пока нет товаров'
                    : 'Выберите категорию для просмотра товаров'
                  }
                </p>
                {(selectedCategory || selectedSubcategory || selectedSubSubcategory) && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Показать все товары
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}