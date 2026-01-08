-- Обновление качелей и сидений 0120-0127
UPDATE products SET image_url = 'https://cdn.poehali.dev/files/120.png' WHERE article = '0120';
UPDATE products SET image_url = 'https://cdn.poehali.dev/files/121.png' WHERE article = '0121';
UPDATE products SET image_url = 'https://cdn.poehali.dev/files/122.png' WHERE article = '0122';

-- Обновление названий и цен для сидений
UPDATE products SET 
  name = 'Сиденье прорезиненное "Люлька"',
  dimensions = '440х290х230',
  price = 28830
WHERE article = '0123';

UPDATE products SET 
  name = 'Сиденье качели',
  dimensions = '380х400х310',
  price = 10230
WHERE article = '0124';

UPDATE products SET 
  name = 'Сиденье гибкое без спинки',
  dimensions = '670х140х8',
  price = 8370
WHERE article = '0125';

UPDATE products SET 
  name = 'Сиденье металлическое прорезиненное',
  dimensions = '450х180х27',
  price = 8680
WHERE article = '0126';

UPDATE products SET 
  name = 'Сиденье пластиковое "Люлька"',
  dimensions = '320х260х190',
  price = 22475
WHERE article = '0127';