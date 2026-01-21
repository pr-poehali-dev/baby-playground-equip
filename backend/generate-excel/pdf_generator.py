import io
import urllib.request
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def generate_pdf(products, address, installation_percent, installation_cost, delivery_cost, 
                 hide_installation, hide_delivery, kp_number):
    """Генерация PDF файла коммерческого предложения"""
    
    # Регистрируем шрифт DejaVu для кириллицы
    try:
        pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
        pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
        font_name = 'DejaVuSans'
        font_name_bold = 'DejaVuSans-Bold'
    except:
        # Fallback на стандартные шрифты
        font_name = 'Helvetica'
        font_name_bold = 'Helvetica-Bold'
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                           rightMargin=15*mm, leftMargin=15*mm,
                           topMargin=10*mm, bottomMargin=15*mm)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Стили текста
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=14,
        textColor=colors.black,
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName=font_name_bold
    )
    
    company_style = ParagraphStyle(
        'Company',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_RIGHT,
        fontName=font_name
    )
    
    # Логотип
    try:
        logo_url = 'https://cdn.poehali.dev/files/%D0%BB%D0%BE%D0%B3%D0%BE%D0%BA%D0%BF.png'
        req = urllib.request.Request(logo_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            logo_data = io.BytesIO(response.read())
            logo = Image(logo_data, width=60*mm, height=30*mm)
            
            # Таблица для размещения логотипа и информации о компании
            company_info = [
                ['<b>ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ</b>'],
                ['ИНН 110209455200 ОГРНИП 32377460012482'],
                ['350005, г. Краснодар, ул. Кореновская, д. 57 оф.7'],
                ['тел: +7 918 115 15 51'],
                ['e-mail: info@urban-play.ru'],
                ['<a href="https://www.urban-play.ru">www.urban-play.ru</a>']
            ]
            
            company_paras = [[Paragraph(line[0], company_style)] for line in company_info]
            
            header_table = Table([[logo, company_paras]], colWidths=[70*mm, 110*mm])
            header_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (0, 0), (0, 0), 'LEFT'),
                ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ]))
            story.append(header_table)
    except Exception as e:
        print(f'Failed to load logo for PDF: {e}')
    
    story.append(Spacer(1, 5*mm))
    
    # Декоративные линии
    line_table = Table([[''], ['']], colWidths=[180*mm], rowHeights=[1*mm, 1*mm])
    line_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#44aa02')),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#58078a')),
    ]))
    story.append(line_table)
    story.append(Spacer(1, 5*mm))
    
    # Заголовок КП
    kp_date = datetime.now().strftime("%d.%m.%Y")
    title_text = f'Коммерческое предложение № {kp_number:04d} от {kp_date}'
    story.append(Paragraph(title_text, title_style))
    story.append(Spacer(1, 5*mm))
    
    # Адрес объекта
    if address:
        address_style = ParagraphStyle('Address', parent=styles['Normal'], fontSize=10)
        story.append(Paragraph(f'<b>Адрес объекта:</b> {address}', address_style))
        story.append(Spacer(1, 5*mm))
    
    # Таблица товаров
    table_data = [['№', 'Артикул', 'Наименование', 'Цена, ₽', 'Кол-во', 'Сумма, ₽']]
    
    total = 0
    for idx, product in enumerate(products, 1):
        price = int(product['price'].replace(' ', ''))
        quantity = product['quantity']
        
        # Корректировка цены если монтаж/доставка включены
        if hide_installation:
            price = int(price * (1 + installation_percent / 100))
        if hide_delivery:
            price = int(price + delivery_cost / len(products))
        
        sum_price = price * quantity
        total += sum_price
        
        table_data.append([
            str(idx),
            product.get('article', ''),
            product['name'],
            f"{price:,}".replace(',', ' '),
            str(quantity),
            f"{sum_price:,}".replace(',', ' ')
        ])
    
    # Итого
    table_data.append(['', '', '', '', 'Итого:', f"{total:,}".replace(',', ' ')])
    
    # Монтаж
    if not hide_installation and installation_cost > 0:
        table_data.append(['', '', '', '', f'Монтаж ({installation_percent}%):', f"{installation_cost:,}".replace(',', ' ')])
        total += installation_cost
    
    # Доставка
    if not hide_delivery and delivery_cost > 0:
        table_data.append(['', '', '', '', 'Доставка:', f"{delivery_cost:,}".replace(',', ' ')])
        total += delivery_cost
    
    # Всего
    table_data.append(['', '', '', '', 'Всего:', f"{total:,}".replace(',', ' ')])
    
    # Создание таблицы
    col_widths = [10*mm, 25*mm, 70*mm, 25*mm, 15*mm, 25*mm]
    product_table = Table(table_data, colWidths=col_widths)
    product_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#44aa02')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), font_name),
        ('FONTNAME', (0, 0), (-1, 0), font_name_bold),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, -1), (-1, -1), font_name_bold),
        ('FONTNAME', (0, -2), (-1, -2), font_name_bold),
        ('FONTNAME', (0, -3), (-1, -3), font_name_bold),
    ]))
    
    story.append(product_table)
    
    # Генерация PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.read()