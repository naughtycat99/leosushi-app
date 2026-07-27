import re
import os

js_path = r'd:/jatodemo/leosushi2/js/admin-app.js'
bak_path = r'd:/jatodemo/leosushi2/admin.bak.html'

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# 1. Clean JS from <script> tags
js_content = re.sub(r'</?script[^>]*>', '', js_content)

# 2. Extract missing functions from backup
with open(bak_path, 'r', encoding='utf-8') as f:
    bak_content = f.read()

def extract_function(name, content):
    pattern = rf'function\s+{name}\s*\(.*?\)\s*\{{(?:[^{{}}]*|\{{(?:[^{{}}]*|\{{[^{{}}]*\}})*\}})*\}}'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0)
    # Try alternate pattern if first one fails
    return None

switchTab_code = extract_function('switchTab', bak_content)
loadAllData_code = extract_function('loadAllData', bak_content)
toggleAutoPrint_code = extract_function('toggleAutoPrint', bak_content)
showPrinterMenu_code = extract_function('showPrinterMenu', bak_content)

# Special handling for toggleAutoPrint if it's an arrow function or defined differently
if not toggleAutoPrint_code:
    match = re.search(r'function\s+toggleAutoPrint\s*\(.*?\)\s*\{.*?\}', bak_content, re.DOTALL)
    if match: toggleAutoPrint_code = match.group(0)

new_functions = []
if switchTab_code: new_functions.append(switchTab_code)
if loadAllData_code: new_functions.append(loadAllData_code)
if toggleAutoPrint_code: new_functions.append(toggleAutoPrint_code)
if showPrinterMenu_code: new_functions.append(showPrinterMenu_code)

functions_str = "\n\n/* --- RESTORED FUNCTIONS --- */\n" + "\n\n".join(new_functions)

# Insert before global exports
export_start = js_content.find("// Make functions globally available")
if export_start != -1:
    js_content = js_content[:export_start] + functions_str + "\n\n" + js_content[export_start:]
else:
    js_content += functions_str

# 3. Comprehensive Exports
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

js_content += export_block

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully cleaned and updated admin-app.js")
