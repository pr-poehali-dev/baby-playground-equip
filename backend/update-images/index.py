import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''Обновление изображений для игровых комплексов'''
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
    
    # Маппинг артикулов на изображения
    image_map = {
        'ИК-001': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/a5c1d319-7f1d-44a6-af15-084818bccd91.jpg',
        'ИК-002': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/b5109f5f-8427-471c-8db3-33059f6bbe39.jpg',
        'ИК-003': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/12b0000c-a880-47af-90bc-9cbcfcbb8070.jpg',
        'ИК-004': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/31d7ec0c-373d-4c02-ac40-7c2b05ca6c54.jpg',
        'ИК-005': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/602dc236-a7c3-47a1-9b7a-3d5f53fa7b54.jpg',
        'ИК-006': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/297d964b-af9a-4916-b697-a48b402ab3ff.jpg',
        'ИК-011': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/6558b5d9-72c6-464f-8412-ab51a3cb1294.jpg',
        'ИК-012': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/c9514f6a-66e6-430f-99f2-653d5f5da4d7.jpg',
        'ИК-013': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/63bc931a-5819-4e2b-ab06-4d2a7d6cf9cc.jpg',
        'ИК-015': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/163f0244-38a5-4113-97bd-df6d8fdf700c.jpg',
        'ИК-017': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/b6137ea2-3498-4807-a60e-4e7aba662a94.jpg',
        'ИК-018': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/b2c77284-3756-421a-bfae-5ee6726e9549.jpg',
        'ИК-019': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/1d57a818-bf00-4eb0-93b4-b49d87f8ccd8.jpg',
        'ИК-020': 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/files/813398cf-eb41-4b5b-ac40-3c4a34e6133c.jpg'
    }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        updated = 0
        
        for article, image_url in image_map.items():
            cursor.execute(
                "UPDATE products SET image_url = %s WHERE article = %s",
                (image_url, article)
            )
            if cursor.rowcount > 0:
                updated += 1
        
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
                'updated': updated,
                'total': len(image_map)
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
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
