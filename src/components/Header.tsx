import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { CartItem } from './data/catalogData';
import { Link } from 'react-router-dom';
import { OrderForm, OrderFormData } from './OrderForm';
import { ContactDialog } from './ContactDialog';

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

interface HeaderProps {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSideMenuOpen: (open: boolean) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart?: () => void;
  calculateTotal: () => number;
  deliveryCost: number;
  setDeliveryCost: (cost: number) => void;
  installationPercent: number;
  setInstallationPercent: (percent: number) => void;
  calculateInstallationCost: () => number;
  calculateGrandTotal: () => number;
  generateKP: (options?: { address?: string; installationPercent?: number; deliveryCost?: number; hideInstallation?: boolean; hideDelivery?: boolean; format?: 'xlsx' | 'pdf'; sortedCart?: CartItem[]; discountPercent?: number; discountAmount?: number }) => void;
  isExcelSettingsOpen: boolean;
  setIsExcelSettingsOpen: (open: boolean) => void;
  imageColumnWidth: number;
  setImageColumnWidth: (width: number) => void;
  imageRowHeight: number;
  setImageRowHeight: (height: number) => void;
  favoritesCount?: number;
  allProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  handleResetFilters?: () => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function Header({
  cart,
  isCartOpen,
  setIsCartOpen,
  setIsSideMenuOpen,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateTotal,
  deliveryCost,
  setDeliveryCost,
  installationPercent,
  setInstallationPercent,
  calculateInstallationCost,
  calculateGrandTotal,
  generateKP,
  isExcelSettingsOpen,
  setIsExcelSettingsOpen,
  imageColumnWidth,
  setImageColumnWidth,
  imageRowHeight,
  setImageRowHeight,
  favoritesCount = 0,
  allProducts = [],
  onAddToCart,
  searchQuery = '',
  setSearchQuery,
  handleResetFilters
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showKPDialog, setShowKPDialog] = useState(false);
  const [kpAddress, setKpAddress] = useState('');
  const [kpInstallationPercent, setKpInstallationPercent] = useState(0);
  const [kpDeliveryCost, setKpDeliveryCost] = useState(0);
  const [hideInstallationInKP, setHideInstallationInKP] = useState(false);
  const [hideDeliveryInKP, setHideDeliveryInKP] = useState(false);
  const [kpFormat, setKpFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [kpDiscountPercent, setKpDiscountPercent] = useState(0);
  const [kpDiscountAmount, setKpDiscountAmount] = useState(0);
  const [kpTargetTotal, setKpTargetTotal] = useState(0);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [cartSearchQuery, setCartSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sortedCart, setSortedCart] = useState(cart);
  const orderButtonRef = useRef<HTMLButtonElement>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [targetTotal, setTargetTotal] = useState(0);

  useEffect(() => {
    setSortedCart(cart);
  }, [cart]);

  useEffect(() => {
    if (isCartOpen) {
      const scrollToTop = () => {
        const selectors = [
          '[data-cart-sheet]',
          '[data-radix-scroll-area-viewport]',
          '.overflow-y-auto',
          '[role="dialog"]'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.scrollTop = 0;
            }
          });
        });
        
        window.scrollTo({ top: 0, behavior: 'instant' });
      };

      setTimeout(scrollToTop, 50);
      setTimeout(scrollToTop, 150);
      setTimeout(scrollToTop, 300);
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (isCartOpen) {
      setTimeout(() => {
        if (cart.length > 0 && orderButtonRef.current) {
          orderButtonRef.current.focus();
        } else {
          (document.activeElement as HTMLElement)?.blur();
        }
      }, 150);
    }
  }, [isCartOpen, cart.length]);

  const filteredCatalogProducts = allProducts.filter(product => 
    cartSearchQuery === '' || 
    product.name.toLowerCase().includes(cartSearchQuery.toLowerCase()) ||
    (product.article && product.article.toLowerCase().includes(cartSearchQuery.toLowerCase()))
  );

  const getNextOrderNumber = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const savedYear = parseInt(localStorage.getItem('orderYear') || '0', 10);
    let orderCount = parseInt(localStorage.getItem('orderCount') || '0', 10);
    
    if (savedYear !== currentYear) {
      orderCount = 0;
      localStorage.setItem('orderYear', currentYear.toString());
    }
    
    orderCount += 1;
    localStorage.setItem('orderCount', orderCount.toString());
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = currentYear;
    return `${String(orderCount).padStart(4, '0')} ${day}.${month}.${year}`;
  };

  const getCurrentOrderNumber = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const savedYear = parseInt(localStorage.getItem('orderYear') || '0', 10);
    let orderCount = parseInt(localStorage.getItem('orderCount') || '0', 10);
    
    if (savedYear !== currentYear) {
      orderCount = 0;
    }
    
    orderCount += 1;
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = currentYear;
    return `${String(orderCount).padStart(4, '0')} ${day}.${month}.${year}`;
  };

  const [currentOrderNumber, setCurrentOrderNumber] = useState(() => getCurrentOrderNumber());

  const handleOrderSubmit = (formData: OrderFormData) => {
    const newOrderNumber = getNextOrderNumber();
    setOrderNumber(newOrderNumber);
    setCurrentOrderNumber(getCurrentOrderNumber());
    setShowOrderForm(false);
    setShowSuccessDialog(true);
    if (clearCart) {
      clearCart();
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b px-0">
      <div className="container mx-auto my-0 py-0 px-0">
        <div className="flex items-center justify-between py-[5px] px-[15px]">
          <div className="flex items-center gap-3">
            <a href="#hero" className="cursor-pointer" onClick={() => handleResetFilters?.()}>
              <img 
                src="https://cdn.poehali.dev/files/photo_643632026-01-05_09-32-44.png" 
                alt="Urban Play"
                className="h-16 w-auto object-contain rounded-0 px-0"
              />
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6 flex-1 justify-between ml-6">
            <nav className="flex gap-6">
              <a href="#about" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="text-foreground hover:text-primary transition-colors text-base font-medium">О компании</a>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="text-foreground hover:text-primary transition-colors text-base font-medium">Каталог</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="text-foreground hover:text-primary transition-colors text-base font-medium">Услуги</a>
              <a href="#certificates" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="text-foreground hover:text-primary transition-colors text-base font-medium">Сертификаты</a>
              <a href="#contacts" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }} className="text-foreground hover:text-primary transition-colors text-base font-medium">Контакты</a>
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              {/* Поиск */}
              {setSearchQuery && (
                <div className="relative w-64">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9 h-9 text-sm"
                  />
                  {(searchQuery || handleResetFilters) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (searchQuery && setSearchQuery) {
                          setSearchQuery('');
                        } else if (handleResetFilters) {
                          handleResetFilters();
                        }
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-transparent"
                    >
                      <Icon name="X" size={16} className="text-muted-foreground hover:text-foreground" />
                    </Button>
                  )}
                </div>
              )}
              <a 
                href="tel:+79181151551" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-base font-medium whitespace-nowrap"
              >
                <Icon name="Phone" size={20} className="text-primary" />
                +7 918 115-15-51
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsContactDialogOpen(true)} size="sm" className="hidden md:inline-flex">
              Заказать звонок
            </Button>
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="md:hidden hover:border-primary hover:text-primary hover:bg-transparent w-10 h-10 active:scale-95 transition-transform"
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
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleResetFilters?.();
                        setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                    >
                      О компании
                    </a>
                    <a 
                      href="#catalog" 
                      className="text-base hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleResetFilters?.();
                        setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                    >
                      Каталог
                    </a>
                    <a 
                      href="#services" 
                      className="text-base hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleResetFilters?.();
                        setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                    >
                      Услуги
                    </a>
                    <a 
                      href="#certificates" 
                      className="text-base hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleResetFilters?.();
                        setTimeout(() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                    >
                      Сертификаты
                    </a>
                    <a 
                      href="#contacts" 
                      className="text-base hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleResetFilters?.();
                        setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                    >
                      Контакты
                    </a>
                    <div className="border-t pt-4 mt-2">
                      <Button 
                        asChild
                        className="w-full bg-primary text-white hover:bg-primary/90"
                        size="lg"
                      >
                        <a 
                          href="tel:+79181151551" 
                          className="flex items-center gap-2"
                        >
                          <Icon name="Phone" size={20} />
                          +7 918 115-15-51
                        </a>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="lg:hidden">
                <Button 
                  asChild
                  className="bg-[#3eaa03] text-white hover:bg-[#2d8902] active:scale-95 transition-all h-9 px-4"
                >
                  <a href="tel:+79181151551">
                    Позвонить
                  </a>
                </Button>
              </div>

              <Link to="/favorites">
                <Button variant="outline" size="icon" className="relative hover:border-primary hover:text-primary hover:bg-transparent w-10 h-10 active:scale-95 transition-transform">
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
                  <Button variant="outline" size="icon" className="relative hover:border-primary hover:text-primary hover:bg-transparent w-10 h-10 active:scale-95 transition-transform">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto" data-cart-sheet>
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Корзина пуста</p>
                        <div className="space-y-3">
                          <div className="relative">
                            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input 
                              type="text"
                              placeholder="Поиск по товарам..."
                              value={cartSearchQuery}
                              onChange={(e) => setCartSearchQuery(e.target.value)}
                              className="pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                              autoFocus={false}
                            />
                          </div>
                          {cartSearchQuery && filteredCatalogProducts.length > 0 && (
                            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-2">
                              {filteredCatalogProducts.map(product => (
                                <Card key={product.id} className="overflow-hidden">
                                  <CardContent className="p-3">
                                    <div className="flex gap-3">
                                      <div className="w-16 h-16 flex-shrink-0 bg-white rounded flex items-center justify-center">
                                        {product.image.startsWith('http') ? (
                                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                          <span className="text-2xl">{product.image}</span>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#5a098c] mb-1">{product.name.split('\n')[0]}</p>
                                        <p className="font-semibold text-sm line-clamp-2 mb-1">{product.name.split('\n')[1] || product.name}</p>
                                        <p className="text-sm font-bold text-primary mb-2">{formatPrice(product.price)} ₽</p>
                                        <Button 
                                          size="sm"
                                          onClick={() => {
                                            if (onAddToCart) {
                                              onAddToCart(product);
                                              setCartSearchQuery('');
                                            }
                                          }}
                                          className="w-full h-7 text-xs"
                                        >
                                          <Icon name="Plus" size={14} className="mr-1" />
                                          Добавить
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-4">
                          <div className="relative">
                            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                            <Input 
                              type="text"
                              placeholder="Поиск по товарам..."
                              value={cartSearchQuery}
                              onChange={(e) => setCartSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          {cartSearchQuery && filteredCatalogProducts.length > 0 && (
                            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-2">
                              {filteredCatalogProducts.map(product => (
                                <Card key={product.id} className="overflow-hidden">
                                  <CardContent className="p-3">
                                    <div className="flex gap-3">
                                      <div className="w-16 h-16 flex-shrink-0 bg-white rounded flex items-center justify-center">
                                        {product.image.startsWith('http') ? (
                                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                          <span className="text-2xl">{product.image}</span>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#5a098c] mb-1">{product.name.split('\n')[0]}</p>
                                        <p className="font-semibold text-sm line-clamp-2 mb-1">{product.name.split('\n')[1] || product.name}</p>
                                        <p className="text-sm font-bold text-primary mb-2">{formatPrice(product.price)} ₽</p>
                                        <Button 
                                          size="sm"
                                          onClick={() => {
                                            if (onAddToCart) {
                                              onAddToCart(product);
                                              setCartSearchQuery('');
                                            }
                                          }}
                                          className="w-full h-7 text-xs"
                                        >
                                          <Icon name="Plus" size={14} className="mr-1" />
                                          Добавить
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {sortedCart.map((item, index) => (
                            <Card 
                              key={item.id} 
                              className={`overflow-hidden transition-all ${
                                draggedIndex === index ? 'opacity-50 scale-95' : ''
                              } ${
                                dragOverIndex === index ? 'border-2 border-primary' : ''
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverIndex(index);
                              }}
                              onDragLeave={() => setDragOverIndex(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedIndex !== null && draggedIndex !== index) {
                                  const newCart = [...sortedCart];
                                  const [draggedItem] = newCart.splice(draggedIndex, 1);
                                  newCart.splice(index, 0, draggedItem);
                                  setSortedCart(newCart);
                                }
                                setDraggedIndex(null);
                                setDragOverIndex(null);
                              }}
                            >
                              <CardContent className="p-3">
                                <div className="flex gap-3">
                                  <div 
                                    className="flex items-center mr-2 text-muted-foreground cursor-grab active:cursor-grabbing"
                                    draggable
                                    onDragStart={(e) => {
                                      setDraggedIndex(index);
                                      e.stopPropagation();
                                    }}
                                    onDragEnd={() => {
                                      setDraggedIndex(null);
                                      setDragOverIndex(null);
                                    }}
                                  >
                                    <Icon name="GripVertical" size={20} />
                                  </div>
                                  <div className="w-20 h-20 flex-shrink-0 bg-white rounded flex items-center justify-center">
                                    {item.image.startsWith('http') ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                      <span className="text-3xl">{item.image}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#5a098c] mb-1">{item.name.split('\n')[0]}</p>
                                        <p className="font-semibold text-sm line-clamp-2">{item.name.split('\n')[1] || item.name}</p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeFromCart(item.id)}
                                        className="h-8 w-8 flex-shrink-0 hover:border-red-500 hover:text-red-500 hover:bg-transparent"
                                      >
                                        <Icon name="Trash2" size={16} />
                                      </Button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                          className="h-8 w-8 bg-transparent hover:bg-transparent hover:border-[#3eaa03] hover:text-[#3eaa03] active:bg-transparent"
                                        >
                                          <Icon name="Minus" size={16} />
                                        </Button>
                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="h-8 w-8 bg-transparent hover:bg-transparent hover:border-[#3eaa03] hover:text-[#3eaa03] active:bg-transparent"
                                        >
                                          <Icon name="Plus" size={16} />
                                        </Button>
                                      </div>
                                      <p className="text-sm font-bold text-primary">
                                        {formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="space-y-3 border-t pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Итого:</span>
                              <span className="text-primary">{formatPrice(calculateTotal())} ₽</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button 
                              ref={orderButtonRef}
                              className="w-full" 
                              size="lg"
                              onClick={() => {
                                setIsCartOpen(false);
                                setShowOrderForm(true);
                              }}
                            >
                              Оформить заказ
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full bg-transparent hover:bg-transparent hover:border-[#3eaa03] hover:text-[#3eaa03]"
                              onClick={() => {
                                setShowKPDialog(true);
                              }}
                            >
                              Сформировать коммерческое предложение
                            </Button>
                            {clearCart && (
                              <Button 
                                variant="outline" 
                                className="w-full bg-transparent hover:bg-transparent hover:border-red-500 hover:text-red-500"
                                onClick={clearCart}
                              >
                                Очистить корзину
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <OrderForm 
        open={showOrderForm}
        onOpenChange={setShowOrderForm}
        cart={cart}
        calculateTotal={calculateTotal}
        deliveryCost={deliveryCost}
        installationPercent={installationPercent}
        calculateInstallationCost={calculateInstallationCost}
        calculateGrandTotal={calculateGrandTotal}
        onSubmit={handleOrderSubmit}
        currentOrderNumber={currentOrderNumber}
      />

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Заказ успешно оформлен!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg mb-2">Ваш заказ №{orderNumber} принят</p>
            <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showKPDialog} onOpenChange={setShowKPDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Параметры коммерческого предложения</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Адрес объекта</label>
              <Input
                type="text"
                value={kpAddress}
                onChange={(e) => setKpAddress(e.target.value)}
                placeholder="Введите адрес"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Процент за монтаж (%)</label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hide-installation"
                    checked={hideInstallationInKP}
                    onCheckedChange={(checked) => setHideInstallationInKP(checked as boolean)}
                  />
                  <label htmlFor="hide-installation" className="text-sm cursor-pointer">Включить в стоимость товара</label>
                </div>
              </div>
              <Input
                type="number"
                value={kpInstallationPercent || ''}
                onChange={(e) => setKpInstallationPercent(Number(e.target.value) || 0)}
                placeholder="0"
                step="5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Стоимость доставки (₽)</label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hide-delivery"
                    checked={hideDeliveryInKP}
                    onCheckedChange={(checked) => setHideDeliveryInKP(checked as boolean)}
                  />
                  <label htmlFor="hide-delivery" className="text-sm cursor-pointer">Включить в стоимость товара</label>
                </div>
              </div>
              <Input
                type="number"
                value={kpDeliveryCost || ''}
                onChange={(e) => setKpDeliveryCost(Number(e.target.value) || 0)}
                placeholder="0"
                step="500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Скидка</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Процент (%)</label>
                  <Input
                    type="number"
                    value={kpDiscountPercent || ''}
                    onChange={(e) => {
                      const percent = Number(e.target.value) || 0;
                      setKpDiscountPercent(percent);
                      setKpDiscountAmount(0);
                      setKpTargetTotal(0);
                    }}
                    placeholder="0"
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Итоговая сумма (₽)</label>
                  <Input
                    type="number"
                    value={kpTargetTotal || ''}
                    onChange={(e) => {
                      const targetAmount = Number(e.target.value) || 0;
                      setKpTargetTotal(targetAmount);
                      // Считаем полную сумму: товары + монтаж + доставка
                      const totalWithServices = calculateTotal() + 
                        Math.round(calculateTotal() * (kpInstallationPercent / 100)) + 
                        kpDeliveryCost;
                      const calculatedDiscount = totalWithServices - targetAmount;
                      setKpDiscountAmount(calculatedDiscount > 0 ? calculatedDiscount : 0);
                      setKpDiscountPercent(0);
                    }}
                    placeholder="0"
                    step="100"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Формат файла</label>
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`flex-1 h-8 text-xs ${
                    kpFormat === 'xlsx' 
                      ? 'bg-transparent border-primary text-primary font-semibold hover:bg-transparent hover:border-primary hover:text-primary' 
                      : 'border-border text-muted-foreground hover:bg-transparent hover:border-primary hover:text-primary'
                  }`}
                  onClick={() => setKpFormat('xlsx')}
                >
                  <Icon name="FileSpreadsheet" size={14} className="mr-1" />
                  XLSX
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`flex-1 h-8 text-xs ${
                    kpFormat === 'pdf' 
                      ? 'bg-transparent border-primary text-primary font-semibold hover:bg-transparent hover:border-primary hover:text-primary' 
                      : 'border-border text-muted-foreground hover:bg-transparent hover:border-primary hover:text-primary'
                  }`}
                  onClick={() => setKpFormat('pdf')}
                >
                  <Icon name="FileText" size={14} className="mr-1" />
                  PDF
                </Button>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                generateKP({ 
                  address: kpAddress, 
                  installationPercent: kpInstallationPercent,
                  deliveryCost: kpDeliveryCost,
                  hideInstallation: hideInstallationInKP,
                  hideDelivery: hideDeliveryInKP,
                  format: kpFormat,
                  sortedCart: sortedCart,
                  discountPercent: kpDiscountPercent,
                  discountAmount: kpDiscountAmount
                });
                setShowKPDialog(false);
              }}
            >Скачать коммерческое предложение ({kpFormat.toUpperCase()})</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExcelSettingsOpen} onOpenChange={setIsExcelSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки изображений Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ширина столбца с изображением</label>
              <Input
                type="number"
                value={imageColumnWidth}
                onChange={(e) => setImageColumnWidth(Number(e.target.value))}
                min={10}
                max={50}
              />
              <p className="text-xs text-muted-foreground mt-1">Рекомендуемое значение: 20</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Высота строки с изображением</label>
              <Input
                type="number"
                value={imageRowHeight}
                onChange={(e) => setImageRowHeight(Number(e.target.value))}
                min={50}
                max={200}
              />
              <p className="text-xs text-muted-foreground mt-1">Рекомендуемое значение: 100</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setIsExcelSettingsOpen(false)}
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ContactDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </header>
  );
}