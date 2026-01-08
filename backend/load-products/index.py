import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''Загрузка товаров из parse-excel в базу данных'''
    
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
        # Получаем данные из тела запроса
        body = json.loads(event.get('body', '{}'))
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
            cursor.execute("DELETE FROM products")
        
        # Вставляем товары
        inserted = 0
        for product in products:
            article = product.get('article', '')
            name = product.get('name', '')
            category = product.get('category', '')
            dimensions = product.get('dimensions', '')
            weight = product.get('weight', '')
            volume = product.get('volume', '')
            price_str = product.get('price', '')
            
            # Пропускаем если нет имени
            if not name:
                continue
            
            # Конвертируем цену в число
            price = None
            if price_str:
                try:
                    price = int(float(price_str))
                except:
                    pass
            
            # Вставляем товар
            cursor.execute("""
                INSERT INTO products (article, name, category, dimensions, price)
                VALUES (%s, %s, %s, %s, %s)
            """, (article, name, category, dimensions, price))
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
