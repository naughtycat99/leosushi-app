const fs = require('fs');

let adminHtml = fs.readFileSync('admin.html', 'utf8');

// 1. Update switchTab
const oldSwitchTab = `            } else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                AdminStats.loadStats();
            }
        }
        window.switchTab = switchTab;`;

const newSwitchTab = `            } else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                AdminStats.loadStats();
            } else if (tabId === 'menu') {
                if (typeof loadMenuItems === 'function') loadMenuItems();
            }
        }
        window.switchTab = switchTab;`;

if (adminHtml.includes(oldSwitchTab)) {
    adminHtml = adminHtml.replace(oldSwitchTab, newSwitchTab);
    console.log('Patched switchTab');
} else {
    console.log('Could not find switchTab target block');
}

// 2. Update loadAllData
const oldLoadAllData = `            // Load customers but don't fail if permissions error
            try {
                await loadCustomers();
            } catch (error) {
                console.warn('Could not load customers (permissions issue):', error);
                // Continue even if customers fail to load
            }
        }`;

const newLoadAllData = `            // Load customers but don't fail if permissions error
            try {
                await loadCustomers();
            } catch (error) {
                console.warn('Could not load customers (permissions issue):', error);
                // Continue even if customers fail to load
            }
            
            try {
                if (typeof loadMenuItems === 'function') await loadMenuItems();
            } catch (error) {
                console.warn('Could not load menu items:', error);
            }
        }`;

if (adminHtml.includes(oldLoadAllData)) {
    adminHtml = adminHtml.replace(oldLoadAllData, newLoadAllData);
    console.log('Patched loadAllData');
} else {
    console.log('Could not find loadAllData target block');
}

fs.writeFileSync('admin.html', adminHtml, 'utf8');
