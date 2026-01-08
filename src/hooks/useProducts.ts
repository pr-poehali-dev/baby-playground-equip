import { useQuery } from '@tanstack/react-query';
import func2url from '../../backend/func2url.json';

export interface Product {
  id: number;
  article: string;
  name: string;
  category: string;
  dimensions: string | null;
  price: number;
  image_url: string | null;
  description: string | null;
}

export const useProducts = (category?: string) => {
  return useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      const url = category 
        ? `${func2url.products}?category=${encodeURIComponent(category)}`
        : func2url.products;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
