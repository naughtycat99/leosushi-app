import re
import os

js_path = r'd:/jatodemo/leosushi2/js/admin-app.js'
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove HTML comments <!-- ... -->
content = re.sub(r'<!\s*--.*?--\s*>', '', content, flags=re.DOTALL)

# 2. Remove script tags if any
content = re.sub(r'</?script[^>]*>', '', content)

# 3. Clean up leading/trailing whitespace
content = content.strip()

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("JS Syntax errors (HTML comments) cleaned from admin-app.js")
