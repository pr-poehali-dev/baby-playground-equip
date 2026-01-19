import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''Удаление товаров из базы данных по артикулам'''
    
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
        articles = body.get('articles', [])
        
        if not articles:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': False, 'error': 'No articles provided'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        deleted_count = 0
        
        # Специальный режим: удалить по диапазону артикулов
        if len(articles) == 1 and '-' in articles[0]:
            # Формат: "0230-0265"
            parts = articles[0].split('-')
            if len(parts) == 2:
                try:
                    start = int(parts[0])
                    end = int(parts[1])
                    for num in range(start, end + 1):
                        article = str(num).zfill(4)
                        cursor.execute(f"DELETE FROM {schema}.products WHERE article = '{article}'")
                        deleted_count += cursor.rowcount
                except ValueError:
                    # Не числа - удаляем как обычный артикул
                    for article in articles:
                        safe_article = article.replace("'", "''")
                        cursor.execute(f"DELETE FROM {schema}.products WHERE article = '{safe_article}'")
                        deleted_count += cursor.rowcount
        else:
            # Обычное удаление по списку
            for article in articles:
                safe_article = article.replace("'", "''")
                cursor.execute(f"DELETE FROM {schema}.products WHERE article = '{safe_article}'")
                deleted_count += cursor.rowcount
        
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
                'deleted': deleted_count
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