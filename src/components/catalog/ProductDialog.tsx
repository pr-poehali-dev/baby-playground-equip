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
      <DialogContent className="max-w-4xl max-h-[85vh] sm:max-h-[85vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 sm:hidden z-50"
          onClick={() => setIsProductDialogOpen(false)}
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <DialogHeader>
          <DialogTitle className="sr-only">Информация о товаре</DialogTitle>
        </DialogHeader>
        {selectedProduct && (
          <div className="grid md:grid-cols-[2fr,1fr] gap-3 md:gap-6">
            <div>
              <div className="relative aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border p-0">
                {productImages.length > 0 ? (
                  <>
                    <img 
                      src={productImages[currentImageIndex]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full p-1 object-contain" 
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

            <div className="flex flex-col justify-center space-y-3 md:space-y-4">
              <div>
                <p className="sm:text-sm mb-1 sm:mb-2 text-[#5a098c] text-lg">{selectedProduct.name.split('\n')[0]}</p>
                <h2 className="font-heading mb-2 sm:mb-4 font-semibold text-xl sm:text-3xl">{selectedProduct.name.split('\n')[1] || selectedProduct.name}</h2>
                <p className="font-bold text-primary mb-2 sm:mb-4 text-2xl sm:text-3xl">{formatPrice(selectedProduct.price)} ₽</p>
                
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 h-10 sm:h-11"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setIsProductDialogOpen(false);
                    }}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    <span className="text-sm sm:text-base">В корзину</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => toggleFavorite(selectedProduct)}
                    className="hover:border-primary hover:text-primary hover:bg-transparent h-12 w-12 p-0"
                  >
                    <Icon name="Heart" size={22} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="hover:bg-green-600 hover:text-white border-green-600 text-green-600 bg-transparent h-12 w-12 p-0 transition-colors"
                  >
                    <a href="tel:+79181151551">
                      <Icon name="Phone" size={22} />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="border-t py-2 sm:py-[5px]">
                <h3 className="font-heading mb-1.5 sm:mb-2 font-semibold text-sm sm:text-base">Техническая информация</h3>
                {selectedProduct.dimensions && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
                    {selectedProduct.dimensions.split('х').map((dim, idx) => (
                      <div key={idx} className="bg-muted/30 p-2 sm:p-3 rounded-lg">
                        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                          {idx === 0 ? 'Ширина' : idx === 1 ? 'Длина' : 'Высота'}
                        </p>
                        <p className="font-semibold text-sm sm:text-base">{dim.trim()}</p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedProduct.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground">{selectedProduct.description}</p>
                )}
              </div>

              <div className="border-t py-2 sm:py-3 mx-0 my-[1px]">
                <p className="text-muted-foreground text-sm py-0 my-[18px] hidden md:block">
                  Если появились вопросы, вы можете получить консультацию руководителя проекта:
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition-colors h-10 sm:h-11"
                  onClick={() => {
                    setIsProductDialogOpen(false);
                    setIsContactDialogOpen(true);
                  }}
                >
                  <Icon name="Phone" size={18} className="mr-2" />
                  <span className="text-sm sm:text-base">Заказать звонок</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}