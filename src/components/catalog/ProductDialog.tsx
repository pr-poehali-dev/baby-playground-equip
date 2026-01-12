import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

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

interface ProductDialogProps {
  isProductDialogOpen: boolean;
  setIsProductDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  productImages: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  handleAddToCart: (product: Product) => void;
  setIsContactDialogOpen: (open: boolean) => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
}

const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
  return numPrice.toLocaleString('ru-RU');
};

export function ProductDialog({
  isProductDialogOpen,
  setIsProductDialogOpen,
  selectedProduct,
  productImages,
  currentImageIndex,
  setCurrentImageIndex,
  handleAddToCart,
  setIsContactDialogOpen,
  favorites,
  toggleFavorite,
}: ProductDialogProps) {
  const isFavorite = selectedProduct ? favorites.some(f => f.id === selectedProduct.id) : false;

  return (
    <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Информация о товаре</DialogTitle>
        </DialogHeader>
        {selectedProduct && (
          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
            <div>
              <div className="relative aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border p-0">
                {productImages.length > 0 ? (
                  <>
                    <img 
                      src={productImages[currentImageIndex]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-contain p-1" 
                    />
                    {productImages.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1)}
                        >
                          <Icon name="ChevronLeft" size={24} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={() => setCurrentImageIndex(currentImageIndex === productImages.length - 1 ? 0 : currentImageIndex + 1)}
                        >
                          <Icon name="ChevronRight" size={24} />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {productImages.map((_, idx) => (
                            <button
                              key={idx}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                              }`}
                              onClick={() => setCurrentImageIndex(idx)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : selectedProduct.image.startsWith('http') ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-8xl">{selectedProduct.image}</span>
                )}
              </div>
              
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`aspect-square bg-white rounded border-2 overflow-hidden ${
                        idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`${selectedProduct.name} ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h2 className="font-heading mb-2 text-4xl font-semibold">{selectedProduct.name.split('\n')[1] || selectedProduct.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedProduct.name.split('\n')[0]}</p>
                <p className="text-4xl font-bold text-primary mb-4">{formatPrice(selectedProduct.price)} ₽</p>
                
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setIsProductDialogOpen(false);
                    }}
                  >
                    <Icon name="ShoppingCart" size={20} className="mr-2" />
                    В корзину
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => toggleFavorite(selectedProduct)}
                  >
                    <Icon name="Heart" size={20} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                  >
                    <a href="tel:+79181151551">
                      <Icon name="Phone" size={20} />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-heading mb-4 font-semibold">Техническая информация</h3>
                {selectedProduct.dimensions && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {selectedProduct.dimensions.split('х').map((dim, idx) => (
                      <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          {idx === 0 ? 'Ширина' : idx === 1 ? 'Длина' : 'Высота'}
                        </p>
                        <p className="text-lg font-bold">{dim.trim()}</p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedProduct.description && (
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                )}
              </div>

              <div className="border-t pt-6">
                <p className="text-muted-foreground mb-4">
                  Если появились вопросы, вы можете получить консультацию руководителя проекта:
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    setIsProductDialogOpen(false);
                    setIsContactDialogOpen(true);
                  }}
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Заказать звонок
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}