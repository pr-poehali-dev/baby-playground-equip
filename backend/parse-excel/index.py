import json
import urllib.request
import pandas as pd
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
        # URL Excel-файла
        url = 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/Благоустройство 26.xls'
        
        # Скачиваем файл
        with urllib.request.urlopen(url) as response:
            excel_data = response.read()
        
        # Парсим Excel
        df = pd.read_excel(BytesIO(excel_data), engine='xlrd')
        
        # Конвертируем в список словарей
        products = []
        for _, row in df.iterrows():
            product = {}
            for col in df.columns:
                value = row[col]
                # Пропускаем пустые значения
                if pd.notna(value):
                    product[col] = str(value)
            
            if product:  # Добавляем только непустые строки
                products.append(product)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'total': len(products),
                'columns': list(df.columns),
                'products': products
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
