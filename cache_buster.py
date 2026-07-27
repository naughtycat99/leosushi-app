import os
import re

def cache_bust():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    version_id = 'v=20260408'
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Replace script.js -> script.js?v=...
        content = re.sub(
            r'src=["\'](js/)?(script\.js)(?:\?v=[a-z0-9]+)?["\']', 
            rf'src="\1\2?{version_id}"', 
            content
        )
        
        # Replace styles
        content = re.sub(
            r'href=["\'](styles\.css|styles-luxe\.css|menu-order\.css|mobile-app\.css|mobile-app-fixes\.css)(?:\?v=[a-z0-9]+)?["\']', 
            lambda m: f'href="{m.group(1)}?{version_id}"', 
            content
        )
        # Also handle css/ folder
        content = re.sub(
            r'href=["\']css/(mobile-app\.css|mobile-app-fixes\.css)(?:\?v=[a-z0-9]+)?["\']', 
            lambda m: f'href="css/{m.group(1)}?{version_id}"', 
            content
        )

        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added cache busting to {file}")

if __name__ == "__main__":
    cache_bust()
