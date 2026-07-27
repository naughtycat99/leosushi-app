const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('handleAdminLogin()');
console.log(content.substring(Math.max(0, s - 50), s + 500));
