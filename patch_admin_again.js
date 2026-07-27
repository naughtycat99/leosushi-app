const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// 1. Remove redundant buttons
content = content.replace(/<button class="refresh-btn" onclick="event\.stopPropagation\(\); exportAllData\(\)".*?<\/button>/s, '');
content = content.replace(/<button class="refresh-btn" onclick="event\.stopPropagation\(\); injectMockData\(\)".*?<\/button>/s, '');

// 2. Add the toggle switch
if (!content.includes('id="storeStatusToggle"')) {
    const adminStatusRegex = /<span id="adminStatus".*?<\/span>/;
    const match = content.match(adminStatusRegex);
    if (match) {
        const toggleHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-left: 20px;">
                        <span style="color: #fff; font-size: 14px; font-weight: bold;">Nhận đơn:</span>
                        <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
                            <input type="checkbox" id="storeStatusToggle" checked onchange="toggleStoreStatus(this.checked)" style="opacity: 0; width: 0; height: 0;">
                            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>`;
        content = content.replace(match[0], match[0] + toggleHtml);
    } else {
        console.log("Could not find adminStatus to insert toggle");
    }
}

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Successfully patched admin.html');
