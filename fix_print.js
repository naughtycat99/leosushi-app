const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const searchTarget = `background:#666; color:#fff; border:none; border-radius:4px; margin-left:8px;">✕ Schließen</button>\n  </div>`;

let s = content.indexOf(searchTarget);
if (s !== -1) {
    let injectIndex = s + searchTarget.length;
    let afterInject = content.indexOf('</body>', injectIndex);
    let chunk = content.substring(injectIndex, afterInject);
    
    // We just remove the injected JS text from the HTML string here
    chunk = chunk.replace(/\/\/\s*Setup polling for browser clients[\s\S]*?\}, 8000\);\s*\}/, '');
    content = content.substring(0, injectIndex) + chunk + content.substring(afterInject);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully removed stray JS from HTML print template');
} else {
    console.log('Target not found');
}
