const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const match = content.match(/<div[^>]*class="tab-content[^>]*id="[^"]*"/g) || content.match(/<div[^>]*id="[^"]*"[^>]*class="tab-content"/g) || content.match(/class="admin-content"/g);
console.log(match);
