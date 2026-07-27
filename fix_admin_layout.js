const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const s = content.indexOf('<div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between;">');
const end = content.indexOf('</div>', content.indexOf('<button class="nav-btn" onclick="loadAllData()"')) + 6;

if (s !== -1 && end !== -1) {
    const original = content.substring(s, end + 6); // Extra </div>
    
    // Create new structure
    const newHtml = `
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
                                <input type="checkbox" id="autoPrintToggle" style="width: 16px; height: 16px; accent-color: var(--gold); cursor: pointer;">
                                <i>🖨️</i> Tự động in
                            </label>
                            <button class="nav-btn" onclick="window.print()" title="In danh sách" style="width: 34px; height: 34px; border-radius: 50%; background: #fff; color: #1a1a1a; border: none; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; padding: 0;">
                                🖨️
                            </button>
                            <button class="nav-btn" onclick="loadAllData()" title="Làm mới" style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: #fff; border: none; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; padding: 0;">
                                🔄
                            </button>
                        </div>
                    </div>
                </div>`;
                
    content = content.replace(original.trim(), newHtml.trim());
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log("Successfully updated admin.html layout");
} else {
    console.log("Could not find the block");
}
