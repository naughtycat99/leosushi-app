const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('id="tab-menu"');
if (s !== -1) {
    console.log(content.substring(Math.max(0, s - 100), s + 1000));
}
