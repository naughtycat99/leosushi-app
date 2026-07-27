const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const match = content.match(/<div[^>]*id="([^"]*)"[^>]*class="admin-content"/g) || content.match(/<div[^>]*class="admin-content"[^>]*id="([^"]*)"/g);
console.log(match);
