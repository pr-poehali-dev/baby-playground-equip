import urllib.request
import pandas as pd
import sys
from io import BytesIO

# Download the Excel file
url = "https://cdn.poehali.dev/projects/ffd62df4-6e6a-420c-99f5-4d24cf68fcf3/bucket/Благоустройство 26.xls"

print("Downloading Excel file...")
response = urllib.request.urlopen(url)
file_content = response.read()

print("Parsing Excel file...")
# Try different engines for .xls files
try:
    df = pd.read_excel(BytesIO(file_content), engine='xlrd')
except:
    try:
        df = pd.read_excel(BytesIO(file_content), engine='openpyxl')
    except:
        df = pd.read_excel(BytesIO(file_content))

print(f"\nTotal rows: {len(df)}")
print(f"Columns: {list(df.columns)}")
print("\n" + "="*80)

# Display all products
for idx, row in df.iterrows():
    print(f"\nProduct #{idx + 1}:")
    for col in df.columns:
        value = row[col]
        if pd.notna(value):
            print(f"{col}: {value}")
    print("-" * 80)
