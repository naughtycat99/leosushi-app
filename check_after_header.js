const fs = require('fs');
let content = fs.readFileSync('tmp-live-admin.html', 'utf8');
const s = content.indexOf('<div class="admin-header">');
console.log(content.substring(Math.max(0, s + 1300), s + 1700));
