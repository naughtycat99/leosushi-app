import os
import re

files = ['www/admin.html', 'www/tmp-live-admin.html']

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix the SyntaxError first
        content = content.replace(r"\'", "'")
        
        # Replace the entire modal content
        new_modal_content = '''<div class="admin-login-content" style="position: relative; max-width: 420px;">
                <button onclick="document.getElementById('adminLoginModal').style.display='none'"
                    style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: rgba(255,255,255,0.3); font-size: 22px; cursor: pointer; z-index: 10;">×</button>
                <h2>🍣 Đăng nhập Quản trị</h2>

                <div>
                    <!-- Step 1: Password -->
                    <div id="loginStep1" style="display: block;">
                        <p style="color: rgba(255, 255, 255, 0.6); font-size: 13px; margin-bottom: 20px; text-align: center;">
                            Vui lòng nhập mật mã để truy cập
                        </p>
                        <input type="password" id="adminPassword" class="admin-password-input"
                            placeholder="Nhập mật khẩu" autocomplete="current-password"
                            onkeypress="if(event.key==='Enter') handleAdminLogin()">
                        <button class="btn-action btn-confirm" onclick="handleAdminLogin()">Tiếp tục</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-header">'''
        
        content = re.sub(r'<div class="admin-login-content" style="position: relative; max-width: 420px;">.*?<div class="admin-header">', new_modal_content, content, flags=re.DOTALL)

        # Replace handleAdminLogin logic cleanly
        new_script_logic = '''// Handle admin login - ONLY MASTER KEYS
        async function handleAdminLogin() {
            const password = document.getElementById('adminPassword')?.value;
            const loginBtn = document.querySelector('#loginStep1 .btn-confirm');
            
            if (!password) {
                showMenuNotification('❌ Vui lòng nhập mật khẩu.', 'error');
                return;
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
                
                if (typeof updateAdminRoleBadge === 'function') updateAdminRoleBadge();
                if (typeof loadOrders === 'function') loadOrders();
                if (typeof loadReservations === 'function') loadReservations();
            } else {
                showMenuNotification('❌ Sai mật khẩu. Vui lòng thử lại.', 'error');
            }
        }
'''
        content = re.sub(r'// Handle admin login - Step 1: Send verification code.*?async function handleAdminLogin\(\) \{.*?(?=// 4\. Logout)[\s\S]*?(?=\s*function logoutAdmin\(\))', new_script_logic, content, flags=re.DOTALL)

        # Remove the handleVerifyCode and resendVerificationCode functions which are now useless
        content = re.sub(r'// Step 2: Verify code.*?async function handleVerifyCode\(\) \{.*?(?=// Resend code)', '', content, flags=re.DOTALL)
        content = re.sub(r'// Resend code.*?async function resendVerificationCode\(\) \{.*?(?=// 4\. Logout)', '', content, flags=re.DOTALL)
        content = re.sub(r'function backToPasswordStep\(\) \{.*?(?=// Handle admin login)', '', content, flags=re.DOTALL)

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Completely rewrote login logic in {file}')
