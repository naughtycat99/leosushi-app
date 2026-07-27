const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// Replacements
content = content.replace(/'Kunde'/g, "'Khách hàng'");
content = content.replace(/>Uhr</g, '>giờ<');
content = content.replace(/• 🛵 Lieferung/g, '• 🛵 Giao hàng');
content = content.replace(/• 🥡 Abholung/g, '• 🥡 Mang về');
content = content.replace(/\$\{itemCount\} Artikel/g, '${itemCount} món');
content = content.replace(/✅ Bezahlt/g, '✅ Đã thanh toán');
content = content.replace(/❌ Unbezahlt/g, '❌ Chưa thanh toán');
content = content.replace(/Zwischensumme/g, 'Tạm tính');
content = content.replace(/>Rabatt</g, '>Giảm giá<');
content = content.replace(/Gesamtbetrag/g, 'Tổng cộng');
content = content.replace(/>Übergabe</g, '>Duyệt đơn<');
content = content.replace(/>Stornieren</g, '>Hủy đơn<');
content = content.replace(/>✓ Fertig</g, '>✓ Hoàn thành<');
content = content.replace(/>🖨️ Drucken \(Bill\)</g, '>🖨️ In Hóa Đơn<');
content = content.replace(/'Artikel'/g, "'Món'");

fs.writeFileSync('admin.html', content, 'utf8');
console.log('Vietnamese translation applied.');
