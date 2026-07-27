const fs = require('fs');
let content = fs.readFileSync('js/api.js', 'utf8');

// Remove the dangling `}\n)();` at the end of the file
content = content.replace(/\}\s*\)\(\);\s*$/g, '');

fs.writeFileSync('js/api.js', content, 'utf8');
console.log('Fixed api.js EOF');
