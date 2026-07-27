const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /<div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between;">([\s\S]*?)<button class="nav-btn"/;
const match = content.match(regex);

if (match) {
    console.log(match[0].substring(0, 1500));
} else {
    console.log("No match found for the header block");
}
