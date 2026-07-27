const fs = require('fs');
let content = fs.readFileSync('admin.bak.html', 'utf8');
const idx = content.indexOf('filterOrdersByStatus(\'cancelled\')');
if (idx !== -1) {
    console.log(content.substring(idx, idx+1500));
}
