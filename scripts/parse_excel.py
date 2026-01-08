#!/usr/bin/env python3
"""Скрипт для парсинга Excel-файла с каталогом товаров"""

import urllib.request
import pandas as pd
from io import BytesIO
import json

# URL Excel-файла
url = 'https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/Благоустройство 26.xls'

print(f"Загружаю файл: {url}")

# Скачиваем файл
with urllib.request.urlopen(url) as response:
    excel_data = response.read()

print(f"Файл загружен: {len(excel_data)} байт")

# Парсим Excel
df = pd.read_excel(BytesIO(excel_data), engine='xlrd')

print(f"\nНайдено строк: {len(df)}")
print(f"Колонки: {list(df.columns)}\n")

# Выводим первые 5 строк для примера
print("Первые 5 товаров:")
print("=" * 80)
for idx, row in df.head(5).iterrows():
    print(f"\nТовар #{idx + 1}:")
    for col in df.columns:
        value = row[col]
        if pd.notna(value):
            print(f"  {col}: {value}")
    print("-" * 80)

# Конвертируем все товары в список
products = []
for _, row in df.iterrows():
    product = {}
    for col in df.columns:
        value = row[col]
        if pd.notna(value):
            product[col] = str(value)
    
    if product:
        products.append(product)

print(f"\n\nВсего товаров для загрузки: {len(products)}")

# Сохраняем в JSON для проверки
with open('products_from_excel.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("Данные сохранены в products_from_excel.json")
