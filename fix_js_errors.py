import re

path = r'd:/jatodemo/leosushi2/js/admin-app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Change "const switchTab = window.switchTab;" to "var switchTab = window.switchTab;" 
# (const can't be redeclared, var can)
content = content.replace('const switchTab = window.switchTab;', '// switchTab is defined via window.switchTab above')

# Fix 2: Change duplicate "function switchTab(tabId) {" to be assignments instead
# We need to rename the 2nd and 3rd declarations to avoid conflicts
# Strategy: replace "function switchTab(" with window assignment pattern

lines = content.split('\n')
switch_tab_count = 0
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith('function switchTab(') or stripped.startswith('function switchTab ('):
        switch_tab_count += 1
        if switch_tab_count > 1:
            # Replace this duplicate with a comment
            lines[i] = line.replace('function switchTab(', '/* DUPLICATE REMOVED */ window.switchTab = function(')

# Also check for other common duplicate function declarations
content = '\n'.join(lines)

# Fix 3: Remove any remaining HTML-like comments that could break JS
content = re.sub(r'^\s*<\s*!--.*?--\s*>\s*$', '', content, flags=re.MULTILINE)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed! switchTab declarations found: {switch_tab_count}")
print("Running syntax check...")

import subprocess
result = subprocess.run(['node', '-c', path], capture_output=True, text=True)
if result.returncode == 0:
    print("✅ NO SYNTAX ERRORS!")
else:
    # Show the error
    print(f"❌ Error: {result.stderr[:500]}")
