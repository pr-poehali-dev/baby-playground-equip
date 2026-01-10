import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { CartItem } from './data/catalogData';

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
import { Link } from 'react-router-dom';
import { OrderForm, OrderFormData } from './OrderForm';

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

interface HeaderProps {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSideMenuOpen: (open: boolean) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  calculateTotal: () => number;
  deliveryCost: number;
  generateKP: () => void;
  favoritesCount?: number;
  allProducts?: Product[];
  onAddToCart?: (product: Product) => void;
}

export function Header({
  cart,
  isCartOpen,
  setIsCartOpen,
  setIsSideMenuOpen,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  deliveryCost,
  generateKP,
  favoritesCount = 0,
  allProducts = [],
  onAddToCart
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartSearchQuery, setCartSearchQuery] = useState('');

  const filteredCatalogProducts = allProducts.filter(product => 
    cartSearchQuery === '' || 
    product.name.toLowerCase().includes(cartSearchQuery.toLowerCase()) ||
    (product.article && product.article.toLowerCase().includes(cartSearchQuery.toLowerCase()))
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/photo_643632026-01-05_09-32-44.png" 
              alt="Urban Play"
              className="h-16 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#about" className="text-foreground hover:text-primary transition-colors text-base">О компании</a>
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors text-base">Каталог</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors text-base">Услуги</a>
            <a href="#certificates" className="text-foreground hover:text-primary transition-colors text-base">Сертификаты</a>
            <a href="#contacts" className="text-foreground hover:text-primary transition-colors text-base">Контакты</a>
          </nav>
          <div className="flex items-center gap-4">
            <a 
              href="tel:+79181151551" 
              className="hidden lg:flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold text-base"
            >
              <Icon name="Phone" size={20} className="text-primary" />
              +7 (918) 115-15-51
            </a>
            <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="md:hidden"
                >
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-heading">Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <a 
                    href="#about" 
                    className="text-base hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    О компании
                  </a>
                  <a 
                    href="#catalog" 
                    className="text-base hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Каталог
                  </a>
                  <a 
                    href="#services" 
                    className="text-base hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Услуги
                  </a>
                  <a 
                    href="#certificates" 
                    className="text-base hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Сертификаты
                  </a>
                  <a 
                    href="#contacts" 
                    className="text-base hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Контакты
                  </a>
                  <div className="border-t pt-4 mt-2">
                    <a 
                      href="tel:+79181151551" 
                      className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors"
                    >
                      <Icon name="Phone" size={20} className="text-primary" />
                      +7 (918) 115-15-51
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/favorites">
              <Button variant="outline" className="relative">
                <Icon name="Heart" size={20} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                {!showOrderForm && (
                  <>
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 mb-4">
                      <div className="relative">
                        <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          type="text"
                          placeholder="Поиск по каталогу..."
                          value={cartSearchQuery}
                          onChange={(e) => setCartSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {cartSearchQuery && filteredCatalogProducts.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Результаты поиска:</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {filteredCatalogProducts.slice(0, 10).map((product) => (
                            <Card key={product.id} className="cursor-pointer hover:bg-muted/50">
                              <CardContent className="p-3">
                                <div className="flex gap-3 items-center">
                                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center shrink-0 border">
                                    {product.image.startsWith('http') ? (
                                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className="text-2xl">{product.image}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-semibold line-clamp-2">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)} ₽</p>
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      if (onAddToCart) {
                                        onAddToCart(product);
                                        setCartSearchQuery('');
                                      }
                                    }}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {!showOrderForm && cart.length === 0 && !cartSearchQuery && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">Корзина пуста</p>
                  </div>
                )}

                {showOrderForm && (
                  <div>
                    <OrderForm
                      total={calculateTotal()}
                      deliveryCost={deliveryCost}
                      onSubmit={(formData: OrderFormData) => {
                        console.log('Order submitted:', formData);
                      }}
                      onCancel={() => setShowOrderForm(false)}
                    />
                  </div>
                )}

                {!showOrderForm && cart.length > 0 && (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl shrink-0 border">
                                    {item.image.startsWith('http') ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span>{item.image}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{formatPrice(item.price)} ₽</p>
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        <Icon name="Minus" size={14} />
                                      </Button>
                                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Icon name="Plus" size={14} />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        className="ml-auto"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Icon name="Trash2" size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Итого:</span>
                            <span className="text-primary">{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                          </div>
                          
                          {deliveryCost > 0 && (
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Доставка:</span>
                              <span>{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full" 
                            size="lg"
                            onClick={() => setShowOrderForm(true)}
                          >
                            <Icon name="ShoppingBag" size={20} className="mr-2" />
                            Оформить заказ
                          </Button>
                        
                          <Button 
                            variant="outline"
                            className="w-full" 
                            size="lg"
                            onClick={() => {
                              generateKP();
                              setIsCartOpen(false);
                            }}
                          >
                            <Icon name="FileText" size={20} className="mr-2" />
                            Скачать коммерческое предложение
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="lg"
                            asChild
                          >
                            <a href="tel:+79181151551">
                              <Icon name="Phone" size={16} className="mr-2" />
                              +7 (918) 115-15-51
                            </a>
                          </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}