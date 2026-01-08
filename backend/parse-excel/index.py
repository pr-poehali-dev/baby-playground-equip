import json
import urllib.request
import urllib.parse
import xlrd
import re
from io import BytesIO


def handler(event: dict, context) -> dict:
    '''Парсинг Excel-файла с каталогом товаров'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        # URL Excel-файла (кодируем имя файла)
        base_url = 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/'
        filename = 'Спорт 26.xls'
        url = base_url + urllib.parse.quote(filename)
        
        # Скачиваем файл
        with urllib.request.urlopen(url) as response:
            excel_data = response.read()
        
        # Парсим Excel с помощью xlrd напрямую
        workbook = xlrd.open_workbook(file_contents=excel_data)
        
        # Собираем все товары со всех листов (кроме оглавления)
        all_products = []
        
        for sheet_idx in range(workbook.nsheets):
            sheet = workbook.sheet_by_index(sheet_idx)
            sheet_name = workbook.sheet_names()[sheet_idx]
            
            # Пропускаем оглавление
            if 'оглавление' in sheet_name.lower():
                continue
            
            # Ищем строку с заголовками (обычно содержит "Артикул")
            header_row_idx = None
            
            for row_idx in range(min(10, sheet.nrows)):
                row_values = [str(sheet.cell_value(row_idx, col)) for col in range(sheet.ncols)]
                if any('артикул' in val.lower() for val in row_values):
                    header_row_idx = row_idx
                    break
            
            # Если не нашли заголовки, пропускаем лист
            if header_row_idx is None:
                continue
            
            # Парсим товары начиная со строки после заголовков
            for row_idx in range(header_row_idx + 1, sheet.nrows):
                row_values = [sheet.cell_value(row_idx, col) for col in range(sheet.ncols)]
                
                # Проверяем что строка не пустая
                if not any(str(val).strip() for val in row_values):
                    continue
                
                # Извлекаем данные из колонок
                # Обычно структура: [пусто, пусто/артикул, название+артикул, габариты, вес, объем, цена]
                name_and_code = str(row_values[2]).strip() if len(row_values) > 2 else ''
                dimensions = str(row_values[3]).strip() if len(row_values) > 3 else ''
                weight = str(row_values[4]).strip() if len(row_values) > 4 else ''
                volume = str(row_values[5]).strip() if len(row_values) > 5 else ''
                price = str(row_values[6]).strip() if len(row_values) > 6 else ''
                
                # Пропускаем если нет названия
                if not name_and_code:
                    continue
                
                # Пропускаем заголовки подразделов
                if any(word in name_and_code.lower() for word in ['workout, комплексы', 'workout, снаряды', 'тренажеры']):
                    continue
                
                # Извлекаем артикул из названия (обычно формат "Название     КОД-12")
                article_match = re.search(r'([А-Яа-яA-Za-z]{2,4}-\d+)', name_and_code)
                article = article_match.group(1) if article_match else ''
                
                # Очищаем название от артикула
                if article:
                    name = re.sub(r'\s*[А-Яа-яA-Za-z]{2,4}-\d+\s*', '', name_and_code).strip()
                else:
                    name = name_and_code
                
                # Создаём товар
                product = {
                    'article': article,
                    'name': name,
                    'category': sheet_name,
                }
                
                if dimensions:
                    product['dimensions'] = dimensions
                if weight:
                    product['weight'] = weight
                if volume:
                    product['volume'] = volume
                if price:
                    product['price'] = price
                
                # Добавляем только если есть артикул или хотя бы имя
                if article or name:
                    all_products.append(product)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'total': len(all_products),
                'products': all_products
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }),
            'isBase64Encoded': False
        }
