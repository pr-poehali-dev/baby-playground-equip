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
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
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
    catalogSearchQuery === '' || 
    product.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
    (product.article && product.article.toLowerCase().includes(catalogSearchQuery.toLowerCase()))
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newCart = [...sortedCart];
    const [draggedItem] = newCart.splice(draggedIndex, 1);
    newCart.splice(dropIndex, 0, draggedItem);
    
    setSortedCart(newCart);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const totalCost = calculateTotal();
  const discountedTotal = totalCost - discountAmount;
  const installationCost = (discountedTotal * installationPercent) / 100;
  const finalTotal = discountedTotal + installationCost + deliveryCost;

  const handleTargetTotalChange = (value: number) => {
    setTargetTotal(value);
    if (value > 0 && totalCost > 0) {
      const newDiscountAmount = totalCost - value;
      const newDiscountPercent = (newDiscountAmount / totalCost) * 100;
      setDiscountAmount(Math.max(0, newDiscountAmount));
      setDiscountPercent(Math.max(0, newDiscountPercent));
    }
  };

  const handleDiscountPercentChange = (value: number) => {
    setDiscountPercent(value);
    const newDiscountAmount = (totalCost * value) / 100;
    setDiscountAmount(newDiscountAmount);
    setTargetTotal(totalCost - newDiscountAmount);
  };

  const handleDiscountAmountChange = (value: number) => {
    setDiscountAmount(value);
    if (totalCost > 0) {
      const newDiscountPercent = (value / totalCost) * 100;
      setDiscountPercent(newDiscountPercent);
    }
    setTargetTotal(totalCost - value);
  };

  const handleKpTargetTotalChange = (value: number) => {
    setKpTargetTotal(value);
    if (value > 0 && totalCost > 0) {
      const newDiscountAmount = totalCost - value;
      const newDiscountPercent = (newDiscountAmount / totalCost) * 100;
      setKpDiscountAmount(Math.max(0, newDiscountAmount));
      setKpDiscountPercent(Math.max(0, newDiscountPercent));
    }
  };

  const handleKpDiscountPercentChange = (value: number) => {
    setKpDiscountPercent(value);
    const newDiscountAmount = (totalCost * value) / 100;
    setKpDiscountAmount(newDiscountAmount);
    setKpTargetTotal(totalCost - newDiscountAmount);
  };

  const handleKpDiscountAmountChange = (value: number) => {
    setKpDiscountAmount(value);
    if (totalCost > 0) {
      const newDiscountPercent = (value / totalCost) * 100;
      setKpDiscountPercent(newDiscountPercent);
    }
    setKpTargetTotal(totalCost - value);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b px-0">
      <div className="container mx-auto my-0 py-0 px-0">
        <div className="flex items-center justify-between py-[5px] px-[17px]">
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
              <a className="font-medium hover:text-primary transition-colors cursor-pointer text-base" href="#about" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                О компании
              </a>
              <a className="font-medium hover:text-primary transition-colors cursor-pointer text-base" href="#catalog" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Каталог
              </a>
              <a className="font-medium hover:text-primary transition-colors cursor-pointer text-base" href="#services" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Услуги
              </a>
              <a className="font-medium hover:text-primary transition-colors cursor-pointer text-base" href="#certificates" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Сертификаты
              </a>
              <a className="font-medium hover:text-primary transition-colors cursor-pointer text-base" href="#contacts" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Контакты
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Поиск"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="pl-9 w-48 h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery?.('')}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                )}
              </div>
              <a href="tel:+79181151551" className="flex items-center gap-2 font-medium hover:text-primary transition-colors text-base">
                <Icon name="Phone" size={18} />
                +7 918 115-15-51
              </a>
              <Button onClick={() => setIsContactDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                Заказать звонок
              </Button>
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:border hover:border-primary hover:text-primary">
                  <Icon name="Heart" size={20} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:border hover:border-primary hover:text-primary">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent data-cart-sheet className="w-full sm:max-w-md overflow-y-auto pt-0 flex flex-col">
                  <SheetHeader className="sticky top-0 bg-background z-10 pb-4 pt-6 border-b">
                    <SheetTitle className="text-xl">Корзина</SheetTitle>
                  </SheetHeader>

                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 gap-6">
                      <div className="text-center space-y-3">
                        <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground/30" />
                        <p className="text-muted-foreground text-lg font-medium">Корзина пуста</p>
                        <p className="text-sm text-muted-foreground/70 max-w-[280px] mx-auto">
                          Добавьте товары из каталога, чтобы начать оформление заказа
                        </p>
                      </div>

                      <div className="w-full max-w-md space-y-4 mt-6">
                        <div className="relative">
                          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Поиск товаров для добавления..."
                            value={catalogSearchQuery}
                            onChange={(e) => setCatalogSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        {catalogSearchQuery && filteredCatalogProducts.length > 0 && (
                          <Card>
                            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                              <div className="divide-y">
                                {filteredCatalogProducts.map((product) => (
                                  <div key={product.id} className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3" onClick={() => {
                                    onAddToCart?.(product);
                                    setCatalogSearchQuery('');
                                  }}>
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                      <p className="text-sm text-muted-foreground">{product.price} ₽</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="hover:bg-transparent hover:border-primary hover:text-primary">
                                      <Icon name="Plus" size={16} />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {catalogSearchQuery && filteredCatalogProducts.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Ничего не найдено
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 flex-1 overflow-y-auto py-4">
                        <div className="relative mb-4">
                          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Поиск товаров для добавления..."
                            value={catalogSearchQuery}
                            onChange={(e) => setCatalogSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        {catalogSearchQuery && filteredCatalogProducts.length > 0 && (
                          <Card className="mb-4">
                            <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                              <div className="divide-y">
                                {filteredCatalogProducts.map((product) => (
                                  <div key={product.id} className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3" onClick={() => {
                                    onAddToCart?.(product);
                                    setCatalogSearchQuery('');
                                  }}>
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                      <p className="text-sm text-muted-foreground">{product.price} ₽</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="hover:bg-transparent hover:border-primary hover:text-primary">
                                      <Icon name="Plus" size={16} />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {catalogSearchQuery && filteredCatalogProducts.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4 mb-4">
                            Ничего не найдено
                          </p>
                        )}

                        {sortedCart.map((item, index) => (
                          <Card 
                            key={`${item.id}-${index}`}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`transition-all ${
                              draggedIndex === index ? 'opacity-50 scale-95' : ''
                            } ${
                              dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : ''
                            }`}
                          >
                            <CardContent className="p-3 flex items-start gap-3">
                              <div 
                                className="cursor-grab active:cursor-grabbing pt-2"
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  handleDragStart(index);
                                }}
                              >
                                <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                              </div>
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <p className="text-sm text-primary font-medium">{item.name.split('\n')[0]}</p>
                                <h4 className="font-medium text-sm">{item.name.split('\n').slice(1).join(' ')}</h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-transparent hover:border-primary hover:text-primary"
                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  >
                                    <Icon name="Minus" size={16} />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-transparent hover:border-primary hover:text-primary"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={16} />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <p className="font-bold text-primary text-sm">{formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-transparent hover:border hover:border-red-500 hover:text-red-500"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="sticky bottom-0 bg-background border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2 pb-3 border-b">
                          <span className="text-sm">Монтаж:</span>
                          <Input
                            type="number"
                            value={installationPercent || ''}
                            onChange={(e) => setInstallationPercent(parseFloat(e.target.value) || 0)}
                            className="w-20 text-sm h-9 text-center"
                          />
                          <span className="text-sm">%</span>
                          <span className="ml-auto text-sm font-medium">
                            {formatPrice(installationCost)} ₽
                          </span>
                        </div>

                        <div className="flex justify-between text-lg font-bold">
                          <span>Итого:</span>
                          <span className="text-primary">{formatPrice(finalTotal)} ₽</span>
                        </div>

                        <Button ref={orderButtonRef} onClick={() => setShowOrderForm(true)} className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                        <Button onClick={() => setShowKPDialog(true)} variant="outline" className="w-full hover:bg-transparent hover:border-primary hover:text-primary" size="lg">
                          Сформировать коммерческое предложение
                        </Button>
                        <Button onClick={() => clearCart?.()} variant="ghost" className="w-full hover:bg-transparent hover:border hover:border-red-500 hover:text-red-500" size="sm">
                          Очистить корзину
                        </Button>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:border hover:border-primary hover:text-primary">
                <Icon name="Heart" size={20} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-transparent hover:border hover:border-primary hover:text-primary">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent data-cart-sheet className="w-full sm:max-w-md overflow-y-auto pt-0 flex flex-col">
                <SheetHeader className="sticky top-0 bg-background z-10 pb-4 pt-6 border-b">
                  <SheetTitle className="text-xl">Корзина</SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 gap-6">
                    <div className="text-center space-y-3">
                      <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground/30" />
                      <p className="text-muted-foreground text-lg font-medium">Корзина пуста</p>
                      <p className="text-sm text-muted-foreground/70 max-w-[280px] mx-auto">
                        Добавьте товары из каталога, чтобы начать оформление заказа
                      </p>
                    </div>

                    <div className="w-full max-w-md space-y-4 mt-6">
                      <div className="relative">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Поиск товаров для добавления..."
                          value={catalogSearchQuery}
                          onChange={(e) => setCatalogSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {catalogSearchQuery && filteredCatalogProducts.length > 0 && (
                        <Card>
                          <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                            <div className="divide-y">
                              {filteredCatalogProducts.map((product) => (
                                <div key={product.id} className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3" onClick={() => {
                                  onAddToCart?.(product);
                                  setCatalogSearchQuery('');
                                }}>
                                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.price} ₽</p>
                                  </div>
                                  <Button size="sm" variant="outline" className="hover:bg-transparent hover:border-primary hover:text-primary">
                                    <Icon name="Plus" size={16} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {catalogSearchQuery && filteredCatalogProducts.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Ничего не найдено
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 flex-1 overflow-y-auto py-0">
                      <div className="relative mb-4">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Поиск товаров для добавления..."
                          value={catalogSearchQuery}
                          onChange={(e) => setCatalogSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      {catalogSearchQuery && filteredCatalogProducts.length > 0 && (
                        <Card className="mb-4">
                          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                            <div className="divide-y">
                              {filteredCatalogProducts.map((product) => (
                                <div key={product.id} className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3" onClick={() => {
                                  onAddToCart?.(product);
                                  setCatalogSearchQuery('');
                                }}>
                                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.price} ₽</p>
                                  </div>
                                  <Button size="sm" variant="outline" className="hover:bg-transparent hover:border-primary hover:text-primary">
                                    <Icon name="Plus" size={16} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {catalogSearchQuery && filteredCatalogProducts.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4 mb-4">
                          Ничего не найдено
                        </p>
                      )}

                      {sortedCart.map((item, index) => (
                        <Card 
                          key={`${item.id}-${index}`}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`transition-all ${
                            draggedIndex === index ? 'opacity-50 scale-95' : ''
                          } ${
                            dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : ''
                          }`}
                        >
                          <CardContent className="p-3 flex items-start gap-3">
                            <div 
                              className="cursor-grab active:cursor-grabbing pt-2"
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                handleDragStart(index);
                              }}
                            >
                              <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                            </div>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="text-sm text-primary font-medium">{item.name.split('\n')[0]}</p>
                              <h4 className="font-medium text-sm">{item.name.split('\n').slice(1).join(' ')}</h4>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-transparent hover:border-primary hover:text-primary"
                                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-transparent hover:border-primary hover:text-primary"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <p className="font-bold text-primary text-sm">{formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-transparent hover:border hover:border-red-500 hover:text-red-500"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="sticky bottom-0 bg-background border-t pt-4 space-y-3">
                      <div className="flex items-center gap-2 border-b py-0">
                        <span className="text-sm">Монтаж:</span>
                        <Input
                          type="number"
                          value={installationPercent || ''}
                          onChange={(e) => setInstallationPercent(parseFloat(e.target.value) || 0)}
                          className="w-20 text-sm h-9 text-center"
                        />
                        <span className="text-sm">%</span>
                        <span className="ml-auto text-sm font-medium">
                          {formatPrice(installationCost)} ₽
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{formatPrice(finalTotal)} ₽</span>
                      </div>

                      <Button ref={orderButtonRef} onClick={() => setShowOrderForm(true)} className="w-full" size="lg">
                        Оформить заказ
                      </Button>
                      <Button onClick={() => setShowKPDialog(true)} variant="outline" className="w-full hover:bg-transparent hover:border-primary hover:text-primary" size="lg">
                        Сформировать коммерческое предложение
                      </Button>
                      <Button onClick={() => clearCart?.()} variant="ghost" className="w-full hover:bg-transparent hover:border hover:border-red-500 hover:text-red-500" size="sm">
                        Очистить корзину
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <a href="#about" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleResetFilters?.(); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-lg font-medium hover:text-primary transition-colors">
                    О нас
                  </a>
                  <a href="#catalog" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); setIsSideMenuOpen(true); }} className="text-lg font-medium hover:text-primary transition-colors">
                    Каталог
                  </a>
                  <a href="#portfolio" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleResetFilters?.(); setTimeout(() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-lg font-medium hover:text-primary transition-colors">
                    Портфолио
                  </a>
                  <a href="#certificates" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleResetFilters?.(); setTimeout(() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-lg font-medium hover:text-primary transition-colors">
                    Сертификаты
                  </a>
                  <a href="#contacts" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleResetFilters?.(); setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-lg font-medium hover:text-primary transition-colors">
                    Контакты
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
          </DialogHeader>
          <OrderForm onSubmit={handleOrderSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={24} className="text-green-500" />
              Заказ успешно оформлен!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Номер вашего заказа:</p>
              <p className="text-2xl font-bold">{orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowSuccessDialog(false)} className="flex-1">
                Продолжить покупки
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSuccessDialog(false);
                  setIsContactDialogOpen(true);
                }}
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Связаться
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showKPDialog} onOpenChange={setShowKPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Создание КП</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Адрес доставки</label>
              <Input
                placeholder="Введите адрес..."
                value={kpAddress}
                onChange={(e) => setKpAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Скидка</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Скидка %"
                  value={kpDiscountPercent || ''}
                  onChange={(e) => handleKpDiscountPercentChange(parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Скидка ₽"
                  value={kpDiscountAmount || ''}
                  onChange={(e) => handleKpDiscountAmountChange(parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
              <Input
                type="number"
                placeholder="Целевая сумма ₽"
                value={kpTargetTotal || ''}
                onChange={(e) => handleKpTargetTotalChange(parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Монтаж (%)</label>
              <Input
                type="number"
                placeholder="0"
                value={kpInstallationPercent || ''}
                onChange={(e) => setKpInstallationPercent(parseFloat(e.target.value) || 0)}
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hideInstallation"
                  checked={hideInstallationInKP}
                  onCheckedChange={(checked) => setHideInstallationInKP(checked as boolean)}
                />
                <label htmlFor="hideInstallation" className="text-sm cursor-pointer">
                  Скрыть монтаж в КП
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Доставка (₽)</label>
              <Input
                type="number"
                placeholder="0"
                value={kpDeliveryCost || ''}
                onChange={(e) => setKpDeliveryCost(parseFloat(e.target.value) || 0)}
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hideDelivery"
                  checked={hideDeliveryInKP}
                  onCheckedChange={(checked) => setHideDeliveryInKP(checked as boolean)}
                />
                <label htmlFor="hideDelivery" className="text-sm cursor-pointer">
                  Скрыть доставку в КП
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Формат файла</label>
              <div className="flex gap-2">
                <Button
                  variant={kpFormat === 'xlsx' ? 'default' : 'outline'}
                  onClick={() => setKpFormat('xlsx')}
                  className={`flex-1 ${kpFormat === 'xlsx' ? '' : 'hover:bg-transparent hover:border-primary hover:text-primary'}`}
                >
                  <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                  Excel
                </Button>
                <Button
                  variant={kpFormat === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setKpFormat('pdf')}
                  className={`flex-1 ${kpFormat === 'pdf' ? '' : 'hover:bg-transparent hover:border-primary hover:text-primary'}`}
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowKPDialog(false)} className="hover:bg-transparent hover:border-primary hover:text-primary">
              Отмена
            </Button>
            <Button onClick={() => {
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
            }}>
              <Icon name="Download" size={16} className="mr-2" />
              Скачать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExcelSettingsOpen} onOpenChange={setIsExcelSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Настройки изображений для Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Ширина колонки с изображением (пиксели)
              </label>
              <Input
                type="number"
                min="50"
                max="500"
                value={imageColumnWidth}
                onChange={(e) => setImageColumnWidth(parseInt(e.target.value) || 100)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуется: 100-200 пикселей
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Высота строки (пункты)
              </label>
              <Input
                type="number"
                min="30"
                max="300"
                value={imageRowHeight}
                onChange={(e) => setImageRowHeight(parseInt(e.target.value) || 80)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуется: 60-120 пунктов
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsExcelSettingsOpen(false)}>
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