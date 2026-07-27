const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s1 = content.indexOf('<div class="admin-header">');
const s2 = content.indexOf('<div class="admin-layout">');
const s3 = content.indexOf('<div class="main-content">');
console.log('s1', s1, 's2', s2, 's3', s3);
