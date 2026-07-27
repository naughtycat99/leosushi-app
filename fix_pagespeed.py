import os
from PIL import Image
import re

def update_htaccess():
    htaccess_path = '.htaccess'
    if not os.path.exists(htaccess_path):
        return

    with open(htaccess_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'mod_expires' not in content:
        caching_rules = """

# ======= PERFORMANCE CACHING (Added for SEO) =======
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
"""
        with open(htaccess_path, 'a', encoding='utf-8') as f:
            f.write(caching_rules)
        print("Updated .htaccess with caching rules.")

def add_img_dimensions():
    # Load all image sizes mapping
    assets_dir = 'assets'
    dimensions = {}
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                try:
                    with Image.open(os.path.join(assets_dir, f)) as img:
                        dimensions[f"assets/{f}"] = img.size # (width, height)
                except Exception:
                    pass

    # Special case, if logo.png is requested but we only have it in assets/logo.png
    try:
        with Image.open(os.path.join(assets_dir, 'logo.png')) as img:
            dimensions['assets/logo.png'] = img.size
    except:
        pass

    target_files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in target_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Regex to find img tags
        # <img src="assets/..." alt="..." >
        def repl(match):
            img_tag = match.group(0)
            # If it already has width or height, skip
            if ' width=' in img_tag or ' height=' in img_tag:
                return img_tag
            
            # Find the src
            src_match = re.search(r'src=["\']([^"\']+)["\']', img_tag)
            if src_match:
                src = src_match.group(1)
                # Unquote URL spaces if any
                src_key = src.replace('%20', ' ')
                if src_key in dimensions:
                    w, h = dimensions[src_key]
                    # Insert width and height before closing bracket
                    # Be careful if there is a trailing slash
                    if img_tag.endswith('/>'):
                        return img_tag[:-2] + f' width="{w}" height="{h}" />'
                    elif img_tag.endswith('>'):
                        return img_tag[:-1] + f' width="{w}" height="{h}">'
            return img_tag
            
        content = re.sub(r'<img\s+[^>]+>', repl, content)
        
        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Added dimensions to: {file}")

if __name__ == "__main__":
    update_htaccess()
    add_img_dimensions()
    print("Done optimizing CLS and Caching.")
