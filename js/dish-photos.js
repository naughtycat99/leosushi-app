/**
 * LEO SUSHI per-dish photo catalog.
 *
 * Every reference points to one cell in a generated 4x4 catalog sheet. Keeping
 * the photos in sheets gives every dish an accurate image without forcing the
 * app to download hundreds of individual files.
 */
(function () {
    'use strict';

    const imageMap = new Map();

    function normalizeCategory(value) {
        return String(value || '').trim().toLowerCase();
    }

    function normalizeName(value) {
        return String(value || '')
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ß/g, 'ss')
            .replace(/^\s*(?:[a-z]{1,3}\d+|\d+)\.\s*/i, '')
            .replace(/\([^)]*\)/g, ' ')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim()
            .replace(/\s+/g, ' ');
    }

    function getItemDescription(item) {
        return String((item && (item.desc || item.description || item.descDe || item.description_de)) || '');
    }

    function makeKey(category, name, item) {
        const cat = normalizeCategory(category);
        let dishName = normalizeName(name);

        // There are two Happy Plates with the same public name but different
        // contents. The description is the reliable discriminator in both
        // branch menus.
        if (cat === 'vorspeisen' && dishName === 'happy plate') {
            const desc = normalizeName(getItemDescription(item));
            dishName += /tofu|veggie|vegetar/.test(desc) && !/hahnchen|huhner|chicken/.test(desc)
                ? ' veggie'
                : ' meat';
        }

        return `${cat}|${dishName}`;
    }

    function register(sheetNumber, entries) {
        const sheet = String(sheetNumber).padStart(2, '0');
        entries.forEach((entry, cell) => {
            const category = entry[0];
            const name = entry[1];
            const variant = entry[2] || '';
            const keyName = variant ? `${normalizeName(name)} ${variant}` : normalizeName(name);
            imageMap.set(`${normalizeCategory(category)}|${keyName}`, `assets/app-dishes/dish-sheet-${sheet}.jpg#cell=${cell}`);
        });
    }

    register(1, [
        ['maki', 'Sake'], ['maki', 'Sake avocado'], ['maki', 'Sake Kappa'], ['maki', 'Tekka'],
        ['maki', 'Spicy Tuna'], ['maki', 'Ebi'], ['maki', 'Ebi Avocado'], ['maki', 'California'],
        ['maki', 'Salmon Skin'], ['maki', 'Tuna Cooked'], ['maki', 'Sake Cooked'], ['maki', 'Tori'],
        ['maki', 'Kappa'], ['maki', 'Avocado'], ['maki', 'Tamago'], ['maki', 'Unagi']
    ]);

    register(2, [
        ['maki', 'Inari'], ['maki', 'Shiitake'], ['maki', 'Kampyo'], ['maki', 'Rucula'],
        ['maki', 'Paprika'], ['nigiri', 'Sake'], ['nigiri', 'Maguro'], ['nigiri', 'Amaebi'],
        ['nigiri', 'Ebi'], ['nigiri', 'Ikura'], ['nigiri', 'Unagi'], ['nigiri', 'Kani'],
        ['nigiri', 'Tamago'], ['nigiri', 'Ika'], ['nigiri', 'Inari'], ['nigiri', 'Shiitake']
    ]);

    register(3, [
        ['nigiri', 'Avocado'], ['insideout', 'Sake I-O'], ['insideout', 'Maguro I-O'], ['insideout', 'Ebi I-O'],
        ['insideout', 'Ebi Tempura I-O'], ['insideout', 'Veggie I-O'], ['insideout', 'Rucola Kappa I-O'], ['insideout', 'California I-O'],
        ['insideout', 'Ebi Spicy I-O'], ['insideout', 'Sake Spicy I-O'], ['insideout', 'Salmon Skin I-O'], ['insideout', 'Maguro Spicy I-O'],
        ['insideout', 'Tamago I-O'], ['insideout', 'Lachs Cooked I-O'], ['insideout', 'Tuna Cooked I-O'], ['insideout', 'Tori I-O']
    ]);

    register(4, [
        ['insideout', 'Lachs Rucola I-O'], ['specialrolls', 'Leo Rolls'], ['specialrolls', 'Mango Thunfisch Roll'], ['specialrolls', 'Fire Tuna'],
        ['specialrolls', 'Fire Salmon'], ['specialrolls', 'Tiger Rolls'], ['specialrolls', 'Chicken rolls'], ['specialrolls', 'Fire Ocean Rolls'],
        ['specialrolls', 'Tuna Rolls'], ['specialrolls', 'Philadelphia Rolls'], ['specialrolls', 'Kyoto Rolls'], ['specialrolls', 'Sake Alaska Rolls'],
        ['specialrolls', 'Omelette Rolls'], ['specialrolls', 'Dragon Rolls'], ['specialrolls', 'Fuji Rolls'], ['specialrolls', 'Tempura Special Rolls']
    ]);

    register(5, [
        ['specialrolls', 'Taiko Rolls'], ['crunchy', 'Sake Crunchy'], ['crunchy', 'Maguro Crunchy'], ['crunchy', 'Ebi Crunchy'],
        ['crunchy', 'Skin Crunchy'], ['crunchy', 'Salmon Tempura Crunchy'], ['crunchy', 'Tuna Crunchy'], ['crunchy', 'Tori Crunchy'],
        ['bigrolls', 'Leo Rolls'], ['bigrolls', 'Aiko Rolls'], ['bigrolls', 'Tokyo Rolls'], ['bigrolls', 'Fuji San Rolls'],
        ['bigrolls', 'Emilia Rolls'], ['bigrolls', 'Yakitori Rolls'], ['bigrolls', 'Bao ngoc Rolls'], ['minirolls', 'Sake Rolls']
    ]);

    register(6, [
        ['minirolls', 'Ebi Rolls'], ['minirolls', 'Spicy Rolls'], ['minirolls', 'Bao ngoc Rolls'], ['minirolls', 'Veggie Rolls'],
        ['minirolls', 'Avocado Rolls'], ['minirolls', 'Tori Rolls'], ['firenigiri', 'Maguro Aburi'], ['firenigiri', 'Sake Aburi'],
        ['firenigiri', 'Squid Aburi'], ['firenigiri', 'Maguro-Tatar'], ['firenigiri', 'Salmon Rose'], ['sashimi', 'Sake'],
        ['sashimi', 'Maguro'], ['sashimi', 'Sake & Maguro'], ['sashimi', 'Sake Special'], ['sashimi', 'Maguro Special']
    ]);

    register(7, [
        ['temaki', 'Maguro Temaki'], ['temaki', 'Sake Temaki'], ['temaki', 'California Temaki'], ['temaki', 'Salmon Skin Temaki'],
        ['temaki', 'Tamago Temaki'], ['temaki', 'Inari Avocado Temaki'], ['sushimenu', 'Menü 1'], ['sushimenu', 'Menü 2'],
        ['sushimenu', 'Menü 3'], ['sushimenu', 'Menü 4'], ['sushimenu', 'Menü 5'], ['sushimenu', 'Menü 6'],
        ['sushimenu', 'Nigiri Menü'], ['sushimenu', 'Philadelphia Menu'], ['sushimenu', 'Aiko Menü'], ['sushimenu', 'Tuna Menü']
    ]);

    register(8, [
        ['sushimenu', 'Tori Menü'], ['sushimenu', 'Deluxe Menü | Für 2 Persone'], ['sushimenu', 'Deluxe Menü Leo'], ['pokebowl', 'Tufu Bowl'],
        ['pokebowl', 'Seitan Bowl'], ['pokebowl', 'Sake Bowl'], ['pokebowl', 'Tori Bowl'], ['pokebowl', 'Bowl Grill'],
        ['pokebowl', 'Ebi Bowl'], ['teriyaki', 'Sake Teriyaki'], ['teriyaki', 'Tuna Teriyaki'], ['teriyaki', 'Tori Teriyaki'],
        ['teriyaki', 'Ebi Teriyaki'], ['teriyaki', 'Squid Teriyaki'], ['teriyaki', 'Duck Teriyaki'], ['salate', 'Mix Sashimi']
    ]);

    register(9, [
        ['salate', 'Mango salat'], ['salate', 'Leo Salat'], ['salate', 'Salmon Love'], ['suppen', 'Miso Suppe'],
        ['suppen', 'Sake Suppe'], ['suppen', 'Ebi Soup'], ['suppen', 'Sua dua dau'], ['suppen', 'Sua Dua Tom'],
        ['suppen', 'Sua Dua Ga'], ['suppen', 'Wan-tan-suppe'], ['suppen', 'Sauer-Scharf-Suppe'], ['dessert', 'Dragon Ball'],
        ['dessert', 'Mochi'], ['dessert', 'Lucky Egg'], ['dessert', 'Bananiflirt'], ['vorspeisen', 'Mini Spring Roll']
    ]);

    register(10, [
        ['vorspeisen', 'Nem Ha Tinh'], ['vorspeisen', 'Nem Ha Noi'], ['vorspeisen', 'Sommerrollen Tofu'], ['vorspeisen', 'Sommerrollen Hähnchen'],
        ['vorspeisen', 'Sommerrollen Garnelen'], ['vorspeisen', 'Sommerrollen gegrillter Lachs'], ['vorspeisen', 'Edamame'], ['vorspeisen', 'Tom Chien Com'],
        ['vorspeisen', 'Algen Salat'], ['vorspeisen', 'Prawn Tornado'], ['vorspeisen', 'Khoai Lang Chien'], ['vorspeisen', 'Yakitori'],
        ['vorspeisen', 'Veggie Gyoza'], ['vorspeisen', 'Japan Gyoza'], ['vorspeisen', 'Wantan Chien'], ['vorspeisen', 'Kimchi Frau Pham']
    ]);

    register(11, [
        ['vorspeisen', 'Sate Spieße'], ['vorspeisen', 'Happy Plate', 'veggie'], ['vorspeisen', 'Happy Plate', 'meat'], ['beilagen', 'Duftreis'],
        ['beilagen', 'Sushi Reis'], ['beilagen', 'Ingwer'], ['beilagen', 'Wasabi'], ['beilagen', 'Unagi-Soße'],
        ['beilagen', 'Cocktailsoße'], ['beilagen', 'Reiband-Nudeln'], ['beilagen', 'Udon-Nudeln'], ['getranke', 'Ananas'],
        ['getranke', 'Apfel'], ['getranke', 'Asahi Bier'], ['getranke', 'Avocado Lassi'], ['getranke', 'Banane']
    ]);

    register(12, [
        ['getranke', 'Cafe Sữa Nóng'], ['getranke', 'Chanh da'], ['getranke', 'Cocacola'], ['getranke', 'Coconut Kiss'],
        ['getranke', 'Cola Light'], ['getranke', 'Erdinger Hefeweizen, dunkel/ hell/ alkoholfrei'], ['getranke', 'Fanta'], ['getranke', 'Ginger Ale'],
        ['getranke', 'Grauburgunder Trocken'], ['getranke', 'Green Tea'], ['getranke', 'Hausgemachte Eistee'], ['getranke', 'Ingwer Limonad'],
        ['getranke', 'Ingwer Tea'], ['getranke', 'Ipanema'], ['getranke', 'Jasmint tea'], ['getranke', 'Kirsche']
    ]);

    register(13, [
        ['getranke', 'Mango'], ['getranke', 'Mango Lassi'], ['getranke', 'Maracuja'], ['getranke', 'Mineral wasser/ sprudel'],
        ['getranke', 'Mojito'], ['getranke', 'Naturell'], ['getranke', 'Nha Dam'], ['getranke', 'Orange'],
        ['getranke', 'Riesling'], ['getranke', 'Sai Gon Bier'], ['getranke', 'Sportsman'], ['getranke', 'Sprite'],
        ['getranke', 'Tiger Bier Singapur'], ['getranke', 'Tonic'], ['getranke', 'Warsteiner/ Alkoholfrei'], ['hauptspeisen', 'Roter Curry']
    ]);

    register(14, [
        ['hauptspeisen', 'Erdnuss'], ['hauptspeisen', 'Mango-Curry'], ['hauptspeisen', 'Avocado Curry'], ['hauptspeisen', 'Good Curry'],
        ['hauptspeisen', 'Leo Spezial-Soße'], ['hauptspeisen', 'Pad Thai'], ['hauptspeisen', 'Süß-saure Soße'], ['hauptspeisen', 'Japanische Nudelsuppe'],
        ['hauptspeisen', 'Pho'], ['hauptspeisen', 'Udon Coco'], ['hauptspeisen', 'Pho Tron'], ['hauptspeisen', 'Bun Bo Nam Bo'],
        ['hauptspeisen', 'Udon Yaki'], ['hauptspeisen', 'Rau Xào Tofu'], ['hauptspeisen', 'My Xao'], ['hauptspeisen', 'Rau Xào Seitan']
    ]);

    register(15, [
        ['hauptspeisen', 'Steak Grill Lachs'], ['hauptspeisen', 'Pho Xao'], ['hauptspeisen', 'Steak Grill Thunfisch'], ['hauptspeisen', 'Com Rang'],
        ['hauptspeisen', 'Bo Luc Lac'], ['hauptspeisen', 'Black Tiger']
    ]);

    function resolve(category, item) {
        if (!item) return '';
        return imageMap.get(makeKey(category, item.name || item.cleanName || '', item)) || '';
    }

    function parse(reference) {
        const match = String(reference || '').match(/^(.*)#cell=(\d{1,2})$/);
        if (!match) return null;
        const cell = Number(match[2]);
        if (!Number.isInteger(cell) || cell < 0 || cell > 15) return null;
        return {
            src: match[1],
            cell,
            column: cell % 4,
            row: Math.floor(cell / 4)
        };
    }

    window.LEO_DISH_IMAGE_CATALOG = Object.freeze({
        resolve,
        parse,
        normalizeName,
        size: imageMap.size
    });
})();
