const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
content = content.replace('menuItemEventHandler = function (e) {', 'menuItemEventHandler = async function (e) {');
fs.writeFileSync('admin.html', content, 'utf8');
console.log('Fixed async function error');
