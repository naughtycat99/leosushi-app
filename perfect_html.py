import re

path = r'd:/jatodemo/leosushi2/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Detect and Move all admin-content divs into content-area
# Find where content-area starts
content_area_start_marker = '<div class="content-area">'
start_idx = content.find(content_area_start_marker) + len(content_area_start_marker)

# Find all blocks with id="...Content"
blocks = re.findall(r'<div\s+id="[a-zA-Z0-9-]+Content".*?<!--\s*/[a-zA-Z0-9-]+Content\s*-->', content, re.DOTALL)
# If comments aren't there, we need a better regex. 
# Looking at the view_file, they seem to be extracted but maybe messed up.
# Actually, I'll just use a more surgical approach.

# Let's simplify: I'll rewrite the core structure in a clean string.
# Head is fine. Sidebar is fine. Top Header is fine.
# I just need to gather all the content divs.

def get_content_blocks(html):
    # This is safer: find all divs with class admin-content and their standard IDs
    cids = [
        "ordersContent", "reservationsContent", "customersContent", "menuContent",
        "discount-codesContent", "promotionsContent", "holiday-scheduleContent",
        "printerContent", "statsContent"
    ]
    results = []
    for cid in cids:
        # Match from <div id="cid" ... to the next sibling or logical end
        match = re.search(rf'<div\s+id="{cid}"[^>]*>.*?</div>\s*(?:<!--\s*/{cid}\s*-->)?', html, re.DOTALL)
        if match:
            results.append(match.group(0))
    return "\n\n".join(results)

all_contents = get_content_blocks(content)

