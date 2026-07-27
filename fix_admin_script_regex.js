const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /<script>\s*let adminMenuData = \[\];[\s\S]*?setTimeout\(loadStoreStatus, 1000\);\s*<\/script>/;
const match = content.match(regex);

if (match) {
    const extractedScript = match[0];
    
    // Remove the script from its current position
    content = content.replace(extractedScript, '');
    
    // Put it at the very end of the file (after </html> or before it)
    const lastHtmlIdx = content.lastIndexOf('</html>');
    if (lastHtmlIdx !== -1) {
        content = content.substring(0, lastHtmlIdx) + extractedScript + '\n' + content.substring(lastHtmlIdx);
    } else {
        content += '\n' + extractedScript;
    }
    
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully fixed admin.html script injection point via regex');
} else {
    console.log('Could not find the script block to move using regex.');
}
