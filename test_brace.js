const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// replace strings and regexes with empty space so they don't mess up brace counting
content = content.replace(/\/\*[\s\S]*?\*\//g, '');
content = content.replace(/\/\/.*$/gm, '');
content = content.replace(/\`[\s\S]*?\`/g, '``');
content = content.replace(/'[^']*'/g, '\'\'');
content = content.replace(/\"[^\"]*\"/g, '\"\"');

const lines = content.split('\n');

let unclosed = [];
for (let i = 2736; i <= 8421; i++) {
    for (let char of lines[i]) {
        if (char === '{') unclosed.push(i+1);
        if (char === '}') unclosed.pop();
    }
}
console.log('Unclosed braces originated at lines:', unclosed);
