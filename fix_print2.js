const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /<\/div>\s*\/\/\s*Setup polling for browser clients[\s\S]*?\}, 8000\);\s*\}/g;

content = content.replace(regex, '</div>');

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Successfully removed stray JS from HTML template.');
