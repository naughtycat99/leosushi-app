const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<div class="admin-header">');
const e = content.indexOf('<div class="admin-layout">');
console.log(content.substring(s, e + 30));
