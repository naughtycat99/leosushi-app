const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const targetLine = "if (document.hidden || window.__loadOrdersRunning || typeof loadOrders !== 'function') return;";
const replacementLine = "if (window.__loadOrdersRunning || typeof loadOrders !== 'function') return;";

if (content.includes(targetLine)) {
    content = content.replace(targetLine, replacementLine);
    console.log('Successfully replaced document.hidden check');
} else {
    console.log('Could not find target line');
}

const visibilityLogic = `
        // Fetch immediately when coming back from background
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (!window.__loadOrdersRunning && typeof loadOrders === 'function') {
                    loadOrders(true, true).catch(e => console.log('Visibility polling error:', e));
                }
            }
        });
`;

if (!content.includes('visibilitychange')) {
    content = content.replace('// Setup polling for browser clients', visibilityLogic + '\n        // Setup polling for browser clients');
    console.log('Successfully added visibilitychange listener');
}

fs.writeFileSync('admin.html', content, 'utf8');
