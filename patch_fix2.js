const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// The regex will match from <script> down to </script> exactly.
const regex = /<script>\s*\/\/ Auto-WakeLock for POS to keep screen ON[\s\S]*?<\/script>/;

const matches = content.match(regex);
if (matches) {
    // If we find it inside the template literal, replace it with nothing (and add </body> back)
    // Wait, replacing it with `</body>` is necessary because I previously removed `</body>`
    content = content.replace(regex, '</body>');
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully wiped the inner WakeLock script and restored </body>');
} else {
    console.log('Not found');
}
