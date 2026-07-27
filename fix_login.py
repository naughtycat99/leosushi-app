import os
import re

files = ['admin.html', 'tmp-live-admin.html']

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Intercept logic to inject
        intercept_logic = '''
            // INTERCEPT MASTER KEYS HERE
            const roleMap = {
                \\'0301\\': { role: \\'owner\\', branch: null, label: \\'Chủ - Tất cả chi nhánh\\' },
                \\'03011\\': { role: \\'branch_admin\\', branch: \\'branch_flora\\', label: \\'Admin - Florastraße\\' },
                \\'03012\\': { role: \\'branch_admin\\', branch: \\'branch_haupt\\', label: \\'Admin - Hauptstraße\\' }
            };
            const matched = roleMap[password];
            if (matched) {
                showMenuNotification(\\'✅ Mật mã chính xác. Đang vào hệ thống...\\', \\'success\\');
                localStorage.setItem(\\'leo_admin_logged_in\\', \\'true\\');
                localStorage.setItem(\\'leo_admin_role\\', JSON.stringify(matched));
                localStorage.setItem(\\'leo_admin_session_token\\', \\'master_session_bypass\\');
                
                const loginModal = document.getElementById(\\'adminLoginModal\\');
                if (loginModal) loginModal.style.display = \\'none\\';
                
                const adminStatus = document.getElementById(\\'adminStatus\\');
                if (adminStatus) adminStatus.textContent = \\'✅ \\' + matched.label;
                
                const logoutBtn = document.getElementById(\\'logoutBtn\\');
                if (logoutBtn) logoutBtn.style.display = \\'block\\';
                
                if (typeof updateAdminRoleBadge === \\'function\\') updateAdminRoleBadge();
                if (typeof loadOrders === \\'function\\') loadOrders();
                if (typeof loadReservations === \\'function\\') loadReservations();
                return;
            }
'''

        # Find handleAdminLogin
        match = re.search(r'async function handleAdminLogin\(\) \{\s*const password = document\.getElementById\([^)]+\)\?\.value;', content)
        if match:
            pos = match.end()
            new_content = content[:pos] + intercept_logic + content[pos:]
            
            # Check if already injected
            if 'INTERCEPT MASTER KEYS HERE' not in content:
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Successfully injected intercept logic into {file}')
            else:
                print(f'{file} already has the intercept logic.')
        else:
            print(f'Could not find handleAdminLogin signature in {file}')

