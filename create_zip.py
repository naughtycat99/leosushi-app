import os
import zipfile

def make_zip():
    zip_name = 'SEO_Update_Pack.zip'
    files_to_zip = [
        'datenschutz.html',
        'flyer-rabatt.html',
        'index.html',
        'menu.html',
        'my-orders.html',
        'profile.html',
        'qr-google-review.html',
        'robots.txt',
        'sitemap.xml',
        'googlec670091965a27d1b.html',
        '.htaccess'
    ]
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in files_to_zip:
            if os.path.exists(f):
                zf.write(f, f)
                
        # Handle js/script.js because it might be in root or in js/ directory
        # Previously we updated script.js in root
        if os.path.exists('script.js'):
            zf.write('script.js', 'script.js')
        elif os.path.exists('js/script.js'):
            # Just in case
            zf.write('js/script.js', 'js/script.js')

        # Add all webp images preserving assets/ folder
        assets_dir = 'assets'
        if os.path.exists(assets_dir):
            for filename in os.listdir(assets_dir):
                if filename.endswith('.webp'):
                    file_path = os.path.join(assets_dir, filename)
                    zf.write(file_path, file_path) # the arcname will be 'assets/filename.webp'

if __name__ == '__main__':
    make_zip()
    print("Zip created successfully with preserved paths!")
