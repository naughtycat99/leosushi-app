const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Find the injected script tag inside the template string
const scriptStartStr = '<script>\n        let adminMenuData = [];';
const scriptEndStr = '        setTimeout(loadStoreStatus, 1000);\n\n</script>';

const s = content.indexOf(scriptStartStr);
const e = content.indexOf(scriptEndStr);

if (s !== -1 && e !== -1) {
    const extractedScript = content.substring(s, e + scriptEndStr.length);
    
    // Remove the script from inside the template string
    content = content.replace(extractedScript, '');
    
    // Put it at the very end of the file (after </html> or before it)
    const lastHtmlIdx = content.lastIndexOf('</html>');
    if (lastHtmlIdx !== -1) {
        content = content.substring(0, lastHtmlIdx) + extractedScript + '\n' + content.substring(lastHtmlIdx);
    } else {
        content += '\n' + extractedScript;
    }
    
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully fixed admin.html script injection point');
} else {
    console.log('Could not find the script block to move.');
}
