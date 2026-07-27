const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const searchList = ['floating-actions', 'install', 'refresh-btn"'];

for (const term of searchList) {
    const idx = content.indexOf(term);
    if (idx !== -1) {
        console.log(`Found ${term}:`);
        console.log(content.substring(Math.max(0, idx - 200), idx + 500));
    }
}
