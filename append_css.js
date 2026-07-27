const fs = require('fs');

const css = `
/* Out of stock styles */
.menu-item-card.out-of-stock {
    opacity: 0.6;
    filter: grayscale(80%);
}
.menu-item-add-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #666;
    pointer-events: none;
}
`;

fs.appendFileSync('style.css', css);
console.log('Appended to style.css');
