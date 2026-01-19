import json
import base64
import os
import boto3
import openpyxl
import re
import psycopg2
from io import BytesIO
import uuid

def handler(event: dict, context) -> dict:
    '''Загрузка Excel-файла с каталогом, извлечение изображений и сохранение в базу данных'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        filename = body.get('filename', 'catalog.xlsx')
        base64_content = body.get('content', '')
        
        if not base64_content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Файл не передан'
                }),
                'isBase64Encoded': False
            }
        
        file_data = base64.b64decode(base64_content)
        
        # Инициализируем S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        # Подключаемся к БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        schema = os.environ['MAIN_DB_SCHEMA']
        
        # Парсим Excel
        workbook = openpyxl.load_workbook(BytesIO(file_data))
        products_count = 0
        images_uploaded = 0
        
        # Словарь для сопоставления позиций изображений с артикулами
        image_map = {}
        
        for sheet in workbook.worksheets:
            sheet_name = sheet.title
            
            if 'оглавление' in sheet_name.lower():
                continue
            
            # Извлекаем изображения из листа
            if hasattr(sheet, '_images'):
                for image in sheet._images:
                    try:
                        img_data = image._data()
                        img_ext = image.format.lower() if hasattr(image, 'format') else 'png'
                        img_filename = f"catalog-images/{uuid.uuid4()}.{img_ext}"
                        
                        # Загружаем изображение в S3
                        s3.put_object(
                            Bucket='files',
                            Key=img_filename,
                            Body=img_data,
                            ContentType=f'image/{img_ext}'
                        )
                        
                        # Сохраняем URL и позицию
                        img_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{img_filename}"
                        
                        # Получаем позицию изображения (строка)
                        anchor = image.anchor
                        if hasattr(anchor, '_from'):
                            row_idx = anchor._from.row
                            image_map[row_idx] = img_url
                        
                        images_uploaded += 1
                    except Exception as img_error:
                        print(f'Error uploading image: {img_error}')
            
            # Ищем заголовки
            header_row_idx = None
            col_indices = {}
            
            for row_idx, row in enumerate(sheet.iter_rows(max_row=10, values_only=False), start=1):
                row_values = [str(cell.value).lower() if cell.value else '' for cell in row]
                
                if any('артикул' in val for val in row_values):
                    header_row_idx = row_idx
                    
                    # Определяем индексы колонок
                    for col_idx, val in enumerate(row_values):
                        if 'артикул' in val:
                            col_indices['article'] = col_idx
                        elif 'название' in val or 'наименование' in val:
                            col_indices['name'] = col_idx
                        elif 'категория' in val:
                            col_indices['category'] = col_idx
                        elif 'цена' in val:
                            col_indices['price'] = col_idx
                        elif 'габарит' in val or 'размер' in val:
                            col_indices['dimensions'] = col_idx
                    break
            
            if header_row_idx is None:
                continue
            
            # Читаем товары
            for row_idx, row in enumerate(sheet.iter_rows(min_row=header_row_idx + 1, values_only=True), start=header_row_idx + 1):
                if not any(str(val).strip() if val else '' for val in row):
                    continue
                
                # Извлекаем данные по индексам
                article = str(row[col_indices.get('article', 0)]).strip() if col_indices.get('article') is not None and len(row) > col_indices.get('article', 0) and row[col_indices.get('article', 0)] else ''
                name = str(row[col_indices.get('name', 1)]).strip() if col_indices.get('name') is not None and len(row) > col_indices.get('name', 1) and row[col_indices.get('name', 1)] else ''
                category = str(row[col_indices.get('category', 2)]).strip() if col_indices.get('category') is not None and len(row) > col_indices.get('category', 2) and row[col_indices.get('category', 2)] else 'Без категории'
                dimensions = str(row[col_indices.get('dimensions', 4)]).strip() if col_indices.get('dimensions') is not None and len(row) > col_indices.get('dimensions', 4) and row[col_indices.get('dimensions', 4)] else ''
                
                # Обработка цены
                price_val = row[col_indices.get('price', 3)] if col_indices.get('price') is not None and len(row) > col_indices.get('price', 3) else 0
                try:
                    price = int(float(str(price_val).replace(' ', '').replace(',', '.').replace('₽', '').strip())) if price_val else 0
                except:
                    price = 0
                
                if not article and not name:
                    continue
                
                # Ищем изображение для этой строки
                image_url = image_map.get(row_idx, None)
                
                # Вставляем или обновляем товар в БД
                cursor.execute(f'''
                    INSERT INTO {schema}.products (article, name, category, price, dimensions, image_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (article) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        category = EXCLUDED.category,
                        price = EXCLUDED.price,
                        dimensions = EXCLUDED.dimensions,
                        image_url = COALESCE(EXCLUDED.image_url, {schema}.products.image_url)
                ''', (article, name, category, price, dimensions, image_url))
                
                products_count += 1
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'productsCount': products_count,
                'imagesUploaded': images_uploaded,
                'message': f'Файл загружен успешно. Обработано товаров: {products_count}, изображений: {images_uploaded}'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f'Error: {error_details}')
        
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
