import { useState } from 'react';
import { Header } from '@/components/Header';
import { CatalogSection } from '@/components/CatalogSection';
import { ContentSections } from '@/components/ContentSections';
import { categories, products, CartItem, Subcategory } from '@/components/data/catalogData';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubSubcategoryDialogOpen, setIsSubSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    products: '',
    distance: '0',
    comment: ''
  });
  const [deliveryCost, setDeliveryCost] = useState(0);

  const filteredProducts = selectedCategory && selectedSubSubcategory
    ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubSubcategory)
    : selectedCategory && selectedSubcategory
    ? products.filter(p => p.category === selectedCategory && p.subcategory === selectedSubcategory)
    : selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setCurrentCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleSubcategorySelect = (sub: Subcategory) => {
    if (sub.hasChildren && sub.children) {
      setCurrentSubcategory(sub);
      setIsSubSubcategoryDialogOpen(true);
      setIsCategoryDialogOpen(false);
    } else {
      if (currentCategory) {
        setSelectedCategory(currentCategory.id);
        setSelectedSubcategory(sub.name);
        setSelectedSubSubcategory(null);
        setIsCategoryDialogOpen(false);
      }
    }
  };

  const handleSubSubcategorySelect = (subSubName: string) => {
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      setSelectedSubcategory(currentSubcategory?.name || null);
      setSelectedSubSubcategory(subSubName);
      setIsSubSubcategoryDialogOpen(false);
    }
  };

  const handleTreeCategorySelect = (categoryId: string, categoryData: typeof categories[0]) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setCurrentCategory(categoryData);
    setIsSideMenuOpen(false);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTreeSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, sub: Subcategory) => {
    if (sub.hasChildren) {
      const key = `${categoryId}-${subName}`;
      setExpandedSubcategories(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subName);
      setSelectedSubSubcategory(null);
      setCurrentCategory(categoryData);
      setIsSideMenuOpen(false);
      const catalogSection = document.getElementById('catalog');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTreeSubSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, subSubName: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subName);
    setSelectedSubSubcategory(subSubName);
    setCurrentCategory(categoryData);
    setCurrentSubcategory(categoryData.subcategories.find(s => s.name === subName) || null);
    setIsSideMenuOpen(false);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        image: product.image
      }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      return sum + (price * item.quantity);
    }, 0);
  };

  const generateKP = () => {
    const total = calculateTotal();
    const date = new Date().toLocaleDateString('ru-RU');
    
    let kpText = `КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ\n`;
    kpText += `Дата: ${date}\n`;
    kpText += `От: Urban Play\n\n`;
    kpText += `Товары:\n`;
    kpText += `${'='.repeat(50)}\n`;
    
    cart.forEach((item, idx) => {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      const itemTotal = price * item.quantity;
      kpText += `${idx + 1}. ${item.name}\n`;
      kpText += `   Цена: ${item.price} ₽\n`;
      kpText += `   Количество: ${item.quantity} шт.\n`;
      kpText += `   Сумма: ${itemTotal.toLocaleString('ru-RU')} ₽\n\n`;
    });
    
    kpText += `${'='.repeat(50)}\n`;
    kpText += `ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n`;
    
    if (deliveryCost > 0) {
      kpText += `Доставка: ${deliveryCost.toLocaleString('ru-RU')} ₽\n`;
      kpText += `ВСЕГО К ОПЛАТЕ: ${(total + deliveryCost).toLocaleString('ru-RU')} ₽\n\n`;
    }
    
    kpText += `Условия оплаты:\n`;
    kpText += `- Предоплата 50% после согласования заказа\n`;
    kpText += `- Оплата оставшихся 50% после доставки\n`;
    kpText += `- Принимаем наличные, безналичный расчёт, карты\n`;
    kpText += `- Гарантия 2 года на всё оборудование\n\n`;
    kpText += `Контакты:\n`;
    kpText += `Телефон: 8 (800) 123-45-67\n`;
    kpText += `Email: info@urbanplay.ru\n`;
    kpText += `Адрес: г. Москва, ул. Примерная, д. 1\n`;
    
    const blob = new Blob([kpText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `КП_${date.replace(/\./g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateDelivery = (distance: string) => {
    const dist = parseInt(distance) || 0;
    if (dist === 0) return 0;
    if (dist <= 50) return 2000;
    if (dist <= 100) return 4000;
    if (dist <= 200) return 7000;
    return 10000;
  };

  const handleDistanceChange = (distance: string) => {
    setOrderForm({ ...orderForm, distance });
    setDeliveryCost(calculateDelivery(distance));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/20">
      <Header
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        deliveryCost={deliveryCost}
        generateKP={generateKP}
      />

      <CatalogSection
        categories={categories}
        products={products}
        isSideMenuOpen={isSideMenuOpen}
        setIsSideMenuOpen={setIsSideMenuOpen}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        isCategoryDialogOpen={isCategoryDialogOpen}
        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
        isSubSubcategoryDialogOpen={isSubSubcategoryDialogOpen}
        setIsSubSubcategoryDialogOpen={setIsSubSubcategoryDialogOpen}
        currentCategory={currentCategory}
        currentSubcategory={currentSubcategory}
        handleCategoryClick={handleCategoryClick}
        handleSubcategoryClick={handleSubcategorySelect}
        handleSubSubcategoryClick={handleSubSubcategorySelect}
        handleTreeCategorySelect={handleTreeCategorySelect}
        handleTreeSubcategorySelect={handleTreeSubcategorySelect}
        handleTreeSubSubcategorySelect={handleTreeSubSubcategorySelect}
        expandedSubcategories={expandedSubcategories}
        filteredProducts={filteredProducts}
        handleAddToCart={addToCart}
        handleResetFilters={() => {
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setSelectedSubSubcategory(null);
        }}
      />

      <ContentSections
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        deliveryCost={deliveryCost}
        handleDistanceChange={handleDistanceChange}
      />
    </div>
  );
}