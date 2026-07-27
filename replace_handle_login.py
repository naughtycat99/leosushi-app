import os

files = ['www/admin.html', 'www/tmp-live-admin.html']

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        lines = content.split('\n')
        start_line = -1
        
        for i, line in enumerate(lines):
            if 'async function handleAdminLogin() {' in line:
                start_line = i
                break
                
        if start_line != -1:
            new_logic = """        async function handleAdminLogin() {
            const password = document.getElementById('adminPassword')?.value;
            const loginBtn = document.querySelector('#loginStep1 .btn-confirm');
            
            if (!password) {
                showMenuNotification('❌ Vui lòng nhập mật mã.', 'error');
                return;
            }
            
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Đang kiểm tra...';
            }

            const roleMap = {
                '0301': { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' },
                '03011': { role: 'branch_admin', branch: 'branch_flora', label: 'Admin - Florastraße' },
                '03012': { role: 'branch_admin', branch: 'branch_haupt', label: 'Admin - Hauptstraße' }
            };
            
            const matched = roleMap[password];
            if (matched) {
                showMenuNotification('✅ Mật mã chính xác. Đang vào hệ thống...', 'success');
                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_role', JSON.stringify(matched));
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass');
                
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) loginModal.style.display = 'none';
                
                const adminStatus = document.getElementById('adminStatus');
                if (adminStatus) adminStatus.textContent = '👑 ' + matched.label;
                
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) logoutBtn.style.display = 'block';
                
                const statsBtnBypass = document.querySelector('.admin-tab[data-tab="stats"]');
                if (statsBtnBypass && matched.role === 'owner') statsBtnBypass.style.display = 'flex';

                if (typeof updateAdminRoleBadge === 'function') updateAdminRoleBadge();
                if (typeof loadOrders === 'function') loadOrders();
                if (typeof loadReservations === 'function') loadReservations();
            } else {
                showMenuNotification('❌ Sai mật mã. Vui lòng thử lại.', 'error');
            }

            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Tiếp tục';
            }
        }"""
            
            idx = start_line
            open_braces = 0
            found_braces = False
            while idx < len(lines):
                open_braces += lines[idx].count('{')
                open_braces -= lines[idx].count('}')
                if '{' in lines[idx] or '}' in lines[idx]:
                    found_braces = True
                if found_braces and open_braces == 0 and idx > start_line:
                    break
                idx += 1
            
            if idx < len(lines):
                lines[start_line:idx+1] = new_logic.split('\n')
                
                with open(file, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(lines))
                print(f"Successfully replaced handleAdminLogin in {file}")
            else:
                print(f"Could not find matching brace in {file}")
