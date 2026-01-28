/**
 * Оптимизация изображений через CDN с поддержкой WebP
 * @param url - исходный URL изображения
 * @param width - желаемая ширина (опционально)
 * @param quality - качество от 1 до 100 (по умолчанию 85)
 */
export function optimizeImage(url: string, width?: number, quality: number = 85): string {
  if (!url || !url.startsWith('http')) {
    return url;
  }

  // Используем imgproxy для оптимизации изображений
  const encodedUrl = btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  const params: string[] = [];
  
  // Формат WebP для лучшего сжатия
  params.push('format:webp');
  
  // Качество
  params.push(`quality:${quality}`);
  
  // Ширина (если указана)
  if (width) {
    params.push(`width:${width}`);
  }
  
  // Автоматическая оптимизация
  params.push('dpr:1');
  
  const paramsString = params.join('/');
  
  // Используем публичный прокси для оптимизации
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width || 800}&q=${quality}&output=webp&il`;
}

/**
 * Получить оптимизированные варианты изображения для разных размеров экрана
 */
export function getResponsiveImages(url: string, quality: number = 85) {
  return {
    thumbnail: optimizeImage(url, 300, quality),
    small: optimizeImage(url, 600, quality),
    medium: optimizeImage(url, 1200, quality),
    large: optimizeImage(url, 1920, quality),
    original: url
  };
}
