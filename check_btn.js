const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const s = content.indexOf('id="install');
if (s !== -1) {
    console.log("Found install:");
    console.log(content.substring(Math.max(0, s - 100), s + 300));
} else {
    // maybe it's pwa
    const pwa = content.indexOf('pwa');
    if (pwa !== -1) {
        console.log("Found pwa:");
        console.log(content.substring(Math.max(0, pwa - 100), pwa + 300));
    }
}
// check for buttons at the bottom right corner
const btn = content.indexOf('refresh-btn');
if (btn !== -1) {
    console.log("Found refresh-btn:");
    console.log(content.substring(Math.max(0, btn - 300), btn + 500));
}
