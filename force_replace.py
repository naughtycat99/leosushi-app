import os
import re

def force_replace():
    assets_dir = 'assets'
    webp_files = [f for f in os.listdir(assets_dir) if f.endswith('.webp')]
    
    target_extensions = ('.html', '.css', '.js')
    
    for filename in os.listdir('.'):
        if filename.endswith(target_extensions):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            for webp in webp_files:
                base = webp[:-5]
                if base == 'logo':
                    # Do not replace logo.png or logo.jpg
                    continue
                # Replace any reference to base.png, base.jpg, base.jpeg
                content = re.sub(
                    r'(assets/)' + re.escape(base) + r'\.(png|jpg|jpeg)', 
                    r'\g<1>' + base + '.webp', 
                    content,
                    flags=re.IGNORECASE
                )
                
            if content != original_content:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Force-updated webp references in {filename}")

if __name__ == '__main__':
    force_replace()
    print("Done force replacing.")
