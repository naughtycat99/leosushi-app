const fs = require('fs');
let content = fs.readFileSync('tmp-live-admin.html', 'utf8');
const s = content.indexOf('<div class="admin-sidebar">');
console.log(content.substring(Math.max(0, s), s + 1000));
