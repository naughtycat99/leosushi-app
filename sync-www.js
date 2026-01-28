const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

// Files and directories to exclude from sync
const exclude = [
    'node_modules',
    'www',
    'android',
    'ios',
    '.git',
    '.github',
    '.vscode',
    'capacitor.config.js',
    'package.json',
    'package-lock.json',
    'MOBILE_APP_GUIDE.md',
    '.gitignore',
    '.gemini',
    'sync-www.js'
];

function copyRecursiveSync(src, dest) {
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
            if (exclude.includes(childItemName)) return;
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('--- Syncing root to www/ ---');
try {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }

    fs.readdirSync(srcDir).forEach(item => {
        if (exclude.includes(item)) return;
        copyRecursiveSync(path.join(srcDir, item), path.join(destDir, item));
    });

    console.log('✅ Sync completed successfully!');
} catch (err) {
    console.error('❌ Sync failed:', err);
}
