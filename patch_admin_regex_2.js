const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

// 1. Update switchTab
const oldSwitchTab = "} else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {\\s+AdminStats\\.loadStats\\(\\);\\s+}";
const newSwitchTab = `} else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                AdminStats.loadStats();
            } else if (tabId === 'menu') {
                if (typeof loadMenuItems === 'function') loadMenuItems();
            }`;

if (adminHtml.match(new RegExp(oldSwitchTab))) {
    adminHtml = adminHtml.replace(new RegExp(oldSwitchTab), newSwitchTab);
    console.log('Patched switchTab');
} else {
    console.log('Could not find switchTab target block');
}

// 2. Update loadAllData
const oldLoadAllData = "await loadCustomers\\(\\);\\s+} catch \\(error\\) {\\s+console\\.warn\\('Could not load customers \\(permissions issue\\):', error\\);\\s+// Continue even if customers fail to load\\s+}";
const newLoadAllData = `await loadCustomers();
            } catch (error) {
                console.warn('Could not load customers (permissions issue):', error);
                // Continue even if customers fail to load
            }
            try {
                if (typeof loadMenuItems === 'function') await loadMenuItems();
            } catch (error) {
                console.warn('Could not load menu items:', error);
            }`;

if (adminHtml.match(new RegExp(oldLoadAllData))) {
    adminHtml = adminHtml.replace(new RegExp(oldLoadAllData), newLoadAllData);
    console.log('Patched loadAllData');
} else {
    console.log('Could not find loadAllData target block');
}

fs.writeFileSync('admin.html', adminHtml, 'utf8');
