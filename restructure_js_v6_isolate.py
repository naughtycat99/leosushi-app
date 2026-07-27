import re

# 1. Read original
with open('extracted_scripts.js', 'r', encoding='utf-8', errors='ignore') as f:
    legacy_text = f.read()

# 2. Read overrides
with open('js/admin-modern-overrides.js', 'r', encoding='utf-8', errors='ignore') as f:
    overrides = f.read()

# 3. Clean legacy
legacy_text = re.sub(r'\bconst\s+', 'var ', legacy_text)
legacy_text = re.sub(r'\blet\s+', 'var ', legacy_text)
legacy_text = re.sub(r'\basync\s+function\s+([a-zA-Z0-9_]+)\s*\(', r'var \1 = async function(', legacy_text)
legacy_text = re.sub(r'(?<!var\s)([a-zA-Z0-9_]+\s*=\s*)?function\s+([a-zA-Z0-9_]+)\s*\(', r'var \2 = function(', legacy_text)

# 4. Wrap Legacy in Try-Catch to prevent script termination on runtime errors
final_text = f"""
try {{
    console.log('📜 Initializing Legacy Admin Logic...');
    {legacy_text}
}} catch (e) {{
    console.error('⚠️ Legacy Logic Runtime Error (Handled):', e);
}}

/* ========================================================================== */

{overrides}

console.log('✅ Admin App Hybrid Bootstrapped successfully.');
"""

with open('js/admin-app.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Restructured admin-app.js with Error Isolation.")
