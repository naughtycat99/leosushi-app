const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf("setItem('leo_admin_role'");
if (s !== -1) {
    console.log(content.substring(Math.max(0, s - 500), s + 1000));
}
