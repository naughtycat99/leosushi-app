const fs = require('fs');
const path = require('path');

const menuDataPath = path.join(__dirname, '../js/menu-data.js');

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

// Function to load the menu data dynamically for a specific branch by mocking localStorage
function loadMenuDataForBranch(branchId) {
  global.localStorage = {
    getItem: (key) => {
      // Mock the exact JSON stringified format used in frontend local storage
      return JSON.stringify({ id: branchId });
    }
  };
  
  const content = fs.readFileSync(menuDataPath, 'utf8')
    .replace('const SPECIAL_ROLL_OPTIONS =', 'global.SPECIAL_ROLL_OPTIONS =')
    .replace('const MENU_DATA =', 'global.MENU_DATA =');
  
  eval(content);
  return JSON.parse(JSON.stringify(global.MENU_DATA));
}

// Load menu data for both branches
const menuDataFlora = loadMenuDataForBranch('branch_flora');
const menuDataHaupt = loadMenuDataForBranch('branch_haupt');

let sql = `-- ============================================
-- LEO SUSHI MENU DATA IMPORT
-- Generated from menu-data.js (Dual Branch Enabled)
-- ============================================

USE leosushi;

-- Clear existing data (optional - uncomment out if you want to keep existing data)
-- DELETE FROM menu_item_options;
-- DELETE FROM menu_items;
-- DELETE FROM categories;

-- ============================================
-- INSERT CATEGORIES
-- ============================================
`;

// 1. Write categories for both branches
function writeCategoriesSQL(branchId, menuData) {
  let sqlChunk = `-- Categories for ${branchId}\n`;
  let sortOrder = 1;
  menuData.forEach(category => {
    const categoryId = category.id;
    const name = escapeSQL(category.title);
    const nameEn = escapeSQL(category.title);
    const categorySubtitle = category.categorySubtitle ? escapeSQL(category.categorySubtitle) : 'NULL';
    const categoryDesc = category.categoryDesc ? escapeSQL(category.categoryDesc) : 'NULL';
    
    sqlChunk += `INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  (${escapeSQL(categoryId)}, ${name}, ${nameEn}, ${categorySubtitle}, ${categoryDesc}, ${sortOrder}, ${escapeSQL(branchId)})
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

`;
    sortOrder++;
  });
  return sqlChunk;
}

sql += writeCategoriesSQL('branch_flora', menuDataFlora);
sql += writeCategoriesSQL('branch_haupt', menuDataHaupt);

sql += `-- ============================================
-- INSERT MENU ITEMS
-- ============================================
`;

// 2. Write menu items for both branches
function writeMenuItemsSQL(branchId, menuData) {
  let sqlChunk = `-- Menu items for ${branchId}\n`;
  menuData.forEach(category => {
    const categoryId = category.id;
    
    category.items.forEach(item => {
      // Append branch suffix if it's Branch 2 to make item_id unique across database
      const itemId = generateItemId(item.name) + (branchId === 'branch_haupt' ? '_haupt' : '');
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
      
      sqlChunk += `INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  ${escapeSQL(itemId)}, ${name}, ${nameEn}, ${description}, ${descriptionEn}, ${price}, ${escapeSQL(categoryId)},
  ${vegetarian}, ${hasOptions}, ${quantity}, ${useBulletPoints}, ${spicy}, ${groupTitle}, ${escapeSQL(branchId)}
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
  return sqlChunk;
}

sql += writeMenuItemsSQL('branch_flora', menuDataFlora);
sql += writeMenuItemsSQL('branch_haupt', menuDataHaupt);

sql += `-- ============================================
-- INSERT MENU ITEM OPTIONS
-- ============================================
`;

// 3. Write menu item options for both branches
function writeOptionsSQL(branchId, menuData) {
  let sqlChunk = `-- Options for ${branchId}\n`;
  menuData.forEach(category => {
    category.items.forEach(item => {
      if (item.hasOptions && item.options && item.options.length > 0) {
        const itemId = generateItemId(item.name) + (branchId === 'branch_haupt' ? '_haupt' : '');
        
        item.options.forEach((option, index) => {
          const optionId = generateOptionId(itemId, option.name);
          const optionName = escapeSQL(option.name);
          const optionPrice = convertPrice(option.price);
          const optionVegetarian = option.vegetarian ? 1 : 0;
          const displayOrder = index + 1;
          
          sqlChunk += `INSERT INTO menu_item_options (
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
  return sqlChunk;
}

sql += writeOptionsSQL('branch_flora', menuDataFlora);
sql += writeOptionsSQL('branch_haupt', menuDataHaupt);

sql += `-- ============================================
-- COMPLETE
-- ============================================
SELECT 'Menu data imported successfully!' AS message;
`;

// Write to file
const outputPath = path.join(__dirname, 'menu-data-import.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

const totalFloraItems = menuDataFlora.reduce((sum, cat) => sum + cat.items.length, 0);
const totalHauptItems = menuDataHaupt.reduce((sum, cat) => sum + cat.items.length, 0);

const totalFloraOpts = menuDataFlora.reduce((sum, cat) => sum + cat.items.reduce((s, item) => s + (item.options ? item.options.length : 0), 0), 0);
const totalHauptOpts = menuDataHaupt.reduce((sum, cat) => sum + cat.items.reduce((s, item) => s + (item.options ? item.options.length : 0), 0), 0);

console.log(`✅ Generated SQL file: ${outputPath}`);
console.log(`📊 Categories: ${menuDataFlora.length * 2} (Dual Branches)`);
console.log(`📊 Total items: ${totalFloraItems + totalHauptItems} (Flora: ${totalFloraItems}, Haupt: ${totalHauptItems})`);
console.log(`📊 Total options: ${totalFloraOpts + totalHauptOpts} (Flora: ${totalFloraOpts}, Haupt: ${totalHauptOpts})`);
