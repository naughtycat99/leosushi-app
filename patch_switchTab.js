const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /\} else if \(tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats\.loadStats === 'function'\) \{\s*AdminStats\.loadStats\(\);\s*\}/;

const newSwitchTab = `} else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                AdminStats.loadStats();
            } else if (tabId === 'menu') {
                if (typeof loadMenuItems === 'function') loadMenuItems();
            }`;

if (regex.test(content)) {
    content = content.replace(regex, newSwitchTab);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully patched switchTab in admin.html');
} else {
    console.log('Failed to find target in switchTab');
}
