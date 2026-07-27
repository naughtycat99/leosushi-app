const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const startStr = '<script>\n        // Auto-WakeLock for POS to keep screen ON';
const endStr = '});\n</script>';

const idxStart = content.indexOf(startStr);
if (idxStart !== -1) {
    const idxEnd = content.indexOf(endStr, idxStart);
    if (idxEnd !== -1) {
        const block = content.substring(idxStart, idxEnd + endStr.length);
        // We replace this block with </body>
        content = content.replace(block, '</body>');
        fs.writeFileSync('admin.html', content, 'utf8');
        console.log('Successfully removed stray wake lock script');
    } else {
        console.log('End not found');
    }
} else {
    console.log('Start not found');
}
