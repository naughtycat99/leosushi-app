const fs = require('fs');

// 1. Add showLeoAlert to js/main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');

const alertFunction = `
// --- LEO ALERT / NOTIFICATION ---
window.showLeoAlert = function(message, type = 'error') {
    // Remove existing if any
    const existing = document.getElementById('leo-alert-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'leo-alert-toast';
    toast.style.cssText = \`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: \${type === 'error' ? '#ef4444' : (type === 'success' ? '#22c55e' : '#333')};
        color: white;
        padding: 14px 24px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        z-index: 9999999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease, top 0.3s ease;
        max-width: 90vw;
        text-align: center;
    \`;

    const icon = document.createElement('span');
    icon.innerHTML = type === 'error' ? '⚠️' : '✅';
    icon.style.fontSize = '20px';

    const text = document.createElement('span');
    text.innerHTML = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.top = '40px';
    }, 10);

    // Remove after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.top = '20px';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};
`;

if (!mainJs.includes('window.showLeoAlert')) {
    mainJs = mainJs + '\n' + alertFunction;
    fs.writeFileSync('js/main.js', mainJs, 'utf8');
    console.log('Added showLeoAlert to main.js');
}

// 2. Update js/cart.js to use showLeoAlert
let cartJs = fs.readFileSync('js/cart.js', 'utf8');
const oldCartAlert = `if (typeof showToast === 'function') {
      showToast('⚠️ Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!', 'error');
    } else {
      alert('Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!');
    }`;
const newCartAlert = `if (typeof window.showLeoAlert === 'function') {
      window.showLeoAlert('Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!', 'error');
    } else if (typeof showToast === 'function') {
      showToast('⚠️ Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!', 'error');
    } else {
      alert('Derzeit nehmen wir vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!');
    }`;
if (cartJs.includes(oldCartAlert)) {
    cartJs = cartJs.replace(oldCartAlert, newCartAlert);
    fs.writeFileSync('js/cart.js', cartJs, 'utf8');
    console.log('Updated cart.js');
}

// 3. Update js/menu.js to use showLeoAlert
let menuJs = fs.readFileSync('js/menu.js', 'utf8');
// We need to replace alert('Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!');
// with window.showLeoAlert('Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!', 'error');
const oldMenuAlert = `alert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\')`;
const newMenuAlert = `window.showLeoAlert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\', \\'error\\')`;

if (menuJs.includes(oldMenuAlert)) {
    menuJs = menuJs.split(oldMenuAlert).join(newMenuAlert);
    fs.writeFileSync('js/menu.js', menuJs, 'utf8');
    console.log('Updated menu.js');
}

