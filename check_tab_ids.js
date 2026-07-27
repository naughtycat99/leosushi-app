const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const match = content.match(/<div[^>]*id="tab-[^"]*"/g);
if (match) {
    console.log(match);
}
