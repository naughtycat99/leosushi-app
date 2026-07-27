import os
def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Update maxlength and placeholder
    text = text.replace('Mật mã Chủ (4 số)', 'Mật mã Chủ (4-5 số)')
    text = text.replace('maxlength="4"', 'maxlength="5"')
    
    old_func = '''            async function handleMasterLogin() {
                const key = document.getElementById('masterKeyInput')?.value;
                if (key === '0301') {
                    showMenuNotification('✅ Mật mã Chủ chính xác. Đang vào hệ thống...', 'success');
                    localStorage.setItem('leo_admin_logged_in', 'true');
                    localStorage.setItem('leo_admin_role', 'owner');
                    localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

                    const loginModal = document.getElementById('adminLoginModal');
                    if (loginModal) {
                        loginModal.style.display = 'none';
                        loginModal.setAttribute('data-bypass-active', 'true');
                    }

                    const masterInput = document.getElementById('masterKeyInput');
                    if (masterInput) masterInput.value = '';

                    await checkAdminLogin();
                    await loadAllData(false);
                    if (typeof switchTab === 'function') switchTab('orders');
                } else {
                    showMenuNotification('❌ Mật mã Chủ không đúng!', 'error');
                }
            }'''
            
    new_func = '''            async function handleMasterLogin() {
                const key = document.getElementById('masterKeyInput')?.value;
                const roleMap = {
                    '0301': { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' },
                    '03011': { role: 'branch_admin', branch: 'branch_flora', label: 'Admin - Florastraße' },
                    '03012': { role: 'branch_admin', branch: 'branch_haupt', label: 'Admin - Hauptstraße' }
                };
                
                const matched = roleMap[key];
                if (matched) {
                    showMenuNotification('✅ Mật mã chính xác. Đang vào hệ thống...', 'success');
                    localStorage.setItem('leo_admin_logged_in', 'true');
                    localStorage.setItem('leo_admin_role', JSON.stringify(matched));
                    localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

                    const loginModal = document.getElementById('adminLoginModal');
                    if (loginModal) {
                        loginModal.style.display = 'none';
                        loginModal.setAttribute('data-bypass-active', 'true');
                    }

                    const masterInput = document.getElementById('masterKeyInput');
                    if (masterInput) masterInput.value = '';

                    await checkAdminLogin();
                    await loadAllData(false);
                    if (typeof switchTab === 'function') switchTab('orders');
                } else {
                    showMenuNotification('❌ Mật mã không đúng!', 'error');
                }
            }'''
            
    text = text.replace(old_func, new_func)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

update_file('admin.html')
update_file('tmp-live-admin.html')
