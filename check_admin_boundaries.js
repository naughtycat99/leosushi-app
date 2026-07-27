const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');
const s = content.indexOf('<!-- Login Modal -->');
const e = content.indexOf('<div class="admin-stats" id="adminStatsHeader" style="display: none;">');
if (s !== -1 && e !== -1) {
    console.log('Found both! Range:', e - s, 'bytes');
} else {
    console.log('Not found: s =', s, 'e =', e);
}
