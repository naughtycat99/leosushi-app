const fs = require('fs');
let content = fs.readFileSync('js/menu.js', 'utf8');
const s = content.indexOf('const card = document.createElement(\'div\')');
if (s !== -1) {
    console.log(content.substring(s, s + 1500));
}
