import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def handler(event, context):
    """Отправка заказа на email info@urban-play.ru"""
    
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
        
        order_number = body.get('orderNumber', 'N/A')
        customer_name = body.get('name', '')
        customer_phone = body.get('phone', '')
        customer_email = body.get('email', '')
        customer_address = body.get('address', '')
        legal_status = body.get('legalStatus', '')
        comment = body.get('comment', '')
        cart_items = body.get('cartItems', [])
        total = body.get('total', 0)
        installation_cost = body.get('installationCost', 0)
        delivery_cost = body.get('deliveryCost', 0)
        grand_total = body.get('grandTotal', 0)
        
        # Формируем HTML письмо
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
                h1 {{ color: #44aa02; border-bottom: 2px solid #44aa02; padding-bottom: 10px; }}
                h2 {{ color: #58078a; margin-top: 20px; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #f4f4f4; font-weight: bold; }}
                .total-row {{ font-weight: bold; background-color: #f9f9f9; }}
                .info-block {{ background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .label {{ font-weight: bold; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Новый заказ #{order_number}</h1>
                
                <h2>Информация о клиенте</h2>
                <div class="info-block">
                    <p><span class="label">Имя:</span> {customer_name}</p>
                    <p><span class="label">Телефон:</span> {customer_phone}</p>
                    <p><span class="label">Email:</span> {customer_email}</p>
                    <p><span class="label">Адрес доставки:</span> {customer_address}</p>
                    <p><span class="label">Правовой статус:</span> {legal_status}</p>
                    {f'<p><span class="label">Комментарий:</span> {comment}</p>' if comment else ''}
                </div>
                
                <h2>Состав заказа</h2>
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Наименование</th>
                            <th>Артикул</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Сумма</th>
                        </tr>
                    </thead>
                    <tbody>
        """
        
        for idx, item in enumerate(cart_items, 1):
            item_name = item.get('name', '')
            item_article = item.get('article', 'Н/Д')
            item_price = item.get('price', 0)
            item_quantity = item.get('quantity', 0)
            
            # Конвертируем цену в число
            if isinstance(item_price, str):
                # Удаляем все символы кроме цифр
                item_price = int(''.join(filter(str.isdigit, item_price)) or '0')
            elif not isinstance(item_price, int):
                item_price = 0
            
            item_sum = item_price * item_quantity
            
            html_content += f"""
                        <tr>
                            <td>{idx}</td>
                            <td>{item_name}</td>
                            <td>{item_article}</td>
                            <td>{item_price:,} ₽</td>
                            <td>{item_quantity}</td>
                            <td>{item_sum:,} ₽</td>
                        </tr>
            """
        
        html_content += """
                    </tbody>
                </table>
                
                <h2>Итого</h2>
                <table>
                    <tbody>
        """
        
        html_content += f"""
                        <tr>
                            <td class="label">Сумма товаров:</td>
                            <td style="text-align: right;">{total:,} ₽</td>
                        </tr>
        """
        
        if installation_cost > 0:
            html_content += f"""
                        <tr>
                            <td class="label">Монтаж:</td>
                            <td style="text-align: right;">{installation_cost:,} ₽</td>
                        </tr>
            """
        
        if delivery_cost > 0:
            html_content += f"""
                        <tr>
                            <td class="label">Доставка:</td>
                            <td style="text-align: right;">{delivery_cost:,} ₽</td>
                        </tr>
            """
        
        html_content += f"""
                        <tr class="total-row">
                            <td class="label">ИТОГО:</td>
                            <td style="text-align: right; font-size: 18px; color: #44aa02;">{grand_total:,} ₽</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        """
        
        # Получаем SMTP настройки из переменных окружения
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
        smtp_port_str = os.environ.get('SMTP_PORT', '587')
        # Безопасно конвертируем порт
        try:
            smtp_port = int(''.join(filter(str.isdigit, smtp_port_str)) or '587')
        except:
            smtp_port = 587
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not smtp_user or not smtp_password:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'SMTP credentials not configured'})
            }
        
        # Создаем письмо
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новый заказ #{order_number} от {customer_name}'
        msg['From'] = smtp_user
        msg['To'] = 'info@urban-play.ru'
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Отправляем письмо
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'})
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