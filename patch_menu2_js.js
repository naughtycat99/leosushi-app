const fs = require('fs');
let menuJs = fs.readFileSync('js/menu.js', 'utf8');

const oldFuncStart = `function createMenuItemCard(item, itemNumber, categoryId = '') {
  const sushiMenuMatch = item.name.match(/^(S\\d+)\\.\\s*(.+)$/);`;
const newFuncStart = `function createMenuItemCard(item, itemNumber, categoryId = '') {
  const isAvailable = item.available !== 0 && item.available !== '0' && item.available !== false;
  const sushiMenuMatch = item.name.match(/^(S\\d+)\\.\\s*(.+)$/);`;
if (menuJs.includes(oldFuncStart)) {
    menuJs = menuJs.replace(oldFuncStart, newFuncStart);
}

const oldOptions = `        \${item.options.map(option => \`
          <div class="menu-item-option" onclick="event.stopPropagation(); window.openAddToCartModal('\${(item.name + ' - ' + option.name).replace(/'/g, "\\\\'")}', '\${option.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')">
            <span class="option-name">\${escapeHtml(option.name)}</span>`;
const newOptions = `        \${item.options.map(option => \`
          <div class="menu-item-option" onclick="event.stopPropagation(); \${!isAvailable ? 'alert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\');' : \`window.openAddToCartModal('\${(item.name + ' - ' + option.name).replace(/'/g, "\\\\'")}', '\${option.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`}">
            <span class="option-name">\${escapeHtml(option.name)}</span>`;
if (menuJs.includes(oldOptions)) {
    menuJs = menuJs.replace(oldOptions, newOptions);
}

const oldBlock = `  return \`
    <div class="menu-item-card \${item.hasOptions ? 'has-options' : ''}" id="\${uniqueCardId}" data-options-id="\${optionsId}" onclick="\${item.hasOptions ? \`toggleMenuOptions('\${optionsId}', '\${uniqueCardId}')\` : \`window.openAddToCartModal('\${item.name.replace(/'/g, "\\\\'")}', '\${item.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`}">
      <div class="menu-item-number">\${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">`;
const newBlock = `  return \`
    <div class="menu-item-card \${item.hasOptions ? 'has-options' : ''}" id="\${uniqueCardId}" data-options-id="\${optionsId}" onclick="\${!isAvailable ? 'alert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\');' : (item.hasOptions ? \`toggleMenuOptions('\${optionsId}', '\${uniqueCardId}')\` : \`window.openAddToCartModal('\${item.name.replace(/'/g, "\\\\'")}', '\${item.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`)}" style="\${!isAvailable ? 'opacity: 0.6; filter: grayscale(1);' : ''}">
      <div class="menu-item-number" style="\${!isAvailable ? 'background: #555;' : ''}">\${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">
            \${!isAvailable ? '<span style="color:#ef4444; font-size:12px; font-weight:bold; border:1px solid #ef4444; padding:2px 6px; border-radius:4px; margin-right:8px; white-space:nowrap; display:inline-block; margin-bottom:4px;">Hết hàng</span>' : ''}`;
if (menuJs.includes(oldBlock)) {
    menuJs = menuJs.replace(oldBlock, newBlock);
    console.log('Patched menu.js');
}

fs.writeFileSync('js/menu.js', menuJs, 'utf8');
