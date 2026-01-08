-- Скрываем товар 0128 установкой цены 0 и обновляем фото для 0125, 0126, 0127
UPDATE products SET price = 0 WHERE article = '0128';

UPDATE products SET image_url = 'https://cdn.poehali.dev/files/125.png' WHERE article = '0125';
UPDATE products SET image_url = 'https://cdn.poehali.dev/files/126.png' WHERE article = '0126';
UPDATE products SET image_url = 'https://cdn.poehali.dev/files/127.png' WHERE article = '0127';