import io
import urllib.request
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def register_cyrillic_font():
    """Загрузка и регистрация шрифта с поддержкой кириллицы"""
    try:
        # Скачиваем шрифт DejaVu Sans из CDN
        font_url = 'https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans.ttf'
        font_bold_url = 'https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans-Bold.ttf'
        
        # Загружаем обычный шрифт
        req = urllib.request.Request(font_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            font_data = io.BytesIO(response.read())
            pdfmetrics.registerFont(TTFont('DejaVuSans', font_data))
        
        # Загружаем жирный шрифт
        req_bold = urllib.request.Request(font_bold_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_bold, timeout=10) as response:
            font_bold_data = io.BytesIO(response.read())
            pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_bold_data))
        
        return 'DejaVuSans', 'DejaVuSans-Bold'
    except Exception as e:
        print(f'Failed to load DejaVu fonts: {e}')
        return 'Helvetica', 'Helvetica-Bold'
