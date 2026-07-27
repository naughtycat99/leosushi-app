const fs = require('fs');
const path = require('path');

const wwwDir = 'www';

// Tạo thư mục www nếu chưa có
if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir, { recursive: true });
}

// Danh sách file cần copy
const filesToCopy = [
  'index.html',
  'menu.html',
  'checkout.html',
  'login.html',
  'register.html',
  'profile.html',
  'my-orders.html',
  'points.html',
  'reservation.html',
  'reset-password.html',
  'verify.html',
  'styles.css',
  'styles-luxe.css',
  'menu-order.css',
  'script.js',
  'split-script.js',
  'admin.html',
  'tmp-live-admin.html',
  'delivery.html',
  'shipper-manifest.json',
  'manifest.json',
  'sw.js',
  'admin-sw.js'
];

// Danh sách thư mục cần copy
const foldersToCopy = ['assets', 'js', 'css'];

// Copy files
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    let dest = file;
    // BUILD SHIPPER APP: rename delivery.html to index.html
    if (file === 'delivery.html') dest = 'index.html';
    // Skip original index.html
    if (file === 'index.html') return;
    
    fs.copyFileSync(file, path.join(wwwDir, dest));
    console.log(`Copied: ${file} -> ${dest}`);
  } else {
    console.log(`Not found: ${file}`);
  }
});

// Copy folders
function copyFolderSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠ Folder not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`✓ Copied folder: ${src}`);
}

foldersToCopy.forEach(folder => {
  copyFolderSync(folder, path.join(wwwDir, folder));
});

console.log('\n✅ Build completed! Files copied to www/');
