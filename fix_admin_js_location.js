const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// The JS starts with `let adminMenuData = [];` inside the leaflet script tag
const startStr = '        let adminMenuData = [];';
const endStr = 'setTimeout(loadStoreStatus, 1000);';

const s = content.indexOf(startStr);
const e = content.indexOf(endStr);

if (s !== -1 && e !== -1) {
    const extractedJS = content.substring(s, e + endStr.length);
    
    // Remove the extracted JS from its current location
    content = content.substring(0, s) + content.substring(e + endStr.length);
    
    // Add it just before </body> or at the end
    const scriptTag = `\n<script>\n${extractedJS}\n</script>\n`;
    
    const bodyEnd = content.indexOf('</body>');
    if (bodyEnd !== -1) {
        content = content.substring(0, bodyEnd) + scriptTag + content.substring(bodyEnd);
    } else {
        content += scriptTag;
    }
    
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully fixed admin.html JS location');
} else {
    console.log('Could not find the injected JS block');
}
