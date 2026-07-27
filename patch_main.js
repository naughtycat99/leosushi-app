const fs = require('fs');
let content = fs.readFileSync('js/main.js', 'utf8');

const insertStatusCheck = `
// --- STORE STATUS CHECK ---
window.STORE_IS_OPEN = true;
fetch('api/store_status.php')
  .then(res => res.json())
  .then(data => {
     window.STORE_IS_OPEN = data.is_open !== false;
     if (!window.STORE_IS_OPEN) {
         // Show banner
         const banner = document.createElement('div');
         banner.style.cssText = 'position:fixed; top:0; left:0; right:0; background:#e63946; color:white; text-align:center; padding:12px; z-index:999999; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.5); font-size: 14px;';
         banner.innerHTML = '⚠️ Hiện tại quán đang tạm ngừng nhận đơn do quá tải hoặc hết hàng. Mong quý khách thông cảm!';
         document.body.appendChild(banner);
         document.body.style.paddingTop = '45px';
     }
  })
  .catch(err => {
      window.STORE_IS_OPEN = true;
  });
// --------------------------
`;

if (!content.includes('STORE_IS_OPEN')) {
    content = content.replace(/(console\.log\('main\.js loaded'\);)/, `$1\n${insertStatusCheck}`);
    fs.writeFileSync('js/main.js', content, 'utf8');
    console.log('Successfully patched main.js');
}
