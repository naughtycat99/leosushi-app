const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Append CSS for switch toggle
const css = `
            .switch input:checked + .slider {
                background-color: #10b981;
            }
            .switch input:focus + .slider {
                box-shadow: 0 0 1px #10b981;
            }
            .switch input:checked + .slider:before {
                transform: translateX(22px);
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            .admin-menu-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: rgba(25, 25, 28, 0.9);
                border: 1px solid rgba(229, 207, 142, 0.1);
                border-radius: 12px;
            }
            .admin-menu-item.out-of-stock {
                opacity: 0.6;
            }
`;
content = content.replace('</style>', css + '</style>');

// Append JS logic
const js = `
        let adminMenuData = [];

        async function loadStoreStatus() {
            try {
                const response = await fetch('api/store_status.php');
                const data = await response.json();
                const toggle = document.getElementById('storeStatusToggle');
                if (toggle) {
                    toggle.checked = data.is_open !== false;
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function toggleStoreStatus(isOpen) {
            try {
                const response = await fetch('api/store_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_open: isOpen })
                });
                const data = await response.json();
                if(data.success) {
                    showNotification('Đã cập nhật trạng thái quán!', 'success');
                } else {
                    showNotification('Lỗi cập nhật trạng thái', 'error');
                }
            } catch(e) {
                showNotification('Lỗi mạng', 'error');
            }
        }

        async function loadMenuAdmin() {
            const list = document.getElementById('adminMenuList');
            if(!list) return;
            list.innerHTML = '<div style="color:white; text-align:center;">Đang tải menu...</div>';
            try {
                const res = await fetch('api/menu.php?action=list&admin=true');
                const json = await res.json();
                if(json.success && json.data) {
                    adminMenuData = json.data;
                    renderAdminMenu();
                } else {
                    list.innerHTML = '<div style="color:red; text-align:center;">Lỗi tải menu</div>';
                }
            } catch(e) {
                list.innerHTML = '<div style="color:red; text-align:center;">Lỗi mạng</div>';
            }
        }

        function renderAdminMenu() {
            const list = document.getElementById('adminMenuList');
            if(!list) return;
            list.innerHTML = '';
            
            let currentCategory = null;
            adminMenuData.forEach(item => {
                if (item.category_name !== currentCategory) {
                    currentCategory = item.category_name;
                    const catHeader = document.createElement('div');
                    catHeader.style.cssText = 'color: var(--gold); font-weight: bold; margin-top: 15px; font-size: 16px;';
                    catHeader.textContent = currentCategory;
                    list.appendChild(catHeader);
                }
                
                const isAvail = item.available == 1 || item.available == null;
                
                const el = document.createElement('div');
                el.className = 'admin-menu-item' + (!isAvail ? ' out-of-stock' : '');
                el.innerHTML = \`
                    <div style="flex:1;">
                        <div style="color: white; font-weight: bold;">\${item.name}</div>
                        <div style="color: rgba(255,255,255,0.5); font-size: 12px;">\${parseFloat(item.price).toFixed(2)}€</div>
                    </div>
                    <div>
                        <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
                            <input type="checkbox" \${isAvail ? 'checked' : ''} onchange="toggleMenuItem('\${item.item_id}', this.checked)" style="opacity: 0; width: 0; height: 0;">
                            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>
                \`;
                list.appendChild(el);
            });
        }

        async function toggleMenuItem(itemId, isAvail) {
            try {
                const item = adminMenuData.find(i => i.item_id === itemId);
                if(!item) return;
                
                // Construct update payload - need to send back existing fields since API might overwrite
                const payload = {
                    item_id: item.item_id,
                    name: item.name,
                    category_id: item.category_id,
                    available: isAvail ? 1 : 0
                };
                
                const res = await fetch('api/menu.php?action=update&item_id=' + itemId, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const json = await res.json();
                if(json.success) {
                    showNotification('Đã cập nhật trạng thái món', 'success');
                    item.available = isAvail ? 1 : 0;
                    renderAdminMenu();
                } else {
                    showNotification('Lỗi: ' + json.message, 'error');
                }
            } catch(e) {
                showNotification('Lỗi cập nhật', 'error');
            }
        }

        // Call loadStoreStatus on init
        setTimeout(loadStoreStatus, 1000);
`;
content = content.replace('</script>', js + '\n</script>');

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Successfully patched admin.html JS');
