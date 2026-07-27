const fs = require('fs');

let content = fs.readFileSync('js/payment.js', 'utf8');

// Replace paypal_opened
content = content.replace(
    /window\.logActivity\('paypal_opened', 'Khách bấm chọn thanh toán PayPal', \{name: payerFirstName \+ ' ' \+ payerLastName, phone: window\.customerPhone \|\| '', email: payerEmail\}, total\.toFixed\(2\) \+ ' €', 'paypal'\);/g,
    `window.logActivity('paypal_opened', 'Khách bấm chọn thanh toán PayPal', {name: payerFirstName + ' ' + payerLastName, phone: window.customerPhone || '', email: payerEmail}, total.toFixed(2) + ' €', 'paypal', cart);`
);

// Replace paypal_cancelled
content = content.replace(
    /window\.logActivity\('paypal_cancelled', 'Khách hàng đã tắt cửa sổ PayPal', \{\}, '0\.00 €', 'paypal'\);/g,
    `window.logActivity('paypal_cancelled', 'Khách hàng đã tắt cửa sổ PayPal', {}, '0.00 €', 'paypal', typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]'));`
);

// Replace checkout_submitted
content = content.replace(
    /window\.logActivity\('checkout_submitted', 'Khách nhấn nút Đặt Hàng', \{name: customerFirstName \+ ' ' \+ customerLastName, phone: customerPhone, email: customerEmail\}, '0\.00 €', selectedPaymentMethod\);/g,
    `window.logActivity('checkout_submitted', 'Khách nhấn nút Đặt Hàng', {name: customerFirstName + ' ' + customerLastName, phone: customerPhone, email: customerEmail}, '0.00 €', selectedPaymentMethod, cart);`
);

fs.writeFileSync('js/payment.js', content, 'utf8');
console.log('Done patching payment.js');
