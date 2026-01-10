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

  return { products, isLoadingProducts };
}
