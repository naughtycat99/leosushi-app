const fs = require('fs');
let menuJs = fs.readFileSync('js/menu.js', 'utf8');

const regex = /(<div class="menu-item-card \$\{item\.hasOptions \? 'has-options' : ''\}" id="\$\{uniqueCardId\}" data-options-id="\$\{optionsId\}" onclick=")([^"]+)(">\s*<div class="menu-item-number">\$\{displayNumber\}<\/div>)/g;

// I will just use string replacement on a larger block to be safe.
const oldBlock = `  return \`
    <div class="menu-item-card \${item.hasOptions ? 'has-options' : ''}" id="\${uniqueCardId}" data-options-id="\${optionsId}" onclick="\${item.hasOptions ? \`toggleMenuOptions('\${optionsId}', '\${uniqueCardId}')\` : \`window.openAddToCartModal('\${item.name.replace(/'/g, "\\\\'")}', '\${item.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`}">
      <div class="menu-item-number">\${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">`;

const newBlock = `  const isAvailable = item.available !== 0 && item.available !== '0' && item.available !== false;
  
  return \`
    <div class="menu-item-card \${item.hasOptions ? 'has-options' : ''} \${!isAvailable ? 'sold-out' : ''}" id="\${uniqueCardId}" data-options-id="\${optionsId}" onclick="\${!isAvailable ? 'alert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\');' : (item.hasOptions ? \`toggleMenuOptions('\${optionsId}', '\${uniqueCardId}')\` : \`window.openAddToCartModal('\${item.name.replace(/'/g, "\\\\'")}', '\${item.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`)}">
      <div class="menu-item-number">\${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">
            \${!isAvailable ? '<span style="color:#ef4444; font-size:12px; font-weight:bold; border:1px solid #ef4444; padding:2px 6px; border-radius:4px; margin-right:8px; white-space:nowrap;">Hết hàng</span>' : ''}`;

if (menuJs.includes(oldBlock)) {
    menuJs = menuJs.replace(oldBlock, newBlock);
    fs.writeFileSync('js/menu.js', menuJs, 'utf8');
    console.log('Successfully patched js/menu.js');
} else {
    console.log('Could not find oldBlock in js/menu.js');
}

// Update the options as well to not allow adding to cart if not available
const oldOptions = `        \${item.options.map(option => \`
          <div class="menu-item-option" onclick="event.stopPropagation(); window.openAddToCartModal('\${(item.name + ' - ' + option.name).replace(/'/g, "\\\\'")}', '\${option.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')">
            <span class="option-name">\${escapeHtml(option.name)}</span>`;
const newOptions = `        \${item.options.map(option => \`
          <div class="menu-item-option \${!isAvailable ? 'sold-out-option' : ''}" onclick="event.stopPropagation(); \${!isAvailable ? 'alert(\\'Món này hiện đang hết hàng. Xin lỗi vì sự bất tiện này!\\');' : \`window.openAddToCartModal('\${(item.name + ' - ' + option.name).replace(/'/g, "\\\\'")}', '\${option.price}', '\${(item.desc || '').replace(/'/g, "\\\\'")}')\`}">
            <span class="option-name">\${escapeHtml(option.name)}</span>`;
// wait, isAvailable is not defined inside the map unless we pass it, but isAvailable is defined in the outer scope, so it should be fine. Wait, oldOptions doesn't have isAvailable. But we define isAvailable before the return statement, so optionsHTML will have access to it. Wait! optionsHTML is built *before* the return statement.
// Let's check where optionsHTML is built.
