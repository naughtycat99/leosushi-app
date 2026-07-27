import re

with open('extracted_scripts.js', 'r', encoding='utf-8', errors='ignore') as f:
    legacy_text = f.read()

# Read overrides
with open('js/admin-modern-overrides.js', 'r', encoding='utf-8', errors='ignore') as f:
    overrides = f.read()

# Assemble with IIFE for legacy to prevent global pollution
final_text = f"""
/* ==========================================================================
   ADMIN DASHBOARD BOOTSTRAP (v8 - Secured Encapsulation)
   ========================================================================== */

console.log('💎 Starting Leo Sushi Admin UI...');

// 1. ISOLATED LEGACY ENGINE
(function() {{
    try {{
        console.log('🔄 Loading isolated legacy modules...');
        {legacy_text}
    }} catch (e) {{
        console.warn('⚠️ Legacy isolation caught error (Expected):', e.message);
    }}
}})();

// 2. MODERN UI ENGINE (WINNING OVERRIDES)
{overrides}

console.log('✅ Admin UI Ready.');
"""

with open('js/admin-app.js', 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Restructured admin-app.js v8 (Secured Encapsulation).")
