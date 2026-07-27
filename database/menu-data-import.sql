-- ============================================
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
-- Categories for branch_flora
INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('vorspeisen', 'Vorspeisen', 'Vorspeisen', NULL, NULL, 1, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('salate', 'Salate', 'Salate', NULL, NULL, 2, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('suppen', 'Suppen', 'Suppen', NULL, NULL, 3, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('sushimenu', 'Sushi Menüs', 'Sushi Menüs', NULL, NULL, 4, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('maki', 'Maki', 'Maki', '(8 Stk.)', NULL, 5, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('insideout', 'Inside Out Sushi', 'Inside Out Sushi', '(8 Stk.)', NULL, 6, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('crunchy', 'Crunchy Inside Out Sushi', 'Crunchy Inside Out Sushi', '(8 Stk.)', NULL, 7, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('sashimi', 'Sashimi', 'Sashimi', NULL, NULL, 8, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('nigiri', 'Nigiri', 'Nigiri', '(2 Stk.)', NULL, 9, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('bigrolls', 'Panierte Big Rolls', 'Panierte Big Rolls', '(6 Stk.)', NULL, 10, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('minirolls', 'Panierte Mini Rolls', 'Panierte Mini Rolls', '(8 Stk.)', NULL, 11, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('specialrolls', 'Special Rolls', 'Special Rolls', NULL, 'Alle Rolls Nr. Sp1-Sp16 erhältlich in: A 4 stk. €5,50 B 8 stk. €11,50', 12, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('firenigiri', 'Fire Special Nigiri', 'Fire Special Nigiri', NULL, NULL, 13, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('temaki', 'Temaki', 'Temaki', NULL, NULL, 14, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('teriyaki', 'Teriyaki Soße', 'Teriyaki Soße', NULL, NULL, 15, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('pokebowl', 'Poke Bowl', 'Poke Bowl', NULL, 'Unterlegt mit Reis, Cocktailsauce, Avocado, Salat, Gurken, Mango, hausgemachtem Kimchi nach Art des Hauses und Edamame. Verfeinert mit hausgemachter Soße. Wahlweise mit: / Served on rice with cocktail sauce, avocado, salad, cucumber, mango, homemade kimchi (house style) and edamame. Refined with homemade sauce. Choice of:', 16, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('hauptspeisen', 'Warme Gerichte', 'Warme Gerichte', NULL, 'Gerichte Nr. 70-80 - nach Wahl mit: A. Gebackener Tofu €11,90 | B. Hähnchenbrustfilet €12,90 | C. Gebackener Hähnchenbrustfilet €12,90 | D. Gegrilltes Hähnchen-Brustfilet €13,90 | E. Ente Kross €14,90 | G. Garnelen €13,90 | R. Mariniertes Rindfleisch €13,90 | H. Gegrillter Lachs €15,90 | I. Gebackene Seitan mit Sesam €15,90. Currys/Soßen (70-75) werden mit Duftreis serviert. Udon & Nudelsuppe (77-78) ohne Reis. Phở Trộn (79) mit Reisnudeln / Curries/Sauces (70-75) are served with fragrant rice. Udon & noodle soup (77-78) without rice. Phở Trộn (79) with rice noodles', 17, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('dessert', 'Desserts', 'Desserts', NULL, NULL, 18, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('beilagen', 'Beilage', 'Beilage', NULL, NULL, 19, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('getranke', 'Getränke', 'Getränke', NULL, NULL, 20, 'branch_flora')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

-- Categories for branch_haupt
INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('vorspeisen', 'Vorspeisen', 'Vorspeisen', NULL, NULL, 1, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('salate', 'Salate', 'Salate', NULL, NULL, 2, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('suppen', 'Suppen', 'Suppen', NULL, NULL, 3, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('sushimenu', 'Sushi Menüs', 'Sushi Menüs', NULL, NULL, 4, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('maki', 'Maki', 'Maki', '(8 Stk.)', NULL, 5, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('insideout', 'Inside Out Sushi', 'Inside Out Sushi', '(8 Stk.)', NULL, 6, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('crunchy', 'Crunchy Inside Out Sushi', 'Crunchy Inside Out Sushi', '(8 Stk.)', NULL, 7, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('sashimi', 'Sashimi', 'Sashimi', NULL, NULL, 8, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('nigiri', 'Nigiri', 'Nigiri', '(2 Stk.)', NULL, 9, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('bigrolls', 'Panierte Big Rolls', 'Panierte Big Rolls', '(6 Stk.)', NULL, 10, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('minirolls', 'Panierte Mini Rolls', 'Panierte Mini Rolls', '(8 Stk.)', NULL, 11, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('specialrolls', 'Special Rolls', 'Special Rolls', NULL, 'Alle Rolls Nr. Sp1-Sp16 erhältlich in: A 4 stk. €6,50 B 8 stk. €11,50', 12, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('firenigiri', 'Fire Special Nigiri', 'Fire Special Nigiri', NULL, NULL, 13, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('temaki', 'Temaki', 'Temaki', NULL, NULL, 14, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('teriyaki', 'Teriyaki Soße', 'Teriyaki Soße', NULL, NULL, 15, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('pokebowl', 'Poke Bowl', 'Poke Bowl', NULL, 'Unterlegt mit Reis, Cocktailsauce, Avocado, Salat, Gurken, Mango, hausgemachtem Kimchi nach Art des Hauses und Edamame. Verfeinert mit hausgemachter Soße. Wahlweise mit: / Served on rice with cocktail sauce, avocado, salad, cucumber, mango, homemade kimchi (house style) and edamame. Refined with homemade sauce. Choice of:', 16, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('hauptspeisen', 'Warme Gerichte', 'Warme Gerichte', NULL, 'Gerichte Nr. 70-80 - nach Wahl mit: A. Gebackener Tofu €11,90 | B. Hähnchenbrustfilet €12,90 | C. Gebackener Hähnchenbrustfilet €12,90 | D. Gegrilltes Hähnchen-Brustfilet €13,90 | E. Ente Kross €14,90 | G. Garnelen €13,90 | R. Mariniertes Rindfleisch €13,90 | H. Gegrillter Lachs €15,90 | I. Gebackene Seitan mit Sesam €13,90. Currys/Soßen (70-76) werden mit Duftreis serviert. Pho (77) & Japanische Nudelsuppe (78) mà không cần cơm. Nudeln (82-85) & gebratener Reis (86) / Curries/Sauces (70-76) are served with fragrant rice. Pho (77) & Japanese noodle soup (78) without rice. Noodles (82-85) & fried rice (86)', 17, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('dessert', 'Desserts', 'Desserts', NULL, NULL, 18, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('beilagen', 'Beilage', 'Beilage', NULL, NULL, 19, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

INSERT INTO categories (category_id, name, name_en, category_subtitle, category_desc, sort_order, branch_id) VALUES
  ('getranke', 'Getränke', 'Getränke', NULL, NULL, 20, 'branch_haupt')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  name_en = VALUES(name_en),
  category_subtitle = VALUES(category_subtitle),
  category_desc = VALUES(category_desc),
  sort_order = VALUES(sort_order);

-- ============================================
-- INSERT MENU ITEMS
-- ============================================
-- Menu items for branch_flora
INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '1._mini_spring_roll_1_2_4_11_a', '1. Mini Spring Roll (1,2,4,11,A)', NULL, 'Gebackene Mini Frühlingsrollen, serviert mit Chili-Hähnchen-Soße', 'Baked Mini Spring Rolls, served with chili chicken sauce', 3.90, 'vorspeisen',
  1, 0, '(5 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '2._nem_ha_tinh_a_d', '2. Nem Ha Tinh (A,D)', NULL, 'Gold-gebackene Frühlingsrollen, gefüllt mit gehacktem Tofu, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', 'Golden-fried spring rolls filled with chopped tofu, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', 4.50, 'vorspeisen',
  1, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '3._nem_ha_noi_a_b_d', '3. Nem Ha Noi (A,B,D)', NULL, 'Gold-gebackene Frühlingsrollen, gefüllt mit Garnelen, Hähnchenfleisch, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', 'Golden-fried spring rolls filled with shrimp, chicken, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '4._sommerrollen_tofu_f_e', '4. Sommerrollen Tofu (F,E)', NULL, 'Tofu mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Tofu with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 4.50, 'vorspeisen',
  1, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '5._sommerrollen_h_hnchen_e', '5. Sommerrollen Hähnchen (E)', NULL, 'Hähnchen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Chicken with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '6._sommerrollen_garnelen_b_e', '6. Sommerrollen Garnelen (B,E)', NULL, 'Garnelen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Shrimp with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 5.20, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '7._sommerrollen_gegrillter_lachs_d_e', '7. Sommerrollen gegrillter Lachs (D,E)', NULL, 'Gegrillter Lachs mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Grilled salmon with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '8._edamame_m', '8. Edamame (M)', NULL, 'Japanische Bohnen, leicht gekocht und perfekt gesalzen', 'Japanese beans, lightly cooked and perfectly salted', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '9._tom_chien_com_a_c', '9. Tom Chien Com (A,C)', NULL, 'Großgarnelen mit jungem, grünen Reis, paniert und serviert mit Teriyaki-Soße', 'Large shrimp with young green rice, breaded and served with teriyaki sauce', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '10._algen_salat_a_k', '10. Algen Salat (A,K)', NULL, 'Seetang-Salat, garniert mit Sesam', 'Seaweed salad, garnished with sesame', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '11._prawn_tornado_b_c', '11. Prawn Tornado (B,C)', NULL, 'Gebackene Garnelen, umwickelt mit Kartoffelspirale. serviert mit Chili-Hähnchen-Soße', 'Baked shrimp wrapped in potato spiral, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(3 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '12._khoai_lang_chien', '12. Khoai Lang Chien', NULL, 'Süßkartoffeln', 'Sweet potatoes', 4.90, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '13._yakitori_f', '13. Yakitori (F)', NULL, 'Gegrillte Hähnchenspieße, serviert mit Teriyaki-Soße', 'Grilled chicken skewers, served with teriyaki sauce', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '14._veggie_gyoza_a', '14. Veggie Gyoza (A)', NULL, 'Gebackene Teigtaschen mit Gemüsefüllung, serviert mit Chili-Hähnchen-Soße', 'Baked dumplings with vegetable filling, served with chili chicken sauce', 4.90, 'vorspeisen',
  1, 0, '(5 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '15._japan_gyoza_b', '15. Japan Gyoza (B)', NULL, 'Gebackene Teigtaschen mit Garnelen und Hähnchenfleisch, serviert mit Chili-Hähnchen-Soße', 'Baked dumplings with shrimp and chicken, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(5 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '16._wantan_chien_a_b', '16. Wantan Chien (A,B)', NULL, 'Wonton-Teig knusprig gebacken mit Huhn und Garnelen, serviert mit Chili-Hähnchen-Soße', 'Crispy baked wonton dough with chicken and shrimp, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(5 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '17._kimchi_frau_pham_a_k', '17. Kimchi Frau Pham (A,K)', NULL, 'Scharf eingelegter Chinakohl, Frühlingszwiebeln und Karotten', 'Spicy pickled Chinese cabbage, spring onions, and carrots', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '18._sate_spie_e_e', '18. Sate Spieße (E)', NULL, 'Gegrillte Hähnchenspieße, serviert mit Erdnuss-Soße', 'Grilled chicken skewers, served with peanut sauce', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '19._happy_plate_a_d_e_f_m_k', '19. Happy Plate (A,D,E,F,M,K)', NULL, '2 Sommerrollen mit Tofu, 3 Veggie Gyoza, 2 Nem Hà Tinh, Edamame und Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Cocktail-Soße', '2 summer rolls with tofu, 3 veggie gyoza, 2 Ha Tinh spring rolls, edamame, and seaweed salad, served with peanut sauce, lime-chili sauce, and cocktail sauce', 18.90, 'vorspeisen',
  1, 0, '(Für 2)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '20._happy_plate_a_b_d_e_k', '20. Happy Plate (A,B,D,E,K)', NULL, '2 Sommerrollen mit Hähnchenfleisch, 3 Prawn Tornado, 2 Nem Hà Nội, 5 Wantan-Chiên, Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Chili-Hähnchen-Soße', '2 summer rolls with chicken, 3 prawn tornadoes, 2 Hanoi spring rolls, 5 crispy wontons, seaweed salad, served with peanut sauce, lime-chili sauce, and chili chicken sauce', 20.90, 'vorspeisen',
  0, 0, '(Für 2)', 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '30._mix_sashimi_d_e_k', '30. Mix Sashimi (D,E,K)', NULL, 'Frischer Fisch (Lachs, Thunfisch, Garnelen, Surimi) auf einem raffinierten Frühlingssalat mit hausgemachtem Dressing. Mit Unagi-Sauce, Avocado & Sesam', 'Fresh fish (salmon, tuna, shrimp, surimi) on a refined spring salad with homemade dressing. Topped with unagi sauce, avocado, and sesame', 11.90, 'salate',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '31._mango_salat_e_f', '31. Mango salat (E,F)', NULL, 'Saison-Salat mit Mango, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Seasonal salad with mango, peanuts, crispy onions, herbs, and homemade lime dressing, with:', 7.90, 'salate',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '32._leo_salat_f', '32. Leo Salat (F)', NULL, 'Saison-Salat mit Avocado, Gurke, Kirschtomaten, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Seasonal salad with avocado, cucumber, cherry tomatoes, peanuts, crispy onions, herbs, and homemade lime dressing, with:', 7.90, 'salate',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '33._salmon_love_d', '33. Salmon Love (D)', NULL, 'Gegrilltes Lachsfilet auf Frühlingssalat, verfeinert mit hausgemachtem Dressing. Garniert mit Unagi-Soße, frischen Kräutern, gerösteten Erdnüssen, Röstzwiebeln und mit Limetten-Chili-Dressing verfeinert', 'Grilled salmon fillet on a spring salad, enhanced with homemade dressing. Topped with unagi sauce, fresh herbs, roasted peanuts, crispy onions, and refined with lime-chili dressing', 10.90, 'salate',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '40._miso_suppe_f', '40. Miso Suppe (F)', NULL, 'Japanischer Tofu mit Seetang und Frühlingszwiebeln', 'Japanese tofu with seaweed and spring onions', 3.50, 'suppen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '41._sake_suppe_d', '41. Sake Suppe (D)', NULL, 'Lachssuppe mit Dill, Seetang und Frühlingszwiebeln', 'Salmon soup with dill, seaweed, and spring onions', 3.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '42._ebi_soup_b_k', '42. Ebi Soup (B,K)', NULL, 'Garnelen, Champignons, Zwiebeln, Pakchoi und Koriander', 'Shrimp, mushrooms, onions, bok choy, and coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '43._sua_dua_dau_f', '43. Sua dua dau (F)', NULL, 'Kokosmilch, Tofu, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, tofu, mushrooms, tomatoes, onions, coriander', 4.50, 'suppen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '44._sua_dua_tom_b', '44. Sua Dua Tom (B)', NULL, 'Kokosmilch, Garnelen, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, shrimp, mushrooms, tomatoes, onions, coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '45._sua_dua_ga', '45. Sua Dua Ga', NULL, 'Kokosmilch, Hühnerfleisch, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, chicken, mushrooms, tomatoes, onions, coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '46._wan_tan_suppe_b', '46. Wan-tan-suppe (B)', NULL, 'Garnelen, Hühnerfleisch, Champignons, Zwiebeln, Pakchoi und Koriander', 'Shrimp, chicken, mushrooms, onions, bok choy, and coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's1._men_1_a_d_f', 'S1. Menü 1 (A,D,F)', NULL, '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake', '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake', 9.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's2._men_2', 'S2. Menü 2', NULL, '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago', '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago', 11.50, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's3._men_3', 'S3. Menü 3', NULL, '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake', '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake', 14.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's4._men_4', 'S4. Menü 4', NULL, '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Sake', '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Salmon', 10.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's5._men_5', 'S5. Menü 5', NULL, '8 Sake Maki, 4 Kali I-O, Maguro Nigiri, 1 Sake Nigiri', '8 Salmon Maki, 4 Kali I-O, Maguro Nigiri, 1 Salmon Nigiri', 11.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's6._men_6', 'S6. Menü 6', NULL, '8 Sake Roll, 8 Ebi Maki, 2 Nigiri: Sake, Maguro', '8 Salmon Rolls, 8 Ebi Maki, 2 Nigiri: Salmon, Tuna', 13.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's7._nigiri_men_b', 'S7. Nigiri Menü (B)', NULL, '6 Nigiri: Sake, Maguro, Ebi, Ika, Avocado, Unagi', '6 Nigiri: Salmon, Tuna, Shrimp, Squid, Avocado, Eel', 14.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's8._philadelphia_menu_a_b_d_g_k_f', 'S8. Philadelphia Menu (A,B,D,G,K,F)', NULL, '8 Philadelphia I-O, 8 Sake Avocado Maki, 2 Ebi Nigiri & 2 Sake Nigiri', '8 Philadelphia I-O, 8 Salmon Avocado Maki, 2 Shrimp Nigiri & 2 Salmon Nigiri', 17.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's9._aiko_men', 'S9. Aiko Menü', NULL, '6 Aiko Rollen, 8 Sake Avocado Maki, 2 Maguro Nigiri & 2 Sake Nigiri', '6 Aiko Rolls, 8 Salmon Avocado Maki, 2 Tuna Nigiri & 2 Salmon Nigiri', 18.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's10._tuna_men', 'S10. Tuna Menü', NULL, '8 Maguro Crunchy, 8 Sake Avocado Maki, 2 Maguro Nigiri, 2 Lachs Nigiri', '8 Maguro Crunchy, 8 Salmon Avocado Maki, 2 Tuna Nigiri, 2 Salmon Nigiri', 17.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's11._tori_men', 'S11. Tori Menü', NULL, '6 Yakitori Big Rolls, 8 Tori Maki, 8 Tori I-O', '6 Yakitori Big Rolls, 8 Chicken Maki, 8 Chicken I-O', 15.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's12._deluxe_men_f_r_2_persone', 'S12. Deluxe Menü | Für 2 Persone', NULL, '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Nigiri Sake, 2 Nigiri Maguro', '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Salmon Nigiri, 2 Tuna Nigiri', 32.00, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's13._deluxe_men_leo', 'S13. Deluxe Menü Leo', NULL, '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Sake Nigiri, 1 Maguro Nigiri & 1 Ebi', '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Salmon Nigiri, 1 Tuna Nigiri & 1 Shrimp Nigiri', 45.00, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm1._sake_d', 'M1. Sake (D)', NULL, 'Lachs', 'Salmon', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm2._sake_avocado_d', 'M2. Sake avocado (D)', NULL, 'Lachs Avocado', 'Salmon Avocado', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm3._sake_kappa_d', 'M3. Sake Kappa (D)', NULL, 'Lachs, Gurke', 'Salmon, cucumber', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm4._tekka_d', 'M4. Tekka (D)', NULL, 'Thunfisch', 'Tuna', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm5._spicy_tuna_d', 'M5. Spicy Tuna (D)', NULL, 'Thunfisch, Lauch, Chili', 'Tuna, leek, chili', 4.80, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm6._ebi_b', 'M6. Ebi (B)', NULL, 'Garnelen', 'Shrimp', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm7._ebi_avocado_b', 'M7. Ebi Avocado (B)', NULL, 'Garnelen, Avocado', 'Shrimp, avocado', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm8._california', 'M8. California', NULL, 'Surimi, Avocado', 'Surimi, avocado', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm9._salmon_skin', 'M9. Salmon Skin', NULL, 'Gegrillte Lachshaut, Unagi-Soße', 'Grilled salmon skin, unagi sauce', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm10._tuna_cooked', 'M10. Tuna Cooked', NULL, 'Gekochter Thunfisch, Mayo, Chili, Lauch', 'Cooked tuna, mayo, chili, leek', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm11._sake_cooked', 'M11. Sake Cooked', NULL, 'Gekochter Lachs, Mayo, Chili', 'Cooked salmon, mayo, chili', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm12._tori', 'M12. Tori', NULL, 'Hähnchenstreifen', 'Chicken strips', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm13._kappa', 'M13. Kappa', NULL, 'Gurke, Frischkäse', 'Cucumber, cream cheese', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm14._avocado', 'M14. Avocado', NULL, 'Avocado', 'Avocado', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm15._tamago', 'M15. Tamago', NULL, 'Japan-Omelett', 'Japanese omelette', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm16._unagi', 'M16. Unagi', NULL, 'Flussaal', 'Freshwater eel', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm17._inari', 'M17. Inari', NULL, 'Marinierter Tofu', 'Marinated tofu', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm18._shiitake', 'M18. Shiitake', NULL, 'Japan-Pilz', 'Japanese mushroom', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm19._kampyo', 'M19. Kampyo', NULL, 'Kürbis', 'Pumpkin', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm20._rucula', 'M20. Rucula', NULL, 'Rucola, Frischkäse, Sesam', 'Arugula, cream cheese, sesame', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm21._paprika', 'M21. Paprika', NULL, 'Paprika', 'Bell pepper', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u1._sake_i_o', 'U1. Sake I-O', NULL, 'Lachs, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Salmon, avocado — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u2._maguro_i_o', 'U2. Maguro I-O', NULL, 'Thunfisch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Tuna, cucumber — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u3._ebi_i_o', 'U3. Ebi I-O', NULL, 'Garnelen, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Shrimp, avocado — I-O maki with sesame and fish roe', 8.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u4._ebi_tempura_i_o', 'U4. Ebi Tempura I-O', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Breaded shrimp, cream cheese, cucumber — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u5._veggie_i_o', 'U5. Veggie I-O', NULL, 'Kürbis, Rettich, Avocado, Sesam — umgedrehte Maki mit Sesam', 'Pumpkin, radish, avocado, sesame — I-O maki with sesame', 7.20, 'insideout',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u6._rucola_kappa_i_o', 'U6. Rucola Kappa I-O', NULL, 'Rucola, Gurke, Frischkäse — umgedrehte Maki mit Sesam', 'Arugula, cucumber, cream cheese — I-O maki with sesame', 7.20, 'insideout',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u7._california_i_o', 'U7. California I-O', NULL, 'Krebsfleischimitat, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Imitation crab, avocado — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u8._ebi_spicy_i_o', 'U8. Ebi Spicy I-O', NULL, 'Scharfe Garnelen, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy shrimp, cucumber, leek — I-O maki with sesame and fish roe', 8.20, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u9._sake_spicy_i_o', 'U9. Sake Spicy I-O', NULL, 'Scharfer Lachs, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy salmon, cucumber, leek — I-O maki with sesame and fish roe', 8.20, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u10._salmon_skin_i_o', 'U10. Salmon Skin I-O', NULL, 'Lachshaut, Gurke, Aal — umgedrehte Maki mit Sesam und Fischrogen', 'Salmon skin, cucumber, eel — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u11._maguro_spicy_i_o', 'U11. Maguro Spicy I-O', NULL, 'Scharfer Thunfisch, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy tuna, cucumber, leek — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u12._tamago_i_o', 'U12. Tamago I-O', NULL, 'Omelett, Avocado, Sesam — umgedrehte Maki mit Sesam', 'Omelette, avocado, sesame — I-O maki with sesame', 7.20, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u13._lachs_cooked_i_o', 'U13. Lachs Cooked I-O', NULL, 'Gekochter Lachs, Mayo, Chili, Lauch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Cooked salmon, mayo, chili, leek, cucumber — I-O maki with sesame and fish roe', 7.80, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u14._tuna_cooked_i_o', 'U14. Tuna Cooked I-O', NULL, 'Gekochter Thunfisch, Mayonnaise, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Cooked tuna, mayonnaise, leek — I-O maki with sesame and fish roe', 7.80, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u15._tori_i_o', 'U15. Tori I-O', NULL, 'Mariniertes Hühnerfleisch, Gurke, Sesam, Frischkäse — umgedrehte Maki mit Sesam', 'Marinated chicken, cucumber, sesame, cream cheese — I-O maki with sesame', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u16._lachs_rucola_i_o', 'U16. Lachs Rucola I-O', NULL, 'Lachs, Frischkäse, Rucola, Sesam — umgedrehte Maki mit Sesam', 'Salmon, cream cheese, arugula, sesame — I-O maki with sesame', 8.20, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c1._sake_crunchy', 'C1. Sake Crunchy', NULL, 'Lachs, Avocado, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Salmon, avocado, cream cheese — wrapped in crispy tempura flakes, special sauce and sesame', 7.50, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c2._maguro_crunchy', 'C2. Maguro Crunchy', NULL, 'Scharfer Thunfisch, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Spicy tuna, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.90, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c3._ebi_crunchy', 'C3. Ebi Crunchy', NULL, 'Scharfe Garnelen, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Spicy shrimp, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.50, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c4._skin_crunchy', 'C4. Skin Crunchy', NULL, 'Gegrillte Lachshaut, Gurke, Aal — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Grilled salmon skin, cucumber, eel — wrapped in crispy tempura flakes, special sauce and sesame', 7.50, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c5._salmon_tempura_crunchy', 'C5. Salmon Tempura Crunchy', NULL, 'Panierter Lachs, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße Sesam', 'Breaded salmon, cream cheese — wrapped in crispy tempura flakes, special sauce sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c6._tuna_crunchy', 'C6. Tuna Crunchy', NULL, 'Gekochter, scharfer Thunfisch, Mayonnaise, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Cooked spicy tuna, mayonnaise, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c7._tori_crunchy', 'C7. Tori Crunchy', NULL, 'Panierte Hühnerfleisch- und Frischkäserollen mit Gurken, umhüllt von knusprigen Tempura-Flocken, serviert mit Spezialsoße und Sesam', 'Breaded chicken and cream cheese rolls with cucumber, coated in crispy tempura flakes, served with special sauce and sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa1._sake_6_stk.', 'Sa1. Sake (6 Stk.)', NULL, 'Lachs', 'Salmon', 13.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa2._maguro_6_stk.', 'Sa2. Maguro (6 Stk.)', NULL, 'Thunfisch', 'Tuna', 14.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa3._sake_maguro', 'Sa3. Sake & Maguro', NULL, 'Lachs (5 Stk.) & Thunfisch (5 Stk.)', 'Salmon (5 pcs.) & Tuna (5 pcs.)', 18.00, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n1._sake_d', 'N1. Sake (D)', NULL, 'Lachs', 'Salmon', 3.90, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n2._maguro_d', 'N2. Maguro (D)', NULL, 'Thunfisch', 'Tuna', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n3._amaebi_b', 'N3. Amaebi (B)', NULL, 'Süßwasser-Garnelen', 'Freshwater shrimp', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n4._ebi_d', 'N4. Ebi (D)', NULL, 'Garnelen', 'Shrimp', 4.20, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n5._ikura_d', 'N5. Ikura (D)', NULL, 'Lachskaviar', 'Salmon roe', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n6._unagi_d', 'N6. Unagi (D)', NULL, 'Süßwasseraal', 'Freshwater eel', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n7._kani_a_b_d_1_2_4', 'N7. Kani (A,B,D,1,2,4)', NULL, 'Surimi', 'Surimi', 3.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n8._tamago_c', 'N8. Tamago (C)', NULL, 'Omelett', 'Omelette', 3.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n9._ika_d', 'N9. Ika (D)', NULL, 'Tintenfisch', 'Squid', 3.90, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n10._inari_f', 'N10. Inari (F)', NULL, 'Tofu', 'Tofu', 3.50, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n11._shiitake', 'N11. Shiitake', NULL, 'Japanische Pilze', 'Japanese mushrooms', 3.50, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n12._avocado', 'N12. Avocado', NULL, 'Avocado', 'Avocado', 3.20, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p1._leo_rolls_a_d_g_k', 'P1. Leo Rolls (A,D,G,K)', NULL, 'Lachs, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Salmon, cucumber, avocado, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p2._aiko_rolls_a_d_g_k', 'P2. Aiko Rolls (A,D,G,K)', NULL, 'Gekochter Thunfisch, Lauch, Mayo, Chili, Gurke – serviert mit Spezialsoßen und Sesam', 'Cooked tuna, leek, mayo, chili, cucumber – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p3._tokyo_rolls_a_b_d_g_k_1_2_4', 'P3. Tokyo Rolls (A,B,D,G,K,1,2,4)', NULL, 'Lachshaut, Aal, Surimi, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Salmon skin, eel, surimi, cucumber, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p4._fuji_san_rolls_a_d_g_k', 'P4. Fuji San Rolls (A,D,G,K)', NULL, 'Garnelen, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Shrimp, cucumber, avocado, cream cheese – served with special sauces and sesame', 8.50, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p5._emilia_rolls_a_k', 'P5. Emilia Rolls (A,K)', NULL, 'Avocado, Paprika, Gurke, Kürbis, Shiitake – serviert mit Spezialsoßen und Sesam', 'Avocado, bell pepper, cucumber, pumpkin, shiitake – served with special sauces and sesame', 7.90, 'bigrolls',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p6._yakitori_rolls_a_g_k', 'P6. Yakitori Rolls (A,G,K)', NULL, 'Hähnchen, Avocado, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Chicken, avocado, cucumber, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p7._bao_ngoc_rolls_a_d_k', 'P7. Bao ngoc Rolls (A,D,K)', NULL, 'Gekochter Lachs, Mayo, Chili, Gurke, Avocado – serviert mit Spezialsoßen und Sesam', 'Cooked salmon, mayo, chili, cucumber, avocado – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa1._sake_rolls_a_d_g_k', 'Pa1. Sake Rolls (A,D,G,K)', NULL, 'Lachs — serviert mit Spezialsoßen und Sesam', 'Salmon — served with special sauces and sesame', 6.50, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa2._ebi_rolls_a_b_g_k', 'Pa2. Ebi Rolls (A,B,G,K)', NULL, 'Garnelen, Lauch, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Shrimp, leek, cream cheese — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa3._spicy_rolls_a_d_k', 'Pa3. Spicy Rolls (A,D,K)', NULL, 'Thunfisch, Chili, Lauch — serviert mit Spezialsoßen und Sesam', 'Tuna, chili, leek — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa4._bao_ngoc_rolls_a_d_k', 'Pa4. Bao ngoc Rolls (A,D,K)', NULL, 'Gekochter Lachs, Mayo, Chili — serviert mit Spezialsoßen und Sesam', 'Cooked salmon, mayo, chili — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa5._veggie_rolls_a_k', 'Pa5. Veggie Rolls (A,K)', NULL, 'Shiitake, Kürbis — serviert mit Spezialsoßen und Sesam', 'Shiitake, pumpkin — served with special sauces and sesame', 6.50, 'minirolls',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa6._avocado_rolls_a_g_k', 'Pa6. Avocado Rolls (A,G,K)', NULL, 'Avocado, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Avocado, cream cheese — served with special sauces and sesame', 6.50, 'minirolls',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa7._tori_rolls_g_k', 'Pa7. Tori Rolls (G,K)', NULL, 'Hähnchen, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Chicken, cream cheese — served with special sauces and sesame', 6.50, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp1._leo_rolls_a_c_f', 'Sp1. Leo Rolls (A,C,F)', NULL, 'Avocado, Inari und Gurke — umwickelt mit Avocado', 'Avocado, inari and cucumber — wrapped with avocado', 5.50, 'specialrolls',
  1, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g', 'Sp2. Mango Thunfisch Roll (A,D,G)', NULL, 'Gekochter Thunfisch, Mayonnaise, Lauch, Chili, Gurke — umwickelt mit Mango, serviert mit Spezialsoße und Sesam', 'Cooked tuna, mayonnaise, leek, chili, cucumber — wrapped with mango, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp3._fire_tuna_a_d_g', 'Sp3. Fire Tuna (A,D,G)', NULL, 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Thunfisch', 'Breaded vegetables, cream cheese — wrapped with flambéed tuna', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp4._fire_salmon_a_d_g', 'Sp4. Fire Salmon (A,D,G)', NULL, 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Lachs', 'Breaded vegetables, cream cheese — wrapped with flambéed salmon', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp5._tiger_rolls_a_g_n_b', 'Sp5. Tiger Rolls (A,G,N,B)', NULL, 'Garnelen-Tempura und Gurke — umwickelt mit Aal, serviert mit Spezialsoße und Sesam', 'Shrimp tempura and cucumber — wrapped with eel, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g', 'Sp6. Chicken rolls (1,2,4,11,G)', NULL, 'Gegrillte Hähnchenfiletstreifen, Mango und Oshinko — umwickelt mit Gurke', 'Grilled chicken fillet strips, mango and oshinko — wrapped with cucumber', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d', 'Sp7. Fire Ocean Rolls (A,B,G,D)', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit flambiertem Lachs und Thunfisch, serviert mit Spezialsoßen und Sesam', 'Breaded shrimp, cream cheese, cucumber — wrapped with flambéed salmon and tuna, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp8._tuna_rolls_d_g', 'Sp8. Tuna Rolls (D,G)', NULL, 'Gekochter Thunfisch, Mayo, Lauch, Chili, Gurke — umwickelt mit Röstzwiebeln, serviert mit Spezialsoßen und Sesam', 'Cooked tuna, mayo, leek, chili, cucumber — wrapped with crispy onions, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g', 'Sp9. Philadelphia Rolls (A,B,D,G)', NULL, 'Gemüse-Tempura und Frischkäse — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', 'Vegetable tempura and cream cheese — wrapped with salmon, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp10._kyoto_rolls_c_d', 'Sp10. Kyoto Rolls (C,D)', NULL, 'Lachs, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', 'Salmon, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d', 'Sp11. Sake Alaska Rolls (B,C,D)', NULL, 'Lachs, Avocado, Frischkäse — umwickelt mit Lachs. serviert mit Spezialsoße und Sesam', 'Salmon, avocado and cream cheese — wrapped with salmon, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp12._omelette_rolls_b_c', 'Sp12. Omelette Rolls (B,C)', NULL, 'Omelett, Avocado, Surimi, Frischkäse — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', 'Omelette, avocado, surimi, cream cheese — wrapped with shrimp, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp13._dragon_rolls_a_b_g_d', 'Sp13. Dragon Rolls (A,B,G,D)', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', 'Breaded shrimp, cream cheese, cucumber — wrapped with salmon, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp14._fuji_rolls_a_d_g', 'Sp14. Fuji Rolls (A,D,G)', NULL, 'Ebi, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', 'Shrimp, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d', 'Sp15. Tempura Special Rolls (A,B,C,D)', NULL, 'Panierter Lachs, Frischkäse, Gurke — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', 'Breaded salmon, cream cheese, cucumber — wrapped with shrimp, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp16._taiko_rolls_a_b_g_d', 'Sp16. Taiko Rolls (A,B,G,D)', NULL, 'Garnelen, Avocado, Gurke, Frischkäse — umwickelt mit Lachs und Thunfisch', 'Shrimp, avocado, cucumber, cream cheese — wrapped with salmon and tuna', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f1._maguro_aburi_d_k', 'F1. Maguro Aburi (D,K)', NULL, 'Thunfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Tuna — flying fish roe, sesame, spring onions and special sauce, flambéed', 5.20, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f2._sake_aburi_d_k', 'F2. Sake Aburi (D,K)', NULL, 'Lachs — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Salmon — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f3._squid_aburi_d_k', 'F3. Squid Aburi (D,K)', NULL, 'Tintenfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Squid — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f4._maguro_tatar_d_k', 'F4. Maguro-Tatar (D,K)', NULL, 'Gurkenhülle mit scharfem Thunfisch, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Cucumber wrap with spicy tuna, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.90, 'firenigiri',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f5._salmon_rose_a_g_k', 'F5. Salmon Rose (A,G,K)', NULL, 'Flambierter gehackter Lachs, Mayonnaise, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Flambéed chopped salmon, mayonnaise, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', 5.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te1._maguro_temaki', 'Te1. Maguro Temaki', NULL, 'Thunfisch, Gurken, Avocado', 'Tuna, cucumber, avocado', 5.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te2._sake_temaki', 'Te2. Sake Temaki', NULL, 'Lachs, Avocado, Gurken', 'Salmon, avocado, cucumber', 4.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te3._california_temaki', 'Te3. California Temaki', NULL, 'Surimi, Avocado, Gurken', 'Surimi, avocado, cucumber', 4.60, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te4._salmon_skin_temaki', 'Te4. Salmon Skin Temaki', NULL, 'Lachshaut, Gurke, Aal', 'Salmon skin, cucumber, eel', 4.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te5._tamago_temaki', 'Te5. Tamago Temaki', NULL, 'Omelett, Avocado, Gurken', 'Omelette, avocado, cucumber', 4.60, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te6._inari_avocado_temaki', 'Te6. Inari Avocado Temaki', NULL, 'Tofu, Gurken, Avocado', 'Tofu, cucumber, avocado', 4.60, 'temaki',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '50._sake_teriyaki_d_f', '50. Sake Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Lachsgericht, serviert mit Gemüse und Reis', 'Japanese grilled salmon dish, served with vegetables and rice', 16.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '51._tuna_teriyaki_d_f', '51. Tuna Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Thunfischgericht, serviert mit Gemüse und Reis', 'Japanese grilled tuna dish, served with vegetables and rice', 17.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '52._tori_teriyaki_f', '52. Tori Teriyaki (F)', NULL, 'Japanisches gegrilltes Hähnchengericht, serviert mit Gemüse und Reis', 'Japanese grilled chicken dish, served with vegetables and rice', 14.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '53._ebi_teriyaki_b_f', '53. Ebi Teriyaki (B,F)', NULL, 'Japanisches gegrilltes Garnelengericht, serviert mit Gemüse und Reis', 'Japanese grilled shrimp dish, served with vegetables and rice', 15.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '54._squid_teriyaki_d_f', '54. Squid Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Tintenfischgericht, serviert mit Gemüse und Reis', 'Japanese grilled squid dish, served with vegetables and rice', 15.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '55._duck_teriyaki_a_f', '55. Duck Teriyaki (A,F)', NULL, 'Japanisches gegrilltes Entengericht, serviert mit Gemüse und Reis', 'Japanese grilled duck dish, served with vegetables and rice', 16.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '60._tufu_bowl_f_k_g', '60. Tufu Bowl (F,K,G)', NULL, 'Gebackene Bio-Tofu mit Sesam', 'Fried organic tofu with sesame', 11.90, 'pokebowl',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '61._seitan_bowl_f', '61. Seitan Bowl (F)', NULL, 'Gebratener Seitan (vegan) mit Sesam', 'Fried seitan (vegan) with sesame', 12.90, 'pokebowl',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '62._sake_bowl_d_g_k', '62. Sake Bowl (D,G,K)', NULL, 'Lachs', 'Salmon', 13.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '63._tori_bowl_g_k', '63. Tori Bowl (G,K)', NULL, 'Gebackene Huhn', 'Fried chicken', 12.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '64._bowl_grill_d_g_k', '64. Bowl Grill (D,G,K)', NULL, 'Gegrillter Lachs, Thunfisch mit Sesam', 'Grilled salmon, tuna with sesame', 14.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '65._ebi_bowl_b', '65. Ebi Bowl (B)', NULL, 'Gebackene Ebi', 'Fried shrimp', 13.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '70._roter_curry', '70. Roter Curry', NULL, 'Kokosmilch, rotes Curry, verschiedenes Gemüse und Reis, dazu:', 'Coconut milk, red curry, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '71._erdnuss', '71. Erdnuss', NULL, 'Cremige Kokosmilch-Erdnuss-Soße, verschiedenes Gemüse und Reis, dazu:', 'Creamy coconut-peanut sauce, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '72._mango_curry', '72. Mango-Curry', NULL, 'Feinwürzige Mango-Curry-Soße, verschiedenes Gemüse und Reis, dazu:', 'Spicy mango curry sauce, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '73._avocado_curry', '73. Avocado Curry', NULL, 'Cremige Kokosmilch-Soße, grünes Curry, verschiedenes Gemüse und Duftreis, dazu:', 'Creamy coconut sauce, green curry, assorted vegetables and fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '74._good_curry', '74. Good Curry', NULL, 'Cremige Kokosmilch-Soße, Ingwer-Curry, verschiedenes Gemüse und Duftreis, dazu:', 'Creamy coconut sauce, ginger curry, assorted vegetables and fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '75._leo_spezial_so_e', '75. Leo Spezial-Soße', NULL, 'Frisches vietnamesisches Gemüse, pikante Soße, Knoblauch mit Duftreis, dazu:', 'Fresh Vietnamese vegetables, spicy sauce, garlic with fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '76._pad_thai', '76. Pad Thai', NULL, 'Reisbandnudeln im heißen Wok mit Ei, frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', 'Rice noodles stir-fried in a hot wok with egg, fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '77._japanische_nudelsuppe', '77. Japanische Nudelsuppe', NULL, 'Japanische Nudeln, Hühnerbrühe, Gemüse und Kräuter, dazu:', 'Japanese noodles, chicken broth, vegetables and herbs, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '78._udon_coco', '78. Udon Coco', NULL, 'Japanische Nudeln in Kokosmilch, Masaman-Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', 'Japanese noodles in coconut milk, masaman curry, salad, peanuts, crispy onions and herbs, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '79._pho_tron', '79. Pho Tron', NULL, 'Reisbandnudeln in Kokosmilch, rotem Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', 'Rice noodles in coconut milk, red curry, salad, peanuts, fried onions and herbs, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '80._bun_bo_nam_bo', '80. Bun Bo Nam Bo', NULL, 'Typisch südvietnamesische Esskultur mit dünnen Reisbandnudeln, frischem Salat, Erdnüssen, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Typical South Vietnamese cuisine with thin rice noodles, fresh salad, peanuts, herbs, and homemade lime dressing, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '81._ph', '81. Phở', NULL, 'Traditionelle vietnamesische Suppe mit Bandnudeln, frischem Ingwer und Kräutern, dazu:', 'Traditional Vietnamese soup with rice noodles, fresh ginger, and herbs, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '82._udon_yaki', '82. Udon Yaki', NULL, 'Udon-Nudeln im heißen Wok mit Ei, frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', 'Udon noodles stir-fried in a hot wok with egg, fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', 12.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '83._rau_x_o_tofu_f', '83. Rau Xào Tofu (F)', NULL, 'Gebackene verschiedenes Gemüse, Zwiebeln, Pak Choi und Tofu mit Sesam, hausgemachter Pfeffersoße, vegetarisch und serviert mit Reis', 'Stir-fried mixed vegetables, onions, pak choi and tofu with sesame, homemade pepper sauce, vegetarian and served with rice', 12.90, 'hauptspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '84._rau_x_o_seitan_f', '84. Rau Xào Seitan (F)', NULL, 'Gebackene verschiedenes Gemüse, Zwiebeln, Pak Choi und Seitan mit Sesam, hausgemachter Pfeffersoße, vegetarisch und serviert mit Reis', 'Stir-fried mixed vegetables, onions, pak choi and seitan with sesame, homemade pepper sauce, vegetarian and served with rice', 14.90, 'hauptspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '85._steak_grill_lachs_d_medium', '85. Steak Grill Lachs (D) (Medium)', NULL, 'Gebackene Gemüse mit Zwiebeln, Lachs und Pak Choi, serviert mit Reis', 'Stir-fried vegetables with onions, salmon, and pak choi, served with rice', 16.90, 'hauptspeisen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '86._steak_grill_thunfisch_d_medium', '86. Steak Grill Thunfisch (D) (Medium)', NULL, 'Gebackene verschiedenes Gemüse mit Zwiebeln, Thunfisch und Pak Choi, serviert mit Reis', 'Stir-fried mixed vegetables with onions, tuna, and pak choi, served with rice', 17.90, 'hauptspeisen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '87._bo_luc_lac', '87. Bo Luc Lac', NULL, 'Gebackene verschiedenes Gemüse mit Zwiebeln, Pak Choi und Rindfleisch, serviert mit hausgemachter Soße und Reis', 'Stir-fried mixed vegetables with onions, pak choi, and beef, served with homemade sauce and rice', 16.90, 'hauptspeisen',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '88._black_tiger_b', '88. Black Tiger (B)', NULL, 'Gebackene verschiedenes Gemüse mit Zwiebeln, Pak Choi und Riesengarnelen, serviert mit hausgemachter Pfeffersoße und Reis', 'Stir-fried mixed vegetables with onions, pak choi, and king prawns, served with homemade pepper sauce and rice', 16.90, 'hauptspeisen',
  0, 0, NULL, 0, 1, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd1._dragon_ball_3_stk.', 'D1. Dragon Ball (3 Stk.)', NULL, 'Gefüllt mit süßen Bohnen', 'Filled with sweet beans', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd2._mochi_2_stk.', 'D2. Mochi (2 Stk.)', NULL, 'Reiskuchen mit roten Bohnen', 'Rice cake with red beans', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd3._lucky_egg_3_stk.', 'D3. Lucky Egg (3 Stk.)', NULL, 'Gefüllt mit Vanille', 'Filled with vanilla', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd4._bananiflirt_5_stk.', 'D4. Bananiflirt (5 Stk.)', NULL, 'Gebackene Banane mit Spezialsoße', 'Fried banana with special sauce', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b1._duftreis', 'B1. Duftreis', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b2._sushi_reis', 'B2. Sushi Reis', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b3._ingwer', 'B3. Ingwer', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b4._wasabi', 'B4. Wasabi', NULL, NULL, NULL, 1.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b5._unagi_so_e', 'B5. Unagi-Soße', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b6._cocktailso_e', 'B6. Cocktailsoße', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b7._reiband_nudeln', 'B7. Reiband-Nudeln', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b8._udon_nudeln', 'B8. Udon-Nudeln', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'naturell', 'Naturell', NULL, NULL, NULL, 2.50, 'getranke',
  0, 1, NULL, 0, 0, 'Wasser/ Mineral Water', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mineral_wasser_sprudel', 'Mineral wasser/ sprudel', NULL, NULL, NULL, 2.50, 'getranke',
  0, 1, NULL, 0, 0, 'Wasser/ Mineral Water', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cocacola', 'Cocacola', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cola_light', 'Cola Light', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'fanta', 'Fanta', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sprite', 'Sprite', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ginger_ale', 'Ginger Ale', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'tonic', 'Tonic', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'apfel', 'Apfel', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ananas', 'Ananas', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'maracuja', 'Maracuja', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'orange', 'Orange', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mango', 'Mango', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'kirsche', 'Kirsche', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'banane', 'Banane', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cafe_s_a_n_ng', 'Cafe Sữa Nóng', NULL, 'Hot Vietnamese Coffee', 'Hot Vietnamese Coffee', 4.50, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'green_tea', 'Green Tea', NULL, NULL, NULL, 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ingwer_tea', 'Ingwer Tea', NULL, 'Ginger Tea', 'Ginger Tea', 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'jasmint_tea', 'Jasmint tea', NULL, 'Jasmine Tea', 'Jasmine Tea', 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'nha_dam', 'Nha Dam', NULL, 'Limetten, Zitronengras, Aloe Vera, Minze', 'Lime, Lemongrass, Aloe Vera, Mint', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ingwer_limonad', 'Ingwer Limonad', NULL, 'Frische Ingwer, Zitrone, Orange, Rohzucker, Orangensaft, Ananassaft', 'Fresh Ginger, Lemon, Orange, Raw sugar, Orange juice, Pineapple juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'hausgemachte_eistee', 'Hausgemachte Eistee', NULL, 'Jasmin Tee (Apfelsaft/ Mango/ Maracuja oder Erdbeere)', 'Jasmine Tea (Apple juice/ Mango/ Passion fruit or Strawberry)', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mango_lassi', 'Mango Lassi', NULL, 'Joghurt, Mango, Mangosirup, Kokossirup, Mangosaft', 'Yogurt, Mango, Mango syrup, Coconut syrup, Mango juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'avocado_lassi', 'Avocado Lassi', NULL, 'Avocado, Mangosirup, Joghurt, Milch', 'Avocado, mango syrup, yogurt, milk', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'chanh_da', 'Chanh da', NULL, 'Frische Limetten, Rohrzucker, Mineralwasser', 'Fresh Lime, Raw sugar, Mineral water', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ipanema', 'Ipanema', NULL, 'Limetten, Rohzucker, Ginger Ale', 'Lime, Raw sugar, Ginger Ale', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mojito', 'Mojito', NULL, 'Limetten, Rohzucker, Minze, Ginger Ale', 'Lime, Raw sugar, Mint, Ginger Ale', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'coconut_kiss', 'Coconut Kiss', NULL, 'Kokossirup, Sahne, Ananassaft', 'Coconut syrup, cream, pineapple juice', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sportsman', 'Sportsman', NULL, 'Banane, Zitrone, Limette, Rohzucker, Maracuja-Sirup, Orange-Saft, Ananas-Saft', 'Banana, Lemon, Lime, Raw sugar, Passion fruit syrup, Orange juice, Pineapple juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'tiger_bier_singapur', 'Tiger Bier Singapur', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sai_gon_bier', 'Sai Gon Bier', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'warsteiner_alkoholfrei', 'Warsteiner/ Alkoholfrei', NULL, 'Alcohol-free', 'Alcohol-free', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei', 'Erdinger Hefeweizen, dunkel/ hell/ alkoholfrei', NULL, 'Erdinger Wheat beer, dark/ light/ alcohol-free', 'Erdinger Wheat beer, dark/ light/ alcohol-free', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'asahi_bier', 'Asahi Bier', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'grauburgunder_trocken', 'Grauburgunder Trocken', NULL, 'Pinot Gris Dry', 'Pinot Gris Dry', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Weisswein', 'branch_flora'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'riesling', 'Riesling', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Weisswein', 'branch_flora'
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

-- Menu items for branch_haupt
INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '1._mini_spring_roll_1_2_4_11_a_haupt', '1. Mini Spring Roll (1,2,4,11,A)', NULL, 'Gebackene Mini Frühlingsrollen, serviert mit Chili-Hähnchen-Soße', 'Baked Mini Spring Rolls, served with chili chicken sauce', 3.90, 'vorspeisen',
  1, 0, '(5 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '2._nem_ha_tinh_a_d_haupt', '2. Nem Ha Tinh (A,D)', NULL, 'Gold-gebackene Frühlingsrollen, gefüllt mit gehacktem Tofu, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', 'Golden-fried spring rolls filled with chopped tofu, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', 4.50, 'vorspeisen',
  1, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '3._nem_ha_noi_a_b_d_haupt', '3. Nem Ha Noi (A,B,D)', NULL, 'Gold-gebackene Frühlingsrollen, gefüllt mit Garnelen, Hähnchenfleisch, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', 'Golden-fried spring rolls filled with shrimp, chicken, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '4._sommerrollen_tofu_f_e_haupt', '4. Sommerrollen Tofu (F,E)', NULL, 'Tofu mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Tofu with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 4.50, 'vorspeisen',
  1, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '5._sommerrollen_h_hnchen_e_haupt', '5. Sommerrollen Hähnchen (E)', NULL, 'Hähnchen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Chicken with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '6._sommerrollen_garnelen_b_e_haupt', '6. Sommerrollen Garnelen (B,E)', NULL, 'Garnelen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Shrimp with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 5.20, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '7._sommerrollen_gegrillter_lachs_d_e_haupt', '7. Sommerrollen gegrillter Lachs (D,E)', NULL, 'Gegrillter Lachs mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', 'Grilled salmon with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '8._edamame_m_haupt', '8. Edamame (M)', NULL, 'Japanische Bohnen, leicht gekocht und perfekt gesalzen', 'Japanese beans, lightly cooked and perfectly salted', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '9._tom_chien_com_a_c_haupt', '9. Tom Chien Com (A,C)', NULL, 'Großgarnelen mit jungem, grünen Reis, paniert und serviert mit Teriyaki-Soße', 'Large shrimp with young green rice, breaded and served with teriyaki sauce', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '10._algen_salat_a_k_haupt', '10. Algen Salat (A,K)', NULL, 'Seetang-Salat, garniert mit Sesam', 'Seaweed salad, garnished with sesame', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '11._prawn_tornado_b_c_haupt', '11. Prawn Tornado (B,C)', NULL, 'Gebackene Garnelen, umwickelt mit Kartoffelspirale. serviert mit Chili-Hähnchen-Soße', 'Baked shrimp wrapped in potato spiral, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(3 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '12._khoai_lang_chien_haupt', '12. Khoai Lang Chien', NULL, 'Süßkartoffeln', 'Sweet potatoes', 4.90, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '13._yakitori_f_haupt', '13. Yakitori (F)', NULL, 'Gegrillte Hähnchenspieße, serviert mit Teriyaki-Soße', 'Grilled chicken skewers, served with teriyaki sauce', 4.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '14._veggie_gyoza_a_haupt', '14. Veggie Gyoza (A)', NULL, 'Gebackene Teigtaschen mit Gemüsefüllung, serviert mit Chili-Hähnchen-Soße', 'Baked dumplings with vegetable filling, served with chili chicken sauce', 4.90, 'vorspeisen',
  1, 0, '(5 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '15._japan_gyoza_b_haupt', '15. Japan Gyoza (B)', NULL, 'Gebackene Teigtaschen mit Garnelen und Hähnchenfleisch, serviert mit Chili-Hähnchen-Soße', 'Baked dumplings with shrimp and chicken, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(5 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '16._wantan_chien_a_b_haupt', '16. Wantan Chien (A,B)', NULL, 'Wonton-Teig knusprig gebacken mit Huhn und Garnelen, serviert mit Chili-Hähnchen-Soße', 'Crispy baked wonton dough with chicken and shrimp, served with chili chicken sauce', 4.90, 'vorspeisen',
  0, 0, '(5 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '17._kimchi_frau_pham_a_k_haupt', '17. Kimchi Frau Pham (A,K)', NULL, 'Scharf eingelegter Chinakohl, Frühlingszwiebeln und Karotten', 'Spicy pickled Chinese cabbage, spring onions, and carrots', 4.50, 'vorspeisen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '18._sate_spie_e_e_haupt', '18. Sate Spieße (E)', NULL, 'Gegrillte Hähnchenspieße, serviert mit Erdnuss-Soße', 'Grilled chicken skewers, served with peanut sauce', 5.90, 'vorspeisen',
  0, 0, '(2 Stk.)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '19._happy_plate_a_d_e_f_m_k_haupt', '19. Happy Plate (A,D,E,F,M,K)', NULL, '2 Sommerrollen mit Tofu, 3 Veggie Gyoza, 2 Nem Hà Tinh, Edamame und Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Cocktail-Soße', '2 summer rolls with tofu, 3 veggie gyoza, 2 Ha Tinh spring rolls, edamame, and seaweed salad, served with peanut sauce, lime-chili sauce, and cocktail sauce', 18.90, 'vorspeisen',
  1, 0, '(Für 2)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '20._happy_plate_a_b_d_e_k_haupt', '20. Happy Plate (A,B,D,E,K)', NULL, '2 Sommerrollen mit Hähnchenfleisch, 3 Prawn Tornado, 2 Nem Hà Nội, 5 Wantan-Chiên, Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Chili-Hähnchen-Soße', '2 summer rolls with chicken, 3 prawn tornadoes, 2 Hanoi spring rolls, 5 crispy wontons, seaweed salad, served with peanut sauce, lime-chili sauce, and chili chicken sauce', 20.90, 'vorspeisen',
  0, 0, '(Für 2)', 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '30._mix_sashimi_d_e_k_haupt', '30. Mix Sashimi (D,E,K)', NULL, 'Frischer Fisch (Lachs, Thunfisch, Garnelen, Surimi) auf einem raffinierten Frühlingssalat mit hausgemachtem Dressing. Mit Unagi-Sauce, Avocado & Sesam', 'Fresh fish (salmon, tuna, shrimp, surimi) on a refined spring salad with homemade dressing. Topped with unagi sauce, avocado, and sesame', 11.90, 'salate',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '31._mango_salat_e_f_haupt', '31. Mango salat (E,F)', NULL, 'Saison-Salat mit Mango, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Seasonal salad with mango, peanuts, crispy onions, herbs, and homemade lime dressing, with:', 7.90, 'salate',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '32._leo_salat_f_haupt', '32. Leo Salat (F)', NULL, 'Saison-Salat mit Avocado, Gurke, Kirschtomaten, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Seasonal salad with avocado, cucumber, cherry tomatoes, peanuts, crispy onions, herbs, and homemade lime dressing, with:', 7.90, 'salate',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '33._salmon_love_d_haupt', '33. Salmon Love (D)', NULL, 'Gegrilltes Lachsfilet auf Frühlingssalat, verfeinert mit hausgemachtem Dressing. Garniert mit Unagi-Soße, frischen Kräutern, gerösteten Erdnüssen, Röstzwiebeln und mit Limetten-Chili-Dressing verfeinert', 'Grilled salmon fillet on a spring salad, enhanced with homemade dressing. Topped with unagi sauce, fresh herbs, roasted peanuts, crispy onions, and refined with lime-chili dressing', 10.90, 'salate',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '40._miso_suppe_f_haupt', '40. Miso Suppe (F)', NULL, 'Japanischer Tofu mit Seetang und Frühlingszwiebeln', 'Japanese tofu with seaweed and spring onions', 3.50, 'suppen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '41._sake_suppe_d_haupt', '41. Sake Suppe (D)', NULL, 'Lachssuppe mit Dill, Seetang und Frühlingszwiebeln', 'Salmon soup with dill, seaweed, and spring onions', 3.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '42._ebi_soup_b_k_haupt', '42. Ebi Soup (B,K)', NULL, 'Garnelen, Champignons, Zwiebeln, Pakchoi und Koriander', 'Shrimp, mushrooms, onions, bok choy, and coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '43._sua_dua_dau_f_haupt', '43. Sua dua dau (F)', NULL, 'Kokosmilch, Tofu, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, tofu, mushrooms, tomatoes, onions, coriander', 4.50, 'suppen',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '44._sua_dua_tom_b_haupt', '44. Sua Dua Tom (B)', NULL, 'Kokosmilch, Garnelen, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, shrimp, mushrooms, tomatoes, onions, coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '45._sua_dua_ga_haupt', '45. Sua Dua Ga', NULL, 'Kokosmilch, Hühnerfleisch, Champignons, Tomaten, Zwiebeln, Koriander', 'Coconut milk, chicken, mushrooms, tomatoes, onions, coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '46._wan_tan_suppe_b_haupt', '46. Wan-tan-suppe (B)', NULL, 'Garnelen, Hühnerfleisch, Champignons, Zwiebeln, Pakchoi und Koriander', 'Shrimp, chicken, mushrooms, onions, bok choy, and coriander', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '47._sauer_scharf_suppe_b_haupt', '47. Sauer-Scharf-Suppe (B)', NULL, 'Die Suppe wird mit frischen Zutaten zubereitet', 'The soup is made with fresh ingredients', 4.90, 'suppen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's1._men_1_a_d_f_haupt', 'S1. Menü 1 (A,D,F)', NULL, '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake', '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake', 9.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's2._men_2_haupt', 'S2. Menü 2', NULL, '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago', '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago', 11.50, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's3._men_3_haupt', 'S3. Menü 3', NULL, '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake', '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake', 14.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's4._men_4_haupt', 'S4. Menü 4', NULL, '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Sake', '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Salmon', 10.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's5._men_5_haupt', 'S5. Menü 5', NULL, '8 Sake Maki, 4 Kali I-O, Maguro Nigiri, 1 Sake Nigiri', '8 Salmon Maki, 4 Kali I-O, Maguro Nigiri, 1 Salmon Nigiri', 11.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's6._men_6_haupt', 'S6. Menü 6', NULL, '8 Sake Roll, 8 Ebi Maki, 2 Nigiri: Sake, Maguro', '8 Salmon Rolls, 8 Ebi Maki, 2 Nigiri: Salmon, Tuna', 13.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's7._nigiri_men_b_haupt', 'S7. Nigiri Menü (B)', NULL, '6 Nigiri: Sake, Maguro, Ebi, Ika, Avocado, Unagi', '6 Nigiri: Salmon, Tuna, Shrimp, Squid, Avocado, Eel', 14.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's8._philadelphia_menu_a_b_d_g_k_f_haupt', 'S8. Philadelphia Menu (A,B,D,G,K,F)', NULL, '8 Philadelphia I-O, 8 Sake Avocado Maki, 2 Ebi Nigiri & 2 Sake Nigiri', '8 Philadelphia I-O, 8 Salmon Avocado Maki, 2 Shrimp Nigiri & 2 Salmon Nigiri', 17.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's9._aiko_men_haupt', 'S9. Aiko Menü', NULL, '6 Aiko Rollen, 8 Sake Avocado Maki, 2 Maguro Nigiri & 2 Sake Nigiri', '6 Aiko Rolls, 8 Salmon Avocado Maki, 2 Tuna Nigiri & 2 Salmon Nigiri', 18.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's10._tuna_men_haupt', 'S10. Tuna Menü', NULL, '8 Maguro Crunchy, 8 Sake Avocado Maki, 2 Maguro Nigiri, 2 Lachs Nigiri', '8 Maguro Crunchy, 8 Salmon Avocado Maki, 2 Tuna Nigiri, 2 Salmon Nigiri', 17.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's11._tori_men_haupt', 'S11. Tori Menü', NULL, '6 Yakitori Big Rolls, 8 Tori Maki, 8 Tori I-O', '6 Yakitori Big Rolls, 8 Chicken Maki, 8 Chicken I-O', 15.90, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's12._deluxe_men_f_r_2_persone_haupt', 'S12. Deluxe Menü | Für 2 Persone', NULL, '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Nigiri Sake, 2 Nigiri Maguro', '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Salmon Nigiri, 2 Tuna Nigiri', 32.00, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  's13._deluxe_men_leo_haupt', 'S13. Deluxe Menü Leo', NULL, '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Sake Nigiri, 1 Maguro Nigiri & 1 Ebi', '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Salmon Nigiri, 1 Tuna Nigiri & 1 Shrimp Nigiri', 45.00, 'sushimenu',
  0, 0, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm1._sake_d_haupt', 'M1. Sake (D)', NULL, 'Lachs', 'Salmon', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm2._sake_avocado_d_haupt', 'M2. Sake avocado (D)', NULL, 'Lachs Avocado', 'Salmon Avocado', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm3._sake_kappa_d_haupt', 'M3. Sake Kappa (D)', NULL, 'Lachs, Gurke', 'Salmon, cucumber', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm4._tekka_d_haupt', 'M4. Tekka (D)', NULL, 'Thunfisch', 'Tuna', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm5._spicy_tuna_d_haupt', 'M5. Spicy Tuna (D)', NULL, 'Thunfisch, Lauch, Chili', 'Tuna, leek, chili', 4.80, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm6._ebi_b_haupt', 'M6. Ebi (B)', NULL, 'Garnelen', 'Shrimp', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm7._ebi_avocado_b_haupt', 'M7. Ebi Avocado (B)', NULL, 'Garnelen, Avocado', 'Shrimp, avocado', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm8._california_haupt', 'M8. California', NULL, 'Surimi, Avocado', 'Surimi, avocado', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm9._salmon_skin_haupt', 'M9. Salmon Skin', NULL, 'Gegrillte Lachshaut, Unagi-Soße', 'Grilled salmon skin, unagi sauce', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm10._tuna_cooked_haupt', 'M10. Tuna Cooked', NULL, 'Gekochter Thunfisch, Mayo, Chili, Lauch', 'Cooked tuna, mayo, chili, leek', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm11._sake_cooked_haupt', 'M11. Sake Cooked', NULL, 'Gekochter Lachs, Mayo, Chili', 'Cooked salmon, mayo, chili', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm12._tori_haupt', 'M12. Tori', NULL, 'Hähnchenstreifen', 'Chicken strips', 4.20, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm13._kappa_haupt', 'M13. Kappa', NULL, 'Gurke, Frischkäse', 'Cucumber, cream cheese', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm14._avocado_haupt', 'M14. Avocado', NULL, 'Avocado', 'Avocado', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm15._tamago_haupt', 'M15. Tamago', NULL, 'Japan-Omelett', 'Japanese omelette', 3.90, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm16._unagi_haupt', 'M16. Unagi', NULL, 'Flussaal', 'Freshwater eel', 4.50, 'maki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm17._inari_haupt', 'M17. Inari', NULL, 'Marinierter Tofu', 'Marinated tofu', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm18._shiitake_haupt', 'M18. Shiitake', NULL, 'Japan-Pilz', 'Japanese mushroom', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm19._kampyo_haupt', 'M19. Kampyo', NULL, 'Kürbis', 'Pumpkin', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm20._rucula_haupt', 'M20. Rucula', NULL, 'Rucola, Frischkäse, Sesam', 'Arugula, cream cheese, sesame', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'm21._paprika_haupt', 'M21. Paprika', NULL, 'Paprika', 'Bell pepper', 3.90, 'maki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u1._sake_i_o_haupt', 'U1. Sake I-O', NULL, 'Lachs, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Salmon, avocado — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u2._maguro_i_o_haupt', 'U2. Maguro I-O', NULL, 'Thunfisch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Tuna, cucumber — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u3._ebi_i_o_haupt', 'U3. Ebi I-O', NULL, 'Garnelen, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Shrimp, avocado — I-O maki with sesame and fish roe', 8.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u4._ebi_tempura_i_o_haupt', 'U4. Ebi Tempura I-O', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Breaded shrimp, cream cheese, cucumber — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u5._veggie_i_o_haupt', 'U5. Veggie I-O', NULL, 'Kürbis, Rettich, Avocado, Sesam — umgedrehte Maki mit Sesam', 'Pumpkin, radish, avocado, sesame — I-O maki with sesame', 7.20, 'insideout',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u6._rucola_kappa_i_o_haupt', 'U6. Rucola Kappa I-O', NULL, 'Rucola, Gurke, Frischkäse — umgedrehte Maki mit Sesam', 'Arugula, cucumber, cream cheese — I-O maki with sesame', 7.20, 'insideout',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u7._california_i_o_haupt', 'U7. California I-O', NULL, 'Krebsfleischimitat, Avocado — umgedrehte Maki mit Sesam und Fischrogen', 'Imitation crab, avocado — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u8._ebi_spicy_i_o_haupt', 'U8. Ebi Spicy I-O', NULL, 'Scharfe Garnelen, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy shrimp, cucumber, leek — I-O maki with sesame and fish roe', 8.20, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u9._sake_spicy_i_o_haupt', 'U9. Sake Spicy I-O', NULL, 'Scharfer Lachs, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy salmon, cucumber, leek — I-O maki with sesame and fish roe', 8.20, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u10._salmon_skin_i_o_haupt', 'U10. Salmon Skin I-O', NULL, 'Lachshaut, Gurke, Aal — umgedrehte Maki mit Sesam und Fischrogen', 'Salmon skin, cucumber, eel — I-O maki with sesame and fish roe', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u11._maguro_spicy_i_o_haupt', 'U11. Maguro Spicy I-O', NULL, 'Scharfer Thunfisch, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Spicy tuna, cucumber, leek — I-O maki with sesame and fish roe', 8.90, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u12._tamago_i_o_haupt', 'U12. Tamago I-O', NULL, 'Omelett, Avocado, Sesam — umgedrehte Maki mit Sesam', 'Omelette, avocado, sesame — I-O maki with sesame', 7.20, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u13._lachs_cooked_i_o_haupt', 'U13. Lachs Cooked I-O', NULL, 'Gekochter Lachs, Mayo, Chili, Lauch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', 'Cooked salmon, mayo, chili, leek, cucumber — I-O maki with sesame and fish roe', 7.80, 'insideout',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u14._tuna_cooked_i_o_haupt', 'U14. Tuna Cooked I-O', NULL, 'Gekochter Thunfisch, Mayonnaise, Lauch — umgedrehte Maki mit Sesam und Fischrogen', 'Cooked tuna, mayonnaise, leek — I-O maki with sesame and fish roe', 7.80, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u15._tori_i_o_haupt', 'U15. Tori I-O', NULL, 'Mariniertes Hühnerfleisch, Gurke, Sesam, Frischkäse — umgedrehte Maki mit Sesam', 'Marinated chicken, cucumber, sesame, cream cheese — I-O maki with sesame', 7.50, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'u16._lachs_rucola_i_o_haupt', 'U16. Lachs Rucola I-O', NULL, 'Lachs, Frischkäse, Rucola, Sesam — umgedrehte Maki mit Sesam', 'Salmon, cream cheese, arugula, sesame — I-O maki with sesame', 8.20, 'insideout',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c1._sake_crunchy_haupt', 'C1. Sake Crunchy', NULL, 'Lachs, Avocado, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Salmon, avocado, cream cheese — wrapped in crispy tempura flakes, special sauce and sesame', 7.50, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c2._maguro_crunchy_haupt', 'C2. Maguro Crunchy', NULL, 'Scharfer Thunfisch, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Spicy tuna, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.90, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c3._ebi_crunchy_haupt', 'C3. Ebi Crunchy', NULL, 'Scharfe Garnelen, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Spicy shrimp, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.50, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c4._skin_crunchy_haupt', 'C4. Skin Crunchy', NULL, 'Gegrillte Lachshaut, Gurke, Aal — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Grilled salmon skin, cucumber, eel — wrapped in crispy tempura flakes, special sauce and sesame', 7.50, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c5._salmon_tempura_crunchy_haupt', 'C5. Salmon Tempura Crunchy', NULL, 'Panierter Lachs, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße Sesam', 'Breaded salmon, cream cheese — wrapped in crispy tempura flakes, special sauce sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c6._tuna_crunchy_haupt', 'C6. Tuna Crunchy', NULL, 'Gekochter, scharfer Thunfisch, Mayonnaise, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', 'Cooked spicy tuna, mayonnaise, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'c7._tori_crunchy_haupt', 'C7. Tori Crunchy', NULL, 'Panierte Hühnerfleisch- und Frischkäserollen mit Gurken, umhüllt von knusprigen Tempura-Flocken, serviert mit Spezialsoße und Sesam', 'Breaded chicken and cream cheese rolls with cucumber, coated in crispy tempura flakes, served with special sauce and sesame', 8.20, 'crunchy',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa1._sake_6_stk._haupt', 'Sa1. Sake (6 Stk.)', NULL, 'Lachs', 'Salmon', 13.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa2._maguro_6_stk._haupt', 'Sa2. Maguro (6 Stk.)', NULL, 'Thunfisch', 'Tuna', 14.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa3._sake_maguro_haupt', 'Sa3. Sake & Maguro', NULL, 'Lachs (5 Stk.) & Thunfisch (5 Stk.)', 'Salmon (5 pcs.) & Tuna (5 pcs.)', 18.00, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa4._sake_special_6_stk._haupt', 'Sa4. Sake Special (6 Stk.)', NULL, 'angebratener Lachs mit Spezial-Soße', 'seared salmon with special sauce', 14.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sa5._maguro_special_6_stk._haupt', 'Sa5. Maguro Special (6 Stk.)', NULL, 'angebratener Thunfisch mit ThunfischSpezial-Soße', 'seared tuna with tuna special sauce', 14.90, 'sashimi',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n1._sake_d_haupt', 'N1. Sake (D)', NULL, 'Lachs', 'Salmon', 3.90, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n2._maguro_d_haupt', 'N2. Maguro (D)', NULL, 'Thunfisch', 'Tuna', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n3._amaebi_b_haupt', 'N3. Amaebi (B)', NULL, 'Süßwasser-Garnelen', 'Freshwater shrimp', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n4._ebi_d_haupt', 'N4. Ebi (D)', NULL, 'Garnelen', 'Shrimp', 4.20, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n5._ikura_d_haupt', 'N5. Ikura (D)', NULL, 'Lachskaviar', 'Salmon roe', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n6._unagi_d_haupt', 'N6. Unagi (D)', NULL, 'Süßwasseraal', 'Freshwater eel', 4.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n7._kani_a_b_d_1_2_4_haupt', 'N7. Kani (A,B,D,1,2,4)', NULL, 'Surimi', 'Surimi', 3.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n8._tamago_c_haupt', 'N8. Tamago (C)', NULL, 'Omelett', 'Omelette', 3.50, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n9._ika_d_haupt', 'N9. Ika (D)', NULL, 'Tintenfisch', 'Squid', 3.90, 'nigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n10._inari_f_haupt', 'N10. Inari (F)', NULL, 'Tofu', 'Tofu', 3.50, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n11._shiitake_haupt', 'N11. Shiitake', NULL, 'Japanische Pilze', 'Japanese mushrooms', 3.50, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'n12._avocado_haupt', 'N12. Avocado', NULL, 'Avocado', 'Avocado', 3.20, 'nigiri',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p1._leo_rolls_a_d_g_k_haupt', 'P1. Leo Rolls (A,D,G,K)', NULL, 'Lachs, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Salmon, cucumber, avocado, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p2._aiko_rolls_a_d_g_k_haupt', 'P2. Aiko Rolls (A,D,G,K)', NULL, 'Gekochter Thunfisch, Lauch, Mayo, Chili, Gurke – serviert mit Spezialsoßen und Sesam', 'Cooked tuna, leek, mayo, chili, cucumber – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p3._tokyo_rolls_a_b_d_g_k_1_2_4_haupt', 'P3. Tokyo Rolls (A,B,D,G,K,1,2,4)', NULL, 'Lachshaut, Aal, Surimi, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Salmon skin, eel, surimi, cucumber, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p4._fuji_san_rolls_a_d_g_k_haupt', 'P4. Fuji San Rolls (A,D,G,K)', NULL, 'Garnelen, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Shrimp, cucumber, avocado, cream cheese – served with special sauces and sesame', 8.50, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p5._emilia_rolls_a_k_haupt', 'P5. Emilia Rolls (A,K)', NULL, 'Avocado, Paprika, Gurke, Kürbis, Shiitake – serviert mit Spezialsoßen und Sesam', 'Avocado, bell pepper, cucumber, pumpkin, shiitake – served with special sauces and sesame', 7.90, 'bigrolls',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p6._yakitori_rolls_a_g_k_haupt', 'P6. Yakitori Rolls (A,G,K)', NULL, 'Hähnchen, Avocado, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', 'Chicken, avocado, cucumber, cream cheese – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'p7._bao_ngoc_rolls_a_d_k_haupt', 'P7. Bao ngoc Rolls (A,D,K)', NULL, 'Gekochter Lachs, Mayo, Chili, Gurke, Avocado – serviert mit Spezialsoßen und Sesam', 'Cooked salmon, mayo, chili, cucumber, avocado – served with special sauces and sesame', 8.20, 'bigrolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa1._sake_rolls_a_d_g_k_haupt', 'Pa1. Sake Rolls (A,D,G,K)', NULL, 'Lachs — serviert mit Spezialsoßen und Sesam', 'Salmon — served with special sauces and sesame', 6.50, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa2._ebi_rolls_a_b_g_k_haupt', 'Pa2. Ebi Rolls (A,B,G,K)', NULL, 'Garnelen, Lauch, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Shrimp, leek, cream cheese — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa3._spicy_rolls_a_d_k_haupt', 'Pa3. Spicy Rolls (A,D,K)', NULL, 'Thunfisch, Chili, Lauch — serviert mit Spezialsoßen und Sesam', 'Tuna, chili, leek — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa4._bao_ngoc_rolls_a_d_k_haupt', 'Pa4. Bao ngoc Rolls (A,D,K)', NULL, 'Gekochter Lachs, Mayo, Chili — serviert mit Spezialsoßen und Sesam', 'Cooked salmon, mayo, chili — served with special sauces and sesame', 6.90, 'minirolls',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa5._veggie_rolls_a_k_haupt', 'Pa5. Veggie Rolls (A,K)', NULL, 'Shiitake, Kürbis — serviert mit Spezialsoßen und Sesam', 'Shiitake, pumpkin — served with special sauces and sesame', 6.50, 'minirolls',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa6._avocado_rolls_a_g_k_haupt', 'Pa6. Avocado Rolls (A,G,K)', NULL, 'Avocado, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Avocado, cream cheese — served with special sauces and sesame', 6.50, 'minirolls',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'pa7._tori_rolls_g_k_haupt', 'Pa7. Tori Rolls (G,K)', NULL, 'Hähnchen, Frischkäse — serviert mit Spezialsoßen und Sesam', 'Chicken, cream cheese — served with special sauces and sesame', 6.50, 'minirolls',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp1._leo_rolls_a_c_f_haupt', 'Sp1. Leo Rolls (A,C,F)', NULL, 'Avocado, Inari und Gurke — umwickelt mit Avocado', 'Avocado, inari and cucumber — wrapped with avocado', 5.50, 'specialrolls',
  1, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g_haupt', 'Sp2. Mango Thunfisch Roll (A,D,G)', NULL, 'Gekochter Thunfisch, Mayonnaise, Lauch, Chili, Gurke — umwickelt mit Mango, serviert mit Spezialsoße und Sesam', 'Cooked tuna, mayonnaise, leek, chili, cucumber — wrapped with mango, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp3._fire_tuna_a_d_g_haupt', 'Sp3. Fire Tuna (A,D,G)', NULL, 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Thunfisch', 'Breaded vegetables, cream cheese — wrapped with flambéed tuna', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp4._fire_salmon_a_d_g_haupt', 'Sp4. Fire Salmon (A,D,G)', NULL, 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Lachs', 'Breaded vegetables, cream cheese — wrapped with flambéed salmon', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp5._tiger_rolls_a_g_n_b_haupt', 'Sp5. Tiger Rolls (A,G,N,B)', NULL, 'Garnelen-Tempura und Gurke — umwickelt mit Aal, serviert mit Spezialsoße und Sesam', 'Shrimp tempura and cucumber — wrapped with eel, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g_haupt', 'Sp6. Chicken rolls (1,2,4,11,G)', NULL, 'Gegrillte Hähnchenfiletstreifen, Mango und Oshinko — umwickelt mit Gurke', 'Grilled chicken fillet strips, mango and oshinko — wrapped with cucumber', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d_haupt', 'Sp7. Fire Ocean Rolls (A,B,G,D)', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit flambiertem Lachs und Thunfisch, serviert mit Spezialsoßen und Sesam', 'Breaded shrimp, cream cheese, cucumber — wrapped with flambéed salmon and tuna, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp8._tuna_rolls_d_g_haupt', 'Sp8. Tuna Rolls (D,G)', NULL, 'Gekochter Thunfisch, Mayo, Lauch, Chili, Gurke — umwickelt mit Röstzwiebeln, serviert mit Spezialsoßen und Sesam', 'Cooked tuna, mayo, leek, chili, cucumber — wrapped with crispy onions, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g_haupt', 'Sp9. Philadelphia Rolls (A,B,D,G)', NULL, 'Gemüse-Tempura und Frischkäse — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', 'Vegetable tempura and cream cheese — wrapped with salmon, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp10._kyoto_rolls_c_d_haupt', 'Sp10. Kyoto Rolls (C,D)', NULL, 'Lachs, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', 'Salmon, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d_haupt', 'Sp11. Sake Alaska Rolls (B,C,D)', NULL, 'Lachs, Avocado, Frischkäse — umwickelt mit Lachs. serviert mit Spezialsoße und Sesam', 'Salmon, avocado and cream cheese — wrapped with salmon, served with special sauce and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp12._omelette_rolls_b_c_haupt', 'Sp12. Omelette Rolls (B,C)', NULL, 'Omelett, Avocado, Surimi, Frischkäse — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', 'Omelette, avocado, surimi, cream cheese — wrapped with shrimp, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp13._dragon_rolls_a_b_g_d_haupt', 'Sp13. Dragon Rolls (A,B,G,D)', NULL, 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', 'Breaded shrimp, cream cheese, cucumber — wrapped with salmon, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp14._fuji_rolls_a_d_g_haupt', 'Sp14. Fuji Rolls (A,D,G)', NULL, 'Ebi, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', 'Shrimp, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d_haupt', 'Sp15. Tempura Special Rolls (A,B,C,D)', NULL, 'Panierter Lachs, Frischkäse, Gurke — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', 'Breaded salmon, cream cheese, cucumber — wrapped with shrimp, served with special sauces and sesame', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sp16._taiko_rolls_a_b_g_d_haupt', 'Sp16. Taiko Rolls (A,B,G,D)', NULL, 'Garnelen, Avocado, Gurke, Frischkäse — umwickelt mit Lachs und Thunfisch', 'Shrimp, avocado, cucumber, cream cheese — wrapped with salmon and tuna', 5.50, 'specialrolls',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f1._maguro_aburi_d_k_haupt', 'F1. Maguro Aburi (D,K)', NULL, 'Thunfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Tuna — flying fish roe, sesame, spring onions and special sauce, flambéed', 5.20, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f2._sake_aburi_d_k_haupt', 'F2. Sake Aburi (D,K)', NULL, 'Lachs — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Salmon — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f3._squid_aburi_d_k_haupt', 'F3. Squid Aburi (D,K)', NULL, 'Tintenfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Squid — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f4._maguro_tatar_d_k_haupt', 'F4. Maguro-Tatar (D,K)', NULL, 'Gurkenhülle mit scharfem Thunfisch, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Cucumber wrap with spicy tuna, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', 4.90, 'firenigiri',
  0, 0, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'f5._salmon_rose_a_g_k_haupt', 'F5. Salmon Rose (A,G,K)', NULL, 'Flambierter gehackter Lachs, Mayonnaise, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', 'Flambéed chopped salmon, mayonnaise, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', 5.50, 'firenigiri',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te1._maguro_temaki_haupt', 'Te1. Maguro Temaki', NULL, 'Thunfisch, Gurken, Avocado', 'Tuna, cucumber, avocado', 5.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te2._sake_temaki_haupt', 'Te2. Sake Temaki', NULL, 'Lachs, Avocado, Gurken', 'Salmon, avocado, cucumber', 4.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te3._california_temaki_haupt', 'Te3. California Temaki', NULL, 'Surimi, Avocado, Gurken', 'Surimi, avocado, cucumber', 4.60, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te4._salmon_skin_temaki_haupt', 'Te4. Salmon Skin Temaki', NULL, 'Lachshaut, Gurke, Aal', 'Salmon skin, cucumber, eel', 4.90, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te5._tamago_temaki_haupt', 'Te5. Tamago Temaki', NULL, 'Omelett, Avocado, Gurken', 'Omelette, avocado, cucumber', 4.60, 'temaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'te6._inari_avocado_temaki_haupt', 'Te6. Inari Avocado Temaki', NULL, 'Tofu, Gurken, Avocado', 'Tofu, cucumber, avocado', 4.60, 'temaki',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '50._sake_teriyaki_d_f_haupt', '50. Sake Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Lachsgericht, serviert mit Gemüse und Reis', 'Japanese grilled salmon dish, served with vegetables and rice', 16.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '51._tuna_teriyaki_d_f_haupt', '51. Tuna Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Thunfischgericht, serviert mit Gemüse und Reis', 'Japanese grilled tuna dish, served with vegetables and rice', 17.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '52._tori_teriyaki_f_haupt', '52. Tori Teriyaki (F)', NULL, 'Japanisches gegrilltes Hähnchengericht, serviert mit Gemüse und Reis', 'Japanese grilled chicken dish, served with vegetables and rice', 14.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '53._ebi_teriyaki_b_f_haupt', '53. Ebi Teriyaki (B,F)', NULL, 'Japanisches gegrilltes Garnelengericht, serviert mit Gemüse und Reis', 'Japanese grilled shrimp dish, served with vegetables and rice', 15.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '54._squid_teriyaki_d_f_haupt', '54. Squid Teriyaki (D,F)', NULL, 'Japanisches gegrilltes Tintenfischgericht, serviert mit Gemüse und Reis', 'Japanese grilled squid dish, served with vegetables and rice', 15.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '55._duck_teriyaki_a_f_haupt', '55. Duck Teriyaki (A,F)', NULL, 'Japanisches gegrilltes Entengericht, serviert mit Gemüse und Reis', 'Japanese grilled duck dish, served with vegetables and rice', 16.90, 'teriyaki',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '60._tufu_bowl_f_k_g_haupt', '60. Tufu Bowl (F,K,G)', NULL, 'Gebackene Bio-Tofu mit Sesam', 'Fried organic tofu with sesame', 11.90, 'pokebowl',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '61._seitan_bowl_f_haupt', '61. Seitan Bowl (F)', NULL, 'Gebratener Seitan (vegan) mit Sesam', 'Fried seitan (vegan) with sesame', 12.90, 'pokebowl',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '62._sake_bowl_d_g_k_haupt', '62. Sake Bowl (D,G,K)', NULL, 'Lachs', 'Salmon', 13.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '63._tori_bowl_g_k_haupt', '63. Tori Bowl (G,K)', NULL, 'Gebackene Huhn', 'Fried chicken', 12.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '64._bowl_grill_d_g_k_haupt', '64. Bowl Grill (D,G,K)', NULL, 'Gegrillter Lachs, Thunfisch mit Sesam', 'Grilled salmon, tuna with sesame', 14.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '65._ebi_bowl_b_haupt', '65. Ebi Bowl (B)', NULL, 'Gebackene Ebi', 'Fried shrimp', 13.90, 'pokebowl',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '70._roter_curry_a_d_n_i_haupt', '70. Roter Curry (a,d,n,i)', NULL, 'Kokosmilch, rotes Curry, verschiedenes Gemüse und Reis, dazu:', 'Coconut milk, red curry, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '71._erdnuss_a_d_h_n_haupt', '71. Erdnuss (a,d,h,n)', NULL, 'Cremige Kokosmilch-Erdnuss-Soße, verschiedenes Gemüse und Reis, dazu:', 'Creamy coconut-peanut sauce, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '72._mango_curry_a_d_n_i_haupt', '72. Mango-Curry (a,d,n,i)', NULL, 'Feinwürzige Mango-Curry-Soße, verschiedenes Gemüse und Reis, dazu:', 'Spicy mango curry sauce, assorted vegetables and rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt', '73. Avocado Curry (a,d,n,i)', NULL, 'Cremige Kokosmilch-Soße, grünes Curry, verschiedenes Gemüse und Duftreis, dazu:', 'Creamy coconut sauce, green curry, assorted vegetables and fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '74._good_curry_a_d_n_i_haupt', '74. Good Curry (a,d,n,i)', NULL, 'Cremige Kokosmilch-Soße, Ingwer-Curry, verschiedenes Gemüse und Duftreis, dazu:', 'Creamy coconut sauce, ginger curry, assorted vegetables and fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt', '75. Leo Spezial-Soße (A,F)', NULL, 'Frisches vietnamesisches Gemüse, pikante Soße, Knoblauch mit Duftreis, dazu:', 'Fresh Vietnamese vegetables, spicy sauce, garlic with fragrant rice, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 1, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '76._s_saure_so_e_k_haupt', '76. Süß-saure Soße (k)', NULL, 'Fruchtige Süß-saure Soße, zubereitet mit frischer Ananas und Orange sowie Paprika und grünen Erbsen, dazu:', 'Fruity sweet and sour sauce prepared with fresh pineapple and orange, peppers, and green peas, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '77._pho_b_f_haupt', '77. Pho (b,F)', NULL, 'Traditionelle vietnamesische Suppe mit Bandnudeln, frischem Ingwer und Kräutern, dazu:', 'Traditional Vietnamese soup with rice noodles, fresh ginger, and herbs, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt', '78. Japanische Nudelsuppe (b,g)', NULL, 'Japanische Nudeln, Hühnerbrühe, Gemüse und Kräuter, dazu:', 'Japanese noodles, chicken broth, vegetables and herbs, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '79._pho_tron_a_b_haupt', '79. Pho Tron (a,b)', NULL, 'Reisbandnudeln in Kokosmilch, rotem Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', 'Rice noodles in coconut milk, red curry, salad, peanuts, fried onions and herbs, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '80._udon_coco_d_n_haupt', '80. Udon Coco (d,n)', NULL, 'Japanische Nudeln in Kokosmilch, Masaman-Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', 'Japanese noodles in coconut milk, masaman curry, salad, peanuts, crispy onions and herbs, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '81._bun_bo_nam_bo_e_h_n_i_haupt', '81. Bun Bo Nam Bo (e,h,n,i)', NULL, 'Typisch südvietnamesische Esskultur mit dünnen Reisbandnudeln, frischem Salat, Erdnüssen, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 'Typical South Vietnamese cuisine with thin rice noodles, fresh salad, peanuts, herbs, and homemade lime dressing, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '82._udon_yaki_a_f_haupt', '82. Udon Yaki (a,f)', NULL, 'Udon-Nudeln im heißen Wok mit Ei, frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', 'Udon noodles stir-fried in a hot wok with egg, fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '83._pad_thai_c_n_haupt', '83. Pad Thai (c,n)', NULL, 'Reisbandnudeln im heißen Wok mit Ei, frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', 'Rice noodles stir-fried in a hot wok with egg and fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '84._my_xao_c_n_haupt', '84. My Xao (c,n)', NULL, 'Gebratene Eiernudeln (Weizen) mit Ei, Porree, Chinakohl, Möhren und Sojasprossen, dazu:', 'Stir-fried egg noodles (wheat) with egg, leek, Chinese cabbage, carrots, and bean sprouts, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '85._pho_xao_c_n_haupt', '85. Pho Xao (c,n)', NULL, 'Gebratene Reisbandnudeln mit Ei, Pak Choi, Porree, Möhren, Sojasprossen und Tamarindensoße, verfeinert mit Röstzwiebeln und Erdnüssen, wahlweise mit:', 'Stir-fried rice noodles with egg, pak choi, leek, carrots, bean sprouts and tamarind sauce, refined with crispy fried onions and peanuts, optionally with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  '86._com_rang_haupt', '86. Com Rang', NULL, 'Gebratener Reis mit Eier-Omelette, frischem Gemüse, Erbsen, Bohnen, Karotten, Mais und Zwiebeln, dazu:', 'Fried rice with egg omelette, fresh vegetables, peas, beans, carrots, corn, and onions, served with:', 11.90, 'hauptspeisen',
  0, 1, NULL, 1, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd1._dragon_ball_3_stk._haupt', 'D1. Dragon Ball (3 Stk.)', NULL, 'Gefüllt mit süßen Bohnen', 'Filled with sweet beans', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd2._mochi_2_stk._haupt', 'D2. Mochi (2 Stk.)', NULL, 'Reiskuchen mit roten Bohnen', 'Rice cake with red beans', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd3._lucky_egg_3_stk._haupt', 'D3. Lucky Egg (3 Stk.)', NULL, 'Gefüllt mit Vanille', 'Filled with vanilla', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'd4._bananiflirt_5_stk._haupt', 'D4. Bananiflirt (5 Stk.)', NULL, 'Gebackene Banane mit Spezialsoße', 'Fried banana with special sauce', 4.50, 'dessert',
  1, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b1._duftreis_haupt', 'B1. Duftreis', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b2._sushi_reis_haupt', 'B2. Sushi Reis', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b3._ingwer_haupt', 'B3. Ingwer', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b4._wasabi_haupt', 'B4. Wasabi', NULL, NULL, NULL, 1.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b5._unagi_so_e_haupt', 'B5. Unagi-Soße', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b6._cocktailso_e_haupt', 'B6. Cocktailsoße', NULL, NULL, NULL, 1.50, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b7._reiband_nudeln_haupt', 'B7. Reiband-Nudeln', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'b8._udon_nudeln_haupt', 'B8. Udon-Nudeln', NULL, NULL, NULL, 2.00, 'beilagen',
  0, 0, NULL, 0, 0, NULL, 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'naturell_haupt', 'Naturell', NULL, NULL, NULL, 2.50, 'getranke',
  0, 1, NULL, 0, 0, 'Wasser/ Mineral Water', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mineral_wasser_sprudel_haupt', 'Mineral wasser/ sprudel', NULL, NULL, NULL, 2.50, 'getranke',
  0, 1, NULL, 0, 0, 'Wasser/ Mineral Water', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cocacola_haupt', 'Cocacola', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cola_light_haupt', 'Cola Light', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'fanta_haupt', 'Fanta', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sprite_haupt', 'Sprite', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ginger_ale_haupt', 'Ginger Ale', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'tonic_haupt', 'Tonic', NULL, NULL, NULL, 3.20, 'getranke',
  0, 1, NULL, 0, 0, 'Soft Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'apfel_haupt', 'Apfel', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ananas_haupt', 'Ananas', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'maracuja_haupt', 'Maracuja', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'orange_haupt', 'Orange', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mango_haupt', 'Mango', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'kirsche_haupt', 'Kirsche', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'banane_haupt', 'Banane', NULL, NULL, NULL, 3.50, 'getranke',
  0, 1, NULL, 0, 0, 'Säfte/ Juices', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'cafe_s_a_n_ng_haupt', 'Cafe Sữa Nóng', NULL, 'Hot Vietnamese Coffee', 'Hot Vietnamese Coffee', 4.50, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'green_tea_haupt', 'Green Tea', NULL, NULL, NULL, 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ingwer_tea_haupt', 'Ingwer Tea', NULL, 'Ginger Tea', 'Ginger Tea', 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'jasmint_tea_haupt', 'Jasmint tea', NULL, 'Jasmine Tea', 'Jasmine Tea', 4.20, 'getranke',
  0, 0, NULL, 0, 0, 'Kaffee/ Tee', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'nha_dam_haupt', 'Nha Dam', NULL, 'Limetten, Zitronengras, Aloe Vera, Minze', 'Lime, Lemongrass, Aloe Vera, Mint', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ingwer_limonad_haupt', 'Ingwer Limonad', NULL, 'Frische Ingwer, Zitrone, Orange, Rohzucker, Orangensaft, Ananassaft', 'Fresh Ginger, Lemon, Orange, Raw sugar, Orange juice, Pineapple juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'hausgemachte_eistee_haupt', 'Hausgemachte Eistee', NULL, 'Jasmin Tee (Apfelsaft/ Mango/ Maracuja oder Erdbeere)', 'Jasmine Tea (Apple juice/ Mango/ Passion fruit or Strawberry)', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mango_lassi_haupt', 'Mango Lassi', NULL, 'Joghurt, Mango, Mangosirup, Kokossirup, Mangosaft', 'Yogurt, Mango, Mango syrup, Coconut syrup, Mango juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'avocado_lassi_haupt', 'Avocado Lassi', NULL, 'Avocado, Mangosirup, Joghurt, Milch', 'Avocado, mango syrup, yogurt, milk', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'chanh_da_haupt', 'Chanh da', NULL, 'Frische Limetten, Rohrzucker, Mineralwasser', 'Fresh Lime, Raw sugar, Mineral water', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'ipanema_haupt', 'Ipanema', NULL, 'Limetten, Rohzucker, Ginger Ale', 'Lime, Raw sugar, Ginger Ale', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'mojito_haupt', 'Mojito', NULL, 'Limetten, Rohzucker, Minze, Ginger Ale', 'Lime, Raw sugar, Mint, Ginger Ale', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'coconut_kiss_haupt', 'Coconut Kiss', NULL, 'Kokossirup, Sahne, Ananassaft', 'Coconut syrup, cream, pineapple juice', 5.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sportsman_haupt', 'Sportsman', NULL, 'Banane, Zitrone, Limette, Rohzucker, Maracuja-Sirup, Orange-Saft, Ananas-Saft', 'Banana, Lemon, Lime, Raw sugar, Passion fruit syrup, Orange juice, Pineapple juice', 6.50, 'getranke',
  0, 0, NULL, 0, 0, 'Homemade Drinks', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'tiger_bier_singapur_haupt', 'Tiger Bier Singapur', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'sai_gon_bier_haupt', 'Sai Gon Bier', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'warsteiner_alkoholfrei_haupt', 'Warsteiner/ Alkoholfrei', NULL, 'Alcohol-free', 'Alcohol-free', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei_haupt', 'Erdinger Hefeweizen, dunkel/ hell/ alkoholfrei', NULL, 'Erdinger Wheat beer, dark/ light/ alcohol-free', 'Erdinger Wheat beer, dark/ light/ alcohol-free', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'asahi_bier_haupt', 'Asahi Bier', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Bier', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'grauburgunder_trocken_haupt', 'Grauburgunder Trocken', NULL, 'Pinot Gris Dry', 'Pinot Gris Dry', 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Weisswein', 'branch_haupt'
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

INSERT INTO menu_items (
  item_id, name, name_en, description, description_en, price, category_id,
  vegetarian, has_options, quantity, use_bullet_points, spicy, group_title, branch_id
) VALUES (
  'riesling_haupt', 'Riesling', NULL, NULL, NULL, 4.50, 'getranke',
  0, 1, NULL, 0, 0, 'Weisswein', 'branch_haupt'
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

-- ============================================
-- INSERT MENU ITEM OPTIONS
-- ============================================
-- Options for branch_flora
INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_opt_a._gebackener_tofu', '31._mango_salat_e_f', 'A. Gebackener Tofu', 7.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_opt_b._h_hnchenbrustfilet', '31._mango_salat_e_f', 'B. Hähnchenbrustfilet', 8.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_opt_c._mariniertes_rindfleisch', '31._mango_salat_e_f', 'C. Mariniertes Rindfleisch', 8.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_opt_d._garnelen', '31._mango_salat_e_f', 'D. Garnelen', 8.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_opt_a._gebackener_tofu', '32._leo_salat_f', 'A. Gebackener Tofu', 7.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_opt_b._h_hnchenbrustfilet', '32._leo_salat_f', 'B. Hähnchenbrustfilet', 8.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_opt_c._mariniertes_rindfleisch', '32._leo_salat_f', 'C. Mariniertes Rindfleisch', 8.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_opt_d._garnelen', '32._leo_salat_f', 'D. Garnelen', 8.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp1._leo_rolls_a_c_f_opt_a._4_stk.', 'sp1._leo_rolls_a_c_f', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp1._leo_rolls_a_c_f_opt_b._8_stk.', 'sp1._leo_rolls_a_c_f', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g_opt_a._4_stk.', 'sp2._mango_thunfisch_roll_a_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g_opt_b._8_stk.', 'sp2._mango_thunfisch_roll_a_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp3._fire_tuna_a_d_g_opt_a._4_stk.', 'sp3._fire_tuna_a_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp3._fire_tuna_a_d_g_opt_b._8_stk.', 'sp3._fire_tuna_a_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp4._fire_salmon_a_d_g_opt_a._4_stk.', 'sp4._fire_salmon_a_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp4._fire_salmon_a_d_g_opt_b._8_stk.', 'sp4._fire_salmon_a_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp5._tiger_rolls_a_g_n_b_opt_a._4_stk.', 'sp5._tiger_rolls_a_g_n_b', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp5._tiger_rolls_a_g_n_b_opt_b._8_stk.', 'sp5._tiger_rolls_a_g_n_b', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g_opt_a._4_stk.', 'sp6._chicken_rolls_1_2_4_11_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g_opt_b._8_stk.', 'sp6._chicken_rolls_1_2_4_11_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d_opt_a._4_stk.', 'sp7._fire_ocean_rolls_a_b_g_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d_opt_b._8_stk.', 'sp7._fire_ocean_rolls_a_b_g_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp8._tuna_rolls_d_g_opt_a._4_stk.', 'sp8._tuna_rolls_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp8._tuna_rolls_d_g_opt_b._8_stk.', 'sp8._tuna_rolls_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g_opt_a._4_stk.', 'sp9._philadelphia_rolls_a_b_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g_opt_b._8_stk.', 'sp9._philadelphia_rolls_a_b_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp10._kyoto_rolls_c_d_opt_a._4_stk.', 'sp10._kyoto_rolls_c_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp10._kyoto_rolls_c_d_opt_b._8_stk.', 'sp10._kyoto_rolls_c_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d_opt_a._4_stk.', 'sp11._sake_alaska_rolls_b_c_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d_opt_b._8_stk.', 'sp11._sake_alaska_rolls_b_c_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp12._omelette_rolls_b_c_opt_a._4_stk.', 'sp12._omelette_rolls_b_c', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp12._omelette_rolls_b_c_opt_b._8_stk.', 'sp12._omelette_rolls_b_c', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp13._dragon_rolls_a_b_g_d_opt_a._4_stk.', 'sp13._dragon_rolls_a_b_g_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp13._dragon_rolls_a_b_g_d_opt_b._8_stk.', 'sp13._dragon_rolls_a_b_g_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp14._fuji_rolls_a_d_g_opt_a._4_stk.', 'sp14._fuji_rolls_a_d_g', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp14._fuji_rolls_a_d_g_opt_b._8_stk.', 'sp14._fuji_rolls_a_d_g', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d_opt_a._4_stk.', 'sp15._tempura_special_rolls_a_b_c_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d_opt_b._8_stk.', 'sp15._tempura_special_rolls_a_b_c_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp16._taiko_rolls_a_b_g_d_opt_a._4_stk.', 'sp16._taiko_rolls_a_b_g_d', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp16._taiko_rolls_a_b_g_d_opt_b._8_stk.', 'sp16._taiko_rolls_a_b_g_d', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_a._gebackener_tofu', '70._roter_curry', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_b._h_hnchenbrustfilet', '70._roter_curry', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_c._gebackener_h_hnchenbrustfilet', '70._roter_curry', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_d._gegrilltes_h_hnchen_brustfilet', '70._roter_curry', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_e._ente_kross', '70._roter_curry', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_g._garnelen', '70._roter_curry', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_r._mariniertes_rindfleisch', '70._roter_curry', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_h._gegrillter_lachs', '70._roter_curry', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_opt_i._gebackene_seitan_mit_sesam', '70._roter_curry', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_a._gebackener_tofu', '71._erdnuss', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_b._h_hnchenbrustfilet', '71._erdnuss', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_c._gebackener_h_hnchenbrustfilet', '71._erdnuss', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_d._gegrilltes_h_hnchen_brustfilet', '71._erdnuss', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_e._ente_kross', '71._erdnuss', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_g._garnelen', '71._erdnuss', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_r._mariniertes_rindfleisch', '71._erdnuss', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_h._gegrillter_lachs', '71._erdnuss', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_opt_i._gebackene_seitan_mit_sesam', '71._erdnuss', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_a._gebackener_tofu', '72._mango_curry', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_b._h_hnchenbrustfilet', '72._mango_curry', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_c._gebackener_h_hnchenbrustfilet', '72._mango_curry', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_d._gegrilltes_h_hnchen_brustfilet', '72._mango_curry', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_e._ente_kross', '72._mango_curry', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_g._garnelen', '72._mango_curry', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_r._mariniertes_rindfleisch', '72._mango_curry', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_h._gegrillter_lachs', '72._mango_curry', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_opt_i._gebackene_seitan_mit_sesam', '72._mango_curry', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_a._gebackener_tofu', '73._avocado_curry', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_b._h_hnchenbrustfilet', '73._avocado_curry', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_c._gebackener_h_hnchenbrustfilet', '73._avocado_curry', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_d._gegrilltes_h_hnchen_brustfilet', '73._avocado_curry', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_e._ente_kross', '73._avocado_curry', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_g._garnelen', '73._avocado_curry', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_r._mariniertes_rindfleisch', '73._avocado_curry', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_h._gegrillter_lachs', '73._avocado_curry', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_opt_i._gebackene_seitan_mit_sesam', '73._avocado_curry', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_a._gebackener_tofu', '74._good_curry', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_b._h_hnchenbrustfilet', '74._good_curry', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_c._gebackener_h_hnchenbrustfilet', '74._good_curry', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_d._gegrilltes_h_hnchen_brustfilet', '74._good_curry', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_e._ente_kross', '74._good_curry', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_g._garnelen', '74._good_curry', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_r._mariniertes_rindfleisch', '74._good_curry', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_h._gegrillter_lachs', '74._good_curry', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_opt_i._gebackene_seitan_mit_sesam', '74._good_curry', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_a._gebackener_tofu', '75._leo_spezial_so_e', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_b._h_hnchenbrustfilet', '75._leo_spezial_so_e', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_c._gebackener_h_hnchenbrustfilet', '75._leo_spezial_so_e', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_d._gegrilltes_h_hnchen_brustfilet', '75._leo_spezial_so_e', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_e._ente_kross', '75._leo_spezial_so_e', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_g._garnelen', '75._leo_spezial_so_e', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_r._mariniertes_rindfleisch', '75._leo_spezial_so_e', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_h._gegrillter_lachs', '75._leo_spezial_so_e', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_opt_i._gebackene_seitan_mit_sesam', '75._leo_spezial_so_e', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_a._gebackener_tofu', '76._pad_thai', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_b._h_hnchenbrustfilet', '76._pad_thai', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_c._gebackener_h_hnchenbrustfilet', '76._pad_thai', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_d._gegrilltes_h_hnchen_brustfilet', '76._pad_thai', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_e._ente_kross', '76._pad_thai', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_g._garnelen', '76._pad_thai', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_r._mariniertes_rindfleisch', '76._pad_thai', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_h._gegrillter_lachs', '76._pad_thai', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._pad_thai_opt_i._gebackene_seitan_mit_sesam', '76._pad_thai', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_a._gebackener_tofu', '77._japanische_nudelsuppe', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_b._h_hnchenbrustfilet', '77._japanische_nudelsuppe', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_c._gebackener_h_hnchenbrustfilet', '77._japanische_nudelsuppe', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_d._gegrilltes_h_hnchen_brustfilet', '77._japanische_nudelsuppe', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_e._ente_kross', '77._japanische_nudelsuppe', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_g._garnelen', '77._japanische_nudelsuppe', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_r._mariniertes_rindfleisch', '77._japanische_nudelsuppe', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_h._gegrillter_lachs', '77._japanische_nudelsuppe', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._japanische_nudelsuppe_opt_i._gebackene_seitan_mit_sesam', '77._japanische_nudelsuppe', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_a._gebackener_tofu', '78._udon_coco', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_b._h_hnchenbrustfilet', '78._udon_coco', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_c._gebackener_h_hnchenbrustfilet', '78._udon_coco', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_d._gegrilltes_h_hnchen_brustfilet', '78._udon_coco', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_e._ente_kross', '78._udon_coco', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_g._garnelen', '78._udon_coco', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_r._mariniertes_rindfleisch', '78._udon_coco', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_h._gegrillter_lachs', '78._udon_coco', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._udon_coco_opt_i._gebackene_seitan_mit_sesam', '78._udon_coco', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_a._gebackener_tofu', '79._pho_tron', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_b._h_hnchenbrustfilet', '79._pho_tron', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_c._gebackener_h_hnchenbrustfilet', '79._pho_tron', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_d._gegrilltes_h_hnchen_brustfilet', '79._pho_tron', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_e._ente_kross', '79._pho_tron', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_g._garnelen', '79._pho_tron', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_r._mariniertes_rindfleisch', '79._pho_tron', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_h._gegrillter_lachs', '79._pho_tron', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_opt_i._gebackene_seitan_mit_sesam', '79._pho_tron', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._bun_bo_nam_bo_opt_a._gebackener_tofu', '80._bun_bo_nam_bo', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._bun_bo_nam_bo_opt_b._h_hnchenbrustfilet', '80._bun_bo_nam_bo', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._bun_bo_nam_bo_opt_c._mariniertes_rindfleisch', '80._bun_bo_nam_bo', 'C. Mariniertes Rindfleisch', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._bun_bo_nam_bo_opt_d._nem_ha_noi_3_stk.', '80._bun_bo_nam_bo', 'D. Nem Ha Noi (3 Stk.)', 12.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._ph_opt_a._gebackener_tofu', '81._ph', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._ph_opt_b._h_hnchenbrustfilet', '81._ph', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._ph_opt_c._mariniertes_rindfleisch', '81._ph', 'C. Mariniertes Rindfleisch', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_a._gebackener_tofu', '82._udon_yaki', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_b._h_hnchenbrustfilet', '82._udon_yaki', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_c._gebackener_h_hnchenbrustfilet', '82._udon_yaki', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_d._gegrilltes_h_hnchen_brustfilet', '82._udon_yaki', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_f._garnelen', '82._udon_yaki', 'F. Garnelen', 13.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_g._ente_kross', '82._udon_yaki', 'G. Ente Kross', 14.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_h._gegrillter_lachs', '82._udon_yaki', 'H. Gegrillter Lachs', 15.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_opt_i._gebackene_seitan_mit_sesam', '82._udon_yaki', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_opt_0_2l', 'naturell', '0,2l', 2.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_opt_0_4l', 'naturell', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_opt_0_75l', 'naturell', '0,75l', 6.50, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_opt_0_2l', 'mineral_wasser_sprudel', '0,2l', 2.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_opt_0_4l', 'mineral_wasser_sprudel', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_opt_0_75l', 'mineral_wasser_sprudel', '0,75l', 6.50, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cocacola_opt_0_2l', 'cocacola', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cocacola_opt_0_4l', 'cocacola', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cola_light_opt_0_2l', 'cola_light', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cola_light_opt_0_4l', 'cola_light', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'fanta_opt_0_2l', 'fanta', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'fanta_opt_0_4l', 'fanta', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sprite_opt_0_2l', 'sprite', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sprite_opt_0_4l', 'sprite', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ginger_ale_opt_0_2l', 'ginger_ale', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ginger_ale_opt_0_4l', 'ginger_ale', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tonic_opt_0_2l', 'tonic', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tonic_opt_0_4l', 'tonic', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'apfel_opt_0_2l', 'apfel', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'apfel_opt_0_4l', 'apfel', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ananas_opt_0_2l', 'ananas', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ananas_opt_0_4l', 'ananas', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'maracuja_opt_0_2l', 'maracuja', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'maracuja_opt_0_4l', 'maracuja', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'orange_opt_0_2l', 'orange', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'orange_opt_0_4l', 'orange', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mango_opt_0_2l', 'mango', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mango_opt_0_4l', 'mango', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'kirsche_opt_0_2l', 'kirsche', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'kirsche_opt_0_4l', 'kirsche', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'banane_opt_0_2l', 'banane', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'banane_opt_0_4l', 'banane', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tiger_bier_singapur_opt_0_33l', 'tiger_bier_singapur', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tiger_bier_singapur_opt_0_5l', 'tiger_bier_singapur', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sai_gon_bier_opt_0_33l', 'sai_gon_bier', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sai_gon_bier_opt_0_5l', 'sai_gon_bier', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'warsteiner_alkoholfrei_opt_0_33l', 'warsteiner_alkoholfrei', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'warsteiner_alkoholfrei_opt_0_5l', 'warsteiner_alkoholfrei', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei_opt_0_33l', 'erdinger_hefeweizen_dunkel_hell_alkoholfrei', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei_opt_0_5l', 'erdinger_hefeweizen_dunkel_hell_alkoholfrei', '0,5l', 4.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'asahi_bier_opt_0_33l', 'asahi_bier', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'asahi_bier_opt_0_5l', 'asahi_bier', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'grauburgunder_trocken_opt_0_2l', 'grauburgunder_trocken', '0,2l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'grauburgunder_trocken_opt_0_75l', 'grauburgunder_trocken', '0,75l', 18.00, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'riesling_opt_0_2l', 'riesling', '0,2l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'riesling_opt_0_75l', 'riesling', '0,75l', 18.00, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

-- Options for branch_haupt
INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_haupt_opt_a._gebackener_tofu', '31._mango_salat_e_f_haupt', 'A. Gebackener Tofu', 7.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_haupt_opt_b._h_hnchenbrustfilet', '31._mango_salat_e_f_haupt', 'B. Hähnchenbrustfilet', 8.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_haupt_opt_c._mariniertes_rindfleisch', '31._mango_salat_e_f_haupt', 'C. Mariniertes Rindfleisch', 8.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '31._mango_salat_e_f_haupt_opt_d._garnelen', '31._mango_salat_e_f_haupt', 'D. Garnelen', 8.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_haupt_opt_a._gebackener_tofu', '32._leo_salat_f_haupt', 'A. Gebackener Tofu', 7.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_haupt_opt_b._h_hnchenbrustfilet', '32._leo_salat_f_haupt', 'B. Hähnchenbrustfilet', 8.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_haupt_opt_c._mariniertes_rindfleisch', '32._leo_salat_f_haupt', 'C. Mariniertes Rindfleisch', 8.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '32._leo_salat_f_haupt_opt_d._garnelen', '32._leo_salat_f_haupt', 'D. Garnelen', 8.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp1._leo_rolls_a_c_f_haupt_opt_a._4_stk.', 'sp1._leo_rolls_a_c_f_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp1._leo_rolls_a_c_f_haupt_opt_b._8_stk.', 'sp1._leo_rolls_a_c_f_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g_haupt_opt_a._4_stk.', 'sp2._mango_thunfisch_roll_a_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp2._mango_thunfisch_roll_a_d_g_haupt_opt_b._8_stk.', 'sp2._mango_thunfisch_roll_a_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp3._fire_tuna_a_d_g_haupt_opt_a._4_stk.', 'sp3._fire_tuna_a_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp3._fire_tuna_a_d_g_haupt_opt_b._8_stk.', 'sp3._fire_tuna_a_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp4._fire_salmon_a_d_g_haupt_opt_a._4_stk.', 'sp4._fire_salmon_a_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp4._fire_salmon_a_d_g_haupt_opt_b._8_stk.', 'sp4._fire_salmon_a_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp5._tiger_rolls_a_g_n_b_haupt_opt_a._4_stk.', 'sp5._tiger_rolls_a_g_n_b_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp5._tiger_rolls_a_g_n_b_haupt_opt_b._8_stk.', 'sp5._tiger_rolls_a_g_n_b_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g_haupt_opt_a._4_stk.', 'sp6._chicken_rolls_1_2_4_11_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp6._chicken_rolls_1_2_4_11_g_haupt_opt_b._8_stk.', 'sp6._chicken_rolls_1_2_4_11_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d_haupt_opt_a._4_stk.', 'sp7._fire_ocean_rolls_a_b_g_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp7._fire_ocean_rolls_a_b_g_d_haupt_opt_b._8_stk.', 'sp7._fire_ocean_rolls_a_b_g_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp8._tuna_rolls_d_g_haupt_opt_a._4_stk.', 'sp8._tuna_rolls_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp8._tuna_rolls_d_g_haupt_opt_b._8_stk.', 'sp8._tuna_rolls_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g_haupt_opt_a._4_stk.', 'sp9._philadelphia_rolls_a_b_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp9._philadelphia_rolls_a_b_d_g_haupt_opt_b._8_stk.', 'sp9._philadelphia_rolls_a_b_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp10._kyoto_rolls_c_d_haupt_opt_a._4_stk.', 'sp10._kyoto_rolls_c_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp10._kyoto_rolls_c_d_haupt_opt_b._8_stk.', 'sp10._kyoto_rolls_c_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d_haupt_opt_a._4_stk.', 'sp11._sake_alaska_rolls_b_c_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp11._sake_alaska_rolls_b_c_d_haupt_opt_b._8_stk.', 'sp11._sake_alaska_rolls_b_c_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp12._omelette_rolls_b_c_haupt_opt_a._4_stk.', 'sp12._omelette_rolls_b_c_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp12._omelette_rolls_b_c_haupt_opt_b._8_stk.', 'sp12._omelette_rolls_b_c_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp13._dragon_rolls_a_b_g_d_haupt_opt_a._4_stk.', 'sp13._dragon_rolls_a_b_g_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp13._dragon_rolls_a_b_g_d_haupt_opt_b._8_stk.', 'sp13._dragon_rolls_a_b_g_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp14._fuji_rolls_a_d_g_haupt_opt_a._4_stk.', 'sp14._fuji_rolls_a_d_g_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp14._fuji_rolls_a_d_g_haupt_opt_b._8_stk.', 'sp14._fuji_rolls_a_d_g_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d_haupt_opt_a._4_stk.', 'sp15._tempura_special_rolls_a_b_c_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp15._tempura_special_rolls_a_b_c_d_haupt_opt_b._8_stk.', 'sp15._tempura_special_rolls_a_b_c_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp16._taiko_rolls_a_b_g_d_haupt_opt_a._4_stk.', 'sp16._taiko_rolls_a_b_g_d_haupt', 'A. 4 Stk.', 6.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sp16._taiko_rolls_a_b_g_d_haupt_opt_b._8_stk.', 'sp16._taiko_rolls_a_b_g_d_haupt', 'B. 8 Stk.', 11.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_a._gebackener_tofu', '70._roter_curry_a_d_n_i_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_b._h_hnchenbrustfilet', '70._roter_curry_a_d_n_i_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_c._gebackener_h_hnchenbrustfilet', '70._roter_curry_a_d_n_i_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '70._roter_curry_a_d_n_i_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_e._ente_kross', '70._roter_curry_a_d_n_i_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_g._garnelen', '70._roter_curry_a_d_n_i_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_r._mariniertes_rindfleisch', '70._roter_curry_a_d_n_i_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_h._gegrillter_lachs', '70._roter_curry_a_d_n_i_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '70._roter_curry_a_d_n_i_haupt_opt_i._gebackene_seitan_mit_sesam', '70._roter_curry_a_d_n_i_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_a._gebackener_tofu', '71._erdnuss_a_d_h_n_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_b._h_hnchenbrustfilet', '71._erdnuss_a_d_h_n_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_c._gebackener_h_hnchenbrustfilet', '71._erdnuss_a_d_h_n_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '71._erdnuss_a_d_h_n_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_e._ente_kross', '71._erdnuss_a_d_h_n_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_g._garnelen', '71._erdnuss_a_d_h_n_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_r._mariniertes_rindfleisch', '71._erdnuss_a_d_h_n_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_h._gegrillter_lachs', '71._erdnuss_a_d_h_n_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '71._erdnuss_a_d_h_n_haupt_opt_i._gebackene_seitan_mit_sesam', '71._erdnuss_a_d_h_n_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_a._gebackener_tofu', '72._mango_curry_a_d_n_i_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_b._h_hnchenbrustfilet', '72._mango_curry_a_d_n_i_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_c._gebackener_h_hnchenbrustfilet', '72._mango_curry_a_d_n_i_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '72._mango_curry_a_d_n_i_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_e._ente_kross', '72._mango_curry_a_d_n_i_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_g._garnelen', '72._mango_curry_a_d_n_i_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_r._mariniertes_rindfleisch', '72._mango_curry_a_d_n_i_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_h._gegrillter_lachs', '72._mango_curry_a_d_n_i_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '72._mango_curry_a_d_n_i_haupt_opt_i._gebackene_seitan_mit_sesam', '72._mango_curry_a_d_n_i_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_a._gebackener_tofu', '73._avocado_curry_a_d_n_i_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_b._h_hnchenbrustfilet', '73._avocado_curry_a_d_n_i_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_c._gebackener_h_hnchenbrustfilet', '73._avocado_curry_a_d_n_i_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '73._avocado_curry_a_d_n_i_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_e._ente_kross', '73._avocado_curry_a_d_n_i_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_g._garnelen', '73._avocado_curry_a_d_n_i_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_r._mariniertes_rindfleisch', '73._avocado_curry_a_d_n_i_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_h._gegrillter_lachs', '73._avocado_curry_a_d_n_i_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '73._avocado_curry_a_d_n_i_haupt_opt_i._gebackene_seitan_mit_sesam', '73._avocado_curry_a_d_n_i_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_a._gebackener_tofu', '74._good_curry_a_d_n_i_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_b._h_hnchenbrustfilet', '74._good_curry_a_d_n_i_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_c._gebackener_h_hnchenbrustfilet', '74._good_curry_a_d_n_i_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '74._good_curry_a_d_n_i_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_e._ente_kross', '74._good_curry_a_d_n_i_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_g._garnelen', '74._good_curry_a_d_n_i_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_r._mariniertes_rindfleisch', '74._good_curry_a_d_n_i_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_h._gegrillter_lachs', '74._good_curry_a_d_n_i_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '74._good_curry_a_d_n_i_haupt_opt_i._gebackene_seitan_mit_sesam', '74._good_curry_a_d_n_i_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_a._gebackener_tofu', '75._leo_spezial_so_e_a_f_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_b._h_hnchenbrustfilet', '75._leo_spezial_so_e_a_f_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_c._gebackener_h_hnchenbrustfilet', '75._leo_spezial_so_e_a_f_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '75._leo_spezial_so_e_a_f_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_e._ente_kross', '75._leo_spezial_so_e_a_f_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_g._garnelen', '75._leo_spezial_so_e_a_f_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_r._mariniertes_rindfleisch', '75._leo_spezial_so_e_a_f_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_h._gegrillter_lachs', '75._leo_spezial_so_e_a_f_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '75._leo_spezial_so_e_a_f_haupt_opt_i._gebackene_seitan_mit_sesam', '75._leo_spezial_so_e_a_f_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_a._gebackener_tofu', '76._s_saure_so_e_k_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_b._h_hnchenbrustfilet', '76._s_saure_so_e_k_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_c._gebackener_h_hnchenbrustfilet', '76._s_saure_so_e_k_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '76._s_saure_so_e_k_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_e._ente_kross', '76._s_saure_so_e_k_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_g._garnelen', '76._s_saure_so_e_k_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_r._mariniertes_rindfleisch', '76._s_saure_so_e_k_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_h._gegrillter_lachs', '76._s_saure_so_e_k_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '76._s_saure_so_e_k_haupt_opt_i._gebackene_seitan_mit_sesam', '76._s_saure_so_e_k_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._pho_b_f_haupt_opt_a._gebackener_tofu', '77._pho_b_f_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._pho_b_f_haupt_opt_b._h_hnchenbrustfilet', '77._pho_b_f_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '77._pho_b_f_haupt_opt_c._mariniertes_rindfleisch', '77._pho_b_f_haupt', 'C. Mariniertes Rindfleisch', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_a._gebackener_tofu', '78._japanische_nudelsuppe_b_g_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_b._h_hnchenbrustfilet', '78._japanische_nudelsuppe_b_g_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_c._gebackener_h_hnchenbrustfilet', '78._japanische_nudelsuppe_b_g_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '78._japanische_nudelsuppe_b_g_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_e._ente_kross', '78._japanische_nudelsuppe_b_g_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_g._garnelen', '78._japanische_nudelsuppe_b_g_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_r._mariniertes_rindfleisch', '78._japanische_nudelsuppe_b_g_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_h._gegrillter_lachs', '78._japanische_nudelsuppe_b_g_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '78._japanische_nudelsuppe_b_g_haupt_opt_i._gebackene_seitan_mit_sesam', '78._japanische_nudelsuppe_b_g_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_a._gebackener_tofu', '79._pho_tron_a_b_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_b._h_hnchenbrustfilet', '79._pho_tron_a_b_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_c._gebackener_h_hnchenbrustfilet', '79._pho_tron_a_b_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '79._pho_tron_a_b_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_e._ente_kross', '79._pho_tron_a_b_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_g._garnelen', '79._pho_tron_a_b_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_r._mariniertes_rindfleisch', '79._pho_tron_a_b_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_h._gegrillter_lachs', '79._pho_tron_a_b_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '79._pho_tron_a_b_haupt_opt_i._gebackene_seitan_mit_sesam', '79._pho_tron_a_b_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_a._gebackener_tofu', '80._udon_coco_d_n_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_b._h_hnchenbrustfilet', '80._udon_coco_d_n_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_c._gebackener_h_hnchenbrustfilet', '80._udon_coco_d_n_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '80._udon_coco_d_n_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_e._ente_kross', '80._udon_coco_d_n_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_g._garnelen', '80._udon_coco_d_n_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_r._mariniertes_rindfleisch', '80._udon_coco_d_n_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_h._gegrillter_lachs', '80._udon_coco_d_n_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '80._udon_coco_d_n_haupt_opt_i._gebackene_seitan_mit_sesam', '80._udon_coco_d_n_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._bun_bo_nam_bo_e_h_n_i_haupt_opt_a._gebackener_tofu', '81._bun_bo_nam_bo_e_h_n_i_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._bun_bo_nam_bo_e_h_n_i_haupt_opt_b._h_hnchenbrustfilet', '81._bun_bo_nam_bo_e_h_n_i_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._bun_bo_nam_bo_e_h_n_i_haupt_opt_c._mariniertes_rindfleisch', '81._bun_bo_nam_bo_e_h_n_i_haupt', 'C. Mariniertes Rindfleisch', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '81._bun_bo_nam_bo_e_h_n_i_haupt_opt_d._nem_ha_noi_3_stk.', '81._bun_bo_nam_bo_e_h_n_i_haupt', 'D. Nem Ha Noi (3 Stk.)', 12.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_a._gebackener_tofu', '82._udon_yaki_a_f_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_b._h_hnchenbrustfilet', '82._udon_yaki_a_f_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_c._gebackener_h_hnchenbrustfilet', '82._udon_yaki_a_f_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '82._udon_yaki_a_f_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_e._ente_kross', '82._udon_yaki_a_f_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_g._garnelen', '82._udon_yaki_a_f_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_r._mariniertes_rindfleisch', '82._udon_yaki_a_f_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_h._gegrillter_lachs', '82._udon_yaki_a_f_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '82._udon_yaki_a_f_haupt_opt_i._gebackene_seitan_mit_sesam', '82._udon_yaki_a_f_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_a._gebackener_tofu', '83._pad_thai_c_n_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_b._h_hnchenbrustfilet', '83._pad_thai_c_n_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_c._gebackener_h_hnchenbrustfilet', '83._pad_thai_c_n_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '83._pad_thai_c_n_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_e._ente_kross', '83._pad_thai_c_n_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_g._garnelen', '83._pad_thai_c_n_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_r._mariniertes_rindfleisch', '83._pad_thai_c_n_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_h._gegrillter_lachs', '83._pad_thai_c_n_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '83._pad_thai_c_n_haupt_opt_i._gebackene_seitan_mit_sesam', '83._pad_thai_c_n_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_a._gebackener_tofu', '84._my_xao_c_n_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_b._h_hnchenbrustfilet', '84._my_xao_c_n_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_c._gebackener_h_hnchenbrustfilet', '84._my_xao_c_n_haupt', 'C. Gebackener Hähnchenbrustfilet', 12.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '84._my_xao_c_n_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_e._ente_kross', '84._my_xao_c_n_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_g._garnelen', '84._my_xao_c_n_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_r._mariniertes_rindfleisch', '84._my_xao_c_n_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_h._gegrillter_lachs', '84._my_xao_c_n_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '84._my_xao_c_n_haupt_opt_i._gebackene_seitan_mit_sesam', '84._my_xao_c_n_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_a._gebackener_tofu', '85._pho_xao_c_n_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_b._h_hnchenbrustfilet', '85._pho_xao_c_n_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_c._gebackener_h_hnchenbrustfilet', '85._pho_xao_c_n_haupt', 'C. Gebackener Hähnchenbrustfilet', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '85._pho_xao_c_n_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 14.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_e._ente_kross', '85._pho_xao_c_n_haupt', 'E. Ente Kross', 15.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_g._garnelen', '85._pho_xao_c_n_haupt', 'G. Garnelen', 14.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_r._mariniertes_rindfleisch', '85._pho_xao_c_n_haupt', 'R. Mariniertes Rindfleisch', 14.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_h._gegrillter_lachs', '85._pho_xao_c_n_haupt', 'H. Gegrillter Lachs', 16.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '85._pho_xao_c_n_haupt_opt_i._gebackene_seitan_mit_sesam', '85._pho_xao_c_n_haupt', 'I. Gebackene Seitan mit Sesam', 14.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_a._gebackener_tofu', '86._com_rang_haupt', 'A. Gebackener Tofu', 11.90, 1, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_b._h_hnchenbrustfilet', '86._com_rang_haupt', 'B. Hähnchenbrustfilet', 12.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_c._gebackener_h_hnchenbrustfilet', '86._com_rang_haupt', 'C. Gebackener Hähnchenbrustfilet', 13.90, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_d._gegrilltes_h_hnchen_brustfilet', '86._com_rang_haupt', 'D. Gegrilltes Hähnchen-Brustfilet', 13.90, 0, 4
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_e._ente_kross', '86._com_rang_haupt', 'E. Ente Kross', 14.90, 0, 5
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_g._garnelen', '86._com_rang_haupt', 'G. Garnelen', 13.90, 0, 6
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_r._mariniertes_rindfleisch', '86._com_rang_haupt', 'R. Mariniertes Rindfleisch', 13.90, 0, 7
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_h._gegrillter_lachs', '86._com_rang_haupt', 'H. Gegrillter Lachs', 15.90, 0, 8
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  '86._com_rang_haupt_opt_i._gebackene_seitan_mit_sesam', '86._com_rang_haupt', 'I. Gebackene Seitan mit Sesam', 13.90, 1, 9
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_haupt_opt_0_2l', 'naturell_haupt', '0,2l', 2.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_haupt_opt_0_4l', 'naturell_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'naturell_haupt_opt_0_75l', 'naturell_haupt', '0,75l', 6.50, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_haupt_opt_0_2l', 'mineral_wasser_sprudel_haupt', '0,2l', 2.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_haupt_opt_0_4l', 'mineral_wasser_sprudel_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mineral_wasser_sprudel_haupt_opt_0_75l', 'mineral_wasser_sprudel_haupt', '0,75l', 6.50, 0, 3
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cocacola_haupt_opt_0_2l', 'cocacola_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cocacola_haupt_opt_0_4l', 'cocacola_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cola_light_haupt_opt_0_2l', 'cola_light_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'cola_light_haupt_opt_0_4l', 'cola_light_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'fanta_haupt_opt_0_2l', 'fanta_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'fanta_haupt_opt_0_4l', 'fanta_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sprite_haupt_opt_0_2l', 'sprite_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sprite_haupt_opt_0_4l', 'sprite_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ginger_ale_haupt_opt_0_2l', 'ginger_ale_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ginger_ale_haupt_opt_0_4l', 'ginger_ale_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tonic_haupt_opt_0_2l', 'tonic_haupt', '0,2l', 3.20, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tonic_haupt_opt_0_4l', 'tonic_haupt', '0,4l', 3.90, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'apfel_haupt_opt_0_2l', 'apfel_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'apfel_haupt_opt_0_4l', 'apfel_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ananas_haupt_opt_0_2l', 'ananas_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'ananas_haupt_opt_0_4l', 'ananas_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'maracuja_haupt_opt_0_2l', 'maracuja_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'maracuja_haupt_opt_0_4l', 'maracuja_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'orange_haupt_opt_0_2l', 'orange_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'orange_haupt_opt_0_4l', 'orange_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mango_haupt_opt_0_2l', 'mango_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'mango_haupt_opt_0_4l', 'mango_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'kirsche_haupt_opt_0_2l', 'kirsche_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'kirsche_haupt_opt_0_4l', 'kirsche_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'banane_haupt_opt_0_2l', 'banane_haupt', '0,2l', 3.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'banane_haupt_opt_0_4l', 'banane_haupt', '0,4l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tiger_bier_singapur_haupt_opt_0_33l', 'tiger_bier_singapur_haupt', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'tiger_bier_singapur_haupt_opt_0_5l', 'tiger_bier_singapur_haupt', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sai_gon_bier_haupt_opt_0_33l', 'sai_gon_bier_haupt', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'sai_gon_bier_haupt_opt_0_5l', 'sai_gon_bier_haupt', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'warsteiner_alkoholfrei_haupt_opt_0_33l', 'warsteiner_alkoholfrei_haupt', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'warsteiner_alkoholfrei_haupt_opt_0_5l', 'warsteiner_alkoholfrei_haupt', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei_haupt_opt_0_33l', 'erdinger_hefeweizen_dunkel_hell_alkoholfrei_haupt', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'erdinger_hefeweizen_dunkel_hell_alkoholfrei_haupt_opt_0_5l', 'erdinger_hefeweizen_dunkel_hell_alkoholfrei_haupt', '0,5l', 4.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'asahi_bier_haupt_opt_0_33l', 'asahi_bier_haupt', '0,33l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'asahi_bier_haupt_opt_0_5l', 'asahi_bier_haupt', '0,5l', 5.50, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'grauburgunder_trocken_haupt_opt_0_2l', 'grauburgunder_trocken_haupt', '0,2l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'grauburgunder_trocken_haupt_opt_0_75l', 'grauburgunder_trocken_haupt', '0,75l', 18.00, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'riesling_haupt_opt_0_2l', 'riesling_haupt', '0,2l', 4.50, 0, 1
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

INSERT INTO menu_item_options (
  option_id, menu_item_id, name, price, vegetarian, display_order
) VALUES (
  'riesling_haupt_opt_0_75l', 'riesling_haupt', '0,75l', 18.00, 0, 2
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  price = VALUES(price),
  vegetarian = VALUES(vegetarian),
  display_order = VALUES(display_order);

-- ============================================
-- COMPLETE
-- ============================================
SELECT 'Menu data imported successfully!' AS message;
