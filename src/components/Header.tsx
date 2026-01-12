import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ContactDialog } from './ContactDialog';

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
  clearCart?: () => void;
  calculateTotal: () => number;
  deliveryCost: number;
  setDeliveryCost: (cost: number) => void;
  installationPercent: number;
  setInstallationPercent: (percent: number) => void;
  calculateInstallationCost: () => number;
  calculateGrandTotal: () => number;
  generateKP: (options?: { address?: string; installationPercent?: number; deliveryCost?: number; hideInstallation?: boolean; hideDelivery?: boolean }) => void;
  isExcelSettingsOpen: boolean;
  setIsExcelSettingsOpen: (open: boolean) => void;
  imageColumnWidth: number;
  setImageColumnWidth: (width: number) => void;
  imageRowHeight: number;
  setImageRowHeight: (height: number) => void;
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
  onAddToCart
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [cartSearchQuery, setCartSearchQuery] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showKPDialog, setShowKPDialog] = useState(false);
  const [kpAddress, setKpAddress] = useState('');
  const [kpInstallationPercent, setKpInstallationPercent] = useState(0);
  const [kpDeliveryCost, setKpDeliveryCost] = useState(0);
  const [hideInstallationInKP, setHideInstallationInKP] = useState(false);
  const [hideDeliveryInKP, setHideDeliveryInKP] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Генерация номера заказа с датой
  const getNextOrderNumber = () => {
    const orderCount = parseInt(localStorage.getItem('orderCount') || '0', 10) + 1;
    localStorage.setItem('orderCount', orderCount.toString());
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${String(orderCount).padStart(4, '0')} ${day}.${month}.${year}`;
  };

  const getCurrentOrderNumber = () => {
    const orderCount = parseInt(localStorage.getItem('orderCount') || '0', 10) + 1;
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${String(orderCount).padStart(4, '0')} ${day}.${month}.${year}`;
  };

  const [currentOrderNumber, setCurrentOrderNumber] = useState(() => getCurrentOrderNumber());

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
            <a href="#hero" className="cursor-pointer">
              <img 
                src="https://cdn.poehali.dev/files/photo_643632026-01-05_09-32-44.png" 
                alt="Urban Play"
                className="h-16 w-auto object-contain rounded-0"
              />
            </a>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#about" className="text-foreground hover:text-primary transition-colors text-base font-medium">О компании</a>
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors text-base font-medium">Каталог</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors text-base font-medium">Услуги</a>
            <a href="#certificates" className="text-foreground hover:text-primary transition-colors text-base font-medium">Сертификаты</a>
            <a href="#contacts" className="text-foreground hover:text-primary transition-colors text-base font-medium">Контакты</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <a 
                href="tel:+79181151551" 
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-base font-medium whitespace-nowrap"
              >
                <Icon name="Phone" size={20} className="text-primary" />
                +7 918 115-15-51
              </a>
              <Button onClick={() => setIsContactDialogOpen(true)} size="sm">
                Заказать звонок
              </Button>
            </div>
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

            <Button 
              asChild
              className="md:hidden bg-primary text-white hover:bg-primary/90 w-10 h-10 active:scale-95 transition-transform"
              size="icon"
            >
              <a href="tel:+79181151551">
                <Icon name="Phone" size={20} />
              </a>
            </Button>

            <Link to="/favorites">
              <Button variant="outline" className="relative hover:border-primary hover:text-primary hover:bg-transparent w-10 h-10 active:scale-95 transition-transform">
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
                <Button variant="outline" className="relative hover:border-primary hover:text-primary hover:bg-transparent active:scale-95 transition-transform">
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
                      <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                        <Button onClick={() => setIsContactDialogOpen(true)} size="sm">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Заказать звонок
                        </Button>
                      </div>
                    </SheetHeader>
                    <div className="mt-6 mb-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            type="text"
                            placeholder="Поиск по каталогу..."
                            value={cartSearchQuery}
                            onChange={(e) => setCartSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        {cartSearchQuery && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setCartSearchQuery('')}
                            className="hover:border-primary hover:text-primary hover:bg-transparent"
                          >
                            <Icon name="X" size={20} />
                          </Button>
                        )}
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
                                    variant="outline"
                                    onClick={() => {
                                      if (onAddToCart) {
                                        onAddToCart(product);
                                        setCartSearchQuery('');
                                      }
                                    }}
                                    className="hover:border-primary hover:text-primary hover:bg-transparent"
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
                      installationCost={calculateInstallationCost()}
                      deliveryCost={deliveryCost}
                      grandTotal={calculateGrandTotal()}
                      onSubmit={async (formData: OrderFormData) => {
                        const newOrderNumber = getNextOrderNumber();
                        const orderNumberOnly = newOrderNumber.split(' ')[0];
                        setOrderNumber(orderNumberOnly);
                        setCurrentOrderNumber(getCurrentOrderNumber());
                        
                        // Отправляем заказ на email
                        try {
                          await fetch('https://functions.poehali.dev/b4ac51ba-4335-450b-8400-234c423fa7b0', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              orderNumber: newOrderNumber,
                              name: formData.name,
                              phone: formData.phone,
                              email: formData.email,
                              address: formData.address,
                              legalStatus: formData.legalStatus,
                              comment: formData.comment,
                              cartItems: cart,
                              total: calculateTotal(),
                              installationCost: calculateInstallationCost(),
                              deliveryCost: deliveryCost,
                              grandTotal: calculateGrandTotal()
                            })
                          });
                        } catch (error) {
                          console.error('Failed to send order email:', error);
                        }
                        
                        setShowOrderForm(false);
                        setShowSuccessDialog(true);
                        
                        // Очищаем корзину после оформления заказа
                        if (clearCart) {
                          clearCart();
                        }
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
                              <CardContent className="p-2 sm:p-3">
                                <div className="flex gap-2 sm:gap-3">
                                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center shrink-0 border">
                                    {item.image.startsWith('http') ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className="text-2xl">{item.image}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-1 sm:gap-2 mb-1">
                                      <h3 className="font-semibold text-xs sm:text-sm leading-tight flex-1">{item.name}</h3>
                                      <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">{formatPrice(item.price)} ₽</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1 sm:mb-2">Арт. {item.article || 'Н/Д'}</p>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:border-primary hover:text-primary hover:bg-transparent"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      >
                                        <Icon name="Minus" size={12} />
                                      </Button>
                                      <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:border-primary hover:text-primary hover:bg-transparent"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Icon name="Plus" size={12} />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="ml-auto h-6 w-6 sm:h-7 sm:w-7 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Icon name="Trash2" size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-3">
                          <div className="flex justify-between text-xl font-bold">
                            <span>Сумма товаров:</span>
                            <span className="text-primary">{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                          </div>
                          
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
                            className="w-full hover:border-red-500 hover:text-red-500 hover:bg-transparent" 
                            size="lg"
                            onClick={() => {
                              if (clearCart) {
                                clearCart();
                              }
                              setIsCartOpen(false);
                            }}
                          >
                            <Icon name="Trash2" size={20} className="mr-2" />
                            Очистить корзину
                          </Button>
                        
                          <Button 
                            variant="outline"
                            className="w-full hover:border-primary hover:text-primary hover:bg-transparent" 
                            size="lg"
                            onClick={() => {
                              setKpInstallationPercent(installationPercent);
                              setKpDeliveryCost(deliveryCost);
                              setShowKPDialog(true);
                            }}
                          >
                            <Icon name="FileText" size={20} className="mr-2" />
                            Сформировать коммерческое предложение
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

      {/* Диалог настроек КП */}
      <Dialog open={showKPDialog} onOpenChange={setShowKPDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Настройка коммерческого предложения</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Адрес объекта */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Адрес объекта:</label>
              <Input
                type="text"
                placeholder="Введите адрес объекта"
                value={kpAddress}
                onChange={(e) => setKpAddress(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Монтаж */}
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Монтаж (%):</label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-installation"
                    checked={hideInstallationInKP}
                    onCheckedChange={(checked) => setHideInstallationInKP(checked as boolean)}
                  />
                  <label htmlFor="hide-installation" className="text-sm cursor-pointer">Распределить</label>
                </div>
              </div>
              <Input
                type="number"
                placeholder="0"
                value={kpInstallationPercent || ''}
                onChange={(e) => setKpInstallationPercent(Number(e.target.value))}
                className="w-full"
                min="0"
                max="100"
                step="5"
              />
              <div className="flex justify-between text-sm text-muted-foreground min-h-[20px]">
                {kpInstallationPercent > 0 && (
                  <>
                    <span>Стоимость монтажа ({kpInstallationPercent}%):</span>
                    <span>{Math.round(calculateTotal() * (kpInstallationPercent / 100)).toLocaleString('ru-RU')} ₽</span>
                  </>
                )}
              </div>
            </div>

            {/* Доставка */}
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Стоимость доставки:</label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hide-delivery"
                    checked={hideDeliveryInKP}
                    onCheckedChange={(checked) => setHideDeliveryInKP(checked as boolean)}
                  />
                  <label htmlFor="hide-delivery" className="text-sm cursor-pointer">Распределить</label>
                </div>
              </div>
              <Input
                type="number"
                placeholder="0"
                value={kpDeliveryCost || ''}
                onChange={(e) => setKpDeliveryCost(Number(e.target.value))}
                className="w-full"
                step="1000"
              />
              <div className="flex justify-between text-sm text-muted-foreground min-h-[20px]">
                {kpDeliveryCost > 0 && (
                  <>
                    <span>Доставка:</span>
                    <span>{kpDeliveryCost.toLocaleString('ru-RU')} ₽</span>
                  </>
                )}
              </div>
            </div>

            {/* Итого */}
            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Итого:</span>
              <span className="text-primary">
                {(calculateTotal() + 
                  Math.round(calculateTotal() * (kpInstallationPercent / 100)) + 
                  kpDeliveryCost
                ).toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {/* Кнопка скачать */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => {
                generateKP({
                  address: kpAddress,
                  installationPercent: kpInstallationPercent,
                  deliveryCost: kpDeliveryCost,
                  hideInstallation: hideInstallationInKP,
                  hideDelivery: hideDeliveryInKP
                });
                setShowKPDialog(false);
              }}
            >
              <Icon name="Download" size={20} className="mr-2" />
              Скачать коммерческое предложение
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог успешного оформления заказа */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-center">Благодарим вас за обращение в компанию «Urban Play»!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-base">Заказ № {orderNumber} оформлен. Наш менеджер в течение дня свяжется с вами, чтобы проверить заказ и чтобы вы могли убедиться, что всё заказали правильно!</p>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                setIsCartOpen(false);
              }}
              className="w-full"
            >
              Закрыть
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