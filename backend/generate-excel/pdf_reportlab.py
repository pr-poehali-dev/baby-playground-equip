import io
import os
import urllib.request
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Table, TableStyle, Image
from PIL import Image as PILImage


def generate_pdf_reportlab(products, address, installation_percent, installation_cost, delivery_cost, 
                           hide_installation, hide_delivery, kp_number):
    """Генерация PDF с использованием ReportLab (встроенные кириллические шрифты)"""
    
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Регистрируем кириллический шрифт (встроен в reportlab)
    try:
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont
        pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
        font_name = 'HeiseiKakuGo-W5'
    except:
        font_name = 'Helvetica'
    
    y_pos = height - 20*mm
    
    # Логотип
    try:
        logo_url = 'https://cdn.poehali.dev/files/%D0%BB%D0%BE%D0%B3%D0%BE%D0%BA%D0%BF.png'
        req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            logo_data = io.BytesIO(response.read())
            img = PILImage.open(logo_data)
            temp_logo = '/tmp/logo.png'
            img.save(temp_logo, 'PNG')
            c.drawImage(temp_logo, 20*mm, y_pos - 25*mm, width=60*mm, height=30*mm, preserveAspectRatio=True, mask='auto')
    except Exception as e:
        print(f'Logo error: {e}')
    
    # Шапка компании (справа)
    c.setFont(font_name, 11)
    right_x = width - 20*mm
    c.drawRightString(right_x, y_pos, 'ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ')
    y_pos -= 5*mm
    
    c.setFont(font_name, 9)
    c.drawRightString(right_x, y_pos, 'ИНН 110209455200 ОГРНИП 32377460012482')
    y_pos -= 4*mm
    c.drawRightString(right_x, y_pos, '350005, г. Краснодар, ул. Кореновская, д. 57 оф.7')
    y_pos -= 4*mm
    c.drawRightString(right_x, y_pos, 'тел: +7 918 115 15 51 e-mail: info@urban-play.ru')
    y_pos -= 4*mm
    
    c.setFillColor(colors.HexColor('#0563C1'))
    c.drawRightString(right_x, y_pos, 'www.urban-play.ru')
    c.linkURL('https://www.urban-play.ru', (right_x - 50*mm, y_pos - 2*mm, right_x, y_pos + 3*mm))
    c.setFillColor(colors.black)
    y_pos -= 6*mm
    
    # Декоративные линии
    c.setFillColor(colors.HexColor('#44aa02'))
    c.rect(20*mm, y_pos, width - 40*mm, 0.5*mm, fill=1, stroke=0)
    y_pos -= 1*mm
    
    c.setFillColor(colors.HexColor('#58078a'))
    c.rect(20*mm, y_pos, width - 40*mm, 0.5*mm, fill=1, stroke=0)
    c.setFillColor(colors.black)
    y_pos -= 8*mm
    
    # Заголовок КП
    c.setFont(font_name, 14)
    kp_date = datetime.now().strftime("%d.%m.%Y")
    kp_title = f'Коммерческое предложение № {kp_number:04d} от {kp_date}'
    c.drawCentredString(width / 2, y_pos, kp_title)
    y_pos -= 8*mm
    
    # Адрес
    if address:
        c.setFont(font_name, 11)
        c.drawString(20*mm, y_pos, f'Адрес объекта: {address}')
        y_pos -= 8*mm
    
    # Таблица товаров
    table_data = [
        ['№', 'Наименование', 'Рисунок', 'Кол-во', 'Ед. изм', 'Цена, руб', 'Сумма, руб']
    ]
    
    total = 0
    total_product_quantity = sum(p['quantity'] for p in products)
    delivery_per_unit = (delivery_cost / total_product_quantity) if (hide_delivery and delivery_cost > 0 and total_product_quantity > 0) else 0
    installation_percent_multiplier = (installation_percent / 100) if (hide_installation and installation_percent > 0) else 0
    
    for idx, product in enumerate(products, 1):
        base_price = int(product['price'].replace(' ', ''))
        quantity = product['quantity']
        
        price_with_installation = base_price * (1 + installation_percent_multiplier)
        final_price = price_with_installation + delivery_per_unit
        final_sum = final_price * quantity
        total += final_sum
        
        article = product.get('article', '')
        name = product.get('name', '')
        full_name = f"{name}\n{article}" if article else name
        
        # Добавляем изображение если есть
        img_placeholder = ''
        if product.get('image', '').startswith('http'):
            try:
                req = urllib.request.Request(product['image'], headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    img_data = io.BytesIO(response.read())
                    pil_img = PILImage.open(img_data)
                    temp_img = f'/tmp/prod_{idx}.png'
                    pil_img.save(temp_img, 'PNG')
                    img_placeholder = Image(temp_img, width=40*mm, height=20*mm)
            except:
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
    
    # Монтаж
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
    
    # Доставка
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
    
    # Итого
    final_total = total
    if installation_cost > 0 and not hide_installation:
        final_total += installation_cost
    if delivery_cost > 0 and not hide_delivery:
        final_total += delivery_cost
    
    table_data.append([
        '', '', '', '', '', 'Итого:', f'{final_total:,.2f}'.replace(',', ' ')
    ])
    
    # Создаем таблицу
    col_widths = [10*mm, 50*mm, 40*mm, 15*mm, 15*mm, 25*mm, 25*mm]
    
    table = Table(table_data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, -1), font_name, 9),
        ('FONT', (0, 0), (-1, 0), font_name, 10),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D3D3D3')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -2), 0.5, colors.black),
        ('BOX', (5, -1), (-1, -1), 0.5, colors.black),
        ('FONTNAME', (-2, -1), (-1, -1), font_name),
        ('FONTSIZE', (-2, -1), (-1, -1), 10),
    ]))
    
    # Рисуем таблицу
    table.wrapOn(c, width, height)
    table_height = table._height
    table.drawOn(c, 20*mm, y_pos - table_height)
    
    y_pos = y_pos - table_height - 8*mm
    
    # Футер
    c.setFont(font_name, 10)
    c.drawString(20*mm, y_pos, 'Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017')
    y_pos -= 5*mm
    c.drawString(20*mm, y_pos, 'Срок действия коммерческого предложения 15 дней')
    y_pos -= 5*mm
    c.drawString(20*mm, y_pos, 'Срок изготовления оборудования 30 дней')
    y_pos -= 10*mm
    
    # Подпись
    c.drawCentredString(width / 2, y_pos, 'Индивидуальный предприниматель___________________________/Пронин Р.О./')
    
    c.save()
    buffer.seek(0)
    return buffer.read()
