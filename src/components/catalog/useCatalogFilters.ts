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

interface UseCatalogFiltersProps {
  products: Product[];
  selectedCategory: string | null;
  selectedSeries: string | null;
  selectedSubSubcategory: string | null;
  searchQuery: string;
}

export function useCatalogFilters({
  products,
  selectedCategory,
  selectedSeries,
  selectedSubSubcategory,
  searchQuery,
}: UseCatalogFiltersProps) {
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
    
    if (searchQuery.trim()) {
      filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toString().includes(searchQuery) ||
        (p.article && p.article.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      filtered = filtered.filter(p => parseInt(p.price) > 0);
      return filtered;
    }
    
    if (selectedSubSubcategory) {
      const parts = selectedSubSubcategory.split(' > ');
      filtered = filtered.filter(p => {
        if (!p.subsubcategory) return false;
        
        // Если выбрано "Игровые комплексы > 3-7 лет" (без тематики)
        if (parts.length === 2) {
          // Показываем все товары этой возрастной категории
          return p.subsubcategory.includes(parts[1]);
        }
        
        // Если выбрано "Игровые комплексы > 3-7 лет > Классик"
        if (parts.length === 3) {
          return p.subsubcategory.includes(parts[1]) && p.subsubcategory.includes(parts[2]);
        }
        
        // Для других категорий (не игровые комплексы)
        return p.subsubcategory === selectedSubSubcategory || 
               p.subsubcategory.includes(selectedSubSubcategory);
      });
    }
    
    if (selectedSeries) {
      filtered = filtered.filter(p => p.subcategory === selectedSeries);
    }
    
    filtered = filtered.filter(p => parseInt(p.price) > 0);
    
    return filtered;
  })();

  return {
    availableCategories,
    filteredProducts,
  };
}