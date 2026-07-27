const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('class="bottom-nav"');
if (s !== -1) {
    fs.writeFileSync('nav.txt', content.substring(s - 50, s + 1000), 'utf8');
}
