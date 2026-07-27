const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /<div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between;">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="admin-stats">/;
const match = content.match(regex);

if (match) {
    console.log(match[0].substring(0, 2000));
} else {
    console.log("No match found for the header block");
}
