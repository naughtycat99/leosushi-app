const fs = require('fs');
let content = fs.readFileSync('tmp-live-admin.html', 'utf8');
const s = content.indexOf('<div class="admin-header">');
const e = content.indexOf('<div class="admin-stats" id="adminStatsHeader" style="display: none;">');
console.log(content.substring(s, e));
