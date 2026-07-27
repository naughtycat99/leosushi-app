import re

def fix(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()

    # 1. Update maxlength and placeholder
    # Search for id="masterKeyInput" and change maxlength
    text = re.sub(r'(id="masterKeyInput".*?)maxlength="4"', r'\1maxlength="5"', text, flags=re.DOTALL)
    
    # 2. Fix corrupted Vietnamese text (ANSI to UTF-8 mistakes)
    # Looking at the earlier output:
    text = text.replace('M-t mA Ch  (4 s`)', 'Mật mã Chủ (4-5 số)')
    text = text.replace('M-t mA Ch  (4 s`)', 'Mật mã Chủ (4-5 số)')
    text = text.replace('VA?O TRANG QUN\n                          TRS', 'VÀO TRANG QUẢN TRỊ')
    text = text.replace('VA?O TRANG QUN TRS', 'VÀO TRANG QUẢN TRỊ')
    text = text.replace('VA?O TRANG\nQUN\n                          TRS', 'VÀO TRANG QUẢN TRỊ')
    text = text.replace('VA?O TRANG QUN TRS', 'VÀO TRANG QUẢN TRỊ')
    text = text.replace('L`i vAo bo m-t cho qun lA vA ch  nhA hAng', 'Lối vào bảo mật cho quản lý và chủ nhà hàng')
    text = text.replace('o. M-t mA Ch  chA-nh xAc. ?ang vAo h th`ng...', '✅ Mật mã Chủ chính xác. Đang vào hệ thống...')
    text = text.replace('?O M-t mA Ch  khA?ng ?Ang!', '❌ Mật mã Chủ không đúng!')
    
    # 3. Replace handleMasterLogin
    old_func_pattern = r'async function handleMasterLogin\(\) \{.*?// Cleanup inputs'
    
    new_func = '''async function handleMasterLogin() {
            const key = document.getElementById('masterKeyInput')?.value;
            const roleMap = {
                '0301': { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' },
                '03011': { role: 'branch_admin', branch: 'branch_flora', label: 'Admin - Florastraße' },
                '03012': { role: 'branch_admin', branch: 'branch_haupt', label: 'Admin - Hauptstraße' }
            };
            
            const matched = roleMap[key];
            if (matched) {
                showMenuNotification('✅ Mật mã chính xác. Đang vào hệ thống...', 'success');

                // Force set persistent tokens immediately
                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_role', JSON.stringify(matched));
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

                // Hide modal immediately and forcefully
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) {
                    loginModal.style.display = 'none';
                    // Add a marker to prevent re-opening for a few seconds during transition
                    loginModal.setAttribute('data-bypass-active', 'true');
                }

                // Cleanup inputs'''
                
    text = re.sub(old_func_pattern, new_func, text, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix('admin.html')
fix('tmp-live-admin.html')
