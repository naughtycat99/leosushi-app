const fs = require('fs');

let content = fs.readFileSync('js/api.js', 'utf8');

content = content.replace(
    /window\.logActivity = async function\(action, details, customerInfo = \{\}, cartTotal = '0\.00 €', paymentMethod = 'N\/A'\) \{/g,
    `window.logActivity = async function(action, details, customerInfo = {}, cartTotal = '0.00 €', paymentMethod = 'N/A', cartItems = []) {
    try {
      let cartStr = '';
      if (cartItems && cartItems.length > 0) {
        cartStr = '\\n  -> Món đặt: ' + cartItems.map(i => (i.qty || i.quantity || 1) + 'x ' + i.name).join(', ');
        details += cartStr;
      }
`
);

fs.writeFileSync('js/api.js', content, 'utf8');
console.log('Patched api.js');
