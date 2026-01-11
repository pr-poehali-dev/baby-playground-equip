import json
import io
import base64
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.drawing.image import Image as XLImage
from openpyxl.utils import get_column_letter
import urllib.request

def handler(event, context):
    """Генерация Excel файла с коммерческим предложением"""
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        products = body.get('products', [])
        delivery_cost = body.get('deliveryCost', 0)
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Коммерческое предложение"
        
        # Логотип и шапка
        current_row = 1
        
        # Заголовок компании (правый верхний угол)
        ws.merge_cells(f'E{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=5, value='ИП ИРОНИН РУСЛАН ОЛЕГОВИЧ')
        cell.font = Font(bold=True, size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        current_row += 1
        
        # ИНН и ОГРНИП
        ws.merge_cells(f'E{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=5, value='ИНН 110290632307 ОГРНИП 321112300012852')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        current_row += 1
        
        # Адрес
        ws.merge_cells(f'E{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=5, value='353900, г. Новороссийск, ул. Героев-Десантников, д. 57 кв. 7')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        current_row += 1
        
        # Телефон и email
        ws.merge_cells(f'E{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=5, value='тел. +7 918 115 15 51, e-mail: info@urban-play.ru')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        current_row += 2
        
        # Заголовок КП
        ws.merge_cells(f'A{current_row}:G{current_row}')
        kp_number = datetime.now().strftime('%Y%m%d%H%M%S')[-4:]
        cell = ws.cell(row=current_row, column=1, value=f'Коммерческое предложение № {kp_number} от {datetime.now().strftime("%d.%m.%Y")}')
        cell.font = Font(bold=True, size=14)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        ws.row_dimensions[current_row].height = 25
        current_row += 2
        
        # Адрес объекта
        ws.cell(row=current_row, column=1, value='Адрес объекта:').font = Font(bold=True)
        ws.cell(row=current_row, column=2, value='_' * 80)
        current_row += 2
        
        # Настройка колонок для таблицы
        ws.column_dimensions['A'].width = 4   # №
        ws.column_dimensions['B'].width = 25  # Наименование
        ws.column_dimensions['C'].width = 15  # Рисунок
        ws.column_dimensions['D'].width = 12  # Кол-во
        ws.column_dimensions['E'].width = 8   # Ед. изм
        ws.column_dimensions['F'].width = 12  # Цена
        ws.column_dimensions['G'].width = 12  # Сумма
        
        # Стили границ
        thin_border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # Заголовки таблицы
        table_start_row = current_row
        headers = ['№', 'Наименование', 'Рисунок', 'Кол-во', 'Ед. изм', 'Цена, руб', 'Сумма, руб']
        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=current_row, column=col_num, value=header)
            cell.font = Font(bold=True, size=10)
            cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
            cell.border = thin_border
        
        ws.row_dimensions[current_row].height = 30
        current_row += 1
        
        # Заполнение данных
        total_sum = 0
        
        for idx, product in enumerate(products, 1):
            row_start = current_row
            ws.row_dimensions[current_row].height = 75
            
            # Номер
            cell = ws.cell(row=current_row, column=1, value=idx)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            # Наименование (артикул + название)
            article = product.get('article', '')
            name = product.get('name', '')
            full_name = f"{article}\n{name}" if article else name
            cell = ws.cell(row=current_row, column=2, value=full_name)
            cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
            cell.border = thin_border
            
            # Рисунок - изображение
            if product.get('image') and product['image'].startswith('http'):
                try:
                    req = urllib.request.Request(product['image'], headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        img_data = response.read()
                        img = XLImage(io.BytesIO(img_data))
                        img.width = 100
                        img.height = 90
                        ws.add_image(img, f'C{current_row}')
                except Exception as e:
                    print(f'Failed to load image: {e}')
            
            cell = ws.cell(row=current_row, column=3, value='')
            cell.border = thin_border
            
            # Количество
            quantity = product['quantity']
            cell = ws.cell(row=current_row, column=4, value=quantity)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            # Ед. изм
            cell = ws.cell(row=current_row, column=5, value='шт')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            # Цена
            price = int(product['price'].replace(' ', '')) if isinstance(product['price'], str) else product['price']
            cell = ws.cell(row=current_row, column=6, value=price)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            
            # Сумма
            sum_price = price * quantity
            total_sum += sum_price
            cell = ws.cell(row=current_row, column=7, value=sum_price)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            
            current_row += 1
        
        # Доставка
        if delivery_cost > 0:
            cell = ws.cell(row=current_row, column=1, value=len(products) + 1)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=2, value='Доставка – доставка')
            cell.alignment = Alignment(horizontal='left', vertical='center')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=3, value='')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=4, value=1)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=5, value='усл')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=6, value=delivery_cost)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=7, value=delivery_cost)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            
            total_sum += delivery_cost
            ws.row_dimensions[current_row].height = 20
            current_row += 1
        
        # Итого
        ws.merge_cells(f'F{current_row}:F{current_row}')
        cell = ws.cell(row=current_row, column=6, value='Итого:')
        cell.font = Font(bold=True, size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.border = thin_border
        
        cell = ws.cell(row=current_row, column=7, value=total_sum)
        cell.font = Font(bold=True, size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.number_format = '#,##0.00'
        cell.border = thin_border
        current_row += 2
        
        # Условия
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017')
        cell.font = Font(size=9)
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок действия коммерческого предложения 15 дней')
        cell.font = Font(size=9)
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок изготовления оборудования 30 дней')
        cell.font = Font(size=9)
        current_row += 2
        
        # Подпись
        ws.cell(row=current_row, column=1, value='Индивидуальный предприниматель').font = Font(size=10)
        ws.merge_cells(f'E{current_row}:F{current_row}')
        cell = ws.cell(row=current_row, column=5, value='Иронин Р.О.')
        cell.font = Font(size=10)
        cell.alignment = Alignment(horizontal='right')
        
        # Сохранение в память
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="commercial_offer.xlsx"',
                'Access-Control-Allow-Origin': '*'
            },
            'body': base64.b64encode(excel_file.getvalue()).decode('utf-8'),
            'isBase64Encoded': True
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }