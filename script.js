// Burger menu setup is now handled in js/main.js
// Menu Data (SPECIAL_ROLL_OPTIONS and MENU_DATA) is now in js/menu-data.js
// MENU_DATA is loaded from js/menu-data.js before this script, so we can use it directly

// Note: The following MENU_DATA array is kept here for reference but should not be used
// since MENU_DATA is already defined in js/menu-data.js
// This entire array definition can be removed once all code is migrated to modules
/*
const MENU_DATA_LEGACY = [
  {
    id: 'vorspeisen', title: 'Vorspeisen',
    items: [
      { name: '1. Mini Spring Roll (1,2,4,11,A)', desc: 'Gebackene Mini Frühlingsrollen, serviert mit Chili-Hähnchen-Soße', descEn: 'Baked Mini Spring Rolls, served with chili chicken sauce', price: '3,90', vegetarian: true, quantity: '(5 Stk.)' },
      { name: '2. Nem Ha Tinh (A,D)', desc: 'Gold-gebackene Frühlingsrollen, gefüllt mit gehacktem Tofu, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', descEn: 'Golden-fried spring rolls filled with chopped tofu, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', price: '4,50', vegetarian: true, quantity: '(2 Stk.)' },
      { name: '3. Nem Ha Noi (A,B,D)', desc: 'Gold-gebackene Frühlingsrollen, gefüllt mit Garnelen, Hähnchenfleisch, Pilzen, Glasnudeln und Gemüse, dazu ein frischer Salat und Limetten-Chili-Soße', descEn: 'Golden-fried spring rolls filled with shrimp, chicken, mushrooms, glass noodles, and vegetables, served with a fresh salad and lime-chili sauce', price: '4,90', quantity: '(2 Stk.)' },
      { name: '4. Sommerrollen Tofu (F,E)', desc: 'Tofu mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', descEn: 'Tofu with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', price: '4,50', vegetarian: true, quantity: '(2 Stk.)' },
      { name: '5. Sommerrollen Hähnchen (E)', desc: 'Hähnchen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', descEn: 'Chicken with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', price: '4,90', quantity: '(2 Stk.)' },
      { name: '6. Sommerrollen Garnelen (B,E)', desc: 'Garnelen mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', descEn: 'Shrimp with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', price: '5,20', quantity: '(2 Stk.)' },
      { name: '7. Sommerrollen gegrillter Lachs (D,E)', desc: 'Gegrillter Lachs mit Reisfadennudeln, Gurke, frischer Minze und Salat, umhüllt mit Reispapier. Zum Dippen mit Hoisin-Soße und gerösteten Erdnüssen', descEn: 'Grilled salmon with glass noodles, cucumber, fresh mint, and salad, wrapped in rice paper. Served with hoisin sauce and roasted peanuts for dipping', price: '5,90', quantity: '(2 Stk.)' },
      { name: '8. Edamame (M)', desc: 'Japanische Bohnen, leicht gekocht und perfekt gesalzen', descEn: 'Japanese beans, lightly cooked and perfectly salted', price: '4,50', vegetarian: true },
      { name: '9. Tom Chien Com (A,C)', desc: 'Großgarnelen mit jungem, grünen Reis, paniert und serviert mit Teriyaki-Soße', descEn: 'Large shrimp with young green rice, breaded and served with teriyaki sauce', price: '5,90', quantity: '(2 Stk.)' },
      { name: '10. Algen Salat (A,K)', desc: 'Seetang-Salat, garniert mit Sesam', descEn: 'Seaweed salad, garnished with sesame', price: '4,50', vegetarian: true },
      { name: '11. Prawn Tornado (B,C)', desc: 'Gebackene Garnelen, umwickelt mit Kartoffelspirale. serviert mit Chili-Hähnchen-Soße', descEn: 'Baked shrimp wrapped in potato spiral, served with chili chicken sauce', price: '4,90', quantity: '(3 Stk.)' },
      { name: '12. Khoai Lang Chien', desc: 'Süßkartoffeln', descEn: 'Sweet potatoes', price: '4,90', vegetarian: true },
      { name: '13. Yakitori (F)', desc: 'Gegrillte Hähnchenspieße, serviert mit Teriyaki-Soße', descEn: 'Grilled chicken skewers, served with teriyaki sauce', price: '4,90', quantity: '(2 Stk.)' },
      { name: '14. Veggie Gyoza (A)', desc: 'Gebackene Teigtaschen mit Gemüsefüllung, serviert mit Chili-Hähnchen-Soße', descEn: 'Baked dumplings with vegetable filling, served with chili chicken sauce', price: '4,90', vegetarian: true, quantity: '(5 Stk.)' },
      { name: '15. Japan Gyoza (B)', desc: 'Gebackene Teigtaschen mit Garnelen und Hähnchenfleisch, serviert mit Chili-Hähnchen-Soße', descEn: 'Baked dumplings with shrimp and chicken, served with chili chicken sauce', price: '4,90', quantity: '(5 Stk.)' },
      { name: '16. Wantan Chien (A,B)', desc: 'Wonton-Teig knusprig gebacken mit Huhn und Garnelen, serviert mit Chili-Hähnchen-Soße', descEn: 'Crispy baked wonton dough with chicken and shrimp, served with chili chicken sauce', price: '4,90', quantity: '(5 Stk.)' },
      { name: '17. Kimchi Frau Pham (A,K)', desc: 'Scharf eingelegter Chinakohl, Frühlingszwiebeln und Karotten', descEn: 'Spicy pickled Chinese cabbage, spring onions, and carrots', price: '4,50', vegetarian: true },
      { name: '18. Sate Spieße (E)', desc: 'Gegrillte Hähnchenspieße, serviert mit Erdnuss-Soße', descEn: 'Grilled chicken skewers, served with peanut sauce', price: '5,90', quantity: '(2 Stk.)' },
      { name: '19. Happy Plate (A,D,E,F,M,K)', desc: '2 Sommerrollen mit Tofu, 3 Veggie Gyoza, 2 Nem Hà Tinh, Edamame und Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Cocktail-Soße', descEn: '2 summer rolls with tofu, 3 veggie gyoza, 2 Ha Tinh spring rolls, edamame, and seaweed salad, served with peanut sauce, lime-chili sauce, and cocktail sauce', price: '18,90', vegetarian: true, quantity: '(Für 2)' },
      { name: '20. Happy Plate (A,B,D,E,K)', desc: '2 Sommerrollen mit Hähnchenfleisch, 3 Prawn Tornado, 2 Nem Hà Nội, 5 Wantan-Chiên, Algensalat, serviert mit Erdnuss-Soße, Limetten-Chili-Soße und Chili-Hähnchen-Soße', descEn: '2 summer rolls with chicken, 3 prawn tornadoes, 2 Hanoi spring rolls, 5 crispy wontons, seaweed salad, served with peanut sauce, lime-chili sauce, and chili chicken sauce', price: '20,90', quantity: '(Für 2)' }
    ]
  },
  {
    id: 'salate', title: 'Salate',
    items: [
      { 
        name: '30. Mix Sashimi (D,E,K)', 
        desc: 'Frischer Fisch (Lachs, Thunfisch, Garnelen, Surimi) auf einem raffinierten Frühlingssalat mit hausgemachtem Dressing. Mit Unagi-Sauce, Avocado & Sesam', 
        descEn: 'Fresh fish (salmon, tuna, shrimp, surimi) on a refined spring salad with homemade dressing. Topped with unagi sauce, avocado, and sesame',
        price: '11,90' 
      },
      { 
        name: '31. Mango salat (E,F)', 
        desc: 'Saison-Salat mit Mango, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 
        descEn: 'Seasonal salad with mango, peanuts, crispy onions, herbs, and homemade lime dressing, with:',
        price: '7,90',
        hasOptions: true,
        options: [
          { name: 'A. Gebackener Tofu', price: '7,90', vegetarian: true },
          { name: 'B. Hähnchenbrustfilet', price: '8,90' },
          { name: 'C. Mariniertes Rindfleisch', price: '8,90' },
          { name: 'D. Garnelen', price: '8,90' }
        ]
      },
      { 
        name: '32. Leo Salat (F)', 
        desc: 'Saison-Salat mit Avocado, Gurke, Kirschtomaten, Erdnüssen, Röstzwiebeln, Kräutern und hausgemachtem Limetten-Dressing, dazu:', 
        descEn: 'Seasonal salad with avocado, cucumber, cherry tomatoes, peanuts, crispy onions, herbs, and homemade lime dressing, with:',
        price: '7,90',
        hasOptions: true,
        options: [
          { name: 'A. Gebackener Tofu', price: '7,90', vegetarian: true },
          { name: 'B. Hähnchenbrustfilet', price: '8,90' },
          { name: 'C. Mariniertes Rindfleisch', price: '8,90' },
          { name: 'D. Garnelen', price: '8,90' }
        ]
      },
      { 
        name: '33. Salmon Love (D)', 
        desc: 'Gegrilltes Lachsfilet auf Frühlingssalat, verfeinert mit hausgemachtem Dressing. Garniert mit Unagi-Soße, frischen Kräutern, gerösteten Erdnüssen, Röstzwiebeln und mit Limetten-Chili-Dressing verfeinert', 
        descEn: 'Grilled salmon fillet on a spring salad, enhanced with homemade dressing. Topped with unagi sauce, fresh herbs, roasted peanuts, crispy onions, and refined with lime-chili dressing',
        price: '10,90' 
      }
    ]
  },
  {
    id: 'suppen', title: 'Suppen',
    items: [
      { name: '40. Miso Suppe (F)', desc: 'Japanischer Tofu mit Seetang und Frühlingszwiebeln', descEn: 'Japanese tofu with seaweed and spring onions', price: '3,50', vegetarian: true },
      { name: '41. Sake Suppe (D)', desc: 'Lachssuppe mit Dill, Seetang und Frühlingszwiebeln', descEn: 'Salmon soup with dill, seaweed, and spring onions', price: '3,90' },
      { name: '42. Ebi Soup (B,K)', desc: 'Garnelen, Champignons, Zwiebeln, Pakchoi und Koriander', descEn: 'Shrimp, mushrooms, onions, bok choy, and coriander', price: '4,90' },
      { name: '43. Sua dua dau (F)', desc: 'Kokosmilch, Tofu, Champignons, Tomaten, Zwiebeln, Koriander', descEn: 'Coconut milk, tofu, mushrooms, tomatoes, onions, coriander', price: '4,50', vegetarian: true },
      { name: '44. Sua Dua Tom (B)', desc: 'Kokosmilch, Garnelen, Champignons, Tomaten, Zwiebeln, Koriander', descEn: 'Coconut milk, shrimp, mushrooms, tomatoes, onions, coriander', price: '4,90' },
      { name: '45. Sua Dua Ga', desc: 'Kokosmilch, Hühnerfleisch, Champignons, Tomaten, Zwiebeln, Koriander', descEn: 'Coconut milk, chicken, mushrooms, tomatoes, onions, coriander', price: '4,90' },
      { name: '46. Wan-tan-suppe (B)', desc: 'Garnelen, Hühnerfleisch, Champignons, Zwiebeln, Pakchoi und Koriander', descEn: 'Shrimp, chicken, mushrooms, onions, bok choy, and coriander', price: '4,90' }
    ]
  },
  {
    id: 'sushimenu', title: 'Sushi Menüs',
    items: [
      { 
        name: 'S1. Menü 1 (A,D,F)', 
        desc: '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake', 
        descEn: '8 Kappa Maki, 8 Kampyo Maki, 8 Avocado Maki, 2 Nigiri, 1 Avocado, 1 Shitake',
        price: '9,90',
        useBulletPoints: true
      },
      { 
        name: 'S2. Menü 2', 
        desc: '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago', 
        descEn: '8 Oshinko Maki, 8 Avocado Rollen, 2 Nigiri, 1 Shiitake, 1 Tamago',
        price: '11,50',
        useBulletPoints: true
      },
      { 
        name: 'S3. Menü 3', 
        desc: '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake', 
        descEn: '1 Miso, 8 Paprika Maki, 8 Veggie I-O, 3 Nigiri 1 Kampyo, 1 Avocado, 1 Shitake',
        price: '14,90',
        useBulletPoints: true
      },
      { 
        name: 'S4. Menü 4', 
        desc: '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Sake', 
        descEn: '8 Kali Maki, 8 Sake Maki, 2 Nigiri: Salmon',
        price: '10,90',
        useBulletPoints: true
      },
      { 
        name: 'S5. Menü 5', 
        desc: '8 Sake Maki, 4 Kali I-O, Maguro Nigiri, 1 Sake Nigiri', 
        descEn: '8 Salmon Maki, 4 Kali I-O, Maguro Nigiri, 1 Salmon Nigiri',
        price: '11,90',
        useBulletPoints: true
      },
      { 
        name: 'S6. Menü 6', 
        desc: '8 Sake Roll, 8 Ebi Maki, 2 Nigiri: Sake, Maguro', 
        descEn: '8 Salmon Rolls, 8 Ebi Maki, 2 Nigiri: Salmon, Tuna',
        price: '13,90',
        useBulletPoints: true
      },
      { 
        name: 'S7. Nigiri Menü (B)', 
        desc: '6 Nigiri: Sake, Maguro, Ebi, Ika, Avocado, Unagi', 
        descEn: '6 Nigiri: Salmon, Tuna, Shrimp, Squid, Avocado, Eel',
        price: '14,90',
        useBulletPoints: true
      },
      { 
        name: 'S8. Philadelphia Menu (A,B,D,G,K,F)', 
        desc: '8 Philadelphia I-O, 8 Sake Avocado Maki, 2 Ebi Nigiri & 2 Sake Nigiri', 
        descEn: '8 Philadelphia I-O, 8 Salmon Avocado Maki, 2 Shrimp Nigiri & 2 Salmon Nigiri',
        price: '17,90',
        useBulletPoints: true
      },
      { 
        name: 'S9. Aiko Menü', 
        desc: '6 Aiko Rollen, 8 Sake Avocado Maki, 2 Maguro Nigiri & 2 Sake Nigiri', 
        descEn: '6 Aiko Rolls, 8 Salmon Avocado Maki, 2 Tuna Nigiri & 2 Salmon Nigiri',
        price: '18,90',
        useBulletPoints: true
      },
      { 
        name: 'S10. Tuna Menü', 
        desc: '8 Maguro Crunchy, 8 Sake Avocado Maki, 2 Maguro Nigiri, 2 Lachs Nigiri', 
        descEn: '8 Maguro Crunchy, 8 Salmon Avocado Maki, 2 Tuna Nigiri, 2 Salmon Nigiri',
        price: '17,90',
        useBulletPoints: true
      },
      { 
        name: 'S11. Tori Menü', 
        desc: '6 Yakitori Big Rolls, 8 Tori Maki, 8 Tori I-O', 
        descEn: '6 Yakitori Big Rolls, 8 Chicken Maki, 8 Chicken I-O',
        price: '15,90',
        useBulletPoints: true
      },
      { 
        name: 'S12. Deluxe Menü | Für 2 Persone', 
        desc: '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Nigiri Sake, 2 Nigiri Maguro', 
        descEn: '8 Sake Maki, 8 California Maki, 8 Sake I-O, 8 Sake Rolls, 8 Ebi Rolls, 2 Salmon Nigiri, 2 Tuna Nigiri',
        price: '32,00',
        useBulletPoints: true
      },
      { 
        name: 'S13. Deluxe Menü Leo', 
        desc: '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Sake Nigiri, 1 Maguro Nigiri & 1 Ebi', 
        descEn: '8 Ebi Tempura I-O, 8 Sake I-O, 6 Sake Sashimi, 6 Leo Roll, 8 California Maki, 8 Sake Maki, 1 Salmon Nigiri, 1 Tuna Nigiri & 1 Shrimp Nigiri',
        price: '45,00',
        useBulletPoints: true
      }
    ]
  },
  {
    id: 'maki', title: 'Maki',
    categorySubtitle: '(8 Stk.)',
    items: [
      { name: 'M1. Sake (D)', desc: 'Lachs', descEn: 'Salmon', price: '4,20' },
      { name: 'M2. Sake avocado (D)', desc: 'Lachs Avocado', descEn: 'Salmon Avocado', price: '4,50' },
      { name: 'M3. Sake Kappa (D)', desc: 'Lachs, Gurke', descEn: 'Salmon, cucumber', price: '4,50' },
      { name: 'M4. Tekka (D)', desc: 'Thunfisch', descEn: 'Tuna', price: '4,50' },
      { name: 'M5. Spicy Tuna (D)', desc: 'Thunfisch, Lauch, Chili', descEn: 'Tuna, leek, chili', price: '4,80' },
      { name: 'M6. Ebi (B)', desc: 'Garnelen', descEn: 'Shrimp', price: '4,20' },
      { name: 'M7. Ebi Avocado (B)', desc: 'Garnelen, Avocado', descEn: 'Shrimp, avocado', price: '4,50' },
      { name: 'M8. California', desc: 'Surimi, Avocado', descEn: 'Surimi, avocado', price: '3,90' },
      { name: 'M9. Salmon Skin', desc: 'Gegrillte Lachshaut, Unagi-Soße', descEn: 'Grilled salmon skin, unagi sauce', price: '3,90' },
      { name: 'M10. Tuna Cooked', desc: 'Gekochter Thunfisch, Mayo, Chili, Lauch', descEn: 'Cooked tuna, mayo, chili, leek', price: '4,50' },
      { name: 'M11. Sake Cooked', desc: 'Gekochter Lachs, Mayo, Chili', descEn: 'Cooked salmon, mayo, chili', price: '4,50' },
      { name: 'M12. Tori', desc: 'Hähnchenstreifen', descEn: 'Chicken strips', price: '4,20' },
      { name: 'M13. Kappa', desc: 'Gurke, Frischkäse', descEn: 'Cucumber, cream cheese', price: '3,90', vegetarian: true },
      { name: 'M14. Avocado', desc: 'Avocado', descEn: 'Avocado', price: '3,90', vegetarian: true },
      { name: 'M15. Tamago', desc: 'Japan-Omelett', descEn: 'Japanese omelette', price: '3,90' },
      { name: 'M16. Unagi', desc: 'Flussaal', descEn: 'Freshwater eel', price: '4,50' },
      { name: 'M17. Inari', desc: 'Marinierter Tofu', descEn: 'Marinated tofu', price: '3,90', vegetarian: true },
      { name: 'M18. Shiitake', desc: 'Japan-Pilz', descEn: 'Japanese mushroom', price: '3,90', vegetarian: true },
      { name: 'M19. Kampyo', desc: 'Kürbis', descEn: 'Pumpkin', price: '3,90', vegetarian: true },
      { name: 'M20. Rucula', desc: 'Rucola, Frischkäse, Sesam', descEn: 'Arugula, cream cheese, sesame', price: '3,90', vegetarian: true },
      { name: 'M21. Paprika', desc: 'Paprika', descEn: 'Bell pepper', price: '3,90', vegetarian: true }
    ]
  },
  {
    id: 'insideout', title: 'Inside Out Sushi',
    categorySubtitle: '(8 Stk.)',
    items: [
      { name: 'U1. Sake I-O', desc: 'Lachs, Avocado — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Salmon, avocado — I-O maki with sesame and fish roe', price: '7,50' },
      { name: 'U2. Maguro I-O', desc: 'Thunfisch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Tuna, cucumber — I-O maki with sesame and fish roe', price: '8,90' },
      { name: 'U3. Ebi I-O', desc: 'Garnelen, Avocado — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Shrimp, avocado — I-O maki with sesame and fish roe', price: '8,50' },
      { name: 'U4. Ebi Tempura I-O', desc: 'Panierte Garnelen, Frischkäse, Gurke — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Breaded shrimp, cream cheese, cucumber — I-O maki with sesame and fish roe', price: '8,90' },
      { name: 'U5. Veggie I-O', desc: 'Kürbis, Rettich, Avocado, Sesam — umgedrehte Maki mit Sesam', descEn: 'Pumpkin, radish, avocado, sesame — I-O maki with sesame', price: '7,20', vegetarian: true },
      { name: 'U6. Rucola Kappa I-O', desc: 'Rucola, Gurke, Frischkäse — umgedrehte Maki mit Sesam', descEn: 'Arugula, cucumber, cream cheese — I-O maki with sesame', price: '7,20', vegetarian: true },
      { name: 'U7. California I-O', desc: 'Krebsfleischimitat, Avocado — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Imitation crab, avocado — I-O maki with sesame and fish roe', price: '7,50' },
      { name: 'U8. Ebi Spicy I-O', desc: 'Scharfe Garnelen, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Spicy shrimp, cucumber, leek — I-O maki with sesame and fish roe', price: '8,20', spicy: true },
      { name: 'U9. Sake Spicy I-O', desc: 'Scharfer Lachs, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Spicy salmon, cucumber, leek — I-O maki with sesame and fish roe', price: '8,20', spicy: true },
      { name: 'U10. Salmon Skin I-O', desc: 'Lachshaut, Gurke, Aal — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Salmon skin, cucumber, eel — I-O maki with sesame and fish roe', price: '7,50' },
      { name: 'U11. Maguro Spicy I-O', desc: 'Scharfer Thunfisch, Gurke, Lauch — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Spicy tuna, cucumber, leek — I-O maki with sesame and fish roe', price: '8,90', spicy: true },
      { name: 'U12. Tamago I-O', desc: 'Omelett, Avocado, Sesam — umgedrehte Maki mit Sesam', descEn: 'Omelette, avocado, sesame — I-O maki with sesame', price: '7,20' },
      { name: 'U13. Lachs Cooked I-O', desc: 'Gekochter Lachs, Mayo, Chili, Lauch, Gurke — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Cooked salmon, mayo, chili, leek, cucumber — I-O maki with sesame and fish roe', price: '7,80', spicy: true },
      { name: 'U14. Tuna Cooked I-O', desc: 'Gekochter Thunfisch, Mayonnaise, Lauch — umgedrehte Maki mit Sesam und Fischrogen', descEn: 'Cooked tuna, mayonnaise, leek — I-O maki with sesame and fish roe', price: '7,80' },
      { name: 'U15. Tori I-O', desc: 'Mariniertes Hühnerfleisch, Gurke, Sesam, Frischkäse — umgedrehte Maki mit Sesam', descEn: 'Marinated chicken, cucumber, sesame, cream cheese — I-O maki with sesame', price: '7,50' },
      { name: 'U16. Lachs Rucola I-O', desc: 'Lachs, Frischkäse, Rucola, Sesam — umgedrehte Maki mit Sesam', descEn: 'Salmon, cream cheese, arugula, sesame — I-O maki with sesame', price: '8,20' }
    ]
  },
  {
    id: 'crunchy', title: 'Crunchy Inside Out Sushi',
    categorySubtitle: '(8 Stk.)',
    items: [
      { name: 'C1. Sake Crunchy', desc: 'Lachs, Avocado, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', descEn: 'Salmon, avocado, cream cheese — wrapped in crispy tempura flakes, special sauce and sesame', price: '7,50' },
      { name: 'C2. Maguro Crunchy', desc: 'Scharfer Thunfisch, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', descEn: 'Spicy tuna, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', price: '8,90', spicy: true },
      { name: 'C3. Ebi Crunchy', desc: 'Scharfe Garnelen, Lauch, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', descEn: 'Spicy shrimp, leek, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', price: '8,50', spicy: true },
      { name: 'C4. Skin Crunchy', desc: 'Gegrillte Lachshaut, Gurke, Aal — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', descEn: 'Grilled salmon skin, cucumber, eel — wrapped in crispy tempura flakes, special sauce and sesame', price: '7,50' },
      { name: 'C5. Salmon Tempura Crunchy', desc: 'Panierter Lachs, Frischkäse — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße Sesam', descEn: 'Breaded salmon, cream cheese — wrapped in crispy tempura flakes, special sauce sesame', price: '8,20' },
      { name: 'C6. Tuna Crunchy', desc: 'Gekochter, scharfer Thunfisch, Mayonnaise, Gurke — umhüllt mit knusprigen Tempura-Flocken, Spezialsoße und Sesam', descEn: 'Cooked spicy tuna, mayonnaise, cucumber — wrapped in crispy tempura flakes, special sauce and sesame', price: '8,20', spicy: true },
      { name: 'C7. Tori Crunchy', desc: 'Panierte Hühnerfleisch- und Frischkäserollen mit Gurken, umhüllt von knusprigen Tempura-Flocken, serviert mit Spezialsoße und Sesam', descEn: 'Breaded chicken and cream cheese rolls with cucumber, coated in crispy tempura flakes, served with special sauce and sesame', price: '8,20' }
    ]
  },
  {
    id: 'sashimi', title: 'Sashimi',
    items: [
      { name: 'Sa1. Sake (6 Stk.)', desc: 'Lachs', descEn: 'Salmon', price: '13,90' },
      { name: 'Sa2. Maguro (6 Stk.)', desc: 'Thunfisch', descEn: 'Tuna', price: '14,90' },
      { name: 'Sa3. Sake & Maguro', desc: 'Lachs (5 Stk.) & Thunfisch (5 Stk.)', descEn: 'Salmon (5 pcs.) & Tuna (5 pcs.)', price: '18,00' }
    ]
  },
  {
    id: 'nigiri', title: 'Nigiri',
    categorySubtitle: '(2 Stk.)',
    items: [
      { name: 'N1. Sake (D)', desc: 'Lachs', descEn: 'Salmon', price: '3,90' },
      { name: 'N2. Maguro (D)', desc: 'Thunfisch', descEn: 'Tuna', price: '4,50' },
      { name: 'N3. Amaebi (B)', desc: 'Süßwasser-Garnelen', descEn: 'Freshwater shrimp', price: '4,50' },
      { name: 'N4. Ebi (D)', desc: 'Garnelen', descEn: 'Shrimp', price: '4,20' },
      { name: 'N5. Ikura (D)', desc: 'Lachskaviar', descEn: 'Salmon roe', price: '4,50' },
      { name: 'N6. Unagi (D)', desc: 'Süßwasseraal', descEn: 'Freshwater eel', price: '4,50' },
      { name: 'N7. Kani (A,B,D,1,2,4)', desc: 'Surimi', descEn: 'Surimi', price: '3,50' },
      { name: 'N8. Tamago (C)', desc: 'Omelett', descEn: 'Omelette', price: '3,50' },
      { name: 'N9. Ika (D)', desc: 'Tintenfisch', descEn: 'Squid', price: '3,90' },
      { name: 'N10. Inari (F)', desc: 'Tofu', descEn: 'Tofu', price: '3,50', vegetarian: true },
      { name: 'N11. Shiitake', desc: 'Japanische Pilze', descEn: 'Japanese mushrooms', price: '3,50', vegetarian: true },
      { name: 'N12. Avocado', desc: 'Avocado', descEn: 'Avocado', price: '3,20', vegetarian: true }
    ]
  },
  {
    id: 'bigrolls', title: 'Panierte Big Rolls',
    categorySubtitle: '(6 Stk.)',
    items: [
      { name: 'P1. Leo Rolls (A,D,G,K)', desc: 'Lachs, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', descEn: 'Salmon, cucumber, avocado, cream cheese – served with special sauces and sesame', price: '8,20' },
      { name: 'P2. Aiko Rolls (A,D,G,K)', desc: 'Gekochter Thunfisch, Lauch, Mayo, Chili, Gurke – serviert mit Spezialsoßen und Sesam', descEn: 'Cooked tuna, leek, mayo, chili, cucumber – served with special sauces and sesame', price: '8,20' },
      { name: 'P3. Tokyo Rolls (A,B,D,G,K,1,2,4)', desc: 'Lachshaut, Aal, Surimi, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', descEn: 'Salmon skin, eel, surimi, cucumber, cream cheese – served with special sauces and sesame', price: '8,20' },
      { name: 'P4. Fuji San Rolls (A,D,G,K)', desc: 'Garnelen, Gurke, Avocado, Frischkäse – serviert mit Spezialsoßen und Sesam', descEn: 'Shrimp, cucumber, avocado, cream cheese – served with special sauces and sesame', price: '8,50' },
      { name: 'P5. Emilia Rolls (A,K)', desc: 'Avocado, Paprika, Gurke, Kürbis, Shiitake – serviert mit Spezialsoßen und Sesam', descEn: 'Avocado, bell pepper, cucumber, pumpkin, shiitake – served with special sauces and sesame', price: '7,90', vegetarian: true },
      { name: 'P6. Yakitori Rolls (A,G,K)', desc: 'Hähnchen, Avocado, Gurke, Frischkäse – serviert mit Spezialsoßen und Sesam', descEn: 'Chicken, avocado, cucumber, cream cheese – served with special sauces and sesame', price: '8,20' },
      { name: 'P7. Bao ngoc Rolls (A,D,K)', desc: 'Gekochter Lachs, Mayo, Chili, Gurke, Avocado – serviert mit Spezialsoßen und Sesam', descEn: 'Cooked salmon, mayo, chili, cucumber, avocado – served with special sauces and sesame', price: '8,20' }
    ]
  },
  {
    id: 'minirolls', title: 'Panierte Mini Rolls',
    categorySubtitle: '(8 Stk.)',
    items: [
      { name: 'Pa1. Sake Rolls (A,D,G,K)', desc: 'Lachs — serviert mit Spezialsoßen und Sesam', descEn: 'Salmon — served with special sauces and sesame', price: '6,50' },
      { name: 'Pa2. Ebi Rolls (A,B,G,K)', desc: 'Garnelen, Lauch, Frischkäse — serviert mit Spezialsoßen und Sesam', descEn: 'Shrimp, leek, cream cheese — served with special sauces and sesame', price: '6,90' },
      { name: 'Pa3. Spicy Rolls (A,D,K)', desc: 'Thunfisch, Chili, Lauch — serviert mit Spezialsoßen und Sesam', descEn: 'Tuna, chili, leek — served with special sauces and sesame', price: '6,90', spicy: true },
      { name: 'Pa4. Bao ngoc Rolls (A,D,K)', desc: 'Gekochter Lachs, Mayo, Chili — serviert mit Spezialsoßen und Sesam', descEn: 'Cooked salmon, mayo, chili — served with special sauces and sesame', price: '6,90', spicy: true },
      { name: 'Pa5. Veggie Rolls (A,K)', desc: 'Shiitake, Kürbis — serviert mit Spezialsoßen und Sesam', descEn: 'Shiitake, pumpkin — served with special sauces and sesame', price: '6,50', vegetarian: true },
      { name: 'Pa6. Avocado Rolls (A,G,K)', desc: 'Avocado, Frischkäse — serviert mit Spezialsoßen und Sesam', descEn: 'Avocado, cream cheese — served with special sauces and sesame', price: '6,50', vegetarian: true },
      { name: 'Pa7. Tori Rolls (G,K)', desc: 'Hähnchen, Frischkäse — serviert mit Spezialsoßen und Sesam', descEn: 'Chicken, cream cheese — served with special sauces and sesame', price: '6,50' }
    ]
  },
  {
    id: 'specialrolls', title: 'Special Rolls',
    categoryDesc: 'Alle Rolls Nr. Sp1-Sp16 erhältlich in: A 4 stk. €5,50 B 8 stk. €11,50',
    items: [
      { name: 'Sp1. Leo Rolls (A,C,F)', desc: 'Avocado, Inari und Gurke — umwickelt mit Avocado', descEn: 'Avocado, inari and cucumber — wrapped with avocado', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], vegetarian: true },
      { name: 'Sp2. Mango Thunfisch Roll (A,D,G)', desc: 'Gekochter Thunfisch, Mayonnaise, Lauch, Chili, Gurke — umwickelt mit Mango, serviert mit Spezialsoße und Sesam', descEn: 'Cooked tuna, mayonnaise, leek, chili, cucumber — wrapped with mango, served with special sauce and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], spicy: true },
      { name: 'Sp3. Fire Tuna (A,D,G)', desc: 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Thunfisch', descEn: 'Breaded vegetables, cream cheese — wrapped with flambéed tuna', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], spicy: true },
      { name: 'Sp4. Fire Salmon (A,D,G)', desc: 'Paniertes Gemüse, Frischkäse — umwickelt mit flambiertem Lachs', descEn: 'Breaded vegetables, cream cheese — wrapped with flambéed salmon', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], spicy: true },
      { name: 'Sp5. Tiger Rolls (A,G,N,B)', desc: 'Garnelen-Tempura und Gurke — umwickelt mit Aal, serviert mit Spezialsoße und Sesam', descEn: 'Shrimp tempura and cucumber — wrapped with eel, served with special sauce and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp6. Chicken rolls (1,2,4,11,G)', desc: 'Gegrillte Hähnchenfiletstreifen, Mango und Oshinko — umwickelt mit Gurke', descEn: 'Grilled chicken fillet strips, mango and oshinko — wrapped with cucumber', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp7. Fire Ocean Rolls (A,B,G,D)', desc: 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit flambiertem Lachs und Thunfisch, serviert mit Spezialsoßen und Sesam', descEn: 'Breaded shrimp, cream cheese, cucumber — wrapped with flambéed salmon and tuna, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], spicy: true },
      { name: 'Sp8. Tuna Rolls (D,G)', desc: 'Gekochter Thunfisch, Mayo, Lauch, Chili, Gurke — umwickelt mit Röstzwiebeln, serviert mit Spezialsoßen und Sesam', descEn: 'Cooked tuna, mayo, leek, chili, cucumber — wrapped with crispy onions, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ], spicy: true },
      { name: 'Sp9. Philadelphia Rolls (A,B,D,G)', desc: 'Gemüse-Tempura und Frischkäse — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', descEn: 'Vegetable tempura and cream cheese — wrapped with salmon, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp10. Kyoto Rolls (C,D)', desc: 'Lachs, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', descEn: 'Salmon, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp11. Sake Alaska Rolls (B,C,D)', desc: 'Lachs, Avocado, Frischkäse — umwickelt mit Lachs. serviert mit Spezialsoße und Sesam', descEn: 'Salmon, avocado and cream cheese — wrapped with salmon, served with special sauce and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp12. Omelette Rolls (B,C)', desc: 'Omelett, Avocado, Surimi, Frischkäse — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', descEn: 'Omelette, avocado, surimi, cream cheese — wrapped with shrimp, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp13. Dragon Rolls (A,B,G,D)', desc: 'Panierte Garnelen, Frischkäse, Gurke — umwickelt mit Lachs, serviert mit Spezialsoßen und Sesam', descEn: 'Breaded shrimp, cream cheese, cucumber — wrapped with salmon, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp14. Fuji Rolls (A,D,G)', desc: 'Ebi, Avocado, Gurke, Frischkäse — umwickelt mit Avocado, serviert mit Spezialsoßen und Sesam', descEn: 'Shrimp, avocado, cucumber, cream cheese — wrapped with avocado, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp15. Tempura Special Rolls (A,B,C,D)', desc: 'Panierter Lachs, Frischkäse, Gurke — umwickelt mit Garnelen, serviert mit Spezialsoßen und Sesam', descEn: 'Breaded salmon, cream cheese, cucumber — wrapped with shrimp, served with special sauces and sesame', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] },
      { name: 'Sp16. Taiko Rolls (A,B,G,D)', desc: 'Garnelen, Avocado, Gurke, Frischkäse — umwickelt mit Lachs und Thunfisch', descEn: 'Shrimp, avocado, cucumber, cream cheese — wrapped with salmon and tuna', price: '5,50', hasOptions: true, options: [
        { name: 'A. 4 Stk.', price: '6,50' },
        { name: 'B. 8 Stk.', price: '11,50' }
      ] }
    ]
  },
  {
    id: 'firenigiri', title: 'Fire Special Nigiri',
    items: [
      { name: 'F1. Maguro Aburi (D,K)', desc: 'Thunfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', descEn: 'Tuna — flying fish roe, sesame, spring onions and special sauce, flambéed', price: '5,20' },
      { name: 'F2. Sake Aburi (D,K)', desc: 'Lachs — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', descEn: 'Salmon — flying fish roe, sesame, spring onions and special sauce, flambéed', price: '4,50' },
      { name: 'F3. Squid Aburi (D,K)', desc: 'Tintenfisch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', descEn: 'Squid — flying fish roe, sesame, spring onions and special sauce, flambéed', price: '4,50' },
      { name: 'F4. Maguro-Tatar (D,K)', desc: 'Gurkenhülle mit scharfem Thunfisch, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', descEn: 'Cucumber wrap with spicy tuna, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', price: '4,90', spicy: true },
      { name: 'F5. Salmon Rose (A,G,K)', desc: 'Flambierter gehackter Lachs, Mayonnaise, Lauch — Flugfisch-Kaviar, Sesam, Frühlingszwiebeln und Spezialsoße, flambiert', descEn: 'Flambéed chopped salmon, mayonnaise, leek — flying fish roe, sesame, spring onions and special sauce, flambéed', price: '5,50' }
    ]
  },
  {
    id: 'temaki', title: 'Temaki',
    items: [
      { name: 'Te1. Maguro Temaki', desc: 'Thunfisch, Gurken, Avocado', descEn: 'Tuna, cucumber, avocado', price: '5,90' },
      { name: 'Te2. Sake Temaki', desc: 'Lachs, Avocado, Gurken', descEn: 'Salmon, avocado, cucumber', price: '4,90' },
      { name: 'Te3. California Temaki', desc: 'Surimi, Avocado, Gurken', descEn: 'Surimi, avocado, cucumber', price: '4,60' },
      { name: 'Te4. Salmon Skin Temaki', desc: 'Lachshaut, Gurke, Aal', descEn: 'Salmon skin, cucumber, eel', price: '4,90' },
      { name: 'Te5. Tamago Temaki', desc: 'Omelett, Avocado, Gurken', descEn: 'Omelette, avocado, cucumber', price: '4,60' },
      { name: 'Te6. Inari Avocado Temaki', desc: 'Tofu, Gurken, Avocado', descEn: 'Tofu, cucumber, avocado', price: '4,60', vegetarian: true }
    ]
  },
  {
    id: 'teriyaki', title: 'Teriyaki Soße',
    items: [
      { name: '50. Sake Teriyaki (D,F)', desc: 'Japanisches gegrilltes Lachsgericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled salmon dish, served with vegetables and rice', price: '16,90' },
      { name: '51. Tuna Teriyaki (D,F)', desc: 'Japanisches gegrilltes Thunfischgericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled tuna dish, served with vegetables and rice', price: '17,90' },
      { name: '52. Tori Teriyaki (F)', desc: 'Japanisches gegrilltes Hähnchengericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled chicken dish, served with vegetables and rice', price: '14,90' },
      { name: '53. Ebi Teriyaki (B,F)', desc: 'Japanisches gegrilltes Garnelengericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled shrimp dish, served with vegetables and rice', price: '15,90' },
      { name: '54. Squid Teriyaki (D,F)', desc: 'Japanisches gegrilltes Tintenfischgericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled squid dish, served with vegetables and rice', price: '15,90' },
      { name: '55. Duck Teriyaki (A,F)', desc: 'Japanisches gegrilltes Entengericht, serviert mit Gemüse und Reis', descEn: 'Japanese grilled duck dish, served with vegetables and rice', price: '16,90' }
    ]
  },
  {
    id: 'pokebowl', title: 'Poke Bowl',
    categoryDesc: 'Unterlegt mit Reis, Cocktailsauce, Avocado, Salat, Gurken, Mango, hausgemachtem Kimchi nach Art des Hauses und Edamame. Verfeinert mit hausgemachter Soße. Wahlweise mit: / Served on rice with cocktail sauce, avocado, salad, cucumber, mango, homemade kimchi (house style) and edamame. Refined with homemade sauce. Choice of:',
    items: [
      { name: '60. Tufu Bowl (F,K,G)', desc: 'Gebackene Bio-Tofu mit Sesam', descEn: 'Fried organic tofu with sesame', price: '11,90', vegetarian: true },
      { name: '61. Seitan Bowl (F)', desc: 'Gebratener Seitan (vegan) mit Sesam', descEn: 'Fried seitan (vegan) with sesame', price: '12,90', vegetarian: true },
      { name: '62. Sake Bowl (D,G,K)', desc: 'Lachs', descEn: 'Salmon', price: '13,90' },
      { name: '63. Tori Bowl (G,K)', desc: 'Gebackene Huhn', descEn: 'Fried chicken', price: '12,90' },
      { name: '64. Bowl Grill (D,G,K)', desc: 'Gegrillter Lachs, Thunfisch mit Sesam', descEn: 'Grilled salmon, tuna with sesame', price: '14,90' },
      { name: '65. Ebi Bowl (B)', desc: 'Gebackene Ebi', descEn: 'Fried shrimp', price: '13,90' }
    ]
  },
  {
    id: 'hauptspeisen', title: 'Warme Gerichte',
    categoryDesc: 'Gerichte Nr. 70-80 - nach Wahl mit: A. Gebackener Tofu €11,90 | B. Hähnchenbrustfilet €12,90 | C. Gebackener Hähnchenbrustfilet €12,90 | D. Gegrilltes Hähnchen-Brustfilet €13,90 | E. Ente Kross €14,90 | G. Garnelen €13,90 | R. Mariniertes Rindfleisch €13,90 | H. Gegrillter Lachs €15,90 | I. Gebackene Seitan mit Sesam €15,90. Currys/Soßen (70-75) werden mit Duftreis serviert. Udon & Nudelsuppe (77-78) ohne Reis. Phở Trộn (79) mit Reisnudeln / Curries/Sauces (70-75) are served with fragrant rice. Udon & noodle soup (77-78) without rice. Phở Trộn (79) with rice noodles',
    items: [
      { name: '70. Roter Curry', desc: 'Kokosmilch, rotes Curry, verschiedenes Gemüse und Reis, dazu:', descEn: 'Coconut milk, red curry, assorted vegetables and rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], spicy: true },
      { name: '71. Erdnuss', desc: 'Cremige Kokosmilch-Erdnuss-Soße, verschiedenes Gemüse und Reis, dazu:', descEn: 'Creamy coconut-peanut sauce, assorted vegetables and rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ] },
      { name: '72. Mango-Curry', desc: 'Feinwürzige Mango-Curry-Soße, verschiedenes Gemüse und Reis, dazu:', descEn: 'Spicy mango curry sauce, assorted vegetables and rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ] },
      { name: '73. Avocado Curry', desc: 'Cremige Kokosmilch-Soße, grünes Curry, verschiedenes Gemüse und Duftreis, dazu:', descEn: 'Creamy coconut sauce, green curry, assorted vegetables and fragrant rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], spicy: true },
      { name: '74. Good Curry', desc: 'Cremige Kokosmilch-Soße, Ingwer-Curry, verschiedenes Gemüse und Duftreis, dazu:', descEn: 'Creamy coconut sauce, ginger curry, assorted vegetables and fragrant rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], spicy: true },
      { name: '75. Leo Spezial-Soße', desc: 'Frisches vietnamesisches Gemüse, pikante Soße, Knoblauch mit Duftreis, dazu:', descEn: 'Fresh Vietnamese vegetables, spicy sauce, garlic with fragrant rice, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], spicy: true },
      { name: '76. Pad Thai', desc: 'Reisbandnudeln im heißen Wok mit frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', descEn: 'Rice noodles stir-fried in a hot wok with fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], useBulletPoints: true },
      { name: '77. Japanische Nudelsuppe', desc: 'Japanische Nudeln, Hühnerbrühe, Gemüse und Kräuter, dazu:', descEn: 'Japanese noodles, chicken broth, vegetables and herbs, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], useBulletPoints: true },
      { name: '78. Udon Coco', desc: 'Japanische Nudeln in Kokosmilch, Masaman-Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', descEn: 'Japanese noodles in coconut milk, masaman curry, salad, peanuts, crispy onions and herbs, with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], useBulletPoints: true },
      { name: '79. Pho Tron', desc: 'Reisbandnudeln in Kokosmilch, rotem Curry, Salat, Erdnüssen, Röstzwiebeln und Kräutern, dazu:', descEn: 'Rice noodles in coconut milk, red curry, salad, peanuts, fried onions and herbs, served with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'E. Ente Kross', price: '14,90' },
        { name: 'G. Garnelen', price: '13,90' },
        { name: 'R. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], useBulletPoints: true },
      { name: '80. Bun Bo Nam Bo', desc: 'Typisch südvietnamesische Esskultur mit dünnen Reisbandnudeln, frischem Salat, Erdnüssen, Kräutern und hausgemachtem Limetten-Dressing, dazu:', descEn: 'Typical South Vietnamese cuisine with thin rice noodles, fresh salad, peanuts, herbs, and homemade lime dressing, served with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Mariniertes Rindfleisch', price: '13,90' },
        { name: 'D. Nem Ha Noi (3 Stk.)', price: '12,90' }
      ] },
      { name: '81. Phở', desc: 'Traditionelle vietnamesische Suppe mit Bandnudeln, frischem Ingwer und Kräutern, dazu:', descEn: 'Traditional Vietnamese soup with rice noodles, fresh ginger, and herbs, served with:', price: '11,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Mariniertes Rindfleisch', price: '13,90' }
      ] },
      { name: '82. Udon Yaki', desc: 'Udon-Nudeln im heißen Wok mit Ei, frischem Gemüse gebraten, verfeinert mit vietnamesischen Kräutern, Erdnüssen und Röstzwiebeln, dazu:', descEn: 'Udon noodles stir-fried in a hot wok with egg, fresh vegetables, refined with Vietnamese herbs, peanuts and crispy onions, with:', price: '12,90', hasOptions: true, options: [
        { name: 'A. Gebackener Tofu', price: '11,90', vegetarian: true },
        { name: 'B. Hähnchenbrustfilet', price: '12,90' },
        { name: 'C. Gebackener Hähnchenbrustfilet', price: '12,90' },
        { name: 'D. Gegrilltes Hähnchen-Brustfilet', price: '13,90' },
        { name: 'F. Garnelen', price: '13,90' },
        { name: 'G. Ente Kross', price: '14,90' },
        { name: 'H. Gegrillter Lachs', price: '15,90' },
        { name: 'I. Gebackene Seitan mit Sesam', price: '13,90', vegetarian: true }
      ], useBulletPoints: true },
      { name: '83. Rau Xào Tofu (F)', desc: 'Gebackene verschiedenes Gemüse, Zwiebeln, Pak Choi und Tofu mit Sesam, hausgemachter Pfeffersoße, vegetarisch und serviert mit Reis', descEn: 'Stir-fried mixed vegetables, onions, pak choi and tofu with sesame, homemade pepper sauce, vegetarian and served with rice', price: '12,90', vegetarian: true },
      { name: '84. Rau Xào Seitan (F)', desc: 'Gebackene verschiedenes Gemüse, Zwiebeln, Pak Choi und Seitan mit Sesam, hausgemachter Pfeffersoße, vegetarisch und serviert mit Reis', descEn: 'Stir-fried mixed vegetables, onions, pak choi and seitan with sesame, homemade pepper sauce, vegetarian and served with rice', price: '14,90', vegetarian: true },
      { name: '85. Steak Grill Lachs (D) (Medium)', desc: 'Gebackene Gemüse mit Zwiebeln, Lachs und Pak Choi, serviert mit Reis', descEn: 'Stir-fried vegetables with onions, salmon, and pak choi, served with rice', price: '16,90' },
      { name: '86. Steak Grill Thunfisch (D) (Medium)', desc: 'Gebackene verschiedenes Gemüse mit Zwiebeln, Thunfisch und Pak Choi, serviert mit Reis', descEn: 'Stir-fried mixed vegetables with onions, tuna, and pak choi, served with rice', price: '17,90' },
      { name: '87. Bo Luc Lac', desc: 'Gebackene verschiedenes Gemüse mit Zwiebeln, Pak Choi und Rindfleisch, serviert mit hausgemachter Soße und Reis', descEn: 'Stir-fried mixed vegetables with onions, pak choi, and beef, served with homemade sauce and rice', price: '16,90', spicy: true },
      { name: '88. Black Tiger (B)', desc: 'Gebackene verschiedenes Gemüse mit Zwiebeln, Pak Choi und Riesengarnelen, serviert mit hausgemachter Pfeffersoße und Reis', descEn: 'Stir-fried mixed vegetables with onions, pak choi, and king prawns, served with homemade pepper sauce and rice', price: '16,90', spicy: true }
    ]
  },
  {
    id: 'dessert', title: 'Desserts',
    items: [
      { name: 'D1. Dragon Ball (3 Stk.)', desc: 'Gefüllt mit süßen Bohnen', descEn: 'Filled with sweet beans', price: '4,50', vegetarian: true },
      { name: 'D2. Mochi (2 Stk.)', desc: 'Reiskuchen mit roten Bohnen', descEn: 'Rice cake with red beans', price: '4,50', vegetarian: true },
      { name: 'D3. Lucky Egg (3 Stk.)', desc: 'Gefüllt mit Vanille', descEn: 'Filled with vanilla', price: '4,50', vegetarian: true },
      { name: 'D4. Bananiflirt (5 Stk.)', desc: 'Gebackene Banane mit Spezialsoße', descEn: 'Fried banana with special sauce', price: '4,50', vegetarian: true }
    ]
  },
  {
    id: 'beilagen', title: 'Beilage',
    items: [
      { name: 'B1. Duftreis', price: '1,50' },
      { name: 'B2. Sushi Reis', price: '2,00' },
      { name: 'B3. Ingwer', price: '1,50' },
      { name: 'B4. Wasabi', price: '1,00' },
      { name: 'B5. Unagi-Soße', price: '1,50' },
      { name: 'B6. Cocktailsoße', price: '1,50' },
      { name: 'B7. Reiband-Nudeln', price: '2,00' },
      { name: 'B8. Udon-Nudeln', price: '2,00' }
    ]
  },
  {
    id: 'getranke', title: 'Getränke',
    items: [
      { name: 'Naturell', groupTitle: 'Wasser/ Mineral Water', price: '2,50', hasOptions: true, options: [
        { name: 'U,2l', price: '2,50' },
        { name: 'U,4l', price: '3,90' },
        { name: 'U,75l', price: '6,50' }
      ] },
      { name: 'Mineral wasser/ sprudel', groupTitle: 'Wasser/ Mineral Water', price: '2,50', hasOptions: true, options: [
        { name: 'U,2l', price: '2,50' },
        { name: 'U,4l', price: '3,90' },
        { name: 'U,75l', price: '6,50' }
      ] },
      { name: 'Cocacola', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Cola Light', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Fanta', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Sprite', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Ginger Ale', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Tonic', groupTitle: 'Soft Drinks', price: '3,20', hasOptions: true, options: [
        { name: 'U,2l', price: '3,20' },
        { name: 'U,4l', price: '3,90' }
      ] },
      { name: 'Apfel', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Ananas', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Maracuja', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Orange', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Mango', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Kirsche', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Banane', groupTitle: 'Säfte/ Juices', price: '3,50', hasOptions: true, options: [
        { name: 'U,2l', price: '3,50' },
        { name: 'U,4l', price: '5,50' }
      ] },
      { name: 'Cafe Sữa Nóng', groupTitle: 'Kaffee/ Tee', desc: 'Hot Vietnamese Coffee', descEn: 'Hot Vietnamese Coffee', price: '4,50' },
      { name: 'Green Tea', groupTitle: 'Kaffee/ Tee', price: '4,20' },
      { name: 'Ingwer Tea', groupTitle: 'Kaffee/ Tee', desc: 'Ginger Tea', descEn: 'Ginger Tea', price: '4,20' },
      { name: 'Jasmint tea', groupTitle: 'Kaffee/ Tee', desc: 'Jasmine Tea', descEn: 'Jasmine Tea', price: '4,20' },
      { name: 'Nha Dam', groupTitle: 'Homemade Drinks', desc: 'Limetten, Zitronengras, Aloe Vera, Minze', descEn: 'Lime, Lemongrass, Aloe Vera, Mint', price: '5,50' },
      { name: 'Ingwer Limonad', groupTitle: 'Homemade Drinks', desc: 'Frische Ingwer, Zitrone, Orange, Rohzucker, Orangensaft, Ananassaft', descEn: 'Fresh Ginger, Lemon, Orange, Raw sugar, Orange juice, Pineapple juice', price: '6,50' },
      { name: 'Hausgemachte Eistee', groupTitle: 'Homemade Drinks', desc: 'Jasmin Tee (Apfelsaft/ Mango/ Maracuja oder Erdbeere)', descEn: 'Jasmine Tea (Apple juice/ Mango/ Passion fruit or Strawberry)', price: '5,50' },
      { name: 'Mango Lassi', groupTitle: 'Homemade Drinks', desc: 'Joghurt, Mango, Mangosirup, Kokossirup, Mangosaft', descEn: 'Yogurt, Mango, Mango syrup, Coconut syrup, Mango juice', price: '6,50' },
      { name: 'Avocado Lassi', groupTitle: 'Homemade Drinks', desc: 'Avocado, Mangosirup, Joghurt, Milch', descEn: 'Avocado, mango syrup, yogurt, milk', price: '6,50' },
      { name: 'Chanh da', groupTitle: 'Homemade Drinks', desc: 'Frische Limetten, Rohrzucker, Mineralwasser', descEn: 'Fresh Lime, Raw sugar, Mineral water', price: '5,50' },
      { name: 'Ipanema', groupTitle: 'Homemade Drinks', desc: 'Limetten, Rohzucker, Ginger Ale', descEn: 'Lime, Raw sugar, Ginger Ale', price: '6,50' },
      { name: 'Mojito', groupTitle: 'Homemade Drinks', desc: 'Limetten, Rohzucker, Minze, Ginger Ale', descEn: 'Lime, Raw sugar, Mint, Ginger Ale', price: '6,50' },
      { name: 'Coconut Kiss', groupTitle: 'Homemade Drinks', desc: 'Kokossirup, Sahne, Ananassaft', descEn: 'Coconut syrup, cream, pineapple juice', price: '5,50' },
      { name: 'Sportsman', groupTitle: 'Homemade Drinks', desc: 'Banane, Zitrone, Limette, Rohzucker, Maracuja-Sirup, Orange-Saft, Ananas-Saft', descEn: 'Banana, Lemon, Lime, Raw sugar, Passion fruit syrup, Orange juice, Pineapple juice', price: '6,50' },
      { name: 'Tiger Bier Singapur', groupTitle: 'Bier', price: '4,50', hasOptions: true, options: [
        { name: 'U,33l', price: '4,50' },
        { name: 'U,5l', price: '5,50' }
      ] },
      { name: 'Sai Gon Bier', groupTitle: 'Bier', price: '4,50', hasOptions: true, options: [
        { name: 'U,33l', price: '4,50' },
        { name: 'U,5l', price: '5,50' }
      ] },
      { name: 'Warsteiner/ Alkoholfrei', groupTitle: 'Bier', desc: 'Alcohol-free', descEn: 'Alcohol-free', price: '4,50', hasOptions: true, options: [
        { name: 'U,33l', price: '4,50' },
        { name: 'U,5l', price: '5,50' }
      ] },
      { name: 'Erdinger Hefeweizen, dunkel/ hell/ alkoholfrei', groupTitle: 'Bier', desc: 'Erdinger Wheat beer, dark/ light/ alcohol-free', descEn: 'Erdinger Wheat beer, dark/ light/ alcohol-free', price: '4,50', hasOptions: true, options: [
        { name: 'U,33l', price: '4,50' },
        { name: 'U,5l', price: '4,50' }
      ] },
      { name: 'Asahi Bier', groupTitle: 'Bier', price: '4,50', hasOptions: true, options: [
        { name: 'U,33l', price: '4,50' },
        { name: 'U,5l', price: '5,50' }
      ] },
      { name: 'Grauburgunder Trocken', groupTitle: 'Weisswein', desc: 'Pinot Gris Dry', descEn: 'Pinot Gris Dry', price: '4,50', hasOptions: true, options: [
        { name: 'U,2l', price: '4,50' },
        { name: 'U,75l', price: '18,00' }
      ] },
      { name: 'Riesling', groupTitle: 'Weisswein', price: '4,50', hasOptions: true, options: [
        { name: 'U,2l', price: '4,50' },
        { name: 'U,75l', price: '18,00' }
      ] }
    ]
  }
];
*/

function renderMenuTabs() {
  const tabs = document.getElementById('menuTabs');
  if (!tabs) return;

  MENU_DATA.forEach((cat, idx) => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (idx === 0 ? ' active' : '');
    chip.textContent = cat.title;
    chip.dataset.target = cat.id;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.menu-tabs .chip').forEach(el => el.classList.remove('active'));
      chip.classList.add('active');
      renderMenuList(cat.id, document.getElementById('menuSearch')?.value || '');
      // Smooth scroll to top of menu section
      requestAnimationFrame(() => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    tabs.appendChild(chip);
  });
}

// Helper function to get item image based on category
function getItemImage(categoryId, itemName) {
  // Map category to default images - using new high-quality images
  const CAT_IMAGES = {
    vorspeisen: 'assets/477094040_943569787952278_5086544566261599514_n.jpg', // Spring rolls
    salate: 'assets/salat_mit_garnelen_88520.jpg', // Salad with shrimp
    suppen: 'assets/2325542.png', // Red curry soup
    hauptspeisen: 'assets/474747577_583620977982257_5069519367255368765_n.jpg', // Noodles/rice bowl
    teriyaki: 'assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg', // Teriyaki tuna
    pokebowl: 'assets/sake-poke-bowl-with-rice-or-salad.png', // Poke bowl
    maki: 'assets/banh-mi-shushi.png', // Maki sushi with roe
    nigiri: 'assets/526755952_122145800660617493_8652643431098218812_n.jpg', // Nigiri sushi
    insideout: 'assets/678a39d1596da842cc63c03c 1.png', // Inside out sushi
    sashimi: 'assets/498665275_17863755624399871_7773501872179564451_n 1.png', // Sashimi platter
    crunchy: 'assets/10 3498178 1.png', // Crunchy sushi rolls
    bigrolls: 'assets/bua-tiec-shushi.png', // Big rolls platter
    minirolls: 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.png', // Mini rolls
    specialrolls: 'assets/close-up-sushi-served-table 1.png', // Special rolls
    firenigiri: 'assets/107321305_156996452705031_5135397567937722939_n.jpg', // Fire nigiri
    temaki: 'assets/dsc06551_master.jpg', // Temaki with roe
    sushimenu: 'assets/bua-tiec-shushi.png', // Sushi menu platter
    dessert: 'assets/474145891_579480641729624_2668845756094693673_n.jpg', // Dessert bowls
    beilagen: 'assets/524354655_17842903512542764_6403983830540063508_n11 1.png' // Side dishes
  };
  return CAT_IMAGES[categoryId] || 'assets/close-up-sushi-served-table 1.png';
}

function createCategory(cat, query, shouldOpen = false) {
  const details = document.createElement('details');
  details.className = 'menu-category';
  details.id = cat.id;
  if (shouldOpen) details.open = true;
  const summary = document.createElement('summary');
  const filtered = cat.items.filter(i => (i.name + ' ' + i.desc).toLowerCase().includes(query.toLowerCase()));
  if (filtered.length === 0) return null;
  // Decorative background per category - using new high-quality images
  const CAT_BG = {
    vorspeisen: 'assets/477094040_943569787952278_5086544566261599514_n.jpg', // Spring rolls
    salate: 'assets/salat_mit_garnelen_88520.jpg', // Salad with shrimp
    suppen: 'assets/2325542.png', // Red curry soup
    hauptspeisen: 'assets/474747577_583620977982257_5069519367255368765_n.jpg', // Noodles/rice bowl
    teriyaki: 'assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg', // Teriyaki tuna
    pokebowl: 'assets/sake-poke-bowl-with-rice-or-salad.png', // Poke bowl
    maki: 'assets/banh-mi-shushi.png', // Maki sushi with roe
    nigiri: 'assets/526755952_122145800660617493_8652643431098218812_n.jpg', // Nigiri sushi
    insideout: 'assets/678a39d1596da842cc63c03c 1.png', // Inside out sushi
    sashimi: 'assets/498665275_17863755624399871_7773501872179564451_n 1.png', // Sashimi platter
    crunchy: 'assets/10 3498178 1.png', // Crunchy sushi rolls
    bigrolls: 'assets/bua-tiec-shushi.png', // Big rolls platter
    minirolls: 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.png', // Mini rolls
    specialrolls: 'assets/close-up-sushi-served-table 1.png', // Special rolls
    firenigiri: 'assets/107321305_156996452705031_5135397567937722939_n.jpg', // Fire nigiri
    temaki: 'assets/dsc06551_master.jpg', // Temaki with roe
    sushimenu: 'assets/bua-tiec-shushi.png', // Sushi menu platter
    dessert: 'assets/474145891_579480641729624_2668845756094693673_n.jpg', // Dessert bowls
    beilagen: 'assets/524354655_17842903512542764_6403983830540063508_n11 1.png' // Side dishes
  };
  const bg = CAT_BG[cat.id];
  if (bg) {
    details.style.setProperty('--summary-bg', `url("${bg}")`);
  }
  summary.innerHTML = `<span>${cat.title}</span><span class="meta"><span>${filtered.length}</span><span class="chev">▾</span></span>`;

  // Add category description if available
  const wrap = document.createElement('div');
  wrap.className = 'menu-items-grid';
  if (cat.categoryDesc) {
    const descDiv = document.createElement('div');
    descDiv.className = 'category-description';
    descDiv.textContent = cat.categoryDesc;
    descDiv.style.gridColumn = '1 / -1';
    wrap.appendChild(descDiv);
  }
  filtered.forEach((i) => {
    const card = document.createElement('div');
    card.className = 'menu-item-card';

    // Get image based on category (you can customize this mapping)
    const itemImage = getItemImage(cat.id, i.name);

    card.innerHTML = `
      <div class="menu-item-image-wrapper">
        <img class="menu-item-image" src="${itemImage}" alt="${i.name}" loading="lazy" onerror="this.onerror=null; this.style.display='none'; const fallback = this.parentElement.querySelector('.menu-item-image-fallback'); if(fallback) fallback.style.display='flex';">
        <div class="menu-item-image-fallback" style="display:none; align-items:center; justify-content:center; font-size:32px; color:var(--muted); width:100%; height:100%;">🍣</div>
      </div>
      <div class="menu-item-info">
        <div class="menu-item-name">${i.name}</div>
        <div class="menu-item-desc">${i.desc}</div>
      </div>
      <div class="menu-item-actions">
        <div class="menu-item-price">€${i.price}</div>
        <button class="menu-item-add-btn" data-name="${escapeHtml(i.name)}" data-price="${i.price}" data-desc="${escapeHtml(i.desc || '')}">
          <span>+</span>
          <span>In den Warenkorb</span>
        </button>
      </div>
    `;

    // Add click event listeners
    const addBtn = card.querySelector('.menu-item-add-btn');
    const handleAddClick = (e) => {
      e.stopPropagation();
      window.openAddToCartModal(i.name, i.price, i.desc || '');
    };

    if (addBtn) {
      addBtn.addEventListener('click', handleAddClick);
    }

    // Also allow clicking on the card to add
    card.addEventListener('click', (e) => {
      if (e.target !== addBtn && !addBtn.contains(e.target)) {
        handleAddClick(e);
      }
    });

    wrap.appendChild(card);
  });
  details.appendChild(summary);
  details.appendChild(wrap);
  return details;
}

function renderMenuList(activeId, query = '') {
  const list = document.getElementById('menuList');
  if (!list) return;
  list.innerHTML = '';

  if (!activeId) return; // Must have an active category

  const cats = MENU_DATA.filter(c => c.id === activeId);

  // Show only the selected category, always open it
  cats.forEach((cat) => {
    const el = createCategory(cat, query, true);
    if (el) list.appendChild(el);
  });
}

function setupMenuSearch() {
  const input = document.getElementById('menuSearch');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const query = e.target.value;
    const active = document.querySelector('.menu-tabs .chip.active');
    const activeId = active?.dataset.target;
    if (activeId) renderMenuList(activeId, query);
  });
}

// Cart functionality
// Cart variable is now declared in js/cart.js
// let cart = JSON.parse(localStorage.getItem('leoCart')) || [];

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addToCart(name, price, desc, btn) {
  // Open modal to add note and quantity
  if (typeof window.openAddToCartModal === 'function') {
    window.openAddToCartModal(name, price, desc);
  } else {
    console.error('openAddToCartModal not found! Make sure js/cart.js is loaded.');
  }
}

// openAddToCartModal function moved to js/cart.js - DO NOT REDEFINE HERE
// This function is now in js/cart.js and should not be overridden

function updateModalTotal() {
  const modal = document.getElementById('noteModal');
  const quantityInput = document.getElementById('quantityInput');
  const modalTotal = document.getElementById('modalTotal');

  if (!modal || !quantityInput || !modalTotal) return;

  const price = parseFloat(modal.dataset.currentPrice.replace(',', '.'));
  const qty = parseInt(quantityInput.value) || 1;
  const total = price * qty;

  modalTotal.textContent = formatPrice(total);
}

window.changeQuantity = function (delta) {
  const quantityInput = document.getElementById('quantityInput');
  if (!quantityInput) return;

  const current = parseInt(quantityInput.value) || 1;
  const newQty = Math.max(1, Math.min(20, current + delta));
  quantityInput.value = newQty;
  updateModalTotal();
}

function updateAddButtons() {
  // No longer needed - buttons removed from menu
  // Kept for backward compatibility
}

window.removeFromCart = function (name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  updateCartUI();
  updateAddButtons();
}

window.updateQuantity = function (name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    if (item.qty === 0) window.removeFromCart(name);
    else saveCart();
    updateCartUI();
    updateAddButtons();
  }
}

window.openNoteModal = function (name, currentNote = '') {
  // This function is for editing notes from cart
  // For adding items, use openAddToCartModal instead
  const modal = document.getElementById('noteModal');
  const noteInput = document.getElementById('noteInput');
  const noteItemName = document.getElementById('noteItemName');
  const quantityInput = document.getElementById('quantityInput');
  const modalTotal = document.getElementById('modalTotal');

  if (!modal || !noteInput || !noteItemName) return;

  // Find the item in cart to get price
  const item = cart.find(i => i.name === name);
  if (!item) return;

  // Set content
  noteItemName.innerHTML = `${name}<br><span style="color: var(--gold); font-size: 14px;">€${formatPrice(item.price)}</span>`;
  noteInput.value = currentNote || '';

  // Setup quantity
  if (quantityInput) {
    quantityInput.value = item.qty;
    quantityInput.addEventListener('input', updateModalTotal);
    quantityInput.addEventListener('change', updateModalTotal);
  }

  // Store data for save
  modal.dataset.currentItem = name;
  modal.dataset.currentPrice = formatPrice(item.price);
  modal.dataset.currentDesc = item.desc || '';

  // Update total
  if (modalTotal && quantityInput) {
    const qty = parseInt(quantityInput.value) || 1;
    const total = item.price * qty;
    modalTotal.textContent = formatPrice(total);
  }

  // Show modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    if (quantityInput) quantityInput.focus();
  }, 10);

  document.body.style.overflow = 'hidden';

  // Keyboard shortcuts
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNoteModal();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  modal._keydownHandler = handleKeydown;

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === modal) closeNoteModal();
  };
  modal.addEventListener('click', handleOverlayClick);
  modal._overlayHandler = handleOverlayClick;
}

window.closeNoteModal = function () {
  const modal = document.getElementById('noteModal');
  if (modal) {
    // Cleanup event listeners
    if (modal._keydownHandler) {
      document.removeEventListener('keydown', modal._keydownHandler);
      delete modal._keydownHandler;
    }
    if (modal._overlayHandler) {
      modal.removeEventListener('click', modal._overlayHandler);
      delete modal._overlayHandler;
    }

    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }
}

// saveNote function moved to js/cart.js - DO NOT REDEFINE HERE
// This function is now in js/cart.js and should not be overridden

function saveCart() {
  // Ensure all items have note field
  cart.forEach(item => {
    if (!item.hasOwnProperty('note')) {
      item.note = '';
    }
  });
  localStorage.setItem('leoCart', JSON.stringify(cart));
}

function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function formatPrice(price) {
  return `€${price.toFixed(2).replace('.', ',')}`;
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const fixedOrderTotal = document.getElementById('fixedOrderTotal');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');
  const orderBadge = document.getElementById('orderBadge');

  const total = getTotal();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  if (badge) badge.textContent = count;
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (fixedOrderTotal) fixedOrderTotal.textContent = formatPrice(total);
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

  // Update order badge
  if (orderBadge) {
    orderBadge.textContent = count;
    if (count > 0) {
      orderBadge.classList.add('show');
      orderBadge.classList.add('pulse');
      setTimeout(() => orderBadge.classList.remove('pulse'), 600);
    } else {
      orderBadge.classList.remove('show');
    }
  }

  // Add pulse animation class when cart has items
  if (fixedOrderBtn) {
    if (cart.length > 0) {
      fixedOrderBtn.classList.add('has-items');
    } else {
      fixedOrderBtn.classList.remove('has-items');
    }
  }

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Ihr Warenkorb ist leer</div>';
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-actions">
              <div class="cart-item-qty">
                <button onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')" aria-label="Entfernen">×</button>
        </div>
      `).join('');
    }
  }
}

function setupCart() {
  const toggle = document.getElementById('cartToggle');
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const close = document.getElementById('cartClose');
  const checkout = document.getElementById('checkoutBtn');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');

  function openCart() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cart-open');
    // Force hide fixed order button when cart is open
    const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
    allFixedOrderBtns.forEach(btn => {
      if (btn) {
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
        btn.style.setProperty('transform', 'translateX(200%)', 'important');
        btn.style.setProperty('right', '-9999px', 'important');
        btn.style.setProperty('bottom', '-9999px', 'important');
        btn.style.setProperty('z-index', '-1', 'important');
      }
    });
  }

  function closeCart() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('cart-open');

    // Show fixed order button when cart is closed
    // CRITICAL: Remove ALL inline styles first that were set in openCart()
    const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
    allFixedOrderBtns.forEach(btn => {
      if (btn) {
        // Remove all inline styles that might hide the button
        btn.style.removeProperty('display');
        btn.style.removeProperty('visibility');
        btn.style.removeProperty('opacity');
        btn.style.removeProperty('pointer-events');
        btn.style.removeProperty('transform');
        btn.style.removeProperty('right');
        btn.style.removeProperty('bottom');
        btn.style.removeProperty('left');
        btn.style.removeProperty('top');
        btn.style.removeProperty('z-index');
        btn.style.removeProperty('position');

        // Add force-show class to override CSS rules
        btn.classList.add('force-show');

        // Force show with !important
        const isMobile = window.innerWidth <= 720;
        btn.style.setProperty('display', 'flex', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        btn.style.setProperty('position', 'fixed', 'important');
        btn.style.setProperty('right', isMobile ? '12px' : '20px', 'important');
        btn.style.setProperty('bottom', isMobile ? '16px' : '20px', 'important');
        btn.style.setProperty('left', 'auto', 'important');
        btn.style.setProperty('top', 'auto', 'important');
        btn.style.setProperty('z-index', '99999', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        btn.style.setProperty('transform', 'none', 'important');
      }
    });
  }

  toggle?.addEventListener('click', openCart);
  close?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  // Setup fixed order button for menu page
  if (fixedOrderBtn) {
    const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog') || document.getElementById('menuOrderPage');

    if (isMenuPage) {
      // On menu page: open cart when clicked
      fixedOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    }
  }
  // Checkout button handler - only add if not already handled by js/cart.js
  if (checkout && !checkout.hasAttribute('data-checkout-handler')) {
    checkout.setAttribute('data-checkout-handler', 'true');
    checkout.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (cart.length === 0) {
        alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
        return;
      }
      // Close cart first
      if (typeof closeCart === 'function') {
        closeCart();
      }
      // Redirect to checkout page
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 200);
    });
  }

  // Setup payment modal close on overlay click (only once)
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) {
        closePaymentModal();
      }
    });
  }

  // Function to try injecting cart into GloriaFood widget
  // Expose to global scope for external access
  window.tryInjectGloriaFoodCart = function tryInjectGloriaFoodCart() {
    const cartData = JSON.parse(localStorage.getItem('gloriafood_cart') || '[]');
    if (!cartData || cartData.length === 0) return;

    // Try to find GloriaFood iframe or widget
    const gloriaFrame = document.querySelector('iframe[src*="gloriafood"], iframe[id*="order"]');

    if (gloriaFrame && gloriaFrame.contentWindow) {
      try {
        // Try to access iframe content and add items
        const iframeDoc = gloriaFrame.contentDocument || gloriaFrame.contentWindow.document;

        cartData.forEach(item => {
          // Try to find item in menu and click add button
          const menuItems = iframeDoc.querySelectorAll('[class*="menu-item"], [class*="product"]');
          menuItems.forEach(menuItem => {
            const name = menuItem.textContent.toLowerCase();
            if (name.includes(item.name.toLowerCase().substring(3))) { // Remove number prefix
              const addBtn = menuItem.querySelector('button, [class*="add"], [onclick*="add"]');
              if (addBtn) {
                for (let i = 0; i < item.quantity; i++) {
                  setTimeout(() => addBtn.click(), i * 300);
                }
              }
            }
          });
        });
      } catch (e) {
        console.log('Cannot access GloriaFood iframe (CORS):', e);
      }
    }
  }

  // Delegate add to cart clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const name = e.target.dataset.name;
      const price = e.target.dataset.price;
      const desc = e.target.dataset.desc;
      addToCart(name, price, desc, e.target);
    }
  });

  updateCartUI();
  updateAddButtons();
}

// Menu Book Page
// currentBookPage and bookPages are now declared in js/menu.js
// let currentBookPage = 0;
// let bookPages = [];

function createWelcomePage1() {
  return `
    <div class="welcome-main-frame">
      <!-- Logo -->
      <div class="welcome-logo-section">
        <div class="welcome-logo-circle">
          <img src="assets/logo.png" alt="Leo Sushi">
        </div>
        <div class="welcome-logo-text">Leo Sushi</div>
      </div>
      
      <!-- Welcome Title (2 lines) -->
      <div class="welcome-title-section">
        <h1 class="welcome-title-line">Welcome to</h1>
        <h1 class="welcome-title-line">Leo Sushi</h1>
      </div>
      
      <!-- Welcome Message -->
      <div class="welcome-intro-section">
        <p>
          Tauchen Sie ein in eine andere Welt, in der Frische und Tradition großgeschrieben werden. Erleben Sie inmitten Marktplatz für Ihre Geschmacksknospen!
        </p>
        <p>
          Lassen Sie den Alltag in Leo Sushi hinter sich und entdecken Sie die kulinarische Vielfalt Asiens
        </p>
      </div>
      
      <!-- Important Notice -->
      <p class="welcome-notice">
        WIR WÜNSCHEN IHNEN EINEN WUNDERBAREN AUFENTHALT IM Leo Sushi FÜR ALLERGEN ÜBERSICHT | FRAGEN SIE BITTE DAS PERSONAL!
      </p>
      
      <!-- Allergene Section -->
      <div class="welcome-section">
        <h2 class="welcome-section-title">Allergene:</h2>
        <div class="welcome-list-two-columns">
          <div class="welcome-list-column">
            <div class="welcome-list-item">A - Glutenhaltiges Getreide</div>
            <div class="welcome-list-item">B - Krebstiere und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">C - Eier und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">D - Fische und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">E - Erdnüsse und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">F - Soja(bohnen) und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">G - Milch und daraus gewonnene Erzeugnisse</div>
      </div>
          <div class="welcome-list-column">
            <div class="welcome-list-item">H - Schalenfrüchte</div>
            <div class="welcome-list-item">I - Sellerie und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">J - Senf und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">K - Sesamsamen und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">L - Schwefeldioxid und Sulphite</div>
            <div class="welcome-list-item">M - Lupinen und daraus gewonnene Erzeugnisse</div>
            <div class="welcome-list-item">N - Weichtiere und daraus gewonnene Erzeugnisse</div>
          </div>
        </div>
      </div>
      
      <!-- Zusatzstoffe Section -->
      <div class="welcome-section">
        <h2 class="welcome-section-title">Zusatzstoffe:</h2>
        <div class="welcome-list-two-columns">
          <div class="welcome-list-column">
            <div class="welcome-list-item">1. Farbstoff</div>
            <div class="welcome-list-item">2. Konservierungsstoff</div>
            <div class="welcome-list-item">3. Antioxidationsmittel</div>
            <div class="welcome-list-item">4. Geschmacksverstärker</div>
            <div class="welcome-list-item">5. geschwefelt</div>
            <div class="welcome-list-item">6. geschwärzt</div>
            <div class="welcome-list-item">7. Phosphat</div>
          </div>
          <div class="welcome-list-column">
            <div class="welcome-list-item">8. Milcheiweiß (bei Fleischerzeugnissen)</div>
            <div class="welcome-list-item">9. koffeinhaltig</div>
            <div class="welcome-list-item">10. chininhaltig</div>
            <div class="welcome-list-item">11. Süßungsmittel</div>
            <div class="welcome-list-item">13. gewachst</div>
          </div>
        </div>
      </div>
      
      <!-- Disclaimer -->
      <p class="welcome-disclaimer">
        Alle Preisangaben sind in EUR, inkl. MwSt. Irrtümer sowie Wort- und Ausdrucksfehler vorbehalten, Alle Angaben ohne Gewähr! Bilder dienen nur zur Dekoration und sind der Abbildung ähnlich
      </p>
    </div>
  `;
}

function createWelcomePage2() {
  return `
    <div class="welcome-page-content">
      <!-- Decorative Line -->
      <div class="welcome-decorative-line">
        <div class="decorative-diamond"></div>
        <div class="decorative-line"></div>
        <div class="decorative-diamond"></div>
      </div>
      
      <!-- Allergene -->
      <div class="welcome-content-section">
        <h2 class="welcome-section-title">Allergene:</h2>
        <div class="welcome-grid-list">
          <div class="welcome-list-item"><strong>A</strong> - Glutenhaltiges Getreide</div>
          <div class="welcome-list-item"><strong>B</strong> - Krebstiere und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>C</strong> - Eier und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>D</strong> - Fische und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>E</strong> - Erdnüsse und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>F</strong> - Soja(bohnen) und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>G</strong> - Milch und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>H</strong> - Schalenfrüchte</div>
          <div class="welcome-list-item"><strong>I</strong> - Sellerie und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>J</strong> - Senf und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>K</strong> - Sesamsamen und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>L</strong> - Schwefeldioxid und Sulphite</div>
          <div class="welcome-list-item"><strong>M</strong> - Lupinen und daraus gewonnene Erzeugnisse</div>
          <div class="welcome-list-item"><strong>N</strong> - Weichtiere und daraus gewonnene Erzeugnisse</div>
        </div>
      </div>
    </div>
  `;
}

function createWelcomePage3() {
  return `
    <div class="welcome-page-content">
      <!-- Zusatzstoffe -->
      <div class="welcome-content-section">
        <h2 class="welcome-section-title">Zusatzstoffe:</h2>
        <div class="welcome-grid-list">
          <div class="welcome-list-item"><strong>1.</strong> Farbstoff</div>
          <div class="welcome-list-item"><strong>2.</strong> Konservierungsstoff</div>
          <div class="welcome-list-item"><strong>3.</strong> Antioxidationsmittel</div>
          <div class="welcome-list-item"><strong>4.</strong> Geschmacksverstärker</div>
          <div class="welcome-list-item"><strong>5.</strong> geschwefelt</div>
          <div class="welcome-list-item"><strong>6.</strong> geschwärzt</div>
          <div class="welcome-list-item"><strong>7.</strong> Phosphat</div>
          <div class="welcome-list-item"><strong>8.</strong> Milcheiweiß (bei Fleischerzeugnissen)</div>
          <div class="welcome-list-item"><strong>9.</strong> koffeinhaltig</div>
          <div class="welcome-list-item"><strong>10.</strong> chininhaltig</div>
          <div class="welcome-list-item"><strong>11.</strong> Süßungsmittel</div>
          <div class="welcome-list-item"><strong>13.</strong> gewachst</div>
        </div>
      </div>
      
      <!-- Decorative Line -->
      <div class="welcome-decorative-line">
        <div class="decorative-diamond"></div>
        <div class="decorative-line"></div>
        <div class="decorative-diamond"></div>
      </div>
      
      <!-- Disclaimer -->
      <p class="welcome-disclaimer">
        Alle Preisangaben sind in EUR, inkl. MwSt. Irrtümer sowie Wort- und Ausdrucksfehler vorbehalten, Alle Angaben ohne Gewähr! Bilder dienen nur zur Dekoration und sind der Abbildung ähnlich
      </p>
    </div>
  `;
}

function createBookPages() {
  // Calculate how many items fit per page (approximately 6-7 items per page without scrolling)
  const maxItemsPerPage = 7;
  const allPages = [];

  MENU_DATA.forEach(category => {
    // Split category into multiple pages if it has too many items
    const items = category.items || [];

    if (items.length === 0) return;

    // Split items into chunks
    for (let i = 0; i < items.length; i += maxItemsPerPage) {
      const chunk = items.slice(i, i + maxItemsPerPage);
      const pageNumber = Math.floor(i / maxItemsPerPage) + 1;
      const totalPages = Math.ceil(items.length / maxItemsPerPage);

      const pageData = {
        title: category.title,
        categoryDesc: category.categoryDesc,
        items: chunk,
        isPartial: items.length > maxItemsPerPage,
        pageNumber: pageNumber,
        totalPages: totalPages
      };

      allPages.push(pageData);
    }
  });

  // Tạo danh sách trang - mỗi trang là một category hoặc một phần của category
  // Trang đầu tiên là welcome pages (chia thành 3 trang)
  bookPages = [];

  // Add welcome pages (3 trang riêng biệt)
  const welcomePage1 = {
    title: 'Welcome',
    isWelcome: true,
    content: createWelcomePage1()
  };
  const welcomePage2 = {
    title: 'Allergene',
    isWelcome: true,
    content: createWelcomePage2()
  };
  const welcomePage3 = {
    title: 'Zusatzstoffe',
    isWelcome: true,
    content: createWelcomePage3()
  };
  bookPages.push([welcomePage1]);
  bookPages.push([welcomePage2]);
  bookPages.push([welcomePage3]);

  // Add menu pages - mỗi trang là một page (không còn spread)
  allPages.forEach(page => {
    bookPages.push([page]);
  });

  renderBookPages();
}

function renderBookPages() {
  const book = document.getElementById('menuBook');
  const totalPagesEl = document.getElementById('totalPages');

  if (!book) return;

  book.innerHTML = '';
  totalPagesEl.textContent = bookPages.length;

  // Create pages - mỗi trang chiếm toàn bộ width (100%)
  bookPages.forEach((pageArray, pageIndex) => {
    const page = document.createElement('div');
    page.className = 'book-page single-page';
    page.dataset.pageIndex = pageIndex;

    // Check if it's welcome page
    if (pageArray[0] && pageArray[0].isWelcome) {
      page.innerHTML = `<div class="book-page-content-wrapper">${pageArray[0].content}</div>`;
    } else if (pageArray[0]) {
      const pageContent = createBookPageContent(pageArray[0], pageIndex + 1, false);
      page.innerHTML = pageContent ? `<div class="book-page-content-wrapper">${pageContent}</div>` : '';
    }
    book.appendChild(page);
  });

  updateBookDisplay();
}

function createBookPageContent(pageData, pageNumber, isLeftPage) {
  if (!pageData) return '';

  const title = pageData.isPartial && pageData.totalPages > 1
    ? `${escapeHtml(pageData.title)} (${pageData.pageNumber}/${pageData.totalPages})`
    : escapeHtml(pageData.title);

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2 style="margin:0;flex:1;">${title}</h2>
      <div style="font-size:14px;color:var(--muted);font-weight:600;opacity:0.7;">${pageNumber}</div>
    </div>
    ${pageData.categoryDesc && pageData.pageNumber === 1 ? `<p style="color:var(--muted);margin-bottom:20px;font-style:italic;line-height:1.6;">${escapeHtml(pageData.categoryDesc)}</p>` : ''}
    <div class="book-page-content">
      ${pageData.items.map(item => `
        <div class="book-menu-item" onclick="window.openAddToCartModal('${item.name.replace(/'/g, "\\'")}', '${item.price}', '${(item.desc || '').replace(/'/g, "\\'")}')">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:16px;">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:16px;color:#fff;margin-bottom:6px;">${escapeHtml(item.name)}</div>
              <div style="color:var(--muted);font-size:14px;line-height:1.5;">${escapeHtml(item.desc || '')}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:18px;font-weight:700;color:var(--gold);margin-bottom:8px;">€${item.price}</div>
              <button style="background:linear-gradient(135deg,var(--gold),var(--gold-2));color:#1a1a1a;border:none;border-radius:8px;padding:8px 16px;font-weight:700;cursor:pointer;font-size:13px;transition:all .3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">+</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openMenuBook() {
  const overlay = document.getElementById('menuBookOverlay');
  if (!overlay) return;

  createBookPages();
  currentBookPage = 0;
  updateBookDisplay();

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenuBook() {
  const overlay = document.getElementById('menuBookOverlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function nextBookPage() {
  if (currentBookPage < bookPages.length - 1) {
    currentBookPage++;
    updateBookDisplay();
  }
}

function prevBookPage() {
  if (currentBookPage > 0) {
    currentBookPage--;
    updateBookDisplay();
  }
}

function updateBookDisplay() {
  const book = document.getElementById('menuBook');
  const currentPageEl = document.getElementById('currentPage');
  const prevBtn = document.getElementById('bookPrevBtn');
  const nextBtn = document.getElementById('bookNextBtn');

  if (!book || !currentPageEl) return;

  currentPageEl.textContent = currentBookPage + 1;

  // Update navigation buttons
  if (prevBtn) prevBtn.disabled = currentBookPage === 0;
  if (nextBtn) nextBtn.disabled = currentBookPage >= bookPages.length - 1;

  // Logic hiển thị đơn giản - chỉ hiện trang hiện tại
  const pages = book.querySelectorAll('.book-page');
  pages.forEach((page) => {
    const pageIndex = parseInt(page.dataset.pageIndex) || 0;

    if (pageIndex === currentBookPage) {
      // Trang hiện tại - hiển thị
      page.style.opacity = '1';
      page.style.pointerEvents = 'auto';
      page.style.zIndex = '2';
      page.style.display = 'flex';
    } else {
      // Trang khác - ẩn
      page.style.opacity = '0';
      page.style.pointerEvents = 'none';
      page.style.zIndex = '1';
      page.style.display = 'none';
    }
  });
}

function updateBookNavigation() {
  updateBookDisplay();
}

// Menu Order Page Functions
// currentCategory and allMenuItemsFlat are now declared in js/menu.js
// let currentCategory = null;
// let allMenuItemsFlat = [];

function openMenuOrderPage() {
  const menuOrderPage = document.getElementById('menuOrderPage');
  if (!menuOrderPage) return;

  // Initialize menu order page
  initMenuOrderPage();

  menuOrderPage.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenuOrderPage() {
  const menuOrderPage = document.getElementById('menuOrderPage');
  if (!menuOrderPage) return;

  menuOrderPage.classList.remove('active');
  document.body.style.overflow = '';
}

async function initMenuOrderPage() {
  // Load menu from API if available
  if (typeof window.loadMenuFromAPI === 'function') {
    await window.loadMenuFromAPI();
  }

  // Flatten all menu items
  allMenuItemsFlat = [];
  const menuData = window.MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
  menuData.forEach(category => {
    category.items.forEach(item => {
      allMenuItemsFlat.push({
        ...item,
        category: category.title,
        categoryDesc: category.categoryDesc
      });
    });
  });

  // Render menu tabs (with welcome tab first)
  renderMenuTabsNavigation();

  // Setup welcome content
  setupWelcomeTabs();
}

function renderMenuTabsNavigation() {
  const container = document.getElementById('menuTabsContainer');
  if (!container) return;

  container.innerHTML = '';

  // Add Welcome tab first
  const welcomeTab = document.createElement('button');
  welcomeTab.className = 'menu-tab active';
  welcomeTab.id = 'tab-btn-welcome';
  welcomeTab.setAttribute('role', 'tab');
  welcomeTab.setAttribute('aria-selected', 'true');
  welcomeTab.setAttribute('aria-controls', 'tab-welcome');
  welcomeTab.dataset.tab = 'welcome';
  welcomeTab.innerHTML = '<span class="tab-icon">👋</span><span class="tab-label">Willkommen</span>';
  welcomeTab.addEventListener('click', () => switchTab('welcome'));
  container.appendChild(welcomeTab);

  // Add category tabs
  MENU_DATA.forEach((category, index) => {
    const tab = document.createElement('button');
    tab.className = 'menu-tab';
    tab.id = `tab-btn-${category.id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'tab-category');
    tab.dataset.tab = 'category';
    tab.dataset.category = category.title;
    const icon = getCategoryIcon(category.title);
    tab.innerHTML = `<span class="tab-icon">${icon}</span><span class="tab-label">${category.title}</span>`;
    tab.addEventListener('click', () => switchTab('category', category.title));
    container.appendChild(tab);
  });

  // Populate mobile dropdown
  populateMobileDropdown();
}

function populateMobileDropdown() {
  const dropdown = document.getElementById('categorySelectMobile');
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="">Kategorie wählen...</option>';

  // Add Welcome option
  const welcomeOption = document.createElement('option');
  welcomeOption.value = 'welcome';
  welcomeOption.textContent = '👋 Willkommen';
  dropdown.appendChild(welcomeOption);

  // Add category options
  MENU_DATA.forEach(category => {
    const option = document.createElement('option');
    option.value = category.title;
    const icon = getCategoryIcon(category.title);
    option.textContent = `${icon} ${category.title}`;
    dropdown.appendChild(option);
  });

  // Handle dropdown change
  dropdown.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value === 'welcome') {
      switchTab('welcome');
    } else if (value) {
      switchTab('category', value);
    }
  });
}

function switchTab(tabType, categoryTitle = null) {
  // Update tab buttons
  const allTabs = document.querySelectorAll('.menu-tab');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });

  // Update mobile dropdown
  const dropdown = document.getElementById('categorySelectMobile');
  if (dropdown) {
    if (tabType === 'welcome') {
      dropdown.value = 'welcome';
    } else if (categoryTitle) {
      dropdown.value = categoryTitle;
    } else {
      dropdown.value = '';
    }
  }

  // Update tab panes
  const allPanes = document.querySelectorAll('.tab-pane');
  allPanes.forEach(pane => pane.classList.remove('active'));

  // Clear search input when switching tabs
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.value = '';
  }

  if (tabType === 'welcome') {
    // Activate welcome tab
    const welcomeTab = document.getElementById('tab-btn-welcome');
    if (welcomeTab) {
      welcomeTab.classList.add('active');
      welcomeTab.setAttribute('aria-selected', 'true');
    }
    const welcomePane = document.getElementById('tab-welcome');
    if (welcomePane) {
      welcomePane.classList.add('active');
    }
    currentCategory = null;
  } else if (tabType === 'category' && categoryTitle) {
    // Activate category tab
    const categoryTab = document.querySelector(`[data-category="${categoryTitle}"]`);
    if (categoryTab) {
      categoryTab.classList.add('active');
      categoryTab.setAttribute('aria-selected', 'true');
    }
    const categoryPane = document.getElementById('tab-category');
    if (categoryPane) {
      categoryPane.classList.add('active');
      currentCategory = categoryTitle;
      renderMenuItems(categoryTitle);
    }
  }
}

function setupWelcomeTabs() {
  const welcomeContent1 = document.getElementById('welcomeContent1');

  // Render all welcome content in one pane
  if (typeof createWelcomePage1 === 'function') {
    if (welcomeContent1) {
      welcomeContent1.innerHTML = createWelcomePage1();
    }
  }

  // Hide welcomeContent2 and welcomeContent3 as we're using single pane now
  const welcomeContent2 = document.getElementById('welcomeContent2');
  const welcomeContent3 = document.getElementById('welcomeContent3');
  if (welcomeContent2) welcomeContent2.style.display = 'none';
  if (welcomeContent3) welcomeContent3.style.display = 'none';
}

// Removed renderCategoryFilters - now using tabs instead

function getCategoryIcon(category) {
  const icons = {
    'MENÜS': '🍱',
    'VORSPEISEN': '🌶️',
    'SALATE': '🥗',
    'SUPPEN': '🍲',
    'MAKI': '🍣',
    'INSIDE OUT': '🍣',
    'CRUNCHY INSIDE OUT ROLLS': '🍣',
    'TEMAKI': '🌯',
    'SASHIMI': '🐟',
    'NIGIRI': '🍣'
  };
  return icons[category.toUpperCase()] || '🍽️';
}

function renderMenuItems(categoryTitle) {
  const category = MENU_DATA.find(cat => cat.title === categoryTitle);
  const itemsList = document.getElementById('menuItemsList');
  const categoryTitleEl = document.getElementById('currentCategoryTitle');
  const categoryHeroImage = document.getElementById('categoryHeroImage');

  if (!category || !itemsList) return;

  // Update category title
  if (categoryTitleEl) {
    let titleText = categoryTitle.toUpperCase();
    if (category.categorySubtitle) {
      titleText += ' ' + category.categorySubtitle;
    }
    categoryTitleEl.textContent = titleText;
  }

  // Set hero image (use first item's image or category default)
  if (categoryHeroImage) {
    const heroImageSrc = category.items[0]?.image || getItemImage(category.id, category.items[0]?.name) || 'assets/close-up-sushi-served-table 1.png';
    categoryHeroImage.innerHTML = `
      <div class="category-hero-image-wrapper">
        <img src="${heroImageSrc}" alt="${categoryTitle}">
        <div class="category-hero-overlay"></div>
        </div>
    `;
  }

  // Split items into two columns
  const items = category.items || [];

  // Group items by groupTitle if they have one
  const groupedItems = [];
  let currentGroup = null;
  let groupItems = [];

  items.forEach((item, index) => {
    if (item.groupTitle) {
      if (currentGroup !== item.groupTitle) {
        // Save previous group if exists
        if (currentGroup !== null && groupItems.length > 0) {
          groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
        }
        // Start new group
        currentGroup = item.groupTitle;
        groupItems = [item];
      } else {
        groupItems.push(item);
      }
    } else {
      // Save previous group if exists
      if (currentGroup !== null && groupItems.length > 0) {
        groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
        currentGroup = null;
        groupItems = [];
      }
      groupedItems.push({ type: 'item', item: item });
    }
  });

  // Save last group if exists
  if (currentGroup !== null && groupItems.length > 0) {
    groupedItems.push({ type: 'group', title: currentGroup, items: groupItems });
  }

  // Flatten grouped items back to array for column splitting
  const flatItems = [];
  groupedItems.forEach(group => {
    if (group.type === 'group') {
      flatItems.push({ type: 'group-header', title: group.title });
      group.items.forEach(item => flatItems.push({ type: 'item', item: item }));
    } else {
      flatItems.push(group);
    }
  });

  const midPoint = Math.ceil(flatItems.length / 2);
  const leftColumn = flatItems.slice(0, midPoint);
  const rightColumn = flatItems.slice(midPoint);

  // Get item numbers from names or use index
  const getItemNumber = (item, index) => {
    const nameMatch = item.name.match(/^(\d+)\./);
    return nameMatch ? parseInt(nameMatch[1]) : index + 1;
  };

  const renderItem = (entry, index) => {
    if (entry.type === 'group-header') {
      return `<div class="menu-group-title">${escapeHtml(entry.title)}</div>`;
    } else if (entry.type === 'item') {
      return createMenuItemCard(entry.item, getItemNumber(entry.item, index), category.id);
    }
    return '';
  };

  itemsList.innerHTML = `
    <div class="menu-items-column">
      ${leftColumn.map((entry, index) => renderItem(entry, index)).join('')}
      </div>
    <div class="menu-items-column">
      ${rightColumn.map((entry, index) => renderItem(entry, index + midPoint)).join('')}
      </div>
  `;
}

function createMenuItemCard(item, itemNumber, categoryId = '') {
  // Extract number from item name if it exists (e.g., "S1. Menü 1" -> "S1", "M1. Sake" -> "M1", "C1. Sake Crunchy" -> "C1", "Sa1. Sake" -> "Sa1", "N1. Sake" -> "N1", "P1. Leo Rolls" -> "P1", "Pa1. Sake Rolls" -> "Pa1", "F1. Maguro Aburi" -> "F1", "Te1. Maguro Temaki" -> "Te1", "01. Sake I.O" -> "01", "1. Mini Spring Roll" -> "1")
  const sushiMenuMatch = item.name.match(/^(S\d+)\.\s*(.+)$/);
  const makiMatch = item.name.match(/^(M\d+)\.\s*(.+)$/);
  const crunchyMatch = item.name.match(/^(C\d+)\.\s*(.+)$/); // For C1, C2, etc.
  const sashimiMatch = item.name.match(/^(Sa\d+)\.\s*(.+)$/); // For Sa1, Sa2, etc.
  const nigiriMatch = item.name.match(/^(N\d+)\.\s*(.+)$/); // For N1, N2, etc.
  const bigRollsMatch = item.name.match(/^(P\d+)\.\s*(.+)$/); // For P1, P2, etc.
  const miniRollsMatch = item.name.match(/^(Pa\d+)\.\s*(.+)$/); // For Pa1, Pa2, etc.
  const specialRollsMatch = item.name.match(/^(Sp\d+)\.\s*(.+)$/); // For Sp1, Sp2, etc.
  const fireNigiriMatch = item.name.match(/^(F\d+)\.\s*(.+)$/); // For F1, F2, etc.
  const temakiMatch = item.name.match(/^(Te\d+)\.\s*(.+)$/); // For Te1, Te2, etc.
  const dessertMatch = item.name.match(/^(D\d+)\.\s*(.+)$/); // For D1, D2, etc.
  const beilagenMatch = item.name.match(/^(B\d+)\.\s*(.+)$/); // For B1, B2, etc.
  const zeroPaddedMatch = item.name.match(/^(0\d+)\.\s*(.+)$/); // For 01, 02, etc.
  const regularMatch = item.name.match(/^(\d+)\.\s*(.+)$/);
  let displayNumber, displayName;

  if (sushiMenuMatch) {
    displayNumber = sushiMenuMatch[1]; // S1, S2, etc.
    displayName = sushiMenuMatch[2];
  } else if (makiMatch) {
    displayNumber = makiMatch[1]; // M1, M2, etc.
    displayName = makiMatch[2];
  } else if (crunchyMatch) {
    displayNumber = crunchyMatch[1]; // C1, C2, etc.
    displayName = crunchyMatch[2];
  } else if (sashimiMatch) {
    displayNumber = sashimiMatch[1]; // Sa1, Sa2, etc.
    displayName = sashimiMatch[2];
  } else if (nigiriMatch) {
    displayNumber = nigiriMatch[1]; // N1, N2, etc.
    displayName = nigiriMatch[2];
  } else if (bigRollsMatch) {
    displayNumber = bigRollsMatch[1]; // P1, P2, etc.
    displayName = bigRollsMatch[2];
  } else if (miniRollsMatch) {
    displayNumber = miniRollsMatch[1]; // Pa1, Pa2, etc.
    displayName = miniRollsMatch[2];
  } else if (specialRollsMatch) {
    displayNumber = specialRollsMatch[1]; // Sp1, Sp2, etc.
    displayName = specialRollsMatch[2];
  } else if (fireNigiriMatch) {
    displayNumber = fireNigiriMatch[1]; // F1, F2, etc.
    displayName = fireNigiriMatch[2];
  } else if (temakiMatch) {
    displayNumber = temakiMatch[1]; // Te1, Te2, etc.
    displayName = temakiMatch[2];
  } else if (dessertMatch) {
    displayNumber = dessertMatch[1]; // D1, D2, etc.
    displayName = dessertMatch[2];
  } else if (beilagenMatch) {
    displayNumber = beilagenMatch[1]; // B1, B2, etc.
    displayName = beilagenMatch[2];
  } else if (zeroPaddedMatch) {
    displayNumber = zeroPaddedMatch[1]; // 01, 02, etc.
    displayName = zeroPaddedMatch[2];
  } else if (regularMatch) {
    displayNumber = regularMatch[1];
    displayName = regularMatch[2];
  } else {
    displayNumber = itemNumber;
    displayName = item.name;
  }

  // Extract allergen codes if they exist in the name (e.g., "Menü 1 (A,D,F)" or "Mini Spring Roll (1,2,4,11,A)")
  const allergenMatch = displayName.match(/\(([A-Z0-9,]+)\)/);
  let allergenCodes = '';
  if (allergenMatch) {
    allergenCodes = allergenMatch[1];
    displayName = displayName.replace(/\s*\([A-Z0-9,]+\)\s*/, '').trim();
  }

  // Check if item has allergen property
  if (item.allergens) {
    allergenCodes = item.allergens;
  }

  // Build options HTML if item has sub-options (hidden by default)
  let optionsHTML = '';
  if (item.hasOptions && item.options && item.options.length > 0) {
    const uniqueId = `options-${itemNumber}-${Math.random().toString(36).substr(2, 9)}`;
    optionsHTML = `
      <div class="menu-item-options" id="${uniqueId}" style="display: none;">
        ${item.options.map(option => `
          <div class="menu-item-option" onclick="event.stopPropagation(); window.openAddToCartModal('${(item.name + ' - ' + option.name).replace(/'/g, "\\'")}', '${option.price}', '${(item.desc || '').replace(/'/g, "\\'")}')">
            <span class="option-name">${escapeHtml(option.name)}</span>
            ${option.vegetarian ? '<span class="vegetarian-icon">🌿</span>' : ''}
            <span class="option-price">€${option.price}</span>
    </div>
        `).join('')}
      </div>
    `;
  }

  // Build description HTML - use bullet points if useBulletPoints is true
  let descriptionHTML = '';
  if (item.desc) {
    if (item.useBulletPoints) {
      // Split description by commas and create bullet points
      // Handle cases like "6 Nigiri: Sake, Maguro..." - keep the prefix before colon
      let items = [];
      let prefix = '';
      let hasColon = item.desc.includes(':');

      if (hasColon) {
        const parts = item.desc.split(':');
        prefix = parts[0].trim();
        const rest = parts.slice(1).join(':').trim();
        if (rest) {
          const subItems = rest.split(',').map(s => s.trim()).filter(s => s);
          items = [prefix + ':', ...subItems];
        } else {
          items = [item.desc];
        }
      } else {
        items = item.desc.split(',').map(s => s.trim()).filter(s => s);
      }

      // Check if descEn has the same prefix to avoid duplication
      let itemsEn = [];
      let prefixEn = '';
      if (item.descEn) {
        if (item.descEn.includes(':')) {
          const partsEn = item.descEn.split(':');
          prefixEn = partsEn[0].trim();
          const restEn = partsEn.slice(1).join(':').trim();
          if (restEn) {
            const subItemsEn = restEn.split(',').map(s => s.trim()).filter(s => s);
            itemsEn = [prefixEn + ':', ...subItemsEn];
          } else {
            itemsEn = [item.descEn];
          }
        } else {
          itemsEn = item.descEn.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      // If prefixes are the same, merge the lists to avoid duplication
      if (hasColon && item.descEn && prefix === prefixEn) {
        // Extract only the sub-items from both lists (skip the prefix line)
        const subItems = items.slice(1); // Skip the prefix line
        const subItemsEn = itemsEn.slice(1); // Skip the prefix line

        // Combine unique items (prefer German version if duplicate)
        const combinedItems = [...subItems];
        subItemsEn.forEach(itemEn => {
          // Only add if not already in the list (case-insensitive comparison)
          const exists = combinedItems.some(item =>
            item.toLowerCase() === itemEn.toLowerCase()
          );
          if (!exists) {
            combinedItems.push(itemEn);
          }
        });

        descriptionHTML = `
          <ul class="menu-item-bullet-list">
            <li>${escapeHtml(prefix + ':')}</li>
            ${combinedItems.map(itemText => `<li>${escapeHtml(itemText)}</li>`).join('')}
          </ul>
        `;
      } else {
        // Normal rendering - show both lists separately
        descriptionHTML = `
          <ul class="menu-item-bullet-list">
            ${items.map(itemText => `<li>${escapeHtml(itemText)}</li>`).join('')}
          </ul>
        `;

        if (item.descEn && itemsEn.length > 0) {
          descriptionHTML += `
            <ul class="menu-item-bullet-list">
              ${itemsEn.map(itemText => `<li>${escapeHtml(itemText)}</li>`).join('')}
            </ul>
          `;
        }
      }
    } else {
      descriptionHTML = `<p class="menu-item-description">${escapeHtml(item.desc)}</p>`;
      // If there's an English version, add it below
      if (item.descEn) {
        descriptionHTML += `<p class="menu-item-description menu-item-description-en">${escapeHtml(item.descEn)}</p>`;
      }
    }
  }

  const uniqueCardId = `card-${itemNumber}-${Math.random().toString(36).substr(2, 9)}`;
  let optionsId = '';
  if (item.hasOptions && item.options && item.options.length > 0) {
    // Extract the ID from the optionsHTML we just created
    const match = optionsHTML.match(/id="([^"]+)"/);
    if (match) {
      optionsId = match[1];
    }
  }

  return `
    <div class="menu-item-card ${item.hasOptions ? 'has-options' : ''}" id="${uniqueCardId}" data-options-id="${optionsId}" onclick="${item.hasOptions ? `toggleMenuOptions('${optionsId}', '${uniqueCardId}')` : `window.openAddToCartModal('${item.name.replace(/'/g, "\\'")}', '${item.price}', '${(item.desc || '').replace(/'/g, "\\'")}')`}">
      <div class="menu-item-number">${displayNumber}</div>
      <div class="menu-item-content">
        <div class="menu-item-header">
          <div class="menu-item-name-wrapper">
            <h3 class="menu-item-name">${escapeHtml(displayName)}</h3>
            ${allergenCodes ? `<span class="menu-item-allergens">(${allergenCodes})</span>` : ''}
            ${item.vegetarian ? '<span class="menu-item-vegetarian-icon">🌿</span>' : ''}
          </div>
          ${!item.hasOptions ? `<div class="menu-item-price">€${item.price}</div>` : ''}
        </div>
        ${item.quantity ? `<div class="menu-item-quantity">${escapeHtml(item.quantity)}</div>` : ''}
        ${descriptionHTML}
        ${optionsHTML}
      </div>
    </div>
  `;
}

function setupMenuBook() {
  const menuLink = document.getElementById('menuLink');
  const heroMenuLink = document.getElementById('heroMenuLink');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');
  const menuBookClose = document.getElementById('menuBookClose');
  const bookPrevBtn = document.getElementById('bookPrevBtn');
  const bookNextBtn = document.getElementById('bookNextBtn');
  const overlay = document.getElementById('menuBookOverlay');

  // Links now point to menu.html, no need to prevent default

  if (fixedOrderBtn) {
    // Check if we're on index page (not menu page)
    const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog') || document.getElementById('menuOrderPage');
    const isApp = document.body.classList.contains('is-capacitor-app');

    if (isApp) {
      // Hide on App
      fixedOrderBtn.style.setProperty('display', 'none', 'important');
      fixedOrderBtn.style.setProperty('visibility', 'hidden', 'important');
      fixedOrderBtn.style.setProperty('opacity', '0', 'important');
      fixedOrderBtn.style.setProperty('pointer-events', 'none', 'important');
    } else if (!isMenuPage) {
      // On index page: navigate to menu page
      fixedOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'catalog';
      });
    }
    // On menu page, the button is handled by setupCart()
  }

  // Close menu order page
  document.addEventListener('click', (e) => {
    const menuOrderPage = document.getElementById('menuOrderPage');
    if (menuOrderPage && e.target === menuOrderPage) {
      closeMenuOrderPage();
    }
  });

  // Search functionality
  const menuSearchInput = document.getElementById('menuSearchInput');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      if (searchTerm) {
        // Switch to category tab for search results
        const categoryPane = document.getElementById('tab-category');
        if (categoryPane && !categoryPane.classList.contains('active')) {
          // Find first category tab and activate it
          const firstCategoryTab = document.querySelector('.menu-tab[data-tab="category"]');
          if (firstCategoryTab) {
            const categoryTitle = firstCategoryTab.dataset.category;
            switchTab('category', categoryTitle);
          }
        }

        // Search in all items
        const filteredItems = allMenuItemsFlat.filter(item =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.desc && item.desc.toLowerCase().includes(searchTerm))
        );

        const itemsList = document.getElementById('menuItemsList');
        const categoryTitleEl = document.getElementById('currentCategoryTitle');

        if (categoryTitleEl) {
          categoryTitleEl.textContent = `SUCHERGEBNISSE (${filteredItems.length})`;
        }

        // Hide hero image for search results
        const categoryHeroImage = document.getElementById('categoryHeroImage');
        if (categoryHeroImage) {
          categoryHeroImage.style.display = 'none';
        }

        if (itemsList) {
          if (filteredItems.length === 0) {
            itemsList.innerHTML = `
              <div style="text-align: center; padding: 60px 20px; color: rgba(233,233,236,0.6); grid-column: 1 / -1;">
                <p style="font-size: 18px; margin-bottom: 12px;">Keine Ergebnisse gefunden</p>
                <p style="font-size: 14px;">Versuchen Sie es mit anderen Suchbegriffen</p>
                </div>
            `;
          } else {
            // Split search results into two columns
            const midPoint = Math.ceil(filteredItems.length / 2);
            const leftColumn = filteredItems.slice(0, midPoint);
            const rightColumn = filteredItems.slice(midPoint);

            const getItemNumber = (item, index) => {
              const nameMatch = item.name.match(/^(\d+)\./);
              return nameMatch ? parseInt(nameMatch[1]) : index + 1;
            };

            itemsList.innerHTML = `
              <div class="menu-items-column">
                ${leftColumn.map((item, index) => createMenuItemCard(item, getItemNumber(item, index))).join('')}
              </div>
              <div class="menu-items-column">
                ${rightColumn.map((item, index) => createMenuItemCard(item, getItemNumber(item, midPoint + index))).join('')}
              </div>
            `;
          }
        }
      } else {
        // Reset to current category or welcome tab
        const welcomeTab = document.getElementById('tab-btn-welcome');
        if (welcomeTab && welcomeTab.classList.contains('active')) {
          // Stay on welcome tab
          return;
        }

        // Show hero image again
        const categoryHeroImage = document.getElementById('categoryHeroImage');
        if (categoryHeroImage) {
          categoryHeroImage.style.display = 'block';
        }

        if (currentCategory) {
          renderMenuItems(currentCategory);
        } else if (MENU_DATA.length > 0) {
          // Switch to first category
          switchTab('category', MENU_DATA[0].title);
        }
      }
    });
  }

  // Old menu book code (kept for reference)
  if (menuBookClose) menuBookClose.addEventListener('click', closeMenuBook);
  if (bookPrevBtn) bookPrevBtn.addEventListener('click', prevBookPage);
  if (bookNextBtn) bookNextBtn.addEventListener('click', nextBookPage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (overlay && overlay.classList.contains('active')) {
      if (e.key === 'ArrowLeft') prevBookPage();
      if (e.key === 'ArrowRight') nextBookPage();
      if (e.key === 'Escape') closeMenuBook();
    }
    const menuOrderPage = document.getElementById('menuOrderPage');
    if (menuOrderPage && menuOrderPage.classList.contains('active')) {
      if (e.key === 'Escape') closeMenuOrderPage();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMenuTabs();
  // Default to first category
  renderMenuList(MENU_DATA[0]?.id);
  setupMenuSearch();
  setupGallery();
  setupCart();
  setupReviews();
  setupReservationForm();
  setupAnimations();
  setupFooter();
  setupMenuBook();
  // Update cart UI to show fixed order button
  updateCartUI();
  // Setup intro screen first
  setupIntroScreen();
});

// Setup footer year
function setupFooter() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Setup table selection listeners
function setupTableSelectionListeners() {
  const dateInput = document.getElementById('reserveDate');
  const timeInput = document.getElementById('reserveTime');

  const updateTableSelection = async () => {
    const date = dateInput?.value;
    const time = timeInput?.value;
    if (date && time) {
      await renderTableSelection(date, time);
    }
  };

  if (dateInput) {
    dateInput.addEventListener('change', updateTableSelection);
  }

  if (timeInput) {
    timeInput.addEventListener('change', updateTableSelection);
  }
}

// Setup reservation form
function setupReservationForm() {
  const dateInput = document.getElementById('reserveDate');
  if (dateInput) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Setup overlay click to close
  const overlay = document.getElementById('reservationOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeReservationModal);
  }

  // Setup Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('reservationModal');
      if (modal && modal.style.display === 'flex') {
        closeReservationModal();
      }
    }
  });

  // Setup table selection listeners
  setupTableSelectionListeners();
}

// Gallery scroller & lightbox
function setupGallery() {
  const scroller = document.getElementById('galleryScroller');
  if (!scroller) return;

  const images = [
    { src: "assets/close-up-sushi-served-table 1.png", alt: "Sushi Auswahl" },
    { src: "assets/bua-tiec-shushi.png", alt: "Sushi Teller" },
    { src: "assets/474747577_583620977982257_5069519367255368765_n.jpg", alt: "Warme Speise" },
    { src: "assets/498665275_17863755624399871_7773501872179564451_n 1.png", alt: "Set Menu" },
    { src: "assets/526755952_122145800660617493_8652643431098218812_n.jpg", alt: "Detail 1" },
    { src: "assets/107321305_156996452705031_5135397567937722939_n.jpg", alt: "Detail 2" },
    { src: "assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.jpg", alt: "Signature Roll" },
    { src: "assets/banh-mi-shushi.png", alt: "Nigiri" },
    { src: "assets/sake-poke-bowl-with-rice-or-salad.png", alt: "Poke Bowl" },
    { src: "assets/474145891_579480641729624_2668845756094693673_n.jpg", alt: "Dessert" },
    { src: "assets/678a39d1596da842cc63c03c 1.png", alt: "Ambiente 1" },
    { src: "assets/dsc06551_master.jpg", alt: "Ambiente 2" },
    { src: "assets/10 3498178 1.png", alt: "Ambiente 3" },
    { src: "assets/477094040_943569787952278_5086544566261599514_n.jpg", alt: "Chef Special" },
    { src: "assets/salat_mit_garnelen_88520.jpg", alt: "Platte" }
  ];

  const track = document.createElement('div');
  track.className = 'gallery-track';

  // Create images and duplicate for infinite scroll
  [...images, ...images].forEach(imgData => {
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    track.appendChild(img);
  });
  scroller.appendChild(track);

  // Lightbox functionality
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightImg');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');
  let currentIdx = 0;

  function open(idx) {
    currentIdx = idx % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
      lb?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function close() {
    lb?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function next() {
    currentIdx = (currentIdx + 1) % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
    }
  }

  function prev() {
    currentIdx = (currentIdx - 1 + images.length) % images.length;
    if (lbImg && images[currentIdx]) {
      lbImg.src = images[currentIdx].src;
      lbImg.alt = images[currentIdx].alt;
    }
  }

  track.querySelectorAll('img').forEach((img, idx) => {
    // Map index to original images array (since we duplicate images)
    const originalIdx = idx % images.length;
    img.addEventListener('click', () => open(originalIdx));
  });

  btnClose?.addEventListener('click', close);
  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);
  lb?.addEventListener('click', (e) => { if (e.target === lb) close(); });

  window.addEventListener('keydown', (e) => {
    if (lb?.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}

// Reviews from Google Places API
// Setup instructions:
// 1. Get Google Places API key from: https://console.cloud.google.com/google/maps-apis
// 2. Enable "Places API" in your Google Cloud Console
// 3. Find your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
// 4. Replace the values below:
// GOOGLE_PLACES_CONFIG is now in js/config.js
// const GOOGLE_PLACES_CONFIG = {
//   apiKey: '', // Your Google Places API key
//   placeId: '', // Your Google Place ID (e.g., 'ChIJN1t_tDeuEmsRUsoyG83frY4')
//   useAPI: false // Set to true when you have API key configured
// };

// Fallback reviews (displayed if API is not configured)
// You can add more reviews here or update them later when connecting to Google API
// FALLBACK_REVIEWS is now in js/config.js
/*
const FALLBACK_REVIEWS = [
  {
    author_name: 'ZMalle2000',
    rating: 5,
    text: 'Sehr nices vietnamesisches japanisches Restaurant – schnelle, freundliche Bedienung, leckeres Essen.',
    time: Date.now()
  },
  {
    author_name: 'Niko',
    rating: 5,
    text: 'Sehr sehr lecker und super netter Service. Erdbeer Lassi: wow. Geheimtipp!',
    time: Date.now()
  },
  {
    author_name: 'Sara K',
    rating: 5,
    text: 'Schöne Auswahl, hübsch angerichtet, faire Preise – ein Kieztreffpunkt.',
    time: Date.now()
  }
];
*/

async function setupReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  // Fetch reviews from database (customer reviews)
  await fetchCustomerReviews();
}

async function fetchCustomerReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  try {
    // Fetch reviews from database
    if (window.api && window.api.reviews) {
      const response = await window.api.reviews.list(3, 'approved');

      if (response.success && response.reviews && response.reviews.length > 0) {
        // Transform database reviews to match renderReviews format
        const formattedReviews = response.reviews.map(review => ({
          author_name: review.author_name || 'Anonym',
          author_initial: review.author_initial || '?',
          rating: review.rating || 5,
          text: review.text || review.comment || '',
          review: review.comment || review.text || '',
          created_at: review.created_at
        }));

        renderReviews(formattedReviews);

        // Update stats badge
        updateReviewStats();
      } else {
        // No reviews yet, show empty state
        showEmptyReviews();
      }
    } else {
      console.error('Reviews API not available');
      showEmptyReviews();
    }
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    showEmptyReviews();
  }
}

async function updateReviewStats() {
  try {
    if (window.api && window.api.reviews) {
      const statsResponse = await window.api.reviews.stats();

      if (statsResponse.success && statsResponse.stats) {
        const stats = statsResponse.stats;

        // Update stats badge
        const statNumber = document.querySelector('.stat-number');
        const statValue = document.querySelector('.stat-value');

        if (statNumber) {
          statNumber.textContent = stats.average_rating || '4.9';
        }

        if (statValue) {
          statValue.textContent = (stats.approved || 0) + '+';
        }
      }
    }
  } catch (error) {
    console.error('Error updating review stats:', error);
  }
}

function showEmptyReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.6);">
      <div style="font-size: 48px; margin-bottom: 20px;">💬</div>
      <h3 style="color: var(--gold); margin-bottom: 10px; font-size: 24px;">Noch keine Bewertungen</h3>
      <p style="font-size: 16px;">Seien Sie der Erste, der eine Bewertung hinterlässt!</p>
    </div>
  `;
}

function renderReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  container.innerHTML = '';

  // Show only first 3 reviews for grid layout
  const reviewsToShow = reviews.slice(0, 3);

  reviewsToShow.forEach((review, index) => {
    const card = document.createElement('blockquote');
    card.className = 'review-card';
    card.style.opacity = '0';
    card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;

    const authorInitial = review.author_initial || (review.author_name ? review.author_name.charAt(0).toUpperCase() : '?');
    const stars = '⭐'.repeat(review.rating || 5);
    const reviewText = review.text || review.review || '';

    // Format date if available
    let dateText = '';
    if (review.created_at) {
      const date = new Date(review.created_at);
      dateText = date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    card.innerHTML = `
      <div class="quote-icon">"</div>
      <div class="review-stars">${stars}</div>
      <p class="review-text">${reviewText}</p>
      <div class="review-author">
        <div class="author-avatar">${authorInitial}</div>
        <div>
          <strong>${review.author_name || 'Anonym'}</strong>
          <span>${dateText ? 'Kunde • ' + dateText : 'Kunde'}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Add fade-in animation
  if (!document.getElementById('reviewFadeInStyle')) {
    const style = document.createElement('style');
    style.id = 'reviewFadeInStyle';
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Table management system - 16 tables, 30 minutes per reservation
// TOTAL_TABLES and RESERVATION_DURATION_MINUTES are now declared in js/config.js
// const TOTAL_TABLES = 16;
// const RESERVATION_DURATION_MINUTES = 30;

// Get available tables for a specific date and time
// Get available tables for a specific date and time (from Firebase - primary source)
async function getAvailableTables(date, time) {
  if (!date || !time) return [];

  const reservationDateTime = new Date(`${date}T${time}`);
  const reservationEndTime = new Date(reservationDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

  // Get reservations from Firebase (primary source - syncs across all devices)
  let reservations = [];
  const dbInstance = getDb();
  if (dbInstance && typeof getAllReservationsFromFirebase === 'function') {
    try {
      reservations = await getAllReservationsFromFirebase(date) || [];
    } catch (e) {
      console.error('Error loading reservations from Firebase:', e);
      // Fallback to empty array if Firebase fails
      reservations = [];
    }
  }

  // Get all tables (1-16)
  const allTables = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1);

  // Filter out tables that are reserved during this time slot
  const reservedTables = reservations
    .filter(res => {
      if (!res.tableNumber) return false;
      const resDateTime = new Date(`${res.date}T${res.time}`);
      const resEndTime = new Date(resDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

      // Check if time slots overlap
      return (reservationDateTime < resEndTime && reservationEndTime > resDateTime);
    })
    .map(res => res.tableNumber);

  return allTables.filter(table => !reservedTables.includes(table));
}

// Get table status for a specific date and time (from Firebase - primary source)
async function getTableStatus(date, time) {
  if (!date || !time) {
    return Array.from({ length: TOTAL_TABLES }, (_, i) => ({
      number: i + 1,
      status: 'available'
    }));
  }

  const reservationDateTime = new Date(`${date}T${time}`);
  const reservationEndTime = new Date(reservationDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

  // Get reservations from Firebase (primary source - syncs across all devices)
  let reservations = [];
  const dbInstance = getDb();
  if (dbInstance && typeof getAllReservationsFromFirebase === 'function') {
    try {
      reservations = await getAllReservationsFromFirebase(date) || [];
    } catch (e) {
      console.error('Error loading reservations from Firebase:', e);
      // Fallback to empty array if Firebase fails
      reservations = [];
    }
  }

  const tableStatus = Array.from({ length: TOTAL_TABLES }, (_, i) => {
    const tableNumber = i + 1;
    const tableReservations = reservations.filter(res => res.tableNumber === tableNumber);

    const isReserved = tableReservations.some(res => {
      const resDateTime = new Date(`${res.date}T${res.time}`);
      const resEndTime = new Date(resDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);
      return (reservationDateTime < resEndTime && reservationEndTime > resDateTime);
    });

    return {
      number: tableNumber,
      status: isReserved ? 'reserved' : 'available'
    };
  });

  return tableStatus;
}

// Render table selection UI
async function renderTableSelection(date, time, containerId = 'tableSelectionContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show loading state
  container.innerHTML = '<p style="color: rgba(255,255,255,.7); text-align: center; padding: 20px;">Tische werden geladen...</p>';

  const tableStatus = await getTableStatus(date, time);
  const availableTables = await getAvailableTables(date, time);

  // Determine which select function to use based on container
  const isReservationInPayment = containerId === 'reservationTableSelectionContainer';
  const selectFunction = isReservationInPayment ? 'selectTable' : 'selectTable';
  const gridId = isReservationInPayment ? 'reservationTableGrid' : 'tableGrid';
  const inputId = isReservationInPayment ? 'selectedTable' : 'selectedTable';

  container.innerHTML = `
    <div class="table-selection-header">
      <h4>Bitte wählen Sie einen Tisch</h4>
      <div class="table-legend">
        <span class="legend-item"><span class="legend-color available"></span> Verfügbar</span>
        <span class="legend-item"><span class="legend-color reserved"></span> Reserviert</span>
      </div>
    </div>
    <div class="table-grid" id="${gridId}">
      ${tableStatus.map(table => `
        <button 
          type="button"
          class="table-btn ${table.status} ${availableTables.includes(table.number) ? 'selectable' : ''}"
          data-table="${table.number}"
          ${!availableTables.includes(table.number) ? 'disabled' : ''}
          onclick="selectTable(${table.number})"
        >
          <span class="table-number">${table.number}</span>
          <span class="table-status">${table.status === 'available' ? '✓' : '✗'}</span>
        </button>
      `).join('')}
    </div>
    <input type="hidden" id="${inputId}" name="${inputId}" value="">
  `;
}

// Note: Table selection for orders removed - admin will assign tables manually

// Select table
function selectTable(tableNumber) {
  const selectedTableInput = document.getElementById('selectedTable');
  if (selectedTableInput) {
    selectedTableInput.value = tableNumber;
  }

  // Update UI
  document.querySelectorAll('.table-btn.selectable').forEach(btn => {
    btn.classList.remove('selected');
  });

  const selectedBtn = document.querySelector(`.table-btn[data-table="${tableNumber}"]`);
  if (selectedBtn && selectedBtn.classList.contains('selectable')) {
    selectedBtn.classList.add('selected');
  }
}

// Make selectTable globally available
window.selectTable = selectTable;

// Open reservation modal
// NOTE: This function is overridden by js/reservation.js
// js/reservation.js exposes window.openReservationModal which should be used instead
// This function is kept here only as a fallback if reservation.js is not loaded
// DO NOT call window.openReservationModal from here to avoid infinite recursion
// DO NOT expose this to window if reservation.js has already set it
function openReservationModal() {
  // IMPORTANT: If reservation.js has already set window.openReservationModal,
  // we should NOT define this function or it will cause conflicts.
  // Since script.js is loaded AFTER reservation.js, we check if it exists first.
  // If it exists, we simply don't define this function at all.
  // This check happens at module load time, not at function call time.

  // At function call time, if we're here, it means either:
  // 1. reservation.js didn't load, OR
  // 2. This function was called directly (not via window.openReservationModal)
  // In either case, we should NOT call window.openReservationModal to avoid recursion.

  console.log('⚠️ openReservationModal in script.js called. This should not happen if reservation.js is loaded.');
  console.log('⚠️ window.openReservationModal exists?', typeof window.openReservationModal);

  // If window.openReservationModal exists and is different from this function, 
  // it means reservation.js loaded. We should NOT proceed.
  // Store reference to this function to compare
  const thisFunction = openReservationModal;
  if (window.openReservationModal && window.openReservationModal !== thisFunction) {
    console.error('❌ ERROR: openReservationModal in script.js called, but reservation.js version exists!');
    console.error('❌ This should not happen. Please check script loading order.');
    return;
  }

  const modal = document.getElementById('reservationModal');
  const overlay = document.getElementById('reservationOverlay');
  if (!modal || !overlay) {
    console.error('❌ reservationModal or reservationOverlay not found');
    return;
  }

  // Ensure payment modal is closed
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    paymentModal.style.display = 'none';
    paymentModal.style.opacity = '0';
    paymentModal.style.visibility = 'hidden';
  }

  // Set min date to today
  const dateInput = document.getElementById('reserveDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Clear selected table
  const selectedTableInput = document.getElementById('selectedTable');
  if (selectedTableInput) {
    selectedTableInput.value = '';
  }

  // Load reservation cart items
  if (typeof updateReservationCartDisplay === 'function') {
    updateReservationCartDisplay();
  }

  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '0';
  modal.style.zIndex = '10001';
  overlay.classList.add('active');
  overlay.style.display = 'block';
  overlay.style.zIndex = '10000';
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  // Setup date/time change listeners to update table selection
  if (typeof setupTableSelectionListeners === 'function') {
    setupTableSelectionListeners();
  }
}

// IMPORTANT: Only expose openReservationModal to window if reservation.js hasn't already done so
// This prevents script.js from overriding the correct version from reservation.js
if (!window.openReservationModal) {
  window.openReservationModal = openReservationModal;
  console.log('⚠️ script.js: Exposed openReservationModal to window (fallback only)');
} else {
  console.log('✅ script.js: window.openReservationModal already exists (from reservation.js), not overriding');
}

// Open menu page for reservation (in new tab or same window)
function openMenuForReservation() {
  // Store flag to indicate we're selecting items for reservation
  localStorage.setItem('leoSelectingForReservation', 'true');

  // Close reservation modal temporarily
  closeReservationModal();

  // Open menu page
  if (window.location.pathname.includes('menu') || window.location.pathname.includes('catalog')) {
    // Already on menu page, just scroll to menu
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Navigate to menu page
    window.location.href = 'catalog';
  }
}

// Update reservation cart display
function updateReservationCartDisplay() {
  const container = document.getElementById('reservationCartItems');
  if (!container) return;

  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');

  if (reservationCart.length === 0) {
    container.innerHTML = '<p style="color: rgba(255,255,255,.5); text-align: center; padding: 10px;">Noch keine Gerichte ausgewählt</p>';
    return;
  }

  let total = 0;
  container.innerHTML = reservationCart.map((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,.05); border-radius: 6px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${item.name}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,.6);">Số lượng: ${item.qty} x €${item.price}</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
          <div style="font-weight: 600; color: var(--gold);">€${itemTotal.toFixed(2)}</div>
          <button onclick="removeFromReservationCart(${index})" style="margin-top: 4px; padding: 4px 8px; background: rgba(239,68,68,.2); border: 1px solid rgba(239,68,68,.3); color: #ef4444; border-radius: 4px; cursor: pointer; font-size: 11px;">Xóa</button>
        </div>
      </div>
    `;
  }).join('') + `
    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.1); display: flex; justify-content: space-between; font-weight: 600; color: var(--gold);">
      <span>Tổng:</span>
      <span>€${total.toFixed(2)}</span>
    </div>
  `;
}

// Remove item from reservation cart
function removeFromReservationCart(index) {
  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
  reservationCart.splice(index, 1);
  localStorage.setItem('leoReservationCart', JSON.stringify(reservationCart));
  updateReservationCartDisplay();
}

// Make functions globally available
window.openMenuForReservation = openMenuForReservation;
window.removeFromReservationCart = removeFromReservationCart;

// Close reservation modal
function closeReservationModal() {
  const modal = document.getElementById('reservationModal');
  const overlay = document.getElementById('reservationOverlay');
  if (!modal || !overlay) return;

  modal.style.opacity = '0';
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Handle reservation form submission
async function handleReservation(event) {
  event.preventDefault();

  const firstName = document.getElementById('reserveFirstName')?.value.trim();
  const lastName = document.getElementById('reserveLastName')?.value.trim();
  const phone = document.getElementById('reservePhone')?.value.trim();
  const email = document.getElementById('reserveEmail')?.value.trim();
  const date = document.getElementById('reserveDate')?.value;
  const time = document.getElementById('reserveTime')?.value;
  const guests = document.getElementById('reserveGuests')?.value;
  const note = document.getElementById('reserveNote')?.value.trim();
  // Table selection removed - admin will assign tables manually

  // Validate
  if (!firstName || !lastName || !phone || !email || !date || !time || !guests) {
    alert('Bitte füllen Sie alle Pflichtfelder aus.');
    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    return;
  }

  // Validate phone (more flexible - accepts various formats)
  const phoneClean = phone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
  const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
  if (!phoneRegex.test(phoneClean)) {
    alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
    return;
  }

  // Generate unique reservation ID
  const reservationId = `RES-${Date.now()}`;
  const reservationTimestamp = new Date().toISOString();

  // Get selected items from reservation cart
  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');

  // Prepare reservation data
  const reservationData = {
    reservationId: reservationId,
    status: 'pending', // pending, confirmed, cancelled
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
    date: date,
    time: time,
    guests: parseInt(guests),
    tableNumber: null, // Admin will assign table manually
    note: note || '',
    items: reservationCart, // Include selected items
    timestamp: reservationTimestamp,
    createdAt: reservationTimestamp
  };

  // Get customer code from reservation form if entered
  const reservationCustomerCode = document.getElementById('reservationCustomerCode')?.value.trim() || null;

  // Save customer information for future orders (and get customer code)
  let savedCustomerInfo = null;
  if (typeof window.saveCustomerInfo === 'function') {
    savedCustomerInfo = await window.saveCustomerInfo({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      street: '',
      postal: '',
      city: '',
      note: note || '',
      customerCode: reservationCustomerCode // Include customer code if entered
    });
  }

  // Get final customer code
  const finalCustomerCode = savedCustomerInfo?.customerCode || reservationCustomerCode || null;

  // Store customer code in reservation data if available
  if (finalCustomerCode) {
    reservationData.customerCode = finalCustomerCode;
  }

  // If there are items, create an order linked to this reservation
  if (reservationCart.length > 0) {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      order_id: orderId,
      status: 'pending',
      service_type: 'pickup',
      table_number: null, // Admin will assign table manually
      reservation_id: reservationId,
      items: reservationCart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
        description: item.desc || '',
        note: item.note || '',
        total: (item.price * item.qty).toFixed(2)
      })),
      delivery: {
        address: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          street: '',
          postal: '',
          city: '',
          note: note || '',
          customerCode: finalCustomerCode // Include customer code in delivery address
        },
        fee: '0.00'
      },
      customerCode: finalCustomerCode, // Also store at root level for easy access
      summary: {
        item_count: reservationCart.reduce((sum, item) => sum + item.qty, 0),
        subtotal: reservationCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2),
        delivery_fee: '0.00',
        total: reservationCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2),
        payment_method: 'cash', // Default for reservation
        timestamp: reservationTimestamp
      },
      createdAt: reservationTimestamp
    };

    // Save order
    saveOrderToDailyReport(orderData);

    // Clear reservation cart and flag
    localStorage.removeItem('leoReservationCart');
    localStorage.removeItem('leoSelectingForReservation');
  } else {
    // Clear flag if no items
    localStorage.removeItem('leoSelectingForReservation');
  }

  // Save reservation to daily list
  saveReservationToDailyReport(reservationData);

  // Send confirmation emails
  sendReservationEmail(reservationData);
  sendReservationConfirmationEmail(reservationData);

  // Generate and show reservation confirmation
  // Reservation confirmation - only send email, no print bill
  // showReservationConfirmation removed

  // Close modal
  closeReservationModal();

  // Reset form
  event.target.reset();
}

// Make functions globally available
window.handleReservation = handleReservation;
// DO NOT override openReservationModal - reservation.js should handle it
// Only set if it doesn't exist (fallback only)
if (!window.openReservationModal) {
  window.openReservationModal = openReservationModal;
  console.log('⚠️ script.js: Setting openReservationModal as fallback');
} else {
  console.log('✅ script.js: openReservationModal already exists from reservation.js, not overriding');
}
// Only set closeReservationModal if it doesn't exist
if (!window.closeReservationModal) {
  window.closeReservationModal = closeReservationModal;
}

// Setup decorative animations for all sections
function setupAnimations() {
  // Hero Section - Sparkles and Particles
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle decorative-element';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 3 + 's';
      heroSection.appendChild(sparkle);
    }

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle decorative-element';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 5 + 's';
      heroSection.appendChild(particle);
    }
  }

  // Menu Section - Butterflies
  const menuSection = document.querySelector('.menu-section');
  if (menuSection) {
    const butterflyEmojis = ['🦋', '🦋', '🦋', '🦋', '🦋'];
    butterflyEmojis.forEach((emoji, index) => {
      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly decorative-element';
      butterfly.textContent = emoji;
      butterfly.style.top = (20 + index * 15) + '%';
      menuSection.style.position = 'relative';
      menuSection.appendChild(butterfly);
    });
  }

  // Gallery Section - Falling Leaves
  const gallerySection = document.querySelector('.gallery');
  if (gallerySection) {
    const leafEmojis = ['🍃', '🍂', '🌿', '🍃'];
    leafEmojis.forEach((emoji, index) => {
      const leaf = document.createElement('div');
      leaf.className = 'leaf decorative-element';
      leaf.textContent = emoji;
      gallerySection.style.position = 'relative';
      gallerySection.style.overflow = 'hidden';
      gallerySection.appendChild(leaf);
    });
  }

  // About Section - Waves and Flowers
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    // Waves
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'wave decorative-element';
      wave.style.left = (30 + i * 20) + '%';
      wave.style.top = '50%';
      aboutSection.style.position = 'relative';
      aboutSection.appendChild(wave);
    }

    // Flowers
    const flowerEmojis = ['🌸', '🌺', '🌼'];
    flowerEmojis.forEach((emoji, index) => {
      const flower = document.createElement('div');
      flower.className = 'flower decorative-element';
      flower.textContent = emoji;
      flower.style.top = (30 + index * 20) + '%';
      aboutSection.appendChild(flower);
    });
  }

  // Reviews Section - Twinkling Stars
  const reviewsSection = document.querySelector('.reviews');
  if (reviewsSection) {
    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      star.className = 'star decorative-element';
      star.textContent = '⭐';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      reviewsSection.style.position = 'relative';
      reviewsSection.appendChild(star);
    }
  }

  // Contact Section - Floating Bubbles
  const contactSection = document.querySelector('.contact');
  if (contactSection) {
    for (let i = 0; i < 3; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble decorative-element';
      contactSection.style.position = 'relative';
      contactSection.style.overflow = 'hidden';
      contactSection.appendChild(bubble);
    }
  }
}

// Toggle menu options visibility
function toggleMenuOptions(optionsId, cardId) {
  const optionsEl = document.getElementById(optionsId);
  const cardEl = document.getElementById(cardId);
  if (!optionsEl || !cardEl) return;

  const isVisible = optionsEl.style.display !== 'none';

  if (isVisible) {
    optionsEl.style.display = 'none';
    cardEl.classList.remove('options-expanded');
  } else {
    optionsEl.style.display = 'block';
    cardEl.classList.add('options-expanded');
  }
}

// Service type (Abholung/Lieferung/Reservation)
// selectedServiceType is now declared in js/payment.js
// let selectedServiceType = 'delivery'; // 'delivery', 'pickup', or 'reservation'

// Restaurant address for distance calculation
// RESTAURANT_ADDRESS is now declared in js/config.js
// const RESTAURANT_ADDRESS = {
//   street: 'Florastraße 10A',
//   postal: '13187',
//   city: 'Berlin',
//   full: 'Florastraße 10A, 13187 Berlin'
// };

// Delivery distance limit (5km)
// DELIVERY_DISTANCE_LIMIT_KM is now declared in js/config.js
// const DELIVERY_DISTANCE_LIMIT_KM = 5;

// Set service type (for menu page service buttons)
function setServiceType(type) {
  selectedServiceType = type;

  // Update UI
  document.querySelectorAll('.service-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = event?.target?.closest('.service-btn');
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Update delivery fee and table selection visibility
  updateServiceTypeUI();
}

// Get current location using geolocation API
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation wird von Ihrem Browser nicht unterstützt.');
    return;
  }

  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');

  if (!streetInput || !postalInput || !cityInput) {
    return;
  }

  // Show loading state
  const originalStreetValue = streetInput.value;
  streetInput.value = 'Position wird ermittelt...';
  streetInput.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Use reverse geocoding to get address
        // Note: In production, use a proper geocoding service like Google Maps Geocoding API
        // For now, we'll use a free service like Nominatim (OpenStreetMap)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await response.json();

        if (data && data.address) {
          const address = data.address;

          // Fill in the address fields
          if (address.road) {
            streetInput.value = address.road + (address.house_number ? ' ' + address.house_number : '');
          } else if (address.pedestrian) {
            streetInput.value = address.pedestrian;
          }

          if (address.postcode) {
            postalInput.value = address.postcode;
          }

          if (address.city) {
            cityInput.value = address.city;
          } else if (address.town) {
            cityInput.value = address.town;
          } else if (address.village) {
            cityInput.value = address.village;
          }

          // Check delivery range after filling address
          if (streetInput.value && postalInput.value && cityInput.value) {
            checkAndUpdateDeliveryStatus(streetInput.value, postalInput.value, cityInput.value);
          }
        } else {
          alert('Adresse konnte nicht ermittelt werden. Bitte geben Sie die Adresse manuell ein.');
          streetInput.value = originalStreetValue;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        alert('Fehler beim Ermitteln der Adresse. Bitte geben Sie die Adresse manuell ein.');
        streetInput.value = originalStreetValue;
      } finally {
        streetInput.disabled = false;
      }
    },
    (error) => {
      streetInput.disabled = false;
      streetInput.value = originalStreetValue;

      let errorMessage = 'Fehler beim Ermitteln der Position. ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Berechtigung zur Standortfreigabe wurde verweigert.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Standortinformationen sind nicht verfügbar.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Zeitüberschreitung beim Ermitteln der Position.';
          break;
        default:
          errorMessage += 'Unbekannter Fehler.';
          break;
      }
      alert(errorMessage + ' Bitte geben Sie die Adresse manuell ein.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Calculate distance between two addresses using Haversine formula (approximate)
// This is a simplified calculation - in production, use Google Maps Distance Matrix API
function calculateDistance(addr1, addr2) {
  // For now, return a placeholder - in production, use geocoding API
  // This function should be implemented with actual geocoding service
  return null; // Will be implemented with actual distance calculation
}

// Check if delivery address is within delivery range (4km)
function checkDeliveryRange(street, postal, city) {
  if (!street || !postal || !city) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine vollständige Adresse ein.' };
  }

  // Validate postal code format
  if (!/^\d{5}$/.test(postal)) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein.' };
  }

  // For now, we'll use a simple postal code check
  // In production, use Google Maps Geocoding API and Distance Matrix API for accurate distance calculation
  const customerPostal = parseInt(postal);
  const restaurantPostal = parseInt(RESTAURANT_ADDRESS.postal);

  // Simple check: if postal code is same or very close (within 4km radius)
  // This is a simplified check - in production, use actual geocoding
  const postalDiff = Math.abs(customerPostal - restaurantPostal);

  // Approximate: Berlin postal codes 13187 area
  // Postal codes close to 13187 (within ~4km radius) are typically within 1000-1600 range
  // This is a placeholder - should use actual geocoding API for precise calculation
  if (postalDiff <= 1600) { // Rough approximation for 4km radius
    return {
      withinRange: true,
      distance: null,
      message: '✓ Lieferung möglich (innerhalb 4km - kostenlos)'
    };
  } else {
    return {
      withinRange: false,
      distance: null,
      message: '✗ Lieferung nicht möglich: Adresse liegt außerhalb des 4km-Radius. Bitte wählen Sie stattdessen "Tisch reservieren".'
    };
  }
}

// Select service type in payment modal
function selectServiceType(type) {
  selectedServiceType = type;

  // Update UI buttons
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });

  const activeBtn = document.querySelector(`.service-type-btn[data-service="${type}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.borderColor = 'var(--gold)';
    activeBtn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
  }

  // Update payment modal UI
  updatePaymentModalServiceType();

  // If delivery is selected, check address if already filled
  if (type === 'delivery') {
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      checkAndUpdateDeliveryStatus(street, postal, city);
    }
  }
}

// Check delivery address and update UI
function checkAndUpdateDeliveryStatus(street, postal, city) {
  const deliveryStatusEl = document.getElementById('deliveryStatusMessage');

  if (!deliveryStatusEl) {
    // Create status message element if it doesn't exist
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    if (deliveryAddressSection) {
      const statusDiv = document.createElement('div');
      statusDiv.id = 'deliveryStatusMessage';
      statusDiv.style.marginTop = '12px';
      statusDiv.style.padding = '12px';
      statusDiv.style.borderRadius = '8px';
      statusDiv.style.fontSize = '14px';
      deliveryAddressSection.appendChild(statusDiv);
    } else {
      return;
    }
  }

  const rangeCheck = checkDeliveryRange(street, postal, city);
  const statusEl = document.getElementById('deliveryStatusMessage');

  if (statusEl) {
    if (rangeCheck.withinRange) {
      statusEl.innerHTML = `<div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">✓</span>
        <span>${rangeCheck.message}</span>
      </div>`;
      statusEl.style.background = 'rgba(16,185,129,.1)';
      statusEl.style.border = '1px solid rgba(16,185,129,.3)';
    } else {
      statusEl.innerHTML = `<div style="color: #ef4444; display: flex; align-items: flex-start; gap: 8px;">
        <span style="font-size: 18px; margin-top: 2px;">✗</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${rangeCheck.message}</div>
          <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
            Bitte wählen Sie stattdessen "Tisch reservieren"
          </div>
        </div>
      </div>`;
      statusEl.style.background = 'rgba(239,68,68,.1)';
      statusEl.style.border = '1px solid rgba(239,68,68,.3)';
    }
  }

  // Update payment summary to reflect delivery status
  updatePaymentSummary();
}

// Render PayPal button
function renderPayPalButton() {
  const container = document.getElementById('paypal-button-container');
  if (!container) return;

  // Check if PayPal SDK is loaded
  if (typeof paypal === 'undefined') {
    console.error('PayPal SDK not loaded!');
    container.innerHTML = '<p style="color: #ef4444; padding: 10px;">PayPal SDK konnte nicht geladen werden. Bitte Seite neu laden.</p>';
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Calculate total
  const subtotal = getTotal();
  let deliveryFee = 0;
  if (selectedServiceType === 'delivery') {
    const street = document.getElementById('deliveryStreet')?.value || '';
    const postal = document.getElementById('deliveryPostal')?.value || '';
    const city = document.getElementById('deliveryCity')?.value || '';
    if (street && postal && city) {
      deliveryFee = 2.50;
    }
  }
  const total = subtotal + deliveryFee;

  // Render PayPal button
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    },
    createOrder: function (data, actions) {
      // Create order on PayPal
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2),
            currency_code: 'EUR'
          },
          description: `LEO SUSHI Bestellung - ${cart.length} Artikel`
        }]
      });
    },
    onApprove: async function (data, actions) {
      // Capture the payment
      return actions.order.capture().then(async function (details) {
        console.log('PayPal payment approved:', details);

        // Get order data
        const deliveryAddress = getDeliveryAddress();
        const orderId = `ORD-${Date.now()}`;
        const orderTimestamp = new Date().toISOString();

        // Get customer code from form if entered
        const customerCode = document.getElementById('customerCode')?.value.trim() || null;

        // Save customer information to Firebase FIRST (before saving order)
        // This ensures customer info is available for future lookups
        let savedCustomerInfo = null;
        if (deliveryAddress.email && deliveryAddress.phone) {
          try {
            savedCustomerInfo = await saveCustomerInfo({
              firstName: deliveryAddress.firstName || '',
              lastName: deliveryAddress.lastName || '',
              email: deliveryAddress.email,
              phone: deliveryAddress.phone,
              street: deliveryAddress.street || '',
              postal: deliveryAddress.postal || '',
              city: deliveryAddress.city || '',
              note: deliveryAddress.note || '',
              customerCode: customerCode // Include customer code if entered
            });

            // Store customer code in deliveryAddress and orderData
            if (savedCustomerInfo && savedCustomerInfo.customerCode) {
              deliveryAddress.customerCode = savedCustomerInfo.customerCode;
              console.log('✅ Customer code saved to deliveryAddress:', savedCustomerInfo.customerCode);
            }
          } catch (e) {
            console.error('Error saving customer info:', e);
            // Continue even if customer info save fails
          }
        }

        const orderData = {
          order_id: orderId,
          status: 'pending',
          service_type: selectedServiceType,
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.qty,
            description: item.desc || '',
            note: item.note || '',
            total: (item.price * item.qty).toFixed(2)
          })),
          delivery: {
            address: deliveryAddress,
            fee: deliveryFee.toFixed(2)
          },
          summary: {
            item_count: cart.reduce((sum, item) => sum + item.qty, 0),
            subtotal: subtotal.toFixed(2),
            delivery_fee: deliveryFee.toFixed(2),
            total: total.toFixed(2),
            payment_method: 'paypal',
            timestamp: orderTimestamp,
            paypal_order_id: details.id,
            paypal_payer_id: details.payer.payer_id
          },
          customerCode: deliveryAddress.customerCode || savedCustomerInfo?.customerCode || null, // Store customer code at root level for easy access
          createdAt: orderTimestamp
        };

        // Save order to Firebase
        saveOrderToFirebase(orderData);

        // Save order to daily orders list for reporting
        saveOrderToDailyReport(orderData);

        // NOTE: KHÔNG gửi email khi khách đặt hàng
        // Email sẽ CHỈ được gửi cho customer SAU KHI admin xác nhận đơn hàng (trong admin.html)
        // Admin xem đơn hàng trong admin panel, không cần email thông báo

        // NOTE: Print bills will be generated when admin confirms the order

        // Clear cart after successful order
        cart = [];
        saveCart();
        updateCartUI();

        // Close payment modal
        closePaymentModal();

        // Show beautiful success notification
        showOrderSuccessNotification(orderData, deliveryAddress, orderId);
      });
    },
    onError: function (err) {
      console.error('PayPal payment error:', err);
      alert('Ein Fehler ist bei der PayPal-Zahlung aufgetreten. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
    },
    onCancel: function (data) {
      console.log('PayPal payment cancelled:', data);
      // User cancelled, do nothing
    }
  }).render('#paypal-button-container');
}

// Process PayPal payment (legacy function - now handled by PayPal button)
function processPayPalPayment(orderData, deliveryAddress, orderId) {
  // This function is no longer used directly
  // PayPal payment is now handled by the PayPal button's onApprove callback
  console.log('processPayPalPayment called - this should be handled by PayPal button');
}

// Update payment modal based on service type
// NOTE: This function is also in js/payment.js - modules version takes precedence
function updatePaymentModalServiceType() {
  const deliveryAddressSection = document.getElementById('deliveryAddressSection');
  const reservationDetailsSection = document.getElementById('reservationDetailsSection');
  const orderTableStatusSection = document.getElementById('orderTableStatusSection');
  const reservationTableSelectionSection = document.getElementById('reservationTableSelectionSection');
  const deliveryStreet = document.getElementById('deliveryStreet');
  const deliveryPostal = document.getElementById('deliveryPostal');
  const deliveryCity = document.getElementById('deliveryCity');
  const deliveryFeeEl = document.getElementById('paymentDelivery');

  if (selectedServiceType === 'reservation') {
    // Reservation - show reservation form, hide delivery address
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'block';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'none';

    // Setup table selection listeners for reservation
    setupReservationTableSelectionListeners();

    // No delivery fee for reservation
    if (deliveryFeeEl) deliveryFeeEl.textContent = '€0,00';
  } else if (selectedServiceType === 'pickup') {
    // Pickup - show delivery address but make it optional, show table status
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'block';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'none';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'block';

    // Make address fields optional
    if (deliveryStreet) deliveryStreet.removeAttribute('required');
    if (deliveryPostal) deliveryPostal.removeAttribute('required');
    if (deliveryCity) deliveryCity.removeAttribute('required');

    // Update table status
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    updateTableStatus(date, time);

    // No delivery fee
    if (deliveryFeeEl) deliveryFeeEl.textContent = '€0,00';
  } else {
    // Delivery - show delivery address, hide reservation
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'block';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'none';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'none';

    // Make address fields required
    if (deliveryStreet) deliveryStreet.setAttribute('required', 'required');
    if (deliveryPostal) deliveryPostal.setAttribute('required', 'required');
    if (deliveryCity) deliveryCity.setAttribute('required', 'required');

    // Add event listeners to check delivery range when address changes
    if (deliveryStreet) {
      deliveryStreet.removeEventListener('blur', handleAddressChange);
      deliveryStreet.addEventListener('blur', handleAddressChange);
    }
    if (deliveryPostal) {
      deliveryPostal.removeEventListener('blur', handleAddressChange);
      deliveryPostal.addEventListener('blur', handleAddressChange);
    }
    if (deliveryCity) {
      deliveryCity.removeEventListener('blur', handleAddressChange);
      deliveryCity.addEventListener('blur', handleAddressChange);
    }

    // Delivery fee (free within 5km)
    if (deliveryFeeEl) deliveryFeeEl.textContent = '€0,00';
  }

  // Helper function for address change
  function handleAddressChange() {
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      checkAndUpdateDeliveryStatus(street, postal, city);
    }
  }

  // Update total
  updatePaymentSummary();
}

// Setup table selection listeners for reservation in payment modal
// NOTE: This function is also in js/payment.js - modules version takes precedence
function setupReservationTableSelectionListeners() {
  const dateInput = document.getElementById('reserveDateInPayment');
  const timeInput = document.getElementById('reserveTimeInPayment');
  const container = document.getElementById('reservationTableSelectionContainer');
  const section = document.getElementById('reservationTableSelectionSection');

  if (!dateInput || !timeInput || !container) return;

  const updateTableSelection = () => {
    const date = dateInput.value;
    const time = timeInput.value;

    if (date && time) {
      renderTableSelection(date, time, 'reservationTableSelectionContainer');
      if (section) section.style.display = 'block';
    } else {
      if (section) section.style.display = 'none';
    }
  };

  // Remove old listeners
  dateInput.removeEventListener('change', updateTableSelection);
  timeInput.removeEventListener('change', updateTableSelection);

  // Add new listeners
  dateInput.addEventListener('change', updateTableSelection);
  timeInput.addEventListener('change', updateTableSelection);

  // Initial check
  updateTableSelection();
}

// Make selectServiceType globally available
window.selectServiceType = selectServiceType;

// Update UI based on service type (for menu page)
function updateServiceTypeUI() {
  const deliveryFeeEl = document.getElementById('paymentDelivery');
  const tableStatusSection = document.getElementById('orderTableStatusSection');
  const deliveryStreet = document.getElementById('deliveryStreet');
  const deliveryPostal = document.getElementById('deliveryPostal');
  const deliveryCity = document.getElementById('deliveryCity');

  if (selectedServiceType === 'pickup') {
    // Abholung - no delivery fee, show table status
    if (deliveryFeeEl) {
      deliveryFeeEl.textContent = '€0,00';
    }
    if (tableStatusSection) {
      tableStatusSection.style.display = 'block';
      // Check table availability for current time
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().slice(0, 5);
      updateTableStatus(date, time);
    }
    // Make address fields optional for pickup
    if (deliveryStreet) deliveryStreet.removeAttribute('required');
    if (deliveryPostal) deliveryPostal.removeAttribute('required');
    if (deliveryCity) deliveryCity.removeAttribute('required');
  } else {
    // Lieferung - delivery fee, hide table status
    if (deliveryFeeEl) {
      deliveryFeeEl.textContent = '€2,50';
    }
    if (tableStatusSection) {
      tableStatusSection.style.display = 'none';
    }
    // Make address fields required for delivery
    if (deliveryStreet) deliveryStreet.setAttribute('required', 'required');
    if (deliveryPostal) deliveryPostal.setAttribute('required', 'required');
    if (deliveryCity) deliveryCity.setAttribute('required', 'required');
  }

  // Update total
  updatePaymentSummary();
}

// Update table status display (available or full)
async function updateTableStatus(date, time) {
  const container = document.getElementById('orderTableStatusContainer');
  if (!container) return;

  const availableTables = await getAvailableTables(date, time);
  const hasAvailableTables = availableTables.length > 0;

  container.innerHTML = `
    <div style="padding: 16px; border-radius: 12px; text-align: center; ${hasAvailableTables ? 'background: rgba(16,185,129,.1); border: 2px solid rgba(16,185,129,.3);' : 'background: rgba(239,68,68,.1); border: 2px solid rgba(239,68,68,.3);'}">
      <div style="font-size: 18px; font-weight: 600; color: ${hasAvailableTables ? '#10b981' : '#ef4444'};">
        ${hasAvailableTables ? '✓ Tische verfügbar' : '✗ Keine Tische verfügbar'}
      </div>
    </div>
  `;
}

// Make setServiceType globally available
window.setServiceType = setServiceType;

// Check if user is logged in (admin)
function isAdminLoggedIn() {
  return localStorage.getItem('leo_admin_logged_in') === 'true';
}

// Login function (simple password check)
function adminLogin(password) {
  // Simple password - in production, use proper authentication
  const ADMIN_PASSWORD = 'leo2024'; // Change this to your desired password
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('leo_admin_logged_in', 'true');
    return true;
  }
  return false;
}

// Logout function
function adminLogout() {
  localStorage.removeItem('leo_admin_logged_in');
}

// Payment Method Modal Functions
function openPaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (!modal) return;

  // Reset form
  selectedServiceType = 'delivery'; // Default to delivery

  // Reset service type buttons
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });
  const defaultBtn = document.querySelector('.service-type-btn[data-service="delivery"]');
  if (defaultBtn) {
    defaultBtn.classList.add('active');
    defaultBtn.style.borderColor = 'var(--gold)';
    defaultBtn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
  }

  // Set min date for reservation date input
  const reserveDateInput = document.getElementById('reserveDateInPayment');
  if (reserveDateInput) {
    const today = new Date().toISOString().split('T')[0];
    reserveDateInput.setAttribute('min', today);
  }

  // Update payment modal UI
  updatePaymentModalServiceType();

  // Reset payment options UI
  const cashOption = document.getElementById('paymentOptionCash');
  const cardOption = document.getElementById('paymentOptionCard');
  const paypalOption = document.getElementById('paymentOptionPayPal');
  if (cashOption) cashOption.classList.remove('selected');
  if (cardOption) cardOption.classList.remove('selected');
  if (paypalOption) paypalOption.classList.remove('selected');

  // Set default payment method to "cash" if not already selected
  if (!selectedPaymentMethod) {
    selectedPaymentMethod = 'cash';
    if (cashOption) {
      cashOption.classList.add('selected');
    }
  } else {
    // If already selected, restore the selection
    if (selectedPaymentMethod === 'cash' && cashOption) {
      cashOption.classList.add('selected');
    } else if (selectedPaymentMethod === 'card' && cardOption) {
      cardOption.classList.add('selected');
    } else if (selectedPaymentMethod === 'paypal' && paypalOption) {
      paypalOption.classList.add('selected');
    }
  }

  // Update order summary
  updatePaymentSummary();

  // Hide PayPal button container initially
  const paypalButtonContainer = document.getElementById('paypalButtonContainer');
  if (paypalButtonContainer) {
    paypalButtonContainer.style.display = 'none';
  }

  // Show confirm button initially
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  if (confirmPaymentBtn) {
    confirmPaymentBtn.style.display = 'block';
  }

  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePaymentModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function updatePaymentSummary() {
  const subtotal = getTotal();
  let deliveryFee = 0;

  if (selectedServiceType === 'delivery') {
    // Check if address is filled and within range
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      const rangeCheck = checkDeliveryRange(street, postal, city);
      if (rangeCheck.withinRange) {
        deliveryFee = 0; // Free within 4km
      } else {
        deliveryFee = 0; // Still 0, but delivery not possible
      }
    } else {
      deliveryFee = 0; // Default to 0 until address is entered
    }
  } else if (selectedServiceType === 'pickup' || selectedServiceType === 'reservation') {
    deliveryFee = 0;
  }

  const total = subtotal + deliveryFee;

  const subtotalEl = document.getElementById('paymentSubtotal');
  const deliveryEl = document.getElementById('paymentDelivery');
  const totalEl = document.getElementById('paymentTotal');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (deliveryEl) deliveryEl.textContent = formatPrice(deliveryFee);
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Re-render PayPal button if PayPal is selected and total changed
  // Check if selectedPaymentMethod is defined (it's in js/payment.js)
  if (typeof window.selectedPaymentMethod !== 'undefined' && window.selectedPaymentMethod === 'paypal') {
    const paypalButtonContainer = document.getElementById('paypalButtonContainer');
    if (paypalButtonContainer && paypalButtonContainer.style.display !== 'none') {
      if (typeof renderPayPalButton === 'function') {
        renderPayPalButton();
      }
    }
  }
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (!modal) return;

  modal.style.opacity = '0';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// selectedPaymentMethod is now declared in js/payment.js
// let selectedPaymentMethod = null;

function selectPaymentOption(method) {
  selectedPaymentMethod = method;

  // Update UI
  const cashOption = document.getElementById('paymentOptionCash');
  const cardOption = document.getElementById('paymentOptionCard');
  const paypalOption = document.getElementById('paymentOptionPayPal');
  const paypalButtonContainer = document.getElementById('paypalButtonContainer');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

  if (cashOption) cashOption.classList.remove('selected');
  if (cardOption) cardOption.classList.remove('selected');
  if (paypalOption) paypalOption.classList.remove('selected');

  // Hide PayPal button container by default
  if (paypalButtonContainer) {
    paypalButtonContainer.style.display = 'none';
    // Clear existing PayPal buttons
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
  }

  // Show/hide confirm button based on payment method
  if (confirmPaymentBtn) {
    confirmPaymentBtn.style.display = method === 'paypal' ? 'none' : 'block';
  }

  if (method === 'cash' && cashOption) {
    cashOption.classList.add('selected');
  } else if (method === 'card' && cardOption) {
    cardOption.classList.add('selected');
  } else if (method === 'paypal' && paypalOption) {
    paypalOption.classList.add('selected');
    // Show PayPal button container and render PayPal button
    if (paypalButtonContainer) {
      paypalButtonContainer.style.display = 'block';
      renderPayPalButton();
    }
  }
}

async function confirmPayment() {
  // Check if reservation section is visible - if so, treat as reservation
  const reservationDetailsSection = document.getElementById('reservationDetailsSection');
  const isReservationVisible = reservationDetailsSection && reservationDetailsSection.style.display !== 'none';

  // If reservation section is visible, override selectedServiceType
  if (isReservationVisible && selectedServiceType !== 'reservation') {
    selectedServiceType = 'reservation';
  }

  // Validate form
  const customerFirstName = document.getElementById('customerFirstName')?.value.trim();
  const customerLastName = document.getElementById('customerLastName')?.value.trim();
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const note = document.getElementById('deliveryNote')?.value.trim();
  const customerPhone = document.getElementById('customerPhone')?.value.trim();
  const customerEmail = document.getElementById('customerEmail')?.value.trim();

  // Handle reservation service type
  if (selectedServiceType === 'reservation') {
    // Get reservation-specific fields
    const reserveFirstName = document.getElementById('reserveFirstNameInPayment')?.value.trim();
    const reserveLastName = document.getElementById('reserveLastNameInPayment')?.value.trim();
    const reserveEmail = document.getElementById('reserveEmailInPayment')?.value.trim();
    const reservePhone = document.getElementById('reservePhoneInPayment')?.value.trim();
    const reserveDate = document.getElementById('reserveDateInPayment')?.value;
    const reserveTime = document.getElementById('reserveTimeInPayment')?.value;
    const reserveGuests = document.getElementById('reserveGuestsInPayment')?.value;
    // Table selection removed - admin will assign tables manually

    // Validate reservation fields
    if (!reserveFirstName || !reserveLastName || !reserveEmail || !reservePhone) {
      alert('Bitte füllen Sie alle Pflichtfelder (Vorname, Nachname, E-Mail, Telefon) aus.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reserveEmail)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    // Validate phone format (more flexible - accepts various formats)
    const phoneClean = reservePhone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
    const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
    if (!phoneRegex.test(phoneClean)) {
      alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
      return;
    }

    // Validate reservation details
    if (!reserveDate || !reserveTime || !reserveGuests) {
      alert('Bitte füllen Sie alle Reservierungsinformationen aus (Datum, Uhrzeit, Anzahl Personen).');
      return;
    }

    // Table selection removed - admin will assign tables manually
    // No need to validate table selection

    if (!selectedPaymentMethod) {
      alert('Bitte wählen Sie eine Zahlungsmethode aus.');
      return;
    }

    // Get items from reservation cart if available, otherwise use regular cart
    const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
    const itemsToUse = reservationCart.length > 0 ? reservationCart : cart;

    // Create reservation with order
    const reservationId = `RES-${Date.now()}`;
    const reservationTimestamp = new Date().toISOString();

    // Calculate subtotal from items
    const subtotal = itemsToUse.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const reservationData = {
      reservationId: reservationId,
      status: 'pending',
      firstName: reserveFirstName,
      lastName: reserveLastName,
      phone: reservePhone,
      email: reserveEmail,
      date: reserveDate,
      time: reserveTime,
      guests: parseInt(reserveGuests),
      tableNumber: null, // Admin will assign table manually
      note: note || '',
      items: itemsToUse.map(item => ({ name: item.name, price: item.price, qty: item.qty, desc: item.desc || '', note: item.note || '' })),
      timestamp: reservationTimestamp,
      createdAt: reservationTimestamp
    };

    // Get customer code from form if entered
    const customerCode = document.getElementById('customerCode')?.value.trim() || null;

    // Save customer information for future orders (and get customer code)
    const savedCustomerInfo = await saveCustomerInfo({
      firstName: reserveFirstName,
      lastName: reserveLastName,
      email: reserveEmail,
      phone: reservePhone,
      street: '',
      postal: '',
      city: '',
      note: note || '',
      customerCode: customerCode // Include customer code if entered
    });

    // Get final customer code
    const finalCustomerCode = savedCustomerInfo?.customerCode || customerCode || null;

    // Store customer code in reservation data if available
    if (finalCustomerCode) {
      reservationData.customerCode = finalCustomerCode;
    }

    // Create order linked to reservation (only if there are items)
    let orderData = null;
    if (itemsToUse.length > 0) {
      const orderId = `ORD-${Date.now()}`;
      orderData = {
        order_id: orderId,
        status: 'pending',
        service_type: 'pickup',
        table_number: null, // Admin will assign table manually
        reservation_id: reservationId,
        items: itemsToUse.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          description: item.desc || '',
          note: item.note || '',
          total: (item.price * item.qty).toFixed(2)
        })),
        delivery: {
          address: {
            firstName: reserveFirstName,
            lastName: reserveLastName,
            phone: reservePhone,
            email: reserveEmail,
            street: '',
            postal: '',
            city: '',
            note: note || '',
            customerCode: finalCustomerCode || null // Include customer code in delivery address
          },
          fee: '0.00'
        },
        customerCode: finalCustomerCode || null, // Also store at root level for easy access
        summary: {
          item_count: itemsToUse.reduce((sum, item) => sum + item.qty, 0),
          subtotal: subtotal.toFixed(2),
          delivery_fee: '0.00',
          total: subtotal.toFixed(2),
          payment_method: selectedPaymentMethod,
          timestamp: reservationTimestamp
        },
        createdAt: reservationTimestamp
      };
    }

    // Save reservation
    saveReservationToDailyReport(reservationData);

    // Save order only if there are items
    if (orderData) {
      saveOrderToDailyReport(orderData);
    }

    // NOTE: KHÔNG gửi email khi khách đặt bàn
    // Email sẽ CHỈ được gửi cho customer SAU KHI admin xác nhận đặt bàn (trong admin.html)
    // Admin xem đặt bàn trong admin panel, không cần email thông báo

    // Show confirmation
    // Reservation confirmation - only send email, no print bill
    // showReservationConfirmation removed

    // Clear carts
    cart = [];
    saveCart();
    localStorage.removeItem('leoReservationCart');
    localStorage.removeItem('leoSelectingForReservation');
    updateCartUI();
    updateReservationCartDisplay();

    // Close modal
    closePaymentModal();
    return;
  }

  // Validate based on service type (for delivery and pickup only, reservation is handled above)
  // Only validate customer info for delivery and pickup
  if (selectedServiceType === 'delivery' || selectedServiceType === 'pickup') {
    if (!customerFirstName || !customerLastName || !customerPhone || !customerEmail) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    // Validate phone format (more flexible - accepts various formats)
    const phoneClean = customerPhone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
    const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
    if (!phoneRegex.test(phoneClean)) {
      alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  }

  if (!selectedPaymentMethod) {
    alert('Bitte wählen Sie eine Zahlungsmethode aus.');
    return;
  }

  // For delivery, address is required and must be within range
  // Only validate if service type is delivery AND reservation section is not visible
  if (selectedServiceType === 'delivery' && !isReservationVisible) {
    if (!street || !postal || !city) {
      alert('Bitte füllen Sie die Lieferadresse aus.');
      return;
    }

    // Validate postal code for delivery
    if (postal && !/^\d{5}$/.test(postal)) {
      alert('Bitte geben Sie eine gültige 5-stellige PLZ ein.\n\nBeispiel: 13187');
      return;
    }

    // Check if address is within delivery range (4km)
    const rangeCheck = checkDeliveryRange(street, postal, city);
    if (!rangeCheck.withinRange) {
      alert('Lieferung nicht möglich!\n\n' + rangeCheck.message + '\n\nBitte wählen Sie stattdessen:\n• "Tisch reservieren"');
      return;
    }

    // Validate scheduled delivery time if provided
    const scheduledDeliveryTime = typeof getScheduledDeliveryTime === 'function' ? getScheduledDeliveryTime() : null;
    if (scheduledDeliveryTime) {
      const scheduledDate = document.getElementById('scheduledDeliveryDate')?.value;
      const scheduledTime = document.getElementById('scheduledDeliveryTime')?.value;
      const errorDiv = document.getElementById('scheduledDeliveryTimeError');

      if (scheduledDate && scheduledTime) {
        const now = new Date();
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        const minDateTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

        if (scheduledDateTime < minDateTime) {
          const minTimeStr = minDateTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
          alert(`Die gewünschte Lieferzeit muss mindestens 30 Minuten ab jetzt sein (frühestens ${minTimeStr}).`);
          if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Die gewünschte Lieferzeit muss mindestens 30 Minuten ab jetzt sein (frühestens ${minTimeStr}).`;
          }
          return;
        }
      }
    }
  }

  // For pickup, check if tables are available
  if (selectedServiceType === 'pickup') {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5); // Current time HH:MM
    const availableTables = getAvailableTables(date, time);

    if (availableTables.length === 0) {
      alert('Entschuldigung, derzeit sind keine Tische verfügbar. Bitte wählen Sie eine andere Zeit oder bestellen Sie eine Lieferung.');
      return;
    }

    // Admin will assign table later, so we don't need to select one now
    // Just check availability
  }

  // Prepare delivery address
  const deliveryAddress = {
    firstName: customerFirstName,
    lastName: customerLastName,
    street: street || '',
    postal: postal || '',
    city: city || '',
    note: note || '',
    phone: customerPhone,
    email: customerEmail
  };

  // Get customer code from form if entered
  const customerCode = document.getElementById('customerCode')?.value.trim() || null;

  // Save customer information for future orders (and get customer code)
  const savedCustomerInfo = await saveCustomerInfo({
    firstName: customerFirstName,
    lastName: customerLastName,
    email: customerEmail,
    phone: customerPhone,
    street: street || '',
    postal: postal || '',
    city: city || '',
    note: note || '',
    customerCode: customerCode // Include customer code if entered
  });

  // Store customer code for display in success notification and in order data
  if (savedCustomerInfo && savedCustomerInfo.customerCode) {
    deliveryAddress.customerCode = savedCustomerInfo.customerCode;
    console.log('✅ Customer code saved to deliveryAddress:', savedCustomerInfo.customerCode);
  } else {
    console.warn('⚠️ No customer code in savedCustomerInfo:', savedCustomerInfo);
  }

  // Calculate totals
  const subtotal = getTotal();
  let deliveryFee = 0;
  if (selectedServiceType === 'delivery') {
    // Delivery is free within 5km (already validated above)
    deliveryFee = 0;
  }
  const total = subtotal + deliveryFee;

  // Generate unique order ID
  const orderId = `ORD-${Date.now()}`;
  const orderTimestamp = new Date().toISOString();

  // Get scheduled delivery time if provided
  const scheduledDeliveryTime = typeof getScheduledDeliveryTime === 'function' ? getScheduledDeliveryTime() : null;

  // Prepare detailed cart data for GloriaFood
  const orderData = {
    order_id: orderId,
    status: 'pending', // pending, confirmed, cancelled
    service_type: selectedServiceType, // 'pickup' or 'delivery'
    table_number: null, // Will be assigned by admin later
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.qty,
      description: item.desc || '',
      note: item.note || '',
      total: (item.price * item.qty).toFixed(2)
    })),
    delivery: {
      address: {
        ...deliveryAddress,
        customerCode: deliveryAddress.customerCode || savedCustomerInfo?.customerCode || null // Ensure customerCode is included
      },
      fee: deliveryFee.toFixed(2),
      scheduled_time: scheduledDeliveryTime || null // Add scheduled delivery time
    },
    customerCode: deliveryAddress.customerCode || savedCustomerInfo?.customerCode || null, // Also store at root level for easy access
    scheduled_delivery_time: scheduledDeliveryTime || null, // Also store at root level for easy access
    summary: {
      item_count: cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal: subtotal.toFixed(2),
      delivery_fee: deliveryFee.toFixed(2),
      total: total.toFixed(2),
      payment_method: selectedPaymentMethod,
      timestamp: orderTimestamp
    },
    createdAt: orderTimestamp
  };

  // Log customer code in order data
  if (orderData.customerCode) {
    console.log('✅ Customer code included in orderData:', orderData.customerCode);
  } else {
    console.warn('⚠️ No customer code in orderData');
  }

  // Handle PayPal payment
  // Note: PayPal payment is handled directly by the PayPal button's onApprove callback
  // If user selected PayPal but somehow reached here, show error
  if (selectedPaymentMethod === 'paypal') {
    alert('Bitte verwenden Sie den PayPal-Button zum Bezahlen.');
    return;
  }

  // Save to localStorage - GloriaFood widget/script can read this
  localStorage.setItem('leoOrderData', JSON.stringify(orderData));
  localStorage.setItem('gloriafood_cart', JSON.stringify(orderData.items));
  localStorage.setItem('order_summary', JSON.stringify(orderData.summary));
  localStorage.setItem('payment_method', selectedPaymentMethod);
  localStorage.setItem('delivery_address', JSON.stringify(deliveryAddress));

  // Save order to daily orders list for reporting
  saveOrderToDailyReport(orderData);

  // Note: Table will be assigned by admin later, no automatic reservation needed

  // NOTE: KHÔNG gửi email khi khách đặt hàng
  // Email sẽ CHỈ được gửi cho customer SAU KHI admin xác nhận đơn hàng (trong admin.html)
  // Admin xem đơn hàng trong admin panel, không cần email thông báo

  // NOTE: Print bills will be generated when admin confirms the order

  // Clear cart after successful order
  cart = [];
  saveCart();
  updateCartUI();

  // Close payment modal
  closePaymentModal();

  // Show beautiful success notification
  showOrderSuccessNotification(orderData, deliveryAddress, orderId);

  // Try to trigger GloriaFood ordering widget/iframe
  // Option 1: Check if GloriaFood widget exists on page
  const gloriaWidget = document.querySelector('[id*="gloria"], [class*="gloria"], iframe[src*="gloriafood"]');

  if (gloriaWidget) {
    // If widget exists, try to open it
    gloriaWidget.click();
    // Try to inject items after widget opens
    setTimeout(() => {
      tryInjectGloriaFoodCart();
    }, 1000);
  } else {
    // Option 2: Try to trigger GloriaFood widget if it exists globally
    if (typeof window.gloriafood !== 'undefined' && window.gloriafood.openOrdering) {
      window.gloriafood.openOrdering();
      setTimeout(() => {
        tryInjectGloriaFoodCart();
      }, 1500);
    } else {
      // Option 3: Redirect to GloriaFood ordering page
      // Get your ordering URL from: Dashboard > Smart links > Copy your ordering link
      const gloriaOrderUrl = 'YOUR_GLORIAFOOD_ORDERING_URL_HERE'; // Paste from Smart links

      // If you have the URL, redirect
      if (gloriaOrderUrl !== 'YOUR_GLORIAFOOD_ORDERING_URL_HERE') {
        window.open(gloriaOrderUrl, '_blank');
        sessionStorage.setItem('has_gloria_cart', 'true');
      } else {
        // Fallback: Show order confirmation (already handled by showOrderSuccessNotification above)
      }
    }
  }
}

// EmailJS Configuration
// ⚠️ QUAN TRỌNG: Cần setup EmailJS để gửi email!
// Hướng dẫn chi tiết: Xem file EMAILJS-SETUP-GUIDE.md
// 
// Gmail App Password của bạn: FHBV ISNO PTHR RDP W
// (Sẽ cần khi kết nối Gmail service trong EmailJS)
//
// EMAILJS_CONFIG and PAYPAL_CONFIG are now in js/config.js
// const EMAILJS_CONFIG = {
//   SERVICE_ID: 'service_leosushi', // ✅ Đã cấu hình
//   TEMPLATE_ID: 'template_yqoxbrl', // ✅ Đã cấu hình (Order Confirmation)
//   CUSTOMER_TEMPLATE_ID: 'template_yqoxbrl', // ✅ Dùng chung template
//   PUBLIC_KEY: 'E3SDev1AydFrByo3D', // ✅ Đã cấu hình
//   OWNER_EMAIL: 'leoshushi@gmail.com' // ✅ Đã cấu hình
// };

// PayPal Configuration
// const PAYPAL_CONFIG = {
//   CLIENT_ID: 'AVX7OWzjn1GaFrih0WfAIBFScH66UYxBTAdMiB9WcUCOWUDX4msBREdpRdxgJiRQpiN0ExswysrQNL-K', // ✅ PayPal Client ID
//   CURRENCY: 'EUR', // Euro
//   LOCALE: 'de_DE' // German locale
// };

// Firebase Configuration (BẮT BUỘC - Database thật)
// ⚠️ QUAN TRỌNG: Firebase là BẮT BUỘC để hệ thống hoạt động!
// 
// TẠI SAO CẦN FIREBASE?
// - localStorage chỉ lưu trên máy khách → Admin không thể xem đơn hàng từ máy khác
// - Firebase lưu trên cloud → Admin xem được từ mọi nơi (máy tính, điện thoại)
// - Firebase miễn phí, real-time, dễ setup
//
// Hướng dẫn setup: Xem file firebase-setup-guide.md
// 
// Firebase config and initialization is now in js/firebase.js
// FIREBASE_CONFIG and db are exposed globally from js/firebase.js
// Use window.FIREBASE_CONFIG and window.db instead
// const FIREBASE_CONFIG = typeof window !== 'undefined' && window.FIREBASE_CONFIG ? window.FIREBASE_CONFIG : null;
// Helper function to get db - always returns window.db
function getDb() {
  return typeof window !== 'undefined' ? window.db : null;
}

// Helper functions to get configs from window or global scope
function getEmailjsConfig() {
  return typeof window !== 'undefined' && window.EMAILJS_CONFIG ? window.EMAILJS_CONFIG : (typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : null);
}

function getGoogleSheetsConfig() {
  return typeof window !== 'undefined' && window.GOOGLE_SHEETS_CONFIG ? window.GOOGLE_SHEETS_CONFIG : (typeof GOOGLE_SHEETS_CONFIG !== 'undefined' ? GOOGLE_SHEETS_CONFIG : null);
}
// For backward compatibility, use a getter function that always returns window.db
// Note: All code should use getDb() or window.db directly
// db is now declared in js/firebase.js, so we don't redeclare it here
// Instead, we create a local reference that always points to window.db
// This is done via getDb() function above, or by using window.db directly

// Google Sheets API Configuration (BACKUP - Tùy chọn)
// Chỉ dùng nếu muốn backup dữ liệu vào Google Sheets
// Hướng dẫn setup: Xem file google-sheets-setup.md
// GOOGLE_SHEETS_CONFIG is now in js/config.js
// const GOOGLE_SHEETS_CONFIG = {
//   WEB_APP_URL: '', // Optional: URL từ Google Apps Script Web App
//   ORDERS_SHEET_NAME: 'Orders',
//   RESERVATIONS_SHEET_NAME: 'Reservations',
//   API_KEY: '',
//   SPREADSHEET_ID: ''
// };

// Initialize EmailJS when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') {
    const emailjsConfig = typeof window !== 'undefined' && window.EMAILJS_CONFIG ? window.EMAILJS_CONFIG : (typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : null);
    if (emailjsConfig && emailjsConfig.PUBLIC_KEY) {
      emailjs.init(emailjsConfig.PUBLIC_KEY);
      console.log('✅ EmailJS initialized with Public Key:', emailjsConfig.PUBLIC_KEY);
      console.log('📋 EmailJS Config:', {
        SERVICE_ID: emailjsConfig.SERVICE_ID,
        TEMPLATE_ID: emailjsConfig.TEMPLATE_ID,
        CUSTOMER_TEMPLATE_ID: emailjsConfig.CUSTOMER_TEMPLATE_ID,
        RESERVATION_TEMPLATE_ID: emailjsConfig.RESERVATION_TEMPLATE_ID,
        OWNER_EMAIL: emailjsConfig.OWNER_EMAIL
      });
    } else {
      console.warn('⚠️ EMAILJS_CONFIG not found or PUBLIC_KEY missing');
    }
  } else {
    console.error('❌ EmailJS SDK not loaded! Check if script tag is in HTML.');
  }

  // Setup customer auto-fill
  setupCustomerAutoFill();
});

// Save order to Firebase (ONLY - no localStorage)
function saveOrderToDailyReport(orderData) {
  // Ensure order has status
  if (!orderData.status) {
    orderData.status = 'pending';
  }

  // Save order to Firebase (primary database)
  saveOrderToFirebase(orderData);

  // Optional: Also save to Google Sheets as backup
  const googleSheetsConfig = getGoogleSheetsConfig();
  if (googleSheetsConfig && googleSheetsConfig.WEB_APP_URL) {
    saveOrderToGoogleSheets(orderData);
  }

  // Also send email notification
  sendOrderDataToAdmin(orderData);
}

// ==================== CUSTOMER INFORMATION MANAGEMENT ====================

// Generate unique customer code
function generateCustomerCode() {
  // Format: LEO-XXXXXX (6 random alphanumeric characters)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0, O, I, 1
  let code = 'LEO-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Save customer information to localStorage and Firebase
async function saveCustomerInfo(customerData) {
  if (!customerData || !customerData.email || !customerData.phone) {
    return null; // Skip if no email or phone
  }

  const customerKey = customerData.email.toLowerCase().trim();
  const phoneKey = customerData.phone.replace(/[\s\-\+\(\)]/g, ''); // Normalize phone

  // Prepare customer info object
  let customerInfo = {
    firstName: customerData.firstName || '',
    lastName: customerData.lastName || '',
    email: customerData.email.toLowerCase().trim(),
    phone: customerData.phone,
    street: customerData.street || '',
    postal: customerData.postal || '',
    city: customerData.city || '',
    note: customerData.note || '',
    lastOrderDate: new Date().toISOString(),
    orderCount: 1, // Will be updated based on existing data
    customerCode: customerData.customerCode || null // Preserve existing code if any
  };

  // Validate customer uniqueness using the new validation function (1 email + 1 phone = 1 code)
  // Use validateCustomerUniqueness if available, otherwise fall back to old logic
  if (typeof validateCustomerUniqueness === 'function') {
    try {
      const validationResult = await validateCustomerUniqueness(
        customerInfo.email,
        customerInfo.phone,
        customerInfo.customerCode || null
      );

      if (!validationResult.isValid) {
        console.error('❌ Customer validation failed:', validationResult.message);
        // Still proceed but log the error
      } else if (validationResult.existingCustomerCode) {
        // Customer already exists with a code - use existing code
        customerInfo.customerCode = validationResult.existingCustomerCode;
        console.log('✅ Using existing customer code:', validationResult.existingCustomerCode);
      }
    } catch (e) {
      console.error('❌ Error validating customer uniqueness:', e);
    }
  }

  // Check if customer exists in Firebase first to preserve existing data
  // IMPORTANT: Check by email (document ID) AND phone to ensure same customer gets same code
  if (db) {
    try {
      const customerRef = db.collection('customers').doc(customerKey);
      const customerDoc = await customerRef.get();

      if (customerDoc.exists) {
        const existingData = customerDoc.data();
        const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');

        // Check if phone also matches (same email + same phone = same customer)
        if (existingPhone === phoneKey) {
          console.log('✅ Existing customer found (email + phone match):', customerKey, 'Code:', existingData.customerCode);

          // ALWAYS preserve existing code - never generate new one for existing customer
          if (existingData.customerCode) {
            customerInfo.customerCode = existingData.customerCode;
            console.log('✅ Preserved existing customer code:', existingData.customerCode);
          } else {
            // Customer exists but no code - generate one now
            customerInfo.customerCode = generateCustomerCode();
            console.log('⚠️ Customer exists but no code, generated new:', customerInfo.customerCode);
          }

          // Increment order count
          customerInfo.orderCount = (existingData.orderCount || 0) + 1;
          console.log('📊 Updated order count:', customerInfo.orderCount);
        } else {
          // Same email but different phone - this shouldn't happen, but handle it
          console.warn('⚠️ Email exists but phone different - treating as new customer');
          if (!customerInfo.customerCode) {
            customerInfo.customerCode = generateCustomerCode();
            console.log('🆕 Generated new code for email with different phone:', customerInfo.customerCode);
          }
        }
      } else {
        // New customer - generate code if not already set
        if (!customerInfo.customerCode) {
          customerInfo.customerCode = generateCustomerCode();
          console.log('🆕 New customer, generated code:', customerInfo.customerCode);
        }
      }
    } catch (e) {
      console.error('❌ Error checking existing customer:', e);
      // If error, generate new code for new customer
      if (!customerInfo.customerCode) {
        customerInfo.customerCode = generateCustomerCode();
        console.log('⚠️ Error occurred, generated code:', customerInfo.customerCode);
      }
    }
  } else {
    // No Firebase available - cannot save customer info
    // Firebase is required for web application (cross-device sync)
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht gespeichert werden.');
    console.error('❌ Bitte öffnen Sie setup.html zur Konfiguration der Firebase-Datenbank.');
    return null; // Return null if Firebase is not available
  }

  // Save to Firebase (PRIMARY SOURCE - required for web application)
  if (db) {
    try {
      const customerRef = db.collection('customers').doc(customerKey);
      const customerDoc = await customerRef.get();

      if (customerDoc.exists) {
        // Update existing customer - ALWAYS preserve existing code
        const existingData = customerDoc.data();

        // CRITICAL: Always use existing code if available, never overwrite
        if (existingData.customerCode) {
          customerInfo.customerCode = existingData.customerCode;
          console.log('✅ Preserving existing customer code in update:', existingData.customerCode);
        } else if (!customerInfo.customerCode) {
          // No existing code and no new code - generate one
          customerInfo.customerCode = generateCustomerCode();
          console.log('⚠️ No existing code, generated new in update:', customerInfo.customerCode);
        }

        await customerRef.update({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          street: customerInfo.street,
          postal: customerInfo.postal,
          city: customerInfo.city,
          note: customerInfo.note,
          customerCode: customerInfo.customerCode ? customerInfo.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '') : null, // Always store normalized (UPPERCASE, trimmed, no spaces)
          lastOrderDate: customerInfo.lastOrderDate,
          orderCount: customerInfo.orderCount,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Customer updated in Firebase with code:', customerInfo.customerCode);
      } else {
        // Create new customer
        // Normalize customerCode before saving
        const normalizedCode = customerInfo.customerCode ? customerInfo.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '') : null;
        await customerRef.set({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          street: customerInfo.street,
          postal: customerInfo.postal,
          city: customerInfo.city,
          note: customerInfo.note,
          customerCode: normalizedCode, // Always store normalized (UPPERCASE, trimmed, no spaces)
          lastOrderDate: customerInfo.lastOrderDate,
          orderCount: customerInfo.orderCount,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ New customer created in Firebase with code:', normalizedCode);
      }
      console.log('Customer saved to Firebase:', customerInfo.email, 'Code:', customerInfo.customerCode);

      // Cache to localStorage ONLY after successful Firebase save (for faster access on same device)
      try {
        const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
        savedCustomers[customerKey] = customerInfo;
        savedCustomers[`phone_${phoneKey}`] = customerInfo; // Also index by phone
        if (customerInfo.customerCode) {
          savedCustomers[`code_${customerInfo.customerCode.toUpperCase()}`] = customerInfo; // Also index by code
        }
        localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
      } catch (e) {
        console.error('Error caching customer to localStorage:', e);
        // Non-critical error - continue even if cache fails
      }
    } catch (e) {
      console.error('Error saving customer to Firebase:', e);
      // Don't cache to localStorage if Firebase save failed
      return null;
    }
  } else {
    // Firebase not available - cannot save
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht gespeichert werden.');
    return null;
  }

  // Return customer info with code for display
  return customerInfo;
}

// Load customer information by email, phone, or customer code (from Firebase - primary source for cross-device sync)
// localStorage chỉ dùng để cache tạm thời trên cùng thiết bị, không đồng bộ giữa các thiết bị
async function loadCustomerInfo(email = null, phone = null, customerCode = null) {
  if (!email && !phone && !customerCode) return null;

  // Primary source: Firebase (đồng bộ giữa tất cả thiết bị)
  if (db) {
    try {
      let customerDoc = null;

      // Try by customer code first (fastest, unique identifier)
      if (customerCode) {
        // Normalize search code exactly like stored codes
        const codeUpper = customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
        console.log('🔍 Searching Firebase for customerCode:', codeUpper);
        console.log('🔍 Original input:', customerCode);

        try {
          // Try query with where clause first (fastest if index exists)
          let querySnapshot;
          try {
            querySnapshot = await db.collection('customers')
              .where('customerCode', '==', codeUpper)
              .limit(1)
              .get();

            if (!querySnapshot.empty) {
              const customerData = querySnapshot.docs[0].data();
              console.log('✅ Customer found by code (query method):', codeUpper);
              return customerData;
            }
          } catch (queryError) {
            // Query failed (likely no index) - will use alternative method below
            console.log('⚠️ Query method failed, using alternative method:', queryError.message);
          }

          // Alternative method: get all and filter (slower but works without index)
          console.log('📋 Fetching all customers and filtering in memory...');
          const allSnapshot = await db.collection('customers').get();
          let foundDoc = null;
          const sampleCodes = [];

          // Try multiple normalization methods to handle different formats
          const normalizeMethods = [
            (code) => code.toString().toUpperCase().trim().replace(/\s+/g, ''), // Standard: UPPERCASE, trim, no spaces
            (code) => code.toString().toUpperCase().trim(), // UPPERCASE, trim only
            (code) => code.toString().trim().replace(/\s+/g, ''), // Trim, no spaces, keep original case
            (code) => code.toString().toUpperCase(), // UPPERCASE only
            (code) => code.toString().trim(), // Trim only
            (code) => code.toString(), // Original
          ];

          const searchNormalized = normalizeMethods[0](codeUpper); // Primary search method

          // Use for...of instead of forEach to allow await
          for (const doc of allSnapshot.docs) {
            const data = doc.data();
            const rawCode = data.customerCode || '';

            if (!rawCode) continue;

            // Try all normalization methods to find match
            let matched = false;
            let matchedMethod = null;

            for (let i = 0; i < normalizeMethods.length; i++) {
              const storedNormalized = normalizeMethods[i](rawCode);
              const searchNormalizedForMethod = normalizeMethods[i](codeUpper);

              if (storedNormalized === searchNormalizedForMethod) {
                matched = true;
                matchedMethod = i;
                foundDoc = doc;
                console.log(`✅ Match found with normalization method ${i}!`, {
                  raw: rawCode,
                  storedNormalized: storedNormalized,
                  searchNormalized: searchNormalizedForMethod,
                  email: data.email
                });

                // If matched with a different normalization method (not method 0), 
                // update Firebase to use the standard format for future searches
                if (i !== 0) {
                  console.log('⚠️ Customer code format mismatch detected. Normalizing in Firebase...');
                  const standardNormalized = normalizeMethods[0](rawCode);
                  try {
                    await doc.ref.update({
                      customerCode: standardNormalized,
                      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ Updated customerCode in Firebase from "${rawCode}" to "${standardNormalized}"`);
                  } catch (updateError) {
                    console.error('❌ Error updating customerCode format in Firebase:', updateError);
                    // Continue anyway - we found the customer
                  }
                }

                break;
              }
            }

            // Debug: Log all codes for comparison
            const comparison = {
              code: rawCode,
              codeType: typeof rawCode,
              codeLength: rawCode.toString().length,
              normalized: normalizeMethods[0](rawCode),
              searchCode: codeUpper,
              searchNormalized: searchNormalized,
              matches: matched,
              matchedMethod: matchedMethod,
              email: data.email,
              docId: doc.id
            };

            sampleCodes.push(comparison);

            // Log if close match (for debugging)
            if (!matched) {
              const storedPrimary = normalizeMethods[0](rawCode);
              if (storedPrimary.length > 0 && searchNormalized.length > 0) {
                if (storedPrimary.includes(searchNormalized) || searchNormalized.includes(storedPrimary)) {
                  console.log('⚠️ Close match found (partial/substring):', comparison);
                } else if (storedPrimary.toLowerCase() === searchNormalized.toLowerCase()) {
                  console.log('⚠️ Case mismatch found:', comparison);
                }
              }
            }
          }

          if (foundDoc) {
            customerDoc = foundDoc;
            console.log('✅ Customer found by code:', codeUpper);
          } else {
            console.warn('⚠️ Customer code not found in customers collection, searching in orders...');
            console.log('📋 Total customers checked:', allSnapshot.size);
            console.log('📋 Customers with codes:', sampleCodes.length);
            console.log('📋 All customer codes in customers collection:', JSON.stringify(sampleCodes, null, 2));

            // Try searching in orders collection as fallback
            // OPTIMIZATION: Only search recent orders (last 200 orders) for speed
            try {
              console.log('📋 Searching in recent orders (last 200 orders for speed)...');
              const ordersSnapshot = await db.collection('orders')
                .orderBy('createdAt', 'desc')
                .limit(200)
                .get();

              for (const orderDoc of ordersSnapshot.docs) {
                const orderData = orderDoc.data();

                // Check customerCode in order root
                if (orderData.customerCode) {
                  const orderCode = orderData.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
                  if (orderCode === codeUpper) {
                    // Extract customer info from order
                    if (orderData.delivery && orderData.delivery.address) {
                      const customerDataFromOrder = {
                        firstName: orderData.delivery.address.firstName || '',
                        lastName: orderData.delivery.address.lastName || '',
                        email: orderData.delivery.address.email || '',
                        phone: orderData.delivery.address.phone || '',
                        street: orderData.delivery.address.street || '',
                        postal: orderData.delivery.address.postal || '',
                        city: orderData.delivery.address.city || '',
                        note: orderData.delivery.address.note || '',
                        customerCode: codeUpper
                      };

                      console.log('✅ Customer code found in orders collection:', codeUpper);

                      // Try to create/update customer record in customers collection for future lookups
                      if (customerDataFromOrder.email) {
                        try {
                          const customerKey = customerDataFromOrder.email.toLowerCase().trim();
                          const customerRef = db.collection('customers').doc(customerKey);
                          await customerRef.set({
                            ...customerDataFromOrder,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                          }, { merge: true });
                          console.log('✅ Created/updated customer record in customers collection');
                        } catch (createError) {
                          console.warn('⚠️ Could not create customer record:', createError);
                        }
                      }

                      return customerDataFromOrder;
                    }
                  }
                }

                // Also check in delivery.address.customerCode
                if (orderData.delivery && orderData.delivery.address && orderData.delivery.address.customerCode) {
                  const orderCode = orderData.delivery.address.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
                  if (orderCode === codeUpper) {
                    // Extract customer info from order
                    if (orderData.delivery && orderData.delivery.address) {
                      const customerDataFromOrder = {
                        firstName: orderData.delivery.address.firstName || '',
                        lastName: orderData.delivery.address.lastName || '',
                        email: orderData.delivery.address.email || '',
                        phone: orderData.delivery.address.phone || '',
                        street: orderData.delivery.address.street || '',
                        postal: orderData.delivery.address.postal || '',
                        city: orderData.delivery.address.city || '',
                        note: orderData.delivery.address.note || '',
                        customerCode: codeUpper
                      };

                      console.log('✅ Customer code found in orders collection:', codeUpper);

                      // Try to create/update customer record in customers collection for future lookups
                      if (customerDataFromOrder.email) {
                        try {
                          const customerKey = customerDataFromOrder.email.toLowerCase().trim();
                          const customerRef = db.collection('customers').doc(customerKey);
                          await customerRef.set({
                            ...customerDataFromOrder,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                          }, { merge: true });
                          console.log('✅ Created/updated customer record in customers collection');
                        } catch (createError) {
                          console.warn('⚠️ Could not create customer record:', createError);
                        }
                      }

                      return customerDataFromOrder;
                    }
                  }
                }
              }
            } catch (ordersError) {
              console.error('❌ Error searching orders collection:', ordersError);
            }

            console.log('🔍 Searching for:', codeUpper);
            console.log('🔍 Search code normalized:', searchNormalized);
            console.log('🔍 Search code length:', searchNormalized.length);

            // Show first few codes for quick reference
            if (sampleCodes.length > 0) {
              console.log('📋 First 5 customer codes in Firebase:', sampleCodes.slice(0, 5).map(c => ({
                raw: c.code,
                normalized: c.normalized,
                length: c.codeLength,
                matches: c.matches
              })));
            }

            return null;
          }
        } catch (queryError) {
          console.error('❌ Error querying Firebase for customerCode:', queryError);
          console.error('Error code:', queryError.code, 'Error message:', queryError.message);
          console.error('Error stack:', queryError.stack);

          // If it's a permission error, throw it so caller can handle with proper message
          if (queryError.code === 'permission-denied' || (queryError.message && queryError.message.includes('permission'))) {
            const permissionError = new Error('Keine Berechtigung zum Lesen der Kundendaten. Bitte überprüfen Sie die Firebase Security Rules für die "customers" Collection.');
            permissionError.code = 'permission-denied';
            throw permissionError;
          }

          // For other errors, also throw so caller can show appropriate message
          throw queryError;
        }
      }

      // Try by email (email is the document ID)
      if ((!customerDoc || !customerDoc.exists) && email) {
        const emailKey = email.toLowerCase().trim();
        customerDoc = await db.collection('customers').doc(emailKey).get();

        // If not found by email and we only have email (no phone/code), return null immediately
        if (!customerDoc.exists && !phone && !customerCode) {
          return null;
        }
      }

      // If not found by email, try by phone (need to query)
      if ((!customerDoc || !customerDoc.exists) && phone) {
        const querySnapshot = await db.collection('customers')
          .where('phone', '==', phone)
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          customerDoc = querySnapshot.docs[0];
        } else {
          // Not found by phone either - return null immediately (don't check localStorage)
          // localStorage is only for caching on same device, not for cross-device sync
          return null;
        }
      }

      // If found in Firebase, return it and cache to localStorage for faster access on same device
      if (customerDoc && customerDoc.exists) {
        const customerData = customerDoc.data();

        // Cache to localStorage for faster access on the same device (optional optimization)
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
          const emailKey = customerData.email.toLowerCase().trim();
          const phoneKey = customerData.phone.replace(/[\s\-\+\(\)]/g, '');
          savedCustomers[emailKey] = customerData;
          savedCustomers[`phone_${phoneKey}`] = customerData;
          if (customerData.customerCode) {
            savedCustomers[`code_${customerData.customerCode.toUpperCase()}`] = customerData;
          }
          localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
        } catch (e) {
          console.error('Error caching customer to localStorage:', e);
        }

        return customerData;
      }

      // Not found in Firebase - return null immediately (don't check localStorage)
      // localStorage is only for caching on same device, not for cross-device sync
      return null;
    } catch (e) {
      console.error('Error loading customer info from Firebase:', e);
      // Only fallback to localStorage if Firebase connection error (not "not found")
      // Check if it's a connection/permission error vs "not found"
      const isConnectionError = e.code === 'unavailable' || e.code === 'permission-denied' || e.code === 'unauthenticated';

      // NO FALLBACK TO LOCALSTORAGE when searching by customerCode
      // customerCode search MUST use Firebase only for cross-device sync
      if (customerCode) {
        console.error('❌ Error loading customer by code from Firebase:', e);
        console.error('Error code:', e.code, 'Error message:', e.message);
        // Don't fallback to localStorage for customerCode - it's device-specific
        return null;
      }

      if (isConnectionError && (email || phone)) {
        // Firebase connection issue - try localStorage as last resort (offline mode)
        // BUT ONLY for email/phone, NOT for customerCode
        console.warn('⚠️ Firebase connection error, trying localStorage fallback for email/phone...');
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');

          if (email) {
            const emailKey = email.toLowerCase().trim();
            if (savedCustomers[emailKey]) {
              return savedCustomers[emailKey];
            }
          }

          if (phone) {
            const phoneKey = phone.replace(/[\s\-\+\(\)]/g, '');
            if (savedCustomers[`phone_${phoneKey}`]) {
              return savedCustomers[`phone_${phoneKey}`];
            }
          }
        } catch (localError) {
          console.error('Error loading customer info from localStorage:', localError);
        }
      }
      // If not a connection error, return null (data not found or other error)
      return null;
    }
  } else {
    // No Firebase available - cannot load customer info (Firebase is required for web app)
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht geladen werden.');
    console.error('❌ Bitte öffnen Sie setup.html zur Konfiguration der Firebase-Datenbank.');
    return null;
  }

  return null;
}

// Auto-fill customer information in form
function autoFillCustomerInfo(customerInfo) {
  if (!customerInfo) return;

  // Fill order form fields
  const firstNameField = document.getElementById('customerFirstName');
  const lastNameField = document.getElementById('customerLastName');
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const streetField = document.getElementById('deliveryStreet');
  const postalField = document.getElementById('deliveryPostal');
  const cityField = document.getElementById('deliveryCity');
  const noteField = document.getElementById('deliveryNote');

  if (firstNameField && !firstNameField.value) firstNameField.value = customerInfo.firstName || '';
  if (lastNameField && !lastNameField.value) lastNameField.value = customerInfo.lastName || '';
  if (emailField && !emailField.value) emailField.value = customerInfo.email || '';
  if (phoneField && !phoneField.value) phoneField.value = customerInfo.phone || '';
  if (streetField && !streetField.value) streetField.value = customerInfo.street || '';
  if (postalField && !postalField.value) postalField.value = customerInfo.postal || '';
  if (cityField && !cityField.value) cityField.value = customerInfo.city || '';
  if (noteField && !noteField.value) noteField.value = customerInfo.note || '';

  // Fill reservation form fields
  const reserveFirstNameField = document.getElementById('reserveFirstNameInPayment');
  const reserveLastNameField = document.getElementById('reserveLastNameInPayment');
  const reserveEmailField = document.getElementById('reserveEmailInPayment');
  const reservePhoneField = document.getElementById('reservePhoneInPayment');

  if (reserveFirstNameField && !reserveFirstNameField.value) reserveFirstNameField.value = customerInfo.firstName || '';
  if (reserveLastNameField && !reserveLastNameField.value) reserveLastNameField.value = customerInfo.lastName || '';
  if (reserveEmailField && !reserveEmailField.value) reserveEmailField.value = customerInfo.email || '';
  if (reservePhoneField && !reservePhoneField.value) reservePhoneField.value = customerInfo.phone || '';
}

// Setup auto-fill listeners for email and phone fields
// BẢO MẬT: Chỉ điền tự động khi CẢ email VÀ phone đều khớp HOẶC có mã khách hàng hợp lệ
function setupCustomerAutoFill() {
  // Only setup if we're on a page with order/reservation forms
  // Check if payment modal or order form exists
  const paymentModal = document.getElementById('paymentModal');
  const deliveryAddressSection = document.getElementById('deliveryAddressSection');

  if (!paymentModal && !deliveryAddressSection) {
    // Not on a page with order forms, skip setup
    return;
  }

  // Order form fields
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const customerCodeField = document.getElementById('customerCode');

  // If no fields exist, skip setup
  if (!emailField && !phoneField && !customerCodeField) {
    return;
  }

  // Track if we've already auto-filled to avoid multiple calls
  let autoFilled = false;

  // Function to auto-fill by customer code (fastest and most secure)
  const checkAndAutoFillByCode = async () => {
    if (autoFilled) return;

    const code = customerCodeField?.value.trim() || '';
    console.log('🔍 Checking customer code - Original:', code);

    // Normalize code (uppercase, trim, remove spaces)
    const codeNormalized = code.toUpperCase().trim().replace(/\s+/g, '');
    console.log('🔍 Checking customer code - Normalized:', codeNormalized);

    // Check if code has valid format (LEO-XXXXXX, where X is alphanumeric)
    if (codeNormalized && codeNormalized.startsWith('LEO-') && codeNormalized.match(/^LEO-[A-Z0-9]+$/)) {
      if (customerCodeField) {
        const originalPlaceholder = customerCodeField.placeholder;
        customerCodeField.placeholder = 'Informationen werden geladen...';
        customerCodeField.disabled = true;

        try {
          console.log('🔍 Searching for customer code in Firebase:', codeNormalized);
          console.log('🔍 Original input:', code);
          const customerInfo = await loadCustomerInfo(null, null, codeNormalized);
          console.log('📋 Customer info result:', customerInfo);

          if (customerInfo) {
            autoFillCustomerInfo(customerInfo);
            showCustomerInfoLoadedNotification('✅ Informationen vom Kunden-Code geladen');
            autoFilled = true;
          } else {
            console.warn('⚠️ Customer code not found:', code);
            showCustomerInfoLoadedNotification('❌ Kunden-Code nicht gefunden. Bitte überprüfen Sie den Code.', true);
          }
        } catch (e) {
          console.error('❌ Error loading customer info by code:', e);
          console.error('Error details:', e.message, e.code, e.stack);

          // Check if it's a permission error
          if (e.code === 'permission-denied') {
            showCustomerInfoLoadedNotification('❌ Keine Berechtigung zum Lesen der Kundendaten. Bitte überprüfen Sie die Firebase Security Rules.', true);
          } else if (e.message && e.message.includes('permission')) {
            showCustomerInfoLoadedNotification('❌ Keine Berechtigung zum Lesen der Kundendaten. Bitte überprüfen Sie die Firebase Security Rules.', true);
          } else {
            showCustomerInfoLoadedNotification('❌ Fehler beim Laden der Informationen. Bitte versuchen Sie es erneut. Fehler: ' + (e.message || e.code || 'Unbekannt'), true);
          }
        } finally {
          customerCodeField.placeholder = originalPlaceholder;
          customerCodeField.disabled = false;
        }
      }
    } else if (code && code.length > 0) {
      // Code entered but format is invalid
      console.warn('⚠️ Invalid customer code format:', code);
      showCustomerInfoLoadedNotification('⚠️ Kunden-Code hat falsches Format (LEO-XXXXXX)', true);
    }
  };

  // Function to check and auto-fill when both email and phone are provided
  const checkAndAutoFill = async () => {
    if (autoFilled) return; // Already auto-filled

    const email = emailField?.value.trim() || '';
    const phone = phoneField?.value.trim() || '';

    // BẢO MẬT: Chỉ điền tự động khi CẢ email VÀ phone đều có và khớp
    if (email && phone) {
      // Show loading indicator
      if (emailField) {
        const originalPlaceholder = emailField.placeholder;
        emailField.placeholder = 'Wird überprüft...';

        try {
          // Load customer info by email
          const customerInfo = await loadCustomerInfo(email);

          if (customerInfo) {
            // BẢO MẬT: Kiểm tra phone có khớp không
            const customerPhoneNormalized = (customerInfo.phone || '').replace(/[\s\-\+\(\)]/g, '');
            const inputPhoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');

            if (customerPhoneNormalized === inputPhoneNormalized) {
              // Email và phone đều khớp → An toàn để điền
              autoFillCustomerInfo(customerInfo);
              // Also fill customer code field if available
              if (customerCodeField && customerInfo.customerCode) {
                customerCodeField.value = customerInfo.customerCode;
              }
              showCustomerInfoLoadedNotification();
              autoFilled = true;
            } else {
              // Phone không khớp → Không điền (có thể là người khác)
              console.log('Telefonnummer stimmt nicht überein, keine automatische Ausfüllung aus Sicherheitsgründen');
            }
          }
        } catch (e) {
          console.error('Error loading customer info:', e);
        } finally {
          emailField.placeholder = originalPlaceholder;
        }
      }
    }
  };

  // Listen to customer code field
  if (customerCodeField) {
    // Auto-fill on blur (when user leaves the field)
    customerCodeField.addEventListener('blur', checkAndAutoFillByCode);
    // Auto-fill on Enter key
    customerCodeField.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAndAutoFillByCode();
      }
    });
    customerCodeField.addEventListener('input', function () {
      // Auto-format to uppercase
      this.value = this.value.toUpperCase();
    });
  }

  if (emailField) {
    emailField.addEventListener('blur', checkAndAutoFill);
  }

  if (phoneField) {
    phoneField.addEventListener('blur', checkAndAutoFill);
  }

  // Reservation form fields
  const reserveEmailField = document.getElementById('reserveEmailInPayment');
  const reservePhoneField = document.getElementById('reservePhoneInPayment');

  let reserveAutoFilled = false;

  const checkAndAutoFillReservation = async () => {
    if (reserveAutoFilled) return;

    const email = reserveEmailField?.value.trim() || '';
    const phone = reservePhoneField?.value.trim() || '';

    if (email && phone) {
      if (reserveEmailField) {
        const originalPlaceholder = reserveEmailField.placeholder;
        reserveEmailField.placeholder = 'Wird überprüft...';

        try {
          const customerInfo = await loadCustomerInfo(email);

          if (customerInfo) {
            const customerPhoneNormalized = (customerInfo.phone || '').replace(/[\s\-\+\(\)]/g, '');
            const inputPhoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');

            if (customerPhoneNormalized === inputPhoneNormalized) {
              autoFillCustomerInfo(customerInfo);
              showCustomerInfoLoadedNotification();
              reserveAutoFilled = true;
            }
          }
        } catch (e) {
          console.error('Error loading customer info:', e);
        } finally {
          reserveEmailField.placeholder = originalPlaceholder;
        }
      }
    }
  };

  if (reserveEmailField) {
    reserveEmailField.addEventListener('blur', checkAndAutoFillReservation);
  }

  if (reservePhoneField) {
    reservePhoneField.addEventListener('blur', checkAndAutoFillReservation);
  }
}

// Show notification when customer info is loaded
function showCustomerInfoLoadedNotification(message = '✅ Informationen wurden automatisch ausgefüllt', isError = false) {
  // Create a subtle notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = message;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==================== END CUSTOMER INFORMATION MANAGEMENT ====================

// Save order to Firebase (primary database)
async function saveOrderToFirebase(orderData) {
  // Use getDb() helper to get db instance
  const dbInstance = getDb();
  if (!dbInstance) {
    console.error('❌ Firebase wurde noch nicht eingerichtet. Bitte öffnen Sie setup.html zur Konfiguration.');
    console.error('❌ window.db:', typeof window !== 'undefined' ? window.db : 'window undefined');
    // Silent fail - don't show alert to customer
    return;
  }

  try {
    // Save to Firebase Firestore
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Log customer code before saving
    console.log('💾 Saving order to Firebase:', orderData.order_id, {
      'customerCode (root)': orderData.customerCode,
      'customerCode (delivery.address)': orderData.delivery?.address?.customerCode,
      'Has customerCode': !!orderData.customerCode
    });

    await dbInstance.collection('orders').doc(orderData.order_id).set({
      ...orderData,
      date: today, // Add date field for easier filtering
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Order saved to Firebase successfully:', orderData.order_id);
    console.log('📋 Order data:', {
      order_id: orderData.order_id,
      status: orderData.status,
      service_type: orderData.service_type,
      total: orderData.summary?.total,
      item_count: orderData.summary?.item_count,
      customerCode: orderData.customerCode || orderData.delivery?.address?.customerCode || 'NOT FOUND'
    });
  } catch (error) {
    console.error('❌ Failed to save order to Firebase:', error);
    console.error('Error details:', error.message, error.code, error.stack);
    // Silent fail - don't show alert to customer
  }
}

// Get order from Firebase
async function getOrderFromFirebase(orderId) {
  const dbInstance = getDb();
  if (!dbInstance) return null;

  try {
    const doc = await dbInstance.collection('orders').doc(orderId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Failed to get order from Firebase:', error);
    return null;
  }
}

// Get all orders from Firebase
async function getAllOrdersFromFirebase(date = null) {
  const db = typeof window !== 'undefined' ? window.db : null;
  if (!db) {
    console.warn('Firebase db is not initialized');
    return [];
  }

  try {
    console.log('Fetching orders from Firebase...');
    const snapshot = await db.collection('orders').get();
    console.log('Snapshot size:', snapshot.size);

    let orders = [];
    snapshot.forEach(doc => {
      const orderData = doc.data();
      orderData._id = doc.id; // Keep document ID
      orders.push(orderData);
    });

    console.log('Total orders fetched:', orders.length);

    // Filter by date if provided
    if (date) {
      const beforeFilter = orders.length;
      orders = orders.filter(order => {
        // Try to get date from order.date field first
        if (order.date) {
          return order.date === date;
        }
        // If no date field, try to extract from createdAt timestamp
        if (order.createdAt) {
          let orderDate;
          try {
            if (order.createdAt.seconds !== undefined) {
              // Firestore Timestamp object with seconds
              orderDate = new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0];
            } else if (order.createdAt.toDate && typeof order.createdAt.toDate === 'function') {
              // Firestore Timestamp with toDate method
              orderDate = order.createdAt.toDate().toISOString().split('T')[0];
            } else if (typeof order.createdAt === 'string') {
              // ISO string
              orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            } else if (order.createdAt instanceof Date) {
              // Date object
              orderDate = order.createdAt.toISOString().split('T')[0];
            } else {
              // Try to parse as Date
              orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            }
            return orderDate === date;
          } catch (e) {
            console.warn('Error parsing date for order:', order.order_id, e);
            // If can't parse date, include it for today (better to show than hide)
            return true;
          }
        }
        // If no date info, include it (better to show than hide)
        return true;
      });
      console.log(`Filtered orders for ${date}: ${beforeFilter} -> ${orders.length}`);
    }

    // Sort by timestamp (newest first)
    orders.sort((a, b) => {
      let timeA = 0;
      let timeB = 0;

      // Get timeA
      if (a.createdAt?.seconds !== undefined) {
        timeA = a.createdAt.seconds;
      } else if (a.createdAt?.toDate) {
        timeA = a.createdAt.toDate().getTime() / 1000;
      } else if (a.summary?.timestamp) {
        timeA = new Date(a.summary.timestamp).getTime() / 1000;
      }

      // Get timeB
      if (b.createdAt?.seconds !== undefined) {
        timeB = b.createdAt.seconds;
      } else if (b.createdAt?.toDate) {
        timeB = b.createdAt.toDate().getTime() / 1000;
      } else if (b.summary?.timestamp) {
        timeB = new Date(b.summary.timestamp).getTime() / 1000;
      }

      return timeB - timeA;
    });

    console.log('Orders sorted, returning:', orders.length);
    return orders;
  } catch (error) {
    console.error('Failed to get orders from Firebase:', error);
    console.error('Error details:', error.message, error.code, error.stack);
    throw error; // Re-throw to let caller handle it
  }
}

// Save order to Google Sheets (backup - optional)
async function saveOrderToGoogleSheets(orderData) {
  const googleSheetsConfig = getGoogleSheetsConfig();
  if (!googleSheetsConfig || !googleSheetsConfig.WEB_APP_URL || googleSheetsConfig.WEB_APP_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
    console.warn('Google Sheets Web App URL not configured. Order will only be saved to localStorage.');
    return;
  }

  try {
    // Prepare data for Google Sheets
    const sheetData = {
      action: 'appendOrder',
      sheetName: googleSheetsConfig.ORDERS_SHEET_NAME,
      data: {
        order_id: orderData.order_id,
        status: orderData.status || 'pending',
        created_at: orderData.createdAt || new Date().toISOString(),
        customer_first_name: orderData.delivery?.address?.firstName || '',
        customer_last_name: orderData.delivery?.address?.lastName || '',
        customer_phone: orderData.delivery?.address?.phone || '',
        customer_email: orderData.delivery?.address?.email || '',
        customer_street: orderData.delivery?.address?.street || '',
        customer_postal: orderData.delivery?.address?.postal || '',
        customer_city: orderData.delivery?.address?.city || '',
        customer_note: orderData.delivery?.address?.note || '',
        service_type: orderData.service_type || 'delivery',
        table_number: orderData.table_number || '',
        payment_method: orderData.summary?.payment_method || 'cash',
        item_count: orderData.summary?.item_count || 0,
        subtotal: orderData.summary?.subtotal || '0.00',
        delivery_fee: orderData.summary?.delivery_fee || '0.00',
        total: orderData.summary?.total || '0.00',
        items_json: JSON.stringify(orderData.items || []),
        full_data_json: JSON.stringify(orderData)
      }
    };

    // Send to Google Sheets via Web App
    await fetch(getGoogleSheetsConfig().WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script doesn't support CORS, use no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData)
    });

    console.log('Order saved to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to save order to Google Sheets:', error);
    // Don't block order creation if Google Sheets fails
  }
}

// Send order data to admin for database/management (separate from confirmation email)
function sendOrderDataToAdmin(orderData) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Cannot send order data to admin.');
    return;
  }

  // Create a structured data email for admin to import into database
  const orderDataJSON = JSON.stringify(orderData, null, 2);

  const emailjsConfig = getEmailjsConfig();
  if (!emailjsConfig) {
    console.warn('⚠️ EMAILJS_CONFIG not found. Skipping email notification.');
    return;
  }

  const templateParams = {
    to_email: emailjsConfig.OWNER_EMAIL,
    subject: `[LEO SUSHI] New Order Data: ${orderData.order_id}`,
    order_id: orderData.order_id,
    order_data: orderDataJSON,
    order_date: orderData.createdAt || new Date().toISOString(),
    customer_name: `${orderData.delivery?.address?.firstName || ''} ${orderData.delivery?.address?.lastName || ''}`.trim(),
    customer_phone: orderData.delivery?.address?.phone || '',
    customer_email: orderData.delivery?.address?.email || '',
    total_amount: orderData.summary?.total || '0.00',
    payment_method: orderData.summary?.payment_method || 'cash',
    service_type: orderData.service_type || 'delivery',
    item_count: orderData.summary?.item_count || 0,
    status: orderData.status || 'pending'
  };

  // Use the existing template (you may want to create a separate template for order data)
  emailjs.send(
    emailjsConfig.SERVICE_ID,
    emailjsConfig.TEMPLATE_ID,
    templateParams
  ).then(
    () => {
      console.log('Order data sent to admin successfully');
    },
    (error) => {
      console.error('Failed to send order data to admin:', error);
    }
  );
}

// Send order confirmation email using EmailJS
function sendOrderEmail(orderData, deliveryAddress) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Please configure EmailJS in script.js');
    return;
  }

  // Format order items for email
  const itemsList = orderData.items.map(item =>
    `- ${item.name} x${item.quantity} = €${item.total}`
  ).join('\n');

  const addressText = `${deliveryAddress.street}, ${deliveryAddress.postal} ${deliveryAddress.city}${deliveryAddress.note ? `\nHinweise: ${deliveryAddress.note}` : ''}`;
  let paymentMethodText = 'Barzahlung';
  if (orderData.summary.payment_method === 'card') {
    paymentMethodText = 'Kartenzahlung';
  } else if (orderData.summary.payment_method === 'paypal') {
    paymentMethodText = 'PayPal';
  }
  const orderTime = new Date(orderData.summary.timestamp).toLocaleString('de-DE');
  const orderId = `ORD-${Date.now()}`;

  // Validate owner email
  if (!getEmailjsConfig().OWNER_EMAIL || getEmailjsConfig().OWNER_EMAIL.trim() === '') {
    console.error('❌ OWNER_EMAIL is empty! Please check EMAILJS_CONFIG in script.js');
    return;
  }

  // Prepare email template parameters
  const templateParams = {
    to_email: getEmailjsConfig().OWNER_EMAIL.trim(),
    reply_to: deliveryAddress.email || getEmailjsConfig().OWNER_EMAIL,
    order_id: orderId,
    order_time: orderTime,
    items: itemsList,
    item_count: orderData.summary.item_count,
    subtotal: `€${orderData.summary.subtotal}`,
    delivery_fee: `€${orderData.summary.delivery_fee}`,
    total: `€${orderData.summary.total}`,
    payment_method: paymentMethodText,
    delivery_address: addressText,
    customer_phone: deliveryAddress.phone || 'Nicht angegeben',
    customer_email: deliveryAddress.email || 'Nicht angegeben',
    customer_note: deliveryAddress.note || 'Keine'
  };

  // Debug: Log configuration
  console.log('📧 Sending order email...');
  console.log('Service ID:', getEmailjsConfig().SERVICE_ID);
  console.log('Template ID:', getEmailjsConfig().TEMPLATE_ID);
  console.log('To Email:', getEmailjsConfig().OWNER_EMAIL);
  console.log('Template Params:', templateParams);
  console.log('⚠️ QUAN TRỌNG: Đảm bảo template trong EmailJS có field "To Email" = {{to_email}}');

  // Send email
  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().TEMPLATE_ID,
    templateParams
  )
    .then((response) => {
      console.log('✅ Order email sent successfully!', response.status, response.text);
      console.log('Response:', response);
    })
    .catch((error) => {
      console.error('❌ Failed to send order email:', error);
      console.error('Error details:', error.text || error);
      // Still show success message even if email fails
    });
}

// Send order confirmation email to customer
function sendCustomerConfirmationEmail(orderData, deliveryAddress, isAdminConfirmed = false, customEstimatedTime = null) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Please configure EmailJS in script.js');
    return;
  }

  if (!deliveryAddress.email) {
    console.warn('Customer email not provided');
    return;
  }

  // Format order items for email
  const itemsList = orderData.items.map(item =>
    `- ${item.name} x${item.quantity} = €${item.total}`
  ).join('\n');

  const addressText = `${deliveryAddress.street}, ${deliveryAddress.postal} ${deliveryAddress.city}${deliveryAddress.note ? `\nHinweise: ${deliveryAddress.note}` : ''}`;
  let paymentMethodText = 'Barzahlung';
  if (orderData.summary.payment_method === 'card') {
    paymentMethodText = 'Kartenzahlung';
  } else if (orderData.summary.payment_method === 'paypal') {
    paymentMethodText = 'PayPal';
  }

  // Get order time
  let orderTime = '';
  if (orderData.summary?.timestamp) {
    orderTime = new Date(orderData.summary.timestamp).toLocaleString('de-DE');
  } else if (orderData.createdAt) {
    if (orderData.createdAt.seconds) {
      orderTime = new Date(orderData.createdAt.seconds * 1000).toLocaleString('de-DE');
    } else if (orderData.createdAt.toDate) {
      orderTime = orderData.createdAt.toDate().toLocaleString('de-DE');
    } else {
      orderTime = new Date(orderData.createdAt).toLocaleString('de-DE');
    }
  } else {
    orderTime = new Date().toLocaleString('de-DE');
  }

  // Use custom estimated time if provided, otherwise calculate default (15-30 minutes)
  let estimatedTimeText = '';
  if (customEstimatedTime) {
    estimatedTimeText = customEstimatedTime;
  } else if (isAdminConfirmed) {
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + (orderData.service_type === 'delivery' ? 30 : 15));
    estimatedTimeText = estimatedTime.toLocaleString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const orderId = orderData.order_id || `ORD-${Date.now()}`;

  // Validate customer email
  if (!deliveryAddress.email || deliveryAddress.email.trim() === '') {
    console.error('❌ Customer email is empty! Cannot send confirmation email.');
    return;
  }

  // Prepare confirmation message with estimated time
  let confirmationMessage = '';
  if (isAdminConfirmed && estimatedTimeText) {
    if (orderData.service_type === 'delivery') {
      confirmationMessage = `Ihre Bestellung wurde bestätigt und wird voraussichtlich um ${estimatedTimeText} Uhr geliefert.`;
    } else if (orderData.service_type === 'pickup') {
      confirmationMessage = `Ihre Bestellung wurde bestätigt und wird voraussichtlich um ${estimatedTimeText} Uhr bereit sein.`;
    } else {
      confirmationMessage = `Ihre Bestellung wurde bestätigt und wird voraussichtlich um ${estimatedTimeText} Uhr fertig sein.`;
    }
  } else if (isAdminConfirmed) {
    confirmationMessage = 'Ihre Bestellung wurde bestätigt.';
  } else {
    confirmationMessage = 'Ihre Bestellung wird bearbeitet. Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung bestätigt wurde.';
  }

  // Get customer code from order data or delivery address (check multiple sources)
  const customerCode = orderData.delivery?.address?.customerCode ||
    deliveryAddress.customerCode ||
    orderData.customerCode ||
    orderData.customer_code ||
    '';

  console.log('📧 Customer code for email:', {
    fromOrderDeliveryAddress: orderData.delivery?.address?.customerCode,
    fromDeliveryAddress: deliveryAddress.customerCode,
    fromOrderData: orderData.customerCode,
    final: customerCode
  });

  // Prepare email template parameters for customer
  const templateParams = {
    to_email: deliveryAddress.email.trim(),
    reply_to: getEmailjsConfig().OWNER_EMAIL,
    customer_name: `${deliveryAddress.firstName || ''} ${deliveryAddress.lastName || ''}`.trim() || 'Liebe/r Kunde/in',
    customer_phone: deliveryAddress.phone || '',
    customer_email: deliveryAddress.email.trim(),
    customer_code: customerCode,
    order_id: orderId,
    order_time: orderTime,
    estimated_time: estimatedTimeText || '',
    is_confirmed: isAdminConfirmed ? 'Ja' : 'Nein',
    confirmation_message: confirmationMessage,
    items: itemsList,
    item_count: orderData.summary.item_count,
    subtotal: `€${orderData.summary.subtotal}`,
    delivery_fee: `€${orderData.summary.delivery_fee}`,
    total: `€${orderData.summary.total}`,
    payment_method: paymentMethodText,
    delivery_address: addressText,
    service_type: orderData.service_type === 'delivery' ? 'Lieferung' : orderData.service_type === 'pickup' ? 'Abholung' : 'Reservierung',
    restaurant_name: 'LEO SUSHI',
    restaurant_address: 'Florastraße 10A, 13187 Berlin',
    restaurant_phone: '+49 30 37476736',
    restaurant_email: getEmailjsConfig().OWNER_EMAIL
  };

  // Validate email before sending
  if (!templateParams.to_email || templateParams.to_email.trim() === '') {
    console.error('❌ Cannot send email: to_email is empty!');
    console.error('Delivery address:', deliveryAddress);
    alert('Fehler: Kunden-E-Mail-Adresse nicht gefunden. Bitte überprüfen Sie die Bestellinformationen.');
    return;
  }

  // Debug: Log configuration
  console.log('📧 Sending customer confirmation email...');
  console.log('Service ID:', getEmailjsConfig().SERVICE_ID);
  console.log('Template ID:', getEmailjsConfig().CUSTOMER_TEMPLATE_ID || getEmailjsConfig().TEMPLATE_ID);
  console.log('To Email:', templateParams.to_email);
  console.log('Template Params:', templateParams);
  console.log('⚠️ WICHTIG: Stellen Sie sicher, dass die EmailJS-Vorlage ein Feld "To Email" hat, das mit {{to_email}} verknüpft ist');
  console.log('📝 EmailJS Setup-Anleitung:');
  console.log('   1. Gehen Sie zu EmailJS Dashboard → Email Templates');
  console.log('   2. Wählen Sie Ihre Vorlage');
  console.log('   3. Im Bereich "Variables" Feld hinzufügen:');
  console.log('      - Feldname: "To Email" (oder "to_email")');
  console.log('      - Variable: {{to_email}}');
  console.log('   4. Vorlage speichern');

  // Send email to customer using customer template
  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().CUSTOMER_TEMPLATE_ID || getEmailjsConfig().TEMPLATE_ID, // Fallback to owner template if customer template not set
    templateParams
  )
    .then((response) => {
      console.log('✅ Customer confirmation email sent successfully!', response.status, response.text);
      console.log('Response:', response);
    })
    .catch((error) => {
      console.error('❌ Failed to send customer confirmation email:', error);
      console.error('Error code:', error.status);
      console.error('Error text:', error.text);

      // Show user-friendly error message
      if (error.text && error.text.includes('recipients address is empty')) {
        alert('❌ E-Mail-Fehler: EmailJS konnte die Empfängeradresse nicht finden.\n\n' +
          'Bitte:\n' +
          '1. Gehen Sie zu EmailJS Dashboard → Email Templates\n' +
          '2. Wählen Sie Ihre Vorlage\n' +
          '3. Fügen Sie Feld "To Email" hinzu und verknüpfen Sie es mit {{to_email}}\n' +
          '4. Speichern Sie die Vorlage und versuchen Sie es erneut\n\n' +
          'Siehe Konsole (F12) für weitere Details.');
      } else {
        console.error('Full error:', error);
      }
      // Still show success message even if email fails
    });
}

// Get daily revenue report
function getDailyRevenueReport(date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const dailyOrdersKey = `leo_daily_orders_${targetDate}`;
  const orders = JSON.parse(localStorage.getItem(dailyOrdersKey) || '[]');

  const report = {
    date: targetDate,
    total_orders: orders.length,
    total_revenue: 0,
    total_items: 0,
    payment_methods: {
      cash: 0,
      card: 0,
      paypal: 0
    },
    orders: orders
  };

  orders.forEach(order => {
    report.total_revenue += parseFloat(order.summary.total);
    report.total_items += order.summary.item_count;
    if (order.summary.payment_method === 'cash') {
      report.payment_methods.cash += parseFloat(order.summary.total);
    } else if (order.summary.payment_method === 'card') {
      report.payment_methods.card += parseFloat(order.summary.total);
    } else if (order.summary.payment_method === 'paypal') {
      report.payment_methods.paypal += parseFloat(order.summary.total);
    }
  });

  report.total_revenue = report.total_revenue.toFixed(2);
  report.payment_methods.cash = report.payment_methods.cash.toFixed(2);
  report.payment_methods.card = report.payment_methods.card.toFixed(2);
  report.payment_methods.paypal = report.payment_methods.paypal.toFixed(2);

  return report;
}

// Send daily revenue report email
function sendDailyReportEmail(date = null) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Please configure EmailJS in script.js');
    return;
  }

  const report = getDailyRevenueReport(date);

  if (report.total_orders === 0) {
    console.log('No orders for this date');
    return;
  }

  const reportText = `
Tagesumsatzbericht für ${report.date}

Gesamtanzahl Bestellungen: ${report.total_orders}
Gesamtanzahl Gerichte: ${report.total_items}
Gesamtumsatz: €${report.total_revenue}

Zahlungsmethoden:
- Bar: €${report.payment_methods.cash}
- Karte: €${report.payment_methods.card}
- PayPal: €${report.payment_methods.paypal}

Bestelldetails:
${report.orders.map((order, index) => `
Bestellung ${index + 1} (${order.order_id || 'N/A'}):
- Anzahl Gerichte: ${order.summary.item_count}
- Gesamtbetrag: €${order.summary.total}
- Zahlungsmethode: ${order.summary.payment_method === 'cash' ? 'Bar' : (order.summary.payment_method === 'card' ? 'Karte' : 'PayPal')}
- Zeit: ${new Date(order.summary.timestamp).toLocaleString('de-DE')}
`).join('\n')}
  `;

  const templateParams = {
    to_email: getEmailjsConfig().OWNER_EMAIL,
    report_date: report.date,
    report_content: reportText,
    total_orders: report.total_orders,
    total_revenue: `€${report.total_revenue}`,
    cash_total: `€${report.payment_methods.cash}`,
    card_total: `€${report.payment_methods.card}`,
    paypal_total: `€${report.payment_methods.paypal}`
  };

  // You'll need to create a separate template for daily reports in EmailJS
  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().TEMPLATE_ID, // You can create a separate template for reports
    templateParams
  )
    .then((response) => {
      console.log('Daily report email sent successfully!', response.status, response.text);
    })
    .catch((error) => {
      console.error('Failed to send daily report email:', error);
    });
}

// Auto-send daily report at end of day (22:00)
function setupDailyReportScheduler() {
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(22, 0, 0, 0); // 22:00

  // If target time has passed today, schedule for tomorrow
  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  const timeUntilReport = targetTime.getTime() - now.getTime();

  setTimeout(() => {
    sendDailyReportEmail();
    // Schedule for next day
    setInterval(() => {
      sendDailyReportEmail();
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }, timeUntilReport);

  console.log(`Daily report scheduled for ${targetTime.toLocaleString('de-DE')}`);
}

// Show beautiful order success notification
function showOrderSuccessNotification(orderData, deliveryAddress, orderId) {
  // Create notification modal
  const notification = document.createElement('div');
  notification.className = 'order-success-notification';
  notification.id = 'orderSuccessNotification';
  notification.innerHTML = `
    <div class="order-success-content">
      <div class="order-success-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="url(#successGradient)"/>
          <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stop-color="#10b981"/>
              <stop offset="100%" stop-color="#059669"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 class="order-success-title">Bestellung erfolgreich!</h2>
      <p class="order-success-message">
        Vielen Dank für Ihre Bestellung!<br>
        Ihre Bestellnummer: <strong>${orderId.replace('ORD-', '')}</strong>
      </p>
      ${deliveryAddress.customerCode ? `
      <div class="customer-code-display" style="background: rgba(229,207,142,.1); border: 2px solid rgba(229,207,142,.3); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: rgba(255,255,255,.7); font-size: 13px; margin-bottom: 8px;">🔑 Ihr Kunden-Code:</div>
        <div style="color: var(--gold); font-size: 24px; font-weight: 700; letter-spacing: 2px; font-family: monospace;">${deliveryAddress.customerCode}</div>
        <div style="color: rgba(255,255,255,.6); font-size: 12px; margin-top: 8px;">Speichern Sie diesen Code für schnellere Bestellungen in Zukunft!</div>
      </div>
      ` : ''}
      <div class="order-success-details">
        <div class="success-detail-item">
          <span class="success-detail-label">Artikel:</span>
          <span class="success-detail-value">${orderData.summary.item_count}</span>
        </div>
        <div class="success-detail-item">
          <span class="success-detail-label">Gesamt:</span>
          <span class="success-detail-value">€${orderData.summary.total}</span>
        </div>
        <div class="success-detail-item">
          <span class="success-detail-label">Status:</span>
          <span class="success-detail-value" style="color: var(--gold);">Wird bearbeitet</span>
        </div>
      </div>
      <p class="order-success-note">
        Sie erhalten in Kürze eine Bestätigungs-E-Mail.<br>
        Wir werden Sie über den Status Ihrer Bestellung informieren.
      </p>
      <div class="order-success-email-reminder">
        <div class="email-reminder-icon">📧</div>
        <div class="email-reminder-text">
          <strong>Bitte überprüfen Sie Ihr E-Mail-Postfach!</strong><br>
          <span>Die Bestätigungs-E-Mail wurde an <strong>${deliveryAddress.email || 'Ihre E-Mail-Adresse'}</strong> gesendet.</span>
        </div>
      </div>
      <button class="order-success-btn" onclick="closeOrderSuccessNotification()">Verstanden</button>
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById('orderSuccessNotificationStyles')) {
    const style = document.createElement('style');
    style.id = 'orderSuccessNotificationStyles';
    style.textContent = `
      .order-success-notification {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .order-success-content {
        background: linear-gradient(180deg, #1a1a1a, #0f0f11);
        border: 1px solid rgba(229, 207, 142, 0.2);
        border-radius: 24px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.4s ease;
      }
      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .order-success-icon {
        margin: 0 auto 24px;
        animation: scaleIn 0.5s ease 0.2s both;
      }
      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      .order-success-title {
        font-family: "Playfair Display", serif;
        font-size: 32px;
        color: #fff;
        margin: 0 0 16px;
        font-weight: 700;
      }
      .order-success-message {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px;
      }
      .order-success-message strong {
        color: var(--gold);
        font-weight: 600;
      }
      .order-success-details {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 20px;
        margin: 0 0 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .success-detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .success-detail-item:last-child {
        border-bottom: none;
      }
      .success-detail-label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
      }
      .success-detail-value {
        color: #fff;
        font-weight: 600;
        font-size: 16px;
      }
      .order-success-note {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 20px;
      }
      .order-success-email-reminder {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin: 0 0 24px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        animation: slideIn 0.4s ease 0.3s both;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .email-reminder-icon {
        font-size: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .email-reminder-text {
        flex: 1;
        text-align: left;
      }
      .email-reminder-text strong {
        color: #10b981;
        font-size: 15px;
        display: block;
        margin-bottom: 6px;
      }
      .email-reminder-text span {
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        line-height: 1.5;
      }
      .email-reminder-text span strong {
        color: var(--gold);
        font-size: 13px;
        display: inline;
        margin: 0;
      }
      .order-success-btn {
        background: linear-gradient(180deg, var(--gold), var(--gold-2));
        color: #1a1a1a;
        border: none;
        padding: 14px 32px;
        border-radius: 100px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
      }
      .order-success-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(194, 163, 85, 0.3);
      }
      @media (max-width: 640px) {
        .order-success-content {
          padding: 32px 24px;
        }
        .order-success-title {
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto close after 10 seconds
  setTimeout(() => {
    closeOrderSuccessNotification();
  }, 10000);
}

// Close order success notification
function closeOrderSuccessNotification() {
  const notification = document.getElementById('orderSuccessNotification');
  if (notification) {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

// Make function globally available
window.closeOrderSuccessNotification = closeOrderSuccessNotification;

// Generate and show print bills (customer receipt and kitchen ticket)
// estimatedTimeText: geplante Liefer- / Abholzeit aus dem Admin (z.B. "15:30")
function showPrintBills(orderData, deliveryAddress, orderId, estimatedTimeText = '') {
  // Create print window
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    alert('Bitte erlauben Sie Pop-ups, um die Rechnung zu drucken.');
    return;
  }

  // Generate customer receipt HTML
  const customerReceipt = generateCustomerReceipt(orderData, deliveryAddress, orderId, estimatedTimeText);

  // Generate kitchen ticket HTML
  const kitchenTicket = generateKitchenTicket(orderData, deliveryAddress, orderId, estimatedTimeText);

  // Combine both bills
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rechnung - ${orderId}</title>
      <style>
        @media print {
          body { margin: 0; padding: 0; }
          .bill-page { page-break-after: always; margin-bottom: 0; }
          .bill-page:last-child { page-break-after: auto; }
          .no-print { display: none !important; }
          @page { margin: 0; }
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          margin: 0;
          padding: 20px;
          background: #f5f5f5;
        }
        .bill-page {
          background: white;
          width: 80mm;
          max-width: 300px;
          margin: 0 auto 20px;
          padding: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .bill-header {
          text-align: center;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .restaurant-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .restaurant-info {
          font-size: 10px;
          line-height: 1.4;
        }
        .bill-section {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px dashed #ccc;
        }
        .bill-section:last-child {
          border-bottom: none;
        }
        .section-title {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
          font-size: 11px;
        }
        .customer-info {
          font-size: 11px;
          line-height: 1.6;
        }
        .items-list {
          margin: 8px 0;
        }
        .item-row {
          margin: 5px 0;
          font-size: 11px;
        }
        .item-name {
          font-weight: bold;
        }
        .item-option {
          margin-left: 15px;
          font-size: 10px;
          color: #555;
        }
        .item-note {
          margin-left: 15px;
          font-size: 9px;
          color: #666;
          font-style: italic;
        }
        .special-note {
          background: #fff3cd;
          padding: 8px;
          margin: 10px 0;
          border-left: 3px solid #ffc107;
          font-size: 10px;
          line-height: 1.4;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 11px;
        }
        .summary-total {
          font-weight: bold;
          font-size: 13px;
          border-top: 2px solid #000;
          padding-top: 5px;
          margin-top: 5px;
        }
        .payment-info {
          text-align: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #000;
          font-size: 11px;
        }
        .print-buttons {
          text-align: center;
          margin: 20px 0;
        }
        .print-btn {
          background: #C2A355;
          color: #1a1a1a;
          border: none;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          margin: 0 10px;
        }
        .print-btn:hover {
          background: #D2B365;
        }
        .bill-type-label {
          text-align: center;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 10px;
          padding: 5px;
          background: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <div class="print-buttons no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Beide Rechnungen drucken</button>
        <button class="print-btn" onclick="window.close()">Schließen</button>
      </div>
      
      ${customerReceipt}
      ${kitchenTicket}
      
      <script>
        // Auto-print after a short delay
        setTimeout(() => {
          window.print();
        }, 500);
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}

// Make functions globally available for admin panel
window.showPrintBills = showPrintBills;
window.sendCustomerConfirmationEmail = sendCustomerConfirmationEmail;

// Generate customer receipt HTML
// estimatedTimeText: geplante Liefer- / Abholzeit aus dem Admin (z.B. "15:30")
function generateCustomerReceipt(orderData, deliveryAddress, orderId, estimatedTimeText = '') {
  const now = new Date();
  // Zeitstempel für die Kundenrechnung (z.B. "09.11.2025, 15:59")
  const orderTime = now.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const paymentMethodText = orderData.summary.payment_method === 'cash'
    ? 'Barzahlung'
    : 'Kartenzahlung';

  // Helper function to format price (remove any existing € and format with German locale)
  const formatPrice = (price) => {
    // Remove any existing currency symbols and whitespace
    let num = typeof price === 'string' ? price.replace(/[€\s,]/g, '').replace('.', '.') : price;
    num = parseFloat(num) || 0;
    // Format with German locale (comma as decimal separator)
    return num.toFixed(2).replace('.', ',');
  };

  // Calculate VAT (7% included)
  const subtotalStr = typeof orderData.summary.subtotal === 'string'
    ? orderData.summary.subtotal.replace(/[€\s,]/g, '').replace(',', '.')
    : orderData.summary.subtotal;
  const subtotal = parseFloat(subtotalStr) || 0;
  const vatAmount = (subtotal * 7 / 107);

  // Format items
  let itemsHTML = '';
  orderData.items.forEach(item => {
    // Check if item name contains option (format: "Item Name - Option Name")
    const nameParts = item.name.split(' - ');
    const itemName = nameParts[0];
    const optionName = nameParts.length > 1 ? nameParts[1] : null;

    // Format item total (remove any existing €)
    const itemTotal = formatPrice(item.total || (item.price * item.quantity || 0));

    itemsHTML += `
      <div class="item-row">
        <div class="item-name">${item.quantity || item.qty || 1}x ${itemName}</div>
        ${optionName ? `<div class="item-option">${optionName}</div>` : ''}
        ${item.description && !optionName ? `<div class="item-option">${item.description}</div>` : ''}
        ${item.note ? `<div class="item-note">Hinweis: ${item.note}</div>` : ''}
        <div style="text-align: right; margin-top: 2px;">€${itemTotal}</div>
      </div>
    `;
  });

  // Get logo URL - use absolute path for print window
  // If pathname is like /menu.html, get base path, otherwise use root
  let basePath = '';
  if (window.location.pathname && window.location.pathname !== '/') {
    const pathParts = window.location.pathname.split('/');
    pathParts.pop(); // Remove filename
    basePath = pathParts.join('/');
  }
  const logoUrl = window.location.origin + basePath + '/assets/logo.png';

  return `
    <div class="bill-page">
      <div class="bill-type-label">KUNDENRECHNUNG</div>
      <div class="bill-header">
        <img src="${logoUrl}" alt="Leo Sushi" onerror="console.error('Logo not found:', this.src); this.style.display='none'" style="max-width: 80px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
        <div class="restaurant-name">Leo Sushi</div>
        <div class="restaurant-info">
          Florastraße 10A<br>
          13187 Berlin<br>
          +49 30 37476736
        </div>
      </div>
      
      <div class="bill-section">
        <div class="order-info">
          <span>${orderData.service_type === 'pickup' ? 'Abholung' : 'Lieferung'}</span>
        </div>
        ${estimatedTimeText ? `
        <div class="order-info">
          <span>Geplante Zeit:</span>
          <span>${estimatedTimeText} Uhr</span>
        </div>
        ` : ''}
        ${orderData.table_number ? `
        <div class="order-info">
          <span>Tisch: ${orderData.table_number}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="bill-section">
        <div class="section-title">Kundendaten</div>
        <div class="customer-info">
          Vorname: ${deliveryAddress.firstName || '-'}<br>
          Nachname: ${deliveryAddress.lastName || '-'}<br>
          Telefon: ${deliveryAddress.phone || '-'}
          ${orderData.service_type === 'delivery' ? `<br>Adresse: ${deliveryAddress.street || ''}, ${deliveryAddress.postal || ''} ${deliveryAddress.city || ''}` : ''}
        </div>
      </div>
      
      <div class="bill-section">
        <div class="section-title">Artikel</div>
        <div class="items-list">
          ${itemsHTML}
        </div>
        ${deliveryAddress.note ? `
          <div class="special-note">
            <strong>Hinweis:</strong><br>
            ${deliveryAddress.note}
          </div>
        ` : ''}
      </div>
      
      <div class="bill-section">
        <div class="summary-row">
          <span>Zwischensumme:</span>
          <span>${formatPrice(orderData.summary.subtotal)} €</span>
        </div>
        <div class="summary-row">
          <span>MwSt./USt. (7% inkl.):</span>
          <span>${formatPrice(vatAmount)} €</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total:</span>
          <span>${formatPrice(orderData.summary.total)} €</span>
        </div>
      </div>
      
      <div class="payment-info">
        ${paymentMethodText === 'Barzahlung' ? 'Barzahlung' : (orderData.service_type === 'pickup' ? 'Karte beim Abholen' : 'Kartenzahlung')}
      </div>
      
      <div style="text-align: center; margin-top: 15px; font-size: 9px; color: #666;">
        Online bestellen: restaurantlogin.com
      </div>
    </div>
  `;
}

// Generate kitchen ticket HTML
// estimatedTimeText: geplante Liefer- / Abholzeit aus dem Admin (z.B. "15:30")
function generateKitchenTicket(orderData, deliveryAddress, orderId, estimatedTimeText = '') {
  const now = new Date();
  // Format: "09. November um 15:59"
  const orderTime = now.toLocaleString('de-DE', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' um');

  const acceptedTime = now.toLocaleString('de-DE', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' um');

  // Format items
  let itemsHTML = '';
  orderData.items.forEach(item => {
    // Check if item name contains option (format: "Item Name - Option Name")
    const nameParts = item.name.split(' - ');
    const itemName = nameParts[0];
    const optionName = nameParts.length > 1 ? nameParts[1] : null;

    itemsHTML += `
      <div class="item-row">
        <div class="item-name">${item.quantity}x ${itemName}</div>
        ${optionName ? `<div class="item-option">${optionName}</div>` : ''}
        ${item.description && !optionName ? `<div class="item-option">${item.description}</div>` : ''}
        ${item.note ? `<div class="item-note">⚠️ ${item.note}</div>` : ''}
      </div>
    `;
  });

  // Get logo URL (use full URL if available, otherwise relative)
  // Get logo URL - use absolute path for print window
  // If pathname is like /menu.html, get base path, otherwise use root
  let basePath = '';
  if (window.location.pathname && window.location.pathname !== '/') {
    const pathParts = window.location.pathname.split('/');
    pathParts.pop(); // Remove filename
    basePath = pathParts.join('/');
  }
  const logoUrl = window.location.origin + basePath + '/assets/logo.png';

  return `
    <div class="bill-page">
      <div class="bill-type-label">KÜCHENTICKET</div>
      <div class="bill-header">
        <img src="${logoUrl}" alt="Leo Sushi" onerror="console.error('Logo not found:', this.src); this.style.display='none'" style="max-width: 80px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
        <div class="restaurant-name">Leo Sushi</div>
        <div class="restaurant-info">
          Florastraße 10A, 13187 Berlin
        </div>
      </div>
      
      <div class="bill-section">
        <div class="order-info">
          <span>${orderData.service_type === 'pickup' ? 'Abholung' : 'Lieferung'}</span>
        </div>
        ${orderData.table_number ? `
        <div class="order-info">
          <span>Tisch: ${orderData.table_number}</span>
        </div>
        ` : ''}
        ${estimatedTimeText ? `
        <div class="order-info">
          <span>Geplante Zeit:</span>
          <span>${estimatedTimeText} Uhr</span>
        </div>
        ` : `
        <div class="order-info">
          <span>${orderTime}</span>
        </div>
        `}
      </div>
      
      <div class="bill-section">
        <div class="section-title">Bestelldetails:</div>
        <div class="customer-info">
          Nummer: ${orderId}<br>
          Akzeptiert: ${acceptedTime}<br>
          Vorname: ${deliveryAddress.firstName || '-'}<br>
          Nachname: ${deliveryAddress.lastName || '-'}
          ${orderData.service_type === 'delivery' ? `<br>Adresse: ${deliveryAddress.street || ''}, ${deliveryAddress.postal || ''} ${deliveryAddress.city || ''}` : ''}
        </div>
      </div>
      
      <div class="bill-section">
        <div class="section-title">Artikel</div>
        <div class="items-list">
          ${itemsHTML}
        </div>
        ${deliveryAddress.note ? `
          <div class="special-note">
            <strong>⚠️ WICHTIGER HINWEIS:</strong><br>
            ${deliveryAddress.note}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Save reservation to daily report
function saveReservationToDailyReport(reservationData) {
  // Ensure reservation has status
  if (!reservationData.status) {
    reservationData.status = 'pending';
  }

  // Save reservation to Firebase (primary database)
  saveReservationToFirebase(reservationData);

  // Optional: Also save to Google Sheets as backup
  if (getGoogleSheetsConfig().WEB_APP_URL) {
    saveReservationToGoogleSheets(reservationData);
  }

  // Also send email notification
  sendReservationDataToAdmin(reservationData);
}

// Save reservation to Firebase (primary database)
async function saveReservationToFirebase(reservationData) {
  // Use getDb() helper to get db instance
  const dbInstance = getDb();
  if (!dbInstance) {
    console.error('❌ Firebase wurde noch nicht eingerichtet. Bitte öffnen Sie setup.html zur Konfiguration.');
    console.error('❌ window.db:', typeof window !== 'undefined' ? window.db : 'window undefined');
    // Silent fail - don't show alert to customer
    return;
  }

  try {
    // Save to Firebase Firestore
    await dbInstance.collection('reservations').doc(reservationData.reservationId).set({
      ...reservationData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Reservation saved to Firebase successfully:', reservationData.reservationId);
  } catch (error) {
    console.error('❌ Failed to save reservation to Firebase:', error);
    console.error('Error details:', error.message, error.code, error.stack);
    // Silent fail - don't show alert to customer
  }
}

// Get reservation from Firebase
async function getReservationFromFirebase(reservationId) {
  const dbInstance = getDb();
  if (!dbInstance) return null;

  try {
    const doc = await dbInstance.collection('reservations').doc(reservationId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Failed to get reservation from Firebase:', error);
    return null;
  }
}

// Get all reservations from Firebase
async function getAllReservationsFromFirebase(date = null) {
  const db = getDb();
  if (!db) return [];

  try {
    // Get all reservations first (no ordering to avoid index requirement)
    const snapshot = await db.collection('reservations').get();
    let reservations = [];

    snapshot.forEach(doc => {
      const reservationData = doc.data();
      reservationData._id = doc.id;
      reservations.push(reservationData);
    });

    // Filter by date if provided
    if (date) {
      reservations = reservations.filter(r => r.date === date);
    }

    // Sort in memory (no index needed)
    reservations.sort((a, b) => {
      // Sort by date first
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // Then by time
      return (a.time || '').localeCompare(b.time || '');
    });

    return reservations;
  } catch (error) {
    console.error('Failed to get reservations from Firebase:', error);
    return [];
  }
}

// Save reservation to Google Sheets (backup - optional)
async function saveReservationToGoogleSheets(reservationData) {
  if (!getGoogleSheetsConfig().WEB_APP_URL || getGoogleSheetsConfig().WEB_APP_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
    console.warn('Google Sheets Web App URL not configured. Reservation will only be saved to localStorage.');
    return;
  }

  try {
    // Prepare data for Google Sheets
    const sheetData = {
      action: 'appendReservation',
      sheetName: getGoogleSheetsConfig().RESERVATIONS_SHEET_NAME,
      data: {
        reservation_id: reservationData.reservationId,
        status: reservationData.status || 'pending',
        created_at: reservationData.createdAt || reservationData.timestamp || new Date().toISOString(),
        customer_first_name: reservationData.firstName || '',
        customer_last_name: reservationData.lastName || '',
        customer_phone: reservationData.phone || '',
        customer_email: reservationData.email || '',
        reservation_date: reservationData.date || '',
        reservation_time: reservationData.time || '',
        guests: reservationData.guests || 0,
        table_number: reservationData.tableNumber || '',
        note: reservationData.note || '',
        item_count: reservationData.items?.length || 0,
        items_json: JSON.stringify(reservationData.items || []),
        full_data_json: JSON.stringify(reservationData)
      }
    };

    // Send to Google Sheets via Web App
    await fetch(getGoogleSheetsConfig().WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData)
    });

    console.log('Reservation saved to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to save reservation to Google Sheets:', error);
  }
}

// Verify order exists in Google Sheets
async function verifyOrderInGoogleSheets(orderId) {
  if (!getGoogleSheetsConfig().WEB_APP_URL || getGoogleSheetsConfig().WEB_APP_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
    return null;
  } image.png

  try {
    const response = await fetch(`${getGoogleSheetsConfig().WEB_APP_URL}?action=getOrder&orderId=${orderId}`, {
      method: 'GET',
      mode: 'cors'
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Failed to verify order in Google Sheets:', error);
  }

  return null;
}

// Send reservation data to admin for database/management (separate from confirmation email)
function sendReservationDataToAdmin(reservationData) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Cannot send reservation data to admin.');
    return;
  }

  // Create a structured data email for admin to import into database
  const reservationDataJSON = JSON.stringify(reservationData, null, 2);

  const templateParams = {
    to_email: getEmailjsConfig().OWNER_EMAIL,
    subject: `[LEO SUSHI] New Reservation Data: ${reservationData.reservationId}`,
    reservation_id: reservationData.reservationId,
    reservation_data: reservationDataJSON,
    reservation_date: reservationData.date || '',
    reservation_time: reservationData.time || '',
    customer_name: `${reservationData.firstName || ''} ${reservationData.lastName || ''}`.trim(),
    customer_phone: reservationData.phone || '',
    customer_email: reservationData.email || '',
    table_number: reservationData.tableNumber || '',
    guests: reservationData.guests || 0,
    item_count: reservationData.items?.length || 0,
    status: reservationData.status || 'pending'
  };

  // Use the existing template (you may want to create a separate template for reservation data)
  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().TEMPLATE_ID,
    templateParams
  ).then(
    () => {
      console.log('Reservation data sent to admin successfully');
    },
    (error) => {
      console.error('Failed to send reservation data to admin:', error);
    }
  );
}

// Send reservation email to owner
function sendReservationEmail(reservationData) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Please configure EmailJS in script.js');
    return;
  }

  // Validate owner email
  if (!getEmailjsConfig().OWNER_EMAIL || getEmailjsConfig().OWNER_EMAIL.trim() === '') {
    console.error('❌ OWNER_EMAIL is empty! Please check EMAILJS_CONFIG in script.js');
    return;
  }

  const reservationTime = new Date(reservationData.timestamp).toLocaleString('de-DE');

  const templateParams = {
    to_email: getEmailjsConfig().OWNER_EMAIL.trim(),
    reply_to: reservationData.email || getEmailjsConfig().OWNER_EMAIL,
    reservation_id: reservationData.reservationId,
    reservation_time: reservationTime,
    customer_name: `${reservationData.firstName} ${reservationData.lastName}`,
    customer_phone: reservationData.phone,
    customer_email: reservationData.email,
    reservation_date: reservationData.date,
    reservation_time_slot: reservationData.time,
    guests: reservationData.guests,
    table_number: reservationData.tableNumber || 'Nicht angegeben',
    note: reservationData.note || 'Keine',
    restaurant_name: 'LEO SUSHI',
    restaurant_address: 'Florastraße 10A, 13187 Berlin',
    restaurant_phone: '+49 30 37476736'
  };

  console.log('⚠️ QUAN TRỌNG: Đảm bảo template trong EmailJS có field "To Email" = {{to_email}}');

  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().TEMPLATE_ID,
    templateParams
  )
    .then((response) => {
      console.log('Reservation email sent successfully!', response.status, response.text);
    })
    .catch((error) => {
      console.error('Failed to send reservation email:', error);
    });
}

// Send reservation confirmation email to customer
function sendReservationConfirmationEmail(reservationData, customEstimatedTime = null) {
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS not loaded. Please configure EmailJS in script.js');
    return;
  }

  // Validate customer email
  if (!reservationData.email || reservationData.email.trim() === '') {
    console.error('❌ Customer email is empty! Cannot send reservation confirmation email.');
    return;
  }

  const reservationDateTime = new Date(`${reservationData.date}T${reservationData.time}`).toLocaleString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Add estimated time message if provided
  let estimatedTimeMessage = '';
  if (customEstimatedTime) {
    estimatedTimeMessage = ` Bitte kommen Sie pünktlich um ${customEstimatedTime} Uhr.`;
  }

  // Format reservation date for display
  const reservationDateFormatted = new Date(`${reservationData.date}T${reservationData.time}`).toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Format table number display
  const tableNumberDisplay = reservationData.tableNumber ? reservationData.tableNumber.toString() : 'Wird bei Ankunft zugewiesen';

  // Format note display (HTML) - only if note exists
  const noteDisplay = reservationData.note && reservationData.note.trim() !== ''
    ? `<div class="note-box" style="margin-top: 15px;"><p><strong>Ihre Nachricht:</strong> ${reservationData.note.replace(/\n/g, '<br>')}</p></div>`
    : '';

  // Format estimated time display (HTML) - only if estimated time message exists
  const estimatedTimeDisplay = customEstimatedTime && estimatedTimeMessage
    ? `<div class="order-info" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-left-color: #2196f3; margin-top: 20px;"><h3>⏰ Wichtiger Hinweis</h3><p style="font-size: 16px; font-weight: 600; color: #1565c0; margin: 10px 0;">${estimatedTimeMessage}</p></div>`
    : '';

  const templateParams = {
    to_email: reservationData.email.trim(),
    reply_to: getEmailjsConfig().OWNER_EMAIL,
    customer_name: `${reservationData.firstName} ${reservationData.lastName}`,
    customer_phone: reservationData.phone || '',
    customer_email: reservationData.email.trim(),
    reservation_id: reservationData.reservationId,
    reservation_time: new Date(reservationData.timestamp || reservationData.createdAt || new Date()).toLocaleString('de-DE'),
    reservation_date: reservationDateFormatted,
    reservation_time_slot: reservationData.time,
    reservation_datetime: reservationDateTime,
    estimated_time: customEstimatedTime || '',
    estimated_time_message: estimatedTimeMessage || '',
    estimated_time_display: estimatedTimeDisplay,
    guests: reservationData.guests,
    table_number: reservationData.tableNumber || null,
    table_number_display: tableNumberDisplay,
    note: reservationData.note && reservationData.note.trim() !== '' ? reservationData.note : '',
    note_display: noteDisplay,
    restaurant_name: 'LEO SUSHI',
    restaurant_address: 'Florastraße 10A, 13187 Berlin',
    restaurant_phone: '+49 30 37476736',
    restaurant_email: getEmailjsConfig().OWNER_EMAIL
  };

  console.log('⚠️ QUAN TRỌNG: Đảm bảo template trong EmailJS có field "To Email" = {{to_email}}');

  // Use separate template for reservation confirmation (different from order confirmation)
  emailjs.send(
    getEmailjsConfig().SERVICE_ID,
    getEmailjsConfig().RESERVATION_TEMPLATE_ID || getEmailjsConfig().CUSTOMER_TEMPLATE_ID || getEmailjsConfig().TEMPLATE_ID,
    templateParams
  )
    .then((response) => {
      console.log('Reservation confirmation email sent successfully!', response.status, response.text);
    })
    .catch((error) => {
      console.error('Failed to send reservation confirmation email:', error);
    });
}

// Generate and show reservation confirmation
function showReservationConfirmation(reservationData) {
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  if (!printWindow) {
    alert('Bitte erlauben Sie Pop-ups, um die Bestätigung zu drucken.');
    return;
  }

  const reservationDateTime = new Date(`${reservationData.date}T${reservationData.time}`).toLocaleString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const confirmationHTML = generateReservationConfirmation(reservationData, reservationDateTime);

  const printContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reservierungsbestätigung - ${reservationData.reservationId}</title><style>@media print{body{margin:0;padding:0}.no-print{display:none!important}}body{font-family:'Courier New',monospace;font-size:12px;margin:0;padding:20px;background:#f5f5f5}.confirmation-page{background:white;width:80mm;max-width:300px;margin:0 auto 20px;padding:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.confirmation-header{text-align:center;border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:10px}.restaurant-name{font-size:18px;font-weight:bold;margin-bottom:5px}.restaurant-info{font-size:10px;line-height:1.4}.confirmation-section{margin:10px 0;padding:8px 0;border-bottom:1px dashed #ccc}.confirmation-section:last-child{border-bottom:none}.section-title{font-weight:bold;font-size:11px;margin-bottom:5px;text-transform:uppercase}.info-row{display:flex;justify-content:space-between;margin:3px 0;font-size:11px}.info-label{font-weight:bold}.print-buttons{text-align:center;margin:20px 0}.print-btn{background:#C2A355;color:#1a1a1a;border:none;padding:12px 24px;font-size:14px;font-weight:bold;border-radius:6px;cursor:pointer;margin:0 10px}.print-btn:hover{background:#D2B365}</style></head><body><div class="print-buttons no-print"><button class="print-btn" onclick="window.print()">🖨️ Bestätigung drucken</button><button class="print-btn" onclick="window.close()">Schließen</button></div>${confirmationHTML}<script>setTimeout(()=>{window.print()},500)</script></body></html>`;

  printWindow.document.write(printContent);
  printWindow.document.close();
}

// Generate reservation confirmation HTML
function generateReservationConfirmation(reservationData, reservationDateTime) {
  return `<div class="confirmation-page"><div class="confirmation-header"><div class="restaurant-name">Leo Sushi</div><div class="restaurant-info">Florastraße 10A<br>13187 Berlin<br>+49 30 37476736</div></div><div class="confirmation-section"><div class="section-title">Reservierungsbestätigung</div><div class="info-row"><span class="info-label">Reservierungsnummer:</span><span>${reservationData.reservationId}</span></div></div><div class="confirmation-section"><div class="section-title">Kundendaten</div><div style="font-size:11px;line-height:1.6">Name: ${reservationData.firstName} ${reservationData.lastName}<br>Telefon: ${reservationData.phone}<br>E-Mail: ${reservationData.email}</div></div><div class="confirmation-section"><div class="section-title">Reservierungsdetails</div><div class="info-row"><span class="info-label">Datum & Uhrzeit:</span><span>${reservationDateTime}</span></div><div class="info-row"><span class="info-label">Anzahl Personen:</span><span>${reservationData.guests}</span></div><div class="info-row"><span class="info-label">Tisch:</span><span>${reservationData.tableNumber || 'Nicht angegeben'}</span></div>${reservationData.note ? `<div style="margin-top:8px;font-size:10px;line-height:1.4"><strong>Hinweis:</strong><br>${reservationData.note}</div>` : ''}</div><div style="text-align:center;margin-top:15px;font-size:9px;color:#666">Wir freuen uns auf Ihren Besuch!</div></div>`;
}

// Intro Screen Handler
function setupIntroScreen() {
  const introScreen = document.getElementById('introScreen');
  if (!introScreen) {
    // No intro screen, just setup page animations
    setupPageLoadAnimations();
    return;
  }

  // Check if running in mobile app (Capacitor)
  const isMobileApp = window.Capacitor && window.Capacitor.isNativePlatform();
  
  if (isMobileApp) {
    // In mobile app: Skip intro screen completely
    console.log('📱 Mobile app detected - skipping intro screen');
    introScreen.style.display = 'none';
    document.body.style.overflow = '';
    setupPageLoadAnimations();
    return;
  }

  // Web version: Show intro screen
  // Ensure body and all content is visible from the start
  document.body.style.visibility = 'visible';
  document.body.style.opacity = '1';
  document.body.style.display = 'block';

  // Hide body overflow during intro
  document.body.style.overflow = 'hidden';

  // Make sure all main content is visible (but behind intro screen)
  const allContent = document.querySelectorAll('header, main, section, .site-header, .menu-order-page');
  allContent.forEach(el => {
    if (el) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.display = '';
    }
  });

  // Hide intro screen after animation completes
  setTimeout(() => {
    introScreen.classList.add('hidden');
    // Remove from DOM after transition completes
    setTimeout(() => {
      // Completely remove intro screen
      introScreen.style.display = 'none';
      introScreen.style.visibility = 'hidden';
      introScreen.style.pointerEvents = 'none';
      introScreen.style.opacity = '0';
      introScreen.style.zIndex = '-1';

      // Restore body overflow
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden'; // Prevent horizontal scroll

      // Force show all page content
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      document.body.style.display = 'block';

      // Ensure all main content is visible
      allContent.forEach(el => {
        if (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.display = '';
          el.style.zIndex = '';
        }
      });

      // Remove intro screen from DOM completely
      try {
        introScreen.remove();
      } catch (e) {
        console.log('Could not remove intro screen:', e);
      }

      // Now trigger page load animations
      setupPageLoadAnimations();

      console.log('Intro screen hidden, page should be visible now');
    }, 800);
  }, 2500); // Show intro for 2.5 seconds (2s loader + 0.5s buffer)
}

// Page Load Animations
function setupPageLoadAnimations() {
  // Check if we're on index.html or menu.html
  const isIndexPage = !window.location.pathname.includes('menu') && !window.location.pathname.includes('catalog');
  const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog');

  if (isIndexPage) {
    // Index page animations
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero-luxe');
    const heroTitle = document.querySelector('.hero-title-luxe');
    const heroDescription = document.querySelector('.hero-description-luxe');
    const heroActions = document.querySelector('.hero-actions');
    const heroStats = document.querySelectorAll('.hero-stat-card');
    const sections = document.querySelectorAll('section:not(.hero-luxe)');

    // Animate header
    if (header) {
      header.classList.add('page-load-animate', 'animate-fade-in-down');
    }

    // Animate hero section
    if (heroSection) {
      heroSection.classList.add('page-load-animate', 'animate-fade-in');
    }

    // Animate hero content with stagger
    if (heroTitle) {
      heroTitle.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-1');
    }
    if (heroDescription) {
      heroDescription.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
    if (heroActions) {
      heroActions.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-3');
    }

    // Animate hero stats with stagger
    heroStats.forEach((stat, index) => {
      stat.classList.add('page-load-animate', 'animate-scale-in', `animate-delay-${Math.min(index + 4, 8)}`);
    });

    // Animate sections with stagger
    sections.forEach((section, index) => {
      section.classList.add('page-load-animate', 'animate-fade-in-up', `animate-delay-${Math.min(index + 1, 8)}`);
    });
  }

  if (isMenuPage) {
    // Menu page animations
    const header = document.querySelector('.site-header');
    const menuOrderPage = document.querySelector('.menu-order-page');
    const menuHero = document.querySelector('.menu-order-hero');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroMetaCards = document.querySelectorAll('.hero-meta-card');
    const heroCard = document.querySelector('.hero-card');
    const menuTabsSidebar = document.querySelector('.menu-tabs-sidebar');
    const menuContent = document.querySelector('.menu-content');

    // Animate header
    if (header) {
      header.classList.add('page-load-animate', 'animate-fade-in-down');
    }

    // Animate menu order page
    if (menuOrderPage) {
      menuOrderPage.classList.add('page-load-animate', 'animate-fade-in');
    }

    // Animate hero section
    if (menuHero) {
      menuHero.classList.add('page-load-animate', 'animate-fade-in', 'animate-delay-1');
    }

    // Animate hero content
    if (heroTitle) {
      heroTitle.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
    if (heroDescription) {
      heroDescription.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-3');
    }

    // Animate hero meta cards
    heroMetaCards.forEach((card, index) => {
      card.classList.add('page-load-animate', 'animate-scale-in', `animate-delay-${Math.min(index + 4, 8)}`);
    });

    // Animate hero card
    if (heroCard) {
      heroCard.classList.add('page-load-animate', 'animate-slide-in-right', 'animate-delay-5');
    }

    // Animate sidebar
    if (menuTabsSidebar) {
      menuTabsSidebar.classList.add('page-load-animate', 'animate-slide-in-left', 'animate-delay-1');
    }

    // Animate menu content
    if (menuContent) {
      menuContent.classList.add('page-load-animate', 'animate-fade-in-up', 'animate-delay-2');
    }
  }
}

// Expose functions to global scope for module compatibility
console.log('📋 script.js: Exposing functions to global scope...');
if (typeof window !== 'undefined') {
  try {
    window.getTotal = getTotal;
    window.updateCartUI = updateCartUI;
    window.getAvailableTables = getAvailableTables;
    window.renderTableSelection = renderTableSelection;
    window.updateReservationCartDisplay = updateReservationCartDisplay;
    window.saveOrderToDailyReport = saveOrderToDailyReport;
    window.saveReservationToDailyReport = saveReservationToDailyReport;
    window.showReservationConfirmation = showReservationConfirmation;
    window.showOrderSuccessNotification = showOrderSuccessNotification;
    // tryInjectGloriaFoodCart is defined inside setupCart(), so it's not accessible here
    // if (typeof tryInjectGloriaFoodCart === 'function') {
    //   window.tryInjectGloriaFoodCart = tryInjectGloriaFoodCart;
    // }

    // Expose Firebase functions - CRITICAL for admin panel
    if (typeof getAllOrdersFromFirebase === 'function') {
      window.getAllOrdersFromFirebase = getAllOrdersFromFirebase;
      console.log('✅ getAllOrdersFromFirebase exposed');
    } else {
      console.error('❌ getAllOrdersFromFirebase function not found!');
    }

    if (typeof getAllReservationsFromFirebase === 'function') {
      window.getAllReservationsFromFirebase = getAllReservationsFromFirebase;
      console.log('✅ getAllReservationsFromFirebase exposed');
    } else {
      console.error('❌ getAllReservationsFromFirebase function not found!');
    }

    if (typeof window.updateTableStatus === 'undefined') window.updateTableStatus = updateTableStatus;
    if (typeof window.updatePaymentModalServiceType === 'undefined') window.updatePaymentModalServiceType = updatePaymentModalServiceType;
    if (typeof window.setupReservationTableSelectionListeners === 'undefined') window.setupReservationTableSelectionListeners = setupReservationTableSelectionListeners;

    console.log('✅ script.js: All functions exposed successfully');
    console.log('  - window.getAllOrdersFromFirebase:', typeof window.getAllOrdersFromFirebase);
    console.log('  - window.getAllReservationsFromFirebase:', typeof window.getAllReservationsFromFirebase);

    // Note: saveCustomerInfo is already exposed from customer.js module
    // Note: getCart, clearCart are already exposed from cart.js module
    // Note: openPaymentModal, confirmPayment are already exposed from payment.js module
  } catch (error) {
    console.error('❌ Error exposing functions:', error);
  }
} else {
  console.error('❌ window is undefined!');
}



