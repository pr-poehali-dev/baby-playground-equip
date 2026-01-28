import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
  sortedCart: CartItem[];
  setSortedCart: (cart: CartItem[]) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  calculateTotal: () => number;
  deliveryCost: number;
  setDeliveryCost: (cost: number) => void;
  installationPercent: number;
  setInstallationPercent: (percent: number) => void;
  calculateInstallationCost: () => number;
  calculateGrandTotal: () => number;
  onOrderClick: () => void;
  onGenerateKPClick: () => void;
  allProducts: Product[];
  onAddToCart?: (product: Product) => void;
  orderButtonRef: React.RefObject<HTMLButtonElement>;
  discountPercent: number;
  setDiscountPercent: (percent: number) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  targetTotal: number;
  setTargetTotal: (total: number) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function CartSheet({
  isCartOpen,
  setIsCartOpen,
  cart,
  sortedCart,
  setSortedCart,
  updateQuantity,
  removeFromCart,
  calculateTotal,
  deliveryCost,
  setDeliveryCost,
  installationPercent,
  setInstallationPercent,
  calculateInstallationCost,
  calculateGrandTotal,
  onOrderClick,
  onGenerateKPClick,
  allProducts,
  onAddToCart,
  orderButtonRef,
  discountPercent,
  setDiscountPercent,
  discountAmount,
  setDiscountAmount,
  targetTotal,
  setTargetTotal
}: CartSheetProps) {
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
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

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

  const handleTargetTotalChange = (value: string) => {
    const numValue = parseFloat(value.replace(/\s/g, '')) || 0;
    setTargetTotal(numValue);
    
    const currentTotal = calculateTotal();
    if (currentTotal > 0 && numValue > 0) {
      const difference = currentTotal - numValue;
      const percent = (difference / currentTotal) * 100;
      setDiscountPercent(Math.max(0, percent));
      setDiscountAmount(Math.max(0, difference));
    }
  };

  const handleDiscountPercentChange = (value: string) => {
    const percent = parseFloat(value) || 0;
    setDiscountPercent(percent);
    
    const currentTotal = calculateTotal();
    const amount = (currentTotal * percent) / 100;
    setDiscountAmount(amount);
    setTargetTotal(currentTotal - amount);
  };

  const handleDiscountAmountChange = (value: string) => {
    const amount = parseFloat(value.replace(/\s/g, '')) || 0;
    setDiscountAmount(amount);
    
    const currentTotal = calculateTotal();
    if (currentTotal > 0) {
      const percent = (amount / currentTotal) * 100;
      setDiscountPercent(percent);
      setTargetTotal(currentTotal - amount);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col gap-0" data-cart-sheet>
        <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-white z-10">
          <SheetTitle className="text-2xl font-heading">Корзина ({cart.length})</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Icon name="ShoppingCart" size={64} className="text-gray-300 mb-4" />
              <p className="text-lg text-gray-500 mb-6">Корзина пуста</p>
              <div className="w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Поиск по каталогу..."
                  value={cartSearchQuery}
                  onChange={(e) => setCartSearchQuery(e.target.value)}
                  className="mb-4"
                />
                {cartSearchQuery && (
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                    {filteredCatalogProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                        if (onAddToCart) {
                          onAddToCart(product);
                          setCartSearchQuery('');
                        }
                      }}>
                        <CardContent className="p-3">
                          <div className="flex gap-3 items-center">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 object-contain flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                              {product.article && (
                                <p className="text-xs text-gray-500">Артикул: {product.article}</p>
                              )}
                              <p className="text-sm font-semibold text-primary mt-1">
                                {formatPrice(product.price)} ₽
                              </p>
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
            <div className="space-y-4">
              {sortedCart.map((item, index) => (
                <Card 
                  key={item.id} 
                  className={`overflow-hidden transition-all ${dragOverIndex === index ? 'border-primary border-2' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="cursor-move flex items-center">
                        <Icon name="GripVertical" size={20} className="text-gray-400" />
                      </div>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-contain flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                        {item.article && (
                          <p className="text-xs text-gray-500 mb-2">Артикул: {item.article}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                          <span className="text-sm font-semibold ml-auto">
                            {formatPrice(parseInt(item.price.replace(/\s/g, '')) * item.quantity)} ₽
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t bg-gray-50 px-6 py-4 space-y-3 sticky bottom-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Товары:</span>
                <span>{formatPrice(calculateTotal())} ₽</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm flex-shrink-0">Доставка:</label>
                <Input
                  type="number"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(Number(e.target.value))}
                  className="h-8 max-w-[120px]"
                />
                <span className="text-sm">₽</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm flex-shrink-0">Монтаж:</label>
                <Input
                  type="number"
                  value={installationPercent}
                  onChange={(e) => setInstallationPercent(Number(e.target.value))}
                  className="h-8 max-w-[80px]"
                />
                <span className="text-sm">%</span>
                <span className="text-sm ml-auto">{formatPrice(calculateInstallationCost())} ₽</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm flex-shrink-0">Скидка %:</label>
                  <Input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => handleDiscountPercentChange(e.target.value)}
                    className="h-8 max-w-[80px]"
                    step="0.1"
                  />
                  <span className="text-sm ml-auto">- {formatPrice(discountAmount)} ₽</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm flex-shrink-0">Скидка ₽:</label>
                  <Input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => handleDiscountAmountChange(e.target.value)}
                    className="h-8 max-w-[120px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm flex-shrink-0">Целевая сумма:</label>
                  <Input
                    type="number"
                    value={targetTotal}
                    onChange={(e) => handleTargetTotalChange(e.target.value)}
                    className="h-8 max-w-[120px]"
                  />
                  <span className="text-sm">₽</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Итого:</span>
                <span>{formatPrice(calculateGrandTotal())} ₽</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                ref={orderButtonRef}
                onClick={onOrderClick} 
                className="flex-1"
                size="lg"
              >
                Оформить заказ
              </Button>
              <Button 
                onClick={onGenerateKPClick}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                КП
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
