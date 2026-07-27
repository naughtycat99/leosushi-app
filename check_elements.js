const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
if (content.includes("switchTab('menu')")) {
    console.log("Menu tab exists");
} else {
    console.log("Menu tab DOES NOT exist");
}
if (content.includes('id="storeStatusToggle"')) {
    console.log("Toggle exists");
} else {
    console.log("Toggle DOES NOT exist");
}
