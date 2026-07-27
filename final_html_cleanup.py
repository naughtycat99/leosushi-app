import re
import os

path = r'd:/jatodemo/leosushi2/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Identify the bottom scripts (the ones we WANT to keep)
bottom_scripts_pattern = r'(<!-- Core External Modules -->.*?</body>)'
match = re.search(bottom_scripts_pattern, content, re.DOTALL)
bottom_scripts = match.group(1) if match else ""

# 2. Divide into pre-bottom and bottom
pre_bottom = content[:content.find('<!-- Core External Modules -->')] if bottom_scripts else content

# 3. Strip ALL <script> tags from pre_bottom
cleaned_pre_bottom = re.sub(r'<script.*?>.*?</script>', '', pre_bottom, flags=re.DOTALL)

# 4. Reconstruct
final_content = cleaned_pre_bottom + bottom_scripts

with open(path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully purged internal scripts from reconstituted admin.html")
