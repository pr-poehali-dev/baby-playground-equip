import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API для получения списка товаров с фильтрацией по категории'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        params = event.get('queryStringParameters') or {}
        category = params.get('category')
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        schema = os.environ.get('MAIN_DB_SCHEMA', 't_p92226548_baby_playground_equi')
        
        if category:
            # Escape single quotes for Simple Query Protocol
            safe_category = category.replace("'", "''")
            cursor.execute(f"""
                SELECT id, article, name, category, dimensions, price, image_url, description
                FROM {schema}.products
                WHERE category = '{safe_category}'
                ORDER BY id
            """)
        else:
            cursor.execute(f"""
                SELECT id, article, name, category, dimensions, price, image_url, description
                FROM {schema}.products
                ORDER BY id
            """)
        
        products = []
        for row in cursor.fetchall():
            products.append({
                'id': row[0],
                'article': row[1],
                'name': row[2],
                'category': row[3],
                'dimensions': row[4],
                'price': row[5],
                'image': row[6] or '',
                'description': row[7] or ''
            })
        
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
                'products': products,
                'count': len(products)
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