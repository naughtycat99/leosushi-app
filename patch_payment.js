const fs = require('fs');

let content = fs.readFileSync('js/payment.js', 'utf8');

// Insert log for "Create Order" (PayPal window opened)
content = content.replace(
    /return fetch\('\/api\/paypal_proxy\.php\?action=create_order'/g,
    `if(typeof window.logActivity==='function')window.logActivity('paypal_opened', 'Khách bấm chọn thanh toán PayPal', {name: payerFirstName + ' ' + payerLastName, phone: window.customerPhone || '', email: payerEmail}, total.toFixed(2) + ' €', 'paypal');\n          return fetch('/api/paypal_proxy.php?action=create_order'`
);

// Insert log for "On Cancel"
content = content.replace(
    /onCancel: function \(data\) \{/g,
    `onCancel: function (data) {\n        if(typeof window.logActivity==='function')window.logActivity('paypal_cancelled', 'Khách hàng đã tắt cửa sổ PayPal', {}, '0.00 €', 'paypal');`
);

// Insert log for Cash / Card
content = content.replace(
    /console\.log\('\[confirmPayment\] Validation passed, submitting order...'\);/g,
    `console.log('[confirmPayment] Validation passed, submitting order...');\n    if(typeof window.logActivity==='function')window.logActivity('checkout_submitted', 'Khách nhấn nút Đặt Hàng', {name: customerFirstName + ' ' + customerLastName, phone: customerPhone, email: customerEmail}, '0.00 €', selectedPaymentMethod);`
);

fs.writeFileSync('js/payment.js', content, 'utf8');
console.log('Done inserting logs');
