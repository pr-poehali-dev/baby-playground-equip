import io
import os
import urllib.request
import urllib.parse
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Table, TableStyle, Image as RLImage, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from PIL import Image as PILImage


def generate_pdf_reportlab(products, address, installation_percent, installation_cost, delivery_cost, 
                           hide_installation, hide_delivery, kp_number):
    """Генерация PDF с использованием ReportLab (кириллица через DejaVu)"""
    print(f'PDF generation started for {len(products)} products')
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Загружаем шрифт DejaVu Sans для кириллицы
    try:
        # Скачиваем шрифт DejaVu Sans (аналог Calibri)
        font_url = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf'
        req = urllib.request.Request(font_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            font_data = response.read()
            font_path = '/tmp/DejaVuSans.ttf'
            with open(font_path, 'wb') as f:
                f.write(font_data)
        
        pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
        
        # Жирный шрифт
        font_url_bold = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf'
        req_bold = urllib.request.Request(font_url_bold, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_bold, timeout=3) as response:
            font_bold_data = response.read()
            font_bold_path = '/tmp/DejaVuSans-Bold.ttf'
            with open(font_bold_path, 'wb') as f:
                f.write(font_bold_data)
        
        pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_bold_path))
        
        font_name = 'DejaVuSans'
        font_name_bold = 'DejaVuSans-Bold'
    except Exception as e:
        print(f'Font loading error: {e}')
        font_name = 'Helvetica'
        font_name_bold = 'Helvetica-Bold'
    
    y_pos = height - 15*mm
    
    # Логотип (левый верхний угол)
    try:
        logo_url = 'https://cdn.poehali.dev/files/логокп.png'
        parsed = urllib.parse.urlparse(logo_url)
        encoded_path = urllib.parse.quote(parsed.path, safe='/')
        safe_url = urllib.parse.urlunparse((
            parsed.scheme, parsed.netloc, encoded_path,
            parsed.params, parsed.query, parsed.fragment
        ))
        
        req = urllib.request.Request(safe_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as response:
            logo_data = io.BytesIO(response.read())
            pil_logo = PILImage.open(logo_data)
            # Ресайзим для экономии памяти
            pil_logo.thumbnail((180, 90), PILImage.Resampling.LANCZOS)
            temp_logo = '/tmp/logo.png'
            pil_logo.save(temp_logo, 'PNG', optimize=True)
            # Логотип: 180x90 pts (аналог XLSX)
            c.drawImage(temp_logo, 10*mm, y_pos - 22*mm, width=60*mm, height=25*mm, preserveAspectRatio=True, mask='auto')
    except Exception as e:
        print(f'Logo error: {e}')
    
    # Шапка компании (правый верхний угол) - увеличенные интервалы
    c.setFont(font_name_bold, 11)
    right_x = width - 10*mm
    c.drawRightString(right_x, y_pos, 'ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ')
    y_pos -= 5*mm  # Увеличено с 4mm до 5mm
    
    c.setFont(font_name, 11)
    c.drawRightString(right_x, y_pos, 'ИНН 110209455200 ОГРНИП 32377460012482')
    y_pos -= 5*mm  # Увеличено с 4mm до 5mm
    c.drawRightString(right_x, y_pos, '350005, г. Краснодар, ул. Кореновская, д. 57 оф.7')
    y_pos -= 5*mm  # Увеличено с 4mm до 5mm
    c.drawRightString(right_x, y_pos, 'тел: +7 918 115 15 51 e-mail: info@urban-play.ru')
    y_pos -= 5*mm  # Увеличено с 4mm до 5mm
    
    c.setFillColor(colors.HexColor('#59068c'))  # Фиолетовый цвет ссылки
    c.drawRightString(right_x, y_pos, 'www.urban-play.ru')
    c.linkURL('https://www.urban-play.ru', (right_x - 40*mm, y_pos - 2*mm, right_x, y_pos + 3*mm))
    c.setFillColor(colors.black)
    y_pos -= 6*mm  # Уменьшено с 10mm до 6mm - ближе к шапке
    
    # Декоративные линии (салатовая и фиолетовая)
    c.setFillColor(colors.HexColor('#44aa02'))  # Зеленая
    c.rect(10*mm, y_pos, width - 20*mm, 0.7*mm, fill=1, stroke=0)
    y_pos -= 1*mm
    
    c.setFillColor(colors.HexColor('#58078a'))  # Фиолетовая
    c.rect(10*mm, y_pos, width - 20*mm, 0.7*mm, fill=1, stroke=0)
    c.setFillColor(colors.black)
    y_pos -= 10*mm
    
    # Заголовок КП
    c.setFont(font_name_bold, 12)
    kp_date = datetime.now().strftime("%d.%m.%Y")
    kp_title = f'Коммерческое предложение № {kp_number:04d} от {kp_date}'
    c.drawCentredString(width / 2, y_pos, kp_title)
    y_pos -= 10*mm
    
    # Адрес объекта (если указан)
    if address:
        c.setFont(font_name, 11)
        c.drawString(10*mm, y_pos, f'Адрес объекта: {address}')
        y_pos -= 10*mm
    
    # Таблица товаров
    table_data = [
        ['№', 'Наименование', 'Рисунок', 'Кол-во', 'Ед. изм', 'Цена, руб', 'Сумма, руб']
    ]
    
    equipment_total = 0
    total_product_quantity = sum(p['quantity'] for p in products)
    delivery_per_unit = (delivery_cost / total_product_quantity) if (hide_delivery and delivery_cost > 0 and total_product_quantity > 0) else 0
    installation_percent_multiplier = (installation_percent / 100) if (hide_installation and installation_percent > 0) else 0
    
    for idx, product in enumerate(products, 1):
        base_price = int(product['price'].replace(' ', '')) if isinstance(product['price'], str) else product['price']
        quantity = product['quantity']
        
        price_with_installation = base_price * (1 + installation_percent_multiplier)
        final_price = price_with_installation + delivery_per_unit
        final_sum = final_price * quantity
        equipment_total += final_sum
        
        article = product.get('article', '')
        name = product.get('name', '')
        full_name = f"{name}\n{article}" if article else name
        
        # Добавляем изображение если есть
        img_placeholder = ''
        if product.get('image', '').startswith('http'):
            try:
                image_url = product['image']
                parsed = urllib.parse.urlparse(image_url)
                encoded_path = urllib.parse.quote(parsed.path, safe='/')
                safe_url = urllib.parse.urlunparse((
                    parsed.scheme, parsed.netloc, encoded_path,
                    parsed.params, parsed.query, parsed.fragment
                ))
                
                req = urllib.request.Request(safe_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=3) as response:
                    img_data = io.BytesIO(response.read())
                    pil_img = PILImage.open(img_data)
                    # Ресайзим для экономии памяти
                    pil_img.thumbnail((130, 90), PILImage.Resampling.LANCZOS)
                    temp_img = f'/tmp/prod_{idx}.png'
                    pil_img.save(temp_img, 'PNG', optimize=True)
                    img_placeholder = RLImage(temp_img, width=35*mm, height=25*mm)
            except Exception as e:
                print(f'Image {idx} error: {e}')
                img_placeholder = ''
        
        table_data.append([
            str(idx),
            full_name,
            img_placeholder or '',
            str(quantity),
            'шт',
            f'{final_price:,.2f}'.replace(',', ' '),
            f'{final_sum:,.2f}'.replace(',', ' ')
        ])
    
    # Монтаж (если не скрыт)
    if installation_cost > 0 and not hide_installation:
        table_data.append([
            str(len(products) + 1),
            f'Монтаж ({installation_percent}%)',
            '',
            '1',
            'усл',
            f'{installation_cost:,.2f}'.replace(',', ' '),
            f'{installation_cost:,.2f}'.replace(',', ' ')
        ])
    
    # Доставка (если не скрыта)
    if delivery_cost > 0 and not hide_delivery:
        next_num = len(products) + (2 if (installation_cost > 0 and not hide_installation) else 1)
        table_data.append([
            str(next_num),
            'Доставка',
            '',
            '1',
            'усл',
            f'{delivery_cost:,.2f}'.replace(',', ' '),
            f'{delivery_cost:,.2f}'.replace(',', ' ')
        ])
    
    # Итого (с учетом только видимых строк)
    total_sum = equipment_total
    if installation_cost > 0 and not hide_installation:
        total_sum += installation_cost
    if delivery_cost > 0 and not hide_delivery:
        total_sum += delivery_cost
    
    table_data.append([
        '', '', '', '', '', 'Итого', f'{total_sum:,.2f}'.replace(',', ' ')
    ])
    
    # Создаем таблицу с правильными пропорциями (как в XLSX)
    # Колонки: №(4), Наименование(27), Рисунок(20), Кол-во(7), Ед.изм(7), Цена(13), Сумма(14)
    col_widths = [8*mm, 55*mm, 40*mm, 15*mm, 15*mm, 28*mm, 30*mm]
    
    # Отделяем заголовок от данных
    header = table_data[0:1]
    data_rows = table_data[1:-1]  # Все кроме заголовка и итого
    footer = table_data[-1:]  # Строка «Итого»
    
    # Высота одной строки ~25mm (с учётом изображений)
    row_height = 25*mm
    # Для первой страницы оставляем место под футер (60мм), для остальных используем весь лист (15мм отступ)
    first_page_height = y_pos - 60*mm
    next_page_height = height - 15*mm  # На новых страницах начинаем с самого верха
    first_page_rows = int(first_page_height / row_height)
    next_page_rows = int(next_page_height / row_height)
    
    # Функция для отрисовки таблицы на странице
    def draw_table_chunk(chunk_data, y_position, is_first_page=True, is_last_page=False, page_number=1, total_pages=1):
        # Добавляем заголовок на каждую страницу
        chunk_with_header = header + chunk_data
        if is_last_page:
            chunk_with_header += footer
        
        table = Table(chunk_with_header, colWidths=col_widths, rowHeights=None)
        
        style_list = [
            # Шрифты
            ('FONT', (0, 0), (-1, -1), font_name, 10),
            ('FONT', (0, 0), (-1, 0), font_name, 8),  # Заголовки
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#59068c')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ]
        
        # Стиль для итоговой строки
        if is_last_page:
            # Полностью убираем сетку в пустых ячейках (столбцы 0-4) - делаем невидимыми
            for col in range(5):
                style_list.extend([
                    ('INNERGRID', (col, -1), (col, -1), 0, colors.white),
                    ('BOX', (col, -1), (col, -1), 0, colors.white),
                ])
            # Добавляем линию снизу последнего товара (строка перед итогом = -2)
            style_list.extend([
                ('LINEBELOW', (0, -2), (-1, -2), 0.5, colors.black),
            ])
            # Обводим ячейки "Итого" и сумму
            style_list.extend([
                ('BOX', (5, -1), (5, -1), 0.5, colors.black),  # Ячейка "Итого"
                ('BOX', (6, -1), (6, -1), 0.5, colors.black),  # Ячейка с суммой
            ])
        
        table.setStyle(TableStyle(style_list))
        table.wrapOn(c, width, height)
        table_height = table._height
        table.drawOn(c, 10*mm, y_position - table_height)
        
        # Добавляем нумерацию страниц внизу справа
        c.setFont(font_name, 9)
        c.drawRightString(width - 10*mm, 10*mm, f'Страница {page_number} из {total_pages}')
        
        return y_position - table_height
    
    # Рассчитываем общее количество страниц
    total_items = len(data_rows)
    total_pages = 1  # Минимум одна страница
    if total_items > first_page_rows:
        remaining = total_items - first_page_rows
        total_pages += (remaining + next_page_rows - 1) // next_page_rows
    
    # Разбиваем данные на страницы
    current_y = y_pos
    page_num = 0
    
    while data_rows:
        page_num += 1
        is_first = (page_num == 1)
        
        # На первой странице меньше строк, на остальных больше
        rows_to_take = first_page_rows if is_first else next_page_rows
        chunk = data_rows[:rows_to_take]
        data_rows = data_rows[rows_to_take:]
        is_last = (len(data_rows) == 0)
        
        current_y = draw_table_chunk(chunk, current_y, is_first, is_last, page_num, total_pages)
        
        # Если есть ещё данные, создаём новую страницу БЕЗ логотипа
        if data_rows:
            c.showPage()
            # На новой странице начинаем с самого верха
            current_y = height - 5*mm
    
    y_pos = current_y - 10*mm
    
    # Футер с условиями - исходные интервалы
    c.setFont(font_name, 11)
    c.drawString(10*mm, y_pos, 'Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017')
    y_pos -= 5*mm
    c.drawString(10*mm, y_pos, 'Срок действия коммерческого предложения 15 дней')
    y_pos -= 5*mm
    c.drawString(10*mm, y_pos, 'Срок изготовления оборудования 30 дней')
    y_pos -= 12*mm
    
    # Подпись
    c.setFont(font_name, 11)
    c.drawCentredString(width / 2, y_pos, 'Индивидуальный предприниматель___________________________/Пронин Р.О./')
    
    c.save()
    buffer.seek(0)
    pdf_data = buffer.read()
    print(f'PDF generated, size: {len(pdf_data)} bytes')
    return pdf_data