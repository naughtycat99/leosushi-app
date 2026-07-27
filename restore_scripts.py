import re
import os

path = r'd:/jatodemo/leosushi2/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Re-inject scripts if missing
script_imports = """
    <!-- Core External Modules -->
    <script src="js/api.v2.js"></script>
    <script src="js/admin-app.js"></script>
"""
if 'js/admin-app.js' not in content:
    content = content.replace('</body>', script_imports + '</body>')

# 2. Force remove bottom-nav and moreMenu to avoid overlays
content = re.sub(r'<div class="bottom-nav">.*?</div>', '', content, flags=re.DOTALL)
content = re.sub(r'<div id="moreMenu".*?</div>', '', content, flags=re.DOTALL)

# 3. Final safety check on Login Modal visibility
content = content.replace('id="adminLoginModal" class="admin-login-modal"', 'id="adminLoginModal" class="admin-login-modal" style="display: none !important;"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored script imports and removed redundant UI blocks.")
