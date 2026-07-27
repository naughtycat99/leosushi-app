const fs = require('fs');
let content = fs.readFileSync('js/api.js', 'utf8');

// The file has two `try {` blocks inside logActivity.
// Let's replace:
//     try {
//       let cartStr = '';
//       if (cartItems && cartItems.length > 0) {
//         cartStr = '\n  -> Món đặt: ' + cartItems.map(i => (i.qty || i.quantity || 1) + 'x ' + i.name).join(', ');
//         details += cartStr;
//       }
//
//     try {

content = content.replace(/    try \{\s*let cartStr = '';\s*if \(cartItems && cartItems\.length > 0\) \{\s*cartStr = '[^]+?details \+= cartStr;\s*\}\s*try \{/g,
    `    try {
      let cartStr = '';
      if (cartItems && cartItems.length > 0) {
        cartStr = '\\n  -> Món đặt: ' + cartItems.map(i => (i.qty || i.quantity || 1) + 'x ' + i.name).join(', ');
        details += cartStr;
      }`);

fs.writeFileSync('js/api.js', content, 'utf8');
console.log('Fixed api.js syntax');
