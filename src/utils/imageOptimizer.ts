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

  const isMobile = window.innerWidth < 768;
  const actualWidth = width || (isMobile ? 600 : 1200);
  const actualQuality = Math.min(quality, 95);
  
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${actualWidth}&q=${actualQuality}&output=webp&il&n=-1`;
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