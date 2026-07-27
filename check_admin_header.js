const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<div class="admin-header">');
if (s !== -1) {
    console.log(content.substring(s, s + 1000));
} else {
    console.log("admin-header not found");
}

const buttonsRegex = /<div class="admin-header-actions">([\s\S]*?)<\/div>/;
const match = content.match(buttonsRegex);
if (match) {
    console.log("Actions:");
    console.log(match[0]);
}

const bottomNav = content.indexOf('<div class="bottom-nav">');
if (bottomNav !== -1) {
    console.log("Bottom nav:");
    console.log(content.substring(bottomNav, bottomNav + 1000));
}
