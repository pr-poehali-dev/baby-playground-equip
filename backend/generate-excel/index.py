import json
import io
import base64
import os
from datetime import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.drawing.image import Image as XLImage
from openpyxl.utils import get_column_letter
import urllib.request
from PIL import Image as PILImage

COUNTER_FILE = '/tmp/kp_counter.txt'

def get_next_kp_number():
    """Получить следующий номер КП из счетчика"""
    try:
        if os.path.exists(COUNTER_FILE):
            with open(COUNTER_FILE, 'r') as f:
                counter = int(f.read().strip())
        else:
            counter = 0
        
        counter += 1
        
        with open(COUNTER_FILE, 'w') as f:
            f.write(str(counter))
        
        return counter
    except:
        return 1

def handler(event, context):
    """Генерация Excel файла с коммерческим предложением по точному формату"""
    
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
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Коммерческое предложение"
        
        current_row = 1
        
        # Логотип (левый верхний угол)
        try:
            logo_url = 'https://cdn.poehali.dev/files/Рисунок1.png'
            req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                logo_data = response.read()
                
                pil_logo = PILImage.open(io.BytesIO(logo_data))
                pil_logo.thumbnail((120, 60), PILImage.Resampling.LANCZOS)
                
                logo_buffer = io.BytesIO()
                pil_logo.save(logo_buffer, format='PNG')
                logo_buffer.seek(0)
                
                logo_img = XLImage(logo_buffer)
                logo_img.width = pil_logo.width
                logo_img.height = pil_logo.height
                
                ws.add_image(logo_img, 'A1')
        except Exception as e:
            print(f'Failed to load logo: {e}')
        
        ws.merge_cells(f'A{current_row}:B{current_row+4}')
        
        # Шапка компании (правый верхний угол) - расширяем до колонки H для полного размещения
        ws.merge_cells(f'D{current_row}:H{current_row}')
        cell = ws.cell(row=current_row, column=4, value='ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ')
        cell.font = Font(bold=True, size=10)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        current_row += 1
        
        # ИНН и ОГРНИП
        ws.merge_cells(f'D{current_row}:H{current_row}')
        cell = ws.cell(row=current_row, column=4, value='ИНН 110209455200 ОГРНИП 32377460012482')
        cell.font = Font(size=8)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        current_row += 1
        
        # Адрес
        ws.merge_cells(f'D{current_row}:H{current_row}')
        cell = ws.cell(row=current_row, column=4, value='350005, г. Краснодар, ул. Кореновская, д. 57 оф.7')
        cell.font = Font(size=8)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        current_row += 1
        
        # Телефон и email
        ws.merge_cells(f'D{current_row}:H{current_row}')
        cell = ws.cell(row=current_row, column=4, value='тел: +7 918 115 15 51 e-mail: info@urban-play.ru')
        cell.font = Font(size=8)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        current_row += 1
        
        # Сайт
        ws.merge_cells(f'D{current_row}:H{current_row}')
        cell = ws.cell(row=current_row, column=4, value='www.urban-play.ru')
        cell.font = Font(size=8)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        current_row += 1
        
        # Заголовок КП
        ws.merge_cells(f'A{current_row}:G{current_row}')
        kp_number = get_next_kp_number()
        cell = ws.cell(row=current_row, column=1, value=f'Коммерческое предложение № {kp_number:04d} от {datetime.now().strftime("%d.%m.%Y")}')
        cell.font = Font(bold=True, size=12)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        ws.row_dimensions[current_row].height = 20
        current_row += 2
        
        # Адрес объекта
        cell = ws.cell(row=current_row, column=1, value='Адрес объекта:')
        cell.font = Font(size=10)
        ws.merge_cells(f'B{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=2, value='')
        cell.border = Border(bottom=Side(style='thin'))
        current_row += 2
        
        # Настройка колонок
        ws.column_dimensions['A'].width = 4    # №
        ws.column_dimensions['B'].width = 24   # Наименование
        ws.column_dimensions['C'].width = 16   # Рисунок
        ws.column_dimensions['D'].width = 7    # Кол-во
        ws.column_dimensions['E'].width = 7    # Ед. изм
        ws.column_dimensions['F'].width = 11   # Цена руб
        ws.column_dimensions['G'].width = 11   # Сумма руб
        
        # Границы
        thin_border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # Заголовки таблицы
        headers = ['№', 'Наименование', 'Рисунок', 'Кол-во', 'Ед. изм', 'Цена, руб', 'Сумма, руб']
        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=current_row, column=col_num, value=header)
            cell.font = Font(bold=True, size=9)
            cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
            cell.border = thin_border
            cell.fill = PatternFill(start_color='E0E0E0', end_color='E0E0E0', fill_type='solid')
        
        ws.row_dimensions[current_row].height = 28
        current_row += 1
        
        # Товары
        equipment_total = 0
        
        for idx, product in enumerate(products, 1):
            ws.row_dimensions[current_row].height = 75
            
            # №
            cell = ws.cell(row=current_row, column=1, value=idx)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(size=9)
            
            # Наименование
            article = product.get('article', '')
            name = product.get('name', '')
            full_name = f"{article}\n{name}" if article else name
            cell = ws.cell(row=current_row, column=2, value=full_name)
            cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
            cell.border = thin_border
            cell.font = Font(size=9)
            
            # Рисунок
            if product.get('image') and product['image'].startswith('http'):
                try:
                    req = urllib.request.Request(product['image'], headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        img_data = response.read()
                        
                        pil_img = PILImage.open(io.BytesIO(img_data))
                        
                        max_width = 100
                        max_height = 65
                        pil_img.thumbnail((max_width, max_height), PILImage.Resampling.LANCZOS)
                        
                        img_buffer = io.BytesIO()
                        pil_img.save(img_buffer, format='PNG')
                        img_buffer.seek(0)
                        
                        img = XLImage(img_buffer)
                        img.width = pil_img.width
                        img.height = pil_img.height
                        
                        ws.add_image(img, f'C{current_row}')
                except Exception as e:
                    print(f'Failed to load image: {e}')
            
            cell = ws.cell(row=current_row, column=3, value='')
            cell.border = thin_border
            cell.alignment = Alignment(horizontal='center', vertical='center')
            
            # Кол-во
            quantity = product['quantity']
            cell = ws.cell(row=current_row, column=4, value=quantity)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(size=9)
            
            # Ед. изм
            cell = ws.cell(row=current_row, column=5, value='шт')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(size=9)
            
            # Цена
            price = int(product['price'].replace(' ', '')) if isinstance(product['price'], str) else product['price']
            cell = ws.cell(row=current_row, column=6, value=price)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            cell.font = Font(size=9)
            
            # Сумма
            sum_price = price * quantity
            equipment_total += sum_price
            cell = ws.cell(row=current_row, column=7, value=sum_price)
            cell.alignment = Alignment(horizontal='right', vertical='center')
            cell.number_format = '#,##0.00'
            cell.border = thin_border
            cell.font = Font(size=9)
            
            current_row += 1
        
        # Монтаж + доставка
        installation_cost = equipment_total * 0.2
        ws.row_dimensions[current_row].height = 20
        
        cell = ws.cell(row=current_row, column=1, value=len(products) + 1)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = thin_border
        cell.font = Font(size=9)
        
        cell = ws.cell(row=current_row, column=2, value='Монтаж + доставка')
        cell.alignment = Alignment(horizontal='left', vertical='center')
        cell.border = thin_border
        cell.font = Font(size=9)
        
        cell = ws.cell(row=current_row, column=3, value='')
        cell.border = thin_border
        
        cell = ws.cell(row=current_row, column=4, value=1)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = thin_border
        cell.font = Font(size=9)
        
        cell = ws.cell(row=current_row, column=5, value='усл')
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = thin_border
        cell.font = Font(size=9)
        
        cell = ws.cell(row=current_row, column=6, value=installation_cost)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.number_format = '#,##0.00'
        cell.border = thin_border
        cell.font = Font(size=9)
        
        cell = ws.cell(row=current_row, column=7, value=installation_cost)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.number_format = '#,##0.00'
        cell.border = thin_border
        cell.font = Font(size=9)
        
        current_row += 1
        
        # Итого
        total_sum = equipment_total + installation_cost
        
        ws.merge_cells(f'F{current_row}:F{current_row}')
        cell = ws.cell(row=current_row, column=6, value='Итого:')
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.font = Font(bold=True, size=10)
        cell.border = Border(top=Side(style='thin'), bottom=Side(style='thin'), left=Side(style='thin'))
        
        cell = ws.cell(row=current_row, column=7, value=total_sum)
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.number_format = '#,##0.00'
        cell.font = Font(bold=True, size=10)
        cell.border = Border(top=Side(style='thin'), bottom=Side(style='thin'), right=Side(style='thin'))
        
        current_row += 2
        
        # Футер с условиями
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок действия коммерческого предложения 15 дней')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок изготовления оборудования 30 дней')
        cell.font = Font(size=9)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 2
        
        # Подпись
        ws.cell(row=current_row, column=1, value='Индивидуальный предприниматель').font = Font(size=9)
        ws.merge_cells(f'E{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=5, value='Пронин Р. О.')
        cell.alignment = Alignment(horizontal='right', vertical='center')
        cell.font = Font(size=9, italic=True)
        
        # Сохранение
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        excel_data = output.read()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="commercial_offer.xlsx"',
                'Access-Control-Allow-Origin': '*'
            },
            'body': base64.b64encode(excel_data).decode('utf-8'),
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