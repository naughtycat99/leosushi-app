import re
import os

bak_path = r'd:/jatodemo/leosushi2/admin.bak.html'
new_html_path = r'd:/jatodemo/leosushi2/admin.html'

with open(bak_path, 'r', encoding='utf-8') as f:
    bak = f.read()

def extract_block(block_id, content):
    # Match <div id="block_id" ...> ... </div> carefully considering nesting
    # This regex is simplified but should work for these specific top-level content containers
    pattern = rf'<div\s+id="{block_id}"[^>]*class="admin-content[^>]*>.*?</div>\s*<!--\s*/{block_id}\s*-->'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        # Fallback to a simpler match if comments are missing
        pattern = rf'<div\s+id="{block_id}"[^>]*class="admin-content[^>]*>.*?</div>'
        # We need to handle the content inside more robustly if it has nested divs
        # For now, let's look for a specific end marker if available or count braces
        # Actually, let's just grab from opening to next major sibling or known marker
        start = re.search(rf'<div\s+id="{block_id}"', content)
        if not start: return ""
        
        # Simple heuristic: find and grab until the next <div id="...Content"
        next_block = re.search(r'<div\s+id="[a-zA-Z0-9-]+Content"', content[start.start()+1:])
        if next_block:
            return content[start.start():start.start() + next_block.start() + 1]
        else:
            # Last block, grab until some closing div
            return content[start.start():]
    return match.group(0)

# Content IDs to extract
content_ids = [
    "ordersContent", "reservationsContent", "customersContent", "menuContent",
    "discount-codesContent", "promotionsContent", "holiday-scheduleContent",
    "printerContent", "statsContent"
]

content_html = ""
for cid in content_ids:
    block = extract_block(cid, bak)
    if block:
        # Remove active class from all except orders
        if cid != "ordersContent":
            block = block.replace('class="admin-content active"', 'class="admin-content"')
        else:
            block = block.replace('class="admin-content"', 'class="admin-content active"')
        content_html += "\n\n" + block

