#!/usr/bin/env python3
"""
Download and install DejaVuSans.ttf font file
"""
import subprocess
import os
import sys

def download_font():
    # Create fonts directory
    fonts_dir = "backend/generate-excel/fonts"
    os.makedirs(fonts_dir, exist_ok=True)
    
    font_path = os.path.join(fonts_dir, "DejaVuSans.ttf")
    
    # Try different URLs
    urls = [
        "https://github.com/senotrusov/dejavu-fonts-ttf/raw/master/ttf/DejaVuSans.ttf",
        "https://github.com/prawnpdf/prawn/raw/master/data/fonts/DejaVuSans.ttf",
        "https://raw.githubusercontent.com/matomo-org/travis-scripts/master/fonts/DejaVuSans.ttf",
    ]
    
    for url in urls:
        print(f"\nAttempting to download from: {url}")
        
        try:
            # Use curl with follow redirects
            result = subprocess.run(
                ["curl", "-L", "-o", font_path, url],
                capture_output=True,
                timeout=30
            )
            
            if result.returncode == 0:
                # Verify file exists and has reasonable size
                if os.path.exists(font_path):
                    size = os.path.getsize(font_path)
                    if size > 10000:  # Valid font should be > 10KB
                        print(f"✓ Download successful!")
                        print(f"\n{'='*70}")
                        print(f"  FONT DOWNLOADED SUCCESSFULLY")
                        print(f"{'='*70}")
                        print(f"  Source URL: {url}")
                        print(f"  Saved to: {os.path.abspath(font_path)}")
                        print(f"  File size: {size:,} bytes ({size / 1024:.2f} KB)")
                        print(f"{'='*70}")
                        return True
                    else:
                        print(f"✗ Downloaded file too small ({size} bytes)")
                        os.remove(font_path)
            else:
                print(f"✗ Download failed with code {result.returncode}")
                
        except subprocess.TimeoutExpired:
            print(f"✗ Download timed out")
        except Exception as e:
            print(f"✗ Error: {e}")
    
    print(f"\n❌ All download attempts failed!")
    return False

if __name__ == "__main__":
    success = download_font()
    sys.exit(0 if success else 1)
