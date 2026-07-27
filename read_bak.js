const fs = require('fs');
let content = fs.readFileSync('admin.bak.html', 'utf8');
const s = content.indexOf('function renderOrderCard');
if (s !== -1) {
    const end = content.indexOf('<div class="card-info">', s);
    console.log(content.substring(s, end + 300));
}
