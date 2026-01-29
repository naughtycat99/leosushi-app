-- ============================================
-- LEO SUSHI MENU DATA - SAMPLE (Test)
-- Đây là file mẫu để test. Để import đầy đủ, chạy: node generate-menu-data.js
-- ============================================

USE leosushi;

-- ============================================
-- INSERT CATEGORIES (Sample)
-- ============================================
INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order) VALUES
('vorspeisen', 'Vorspeisen', 'Vorspeisen', NULL, NULL, 1),
('salate', 'Salate', 'Salate', NULL, NULL, 2),
('suppen', 'Suppen', 'Suppen', NULL, NULL, 3)
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

-- ============================================
-- INSERT MENU ITEMS (Sample)
-- ============================================
INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title
) VALUES
('1._mini_spring_roll', '1. Mini Spring Roll (1,2,4,11,A)', NULL, 'Gebackene Mini Frühlingsrollen, serviert mit Chili-Hähnchen-Soße', 'Baked Mini Spring Rolls, served with chili chicken sauce', 3.90, 'vorspeisen', 1, 0, '(5 Stk.)', 0, 0, NULL),
('31._mango_salat', '31. Mango salat (E,F)', NULL, 'Saison-Salat mit Mango, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Seasonal salad with mango, peanuts, crispy onions, herbs, and homemade lime dressing, with:', 7.90, 'salate', 0, 1, NULL, 0, 0, NULL),
('40._miso_suppe', '40. Miso Suppe (F)', NULL, 'Japanischer Tofu mit Seetang und Frühlingszwiebeln', 'Japanese tofu with seaweed and spring onions', 3.50, 'suppen', 1, 0, NULL, 0, 0, NULL)
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

-- ============================================
-- INSERT MENU ITEM OPTIONS (Sample)
-- ============================================
INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES
('31._mango_salat_opt_a._gebackener_tofu', '31._mango_salat', 'A. Gebackener Tofu', 7.90, 1, 1),
('31._mango_salat_opt_b._hahnchenbrustfilet', '31._mango_salat', 'B. Hähnchenbrustfilet', 8.90, 0, 2),
('31._mango_salat_opt_c._mariniertes_rindfleisch', '31._mango_salat', 'C. Mariniertes Rindfleisch', 8.90, 0, 3),
('31._mango_salat_opt_d._garnelen', '31._mango_salat', 'D. Garnelen', 8.90, 0, 4)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

-- ============================================
-- COMPLETE
-- ============================================
SELECT 'Sample menu data imported successfully!' AS message;
SELECT 'To import full data, run: node generate-menu-data.js' AS instruction;

