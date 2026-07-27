const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<div class="admin-container"');
if (s !== -1) {
    console.log(content.substring(s, s + 500));
}
