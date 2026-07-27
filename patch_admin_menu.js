const fs = require('fs');

// 1. Update js/main.js for reservation page banner
let mainJs = fs.readFileSync('js/main.js', 'utf8');
const oldCondition = `const isOrderPage = window.location.pathname.includes('menu') || window.location.pathname.includes('checkout');`;
const newCondition = `const isOrderPage = window.location.pathname.includes('menu') || window.location.pathname.includes('checkout') || window.location.pathname.includes('reservation');`;
if (mainJs.includes(oldCondition)) {
    mainJs = mainJs.replace(oldCondition, newCondition);
    fs.writeFileSync('js/main.js', mainJs, 'utf8');
    console.log('Updated js/main.js');
}

// 2. Update admin.html to add available toggle
let adminHtml = fs.readFileSync('admin.html', 'utf8');
const oldRender = `                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action btn-view edit-menu-item-btn" data-item-id="\${item.item_id}" title="Bearbeiten">✏️</button>
                                <button class="btn-action delete-menu-item-btn" data-item-id="\${item.item_id}" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                            </div>`;
const newRender = `                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action toggle-available-btn" data-item-id="\${item.item_id}" data-available="\${item.available == 0 ? 0 : 1}" style="background: \${item.available == 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; color: \${item.available == 0 ? '#ef4444' : '#22c55e'}; padding: 4px 10px; font-size: 13px; font-weight: bold; border-radius: 6px;" title="\${item.available == 0 ? 'Hiện đang Hết hàng - Bấm để mở lại' : 'Đang bán - Bấm để báo hết hàng'}">
                                    \${item.available == 0 ? '❌ Hết hàng' : '✅ Có sẵn'}
                                </button>
                                <button class="btn-action btn-view edit-menu-item-btn" data-item-id="\${item.item_id}" title="Bearbeiten">✏️</button>
                                <button class="btn-action delete-menu-item-btn" data-item-id="\${item.item_id}" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                            </div>`;

if (adminHtml.includes(oldRender)) {
    adminHtml = adminHtml.replace(oldRender, newRender);
    console.log('Replaced renderMenuItems');
} else {
    console.log('Could not find oldRender in admin.html');
}

const oldHandler = `                if (editBtn) {
                    const itemId = editBtn.dataset.itemId;
                    editMenuItem(itemId);
                } else if (deleteBtn) {`;
const newHandler = `                const toggleBtn = e.target.closest('.toggle-available-btn');
                
                if (editBtn) {
                    const itemId = editBtn.dataset.itemId;
                    editMenuItem(itemId);
                } else if (toggleBtn) {
                    const itemId = toggleBtn.dataset.itemId;
                    const currentAvailable = parseInt(toggleBtn.dataset.available || '1');
                    const newAvailable = currentAvailable === 1 ? 0 : 1;
                    
                    if (confirm(newAvailable === 0 ? 'Bạn muốn báo món này là HẾT HÀNG?' : 'Bạn muốn mở lại món này (CÓ SẴN)?')) {
                        try {
                            const res = await fetch(\`api/menu.php?action=update&item_id=\${itemId}\`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ available: newAvailable })
                            });
                            const data = await res.json();
                            if (data.success) {
                                const item = allMenuItems.find(i => i.item_id === itemId);
                                if (item) item.available = newAvailable;
                                renderMenuItems(allMenuItems);
                            } else {
                                alert('Lỗi: ' + data.message);
                            }
                        } catch(err) {
                            alert('Lỗi kết nối khi cập nhật món!');
                        }
                    }
                } else if (deleteBtn) {`;

if (adminHtml.includes(oldHandler)) {
    adminHtml = adminHtml.replace(oldHandler, newHandler);
    console.log('Replaced attachMenuItemEventListeners');
} else {
    console.log('Could not find oldHandler in admin.html');
}

fs.writeFileSync('admin.html', adminHtml, 'utf8');

