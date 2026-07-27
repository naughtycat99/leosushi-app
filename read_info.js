const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<div class="card-info">');
const e = content.indexOf('<div class="card-actions">', s);
console.log(content.substring(s, e));
