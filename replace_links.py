import os
import re

def update_files():
    # 1. Gather all webp files in assets/
    assets_dir = 'assets'
    webp_files = [f for f in os.listdir(assets_dir) if f.endswith('.webp')]
    
    # Create mapping: original -> new
    mapping = {}
    for webp in webp_files:
        base = webp[:-5]
        # Check if png or jpg exists
        for ext in ['.png', '.jpg', '.jpeg']:
            orig = base + ext
            if os.path.exists(os.path.join(assets_dir, orig)):
                mapping[orig] = webp
                # Also handle URL encoded spaces which might appear in HTML
                mapping[orig.replace(' ', '%20')] = webp.replace(' ', '%20')
                
    # We should not replace logo.png or AppIcons if they are meant to be kept PNG for manifest/favicon.
    # Usually logo is fine for webp in <img>, but for <link rel="icon"> it needs PNG sometimes (though modern browsers support webp favicon).
    # Let's skip logo just to be safe.
    if 'logo.png' in mapping:
        del mapping['logo.png']

    target_extensions = ('.html', '.css', '.js')
    
    for filename in os.listdir('.'):
        if filename.endswith(target_extensions):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # Replace file extensions
            for orig, new_webp in mapping.items():
                content = content.replace(f"assets/{orig}", f"assets/{new_webp}")
                
            # Add lazy loading to <img> tags in HTML if they don't have loading="eager"
            if filename.endswith('.html'):
                # Very basic approach: add loading="lazy" if not present and no eager
                # We specifically find <img ...>
                def insert_lazy(match):
                    img_tag = match.group(0)
                    if 'loading=' not in img_tag:
                        # Insert before closing >
                        return img_tag[:-1] + ' loading="lazy">'
                    return img_tag
                
                content = re.sub(r'<img\s+[^>]*>', insert_lazy, content)

            if content != original_content:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filename}")

if __name__ == '__main__':
    update_files()
    print("Done updating links.")
