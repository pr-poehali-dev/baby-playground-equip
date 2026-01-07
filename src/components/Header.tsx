import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { CartItem } from './data/catalogData';

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
  generateKP
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/files/photo_2026-01-05_09-32-44.png" 
              alt="Urban Play"
              className="h-24 w-auto"
            />
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors font-medium text-lg">Каталог</a>
            <a href="#services" className="text-foreground hover:text-primary transition-colors font-medium text-lg">Услуги</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium text-lg">О компании</a>
            <a href="#certificates" className="text-foreground hover:text-primary transition-colors font-medium text-lg">Сертификаты</a>
            <a href="#contacts" className="text-foreground hover:text-primary transition-colors font-medium text-lg">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsSideMenuOpen(true)}
              className="md:hidden"
            >
              <Icon name="Menu" size={20} />
            </Button>
            
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
                <SheetHeader>
                  <SheetTitle className="text-2xl font-heading">Корзина</SheetTitle>
                </SheetHeader>
                
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center text-4xl shrink-0">
                                {item.image}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold mb-1 truncate">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{item.price} ₽</p>
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
                        <a href="tel:88001234567">
                          <Icon name="Phone" size={16} className="mr-2" />
                          8 (800) 123-45-67
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" className="hidden md:flex items-center gap-2" asChild>
              <a href="tel:88001234567">
                <Icon name="Phone" size={16} className="mr-2" />
                8 (800) 123-45-67
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}