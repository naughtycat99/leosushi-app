const fs = require('fs');
let content = fs.readFileSync('tmp-live-admin.html', 'utf8');
const s = content.indexOf('<div class="admin-sidebar">');
if (s !== -1) {
    console.log(content.substring(Math.max(0, s - 200), s + 1000));
} else {
    console.log('Not found');
}
