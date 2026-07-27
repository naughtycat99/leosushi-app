const fs = require('fs');
let content = fs.readFileSync('js/menu.js', 'utf8');

// 1. Remove the filtering by isAvailable in loadMenuFromAPI transformation
const transformRegex = /const isAvailable = item\.available === 1 \|\| item\.available === null \|\| item\.available === undefined;\s*if \(isAvailable && item\.category_id && categoryMap\[item\.category_id\]\) \{/g;
const transformReplacement = `const isAvailable = item.available === 1 || item.available === null || item.available === undefined;
    if (item.category_id && categoryMap[item.category_id]) {`;

content = content.replace(transformRegex, transformReplacement);

// 2. Add isAvailable to transformedItem
const objRegex = /spicy:\s*item\.spicy\s*===\s*1\s*\|\|\s*item\.spicy\s*===\s*true,/g;
const objReplacement = `spicy: item.spicy === 1 || item.spicy === true,
        isAvailable: isAvailable,`;
content = content.replace(objRegex, objReplacement);

// 3. Render logic: add class out-of-stock and disabled button
// Looking for the renderMenuItem logic where HTML is built.
// In js/menu.js we need to see how items are rendered.
fs.writeFileSync('js/menu.js', content, 'utf8');
console.log('Successfully patched js/menu.js transformations');
