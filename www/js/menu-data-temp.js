const MENU_DATA = [
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
