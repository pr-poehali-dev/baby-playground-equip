import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { CartItem } from '../data/catalogData';

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

interface CartSheetProps {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
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
  setShowOrderForm: (show: boolean) => void;
  setShowKPDialog: (show: boolean) => void;
  setIsExcelSettingsOpen: (open: boolean) => void;
  allProducts: Product[];
  onAddToCart?: (product: Product) => void;
  setIsSideMenuOpen: (open: boolean) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function CartSheet({
  cart,
  isCartOpen,
  setIsCartOpen,
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
  setShowOrderForm,
  setShowKPDialog,
  setIsExcelSettingsOpen,
  allProducts,
  onAddToCart,
  setIsSideMenuOpen
}: CartSheetProps) {
  const [cartSearchQuery, setCartSearchQuery] = useState('');

  const filteredCatalogProducts = allProducts.filter(product => 
    cartSearchQuery === '' || 
    product.name.toLowerCase().includes(cartSearchQuery.toLowerCase()) ||
    (product.article && product.article.toLowerCase().includes(cartSearchQuery.toLowerCase()))
  );

  return (
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
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <Button
          variant="outline"
          className="absolute right-4 top-4 sm:hidden z-50 hover:border-primary hover:text-primary hover:bg-transparent h-9 px-3"
          onClick={() => {
            setIsCartOpen(false);
            setTimeout(() => {
              const element = document.getElementById('catalog');
              if (element) {
                const yOffset = -90;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
              setIsSideMenuOpen(true);
            }, 300);
          }}
        >
          <Icon name="ArrowLeft" size={18} className="mr-1" />
          Назад к каталогу
        </Button>
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
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
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
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 flex-shrink-0 hover:text-destructive"
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
                                className="h-8 w-8"
                              >
                                <Icon name="Minus" size={16} />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8"
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
                  <div className="flex justify-between text-sm">
                    <span>Стоимость товаров:</span>
                    <span className="font-semibold">{formatPrice(calculateTotal())} ₽</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Доставка:</span>
                    <Input
                      type="number"
                      value={deliveryCost || ''}
                      onChange={(e) => setDeliveryCost(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-32 h-8 text-right"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Монтаж (%):</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={installationPercent || ''}
                        onChange={(e) => setInstallationPercent(Number(e.target.value) || 0)}
                        placeholder="0"
                        className="w-20 h-8 text-right"
                      />
                      <span className="text-muted-foreground w-20 text-right">
                        {formatPrice(calculateInstallationCost())} ₽
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Итого:</span>
                    <span className="text-primary">{formatPrice(calculateGrandTotal())} ₽</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
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
                    className="w-full"
                    onClick={() => {
                      setShowKPDialog(true);
                    }}
                  >
                    Сформировать коммерческое предложение
                  </Button>
                  {clearCart && (
                    <Button 
                      variant="outline" 
                      className="w-full"
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
  );
}