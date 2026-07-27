const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const btn = content.indexOf('refresh-btn');
if (btn !== -1) {
    const start = content.lastIndexOf('<', btn);
    console.log(content.substring(start - 400, start + 800));
}
