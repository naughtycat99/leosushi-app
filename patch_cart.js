const fs = require('fs');
let content = fs.readFileSync('js/cart.js', 'utf8');

// Insert store status check at the beginning of openAddToCartModal
const insert1 = `
  if (typeof window.STORE_IS_OPEN !== 'undefined' && !window.STORE_IS_OPEN) {
    if (typeof showToast === 'function') {
      showToast('⚠️ Hiện tại quán đang tạm ngừng nhận đơn. Mong quý khách thông cảm!', 'error');
    } else {
      alert('Hiện tại quán đang tạm ngừng nhận đơn. Mong quý khách thông cảm!');
    }
    return;
  }
`;

content = content.replace(/(window\.openAddToCartModal\s*=\s*function\s*\([^)]*\)\s*\{)/, `$1${insert1}`);

// Insert store status check in checkout logic
const checkoutIndex = content.indexOf('function showCheckout()');
if (checkoutIndex !== -1) {
    content = content.replace(/(function\s*showCheckout\s*\(\)\s*\{)/, `$1${insert1}`);
}
const checkoutIndex2 = content.indexOf('function processOrder(');
if (checkoutIndex2 !== -1) {
    content = content.replace(/(function\s*processOrder\s*\([^)]*\)\s*\{)/, `$1${insert1}`);
}

fs.writeFileSync('js/cart.js', content, 'utf8');
console.log('Successfully patched cart.js with store status checks');
