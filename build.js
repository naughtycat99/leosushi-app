const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

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
  'download-app.html',
  'qr-table-generator.html',
  'qr-google-review.html',
  'googlec670091965a27d1b.html',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  'admin-sw.js'
];

// Danh sách thư mục cần copy
const foldersToCopy = ['assets', 'js', 'css'];

// Copy files
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(wwwDir, file));
    console.log(`Copied: ${file} -> ${file}`);
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

// Fail the build before Capacitor sync if any packaged JavaScript is invalid.
function collectJavaScriptFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return targetPath.endsWith('.js') ? [targetPath] : [];
  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap(entry =>
    collectJavaScriptFiles(path.join(targetPath, entry.name))
  );
}

const packagedJavaScript = [
  ...collectJavaScriptFiles(path.join(wwwDir, 'js')),
  ...filesToCopy
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(wwwDir, file))
    .filter(file => fs.existsSync(file))
];

const syntaxErrors = [];
packagedJavaScript.forEach(file => {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (check.status !== 0) syntaxErrors.push(`${file}\n${check.stderr || check.stdout}`);
});

if (syntaxErrors.length > 0) {
  console.error(`\n❌ Build stopped: ${syntaxErrors.length} JavaScript syntax error(s).`);
  console.error(syntaxErrors.join('\n'));
  process.exit(1);
}

console.log(`\n✅ Build completed! ${packagedJavaScript.length} JavaScript files validated.`);
