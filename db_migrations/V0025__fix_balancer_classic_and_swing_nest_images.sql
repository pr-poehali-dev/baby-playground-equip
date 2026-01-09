-- Обновляем изображение балансира "Классик" на более уникальное имя
UPDATE products 
SET image_url = 'https://cdn.poehali.dev/files/балансир_классик.png'
WHERE article = '0131';

-- Обновляем изображение качели "Гнездо" на то, что в галерее (115.png)
UPDATE products 
SET image_url = 'https://cdn.poehali.dev/files/115.png'
WHERE article = '0115';