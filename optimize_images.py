import os
from PIL import Image

def optimize_images(assets_dir):
    print("Optimizing images in", assets_dir)
    
    for filename in os.listdir(assets_dir):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue
            
        filepath = os.path.join(assets_dir, filename)
        name, ext = os.path.splitext(filename)
        webp_path = os.path.join(assets_dir, f"{name}.webp")
        
        # Skip if webp already exists
        if os.path.exists(webp_path):
            continue
            
        try:
            with Image.open(filepath) as img:
                print(f"Processing: {filename} (Original size: {img.size})")
                
                # Convert to RGB if it has alpha and we are saving to a format that doesn't support it, 
                # but WebP supports alpha, so we just ensure it's in a good mode.
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img = img.convert('RGBA')
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if > 1920 width
                MAX_WIDTH = 1920
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                    print(f"  -> Resized to {img.size}")
                
                # Save as webp
                img.save(webp_path, 'WEBP', quality=85, method=6)
                
                old_size = os.path.getsize(filepath) / (1024 * 1024)
                new_size = os.path.getsize(webp_path) / (1024 * 1024)
                print(f"  -> Saved as {name}.webp | Size dropped from {old_size:.2f}MB to {new_size:.2f}MB")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    assets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
    optimize_images(assets_dir)
    print("Optimization complete!")
