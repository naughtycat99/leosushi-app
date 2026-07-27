import re
import os

html_path = r'd:/jatodemo/leosushi2/admin.html'
js_path = r'd:/jatodemo/leosushi2/js/admin-app.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Strip all internal scripts from HTML and move to JS if not already there
# (We assume admin-app.js is the target)
# But first, let's clean the HTML from the old scripts I saw around line 6000
new_html = re.sub(r'<script>(.*?)<\/script>', '', html, flags=re.DOTALL)

# 2. Add a global "Emergency Interaction Fix" to the top of JS
emergency_css = """
/* Emergency Click Fix */
.admin-login-modal[style*="display: none"] { pointer-events: none !important; }
.filter-btn, .nav-item, .btn-action, .icon-btn { 
    pointer-events: auto !important; 
    cursor: pointer !important; 
    z-index: 100000 !important; 
}
#_orderFlashOverlay { pointer-events: none !important; }
"""

# Inject CSS into HTML
if '</style>' in new_html:
    new_html = new_html.replace('</style>', emergency_css + '\n</style>')

# 3. Clean duplicate functions in admin-app.js
# We'll just take the LATEST version of each function if duplicated
def dedup_js(content):
    # This is hard to do perfectly with regex, so we'll just ensure 
    # the window exports are at the very end and clean.
    content = re.sub(r'// --- GLOBAL EXPORTS ---.*', '', content, flags=re.DOTALL)
    exports = [
        "switchTab", "loadAllData", "toggleAutoPrint", "showPrinterMenu",
        "loadOrders", "loadReservations", "filterOrders", "filterOrdersByStatus",
        "filterReservations", "filterReservationsByStatus", "handleAdminLogin",
        "handleVerifyCode", "switchLoginMode", "handleMasterLogin", "resendVerificationCode",
        "backToPasswordStep", "handleAdminLogout", "injectMockData", "printOrderBill",
        "initPrinterAndPickers", "updatePrinterStatusUI", "isModalOpen"
    ]
    export_block = "\n\n// --- GLOBAL EXPORTS ---\n"
    for exp in exports:
        export_block += f"window.{exp} = {exp};\n"
    return content + export_block

cleaned_js = dedup_js(js)

# 4. Save
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(cleaned_js)

print("HTML and JS cleaned. Emergency CSS injected.")
