-- Исправление артикулов через временные значения
UPDATE products SET article = 'TEMP125' WHERE article = '0125' AND name LIKE '%гибкое%';
UPDATE products SET article = 'TEMP126' WHERE article = '0126' AND name LIKE '%металлическое%';
UPDATE products SET article = 'TEMP127' WHERE article = '0127' AND name LIKE '%пластиковое%';

UPDATE products SET 
    article = '0125',
    name = 'Сиденье металлическое прорезиненное',
    dimensions = '450х180х27',
    price = 8680,
    image_url = 'https://cdn.poehali.dev/files/126.png'
WHERE article = 'TEMP126';

UPDATE products SET 
    article = '0126',
    name = 'Сиденье пластиковое "Люлька"',
    dimensions = '320х260х190',
    price = 22475,
    image_url = 'https://cdn.poehali.dev/files/127.png'
WHERE article = 'TEMP127';

UPDATE products SET 
    article = '0127',
    name = 'Сиденье гибкое без спинки',
    dimensions = '670х140х8',
    price = 8370,
    image_url = 'https://cdn.poehali.dev/files/125.png'
WHERE article = 'TEMP125';