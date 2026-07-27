const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');
const oldCondition = `window.STORE_IS_OPEN = storeIsOpen;
     if (!window.STORE_IS_OPEN) {
         // Show banner`;
const newCondition = `window.STORE_IS_OPEN = storeIsOpen;
     
     // Only show banner on menu or checkout pages
     const isOrderPage = window.location.pathname.includes('menu') || window.location.pathname.includes('checkout');
     if (!window.STORE_IS_OPEN && isOrderPage) {
         // Show banner`;

if (mainJs.includes(oldCondition)) {
    mainJs = mainJs.replace(oldCondition, newCondition);
    fs.writeFileSync('js/main.js', mainJs, 'utf8');
    console.log('Successfully updated js/main.js to only show banner on order pages');
} else {
    console.log('Could not find the target code in js/main.js');
}
