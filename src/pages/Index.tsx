import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CatalogSection } from '@/components/CatalogSection';
import { ContentSections } from '@/components/ContentSections';
import { categories, CartItem, Subcategory } from '@/components/data/catalogData';

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
    const ExcelJS = (await import('exceljs')).default;
    const total = calculateTotal();
    const date = new Date().toLocaleDateString('ru-RU');
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Коммерческое предложение');
    
    worksheet.columns = [
      { width: 5 },
      { width: 20 },
      { width: 40 },
      { width: 15 },
      { width: 12 },
      { width: 15 }
    ];
    
    worksheet.mergeCells('B2:F2');
    const titleCell = worksheet.getCell('B2');
    titleCell.value = 'КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    
    worksheet.getCell('B4').value = `Дата: ${date}`;
    worksheet.getCell('B5').value = 'От: Urban Play';
    
    const headerRow = worksheet.getRow(7);
    headerRow.values = ['', 'Фото', 'Наименование', 'Цена', 'Кол-во', 'Сумма'];
    headerRow.font = { bold: true };
    headerRow.height = 20;
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
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    
    let currentRow = 8;
    
    for (const item of cart) {
      const price = parseInt(item.price.replace(/\s/g, '').split('/')[0]);
      const itemTotal = price * item.quantity;
      
      const row = worksheet.getRow(currentRow);
      row.height = 80;
      
      if (item.image.startsWith('http')) {
        try {
          const response = await fetch(item.image);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          
          const imageId = workbook.addImage({
            buffer: arrayBuffer,
            extension: 'png',
          });
          
          worksheet.addImage(imageId, {
            tl: { col: 1.1, row: currentRow - 0.9 },
            ext: { width: 100, height: 75 }
          });
        } catch (error) {
          console.error('Failed to load image:', error);
        }
      }
      
      row.getCell(3).value = item.name.replace('Арт. ', '').replace('\n', ' - ');
      row.getCell(4).value = `${price.toLocaleString('ru-RU')} ₽`;
      row.getCell(5).value = item.quantity;
      row.getCell(6).value = `${itemTotal.toLocaleString('ru-RU')} ₽`;
      
      row.eachCell((cell, colNumber) => {
        if (colNumber > 1) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        }
      });
      
      currentRow++;
    }
    
    currentRow += 1;
    const totalRow = worksheet.getRow(currentRow);
    totalRow.getCell(5).value = 'ИТОГО:';
    totalRow.getCell(6).value = `${total.toLocaleString('ru-RU')} ₽`;
    totalRow.font = { bold: true, size: 12 };
    totalRow.getCell(5).alignment = { horizontal: 'right' };
    totalRow.getCell(6).alignment = { horizontal: 'center' };
    
    if (deliveryCost > 0) {
      currentRow++;
      const deliveryRow = worksheet.getRow(currentRow);
      deliveryRow.getCell(5).value = 'Доставка:';
      deliveryRow.getCell(6).value = `${deliveryCost.toLocaleString('ru-RU')} ₽`;
      
      currentRow++;
      const grandTotalRow = worksheet.getRow(currentRow);
      grandTotalRow.getCell(5).value = 'ВСЕГО:';
      grandTotalRow.getCell(6).value = `${(total + deliveryCost).toLocaleString('ru-RU')} ₽`;
      grandTotalRow.font = { bold: true, size: 14 };
    }
    
    currentRow += 2;
    worksheet.getCell(`B${currentRow}`).value = 'Условия оплаты:';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = '• Предоплата 50% после согласования заказа';
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = '• Оплата оставшихся 50% после доставки';
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = '• Принимаем наличные, безналичный расчёт, карты';
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = '• Гарантия 2 года на всё оборудование';
    
    currentRow += 2;
    worksheet.getCell(`B${currentRow}`).value = 'Контакты:';
    worksheet.getCell(`B${currentRow}`).font = { bold: true };
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Телефон: +7 (918) 115-15-51';
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Email: info@urban-play.ru';
    currentRow++;
    worksheet.getCell(`B${currentRow}`).value = 'Адрес: г. Краснодар, ул. Кореновская, д. 57 оф. 7';
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `КП_${date.replace(/\./g, '-')}.xlsx`;
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