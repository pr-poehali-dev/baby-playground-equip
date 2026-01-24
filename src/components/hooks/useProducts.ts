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
            
            // Обработка старого формата для Workout (без иерархии)
            if (p.category === 'Workout') {
              mappedCategory = 'sport';
              subcategory = 'Серия "Classic Sport"';
              subsubcategory = 'Workout';
            }
            
            // Парсим категорию из формата "Категория > Подкатегория > Подподкатегория > ..."
            if (typeof p.category === 'string' && p.category.includes(' > ')) {
              // Нормализуем множественные пробелы перед парсингом
              const normalizedCategory = p.category.replace(/\s+/g, ' ').trim();
              const parts = normalizedCategory.split(' > ').map((s: string) => s.trim());
              
              // parts[0] - основная категория (Детские площадки, Игра, Спорт и т.д.)
              if (parts[0] === 'Детские площадки' || parts[0] === 'Игра') {
                mappedCategory = 'playground';
              } else if (parts[0] === 'Спорт') {
                mappedCategory = 'sport';
              } else if (parts[0] === 'Парк') {
                mappedCategory = 'park';
              }
              
              // parts[1] - серия (Classic, Eco и т.д.)
              // parts[2] - подкатегория (Игровые комплексы, Качели и т.д.)
              // parts[3+] - глубокая вложенность (3-7 лет > Замок)
              
              if (parts.length >= 2) {
                // Определяем серию из parts[1]
                const seriesName = parts[1].toLowerCase();
                if (seriesName === 'classic') {
                  subcategory = 'Серия "Classic"';
                } else if (seriesName === 'eco') {
                  subcategory = 'Серия "Eco"';
                } else if (parts[1] === 'Classic Sport') {
                  subcategory = 'Серия "Classic Sport"';
                } else if (parts[1] === 'Eco Sport') {
                  subcategory = 'Серия "Eco Sport"';
                } else {
                  subcategory = 'Серия "Classic"'; // По умолчанию Classic
                }
              }
              
              if (parts.length === 2) {
                // Простой случай: Категория > Подкатегория
                // НО! Для категорий со сериями (Игра, Спорт) parts[1] - это серия, а не подкатегория
                // Поэтому НЕ устанавливаем subsubcategory для Игра/Спорт с только 2 уровнями
                if (parts[0] !== 'Игра' && parts[0] !== 'Детские площадки' && parts[0] !== 'Спорт') {
                  subsubcategory = parts[1];
                }
              } else if (parts.length >= 3) {
                // Сложный случай: Категория > Серия > Подкатегория > Подподкатегория > ...
                // Объединяем всё после серии (начиная с parts[2])
                let subParts = parts.slice(2);
                
                // Убираем "Игровые комплексы" если он первый (он уже в структуре диалога)
                if (subParts[0] === 'Игровые комплексы') {
                  subParts = subParts.slice(1);
                }
                
                // Преобразуем "Игровой комплекс X-Y лет" → "Комплексы X-Y лет"
                subParts = subParts.map(p => {
                  // Нормализуем множественные пробелы в один
                  let normalized = p.replace(/\s+/g, ' ').trim();
                  
                  if (normalized.includes('Игровой комплекс')) {
                    // "Игровой комплекс 3-7 лет" → "Комплексы 3-7 лет"
                    normalized = normalized.replace('Игровой комплекс', 'Комплексы');
                  }
                  
                  // Маппинг единственного числа в множественное
                  const singularToPlural: Record<string, string> = {
                    'балансир': 'Балансиры',
                    'горка': 'Горки',
                    'качели': 'Качели',
                    'карусель': 'Карусели',
                    'качалка': 'Качалки',
                    'домик': 'Домики',
                    'песочница': 'Песочницы',
                    'лаз': 'Лазы'
                  };
                  
                  const lowerNormalized = normalized.toLowerCase();
                  if (singularToPlural[lowerNormalized]) {
                    return singularToPlural[lowerNormalized];
                  }
                  
                  // Нормализуем регистр названий (классик → Классик)
                  if (lowerNormalized === 'классик') {
                    return 'Классик';
                  }
                  if (lowerNormalized === 'джунгли') {
                    return 'Джунгли';
                  }
                  if (lowerNormalized === 'замок') {
                    return 'Замок';
                  }
                  if (lowerNormalized === 'морская') {
                    return 'Морская';
                  }
                  if (lowerNormalized === 'лабиринт') {
                    return 'Лабиринт';
                  }
                  return normalized;
                });
                
                subsubcategory = subParts.join(' > ');
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