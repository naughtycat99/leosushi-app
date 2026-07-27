const fs = require('fs');
let content = fs.readFileSync('tmp-live-admin.html', 'utf8');
const s3 = content.indexOf('<div class="main-content">');
console.log('s3 in backup:', s3);
