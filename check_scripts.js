const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const regex = /<script[^>]*src="([^"]+)"/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(match[1]);
}
