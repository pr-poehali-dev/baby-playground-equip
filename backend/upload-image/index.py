import json
import base64
import os
import boto3
import psycopg2
import uuid

def handler(event: dict, context) -> dict:
    '''Загрузка изображения для товара по артикулу'''
    
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
        article = body.get('article', '')
        filename = body.get('filename', 'image.png')
        base64_content = body.get('content', '')
        
        if not article or not base64_content:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Артикул и изображение обязательны'
                }),
                'isBase64Encoded': False
            }
        
        # Декодируем изображение
        image_data = base64.b64decode(base64_content)
        
        # Определяем расширение файла
        ext = filename.split('.')[-1] if '.' in filename else 'png'
        
        # Загружаем в S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        img_filename = f"catalog-images/{article}-{uuid.uuid4()}.{ext}"
        
        s3.put_object(
            Bucket='files',
            Key=img_filename,
            Body=image_data,
            ContentType=f'image/{ext}'
        )
        
        img_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{img_filename}"
        
        # Обновляем товар в БД
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        schema = os.environ['MAIN_DB_SCHEMA']
        
        safe_article = article.replace("'", "''")
        safe_url = img_url.replace("'", "''")
        
        # Проверяем существует ли товар
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
                'body': json.dumps({
                    'success': False,
                    'error': f'Товар с артикулом {article} не найден'
                }),
                'isBase64Encoded': False
            }
        
        product_id = result[0]
        product_name = result[1]
        
        # Обновляем URL изображения
        cursor.execute(f"UPDATE {schema}.products SET image_url = '{safe_url}' WHERE article = '{safe_article}'")
        
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
                'product_name': product_name,
                'article': article,
                'image_url': img_url
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
