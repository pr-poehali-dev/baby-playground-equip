-- Обновление изображений для товаров 0110 и 0111
UPDATE product_images pi
SET image_url = 'https://cdn.poehali.dev/files/кач.png'
FROM products p
WHERE pi.product_id = p.id AND p.article = '0110';

UPDATE product_images pi
SET image_url = 'https://cdn.poehali.dev/files/111.png'
FROM products p
WHERE pi.product_id = p.id AND p.article = '0111';

-- Добавление изображения для 0115, если его еще нет
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://cdn.poehali.dev/files/115.png', 0
FROM products 
WHERE article = '0115'
AND NOT EXISTS (
  SELECT 1 FROM product_images WHERE product_id = products.id
);