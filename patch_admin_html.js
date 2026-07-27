const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// 1. Add tab to sidebar
const sidebarTabRegex = /<button class="admin-tab" data-tab="customers".*?<\/button>/s;
const sidebarMatch = content.match(sidebarTabRegex);
if (sidebarMatch) {
    const newSidebarTab = `
                <button class="admin-tab" data-tab="menu" onclick="switchTab('menu')">
                    <i>🍽️</i> Menu
                </button>
`;
    content = content.replace(sidebarMatch[0], sidebarMatch[0] + newSidebarTab);
}

// 2. Add tab to bottom nav
const bottomNavRegex = /<button class="nav-item" onclick="event.stopPropagation\(\); switchTab\('customers'\); updateNav\(this\)".*?<\/button>/s;
const bottomNavMatch = content.match(bottomNavRegex);
if (bottomNavMatch) {
    const newBottomNav = `
        <button class="nav-item" onclick="event.stopPropagation(); switchTab('menu'); updateNav(this)">
            <i>🍽️</i>
            <span>Menu</span>
        </button>
`;
    content = content.replace(bottomNavMatch[0], bottomNavMatch[0] + newBottomNav);
}

// 3. Add menuSection and Settings Section (for store status)
// Add toggle to Header or Top of Orders section
const headerRegex = /<div class="admin-header-title">.*?<\/div>/s;
const headerMatch = content.match(headerRegex);
if (headerMatch) {
    const newHeader = headerMatch[0] + `
            <div style="display: flex; align-items: center; gap: 10px; margin-left: 20px;">
                <span style="color: #fff; font-size: 14px; font-weight: bold;">Nhận đơn:</span>
                <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
                    <input type="checkbox" id="storeStatusToggle" checked onchange="toggleStoreStatus(this.checked)" style="opacity: 0; width: 0; height: 0;">
                    <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
`;
    content = content.replace(headerMatch[0], newHeader);
}

const sectionsEndRegex = /<\/div>\s*<!-- End admin container -->/;
const menuSection = `
            <!-- Menu Management Section -->
            <div id="menuSection" class="admin-section" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--gold); margin: 0;">Quản lý Thực đơn</h2>
                    <button class="btn-primary" onclick="loadMenuAdmin()" style="padding: 8px 16px; border-radius: 8px; background: var(--gold); color: #000; border: none; cursor: pointer;">Làm mới</button>
                </div>
                <div id="adminMenuList" style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="color: white; text-align: center; padding: 20px;">Đang tải...</div>
                </div>
            </div>
`;
content = content.replace(sectionsEndRegex, menuSection + '\n        </div>\n        <!-- End admin container -->');

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Successfully patched admin.html HTML structure');
