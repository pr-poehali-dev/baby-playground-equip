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
import urllib.parse
from PIL import Image as PILImage
import psycopg2

def get_next_kp_number():
    """Получить следующий номер КП из счетчика с автосбросом в начале года"""
    try:
        current_year = datetime.now().year
        database_url = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Получаем текущий счетчик
        cur.execute("SELECT year, counter FROM kp_counter WHERE id = 1")
        row = cur.fetchone()
        
        if row:
            saved_year, counter = row
            # Если год изменился, сбрасываем счетчик
            if saved_year != current_year:
                counter = 0
        else:
            counter = 0
        
        counter += 1
        
        # Обновляем счетчик в базе
        cur.execute(
            "UPDATE kp_counter SET year = %s, counter = %s, updated_at = CURRENT_TIMESTAMP WHERE id = 1",
            (current_year, counter)
        )
        conn.commit()
        
        cur.close()
        conn.close()
        
        return counter
    except Exception as e:
        print(f'Error getting KP number: {e}')
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
        installation_percent = body.get('installationPercent', 0)
        installation_cost = body.get('installationCost', 0)
        delivery_cost = body.get('deliveryCost', 0)
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Коммерческое предложение"
        
        current_row = 1
        
        # Логотип (левый верхний угол)
        try:
            logo_url = 'https://cdn.poehali.dev/files/%D0%BB%D0%BE%D0%B3%D0%BE%D0%BA%D0%BF.png'
            req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                logo_data = response.read()
                
                pil_logo = PILImage.open(io.BytesIO(logo_data))
                pil_logo.thumbnail((180, 90), PILImage.Resampling.LANCZOS)
                
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
        
        # Шапка компании (правый верхний угол) - начинаем с колонки C чтобы было левее
        ws.merge_cells(f'C{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=3, value='ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ')
        cell.font = Font(name='Times New Roman', bold=True, size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        ws.row_dimensions[current_row].height = 15
        current_row += 1
        
        # ИНН и ОГРНИП
        ws.merge_cells(f'C{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=3, value='ИНН 110209455200 ОГРНИП 32377460012482')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        ws.row_dimensions[current_row].height = 15
        current_row += 1
        
        # Адрес
        ws.merge_cells(f'C{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=3, value='350005, г. Краснодар, ул. Кореновская, д. 57 оф.7')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        ws.row_dimensions[current_row].height = 15
        current_row += 1
        
        # Телефон и email
        ws.merge_cells(f'C{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=3, value='тел: +7 918 115 15 51 e-mail: info@urban-play.ru')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        ws.row_dimensions[current_row].height = 15
        current_row += 1
        
        # Сайт
        ws.merge_cells(f'C{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=3, value='www.urban-play.ru')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='right', vertical='center', wrap_text=True)
        ws.row_dimensions[current_row].height = 15
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
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Адрес объекта:')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 2
        
        # Настройка колонок
        ws.column_dimensions['A'].width = 3      # № - 3.00 (26 пикселей)
        ws.column_dimensions['B'].width = 24     # Наименование - 24.00 (173 пикселя)
        ws.column_dimensions['C'].width = 18     # Рисунок - 18.00 (131 пиксель)
        ws.column_dimensions['D'].width = 6      # Кол-во - 6.00 (47 пикселей)
        ws.column_dimensions['E'].width = 6      # Ед. изм - 6.00 (47 пикселей)
        ws.column_dimensions['F'].width = 12     # Цена руб - 12.00 (89 пикселей)
        ws.column_dimensions['G'].width = 14     # Сумма руб - 14.00 (103 пикселя)
        
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
            cell.font = Font(name='Times New Roman', bold=True, size=8)
            cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
            cell.border = thin_border
            cell.fill = PatternFill(start_color='D3D3D3', end_color='D3D3D3', fill_type='solid')
        
        ws.row_dimensions[current_row].height = 30
        current_row += 1
        
        # Товары
        equipment_total = 0
        
        for idx, product in enumerate(products, 1):
            ws.row_dimensions[current_row].height = 75
            
            # №
            cell = ws.cell(row=current_row, column=1, value=idx)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            # Наименование
            article = product.get('article', '')
            name = product.get('name', '')
            full_name = f"{article}\n{name}" if article else name
            cell = ws.cell(row=current_row, column=2, value=full_name)
            cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            # Рисунок
            if product.get('image') and product['image'].startswith('http'):
                try:
                    # Энкодим URL для корректной работы с кириллицей
                    image_url = product['image']
                    
                    # Парсим URL
                    parsed = urllib.parse.urlparse(image_url)
                    # Кодируем путь (path), оставляя / и : безопасными
                    encoded_path = urllib.parse.quote(parsed.path, safe='/')
                    # Собираем URL обратно
                    safe_url = urllib.parse.urlunparse((
                        parsed.scheme, parsed.netloc, encoded_path,
                        parsed.params, parsed.query, parsed.fragment
                    ))
                    
                    req = urllib.request.Request(safe_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        img_data = response.read()
                        
                        pil_img = PILImage.open(io.BytesIO(img_data))
                        original_width, original_height = pil_img.size
                        
                        # Целевые размеры под ячейку
                        target_width = 120
                        target_height = 90
                        
                        # Вычисляем пропорции
                        width_ratio = target_width / original_width
                        height_ratio = target_height / original_height
                        ratio = min(width_ratio, height_ratio)
                        
                        # Новые размеры с сохранением пропорций
                        new_width = int(original_width * ratio)
                        new_height = int(original_height * ratio)
                        
                        # Resize с высоким качеством (LANCZOS для уменьшения, BICUBIC для увеличения)
                        if ratio < 1:
                            pil_img = pil_img.resize((new_width, new_height), PILImage.Resampling.LANCZOS)
                        else:
                            pil_img = pil_img.resize((new_width, new_height), PILImage.Resampling.BICUBIC)
                        
                        img_buffer = io.BytesIO()
                        # Сохраняем в высоком качестве
                        if pil_img.mode == 'RGBA':
                            pil_img.save(img_buffer, format='PNG', compress_level=1)
                        else:
                            rgb_img = pil_img.convert('RGB')
                            rgb_img.save(img_buffer, format='JPEG', quality=95, subsampling=0)
                        img_buffer.seek(0)
                        
                        img = XLImage(img_buffer)
                        img.width = new_width
                        img.height = new_height
                        
                        # Центрируем изображение в ячейке
                        from openpyxl.drawing.spreadsheet_drawing import AnchorMarker, TwoCellAnchor
                        
                        col_width_pixels = 131  # ширина колонки C (18.00 в Excel)
                        row_height_pixels = 100  # высота строки (75 в Excel)
                        
                        offset_x = int((col_width_pixels - new_width) / 2 * 9525)  # EMU
                        offset_y = int((row_height_pixels - new_height) / 2 * 9525)  # EMU
                        
                        # Создаём якорь вручную
                        anchor = TwoCellAnchor()
                        anchor._from = AnchorMarker(col=2, colOff=offset_x, row=current_row-1, rowOff=offset_y)
                        anchor.to = AnchorMarker(col=3, colOff=0, row=current_row, rowOff=0)
                        img.anchor = anchor
                        
                        ws.add_image(img)
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
            cell.font = Font(name='Times New Roman', size=11)
            
            # Ед. изм
            cell = ws.cell(row=current_row, column=5, value='шт')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            # Цена
            price = int(product['price'].replace(' ', '')) if isinstance(product['price'], str) else product['price']
            cell = ws.cell(row=current_row, column=6, value=price)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            # Сумма
            sum_price = price * quantity
            equipment_total += sum_price
            cell = ws.cell(row=current_row, column=7, value=sum_price)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            current_row += 1
        
        # Монтаж
        if installation_cost > 0:
            ws.row_dimensions[current_row].height = 25
            
            cell = ws.cell(row=current_row, column=1, value=len(products) + 1)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=2, value=f'Монтаж ({installation_percent}%)')
            cell.alignment = Alignment(horizontal='left', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=3, value='')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=4, value=1)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=5, value='усл')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=6, value=installation_cost)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=7, value=installation_cost)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            current_row += 1
        
        # Доставка
        if delivery_cost > 0:
            ws.row_dimensions[current_row].height = 25
            
            next_num = len(products) + (2 if installation_cost > 0 else 1)
            cell = ws.cell(row=current_row, column=1, value=next_num)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=2, value='Доставка')
            cell.alignment = Alignment(horizontal='left', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=3, value='')
            cell.border = thin_border
            
            cell = ws.cell(row=current_row, column=4, value=1)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=5, value='усл')
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=6, value=delivery_cost)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            cell = ws.cell(row=current_row, column=7, value=delivery_cost)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell.number_format = '#,##0.00\ ""'
            cell.border = thin_border
            cell.font = Font(name='Times New Roman', size=11)
            
            current_row += 1
        
        # Итого
        total_sum = equipment_total + installation_cost + delivery_cost
        
        # Пустые ячейки с рамками
        for col in range(1, 6):
            cell = ws.cell(row=current_row, column=col, value='')
            cell.border = thin_border
        
        cell = ws.cell(row=current_row, column=6, value='Итого:')
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.font = Font(name='Times New Roman', bold=True, size=11)
        cell.border = thin_border
        
        cell = ws.cell(row=current_row, column=7, value=total_sum)
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.number_format = '#,##0.00\ ""'
        cell.font = Font(name='Times New Roman', bold=True, size=11)
        cell.border = thin_border
        
        current_row += 2
        
        # Футер с условиями
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок действия коммерческого предложения 15 дней')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 1
        
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Срок изготовления оборудования 30 дней')
        cell.font = Font(name='Times New Roman', size=11)
        cell.alignment = Alignment(horizontal='left', vertical='center')
        current_row += 2
        
        # Подпись
        ws.merge_cells(f'A{current_row}:G{current_row}')
        cell = ws.cell(row=current_row, column=1, value='Индивидуальный предприниматель___________________________/Пронин Р.О./')
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.font = Font(name='Times New Roman', size=11)
        
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