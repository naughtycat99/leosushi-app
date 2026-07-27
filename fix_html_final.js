const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const s = content.indexOf('<!-- Login Modal -->');
const e = content.indexOf('<div class="admin-stats" id="adminStatsHeader" style="display: none;">');

if (s !== -1 && e !== -1) {
    const newBlock = `<!-- Login Modal -->
        <div id="adminLoginModal" class="admin-login-modal" style="display: none; z-index: 9999;">
            <div class="admin-login-content" style="position: relative; max-width: 420px;">
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
                            placeholder="Nhập mật mã..."
                            onkeypress="if(event.key==='Enter') { event.stopPropagation(); handleAdminLogin(); }">
                        <button class="btn-action btn-confirm" onclick="event.stopPropagation(); handleAdminLogin()">Tiếp tục</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="admin-header">
            <div>
                <div>
                    <h1>🍣 LEO SUSHI Admin Panel <span
                            style="font-size: 14px; color: var(--gold); opacity: 0.6; font-weight: normal; vertical-align: middle;">v1.1</span>
                    </h1>
                    <p style="color: rgba(255,255,255,.7); margin: 0;">Verwaltung von Bestellungen und Reservierungen
                    </p>
                </div>
                <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                    <span id="adminStatus" style="color: rgba(255,255,255,.7); display: block; white-space: nowrap;"></span>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                        <!-- Store Status Toggle -->
                        <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                            <span style="color: #fff; font-size: 14px; font-weight: bold;">Nhận đơn:</span>
                            <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 24px; margin: 0;">
                                <input type="checkbox" id="storeStatusToggle" checked onchange="toggleStoreStatus(this.checked)" style="opacity: 0; width: 0; height: 0; position: absolute; margin: 0;">
                                <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Print Controls -->
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <label style="display: flex; align-items: center; gap: 8px; background: rgba(229, 207, 142, 0.1); padding: 6px 15px; border-radius: 20px; border: 1px solid rgba(229, 207, 142, 0.3); font-size: 13px; color: var(--gold); cursor: pointer; user-select: none; transition: all 0.3s; margin: 0;">
                                <input type="checkbox" id="autoPrintToggle" onchange="toggleAutoPrint(this.checked)" style="width: 16px; height: 16px; accent-color: var(--gold); cursor: pointer;">
                                <i>🖨️</i> Tự động in
                            </label>

                            <!-- Floating Auto-Print Log Panel -->
                            <div id="autoPrintLogPanel"
                                style="display: none; position: fixed; bottom: 10px; right: 10px; width: 320px; max-height: 220px; background: rgba(10,10,15,0.95); border: 1px solid rgba(229,207,142,0.4); border-radius: 12px; z-index: 9999; font-size: 11px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); overflow: hidden;">
                                <div onclick="document.getElementById('autoPrintLogBody').style.display = document.getElementById('autoPrintLogBody').style.display === 'none' ? 'block' : 'none'"
                                    style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(229,207,142,0.15); cursor: pointer; user-select: none;">
                                    <span style="color: var(--gold); font-weight: bold;">🖨️ Auto-Print Log</span>
                                    <span id="autoPrintStatus" style="color: #10b981; font-size: 10px;">● ĐANG BẬT</span>
                                </div>
                                <div id="autoPrintLogBody" style="max-height: 170px; overflow-y: auto; padding: 6px 10px;">
                                    <div id="autoPrintLogEntries" style="color: rgba(255,255,255,0.7); line-height: 1.6;">
                                    </div>
                                </div>
                            </div>

                            <button class="nav-btn" onclick="event.stopPropagation(); showPrinterMenu()" id="btnActionPrint" title="In danh sách" style="width: 34px; height: 34px; border-radius: 50%; background: #fff; color: #1a1a1a; border: none; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; padding: 0;">
                                🖨️
                            </button>
                            <button class="nav-btn" onclick="event.stopPropagation(); loadAllData()" id="btnActionRefresh" title="Làm mới" style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; padding: 0;">
                                🔄
                            </button>
                            <button class="btn-action btn-view" onclick="event.stopPropagation(); handleAdminLogout()" id="logoutBtn"
                            style="display: none; width: auto; margin: 0; padding: 8px 16px;">Abmelden</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
    content = content.substring(0, s) + newBlock + content.substring(e);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully fixed the entire block!');
} else {
    console.log('Could not find boundaries');
}
