const fs = require('fs');
let content = fs.readFileSync('js/main.js', 'utf8');

const oldText = '⚠️ Hiện tại quán đang tạm ngừng nhận đơn do quá tải hoặc hết hàng. Mong quý khách thông cảm!';
const newText = '⚠️ Derzeit nehmen wir aufgrund von Überlastung oder ausverkauften Artikeln vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!';

if (content.includes(oldText)) {
    content = content.replace(oldText, newText);
    fs.writeFileSync('js/main.js', content, 'utf8');
    console.log('Successfully updated the banner text in js/main.js');
} else {
    console.log('Could not find the text to replace in js/main.js');
}