# Construct the NEW admin.html shell
new_shell = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LEO SUSHI - Bảng điều khiển Quản trị</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="css/admin-style.css">
    <style>
        :root {{ --gold: #c2a355; --dark-bg: #0b0b0c; --sidebar-width: 260px; }}
        body {{ margin: 0; font-family: 'Inter', sans-serif; background: var(--dark-bg); color: #fff; overflow-x: hidden; }}
        
        /* Dashboard Wrapper Layout */
        .dashboard-wrapper {{ display: flex; min-height: 100vh; }}
        
        /* Sidebar Styles */
        .sidebar {{
            width: var(--sidebar-width);
            background: #121214;
            border-right: 1px solid rgba(229, 207, 142, 0.1);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            z-index: 1000;
            transition: transform 0.3s ease;
        }}
        
        .sidebar-header {{ padding: 30px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }}
        .logo-text {{ font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold); font-weight: 700; display: flex; align-items: center; gap: 10px; }}
        
        .sidebar-nav {{ flex: 1; padding: 20px 12px; overflow-y: auto; }}
        .nav-group {{ margin-bottom: 24px; }}
        .nav-label {{ font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.3); padding: 0 16px; margin-bottom: 12px; letter-spacing: 1px; }}
        
        .nav-item {{
            display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: rgba(255,255,255,0.6);
            text-decoration: none; border-radius: 12px; margin-bottom: 4px; transition: all 0.3s; cursor: pointer;
            font-size: 14px; font-weight: 500;
        }}
        .nav-item:hover {{ background: rgba(229, 207, 142, 0.05); color: #fff; }}
        .nav-item.active {{ background: rgba(229, 207, 142, 0.1); color: var(--gold); }}
        
        /* Main Content area */
        .main-content {{ flex: 1; margin-left: var(--sidebar-width); background: var(--dark-bg); min-height: 100vh; display: flex; flex-direction: column; }}
        
        .top-header {{
            height: 80px; padding: 0 40px; display: flex; justify-content: space-between; align-items: center;
            background: rgba(11, 11, 12, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05);
            position: sticky; top: 0; z-index: 100;
        }}
        
        .header-right {{ display: flex; align-items: center; gap: 15px; }}
        .icon-btn {{ background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 42px; height: 42px; border-radius: 10px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }}
        .icon-btn:hover {{ background: rgba(229, 207, 142, 0.15); border-color: var(--gold); }}
        
        .content-area {{ padding: 40px; flex: 1; position: relative; z-index: 1; }}
        
        /* Mobile menu toggle */
        .mobile-menu-toggle {{ display: none; background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }}
        
        /* Login Modal Overlay */
        .admin-login-modal {{ position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); }}
        .admin-login-content {{ background: #121214; border: 1px solid rgba(229, 207, 142, 0.2); border-radius: 20px; padding: 40px; max-width: 400px; width: 90%; text-align: center; }}
        
        /* Utility styles - EMERGENCY FIXES */
        .filter-btn, .nav-item, .btn-action, .icon-btn {{ pointer-events: auto !important; cursor: pointer !important; }}
        
        @media (max-width: 1024px) {{
            .sidebar {{ transform: translateX(-100%); }}
            .sidebar.active {{ transform: translateX(0); }}
            .main-content {{ margin-left: 0; }}
            .mobile-menu-toggle {{ display: block; }}
        }}
    </style>
</head>
<body>
    <div class="dashboard-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar" id="mainSidebar">
            <div class="sidebar-header">
                <div class="logo-text">🍱 LEO SUSHI</div>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-group">
                    <div class="nav-label">Chính</div>
                    <a href="javascript:void(0)" class="nav-item active" data-tab="orders" onclick="switchTab('orders'); document.getElementById('mainSidebar').classList.remove('active');">
                        📦 Đơn hàng
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="reservations" onclick="switchTab('reservations'); document.getElementById('mainSidebar').classList.remove('active');">
                        📅 Đặt bàn
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="customers" onclick="switchTab('customers'); document.getElementById('mainSidebar').classList.remove('active');">
                        👥 Khách hàng
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="stats" onclick="switchTab('stats'); document.getElementById('mainSidebar').classList.remove('active');">
                        📊 Thống kê
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="menu" onclick="switchTab('menu'); document.getElementById('mainSidebar').classList.remove('active');">
                        🍣 Thực đơn
                    </a>
                </div>
                <div class="nav-group">
                    <div class="nav-label">Nâng cao</div>
                    <a href="javascript:void(0)" class="nav-item" data-tab="discount-codes" onclick="switchTab('discount-codes'); document.getElementById('mainSidebar').classList.remove('active');">
                        🎁 Mã giảm giá
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="promotions" onclick="switchTab('promotions'); document.getElementById('mainSidebar').classList.remove('active');">
                        ⭐ Tích điểm
                    </a>
                    <a href="javascript:void(0)" class="nav-item" data-tab="holiday-schedule" onclick="switchTab('holiday-schedule'); document.getElementById('mainSidebar').classList.remove('active');">
                        📅 Lịch nghỉ lễ
                    </a>
                </div>
            </nav>
            <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
                <button class="nav-item" onclick="handleAdminLogout()" style="width: 100%; border: 1px solid rgba(239,68,68,0.3); color: #ef4444; background: rgba(239,68,68,0.1);">
                    Đăng xuất
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <div class="header-left" style="display: flex; align-items: center; gap: 15px;">
                    <button class="mobile-menu-toggle" onclick="document.getElementById('mainSidebar').classList.toggle('active')">☰</button>
                    <div>
                        <h1 style="margin: 0; font-size: 20px;">Bảng điều khiển</h1>
                        <span id="adminStatus" style="color: rgba(255,255,255,0.5); font-size: 13px;"></span>
                    </div>
                </div>
                <div class="header-right">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.7);">
                        <input type="checkbox" id="autoPrintToggle" onchange="toggleAutoPrint(this.checked)"> 🖨️ In tự động
                    </label>
                    <button class="icon-btn" onclick="showPrinterMenu()" title="Cài đặt máy in">🖨️</button>
                    <button class="icon-btn" onclick="loadAllData()" title="Làm mới">🔄</button>
                </div>
            </header>

            <div class="content-area">
                {content_html}
            </div>
        </main>
    </div>

    <!-- Login Modal -->
    <div id="adminLoginModal" class="admin-login-modal">
        <div class="admin-login-content">
            <h2 style="font-family: 'Playfair Display', serif; color: var(--gold);">LEO SUSHI</h2>
            <div id="loginStep1">
                <input type="password" id="adminPassword" placeholder="Mật khẩu" class="filter-input" style="width: 100%; margin-bottom: 15px; box-sizing: border-box;">
                <button class="btn-confirm" onclick="handleAdminLogin()" style="width: 100%; padding: 12px; border-radius: 12px;">Đăng nhập</button>
                <div style="margin-top: 15px;">
                    <a href="javascript:void(0)" onclick="switchLoginMode('master')" style="color: var(--gold); font-size: 12px;">Dùng Master Key (Cấp cứu)</a>
                </div>
            </div>
            <!-- Additional login steps and flows are handled by JS injection or visibility -->
        </div>
    </div>
    
    <!-- Time Schedule Modal -->
    <div id="timeScheduleModal" style="display:none; position:fixed; inset:0; z-index:20002; background:rgba(0,0,0,0.8); align-items:center; justify-content:center;">
        <div style="background:#121214; padding:30px; border-radius:20px; border:1px solid var(--gold); width:90%; max-width:400px; text-align:center;">
             <h3>⏰ Thời gian hoàn thành</h3>
             <div style="display:flex; gap:10px; justify-content:center; margin:20px 0;">
                <input type="number" id="scheduleHours" value="0" style="width:60px; padding:10px; background:rgba(255,255,255,0.05); border:1px solid #333; color:#fff;"> :
                <input type="number" id="scheduleMinutes" value="30" style="width:60px; padding:10px; background:rgba(255,255,255,0.05); border:1px solid #333; color:#fff;">
             </div>
             <button class="btn-confirm" onclick="confirmOrderWithTime()" style="width:100%; padding:12px; border-radius:12px;">Xác nhận</button>
             <button onclick="closeTimeScheduleModal()" style="margin-top:10px; background:none; border:none; color:#888; cursor:pointer;">Hủy</button>
        </div>
    </div>

    <!-- Modals for details to be rendered by JS -->
    <div id="orderDetailsModal" style="display:none;"></div>
    <div id="printerMenuModal" style="display:none;"></div>

    <script src="js/api.v2.js"></script>
    <script src="js/admin-app.js"></script>
</body>
</html>"""

with open(new_html_path, 'w', encoding='utf-8') as f:
    f.write(new_shell)

print("CLEAN RECONSTRUCTION SUCCESSFUL!")
