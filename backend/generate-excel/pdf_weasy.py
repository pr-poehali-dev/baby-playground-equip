import io
import os
from datetime import datetime
from weasyprint import HTML, CSS


def generate_pdf_weasy(products, address, installation_percent, installation_cost, delivery_cost, 
                       hide_installation, hide_delivery, kp_number):
    """Генерация PDF через HTML с использованием WeasyPrint (поддержка кириллицы)"""
    
    kp_date = datetime.now().strftime("%d.%m.%Y")
    
    # Считаем итоги
    total = 0
    product_rows = []
    
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
        full_name = f"{name}<br><small style='color: #666; font-size: 9px;'>{article}</small>" if article else name
        
        product_rows.append(f"""
        <tr>
            <td style="text-align: center;">{idx}</td>
            <td>{full_name}</td>
            <td style="text-align: center;">
                {f'<img src="{product["image"]}" style="max-width: 100px; max-height: 60px; object-fit: contain;" />' if product.get('image', '').startswith('http') else ''}
            </td>
            <td style="text-align: center;">{quantity}</td>
            <td style="text-align: center;">шт</td>
            <td style="text-align: right;">{final_price:,.2f}</td>
            <td style="text-align: right;">{final_sum:,.2f}</td>
        </tr>
        """)
    
    # Монтаж
    installation_row = ""
    if installation_cost > 0 and not hide_installation:
        installation_row = f"""
        <tr>
            <td style="text-align: center;">{len(products) + 1}</td>
            <td>Монтаж ({installation_percent}%)</td>
            <td></td>
            <td style="text-align: center;">1</td>
            <td style="text-align: center;">усл</td>
            <td style="text-align: right;">{installation_cost:,.2f}</td>
            <td style="text-align: right;">{installation_cost:,.2f}</td>
        </tr>
        """
    
    # Доставка
    delivery_row = ""
    if delivery_cost > 0 and not hide_delivery:
        next_num = len(products) + (2 if (installation_cost > 0 and not hide_installation) else 1)
        delivery_row = f"""
        <tr>
            <td style="text-align: center;">{next_num}</td>
            <td>Доставка</td>
            <td></td>
            <td style="text-align: center;">1</td>
            <td style="text-align: center;">усл</td>
            <td style="text-align: right;">{delivery_cost:,.2f}</td>
            <td style="text-align: right;">{delivery_cost:,.2f}</td>
        </tr>
        """
    
    # Итого
    final_total = total
    if installation_cost > 0 and not hide_installation:
        final_total += installation_cost
    if delivery_cost > 0 and not hide_delivery:
        final_total += delivery_cost
    
    address_row = f"<p style='margin: 5px 0 15px 0;'><strong>Адрес объекта:</strong> {address}</p>" if address else ""
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{
                size: A4;
                margin: 0.5cm;
            }}
            body {{
                font-family: 'DejaVu Sans', Arial, sans-serif;
                font-size: 11px;
                line-height: 1.4;
                color: #000;
                margin: 0;
                padding: 10px;
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
            }}
            .header-left {{
                width: 30%;
            }}
            .header-right {{
                width: 68%;
                text-align: right;
                font-size: 10px;
            }}
            .header-right strong {{
                font-size: 11px;
            }}
            .logo {{
                max-width: 180px;
                max-height: 90px;
                object-fit: contain;
            }}
            .decorative-line {{
                height: 2px;
                margin: 2px 0;
            }}
            .green-line {{
                background-color: #44aa02;
            }}
            .purple-line {{
                background-color: #58078a;
            }}
            h1 {{
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin: 10px 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }}
            th {{
                background-color: #D3D3D3;
                border: 1px solid #000;
                padding: 4px;
                font-size: 10px;
                font-weight: bold;
                text-align: center;
            }}
            td {{
                border: 1px solid #000;
                padding: 4px;
                font-size: 10px;
            }}
            .total-row {{
                font-weight: bold;
            }}
            .footer {{
                margin-top: 15px;
                font-size: 10px;
            }}
            .footer p {{
                margin: 3px 0;
            }}
            .signature {{
                text-align: center;
                margin-top: 20px;
            }}
            a {{
                color: #0563C1;
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-left">
                <img src="https://cdn.poehali.dev/files/%D0%BB%D0%BE%D0%B3%D0%BE%D0%BA%D0%BF.png" class="logo" alt="Logo" />
            </div>
            <div class="header-right">
                <strong>ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ</strong><br>
                ИНН 110209455200 ОГРНИП 32377460012482<br>
                350005, г. Краснодар, ул. Кореновская, д. 57 оф.7<br>
                тел: +7 918 115 15 51 e-mail: info@urban-play.ru<br>
                <a href="https://www.urban-play.ru">www.urban-play.ru</a>
            </div>
        </div>
        
        <div class="decorative-line green-line"></div>
        <div class="decorative-line purple-line"></div>
        
        <h1>Коммерческое предложение № {kp_number:04d} от {kp_date}</h1>
        
        {address_row}
        
        <table>
            <thead>
                <tr>
                    <th style="width: 4%;">№</th>
                    <th style="width: 27%;">Наименование</th>
                    <th style="width: 20%;">Рисунок</th>
                    <th style="width: 7%;">Кол-во</th>
                    <th style="width: 7%;">Ед. изм</th>
                    <th style="width: 13%;">Цена, руб</th>
                    <th style="width: 14%;">Сумма, руб</th>
                </tr>
            </thead>
            <tbody>
                {''.join(product_rows)}
                {installation_row}
                {delivery_row}
                <tr class="total-row">
                    <td colspan="6" style="text-align: right;">Итого:</td>
                    <td style="text-align: right;">{final_total:,.2f}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="footer">
            <p>Оборудование имеет сертификат соответствия ТС ЕАЭС 042-2017</p>
            <p>Срок действия коммерческого предложения 15 дней</p>
            <p>Срок изготовления оборудования 30 дней</p>
        </div>
        
        <div class="signature">
            Индивидуальный предприниматель___________________________/Пронин Р.О./
        </div>
    </body>
    </html>
    """
    
    pdf_bytes = HTML(string=html_content).write_pdf()
    return pdf_bytes
