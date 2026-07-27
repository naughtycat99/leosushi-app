const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('adminStatus');
if (s !== -1) {
    const start = content.lastIndexOf('<div', s);
    console.log(content.substring(Math.max(0, start - 200), s + 1200));
}
