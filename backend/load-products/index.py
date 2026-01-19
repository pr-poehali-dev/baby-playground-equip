import json
import os
import psycopg2


def upload_images_handler(body: dict) -> dict:
    '''Привязка изображений к товару'''
    images = body.get('images', [])
    article = body.get('article')
    
    if not images or not article:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing images or article'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    # Находим товар по артикулу
    safe_article = article.replace("'", "''")
    cursor.execute(f"SELECT id, name FROM {schema}.products WHERE article = '{safe_article}' LIMIT 1")
    result = cursor.fetchone()
    
    if not result:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Product with article {article} not found'}),
            'isBase64Encoded': False
        }
    
    product_id = result[0]
    
    # Создаем таблицу для изображений если не существует
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {schema}.product_images (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES {schema}.products(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Удаляем старые изображения для этого товара
    cursor.execute(f"DELETE FROM {schema}.product_images WHERE product_id = {product_id}")
    
    # Добавляем новые изображения
    for idx, img_url in enumerate(images):
        safe_url = img_url.replace("'", "''")
        cursor.execute(f"INSERT INTO {schema}.product_images (product_id, image_url, sort_order) VALUES ({product_id}, '{safe_url}', {idx})")
    
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
            'product_id': product_id,
            'images_count': len(images)
        }),
        'isBase64Encoded': False
    }


def handler(event: dict, context) -> dict:
    '''Загрузка товаров из parse-excel в базу данных и управление изображениями'''
    
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Проверяем тип действия
        action = body.get('action', 'load_products')
        
        if action == 'upload_images':
            return upload_images_handler(body)
        
        # Стандартная загрузка товаров
        products = body.get('products', [])
        
        if not products:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No products provided'}),
                'isBase64Encoded': False
            }
        
        # Подключаемся к базе данных
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Очищаем таблицу только если явно указано
        if body.get('clear_existing', False):
            cursor.execute(f"DELETE FROM {schema}.products")
        
        # Вставляем товары
        inserted = 0
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        for product in products:
            article = product.get('article', '').replace("'", "''")
            name = product.get('name', '').replace("'", "''")
            category = product.get('category', '').replace("'", "''")
            dimensions = product.get('dimensions', '').replace("'", "''")
            image_url = product.get('image', '').replace("'", "''")
            price_str = product.get('price', '')
            
            # Пропускаем если нет имени
            if not name:
                continue
            
            # Конвертируем цену в число
            price = 0
            if price_str:
                try:
                    price = int(float(price_str))
                except:
                    pass
            
            # Вставляем товар с image_url
            cursor.execute(f"""
                INSERT INTO {schema}.products (article, name, category, dimensions, price, image_url)
                VALUES ('{article}', '{name}', '{category}', '{dimensions}', {price}, '{image_url}')
            """)
            inserted += 1
        
        # Сохраняем изменения
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
                'inserted': inserted,
                'total_products': len(products)
            }),
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