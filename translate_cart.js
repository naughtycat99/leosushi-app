const fs = require('fs');
let content = fs.readFileSync('js/cart.js', 'utf8');

const old1 = '⚠️ Hiện tại quán đang tạm ngừng nhận đơn. Mong quý khách thông cảm!';
const new1 = '⚠️ Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!';

const old2 = 'Hiện tại quán đang tạm ngừng nhận đơn. Mong quý khách thông cảm!';
const new2 = 'Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!';

if (content.includes(old1) || content.includes(old2)) {
    content = content.replace(old1, new1);
    content = content.replace(old2, new2);
    fs.writeFileSync('js/cart.js', content, 'utf8');
    console.log('Successfully updated cart.js');
} else {
    console.log('Strings not found in cart.js');
}
