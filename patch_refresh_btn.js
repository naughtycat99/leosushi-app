const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Replace globally inside .refresh-btn rules
content = content.replace(/\.refresh-btn\s*\{([^}]*)bottom:\s*30px;([^}]*)\}/g, '.refresh-btn {$1bottom: 95px;$2}');
content = content.replace(/\.refresh-btn\s*\{([^}]*)bottom:\s*16px;([^}]*)\}/g, '.refresh-btn {$1bottom: 81px;$2}');
content = content.replace(/\.refresh-btn\s*\{([^}]*)bottom:\s*12px;([^}]*)\}/g, '.refresh-btn {$1bottom: 77px;$2}');

// Verify if replacement worked
if (content.includes('bottom: 95px;')) {
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully patched .refresh-btn bottom position');
} else {
    console.log('Patch failed!');
}
