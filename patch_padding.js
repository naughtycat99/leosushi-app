const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /\.admin-container\s*\{\s*padding:\s*12px;\s*max-width:\s*100%;\s*\}/;
const replacement = `.admin-container {
                padding: 12px;
                max-width: 100%;
                padding-bottom: 100px !important;
            }`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully patched padding-bottom');
} else {
    console.log('Regex not found!');
}
