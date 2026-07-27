const fs = require('fs');
let content = fs.readFileSync('js/menu.js', 'utf8');

const regex = /card\.className = 'menu-item-card';/;
const replacement = `card.className = 'menu-item-card';
    if (i.isAvailable === false) {
      card.classList.add('out-of-stock');
    }`;

content = content.replace(regex, replacement);

const btnRegex = /<button class="menu-item-add-btn" data-name="\$\{escapeHtml\(i\.name\)\}" data-price="\$\{i\.price\}" data-desc="\$\{escapeHtml\(i\.desc \|\| ''\)\}">/;
const btnReplacement = `<button class="menu-item-add-btn \${i.isAvailable === false ? 'disabled' : ''}" data-name="\${escapeHtml(i.name)}" data-price="\${i.price}" data-desc="\${escapeHtml(i.desc || '')}" \${i.isAvailable === false ? 'disabled' : ''}>`;

content = content.replace(btnRegex, btnReplacement);

const labelRegex = /<div class="menu-item-name">\$\{i\.name\}<\/div>/;
const labelReplacement = `<div class="menu-item-name">\${i.name} \${i.isAvailable === false ? '<span style="color:#ef4444; font-size:12px; margin-left:8px; border:1px solid #ef4444; border-radius:4px; padding:2px 6px;">Hết hàng</span>' : ''}</div>`;
content = content.replace(labelRegex, labelReplacement);

const clickRegex = /if \(addBtn\) \{\s*addBtn\.addEventListener\('click', handleAddClick\);\s*\}/;
const clickReplacement = `if (addBtn && i.isAvailable !== false) {
      addBtn.addEventListener('click', handleAddClick);
    }`;
content = content.replace(clickRegex, clickReplacement);

fs.writeFileSync('js/menu.js', content, 'utf8');
console.log('Successfully patched js/menu.js rendering');
