import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { CatalogSection } from '@/components/CatalogSection';
import { ContentSections } from '@/components/ContentSections';
import { categories, CartItem } from '@/components/data/catalogData';
import { useCatalogState } from '@/components/hooks/useCatalogState';
import { useProducts } from '@/components/hooks/useProducts';
import { useCatalogHandlers } from '@/components/catalog/useCatalogHandlers';
import { useCatalogFilters } from '@/components/catalog/useCatalogFilters';

interface Product {
  id: number;
  article: string;
  name: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
  price: string;
  image: string;
  description?: string;
  dimensions?: string;
}

interface IndexProps {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export default function Index({ favorites, toggleFavorite, cart, addToCart, removeFromCart, updateQuantity, clearCart }: IndexProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [installationPercent, setInstallationPercent] = useState(0);
  const [isExcelSettingsOpen, setIsExcelSettingsOpen] = useState(false);
  const [imageColumnWidth, setImageColumnWidth] = useState(26);
  const [imageRowHeight, setImageRowHeight] = useState(99);

  const catalogState = useCatalogState();
  const { products, isLoadingProducts } = useProducts();

  const handlers = useCatalogHandlers({
    setSelectedCategory: catalogState.setSelectedCategory,
    setSelectedSubcategory: catalogState.setSelectedSubcategory,
    setSelectedSubSubcategory: catalogState.setSelectedSubSubcategory,
    setCurrentCategory: catalogState.setCurrentCategory,
    setCurrentSubcategory: catalogState.setCurrentSubcategory,
    setIsCategoryDialogOpen: catalogState.setIsCategoryDialogOpen,
    setIsSubSubcategoryDialogOpen: catalogState.setIsSubSubcategoryDialogOpen,
    setIsSideMenuOpen: catalogState.setIsSideMenuOpen,
    setExpandedSubcategories: catalogState.setExpandedSubcategories,
    setExpandedCategories: catalogState.setExpandedCategories,
    setSelectedSeries: catalogState.setSelectedSeries,
    setSearchQuery: catalogState.setSearchQuery,
    searchQuery: catalogState.searchQuery,
    currentCategory: catalogState.currentCategory,
    currentSubcategory: catalogState.currentSubcategory,
  });

  const { availableCategories, filteredProducts } = useCatalogFilters({
    products,
    selectedCategory: catalogState.selectedCategory,
    selectedSeries: catalogState.selectedSeries,
    selectedSubSubcategory: catalogState.selectedSubSubcategory,
    searchQuery: catalogState.searchQuery,
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseInt(item.price.replace(/\s/g, '')) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateInstallationCost = () => {
    const total = calculateTotal();
    return Math.round(total * (installationPercent / 100));
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateInstallationCost() + deliveryCost;
  };

  const handleDownloadExcel = async (options?: { 
    address?: string; 
    installationPercent?: number; 
    deliveryCost?: number; 
    hideInstallation?: boolean; 
    hideDelivery?: boolean 
  }) => {
    try {
      const finalInstallationPercent = options?.installationPercent ?? installationPercent;
      const finalDeliveryCost = options?.deliveryCost ?? deliveryCost;
      const finalInstallationCost = Math.round(calculateTotal() * (finalInstallationPercent / 100));

      const cartProducts = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          article: product?.article || '',
          name: product?.name.split('\n')[1] || product?.name || '',
          price: product?.price || '0',
          quantity: item.quantity,
          image: product?.image || ''
        };
      });

      const response = await fetch('https://functions.poehali.dev/308ef9b0-c437-4586-bfd1-e39fefb50f4d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: cartProducts,
          address: options?.address || '',
          installationPercent: finalInstallationPercent,
          installationCost: finalInstallationCost,
          deliveryCost: finalDeliveryCost,
          hideInstallation: options?.hideInstallation || false,
          hideDelivery: options?.hideDelivery || false,
          imageColumnWidth,
          imageRowHeight
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Формируем имя файла с адресом
      const date = new Date().toLocaleDateString('ru-RU');
      const addressPart = options?.address ? options.address.substring(0, 30).replace(/[^а-яА-Яa-zA-Z0-9\s]/g, '') : 'объект';
      a.download = `КП_${addressPart}_${date}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Не удалось создать файл Excel. Попробуйте снова.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        setIsSideMenuOpen={catalogState.setIsSideMenuOpen}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        calculateTotal={calculateTotal}
        deliveryCost={deliveryCost}
        setDeliveryCost={setDeliveryCost}
        installationPercent={installationPercent}
        setInstallationPercent={setInstallationPercent}
        calculateInstallationCost={calculateInstallationCost}
        calculateGrandTotal={calculateGrandTotal}
        generateKP={handleDownloadExcel}
        isExcelSettingsOpen={isExcelSettingsOpen}
        setIsExcelSettingsOpen={setIsExcelSettingsOpen}
        imageColumnWidth={imageColumnWidth}
        setImageColumnWidth={setImageColumnWidth}
        imageRowHeight={imageRowHeight}
        setImageRowHeight={setImageRowHeight}
        favoritesCount={favorites.length}
        allProducts={products}
        onAddToCart={handleAddToCart}
        clearCart={clearCart}
      />
      
      <HeroSection onOpenCatalog={() => catalogState.setIsSideMenuOpen(true)} />
      
      <div className="flex flex-col">
      <ServicesSection />
      
      <section id="catalog" className="pt-4 pb-16 bg-gray-50 order-2 md:order-2">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading text-center mb-4 font-semibold">Каталог продукции</h2>
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Выберите категорию продукции для просмотра полного ассортимента
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handlers.handleCategoryClick(category)}
                className="group cursor-pointer"
              >
                <div 
                  className={`relative overflow-hidden rounded-md bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 aspect-[4/3] border-2 ${
                    catalogState.selectedCategory === category.id ? '' : 'border-gray-200 hover:border-gray-200'
                  }`}
                  style={catalogState.selectedCategory === category.id ? { borderColor: '#3eaa03' } : {}}
                >
                  <div className="absolute inset-0">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 px-2 -mb-px">
                    <h3 className="font-heading text-white text-sm sm:text-xl leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-light py-[7px] text-center">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <div className="order-3">
        <CatalogSection
          categories={categories}
          products={products}
          isSideMenuOpen={catalogState.isSideMenuOpen}
          setIsSideMenuOpen={catalogState.setIsSideMenuOpen}
          expandedCategories={catalogState.expandedCategories}
          toggleCategory={handlers.toggleCategory}
          selectedCategory={catalogState.selectedCategory}
          selectedSubcategory={catalogState.selectedSubcategory}
          selectedSubSubcategory={catalogState.selectedSubSubcategory}
          setSelectedSubSubcategory={catalogState.setSelectedSubSubcategory}
          handleTreeCategorySelect={handlers.handleTreeCategorySelect}
          expandedSubcategories={catalogState.expandedSubcategories}
          handleTreeSubcategorySelect={handlers.handleTreeSubcategorySelect}
          handleTreeSubSubcategorySelect={handlers.handleTreeSubSubcategorySelect}
          isCategoryDialogOpen={catalogState.isCategoryDialogOpen}
          setIsCategoryDialogOpen={catalogState.setIsCategoryDialogOpen}
          currentCategory={catalogState.currentCategory}
          handleCategoryClick={handlers.handleCategoryClick}
          handleSubcategoryClick={handlers.handleSubcategorySelect}
          isSubSubcategoryDialogOpen={catalogState.isSubSubcategoryDialogOpen}
          setIsSubSubcategoryDialogOpen={catalogState.setIsSubSubcategoryDialogOpen}
          currentSubcategory={catalogState.currentSubcategory}
          handleSubSubcategoryClick={handlers.handleSubSubcategorySelect}
          filteredProducts={filteredProducts}
          handleAddToCart={handleAddToCart}
          searchQuery={catalogState.searchQuery}
          setSearchQuery={catalogState.setSearchQuery}
          handleResetFilters={handlers.handleResetFilters}
          selectedSeries={catalogState.selectedSeries}
          setSelectedSeries={catalogState.setSelectedSeries}
          availableCategories={availableCategories}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </div>
      
      <ContentSections />
      </div>
    </div>
  );
}