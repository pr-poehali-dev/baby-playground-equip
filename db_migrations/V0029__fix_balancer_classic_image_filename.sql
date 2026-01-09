-- Обновляем изображение балансира "Классик" на правильный файл с ведущим нулем
UPDATE products 
SET image_url = 'https://cdn.poehali.dev/files/0131.png'
WHERE article = '0131';