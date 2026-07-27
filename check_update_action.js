const fs = require('fs');
let content = fs.readFileSync('api/menu.php', 'utf8');
const s = content.indexOf('case \'update\':');
if (s !== -1) {
    console.log(content.substring(Math.max(0, s), s + 500));
}
