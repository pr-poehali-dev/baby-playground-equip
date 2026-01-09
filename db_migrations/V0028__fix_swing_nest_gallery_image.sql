-- Обновляем изображения качели "Гнездо" в галерее на правильный файл 0115.png
UPDATE product_images 
SET image_url = 'https://cdn.poehali.dev/files/0115.png'
WHERE product_id = (SELECT id FROM products WHERE article = '0115');