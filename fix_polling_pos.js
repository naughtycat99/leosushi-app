const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Find the stray block at the end
const strayBlock = `
        // Setup polling for browser clients
        if (!window._adminPollingInterval) {
            window._adminPollingInterval = setInterval(() => {
                if (document.hidden || window.__loadOrdersRunning || typeof loadOrders !== 'function') return;
                if (window.isConfirmingOrder) return;
                loadOrders(true, true).catch(e => console.log('Polling error:', e));
            }, 8000);
        }
    `;

// Remove it if it exists exactly
let newContent = content.replace(strayBlock, '');

// Sometimes it's slightly different whitespace, let's use regex to remove it if exact match fails
newContent = newContent.replace(/\s*\/\/\s*Setup polling for browser clients[\s\S]*?\}, 8000\);\s*\}/, '');

// Now inject it right before the LAST </script> tag
const lastScriptTagIndex = newContent.lastIndexOf('</script>');
if (lastScriptTagIndex !== -1) {
    newContent = newContent.substring(0, lastScriptTagIndex) + strayBlock + '\n' + newContent.substring(lastScriptTagIndex);
    fs.writeFileSync('admin.html', newContent, 'utf8');
    console.log('Successfully moved polling code inside script tag.');
} else {
    console.log('Could not find </script> tag');
}
