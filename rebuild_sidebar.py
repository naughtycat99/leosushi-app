import os
import re

html_file = 'd:/jatodemo/leosushi2/admin.bak.html'
target_file = 'd:/jatodemo/leosushi2/admin.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

sidebar_html = """
    <!-- SIDEBAR 2026 -->
    <div class="dashboard-wrapper">
        <aside class="sidebar" id="mainSidebar">
            <div class="sidebar-header">
                <h2>🍣 LEO SUSHI</h2>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-tab="orders" onclick="switchTab('orders'); document.getElementById('mainSidebar').classList.remove('active');">
                    📦 Đơn hàng
                </a>
                <a href="#" class="nav-item" data-tab="reservations" onclick="switchTab('reservations'); document.getElementById('mainSidebar').classList.remove('active');">
                    📅 Đặt bàn
                </a>
                <a href="#" class="nav-item" data-tab="customers" onclick="switchTab('customers'); document.getElementById('mainSidebar').classList.remove('active');">
                    👥 Khách hàng
                </a>
                <a href="#" class="nav-item" data-tab="stats" onclick="switchTab('stats'); document.getElementById('mainSidebar').classList.remove('active');">
                    📊 Thống kê
                </a>
                <a href="#" class="nav-item" data-tab="menu" onclick="switchTab('menu'); document.getElementById('mainSidebar').classList.remove('active');">
                    🍣 Thực đơn
                </a>
                <div class="nav-group">
                    <div class="nav-group-title">Nâng Cao</div>
                    <a href="#" class="nav-item" data-tab="discount-codes" onclick="switchTab('discount-codes'); document.getElementById('mainSidebar').classList.remove('active');">
                        🎁 Mã giảm giá
                    </a>
                    <a href="#" class="nav-item" data-tab="promotions" onclick="switchTab('promotions'); document.getElementById('mainSidebar').classList.remove('active');">
                        ⭐ Tích điểm
                    </a>
                    <a href="#" class="nav-item" data-tab="holiday-schedule" onclick="switchTab('holiday-schedule'); document.getElementById('mainSidebar').classList.remove('active');">
                        📅 Lịch nghỉ lễ
                    </a>
                </div>
            </nav>
            <div class="sidebar-footer">
                <button class="btn-action btn-logout" onclick="handleAdminLogout()" id="logoutBtn" style="display: none; width: 100%; border-radius: 8px;">
                    Đăng xuất
                </button>
            </div>
        </aside>

        <div class="main-content">
            <header class="top-header">
                <div class="header-left">
                    <button class="mobile-menu-toggle" onclick="document.getElementById('mainSidebar').classList.toggle('active')">☰</button>
                    <div style="display: flex; flex-direction: column;">
                        <h1 style="color: #fff; margin: 0; font-size: 20px;">Bảng điều khiển</h1>
                        <span id="adminStatus" style="color: rgba(255,255,255,0.7); font-size: 13px;"></span>
                    </div>
                </div>
                <div class="header-right">
                    <label class="auto-print-toggle">
                        <input type="checkbox" id="autoPrintToggle" onchange="toggleAutoPrint(this.checked)">
                        🖨️ Tự động in
                    </label>
                    <button class="btn-header icon-btn" onclick="showPrinterMenu()" id="btnActionPrint" title="Cài đặt máy in">🖨️</button>
                    <button class="btn-header icon-btn" onclick="loadAllData()" id="btnActionRefresh" title="Làm mới">🔄</button>
                </div>
            </header>

            <div class="content-area">
"""

premium_css = """
<style>
/* Override bottom nav & old UI */
.bottom-nav { display: none !important; }
.admin-sidebar { display: none !important; }
.admin-layout { display: block !important; padding: 0 !important; }
.admin-header { display: none !important; }
/* Use Sidebar layout */
body { margin: 0; padding: 0; background: #0b0b0c; font-family: 'Inter', sans-serif; }
.dashboard-wrapper { display: flex; min-height: 100vh; background: #0b0b0c; }
.sidebar { width: 260px; background: #121214; border-right: 1px solid rgba(229, 207, 142, 0.1); padding: 24px; position: fixed; height: 100vh; z-index: 1000; transition: transform 0.3s; box-sizing: border-box; }
.sidebar-header h2 { color: #d4af37; font-size: 20px; font-family: 'Playfair Display', serif; }
.nav-item { display: block; padding: 12px 16px; color: rgba(255,255,255,0.6); text-decoration: none; border-radius: 8px; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
.nav-item.active, .nav-item:hover { background: rgba(212, 175, 55, 0.1); color: #d4af37; }
.main-content { margin-left: 260px; flex: 1; padding: 0; min-height: 100vh; display: flex; flex-direction: column; width: calc(100% - 260px); }
.top-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: rgba(18, 18, 20, 0.95); border-bottom: 1px solid rgba(229, 207, 142, 0.1); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
.header-left { display: flex; align-items: center; gap: 16px; }
.content-area { padding: 40px; }
.mobile-menu-toggle { display: none; background: transparent; border: none; color: #fff; font-size: 24px; cursor: pointer; padding: 0; }
.nav-group-title { font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin: 24px 0 12px 16px; letter-spacing: 1px; font-weight: 700; }
.header-right { display: flex; gap: 12px; align-items: center; }
.auto-print-toggle { display: flex; align-items: center; gap: 8px; background: rgba(212, 175, 55, 0.1); padding: 8px 16px; border-radius: 20px; color: #d4af37; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(212, 175, 55, 0.2); margin-right: 10px; }
.icon-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 40px; height: 40px; border-radius: 50%; color: #fff; cursor: pointer; transition: all 0.3s; font-size: 18px; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: rgba(212, 175, 55, 0.2); border-color: #d4af37; }

/* Apply Premium Card styling */
.order-card, .reservation-card { 
    background: rgba(25, 25, 28, 0.95) !important; 
    border: 1px solid rgba(229, 207, 142, 0.2) !important; 
    border-radius: 16px !important; 
    box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important; 
    backdrop-filter: blur(10px) !important; 
    padding: 20px !important; 
}
.admin-main-content {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}

@media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.active { transform: translateX(0); }
    .main-content { margin-left: 0; width: 100%; }
    .mobile-menu-toggle { display: block; }
    .content-area { padding: 20px; }
    .top-header { padding: 16px 20px; }
    .header-right .auto-print-toggle span { display: none; }
}
</style>
"""

content = content.replace('</head>', premium_css + '\n</head>')

pattern = re.compile(r'<div class="admin-header">.*?<div class="admin-layout"[^>]*>', re.DOTALL)
content = pattern.sub(sidebar_html, content)

content = content.replace('</body>', '</div></div></div>\n</body>')

# Bug fixes
content = content.replace('let data = await response.json();', 'let data = await response.json();\n                if (Array.isArray(data)) data = { success: true, orders: data };')
content = content.replace('const data = await response.json();', 'const data = await response.json();\n                if (Array.isArray(data)) data = { success: true, orders: data };')

# We'll also do the Mock data replacements just in case
content = content.replace('items: [{ name: "Sushi Set A", quantity: 1 }]', 'summary: { total: "150.000 đ" }, delivery_address: { first_name: "Nguyễn", last_name: "A", phone: "090" }')

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESS: Sidebar injected successfully!")
