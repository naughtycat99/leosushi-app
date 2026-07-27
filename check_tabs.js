const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('class="admin-tabs"');
if (s !== -1) {
    console.log(content.substring(Math.max(0, s), s + 1000));
}
