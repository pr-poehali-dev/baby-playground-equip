import { useEffect, useRef, useState } from 'react';
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
  installationPercent: number;
  setInstallationPercent: (percent: number) => void;
  allProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onOrderClick: () => void;
  onKPClick: () => void;
  calculateTotal: () => number;
  deliveryCost: number;
  discountAmount: number;
  isMobile?: boolean;
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
  installationPercent,
  setInstallationPercent,
  allProducts = [],
  onAddToCart,
  onOrderClick,
  onKPClick,
  calculateTotal,
  deliveryCost,
  discountAmount,
  isMobile = false
}: CartSheetProps) {
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sortedCart, setSortedCart] = useState(cart);
  const orderButtonRef = useRef<HTMLButtonElement>(null);

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
  const installationCost = Math.round((discountedTotal * installationPercent) / 100);
  const finalTotal = Math.round(discountedTotal + installationCost + deliveryCost);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <div>
          <Button variant="outline" size="icon" className="relative h-10 w-10 p-0 gap-0 hover:bg-transparent hover:border-primary hover:text-primary">
            <Icon name="ShoppingCart" size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent data-cart-sheet className="w-full sm:max-w-md overflow-y-auto pt-0 flex flex-col">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-3 pt-6">
          <SheetTitle className="text-xl">Корзина</SheetTitle>
          <div className={`relative ${isMobile ? 'py-0' : 'pt-3'}`}>
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск товаров для добавления..."
              value={catalogSearchQuery}
              onChange={(e) => setCatalogSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
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
            <div className={`space-y-2 flex-1 overflow-y-auto ${isMobile ? 'py-0' : 'py-4'}`}>
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
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    const card = element?.closest('[data-cart-index]');
                    if (card) {
                      const targetIndex = parseInt(card.getAttribute('data-cart-index') || '0');
                      setDragOverIndex(targetIndex);
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (draggedIndex !== null && dragOverIndex !== null) {
                      const dropEvent = {
                        preventDefault: () => {}
                      } as React.DragEvent;
                      handleDrop(dropEvent, dragOverIndex);
                    }
                  }}
                  data-cart-index={index}
                  className={`transition-all ${
                    draggedIndex === index ? 'opacity-50 scale-95' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : ''
                  }`}
                >
                  <CardContent className={isMobile ? "p-3 flex items-start gap-3 my-0 py-0.5" : "p-3 flex items-start gap-3"}>
                    <div 
                      className="cursor-grab active:cursor-grabbing pt-2 touch-none"
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(index);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(index);
                      }}
                    >
                      <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                    </div>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={isMobile ? "w-16 h-16 object-cover rounded py-0 my-2.5" : "w-16 h-16 object-cover rounded"}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className={isMobile ? "text-sm text-primary font-medium my-[3px]" : "text-sm text-primary font-medium"}>{item.name.split('\n')[0]}</p>
                      <h4 className={isMobile ? "font-medium text-sm my-0.5" : "font-medium text-sm"}>{item.name.split('\n').slice(1).join(' ')}</h4>
                      <div className={isMobile ? "flex items-center gap-2 my-0" : "flex items-center gap-2"}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-transparent hover:border-primary hover:text-primary"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className={isMobile ? "w-8 text-center font-medium my-0 py-0" : "w-8 text-center font-medium"}>{item.quantity}</span>
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
                      <p className={isMobile ? "font-bold text-primary my-[11px] text-base" : "font-bold text-primary text-sm"}>{formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽</p>
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

            <div className={`sticky bottom-0 bg-background border-t ${isMobile ? 'space-y-3 py-0' : 'pt-4 space-y-3'}`}>
              <div className={isMobile ? "flex items-center gap-2 border-b py-1" : "flex items-center gap-2 pb-3 border-b"}>
                <span className="text-sm">Монтаж:</span>
                <Input
                  type="number"
                  value={installationPercent || ''}
                  onChange={(e) => setInstallationPercent(parseFloat(e.target.value) || 0)}
                  className={isMobile ? "w-20 text-sm h-9 text-center" : "w-20 text-base h-9 text-center"}
                />
                <span className="text-sm">%</span>
                <span className="ml-auto text-sm font-medium">
                  {formatPrice(installationCost)} ₽
                </span>
              </div>

              <div className={isMobile ? "flex justify-between text-lg font-bold my-0" : "flex justify-between text-lg font-bold"}>
                <span>Итого:</span>
                <span className="text-primary">{formatPrice(finalTotal)} ₽</span>
              </div>

              <div className="flex gap-2">
                <Button ref={orderButtonRef} onClick={onOrderClick} className="flex-1" size="lg">
                  Оформить заказ
                </Button>
                <Button onClick={onKPClick} variant="outline" className="border-primary text-primary hover:bg-transparent hover:text-primary" size="lg">
                  КП
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
