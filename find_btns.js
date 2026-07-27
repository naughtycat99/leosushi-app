const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('class="refresh-btn');
if (s !== -1) {
    console.log(content.substring(s - 100, s + 1000));
}
