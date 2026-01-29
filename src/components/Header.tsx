import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { CartItem } from './data/catalogData';
import { Link } from 'react-router-dom';
import { OrderFormData } from './OrderForm';
import { ContactDialog } from './ContactDialog';
import { HeaderCart } from './header/HeaderCart';
import { KPDialog } from './header/KPDialog';
import { OrderDialogs } from './header/OrderDialogs';
import { ExcelSettingsDialog } from './header/ExcelSettingsDialog';

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b px-0">
      <div className="container mx-auto my-0 py-0 px-0">
        <div className="flex items-center justify-between py-[5px] px-[15px]">
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
              <a href="#about" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                О нас
              </a>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); setIsSideMenuOpen(true); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Каталог
              </a>
              <a href="#portfolio" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Портфолио
              </a>
              <a href="#certificates" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Сертификаты
              </a>
              <a href="#contacts" onClick={(e) => { e.preventDefault(); handleResetFilters?.(); setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                Контакты
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Heart" size={20} />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>
              <HeaderCart
                cart={cart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                calculateTotal={calculateTotal}
                deliveryCost={deliveryCost}
                setDeliveryCost={setDeliveryCost}
                installationPercent={installationPercent}
                setInstallationPercent={setInstallationPercent}
                calculateInstallationCost={calculateInstallationCost}
                calculateGrandTotal={calculateGrandTotal}
                allProducts={allProducts}
                onAddToCart={onAddToCart}
                onOrderClick={() => setShowOrderForm(true)}
                onGenerateKPClick={() => setShowKPDialog(true)}
                onExcelSettingsClick={() => setIsExcelSettingsOpen(true)}
                orderButtonRef={orderButtonRef}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                targetTotal={targetTotal}
                setTargetTotal={setTargetTotal}
                sortedCart={sortedCart}
                setSortedCart={setSortedCart}
              />
            </div>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Heart" size={20} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            <HeaderCart
              cart={cart}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              calculateTotal={calculateTotal}
              deliveryCost={deliveryCost}
              setDeliveryCost={setDeliveryCost}
              installationPercent={installationPercent}
              setInstallationPercent={setInstallationPercent}
              calculateInstallationCost={calculateInstallationCost}
              calculateGrandTotal={calculateGrandTotal}
              allProducts={allProducts}
              onAddToCart={onAddToCart}
              onOrderClick={() => setShowOrderForm(true)}
              onGenerateKPClick={() => setShowKPDialog(true)}
              onExcelSettingsClick={() => setIsExcelSettingsOpen(true)}
              orderButtonRef={orderButtonRef}
              discountPercent={discountPercent}
              setDiscountPercent={setDiscountPercent}
              discountAmount={discountAmount}
              setDiscountAmount={setDiscountAmount}
              targetTotal={targetTotal}
              setTargetTotal={setTargetTotal}
              sortedCart={sortedCart}
              setSortedCart={setSortedCart}
            />
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

      <OrderDialogs
        showOrderForm={showOrderForm}
        setShowOrderForm={setShowOrderForm}
        showSuccessDialog={showSuccessDialog}
        setShowSuccessDialog={setShowSuccessDialog}
        orderNumber={orderNumber}
        handleOrderSubmit={handleOrderSubmit}
        setIsContactDialogOpen={setIsContactDialogOpen}
      />

      <KPDialog
        showKPDialog={showKPDialog}
        setShowKPDialog={setShowKPDialog}
        kpAddress={kpAddress}
        setKpAddress={setKpAddress}
        kpInstallationPercent={kpInstallationPercent}
        setKpInstallationPercent={setKpInstallationPercent}
        kpDeliveryCost={kpDeliveryCost}
        setKpDeliveryCost={setKpDeliveryCost}
        hideInstallationInKP={hideInstallationInKP}
        setHideInstallationInKP={setHideInstallationInKP}
        hideDeliveryInKP={hideDeliveryInKP}
        setHideDeliveryInKP={setHideDeliveryInKP}
        kpFormat={kpFormat}
        setKpFormat={setKpFormat}
        kpDiscountPercent={kpDiscountPercent}
        setKpDiscountPercent={setKpDiscountPercent}
        kpDiscountAmount={kpDiscountAmount}
        setKpDiscountAmount={setKpDiscountAmount}
        kpTargetTotal={kpTargetTotal}
        setKpTargetTotal={setKpTargetTotal}
        generateKP={generateKP}
        sortedCart={sortedCart}
        calculateTotal={calculateTotal}
      />

      <ExcelSettingsDialog
        isExcelSettingsOpen={isExcelSettingsOpen}
        setIsExcelSettingsOpen={setIsExcelSettingsOpen}
        imageColumnWidth={imageColumnWidth}
        setImageColumnWidth={setImageColumnWidth}
        imageRowHeight={imageRowHeight}
        setImageRowHeight={setImageRowHeight}
      />

      <ContactDialog 
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </header>
  );
}
