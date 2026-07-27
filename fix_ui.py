import sys

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    start_marker = 'function showPrinterMenu() {'
    end_marker = 'document.body.appendChild(menu);'

    start_idx = html.find(start_marker)
    end_idx = html.find(end_marker, start_idx)

    if start_idx == -1 or end_idx == -1:
        print(f'Could not find markers in {filename}')
        return

    old_func = html[start_idx:end_idx]

    new_func = old_func.replace(
"""                const isInApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
                const currentType = isInApp
                    ? 'network'
                    : (localStorage.getItem('printer_type') || 'bluetooth');
                if (isInApp) localStorage.setItem('printer_type', 'network');""",
"""                const isInApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
                const currentType = localStorage.getItem('printer_type') || 'bluetooth';"""
    )

    new_func = new_func.replace(
"""                    <!-- Printer Type Selector — only show in browser (not in app) -->
                    ${!isInApp ? `""",
"""                    <!-- Printer Type Selector -->"""
    )

    new_func = new_func.replace(
"""                    </div>
                    ` : ''}""",
"""                    </div>"""
    )

    new_func = new_func.replace(
"""                    <div style="border-top:1px solid rgba(255,255,255,0.1);margin:8px 0;"></div>

                    ${isInApp ? `""",
"""                    <div style="border-top:1px solid rgba(255,255,255,0.1);margin:8px 0;"></div>

                    ${currentType === 'network' && isInApp ? `"""
    )

    if old_func == new_func:
        print(f"No changes made to {filename}")
        return

    html = html[:start_idx] + new_func + html[end_idx:]
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Replaced successfully in {filename}')

process_file('tmp-live-admin.html')
process_file('admin.html')
