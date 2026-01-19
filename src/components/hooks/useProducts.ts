import { useState, useEffect } from 'react';

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

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

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
            let mappedCategory = categoryMap[p.category] || p.category;
            let subcategory = undefined;
            let subsubcategory = undefined;
            
            // Парсим категорию из формата "Категория > Подкатегория > Подподкатегория > ..."
            if (typeof p.category === 'string' && p.category.includes(' > ')) {
              const parts = p.category.split(' > ').map((s: string) => s.trim());
              
              // parts[0] - основная категория (Детские площадки, Спорт и т.д.)
              if (parts[0] === 'Детские площадки') {
                mappedCategory = 'playground';
              } else if (parts[0] === 'Спорт') {
                mappedCategory = 'sport';
              } else if (parts[0] === 'Парк') {
                mappedCategory = 'park';
              }
              
              // parts[1] - серия (Игровые комплексы, и т.д.)
              // parts[2] - возрастная группа или тип (3-7 лет, 5-12 лет)
              // parts[3] - тематика (Классик, Джунгли, Замок и т.д.)
              
              if (parts.length >= 2) {
                subcategory = 'Серия "Classic"'; // Всё в Classic серию
              }
              
              if (parts.length === 2) {
                // Простой случай: Категория > Подкатегория
                subsubcategory = parts[1];
              } else if (parts.length >= 3) {
                // Сложный случай: Категория > Подкатегория > Подподкатегория > ...
                // Объединяем всё после первой части
                subsubcategory = parts.slice(1).join(' > ');
              }
            } else {
              // Старая логика для обратной совместимости
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

  return { products, isLoadingProducts };
}