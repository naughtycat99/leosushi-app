const fs = require('fs');
const path = require('path');

// Read menu-data.js
const menuDataPath = path.join(__dirname, '../js/menu-data.js');
const menuDataContent = fs.readFileSync(menuDataPath, 'utf8');

// Extract MENU_DATA using eval (since it's a JS file)
eval(menuDataContent);

// Helper function to escape SQL strings
function escapeSQL(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

// Helper function to convert price from "3,90" to 3.90
function convertPrice(priceStr) {
  if (!priceStr) return '0.00';
  return priceStr.replace(',', '.');
}

// Helper function to generate item_id from name
function generateItemId(name) {
  // Remove special characters and spaces, keep alphanumeric and dots
  return name
    .replace(/[^a-zA-Z0-9.]/g, '_')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Helper function to generate option_id
function generateOptionId(itemId, optionName) {
  return itemId + '_opt_' + generateItemId(optionName);
}

let sql = `-- ============================================
-- LEO SUSHI MENU DATA IMPORT
-- Generated from menu-data.js
-- ============================================

USE leosushi;

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM menu_item_options;
-- DELETE FROM menu_items;
-- DELETE FROM categories;

-- ============================================
-- INSERT CATEGORIES
-- ============================================
`;

// Insert categories
let sortOrder = 1;
MENU_DATA.forEach(category => {
  const categoryId = category.id;
  const name = escapeSQL(category.title);
  const nameEn = escapeSQL(category.title);
  const categorySubtitle = category.categorySubtitle ? escapeSQL(category.categorySubtitle) : 'NULL';
  const categoryDesc = category.categoryDesc ? escapeSQL(category.categoryDesc) : 'NULL';
  
  sql += `INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order) VALUES
  (${escapeSQL(categoryId)}, ${name}, ${nameEn}, ${categorySubtitle}, ${categoryDesc}, ${sortOrder})
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

`;
  sortOrder++;
});

sql += `-- ============================================
-- INSERT MENU ITEMS
-- ============================================
`;

// Insert menu items
MENU_DATA.forEach(category => {
  const categoryId = category.id;
  
  category.items.forEach(item => {
    const itemId = generateItemId(item.name);
    const name = escapeSQL(item.name);
    const nameEn = item.name_en ? escapeSQL(item.name_en) : 'NULL';
    const description = item.desc ? escapeSQL(item.desc) : 'NULL';
    const descriptionEn = item.descEn ? escapeSQL(item.descEn) : 'NULL';
    const price = convertPrice(item.price);
    const vegetarian = item.vegetarian ? 1 : 0;
    const hasOptions = item.hasOptions ? 1 : 0;
    const quantity = item.quantity ? escapeSQL(item.quantity) : 'NULL';
    const useBulletPoints = item.useBulletPoints ? 1 : 0;
    const spicy = item.spicy ? 1 : 0;
    const groupTitle = item.groupTitle ? escapeSQL(item.groupTitle) : 'NULL';
    
    sql += `INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title
) VALUES (
  ${escapeSQL(itemId)}, ${name}, ${nameEn}, ${description}, ${descriptionEn}, ${price}, ${escapeSQL(categoryId)},
  ${vegetarian}, ${hasOptions}, ${quantity}, ${useBulletPoints}, ${spicy}, ${groupTitle}
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  name_en = VALUES(name_en),
  description = VALUES(description),
  description_en = VALUES(description_en),
  price = VALUES(price),
  category_id = VALUES(category_id),
  vegetarian = VALUES(vegetarian),
  has_options = VALUES(has_options),
  quantity = VALUES(quantity),
  use_bullet_points = VALUES(use_bullet_points),
  spicy = VALUES(spicy),
  group_title = VALUES(group_title);

`;
  });
});

sql += `-- ============================================
-- INSERT MENU ITEM OPTIONS
-- ============================================
`;

// Insert menu item options
MENU_DATA.forEach(category => {
  category.items.forEach(item => {
    if (item.hasOptions && item.options && item.options.length > 0) {
      const itemId = generateItemId(item.name);
      
      item.options.forEach((option, index) => {
        const optionId = generateOptionId(itemId, option.name);
        const optionName = escapeSQL(option.name);
        const optionPrice = convertPrice(option.price);
        const optionVegetarian = option.vegetarian ? 1 : 0;
        const displayOrder = index + 1;
        
        sql += `INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  ${escapeSQL(optionId)}, ${escapeSQL(itemId)}, ${optionName}, ${optionPrice}, ${optionVegetarian}, ${displayOrder}
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

`;
      });
    }
  });
});

sql += `-- ============================================
-- COMPLETE
-- ============================================
SELECT 'Menu data imported successfully!' AS message;
`;

// Write to file
const outputPath = path.join(__dirname, 'menu-data-import.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`✅ Generated SQL file: ${outputPath}`);
console.log(`📊 Categories: ${MENU_DATA.length}`);
console.log(`📊 Total items: ${MENU_DATA.reduce((sum, cat) => sum + cat.items.length, 0)}`);
console.log(`📊 Total options: ${MENU_DATA.reduce((sum, cat) => 
  sum + cat.items.reduce((s, item) => s + (item.options ? item.options.length : 0), 0), 0)}`);

