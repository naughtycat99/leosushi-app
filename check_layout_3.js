const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('adminStatus');
console.log(content.substring(Math.max(0, s - 300), s + 1000));
