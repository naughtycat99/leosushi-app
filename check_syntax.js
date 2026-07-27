const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Find the last <script> tag which should contain our code
const s = content.lastIndexOf('<script>');
if (s !== -1) {
    const scriptContent = content.substring(s);
    console.log(scriptContent.substring(0, 500));
    
    // Write it to a temp js file and check syntax
    fs.writeFileSync('temp_script.js', scriptContent.replace('<script>', '').replace('</script>', '').replace('</body>', '').replace('</html>', ''), 'utf8');
} else {
    console.log('No script tag found at the end.');
}
