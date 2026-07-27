const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const targetLine = "window.__loadOrdersRunning = true;";
const replacementLine = `window.__loadOrdersRunning = true;
            if (window.__loadOrdersTimeout) clearTimeout(window.__loadOrdersTimeout);
            window.__loadOrdersTimeout = setTimeout(() => {
                if (window.__loadOrdersRunning) {
                    console.warn('⚠️ loadOrders timeout! Forcing reset of __loadOrdersRunning flag to prevent hanging.');
                    window.__loadOrdersRunning = false;
                }
            }, 15000);`;

if (content.includes(targetLine)) {
    content = content.replace(targetLine, replacementLine);
    console.log('Successfully patched loadOrders with failsafe timeout');
    fs.writeFileSync('admin.html', content, 'utf8');
} else {
    console.log('Could not find target line');
}
