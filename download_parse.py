#!/usr/bin/env python3
import urllib.request
import sys

# Try to import pandas, if not available, use xlrd directly
try:
    import pandas as pd
    USE_PANDAS = True
except ImportError:
    USE_PANDAS = False
    try:
        import xlrd
    except ImportError:
        print("ERROR: Neither pandas nor xlrd is installed. Please install one of them:")
        print("  pip install pandas xlrd")
        print("  or")
        print("  pip install xlrd")
        sys.exit(1)

from io import BytesIO

# Download the Excel file
url = "https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/Благоустройство 26.xls"

print("Downloading Excel file from:")
print(url)
print()

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, timeout=60)
    file_content = response.read()
    print(f"Downloaded {len(file_content)} bytes")
    print()
except Exception as e:
    print(f"ERROR downloading file: {e}")
    sys.exit(1)

# Parse the Excel file
print("Parsing Excel file...")
print()

if USE_PANDAS:
    try:
        df = pd.read_excel(BytesIO(file_content), engine='xlrd')
        
        print(f"Total rows found: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print()
        print("="*100)
        print()
        
        # Display all products
        product_count = 0
        for idx, row in df.iterrows():
            has_data = False
            output_lines = []
            
            for col in df.columns:
                value = row[col]
                if pd.notna(value) and str(value).strip():
                    has_data = True
                    col_name = str(col).strip()
                    val_str = str(value).strip()
                    output_lines.append(f"{col_name}: {val_str}")
            
            if has_data:
                product_count += 1
                print(f"Product #{product_count}:")
                for line in output_lines:
                    print(line)
                print("-" * 100)
                print()
        
        print(f"\nTotal products extracted: {product_count}")
        
    except Exception as e:
        print(f"ERROR parsing Excel file with pandas: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
else:
    try:
        workbook = xlrd.open_workbook(file_contents=file_content)
        sheet = workbook.sheet_by_index(0)
        
        print(f"Total rows found: {sheet.nrows}")
        print(f"Total columns: {sheet.ncols}")
        print()
        
        # Get headers from first row
        headers = []
        for col_idx in range(sheet.ncols):
            cell_value = sheet.cell_value(0, col_idx)
            headers.append(str(cell_value).strip() if cell_value else f"Column_{col_idx}")
        
        print(f"Headers: {headers}")
        print()
        print("="*100)
        print()
        
        # Display all products (starting from row 1, assuming row 0 is headers)
        product_count = 0
        for row_idx in range(1, sheet.nrows):
            has_data = False
            output_lines = []
            
            for col_idx in range(sheet.ncols):
                cell_value = sheet.cell_value(row_idx, col_idx)
                if cell_value and str(cell_value).strip():
                    has_data = True
                    header = headers[col_idx]
                    val_str = str(cell_value).strip()
                    output_lines.append(f"{header}: {val_str}")
            
            if has_data:
                product_count += 1
                print(f"Product #{product_count}:")
                for line in output_lines:
                    print(line)
                print("-" * 100)
                print()
        
        print(f"\nTotal products extracted: {product_count}")
        
    except Exception as e:
        print(f"ERROR parsing Excel file with xlrd: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
