import { useState, useEffect, useRef } from 'react';
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

interface HeaderCartProps {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  calculateTotal: () => number;
  deliveryCost: number;
  setDeliveryCost: (cost: number) => void;
  installationPercent: number;
  setInstallationPercent: (percent: number) => void;
  calculateInstallationCost: () => number;
  calculateGrandTotal: () => number;
  allProducts: Product[];
  onAddToCart?: (product: Product) => void;
  onOrderClick: () => void;
  onGenerateKPClick: () => void;
  onExcelSettingsClick: () => void;
  orderButtonRef: React.RefObject<HTMLButtonElement>;
  discountPercent: number;
  setDiscountPercent: (value: number) => void;
  discountAmount: number;
  setDiscountAmount: (value: number) => void;
  targetTotal: number;
  setTargetTotal: (value: number) => void;
  sortedCart: CartItem[];
  setSortedCart: (cart: CartItem[]) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function HeaderCart({
  cart,
  isCartOpen,
  setIsCartOpen,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  deliveryCost,
  setDeliveryCost,
  installationPercent,
  setInstallationPercent,
  calculateInstallationCost,
  calculateGrandTotal,
  allProducts,
  onAddToCart,
  onOrderClick,
  onGenerateKPClick,
  onExcelSettingsClick,
  orderButtonRef,
  discountPercent,
  setDiscountPercent,
  discountAmount,
  setDiscountAmount,
  targetTotal,
  setTargetTotal,
  sortedCart,
  setSortedCart
}: HeaderCartProps) {
  const [cartSearchQuery, setCartSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const filteredCatalogProducts = allProducts.filter(product => 
    cartSearchQuery === '' || 
    product.name.toLowerCase().includes(cartSearchQuery.toLowerCase()) ||
    (product.article && product.article.toLowerCase().includes(cartSearchQuery.toLowerCase()))
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

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icon name="ShoppingCart" size={20} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent data-cart-sheet className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto pt-0 flex flex-col">
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
                  value={cartSearchQuery}
                  onChange={(e) => setCartSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {cartSearchQuery && filteredCatalogProducts.length > 0 && (
                <Card>
                  <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                    <div className="divide-y">
                      {filteredCatalogProducts.map((product) => (
                        <div key={product.id} className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3" onClick={() => onAddToCart?.(product)}>
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.price} ₽</p>
                          </div>
                          <Button size="sm" variant="secondary">
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cartSearchQuery && filteredCatalogProducts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Ничего не найдено
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 flex-1 overflow-y-auto py-4">
              {sortedCart.map((item, index) => (
                <Card 
                  key={`${item.id}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${
                    draggedIndex === index ? 'opacity-50 scale-95' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index ? 'border-primary border-2' : ''
                  }`}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="cursor-grab active:cursor-grabbing">
                        <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                      </div>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)} ₽
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-8 w-8"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="sticky bottom-0 bg-background border-t pt-4 space-y-3">
              <div className="space-y-2 pb-3 border-b">
                <div className="flex justify-between text-sm">
                  <span>Сумма товаров:</span>
                  <span className="font-medium">{formatPrice(totalCost)} ₽</span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Скидка %"
                      value={discountPercent || ''}
                      onChange={(e) => handleDiscountPercentChange(parseFloat(e.target.value) || 0)}
                      className="text-sm h-9"
                    />
                    <Input
                      type="number"
                      placeholder="Скидка ₽"
                      value={discountAmount || ''}
                      onChange={(e) => handleDiscountAmountChange(parseFloat(e.target.value) || 0)}
                      className="text-sm h-9"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Целевая сумма ₽"
                    value={targetTotal || ''}
                    onChange={(e) => handleTargetTotalChange(parseFloat(e.target.value) || 0)}
                    className="text-sm h-9"
                  />
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>После скидки:</span>
                    <span>{formatPrice(discountedTotal)} ₽</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Монтаж %"
                    value={installationPercent || ''}
                    onChange={(e) => setInstallationPercent(parseFloat(e.target.value) || 0)}
                    className="flex-1 text-sm h-9"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {formatPrice(installationCost)} ₽
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Доставка ₽"
                    value={deliveryCost || ''}
                    onChange={(e) => setDeliveryCost(parseFloat(e.target.value) || 0)}
                    className="flex-1 text-sm h-9"
                  />
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Итого:</span>
                <span>{formatPrice(finalTotal)} ₽</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button ref={orderButtonRef} onClick={onOrderClick} className="flex-1" size="lg">
                  <Icon name="Send" size={18} className="mr-2" />
                  Оформить заказ
                </Button>
                <Button onClick={onGenerateKPClick} variant="secondary" size="lg">
                  <Icon name="FileText" size={18} className="mr-2" />
                  КП
                </Button>
                <Button onClick={onExcelSettingsClick} variant="outline" size="icon">
                  <Icon name="Settings" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
