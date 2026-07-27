const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<div id="menuContent"');
if (s !== -1) {
    const e = content.indexOf('<div id="discount-codesContent"');
    console.log(content.substring(Math.max(0, s), Math.min(e, s + 2000)));
}
