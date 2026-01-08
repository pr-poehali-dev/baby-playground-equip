#!/usr/bin/env python3
"""
Direct Excel parser using pandas.
This script downloads and parses an Excel file from a URL.
"""

import sys

print("Checking dependencies...")
try:
    import pandas as pd
    print("✓ pandas found")
except ImportError:
    print("ERROR: pandas not installed.")
    print("Install with: pip install pandas xlrd")
    sys.exit(1)

try:
    import xlrd
    print("✓ xlrd found")
except ImportError:
    print("ERROR: xlrd not installed (required for .xls files)")
    print("Install with: pip install xlrd")
    sys.exit(1)

print()

# The URL of the Excel file
url = "https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/Благоустройство 26.xls"

print(f"Downloading and parsing Excel file...")
print(f"URL: {url}")
print()

try:
    # Read Excel file directly from URL
    # pandas can read directly from URLs
    df = pd.read_excel(url, engine='xlrd')
    
    print(f"SUCCESS! File parsed successfully.")
    print(f"Total rows: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    print()
    print("Columns found:")
    for i, col in enumerate(df.columns, 1):
        print(f"  {i}. {col}")
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
    
    print()
    print("="*100)
    print(f"TOTAL PRODUCTS EXTRACTED: {product_count}")
    print("="*100)

except Exception as e:
    print(f"ERROR: Failed to parse Excel file")
    print(f"Error message: {e}")
    print()
    import traceback
    print("Full traceback:")
    traceback.print_exc()
    sys.exit(1)
