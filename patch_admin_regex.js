const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

// Replace the render part
const renderRegex = /(<div style="display: flex; gap: 8px;">\s*<button class="btn-action btn-view edit-menu-item-btn")/g;
const renderReplacement = `<div style="display: flex; gap: 8px;">
                                <button class="btn-action toggle-available-btn" data-item-id="\${item.item_id}" data-available="\${item.available == 0 ? 0 : 1}" style="background: \${item.available == 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; color: \${item.available == 0 ? '#ef4444' : '#22c55e'}; padding: 4px 10px; font-size: 13px; font-weight: bold; border-radius: 6px;" title="\${item.available == 0 ? 'Hiện đang Hết hàng - Bấm để mở lại' : 'Đang bán - Bấm để báo hết hàng'}">
                                    \${item.available == 0 ? '❌ Hết hàng' : '✅ Có sẵn'}
                                </button>
                                <button class="btn-action btn-view edit-menu-item-btn"`;
if (adminHtml.match(renderRegex)) {
    adminHtml = adminHtml.replace(renderRegex, renderReplacement);
    console.log('Successfully replaced render section');
} else {
    console.log('Could not find render regex');
}

// Replace the handler part
const handlerRegex = /(const editBtn = e\.target\.closest\('\.edit-menu-item-btn'\);[\s\S]*?if\s*\(editBtn\)\s*\{)/g;
const handlerReplacement = `const editBtn = e.target.closest('.edit-menu-item-btn');
                const deleteBtn = e.target.closest('.delete-menu-item-btn');
                const toggleBtn = e.target.closest('.toggle-available-btn');
                
                if (toggleBtn) {
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
                } else if (editBtn) {`;
if (adminHtml.match(handlerRegex)) {
    adminHtml = adminHtml.replace(handlerRegex, handlerReplacement);
    console.log('Successfully replaced handler section');
} else {
    console.log('Could not find handler regex');
}

fs.writeFileSync('admin.html', adminHtml, 'utf8');
