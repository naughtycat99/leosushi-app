// Script để tự động tách script.js thành các module
// Chạy: node split-script.js

const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');
const jsDir = path.join(__dirname, 'js');

// Đảm bảo thư mục js tồn tại
if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir);
}

// Đọc file script.js
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const lines = scriptContent.split('\n');

// Định nghĩa các sections và line ranges
const sections = {
  'menu-data': { start: 12, end: 697, name: 'menu-data.js' },
  'utils': { start: 875, end: 880, name: 'utils.js' },
  // Các sections khác sẽ được thêm sau
};

console.log('Đang tách file script.js...');
console.log(`Tổng số dòng: ${lines.length}`);

// Tạo menu-data.js
const menuDataLines = lines.slice(11, 696); // 0-indexed, end exclusive
const menuDataContent = menuDataLines.join('\n');
fs.writeFileSync(path.join(jsDir, 'menu-data.js'), menuDataContent, 'utf8');
console.log('✅ Đã tạo js/menu-data.js');

console.log('\nHoàn thành! Vui lòng kiểm tra các file trong thư mục js/');

