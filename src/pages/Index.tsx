import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CatalogSection } from '@/components/CatalogSection';
import { ContentSections } from '@/components/ContentSections';
import { categories, CartItem, Subcategory } from '@/components/data/catalogData';
import ExcelJS from 'exceljs';

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
}

export default function Index({ favorites, toggleFavorite, cart, addToCart, removeFromCart, updateQuantity }: IndexProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubSubcategoryDialogOpen, setIsSubSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/6f221f1d-5b1c-4e9c-afc2-b4a2876203a1');
        const data = await response.json();
        if (data.success) {
          const categoryMap: Record<string, string> = {
            'playground': 'playground',
            'Workout': 'sport',
            'park': 'park',
            'coating': 'coating'
          };
          
          setProducts(data.products.map((p: any) => {
            const mappedCategory = categoryMap[p.category] || p.category;
            let subcategory = undefined;
            let subsubcategory = undefined;
            
            if (p.name.includes('Сиденье') || p.name.includes('Качели')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Качели';
            } else if (p.name.includes('Карусель')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Карусели';
            } else if (p.name.includes('Балансир')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Балансиры';
            } else if (p.name.includes('Горка')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Горки';
            } else if (p.name.includes('Игровой комплекс')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Игровые комплексы';
            } else if (p.name.includes('Воркаут')) {
              subcategory = 'Серия "Classic"';
              subsubcategory = 'Workout';
            }
            
            return {
              id: p.id,
              article: p.article,
              name: `Арт. ${p.article}\n${p.name}`,
              category: mappedCategory,
              subcategory,
              subsubcategory,
              price: p.price?.toString() || '0',
              image: p.image,
              description: p.description,
              dimensions: p.dimensions
            };
          }));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const availableCategories = (() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (selectedSeries) {
      filtered = filtered.filter(p => p.subcategory === selectedSeries);
    }
    
    const categories = new Set(filtered.map(p => p.subsubcategory).filter(Boolean));
    return Array.from(categories);
  })();

  const filteredProducts = (() => {
    let filtered = products;
    
    if (selectedSubSubcategory) {
      filtered = filtered.filter(p => p.subsubcategory === selectedSubSubcategory);
    }
    
    if (selectedSeries) {
      filtered = filtered.filter(p => p.subcategory === selectedSeries);
    }
    
    filtered = filtered.filter(p => parseInt(p.price) > 0);
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery)
      );
    }
    
    return filtered;
  })();

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
        setSelectedSeries(sub.name);
        setIsCategoryDialogOpen(false);
        setTimeout(() => {
          const productsSection = document.getElementById('products');
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  const handleSubSubcategorySelect = (subSubName: string) => {
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      setSelectedSubcategory(currentSubcategory?.name || null);
      setSelectedSubSubcategory(subSubName);
      setSelectedSeries(currentSubcategory?.name || null);
      setIsSubSubcategoryDialogOpen(false);
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleTreeCategorySelect = (categoryId: string, categoryData: typeof categories[0]) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setCurrentCategory(categoryData);
    setIsSideMenuOpen(false);
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
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
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleTreeSubSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, subSubName: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subName);
    setSelectedSubSubcategory(subSubName);
    setSelectedSeries(subName);
    setCurrentCategory(categoryData);
    setCurrentSubcategory(categoryData.subcategories.find(s => s.name === subName) || null);
    setIsSideMenuOpen(false);
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      return sum + (price * item.quantity);
    }, 0);
  };

  const generateKP = async () => {
    const total = calculateTotal();
    const montageDelivery = Math.round(total * 0.2);
    const grandTotal = total + montageDelivery;
    const date = new Date().toLocaleDateString('ru-RU');
    const kpNumber = `0001 от ${date}`;
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Коммерческое предложение');
    
    worksheet.columns = [
      { width: 5 },
      { width: 30 },
      { width: 20 },
      { width: 12 },
      { width: 10 },
      { width: 15 },
      { width: 15 }
    ];
    
    // Логотип текстом (CDN не поддерживает CORS для изображений)
    worksheet.mergeCells('A1:B5');
    const logoCell = worksheet.getCell('A1');
    logoCell.value = 'Urban\nPlay';
    logoCell.font = { size: 24, bold: true, color: { argb: 'FF6B21A8' } };
    logoCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    logoCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0E6FF' }
    };
    logoCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Шапка справа
    worksheet.getCell('D1').value = 'ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ';
    worksheet.getCell('D1').font = { bold: true, size: 10 };
    worksheet.getCell('D2').value = 'ИНН 110209455200 ОГРНИП 32377460012482';
    worksheet.getCell('D2').font = { size: 9 };
    worksheet.getCell('D3').value = '350005, г. Краснодар, ул. Кореновская, д. 57 оф.7';
    worksheet.getCell('D3').font = { size: 9 };
    worksheet.getCell('D4').value = 'тел: +7 918 115 15 51 e-mail: info@urban-play.ru';
    worksheet.getCell('D4').font = { size: 9 };
    worksheet.getCell('D5').value = 'www.urban-play.ru';
    worksheet.getCell('D5').font = { size: 9, color: { argb: 'FF0000FF' }, underline: true };
    
    // Линия-разделитель
    worksheet.mergeCells('A6:G6');
    worksheet.getCell('A6').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6B21A8' }
    };
    worksheet.getRow(6).height = 3;
    
    // Заголовок
    worksheet.mergeCells('A8:G8');
    const titleCell = worksheet.getCell('A8');
    titleCell.value = `Коммерческое предложение № ${kpNumber}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    // Заголовок таблицы
    const headerRow = worksheet.getRow(10);
    headerRow.values = ['№', 'Наименование', 'Артикул', 'Кол-во', 'Ед. изм', 'Цена, руб', 'Сумма, руб'];
    headerRow.font = { bold: true, size: 10 };
    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    
    let currentRow = 11;
    
    // Товары
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      const itemTotal = price * item.quantity;
      
      const row = worksheet.getRow(currentRow);
      row.height = 30;
      
      const nameParts = item.name.split('\n');
      const article = nameParts[0] ? nameParts[0].replace('Арт. ', '') : '';
      const productName = nameParts[1] || item.name;
      
      row.getCell(1).value = i + 1;
      row.getCell(2).value = productName;
      row.getCell(3).value = article;
      row.getCell(4).value = item.quantity;
      row.getCell(5).value = 'шт';
      row.getCell(6).value = price;
      row.getCell(6).numFmt = '#,##0.00';
      row.getCell(7).value = itemTotal;
      row.getCell(7).numFmt = '#,##0.00';
      
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { 
          vertical: 'middle', 
          horizontal: cell.col === 2 ? 'left' : 'center',
          wrapText: true 
        };
      });
      
      currentRow++;
    }
    
    // Строка монтаж+доставка (20% от суммы товаров)
    const montageRow = worksheet.getRow(currentRow);
    montageRow.values = [cart.length + 1, 'Монтаж + доставка', '', 1, 'усл', montageDelivery, montageDelivery];
    montageRow.height = 25;
    montageRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: cell.col === 2 ? 'left' : 'center' };
    });
    montageRow.getCell(6).numFmt = '#,##0.00';
    montageRow.getCell(7).numFmt = '#,##0.00';
    currentRow++;
    
    // Итого
    const totalRow = worksheet.getRow(currentRow);
    totalRow.values = ['', '', '', '', '', 'Итого:', grandTotal];
    totalRow.font = { bold: true, size: 11 };
    totalRow.height = 25;
    totalRow.getCell(6).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    totalRow.getCell(7).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    totalRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
    totalRow.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
    totalRow.getCell(7).numFmt = '#,##0.00';
    totalRow.getCell(7).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB3B' }
    };
    
    currentRow += 2;
    
    // Нижний текст
    worksheet.getCell(`A${currentRow}`).value = 'Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017';
    worksheet.getCell(`A${currentRow}`).font = { size: 9 };
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Срок действия коммерческого предложения 15 дней';
    worksheet.getCell(`A${currentRow}`).font = { size: 9 };
    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Срок изготовления оборудования 30 дней';
    worksheet.getCell(`A${currentRow}`).font = { size: 9 };
    
    currentRow += 2;
    
    // Подписи
    worksheet.getCell(`A${currentRow}`).value = 'Индивидуальный предприниматель';
    worksheet.getCell(`E${currentRow}`).value = '/Пронин Р.О./';
    worksheet.getCell(`E${currentRow}`).font = { italic: true };
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `КП_${kpNumber.replace(/[\/\s]/g, '_')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        favoritesCount={favorites.length}
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
        setSelectedSubSubcategory={setSelectedSubSubcategory}
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleResetFilters={() => {
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setSelectedSubSubcategory(null);
          setSelectedSeries(null);
          setSearchQuery('');
        }}
        selectedSeries={selectedSeries}
        setSelectedSeries={setSelectedSeries}
        availableCategories={availableCategories}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <ContentSections />
    </div>
  );
}