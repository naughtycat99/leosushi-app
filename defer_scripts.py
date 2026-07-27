import os
import re

def defer_scripts():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Add defer to third party scripts
        content = re.sub(
            r'(<script[^>]+src=["\']https://[^"\']+["\'])([^>]*)(>)', 
            lambda m: m.group(0) if 'defer' in m.group(0) else m.group(1) + m.group(2) + ' defer' + m.group(3),
            content,
            flags=re.IGNORECASE
        )

        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Deferred scripts in {file}")

def css_preload():
    # If there are huge CSS files, we can't easily async them without FOUC,
    # but we can add google font preconnect/preload if not there.
    # Google fonts are already preconnected in index.html
    pass

if __name__ == "__main__":
    defer_scripts()
    print("Done adding defer.")