# Define the CLEAN structure
clean_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LEO SUSHI - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="css/admin-style.css">
    <style>
        :root {{ --gold: #c2a355; --dark-bg: #0b0b0c; --sidebar-width: 260px; }}
        body {{ margin: 0; font-family: 'Inter', sans-serif; background: var(--dark-bg); color: #fff; overflow-x: hidden; }}
        
        .dashboard-wrapper {{ display: flex; min-height: 100vh; }}
        
        .sidebar {{
            width: var(--sidebar-width); background: #121214; border-right: 1px solid rgba(229, 207, 142, 0.1);
            display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 1000; transition: transform 0.3s ease;
        }}
        .logo-text {{ font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold); font-weight: 700; padding: 30px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }}
        .sidebar-nav {{ flex: 1; padding: 20px 12px; overflow-y: auto; }}
        .nav-item {{
            display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: rgba(255,255,255,0.6);
            text-decoration: none; border-radius: 12px; margin-bottom: 4px; transition: 0.3s; cursor: pointer; font-size: 14px;
        }}
        .nav-item:hover, .nav-item.active {{ background: rgba(229, 207, 142, 0.1); color: var(--gold); }}
        
        .main-content {{ flex: 1; margin-left: var(--sidebar-width); background: var(--dark-bg); min-height: 100vh; display: flex; flex-direction: column; }}
        .top-header {{
            height: 80px; padding: 0 40px; display: flex; justify-content: space-between; align-items: center;
            background: rgba(11, 11, 12, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05);
            position: sticky; top: 0; z-index: 100;
        }}
        .header-right {{ display: flex; align-items: center; gap: 15px; }}
        .icon-btn {{ background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 42px; height: 42px; border-radius: 10px; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }}
        
        .content-area {{ padding: 40px; flex: 1; position: relative; z-index: 1; }}
        
        /* Mobile */
        @media (max-width: 1024px) {{
            .sidebar {{ transform: translateX(-100%); }}
            .sidebar.active {{ transform: translateX(0); }}
            .main-content {{ margin-left: 0; }}
        }}
        
        /* Modal Fixes */
        .admin-login-modal {{ position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 20000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); }}
        .modal-content {{ background: #121214; border: 1px solid var(--gold); border-radius: 20px; padding: 40px; max-width: 450px; width: 90%; position: relative; }}
    </style>
</head>
<body>
    <div class="dashboard-wrapper">
        <aside class="sidebar" id="mainSidebar">
            <div class="logo-text">🍱 LEO SUSHI</div>
            <nav class="sidebar-nav">
                <a href="javascript:void(0)" class="nav-item active" onclick="switchTab('orders')">📦 Đơn hàng</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('reservations')">📅 Đặt bàn</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('customers')">👥 Khách hàng</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('stats')">📊 Thống kê</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('menu')">🍣 Thực đơn</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('discount-codes')">🎁 Mã giảm giá</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('promotions')">⭐ Tích điểm</a>
                <a href="javascript:void(0)" class="nav-item" onclick="switchTab('holiday-schedule')">📅 Lịch nghỉ</a>
            </nav>
            <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.05);">
                <button class="nav-item" onclick="handleAdminLogout()" style="width: 100%; border: 1px solid rgba(239,68,68,0.3); color: #ef4444; background: rgba(239,68,68,0.05);">Đăng xuất</button>
            </div>
        </aside>

        <main class="main-content">
            <header class="top-header">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button onclick="document.getElementById('mainSidebar').classList.toggle('active')" style="background:none; border:none; color:#fff; font-size:24px; cursor:pointer;">☰</button>
                    <h1 style="margin: 0; font-size: 20px;">Bảng điều khiển</h1>
                </div>
                <div class="header-right">
                    <label style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                        <input type="checkbox" id="autoPrintToggle" onchange="toggleAutoPrint(this.checked)"> 🖨️ In tự động
                    </label>
                    <button class="icon-btn" onclick="loadAllData()">🔄</button>
                    <button class="icon-btn" onclick="showPrinterMenu()">🖨️</button>
                </div>
            </header>

            <div class="content-area">
                {all_contents}
            </div>
        </main>
    </div>

    <!-- Login Modal -->
    <div id="adminLoginModal" class="admin-login-modal">
        <div class="modal-content">
            <h2 style="color: var(--gold); text-align: center;">VUI LÒNG ĐĂNG NHẬP</h2>
            <input type="password" id="adminPassword" placeholder="Mật khẩu" class="filter-input" style="width: 100%; margin: 20px 0; padding: 12px; box-sizing: border-box; background:#000; border:1px solid #333; color:#fff;">
            <button class="btn-confirm" onclick="handleAdminLogin()" style="width: 100%; padding: 12px; border-radius: 12px;">Xác nhận</button>
            <div style="text-align: center; margin-top: 15px;">
                <a href="javascript:void(0)" onclick="switchLoginMode('master')" style="color: var(--gold); font-size: 12px;">Dùng Master Key</a>
            </div>
        </div>
    </div>

    <div id="timeScheduleModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:10000; align-items:center; justify-content:center;">
        <div class="modal-content" style="text-align:center;">
            <h3>⏰ Thời gian hoàn thành</h3>
            <div style="display:flex; justify-content:center; gap:10px; margin: 20px 0;">
                <input type="number" id="scheduleHours" value="0" style="width:60px; padding:10px; background:#000; color:#fff; border:1px solid #333;"> :
                <input type="number" id="scheduleMinutes" value="30" style="width:60px; padding:10px; background:#000; color:#fff; border:1px solid #333;">
            </div>
            <button class="btn-confirm" onclick="confirmOrderWithTime()" style="width: 100%; padding: 12px; border-radius: 12px;">Xác nhận</button>
            <button onclick="closeTimeScheduleModal()" style="margin-top:10px; background:none; border:none; color:#888;">Hủy bỏ</button>
        </div>
    </div>

    <div id="orderDetailsModal" style="display:none;"></div>
    <div id="printerMenuModal" style="display:none;"></div>

    <script src="js/api.v2.js"></script>
    <script src="js/admin-app.js"></script>
</body>
</html>"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(clean_html)

print("HTML Structure PERFECTED!")
