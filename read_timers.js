const fs = require('fs');
let content = fs.readFileSync('admin.bak.html', 'utf8');
const s = content.indexOf('<div class="order-timers"');
if (s !== -1) {
    const end = content.indexOf('<div class="card-actions"', s);
    console.log(content.substring(s, end));
}
