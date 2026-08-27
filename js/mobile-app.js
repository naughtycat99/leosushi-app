/**
 * LEO SUSHI - Mobile App UI Controller (Capacitor iOS & Android)
 * High-end Native Experience with Luxury Bottom Bar, Haptics & Realtime Cart Badge
 * Full-Featured In-App Food Ordering Engine
 */

(function () {
    'use strict';

    // 1. Detection is centralized in app-mode-gate.js so browser and app
    // can never disagree about which interface should be rendered.
    const isApp = window.LEO_IS_NATIVE_APP === true;

    if (!isApp) {
        document.documentElement.classList.remove('is-capacitor-app');
        if (document.body) document.body.classList.remove('is-capacitor-app');
        return;
    }

    console.log('📱 [Leo App] Mobile App Mode Activated');

    const appQuerySuffix = window.LEO_IS_LOCAL_APP_PREVIEW === true ? '?mock-app=1' : '';
    const APP_BRANCHES = {
        flora: {
            id: 'branch_flora',
            name: 'LEO SUSHI - Florastraße 10A',
            address: 'Florastraße 10A, 13187 Berlin',
            phone: '+49 30 37476736',
            lat: 52.5694,
            lng: 13.4077
        },
        haupt: {
            id: 'branch_haupt',
            name: 'LEO SUSHI - Hauptstraße 29a',
            address: 'Hauptstraße 29a, 13158 Berlin',
            phone: '+49 30 55617056',
            lat: 52.5855,
            lng: 13.3854
        }
    };
    const APP_BRANCH_CONFIRMATION_VERSION = 'v60';

    function ensureAppBranchSelection() {
        let branchKey = localStorage.getItem('selected_branch');
        let savedBranch = null;

        try {
            savedBranch = JSON.parse(localStorage.getItem('leoSelectedBranch') || 'null');
        } catch (e) {}

        if (savedBranch && (savedBranch.id === 'branch_haupt' || savedBranch.id === 'haupt')) branchKey = 'haupt';
        else if (savedBranch && (savedBranch.id === 'branch_flora' || savedBranch.id === 'flora')) branchKey = 'flora';

        const isValidBranch = branchKey === 'flora' || branchKey === 'haupt';
        const isConfirmed = localStorage.getItem('leoBranchSelectionConfirmed') === APP_BRANCH_CONFIRMATION_VERSION;
        if (!isValidBranch || !isConfirmed) return null;

        return APP_BRANCHES[branchKey];
    }

    function syncAppBranchLabels(branchKey) {
        const label = branchKey === 'haupt'
            ? 'Hauptstraße 29a'
            : (branchKey === 'flora' ? 'Florastraße 10A' : 'Filiale wählen');
        document.querySelectorAll('#appCurrentBranchText, #appSelectedBranch, #appMenuCurrentBranchText')
            .forEach(element => { element.textContent = label; });
    }

    window.ensureAppBranchSelection = ensureAppBranchSelection;
    const initialAppBranch = ensureAppBranchSelection();
    syncAppBranchLabels(initialAppBranch ? (initialAppBranch.id === 'branch_haupt' ? 'haupt' : 'flora') : null);

    // Add class to document and body immediately
    document.documentElement.classList.add('is-capacitor-app');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) {
        document.documentElement.classList.add('is-ios');
    }
    if (document.body) {
        document.body.classList.add('is-capacitor-app');
        if (isIOS) document.body.classList.add('is-ios');
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                document.body.classList.add('is-capacitor-app');
                if (isIOS) document.body.classList.add('is-ios');
            }
        });
    }

    // 2. SVG Icons (Luxury Gold & Minimalist)
    const icons = {
        home: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        menu: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`,
        cart: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
        orders: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
        profile: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    };

    function getCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('menu.html') || path.includes('catalog')) return 'menu';
        if (path.includes('my-orders.html') || path.includes('orders')) return 'orders';
        if (path.includes('points.html') || path.includes('rewards')) return 'points';
        if (path.includes('profile.html') || path.includes('account')) return 'profile';
        if (path.includes('checkout.html')) return 'checkout';
        if (path.includes('reservation.html')) return 'reservation';
        return 'home';
    }

    // 3. Haptic Feedback Trigger
    function triggerHaptic() {
        try {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
                window.Capacitor.Plugins.Haptics.impact({ style: 'light' });
            } else if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        } catch (e) {}
    }

    // 4. Cart Storage Helpers (Standardized Schema: { id, name, price, qty, image, note })
    function getRawAppCart() {
        try {
            const raw = localStorage.getItem('leoCart') || localStorage.getItem('cart');
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function getAppCart() {
        try {
            const branch = ensureAppBranchSelection();
            if (!branch) return [];

            const parsed = getRawAppCart();
            const storedCartBranch = localStorage.getItem('leoCartBranchId') ||
                (parsed.find(item => item && item.branchId)?.branchId || '');
            if (storedCartBranch && storedCartBranch !== branch.id) return [];

            return parsed.map(item => ({
                id: item.id || ('item_' + Date.now()),
                name: item.name,
                price: parseFloat(item.price) || 0,
                qty: parseInt(item.qty || item.quantity || 1, 10) || 1,
                image: item.image || 'assets/close-up-sushi-served-table 1.webp',
                note: item.note || '',
                branchId: branch.id
            }));
        } catch (e) {
            return [];
        }
    }

    function requireAppBranchSelection() {
        const branch = ensureAppBranchSelection();
        if (branch) return branch;

        syncAppBranchLabels(null);
        window.toggleAppBranchModal(true);
        if (window.addNotification) {
            window.addNotification('info', 'Filiale auswählen', 'Bitte wähle zuerst eine Filiale. Jede Filiale hat eine eigene Speisekarte.');
        }
        return null;
    }

    window.requireAppBranchSelection = requireAppBranchSelection;

    function saveAppCart(cart) {
        try {
            const branch = ensureAppBranchSelection();
            if (!branch) {
                requireAppBranchSelection();
                return false;
            }
            const branchCart = cart.map(item => ({ ...item, branchId: branch.id }));
            localStorage.setItem('leoCart', JSON.stringify(branchCart));
            localStorage.setItem('cart', JSON.stringify(branchCart));
            localStorage.setItem('leoCartBranchId', branch.id);
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('cart:updated'));
            updateCartBadge();
            renderFloatingCartBar();
            updateAllCardSteppers();
            return true;
        } catch (e) {
            console.error('Error saving cart:', e);
            return false;
        }
    }

    window.clearAppCart = function () {
        try {
            localStorage.removeItem('leoCart');
            localStorage.removeItem('cart');
            localStorage.setItem('leoCart', '[]');
            localStorage.setItem('cart', '[]');
            localStorage.removeItem('leoCartBranchId');
            localStorage.removeItem('leo_applied_voucher');
            localStorage.removeItem('leo_applied_coupon');
            localStorage.removeItem('discountCode');
            localStorage.removeItem('applied_discount');
            if (typeof window.cart !== 'undefined') window.cart = [];
            updateCartBadge();
            renderFloatingCartBar();
            updateAllCardSteppers();
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('cart:updated'));
        } catch (e) {
            console.error('Error clearing app cart:', e);
        }
    };
    window.clearCart = window.clearAppCart;

    function getCartItemCount() {
        const cart = getAppCart();
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function getCartSubtotal() {
        const cart = getAppCart();
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    function getItemCartQty(itemName) {
        const cart = getAppCart();
        const found = cart.find(i => i.name === itemName);
        return found ? found.qty : 0;
    }

    function formatEuro(val) {
        return (typeof val === 'number' ? val : parseFloat(val) || 0).toFixed(2).replace('.', ',') + ' €';
    }

    // 5. Rich Dish Dataset for Mobile App (100% Synced from real MENU_DATA / API)
    let APP_DISHES = [];
    let appBestsellerStats = [];
    let appBestsellerNameMap = new Map();
    const APP_BESTSELLER_CACHE_KEY = 'leo_bestsellers_cache_v1';
    const APP_BESTSELLER_CACHE_TTL = 6 * 60 * 60 * 1000;

    function getExactAppBranchMenu() {
        const branch = ensureAppBranchSelection();
        if (!branch) return [];
        const branchId = branch.id;
        if (Array.isArray(window.MENU_DATA_FROM_API) && window.MENU_DATA_FROM_API.length > 0 && window.LEO_MENU_BRANCH_ID === branchId) {
            return window.MENU_DATA_FROM_API;
        }
        // Fallback to cache for instant rendering
        try {
            const cached = localStorage.getItem(`leo_menu_cache_${branchId}`);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    window.MENU_DATA_FROM_API = parsed;
                    window.LEO_MENU_BRANCH_ID = branchId;
                    return parsed;
                }
            }
        } catch (e) {}

        if (typeof window.loadMenuFromAPI === 'function' && !appBranchMenuLoadPromise) {
            loadExactAppBranchMenu();
        }

        return [];
    }

    function normalizeBestsellerDishName(name) {
        return String(name || '')
            .normalize('NFKD')
            .toLowerCase()
            .replace(/\s*\([a-z0-9,\s]+\)\s*/gi, ' ')
            .replace(/[^a-z0-9äöüß]+/gi, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getBestsellerInfo(name) {
        return appBestsellerNameMap.get(normalizeBestsellerDishName(name)) || null;
    }

    function isFallbackBestseller(dish) {
        const cat = String(dish.cat || dish.catId || '').toLowerCase();
        return ['specialrolls', 'special-rolls', 'sushimenu', 'menus'].includes(cat);
    }

    function hydrateDishBestseller(dish) {
        const stats = getBestsellerInfo(dish.rawName || dish.name);
        dish.bestsellerRank = stats ? Number(stats.rank) || null : null;
        dish.bestsellerQuantity = stats ? Number(stats.quantity) || 0 : 0;
        dish.isBestseller = !!stats || (!appBestsellerStats.length && isFallbackBestseller(dish));
        if (dish.bestsellerRank) dish.badge = `🔥 Top ${dish.bestsellerRank}`;
        return dish;
    }

    function applyAppBestsellerStats(stats) {
        appBestsellerStats = Array.isArray(stats) ? stats : [];
        appBestsellerNameMap = new Map();
        appBestsellerStats.forEach(item => {
            const key = normalizeBestsellerDishName(item.name);
            if (key) appBestsellerNameMap.set(key, item);
        });
        APP_DISHES.forEach(hydrateDishBestseller);
        appFullMenuItems.forEach(hydrateDishBestseller);
    }

    async function loadAppBestsellers() {
        let cached = null;
        try {
            cached = JSON.parse(localStorage.getItem(APP_BESTSELLER_CACHE_KEY) || 'null');
            if (cached && Array.isArray(cached.dishes)) applyAppBestsellerStats(cached.dishes);
        } catch (e) {}

        const cacheIsFresh = cached && cached.savedAt && (Date.now() - cached.savedAt < APP_BESTSELLER_CACHE_TTL);
        if (cacheIsFresh) {
            renderAppDishes();
            renderAppMenuDishes();
            return;
        }

        const apiBase = window.API_PHP_BASE_URL || window.API_BASE_URL || `${window.location.origin}${window.location.pathname.includes('/leosushi') ? '/leosushi/api' : '/api'}`;
        try {
            const response = await fetch(`${apiBase}/orders.php?action=bestsellers&limit=20&days=90`, {
                headers: { 'Accept': 'application/json' }
            });
            const result = await response.json();
            if (!response.ok || !result.success || !Array.isArray(result.dishes)) throw new Error('Bestseller response invalid');
            applyAppBestsellerStats(result.dishes);
            localStorage.setItem(APP_BESTSELLER_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), dishes: result.dishes }));
            renderAppDishes();
            renderAppMenuDishes();
        } catch (error) {
            // The curated Special/Menu categories remain a deterministic fallback
            // when the aggregate endpoint is unavailable or has no sales yet.
            if (!cached) applyAppBestsellerStats([]);
            renderAppDishes();
            renderAppMenuDishes();
        }
    }

    function getOrBuildAppDishes() {
        // Native ordering must never fall back to the combined/static catalog:
        // each branch has its own availability, price and dish list.
        const rawMenu = getExactAppBranchMenu();

        if (!rawMenu || rawMenu.length === 0) {
            return APP_DISHES.length > 0 ? APP_DISHES : [];
        }

        const list = [];
        rawMenu.forEach(cat => {
            const catId = (cat.id || '').toLowerCase();
            const catTitle = cat.title || 'Gerichte';
            const catIcon = (typeof getCategoryIcon === 'function') ? getCategoryIcon(catTitle) : '🍣';

            (cat.items || []).forEach((item, idx) => {
                let num = '';
                const numMatch = (item.name || '').match(/^([A-Za-z0-9]+)\.\s*(.+)$/);
                let cleanName = item.name || '';
                if (numMatch) {
                    num = numMatch[1];
                    cleanName = numMatch[2];
                }
                cleanName = cleanName.replace(/\s*\([A-Z0-9,]+\)\s*/g, '').trim();

                const priceNum = typeof item.price === 'number' ? item.price : parseFloat((item.price || '0').replace(',', '.'));
                const dishImg = resolveDishImage(catId, item);

                // Map category IDs to filter groups
                let appCat = catId;
                if (['maki', 'nigiri', 'insideout', 'inside-out', 'crunchy', 'bigrolls', 'minirolls', 'firenigiri', 'sashimi', 'temaki'].includes(catId)) {
                    appCat = 'nigirimaki';
                } else if (['salate', 'pokebowl', 'bowls'].includes(catId)) {
                    appCat = 'bowls';
                } else if (['suppen', 'vorspeisen'].includes(catId)) {
                    appCat = 'vorspeisen';
                } else if (['hauptspeisen', 'teriyaki', 'warm-dishes', 'warmekueche'].includes(catId)) {
                    appCat = 'warmekueche';
                } else if (['drinks', 'dessert', 'desserts'].includes(catId)) {
                    appCat = 'drinks';
                }

                list.push(hydrateDishBestseller({
                    id: `dish_${catId}_${idx}`,
                    rawName: item.name || '',
                    name: item.name || '',
                    cleanName: cleanName || item.name || '',
                    number: num || `${idx + 1}`,
                    cat: catId,
                    appCat: appCat,
                    catTitle: catTitle,
                    catIcon: catIcon,
                    price: priceNum,
                    badge: item.vegetarian ? '🌱 Veggie' : (item.spicy ? '🌶️ Scharf' : (catId === 'sushimenu' ? '🍱 Menü' : (catId === 'specialrolls' ? '★ Special' : ''))),
                    desc: item.desc || '',
                    descEn: item.descEn || '',
                    allergens: item.allergens || '',
                    image: dishImg,
                    hasOptions: !!(item.hasOptions && item.options && item.options.length > 0),
                    options: item.options || []
                }));
            });
        });

        if (list.length > 0) {
            APP_DISHES = list;
        }
        return list;
    }

    let activeCategory = 'all';
    let currentSearchTerm = '';

    // 6. Render App Dishes dynamically in 2-Column Grid (From Real MENU_DATA)
    function renderAppDishes() {
        const grid = document.getElementById('appFoodGrid');
        if (!grid) return;

        if (!ensureAppBranchSelection()) {
            APP_DISHES = [];
            grid.innerHTML = '<div class="app-menu-loading">📍 Bitte zuerst eine Filiale auswählen, um die passende Speisekarte zu sehen.</div>';
            return;
        }

        const allDishes = getOrBuildAppDishes();
        if (allDishes.length === 0) {
            if (typeof window.loadMenuFromAPI === 'function') {
                window.loadMenuFromAPI().then(() => {
                    renderAppDishes();
                }).catch(() => {});
            }
            grid.innerHTML = '<div class="app-menu-loading">Speisekarte der gewählten Filiale wird geladen…</div>';
            setTimeout(renderAppDishes, 500);
            return;
        }

        let filtered = allDishes;

        if (activeCategory === 'bestseller') {
            filtered = filtered
                .filter(dish => dish.isBestseller)
                .sort((a, b) => (a.bestsellerRank || 999) - (b.bestsellerRank || 999));
        } else if (activeCategory && activeCategory !== 'all') {
            filtered = filtered.filter(d => d.cat === activeCategory || d.appCat === activeCategory);
        }

        if (currentSearchTerm && currentSearchTerm.trim() !== '') {
            const query = currentSearchTerm.toLowerCase().trim();
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(query) || 
                d.cleanName.toLowerCase().includes(query) ||
                d.desc.toLowerCase().includes(query) ||
                (d.descEn && d.descEn.toLowerCase().includes(query)) ||
                (d.number && d.number.toLowerCase() === query)
            );
        }

        // The home screen is a dashboard, not the full catalog. Keep the
        // default highlights short and varied so quick actions remain useful.
        const isDefaultHighlights = activeCategory === 'all' && !currentSearchTerm.trim();
        if (isDefaultHighlights) {
            const preferredCategories = ['specialrolls', 'sushimenu', 'pokebowl', 'hauptspeisen', 'vorspeisen', 'maki'];
            const highlights = filtered
                .filter(dish => dish.bestsellerRank)
                .sort((a, b) => a.bestsellerRank - b.bestsellerRank)
                .slice(0, 8);
            preferredCategories.forEach(catId => {
                filtered.filter(dish => dish.cat === catId).slice(0, 2).forEach(dish => {
                    if (!highlights.includes(dish)) highlights.push(dish);
                });
            });
            if (highlights.length < 12) {
                filtered.forEach(dish => {
                    if (highlights.length < 12 && !highlights.includes(dish)) highlights.push(dish);
                });
            }
            filtered = highlights.slice(0, 12);
        }

        const countBadge = document.getElementById('appItemCountBadge');
        if (countBadge) {
            countBadge.textContent = activeCategory === 'bestseller'
                ? `${filtered.length} Bestseller`
                : (isDefaultHighlights ? `${filtered.length} Highlights` : `${filtered.length} Gerichte`);
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: span 2; text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.6);">
                    <div style="font-size: 38px; margin-bottom: 10px;">🍣🔍</div>
                    <div style="font-weight: 700; color: #fff; margin-bottom: 6px;">Keine Gerichte gefunden</div>
                    <div style="font-size: 13px;">Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie.</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(dish => {
            const qty = getItemCartQty(dish.name);
            const priceStr = formatEuro(dish.price);

            return `
                <div class="app-food-card" id="dish_card_${dish.id}">
                    <button type="button" class="app-food-img-wrap app-food-img-button" onclick="window.openAppDishDetail('${dish.id}')" aria-label="Details zu ${dish.cleanName || dish.name} öffnen">
                        ${renderAppDishImageTag(dish.image, dish.name, 'app-food-img', getDishFallbackImage(dish.cat, dish.name))}
                        ${dish.badge ? `<span class="app-food-tag">${dish.badge}</span>` : ''}
                    </button>
                    <div class="app-food-body">
                        <button type="button" class="app-food-title app-food-title-btn" onclick="window.openAppDishDetail('${dish.id}')">${dish.name}</button>
                        <div class="app-food-desc">${dish.desc}</div>
                        <div class="app-food-footer">
                            <span class="app-food-price">${priceStr}</span>
                            <div class="app-card-action-container" id="action_container_${dish.id}">
                                ${renderCardActionHtml(dish, qty)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderCardActionHtml(dish, qty) {
        if (dish.hasOptions && dish.options && dish.options.length > 0) {
            return `
                <button type="button" class="app-card-add-btn app-card-option-btn" onclick="event.stopPropagation(); window.openAppDishDetail('${dish.id}')" aria-label="Option für ${dish.cleanName || dish.name} wählen" title="Option wählen">
                    + Wahl
                </button>
            `;
        }
        if (qty > 0) {
            return `
                <div class="app-card-stepper" onclick="event.stopPropagation()">
                    <button type="button" class="app-stepper-btn" onclick="window.decrementAppItem('${dish.name}')" aria-label="${dish.cleanName || dish.name} entfernen">−</button>
                    <span class="app-stepper-qty">${qty}</span>
                    <button type="button" class="app-stepper-btn" onclick="window.incrementAppItem('${dish.name}', ${dish.price}, '${dish.image}')" aria-label="${dish.cleanName || dish.name} hinzufügen">+</button>
                </div>
            `;
        }
        return `
            <button type="button" class="app-card-add-btn" onclick="event.stopPropagation(); window.incrementAppItem('${dish.name}', ${dish.price}, '${dish.image}')" aria-label="${dish.cleanName || dish.name} hinzufügen" title="Hinzufügen">+</button>
        `;
    }

    function updateAllCardSteppers() {
        APP_DISHES.forEach(dish => {
            const container = document.getElementById(`action_container_${dish.id}`);
            if (container) {
                const qty = getItemCartQty(dish.name);
                container.innerHTML = renderCardActionHtml(dish, qty);
            }
        });
        if (appFullMenuItems && appFullMenuItems.length > 0) {
            appFullMenuItems.forEach(dish => {
                const container = document.getElementById(`menu_action_${dish.id}`);
                if (container) {
                    const qty = getItemCartQty(dish.rawName) || getItemCartQty(dish.name);
                    container.innerHTML = renderMenuCardActionHtml(dish, qty);
                }
            });
        }
    }

    // 7. Cart Modification Functions (Increment / Decrement / Remove)
    window.incrementAppItem = function (name, price, image, note = '') {
        const branch = requireAppBranchSelection();
        if (!branch) return;
        triggerHaptic();
        let cart = getAppCart();
        const existingIndex = cart.findIndex(i => i.name === name);
        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push({
                id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: name,
                price: parseFloat(price) || 0,
                qty: 1,
                image: image || 'assets/close-up-sushi-served-table 1.webp',
                note: note,
                branchId: branch.id
            });
        }
        saveAppCart(cart);

        if (window.addNotification) {
            window.addNotification('success', 'Warenkorb', `+1 ${name}`);
        }
    };

    window.decrementAppItem = function (name) {
        triggerHaptic();
        let cart = getAppCart();
        const existingIndex = cart.findIndex(i => i.name === name);
        if (existingIndex > -1) {
            cart[existingIndex].qty -= 1;
            if (cart[existingIndex].qty <= 0) {
                cart.splice(existingIndex, 1);
            }
            saveAppCart(cart);
        }
    };

    window.removeAppItem = function (name) {
        triggerHaptic();
        let cart = getAppCart();
        cart = cart.filter(i => i.name !== name);
        saveAppCart(cart);
        renderAppCartSheetContent();
    };

    // 8. Category & Search Handlers (For Home Highlights)
    window.selectAppCategory = function (catId) {
        triggerHaptic();
        activeCategory = catId;
        
        // Update pills active class
        const pills = document.querySelectorAll('#appCategoryPills .app-cat-pill');
        pills.forEach(p => {
            if (p.getAttribute('data-cat') === catId) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        // Update section title
        const titleMap = {
            all: '🔥 Meistbestellt & empfohlen',
            bestseller: '🔥 Am häufigsten bestellt',
            specialrolls: '🍣 Special Rolls & Fusion',
            sushimenu: '🍱 Sushi Sets zum Teilen',
            nigirimaki: '🍙 Frische Nigiri & Maki',
            warmekueche: '🍜 Warme Gerichte & Wok',
            bowls: '🥗 Frische Poke Bowls & Salate',
            vorspeisen: '🥟 Vorspeisen & Fingerfood',
            drinks: '🍹 Hausgemachte Drinks & Desserts'
        };
        const titleEl = document.getElementById('appMenuSectionTitle');
        if (titleEl && titleMap[catId]) {
            titleEl.textContent = titleMap[catId];
        }

        renderAppDishes();
    };

    window.filterAppDishes = function (query) {
        currentSearchTerm = query || '';
        const clearBtn = document.getElementById('appSearchClear');
        if (clearBtn) {
            clearBtn.style.display = currentSearchTerm.length > 0 ? 'flex' : 'none';
        }
        renderAppDishes();
    };

    window.clearAppSearch = function () {
        triggerHaptic();
        const input = document.getElementById('appSearchInput');
        if (input) {
            input.value = '';
            input.focus();
        }
        window.filterAppDishes('');
    };

    window.focusAppSearch = function () {
        triggerHaptic();
        const input = document.getElementById('appSearchInput');
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => input.focus(), 300);
        }
    };

    // =========================================================
    // 8B. FULL NATIVE APP MENU CONTROLLER (For menu.html)
    // =========================================================
    let appFullMenuItems = [];
    let appMenuSelectedCat = 'all';
    let appMenuSearchTerm = '';
    let appMenuDietFilter = 'all';
    let appMenuVisibleCount = 40;
    const APP_MENU_PAGE_SIZE = 40;

    function getCategoryFallbackImage(catId) {
        const cat = String(catId || '').toLowerCase().trim();
        const CAT_IMAGES = {
            vorspeisen: 'assets/477094040_943569787952278_5086544566261599514_n.webp',
            salate: 'assets/salad_new_banner.png',
            suppen: 'assets/soup_new_banner.png',
            hauptspeisen: 'assets/474747577_583620977982257_5069519367255368765_n.webp',
            teriyaki: 'assets/474747577_583620977982257_5069519367255368765_n.webp',
            pokebowl: 'assets/sake-poke-bowl-with-rice-or-salad.webp',
            bowls: 'assets/sake-poke-bowl-with-rice-or-salad.webp',
            maki: 'assets/banh-mi-shushi.webp',
            nigiri: 'assets/premium_sushi_1.webp',
            insideout: 'assets/678a39d1596da842cc63c03c 1.webp',
            'inside-out': 'assets/678a39d1596da842cc63c03c 1.webp',
            sashimi: 'assets/premium_sashimi.webp',
            crunchy: 'assets/10 3498178 1.webp',
            'crunchy-inside-out-rolls': 'assets/10 3498178 1.webp',
            bigrolls: 'assets/bua-tiec-shushi.webp',
            'big-rolls': 'assets/bua-tiec-shushi.webp',
            minirolls: 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.webp',
            'mini-rolls': 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.webp',
            specialrolls: 'assets/premium_rolls.webp',
            'special-rolls': 'assets/premium_rolls.webp',
            firenigiri: 'assets/premium_sushi_1.webp',
            'fire-nigiri': 'assets/premium_sushi_1.webp',
            temaki: 'assets/dsc06551_master.webp',
            sushimenu: 'assets/sushi-platter-premium.webp',
            menus: 'assets/sushi-platter-premium.webp',
            'warm-dishes': 'assets/474747577_583620977982257_5069519367255368765_n.webp',
            dessert: 'assets/dessert_mochi.webp',
            desserts: 'assets/dessert_mochi.webp',
            getranke: 'assets/drink_cocktail.webp',
            getraenke: 'assets/drink_cocktail.webp',
            drinks: 'assets/drink_cocktail.webp',
            softdrinks: 'assets/drink_softdrink.webp',
            beilagen: 'assets/524354655_17842903512542764_6403983830540063508_n11 1.webp'
        };
        return CAT_IMAGES[cat] || 'assets/close-up-sushi-served-table 1.webp';
    }

    function getDishFallbackImage(catId, itemName) {
        const category = String(catId || '').toLowerCase().trim();
        const normalizedName = String(itemName || '')
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const drinkCategories = ['getranke', 'getraenke', 'drinks', 'beverages', 'softdrinks'];
        const sushiCategories = [
            'specialrolls', 'special-rolls', 'sushimenu', 'menus', 'sashimi',
            'nigiri', 'firenigiri', 'fire-nigiri', 'crunchy',
            'crunchy-inside-out-rolls', 'bigrolls', 'big-rolls', 'minirolls',
            'mini-rolls', 'insideout', 'inside-out', 'maki', 'temaki'
        ];

        // The menu category always wins over name keywords. For example, "Sake"
        // is salmon in a Maki/Nigiri category but a drink in Getränke.
        // 1. Drinks / Getränke granular detection
        if (drinkCategories.includes(category)) {
            // Water
            if (/wasser|mineral|naturell|sprudel|still/.test(normalizedName)) {
                return 'assets/drink_water.webp';
            }
            // Softdrinks / Cola / Fanta / Sprite
            if (/cola|coca|fanta|sprite|spezi|ginger|tonic|soda|schorle|7up|pepsi/.test(normalizedName)) {
                return 'assets/drink_softdrink.webp';
            }
            // Fresh Juices / Säfte
            if (/apfel|ananas|maracuja|orange|mango|kirsche|banane|saft|juice|guave|lychee|erdbeer/.test(normalizedName) && !/lassi|tea|tee/.test(normalizedName)) {
                return 'assets/drink_juice.webp';
            }
            // Coffee & Tea
            if (/kaffee|coffee|cafe|tea|tee|ingwer|jasmin|matcha|espresso|cappuccino|latte/.test(normalizedName)) {
                return 'assets/drink_coffee_tea.webp';
            }
            // Beer
            if (/bier|beer|tiger|saigon|singha|heineken|pils|weizen|radler|asahi|kirin|sapporo/.test(normalizedName)) {
                return 'assets/drink_beer.webp';
            }
            // Wine & Sake & Spirits
            if (/wein|wine|sake|pflaumenwein|prosecco|champagner|spritz|hugo|grauburgunder|chardonnay|merlot|riesling/.test(normalizedName)) {
                return 'assets/drink_wine.webp';
            }
            // Homemade drinks, Limonaden, Lassi, Cocktails
            if (/homemade|lassi|nha dam|limonad|eistee|chanh|cocktail|shake|smoothie|aloe/.test(normalizedName)) {
                return 'assets/drink_homemade.webp';
            }
            // Default drinks
            return 'assets/drink_cocktail.webp';
        }

        // 2. Desserts
        if (category === 'dessert' || category === 'desserts') {
            return 'assets/dessert_mochi.webp';
        }

        // 3. Soups & Salads
        if (category === 'suppen' || category === 'soup') {
            return 'assets/soup_new_banner.png';
        }
        if (category === 'salate' || category === 'salad') {
            if (/garnel|ebi|shrimp/.test(normalizedName)) return 'assets/salat_mit_garnelen_88520.webp';
            return 'assets/salad_new_banner.png';
        }

        // 4. Warm Dishes / Hauptspeisen / Teriyaki / Curry
        if (category === 'hauptspeisen' || category === 'teriyaki' || category === 'warm-dishes' || category === 'warmekueche') {
            if (category === 'teriyaki' && /thunfisch|tuna/.test(normalizedName)) {
                return 'assets/Image_Teriyaki-Tuna-Tataki-Flatbread_Teriyaki-Sauce_RT_SV_BKP_092921-5.webp';
            }
            return 'assets/474747577_583620977982257_5069519367255368765_n.webp';
        }

        // 5. Vorspeisen / Appetizers
        if (category === 'vorspeisen' || category === 'starters') {
            return 'assets/477094040_943569787952278_5086544566261599514_n.webp';
        }

        // 6. Bowls / Poke Bowl
        if (category === 'pokebowl' || category === 'bowls') {
            return 'assets/sake-poke-bowl-with-rice-or-salad.webp';
        }

        // 7. Sides / Beilagen
        if (category === 'beilagen' || category === 'sides') {
            return 'assets/524354655_17842903512542764_6403983830540063508_n11 1.webp';
        }

        // 8. Sushi categories
        if (category === 'specialrolls' || category === 'special-rolls' || /special|queen|dragon|rainbow|tiger|flambiert|deluxe/.test(normalizedName)) {
            return 'assets/premium_rolls.webp';
        }
        if (category === 'sushimenu' || category === 'menus' || /menu|set|platte|box|party/.test(normalizedName)) {
            return 'assets/sushi-platter-premium.webp';
        }
        if (category === 'sashimi' || /sashimi/.test(normalizedName)) {
            return 'assets/premium_sashimi.webp';
        }
        if (category === 'nigiri' || category === 'firenigiri' || category === 'fire-nigiri' || /nigiri|aburi/.test(normalizedName)) {
            return 'assets/premium_sushi_1.webp';
        }
        if (category === 'crunchy' || category === 'crunchy-inside-out-rolls' || /crunch|tempura roll|fried roll/.test(normalizedName)) {
            return 'assets/10 3498178 1.webp';
        }
        if (category === 'bigrolls' || category === 'big-rolls') {
            return 'assets/bua-tiec-shushi.webp';
        }
        if (category === 'minirolls' || category === 'mini-rolls') {
            return 'assets/vegan-crunchiy-california-rolls-with-tofu-08c0ea7eeb121ea89055bbc92a83a9bd 1.webp';
        }
        if (category === 'insideout' || category === 'inside-out') {
            return 'assets/678a39d1596da842cc63c03c 1.webp';
        }
        if (category === 'maki' || /maki/.test(normalizedName)) {
            return 'assets/banh-mi-shushi.webp';
        }
        if (category === 'temaki' || /temaki/.test(normalizedName)) {
            return 'assets/dsc06551_master.webp';
        }

        // Name-based recovery is only used for uncategorized legacy items.
        // It intentionally runs after the category rules to avoid collisions
        // such as Sake Maki/Sake Nigiri being displayed as wine.
        if (!sushiCategories.includes(category)) {
            if (/dessert|mochi|dragon ball|banane|chuoi|sesam|eis|ice cream|matcha eis/.test(normalizedName)) {
                return 'assets/dessert_mochi.webp';
            }
            if (/suppe|soup|miso|ramen|canh|tom yum|tom kha/.test(normalizedName)) {
                return 'assets/soup_new_banner.png';
            }
            if (/salat|salad|nom|goi/.test(normalizedName)) {
                return /garnel|ebi|shrimp/.test(normalizedName)
                    ? 'assets/salat_mit_garnelen_88520.webp'
                    : 'assets/salad_new_banner.png';
            }
            if (/curry|erdnuss|teriyaki|gebratene|udon|pad thai|rice|reis gericht|pho|com/.test(normalizedName)) {
                return 'assets/474747577_583620977982257_5069519367255368765_n.webp';
            }
            if (/spring roll|fruhlingsrolle|sommerrolle|summer roll|nem|gyoza|wantan|edamame|yakitori|sate/.test(normalizedName)) {
                return 'assets/477094040_943569787952278_5086544566261599514_n.webp';
            }
            if (/poke|bowl/.test(normalizedName)) {
                return 'assets/sake-poke-bowl-with-rice-or-salad.webp';
            }
            if (/duftreis|sushi reis|ingwer|wasabi|sose|sauce|nudeln/.test(normalizedName)) {
                return 'assets/524354655_17842903512542764_6403983830540063508_n11 1.webp';
            }
            if (/coca|cola|fanta|sprite|limonade|eistee|lassi|mineralwasser|bier|radler|wein|espresso|cappuccino|saft|juice/.test(normalizedName)) {
                if (/wasser|naturell|sprudel/.test(normalizedName)) return 'assets/drink_water.webp';
                if (/cola|fanta|sprite|spezi/.test(normalizedName)) return 'assets/drink_softdrink.webp';
                if (/bier|beer|pils/.test(normalizedName)) return 'assets/drink_beer.webp';
                if (/wein|wine/.test(normalizedName)) return 'assets/drink_wine.webp';
                if (/kaffee|coffee|cafe|tea|tee/.test(normalizedName)) return 'assets/drink_coffee_tea.webp';
                if (/saft|juice/.test(normalizedName)) return 'assets/drink_juice.webp';
                return 'assets/drink_homemade.webp';
            }
        }

        return getCategoryFallbackImage(category);
    }

    function resolveDishImage(catId, item) {
        const candidate = item && typeof item.image === 'string' ? item.image.trim() : '';
        const cat = String(catId || '').toLowerCase().trim();
        const isDrinkOrDessertOrSide = ['getranke', 'drinks', 'getraenke', 'softdrinks', 'dessert', 'desserts', 'beilagen'].includes(cat);
        const curatedImage = window.LEO_DISH_IMAGE_CATALOG && typeof window.LEO_DISH_IMAGE_CATALOG.resolve === 'function'
            ? window.LEO_DISH_IMAGE_CATALOG.resolve(catId, item)
            : '';

        if (candidate && /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i.test(candidate)) {
            // Prevent generic sushi images from being assigned to drinks / desserts / sides
            if (isDrinkOrDessertOrSide && /sushi|rolls|maki|nigiri|sashimi|platter|close-up-sushi/i.test(candidate)) {
                return curatedImage || getDishFallbackImage(catId, item && (item.name || item.cleanName));
            }
            return candidate;
        }
        return curatedImage || getDishFallbackImage(catId, item && (item.name || item.cleanName));
    }

    function getDishImageRenderData(reference) {
        const catalog = window.LEO_DISH_IMAGE_CATALOG;
        const sprite = catalog && typeof catalog.parse === 'function' ? catalog.parse(reference) : null;
        if (!sprite) return { src: reference, style: '' };

        // Center the requested square cell inside any card aspect ratio without
        // stretching the food photo. Percent transforms are relative to the
        // complete 4x4 sheet, so one cell occupies exactly 25% per axis.
        const translateX = -(sprite.column * 25 + 12.5);
        const translateY = -(sprite.row * 25 + 12.5);
        return {
            src: sprite.src,
            style: `width:400%;height:auto;max-width:none;left:50%;top:50%;object-fit:initial;transform:translate(${translateX}%,${translateY}%);`
        };
    }

    function renderAppDishImageTag(reference, alt, className, fallback) {
        const renderData = getDishImageRenderData(reference);
        const styleAttr = renderData.style ? ` style="${renderData.style}"` : '';
        return `<img src="${renderData.src}" alt="${alt || ''}" class="${className}" loading="eager" decoding="async"${styleAttr} onerror="this.onerror=null;this.removeAttribute('style');this.src='${fallback}'">`;
    }

    function applyAppDishImage(element, reference, fallback) {
        if (!element) return;
        const renderData = getDishImageRenderData(reference);
        element.onerror = function () {
            this.onerror = null;
            this.removeAttribute('style');
            this.src = fallback;
        };
        element.src = renderData.src;
        if (renderData.style) element.setAttribute('style', renderData.style);
        else element.removeAttribute('style');
    }

    function enforceNativeMenuLayout() {
        const appDashboard = document.getElementById('appNativeMenuDashboard');
        if (!appDashboard) return;

        document.documentElement.classList.add('is-capacitor-app');
        if (document.body) document.body.classList.add('is-capacitor-app');
        appDashboard.style.setProperty('display', 'block', 'important');

        const websiteMenu = document.getElementById('menuOrderPage');
        if (websiteMenu) websiteMenu.style.setProperty('display', 'none', 'important');
    }

    function initNativeAppMenu() {
        const menuGrid = document.getElementById('appMenuFoodGrid');
        if (!menuGrid) return;

        enforceNativeMenuLayout();

        // Sync branch text on menu page
        syncAppMenuBranch();

        if (!ensureAppBranchSelection()) {
            appFullMenuItems = [];
            menuGrid.innerHTML = '<div class="app-menu-loading">📍 Bitte zuerst eine Filiale auswählen, um die passende Speisekarte zu sehen.</div>';
            return;
        }

        // Load only the API menu belonging to the explicitly selected branch.
        const rawMenu = getExactAppBranchMenu();
        if (!rawMenu || rawMenu.length === 0) {
            menuGrid.innerHTML = '<div class="app-menu-loading">Speisekarte der gewählten Filiale wird geladen…</div>';
            setTimeout(initNativeAppMenu, 350);
            return;
        }

        appFullMenuItems = [];

        rawMenu.forEach(cat => {
            const catId = (cat.id || '').toLowerCase();
            const catTitle = cat.title || 'Gerichte';
            const catIcon = (typeof getCategoryIcon === 'function') ? getCategoryIcon(catTitle) : '🍣';

            (cat.items || []).forEach((item, idx) => {
                let num = '';
                const numMatch = item.name.match(/^([A-Za-z0-9]+)\.\s*(.+)$/);
                let cleanName = item.name;
                if (numMatch) {
                    num = numMatch[1];
                    cleanName = numMatch[2];
                }

                // Remove allergen codes in parens for clean title
                cleanName = cleanName.replace(/\s*\([A-Z0-9,]+\)\s*/g, '').trim();

                const priceNum = typeof item.price === 'number' ? item.price : parseFloat((item.price || '0').replace(',', '.'));
                const dishImg = resolveDishImage(catId, item);

                appFullMenuItems.push(hydrateDishBestseller({
                    id: `full_${catId}_${idx}`,
                    rawName: item.name,
                    name: cleanName || item.name,
                    number: num || `${idx + 1}`,
                    catId: catId,
                    catTitle: catTitle,
                    catIcon: catIcon,
                    price: priceNum,
                    priceStr: item.price ? `€ ${item.price}` : formatEuro(priceNum),
                    desc: item.desc || '',
                    descEn: item.descEn || '',
                    vegetarian: !!item.vegetarian,
                    spicy: !!item.spicy,
                    hasOptions: !!(item.hasOptions && item.options && item.options.length > 0),
                    options: item.options || [],
                    image: dishImg,
                    badge: item.vegetarian ? '🌱 Veggie' : (item.spicy ? '🌶️ Scharf' : (catTitle.includes('Special') ? '🔥 Special' : ''))
                }));
            });
        });

        // Render Category Pills
        renderAppMenuCategoryPills(rawMenu);

        // Render Menu Dishes
        renderAppMenuDishes();
    }

    function syncAppMenuBranch() {
        const branchEl = document.getElementById('appMenuCurrentBranchText');
        if (!branchEl) return;
        const branch = ensureAppBranchSelection();
        syncAppBranchLabels(branch ? (branch.id === 'branch_haupt' ? 'haupt' : 'flora') : null);
    }

    let appBranchMenuLoadPromise = null;

    async function loadExactAppBranchMenu() {
        const branch = ensureAppBranchSelection();
        if (!branch || typeof window.loadMenuFromAPI !== 'function') return;
        if (appBranchMenuLoadPromise) return appBranchMenuLoadPromise;

        try {
            appBranchMenuLoadPromise = window.loadMenuFromAPI();
            await appBranchMenuLoadPromise;
            if (window.LEO_MENU_BRANCH_ID !== branch.id) return;
            APP_DISHES = [];
            appFullMenuItems = [];
            renderAppDishes();
            initNativeAppMenu();
        } catch (error) {
            console.error('Error loading branch menu:', error);
        } finally {
            appBranchMenuLoadPromise = null;
        }
    }

    function renderAppMenuCategoryPills(rawMenu) {
        const pillsContainer = document.getElementById('appMenuCategoryPills');
        if (!pillsContainer) return;

        let pillsHtml = `
            <button type="button" class="app-cat-pill ${appMenuSelectedCat === 'all' ? 'active' : ''}" data-cat="all" onclick="window.selectAppMenuCategory('all')">
                ✨ Alle Gerichte
            </button>
        `;

        rawMenu.forEach(cat => {
            const catId = (cat.id || '').toLowerCase();
            const catTitle = cat.title || 'Kategorie';
            const catIcon = (typeof getCategoryIcon === 'function') ? getCategoryIcon(catTitle) : '🍣';
            const isActive = appMenuSelectedCat === catId;

            pillsHtml += `
                <button type="button" class="app-cat-pill ${isActive ? 'active' : ''}" data-cat="${catId}" onclick="window.selectAppMenuCategory('${catId}')">
                    ${catIcon} ${catTitle}
                </button>
            `;
        });

        pillsContainer.innerHTML = pillsHtml;
    }

    function renderAppMenuDishes() {
        const grid = document.getElementById('appMenuFoodGrid');
        if (!grid) return;

        let filtered = appFullMenuItems;

        // Filter Category
        if (appMenuSelectedCat && appMenuSelectedCat !== 'all') {
            filtered = filtered.filter(d => d.catId === appMenuSelectedCat);
        }

        // Filter Dietary
        if (appMenuDietFilter === 'vegan') {
            filtered = filtered.filter(d => d.vegetarian);
        } else if (appMenuDietFilter === 'spicy') {
            filtered = filtered.filter(d => d.spicy);
        } else if (appMenuDietFilter === 'bestseller') {
            filtered = filtered
                .filter(d => d.isBestseller)
                .sort((a, b) => (a.bestsellerRank || 999) - (b.bestsellerRank || 999));
        }

        // Filter Search
        if (appMenuSearchTerm && appMenuSearchTerm.trim() !== '') {
            const query = appMenuSearchTerm.toLowerCase().trim();
            filtered = filtered.filter(d => 
                d.name.toLowerCase().includes(query) ||
                d.rawName.toLowerCase().includes(query) ||
                d.desc.toLowerCase().includes(query) ||
                (d.descEn && d.descEn.toLowerCase().includes(query)) ||
                d.number.toLowerCase() === query
            );
        }

        const countBadge = document.getElementById('appMenuItemCountBadge');
        if (countBadge) {
            countBadge.textContent = appMenuDietFilter === 'bestseller'
                ? `${filtered.length} Bestseller`
                : `${filtered.length} Gerichte`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: span 2; text-align: center; padding: 50px 20px; color: rgba(255,255,255,0.6);">
                    <div style="font-size: 42px; margin-bottom: 12px;">🍣🔍</div>
                    <div style="font-weight: 800; color: #fff; font-size: 16px; margin-bottom: 6px;">Keine Gerichte gefunden</div>
                    <div style="font-size: 13px;">Versuche einen anderen Suchbegriff oder wähle eine andere Kategorie.</div>
                </div>
            `;
            return;
        }

        const totalFiltered = filtered.length;
        const visibleDishes = filtered.slice(0, appMenuVisibleCount);

        grid.innerHTML = visibleDishes.map(dish => {
            const qty = getItemCartQty(dish.rawName) || getItemCartQty(dish.name);
            const priceDisplay = dish.priceStr || formatEuro(dish.price);

            return `
                <div class="app-food-card" id="dish_card_${dish.id}">
                    <button type="button" class="app-food-img-wrap app-food-img-button" onclick="window.handleAppDishCardClick('${dish.id}')" aria-label="Details zu ${dish.name} öffnen">
                        ${renderAppDishImageTag(dish.image, dish.name, 'app-food-img', getDishFallbackImage(dish.catId, dish.rawName || dish.name))}
                        ${dish.badge ? `<span class="app-food-tag">${dish.badge}</span>` : ''}
                    </button>
                    <div class="app-food-body">
                        <button type="button" class="app-food-title app-food-title-btn" onclick="window.handleAppDishCardClick('${dish.id}')">
                            <span style="color: var(--app-gold); font-size: 11px; margin-right: 4px; font-weight: 800;">${dish.number ? '#' + dish.number : ''}</span>${dish.name}
                        </button>
                        <div class="app-food-desc">${dish.desc || dish.descEn || ''}</div>
                        <div class="app-food-footer">
                            <span class="app-food-price">${priceDisplay}</span>
                            <div class="app-card-action-container" id="menu_action_${dish.id}">
                                ${renderMenuCardActionHtml(dish, qty)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('') + (visibleDishes.length < totalFiltered ? `
            <div class="app-menu-load-more-wrap">
                <button type="button" class="app-menu-load-more-btn" onclick="window.loadMoreAppMenuDishes()">
                    Mehr Gerichte laden (${visibleDishes.length} von ${totalFiltered})
                </button>
            </div>
        ` : '');
    }

    function renderMenuCardActionHtml(dish, qty) {
        if (dish.hasOptions) {
            return `
                <button type="button" class="app-card-add-btn app-card-option-btn" onclick="event.stopPropagation(); window.handleAppDishCardClick('${dish.id}')" aria-label="Option für ${dish.name} wählen" title="Option wählen">
                    + Wahl
                </button>
            `;
        }
        if (qty > 0) {
            return `
                <div class="app-card-stepper" onclick="event.stopPropagation()">
                    <button type="button" class="app-stepper-btn" onclick="window.decrementAppItem('${dish.rawName}')" aria-label="${dish.name} entfernen">−</button>
                    <span class="app-stepper-qty">${qty}</span>
                    <button type="button" class="app-stepper-btn" onclick="window.incrementAppItem('${dish.rawName}', ${dish.price}, '${dish.image}')" aria-label="${dish.name} hinzufügen">+</button>
                </div>
            `;
        }
        return `
            <button type="button" class="app-card-add-btn" onclick="event.stopPropagation(); window.incrementAppItem('${dish.rawName}', ${dish.price}, '${dish.image}')" aria-label="${dish.name} hinzufügen" title="Hinzufügen">+</button>
        `;
    }

    window.selectAppMenuCategory = function(catId) {
        triggerHaptic();
        appMenuSelectedCat = catId;
        appMenuVisibleCount = APP_MENU_PAGE_SIZE;
        document.querySelectorAll('#appMenuCategoryPills .app-cat-pill').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === catId);
        });

        // Center clicked pill
        const activeBtn = document.querySelector(`#appMenuCategoryPills .app-cat-pill[data-cat="${catId}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }

        renderAppMenuDishes();
    };

    window.filterAppMenuDishes = function(query) {
        appMenuSearchTerm = query || '';
        appMenuVisibleCount = APP_MENU_PAGE_SIZE;
        const clearBtn = document.getElementById('appMenuSearchClear');
        if (clearBtn) {
            clearBtn.style.display = appMenuSearchTerm.length > 0 ? 'flex' : 'none';
        }
        renderAppMenuDishes();
    };

    window.clearAppMenuSearch = function() {
        triggerHaptic();
        const input = document.getElementById('appMenuSearchInput');
        if (input) {
            input.value = '';
            input.focus();
        }
        window.filterAppMenuDishes('');
    };

    window.focusAppMenuSearch = function() {
        triggerHaptic();
        const input = document.getElementById('appMenuSearchInput');
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => input.focus(), 300);
        }
    };

    window.toggleAppMenuDietFilter = function(filterType) {
        triggerHaptic();
        appMenuDietFilter = filterType;
        appMenuVisibleCount = APP_MENU_PAGE_SIZE;
        document.querySelectorAll('.app-filter-chips-row .app-chip-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const idMap = {
            all: 'chipMenuAll',
            vegan: 'chipMenuVegan',
            spicy: 'chipMenuSpicy',
            bestseller: 'chipMenuBestseller'
        };
        const activeBtn = document.getElementById(idMap[filterType]);
        if (activeBtn) activeBtn.classList.add('active');

        renderAppMenuDishes();
    };

    window.loadMoreAppMenuDishes = function() {
        triggerHaptic();
        appMenuVisibleCount += APP_MENU_PAGE_SIZE;
        renderAppMenuDishes();
    };

    window.handleAppDishCardClick = function(dishId) {
        triggerHaptic();
        window.openAppDishDetail(dishId);
    };

    function openAppDishDetailWithDish(dish) {
        if (!dish) return;
        window.openAppDishDetail(dish.id);
    }

    // 9. Floating Sticky Cart Bar
    function initFloatingCartBar() {
        const page = getCurrentPage();
        if (page !== 'home' && page !== 'menu') return;
        if (document.getElementById('appFloatingCartBar')) return;
        const bar = document.createElement('div');
        bar.id = 'appFloatingCartBar';
        bar.className = 'app-floating-cart-bar';
        bar.setAttribute('role', 'button');
        bar.setAttribute('tabindex', '0');
        bar.setAttribute('aria-label', 'Warenkorb öffnen');
        bar.onclick = function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.openAppCartModal();
        };
        bar.addEventListener('click', function (e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.openAppCartModal();
        });
        bar.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.openAppCartModal();
            }
        });
        bar.innerHTML = `
            <div class="app-cart-bar-left" onclick="window.openAppCartModal()">
                <div class="app-cart-bar-badge" id="appFloatingCartBadge">0</div>
                <div class="app-cart-bar-info">
                    <span class="app-cart-bar-count" id="appFloatingCartCountText">Warenkorb</span>
                    <span class="app-cart-bar-total" id="appFloatingCartTotalText">0,00 €</span>
                </div>
            </div>
            <div class="app-cart-bar-action" onclick="window.openAppCartModal()">
                <span>Bestellen</span>
                <span>➔</span>
            </div>
        `;
        document.body.appendChild(bar);
        renderFloatingCartBar();
    }

    function renderFloatingCartBar() {
        const bar = document.getElementById('appFloatingCartBar');
        if (!bar) return;

        const count = getCartItemCount();
        const subtotal = getCartSubtotal();

        if (count > 0) {
            bar.classList.add('active');
            bar.style.display = 'flex';
            const badgeEl = document.getElementById('appFloatingCartBadge');
            const countEl = document.getElementById('appFloatingCartCountText');
            const totalEl = document.getElementById('appFloatingCartTotalText');

            if (badgeEl) badgeEl.textContent = count;
            if (countEl) countEl.textContent = `${count} ${count === 1 ? 'Artikel' : 'Artikel'}`;
            if (totalEl) totalEl.textContent = formatEuro(subtotal);
        } else {
            bar.classList.remove('active');
            bar.style.display = 'none';
        }
    }

    // 10. In-App Cart Bottom Sheet Modal
    function initAppCartModal() {
        let modal = document.getElementById('appCartSheetOverlay');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'appCartSheetOverlay';
            modal.className = 'app-cart-sheet-overlay';
            modal.innerHTML = `
                <div class="app-cart-sheet-content" role="dialog" aria-modal="true" aria-labelledby="appCartSheetTitle" onclick="event.stopPropagation()">
                    <div class="app-cart-sheet-header">
                        <h3 class="app-cart-sheet-title" id="appCartSheetTitle">🛍️ Dein Warenkorb</h3>
                        <button type="button" class="app-cart-sheet-close" onclick="window.closeAppCartModal()" aria-label="Warenkorb schließen">✕</button>
                    </div>
                    <div class="app-cart-sheet-body" id="appCartSheetBody">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="app-cart-sheet-footer" id="appCartSheetFooter">
                        <!-- Total & Checkout CTA -->
                    </div>
                </div>
            `;
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    window.closeAppCartModal();
                }
            });
            document.body.appendChild(modal);
        }
        return modal;
    }

    window.openAppCartModal = function () {
        triggerHaptic();
        const modal = initAppCartModal();
        renderAppCartSheetContent();
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            const closeButton = modal.querySelector('.app-cart-sheet-close');
            if (closeButton) closeButton.focus({ preventScroll: true });
        }
    };

    window.closeAppCartModal = function () {
        const modal = document.getElementById('appCartSheetOverlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 200);
        }
    };

    let appliedVoucherCode = localStorage.getItem('leo_applied_voucher') || localStorage.getItem('leo_applied_coupon') || localStorage.getItem('discountCode') || '';

    function renderAppCartSheetContent() {
        const bodyEl = document.getElementById('appCartSheetBody');
        const footerEl = document.getElementById('appCartSheetFooter');
        if (!bodyEl || !footerEl) return;

        const cart = getAppCart();

        if (cart.length === 0) {
            bodyEl.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.6);">
                    <div style="font-size: 48px; margin-bottom: 12px;">🛒</div>
                    <div style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px;">Dein Warenkorb ist leer</div>
                    <div style="font-size: 13px;">Wähle köstliche Sushi-Spezialitäten aus unserem Angebot.</div>
                </div>
            `;
            footerEl.innerHTML = `
                <button type="button" class="app-cart-checkout-btn" onclick="window.closeAppCartModal()">
                    <span>🍣 Weiter einkaufen</span>
                </button>
            `;
            return;
        }

        bodyEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${cart.map(item => `
                    <div class="app-cart-item-row">
                        <div class="app-cart-item-img-wrap">
                            ${renderAppDishImageTag(item.image, item.name, 'app-cart-item-img', 'assets/close-up-sushi-served-table 1.webp')}
                        </div>
                        <div class="app-cart-item-info">
                            <div class="app-cart-item-name">${item.name}</div>
                            <div class="app-cart-item-price">${formatEuro(item.price * item.qty)}</div>
                        </div>
                        <div class="app-card-stepper">
                            <button type="button" class="app-stepper-btn" onclick="window.decrementAppItem('${item.name}'); window.renderAppCartSheetContent();" aria-label="${item.name} entfernen">−</button>
                            <span class="app-stepper-qty">${item.qty}</span>
                            <button type="button" class="app-stepper-btn" onclick="window.incrementAppItem('${item.name}', ${item.price}, '${item.image}'); window.renderAppCartSheetContent();" aria-label="${item.name} hinzufügen">+</button>
                        </div>
                        <button type="button" class="app-cart-item-remove" onclick="window.removeAppItem('${item.name}')" aria-label="${item.name} vollständig entfernen" title="Entfernen">🗑️</button>
                    </div>
                `).join('')}
            </div>

            <!-- Voucher Code Box -->
            <div style="background: rgba(229,207,142,0.08); border: 1px dashed rgba(229,207,142,0.3); border-radius: 14px; padding: 12px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--app-gold);">🎟️ Rabattcode</span>
                    ${appliedVoucherCode ? `<span style="font-size: 11px; color: #4ade80; font-weight: 700;">Aktiv: ${appliedVoucherCode} (-10%)</span>` : ''}
                </div>
                <div style="display: flex; gap: 8px;">
                    <input type="text" id="appVoucherInput" value="${appliedVoucherCode || ''}" placeholder="z.B. APP10" style="flex: 1; background: #1a1a22; border: 1px solid rgba(229,207,142,0.25); border-radius: 10px; padding: 8px 12px; color: #fff; font-size: 13px; text-transform: uppercase;">
                    <button type="button" onclick="window.applyAppVoucher(document.getElementById('appVoucherInput').value)" style="background: var(--app-gold); border: none; border-radius: 10px; padding: 8px 16px; color: #000; font-size: 12px; font-weight: 800; cursor: pointer;">Anwenden</button>
                </div>
            </div>
        `;

        window.renderAppCartSheetContent = renderAppCartSheetContent;

        const subtotal = getCartSubtotal();
        const automaticDiscountAmount = subtotal > 15 ? subtotal * 0.10 : 0;
        const discountRate = (appliedVoucherCode.toUpperCase() === 'APP10') ? 0.10 : 0;
        const discountAmount = (subtotal - automaticDiscountAmount) * discountRate;
        const serviceType = localStorage.getItem('leo_service_type') || 'delivery';
        const deliveryFee = 0;
        const grandTotal = Math.max(0, subtotal - automaticDiscountAmount - discountAmount + deliveryFee);

        footerEl.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.75);">
                <div style="display: flex; justify-content: space-between;">
                    <span>Zwischensumme:</span>
                    <span style="color: #fff; font-weight: 700;">${formatEuro(subtotal)}</span>
                </div>
                ${automaticDiscountAmount > 0 ? `
                    <div style="display: flex; justify-content: space-between; color: #4ade80;">
                        <span>Automatischer Rabatt (10%):</span>
                        <span style="font-weight: 700;">-${formatEuro(automaticDiscountAmount)}</span>
                    </div>
                ` : ''}
                ${discountAmount > 0 ? `
                    <div style="display: flex; justify-content: space-between; color: #4ade80;">
                        <span>Rabatt (APP10 -10%):</span>
                        <span style="font-weight: 700;">-${formatEuro(discountAmount)}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between;">
                    <span>${serviceType === 'delivery' ? 'Lieferung (innerhalb 5 km):' : 'Abholung:'}</span>
                    <span style="color: #fff; font-weight: 700;">Kostenlos</span>
                </div>
                <div class="app-cart-total-row" style="margin-top: 6px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <span>Gesamtbetrag:</span>
                    <span style="color: var(--app-gold); font-size: 18px;">${formatEuro(grandTotal)}</span>
                </div>
            </div>

            <button type="button" class="app-cart-checkout-btn" onclick="window.goToAppCheckout(event)" aria-label="Zur Kasse gehen">
                <span>💳 Zur Kasse (${formatEuro(grandTotal)})</span>
                <span>➔</span>
            </button>
        `;
    }

    window.goToAppCheckout = function (event) {
        if (event) {
            if (typeof event.preventDefault === 'function') event.preventDefault();
            if (typeof event.stopPropagation === 'function') event.stopPropagation();
        }
        triggerHaptic();

        const cart = getAppCart();
        if (!cart || cart.length === 0) {
            if (window.addNotification) {
                window.addNotification('warning', 'Warenkorb leer', 'Bitte füge zuerst Artikel zu Deinem Warenkorb hinzu.');
            }
            return;
        }

        const branch = ensureAppBranchSelection();
        const branchKey = (branch && branch.id === 'branch_haupt') ? 'haupt' : 'flora';

        try {
            localStorage.setItem('leoCart', JSON.stringify(cart));
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('selected_branch', branchKey);
            localStorage.setItem('leoCartBranchId', (branch && branch.id) ? branch.id : 'branch_flora');
            localStorage.setItem('leoBranchSelectionConfirmed', 'v53');
            if (appliedVoucherCode) {
                localStorage.setItem('leo_applied_voucher', appliedVoucherCode);
                localStorage.setItem('leo_applied_coupon', appliedVoucherCode);
                localStorage.setItem('discountCode', appliedVoucherCode);
            }
        } catch (e) {
            console.warn('Could not save cart state to localStorage', e);
        }

        window.closeAppCartModal();

        if (typeof window.navigateTo === 'function') {
            window.navigateTo('checkout.html');
        } else {
            const query = (window.LEO_IS_NATIVE_APP || (window.location.search && window.location.search.includes('app=true')) || sessionStorage.getItem('leo_app_preview') === 'true') ? '?app=true' : '';
            window.location.href = `checkout.html${query}`;
        }
    };

    window.applyAppVoucher = function (code) {
        triggerHaptic();
        if (!code || code.trim() === '') {
            appliedVoucherCode = '';
            localStorage.removeItem('leo_applied_voucher');
            localStorage.removeItem('leo_applied_coupon');
            localStorage.removeItem('discountCode');
            renderAppCartSheetContent();
            return;
        }

        const clean = code.trim().toUpperCase();
        if (clean === 'APP10') {
            appliedVoucherCode = 'APP10';
            localStorage.setItem('leo_applied_voucher', 'APP10');
            localStorage.setItem('leo_applied_coupon', 'APP10');
            localStorage.setItem('discountCode', 'APP10');
            if (window.addNotification) {
                window.addNotification('success', 'Gutschein eingelöst', '10% Willkommens-Rabatt aktiviert!');
            }
            window.openAppCartModal();
        } else {
            if (window.addNotification) {
                window.addNotification('warning', 'Ungültiger Code', 'Dieser Rabattcode ist nicht verfügbar.');
            }
        }
    };

    // 11. Dish Detail Modal Bottom Sheet (With Option/Protein Selection)
    let selectedDetailDish = null;
    let selectedDetailOption = null;
    let detailQty = 1;

    function initDishDetailModal() {
        if (document.getElementById('appDishDetailOverlay')) return;
        const modal = document.createElement('div');
        modal.id = 'appDishDetailOverlay';
        modal.className = 'app-detail-modal-overlay';
        modal.innerHTML = `
            <div class="app-detail-content" role="dialog" aria-modal="true" aria-labelledby="detailDishTitle" onclick="event.stopPropagation()">
                <div class="app-detail-hero-img-wrap">
                    <img src="assets/close-up-sushi-served-table 1.webp" id="detailHeroImg" alt="Gericht" class="app-detail-hero-img">
                    <button type="button" class="app-detail-close-btn" onclick="window.closeAppDishDetail()" aria-label="Gerichtdetails schließen">✕</button>
                </div>
                <div class="app-detail-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <div>
                            <div class="app-detail-title" id="detailDishTitle">Dish Name</div>
                            <div style="font-size: 12px; color: var(--app-gold); font-weight: 700; margin-top: 2px;" id="detailDishBadge">★ Bestseller</div>
                        </div>
                        <div class="app-detail-price" id="detailDishPrice">0,00 €</div>
                    </div>
                    <div class="app-detail-desc" id="detailDishDesc">Description</div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.5);" id="detailDishAllergens">Allergene: D, G, K</div>
                    
                    <!-- Option / Protein Selector Section -->
                    <div class="app-detail-options-wrap" id="detailOptionsSection" style="display: none;">
                        <div class="app-detail-options-heading">
                            <span class="app-detail-options-title">🍗 Wählen Sie Ihre Zutat / Größe:</span>
                            <span class="app-detail-options-badge">1 Auswählen</span>
                        </div>
                        <div class="app-detail-options-list" id="detailOptionsList" role="radiogroup" aria-label="Zutat oder Größe wählen"></div>
                    </div>

                    <div style="margin-top: 10px;">
                        <label style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 6px; display: block;">Besondere Wünsche / Anmerkung:</label>
                        <input type="text" id="detailDishNote" class="app-detail-note-input" placeholder="z.B. Ohne Koriander, extra Ingwer, pikant...">
                    </div>
                </div>
                <div class="app-detail-footer">
                    <div class="app-card-stepper" style="padding: 6px 10px;">
                        <button type="button" class="app-stepper-btn" onclick="window.changeDetailQty(-1)" aria-label="Anzahl verringern">−</button>
                        <span class="app-stepper-qty" id="detailQtyText" style="font-size: 15px; min-width: 24px;">1</span>
                        <button type="button" class="app-stepper-btn" onclick="window.changeDetailQty(1)" aria-label="Anzahl erhöhen">+</button>
                    </div>
                    <button type="button" class="app-cart-checkout-btn" style="flex: 1;" onclick="window.confirmAddDetailDish()">
                        <span id="detailAddToCartBtnText">➕ In den Warenkorb</span>
                    </button>
                </div>
            </div>
        `;
        modal.addEventListener('click', window.closeAppDishDetail);
        document.body.appendChild(modal);
    }

    window.selectAppDetailOption = function (idx) {
        triggerHaptic();
        if (!selectedDetailDish || !selectedDetailDish.options || !selectedDetailDish.options[idx]) return;
        selectedDetailOption = selectedDetailDish.options[idx];

        const items = document.querySelectorAll('#detailOptionsList .app-option-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === idx);
            item.setAttribute('aria-checked', i === idx ? 'true' : 'false');
        });

        const optPriceNum = typeof selectedDetailOption.price === 'number' ? selectedDetailOption.price : parseFloat((selectedDetailOption.price || '0').replace(',', '.'));
        const priceEl = document.getElementById('detailDishPrice');
        const btnText = document.getElementById('detailAddToCartBtnText');
        if (priceEl) priceEl.textContent = formatEuro(optPriceNum);
        if (btnText) btnText.textContent = `➕ Für ${formatEuro(optPriceNum * detailQty)} hinzufügen`;
    };

    window.openAppDishDetail = function (dishId) {
        if (!requireAppBranchSelection()) return;
        triggerHaptic();
        initDishDetailModal();
        const allDishes = getOrBuildAppDishes();
        const dish = allDishes.find(d => d.id === dishId) || (appFullMenuItems || []).find(d => d.id === dishId);
        if (!dish) return;

        selectedDetailDish = dish;
        detailQty = 1;

        const imgEl = document.getElementById('detailHeroImg');
        const titleEl = document.getElementById('detailDishTitle');
        const badgeEl = document.getElementById('detailDishBadge');
        const priceEl = document.getElementById('detailDishPrice');
        const descEl = document.getElementById('detailDishDesc');
        const allergensEl = document.getElementById('detailDishAllergens');
        const noteEl = document.getElementById('detailDishNote');
        const qtyText = document.getElementById('detailQtyText');
        const btnText = document.getElementById('detailAddToCartBtnText');
        const optionsSec = document.getElementById('detailOptionsSection');
        const optionsList = document.getElementById('detailOptionsList');

        applyAppDishImage(imgEl, dish.image, getDishFallbackImage(dish.cat || dish.catId, dish.rawName || dish.name));
        if (titleEl) titleEl.textContent = dish.name;
        if (badgeEl) badgeEl.textContent = dish.badge || '';
        if (descEl) descEl.textContent = dish.desc;
        if (allergensEl) allergensEl.textContent = dish.allergens ? `Allergene & Zusatzstoffe: ${dish.allergens}` : '';
        if (noteEl) noteEl.value = '';
        if (qtyText) qtyText.textContent = '1';

        if (dish.hasOptions && dish.options && dish.options.length > 0) {
            selectedDetailOption = dish.options[0];
            if (optionsSec && optionsList) {
                optionsSec.style.display = 'block';
                optionsList.innerHTML = dish.options.map((opt, oIdx) => {
                    const optPriceNum = typeof opt.price === 'number' ? opt.price : parseFloat((opt.price || '0').replace(',', '.'));
                    const isSelected = (oIdx === 0);
                    return `
                        <button type="button" class="app-option-item ${isSelected ? 'selected' : ''}" data-idx="${oIdx}" role="radio" aria-checked="${isSelected ? 'true' : 'false'}" onclick="window.selectAppDetailOption(${oIdx})">
                            <div class="app-option-left">
                                <div class="app-option-radio">
                                    <div class="app-option-radio-dot"></div>
                                </div>
                                <div>
                                    <span class="app-option-name">${opt.name}</span>
                                    ${opt.vegetarian ? '<span class="app-option-tag">🌱 Veggie</span>' : ''}
                                </div>
                            </div>
                            <span class="app-option-price">${formatEuro(optPriceNum)}</span>
                        </button>
                    `;
                }).join('');
            }
            const firstPrice = typeof selectedDetailOption.price === 'number' ? selectedDetailOption.price : parseFloat((selectedDetailOption.price || '0').replace(',', '.'));
            if (priceEl) priceEl.textContent = formatEuro(firstPrice);
            if (btnText) btnText.textContent = `➕ Für ${formatEuro(firstPrice)} hinzufügen`;
        } else {
            selectedDetailOption = null;
            if (optionsSec) optionsSec.style.display = 'none';
            if (priceEl) priceEl.textContent = formatEuro(dish.price);
            if (btnText) btnText.textContent = `➕ Für ${formatEuro(dish.price)} hinzufügen`;
        }

        const modal = document.getElementById('appDishDetailOverlay');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            const closeButton = modal.querySelector('.app-detail-close-btn');
            if (closeButton) closeButton.focus({ preventScroll: true });
        }
    };

    window.changeDetailQty = function (delta) {
        triggerHaptic();
        detailQty = Math.max(1, detailQty + delta);
        const qtyText = document.getElementById('detailQtyText');
        const btnText = document.getElementById('detailAddToCartBtnText');
        if (qtyText) qtyText.textContent = detailQty;

        let unitPrice = selectedDetailDish ? selectedDetailDish.price : 0;
        if (selectedDetailOption) {
            unitPrice = typeof selectedDetailOption.price === 'number' ? selectedDetailOption.price : parseFloat((selectedDetailOption.price || '0').replace(',', '.'));
        }
        if (btnText) {
            btnText.textContent = `➕ Für ${formatEuro(unitPrice * detailQty)} hinzufügen`;
        }
    };

    window.confirmAddDetailDish = function () {
        const branch = requireAppBranchSelection();
        if (!branch) return;
        triggerHaptic();
        if (!selectedDetailDish) return;
        const note = (document.getElementById('detailDishNote') || {}).value || '';

        let finalName = selectedDetailDish.name;
        let finalPrice = selectedDetailDish.price;

        if (selectedDetailDish.hasOptions && selectedDetailOption) {
            finalName = `${selectedDetailDish.rawName || selectedDetailDish.name} - ${selectedDetailOption.name}`;
            finalPrice = typeof selectedDetailOption.price === 'number' ? selectedDetailOption.price : parseFloat((selectedDetailOption.price || '0').replace(',', '.'));
        }

        let cart = getAppCart();
        const existingIndex = cart.findIndex(i => i.name === finalName);
        if (existingIndex > -1) {
            cart[existingIndex].qty += detailQty;
            if (note) cart[existingIndex].note = note;
        } else {
            cart.push({
                id: 'app_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: finalName,
                price: finalPrice,
                qty: detailQty,
                image: selectedDetailDish.image,
                note: note,
                branchId: branch.id
            });
        }

        saveAppCart(cart);
        window.closeAppDishDetail();

        if (window.addNotification) {
            window.addNotification('success', 'Hinzugefügt', `${detailQty}x ${finalName} im Warenkorb!`);
        }
    };

    window.closeAppDishDetail = function () {
        const modal = document.getElementById('appDishDetailOverlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    // Native Subpage Topbar Injector (Orders, Profile, Points, Reservation, Checkout)
    function initSubpageTopbar() {
        const page = getCurrentPage();
        if (page === 'home' || page === 'menu') return;
        if (document.querySelector('.app-subpage-topbar')) return;

        const titleMap = {
            orders: '📦 Meine Bestellungen',
            profile: '👤 Mein Profil & VIP',
            points: '⭐ Meine Punkte',
            checkout: '💳 Kasse & Bezahlung',
            reservation: '🪑 Tisch reservieren'
        };

        const title = titleMap[page] || 'LEO SUSHI';
        const backUrl = (page === 'checkout') ? `menu.html${appQuerySuffix}` : `index.html${appQuerySuffix}`;
        const isCheckoutPage = (page === 'checkout');

        const topbar = document.createElement('div');
        topbar.className = 'app-subpage-topbar';
        topbar.innerHTML = `
            <a href="${backUrl}" class="app-topbar-back-btn" aria-label="Zurück">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </a>
            <h1 class="app-topbar-title">${title}</h1>
            ${!isCheckoutPage ? `
            <button type="button" class="app-topbar-cart-btn" onclick="window.openAppCartModal()" aria-label="Warenkorb">
                <span style="font-size: 18px;">🛍️</span>
                <span class="app-topbar-cart-badge" id="appSubpageCartBadge" style="display: none;">0</span>
            </button>
            ` : `<div style="width: 44px; height: 44px;"></div>`}
        `;

        const targetInsert = document.querySelector('.orders-wrapper, .profile-wrapper, .points-wrapper, .reservation-wrapper, .reservation-page, .reservation-container, .checkout-container, .checkout-wrapper, main') || document.body.firstElementChild;
        if (targetInsert && targetInsert.parentNode) {
            targetInsert.parentNode.insertBefore(topbar, targetInsert);
        } else {
            document.body.insertBefore(topbar, document.body.firstChild);
        }
    }

    // 12. Bottom Navigation Bar Initializer
    function initBottomNav() {
        if (document.querySelector('.bottom-nav-bar')) return;

        const currentPage = getCurrentPage();
        const nav = document.createElement('nav');
        nav.className = 'bottom-nav-bar';
        nav.setAttribute('aria-label', 'App Navigation');

        nav.innerHTML = `
            <a href="index.html${appQuerySuffix}" class="nav-item ${currentPage === 'home' ? 'active' : ''}" id="appNavHome" data-page="home" aria-label="Startseite" ${currentPage === 'home' ? 'aria-current="page"' : ''}>
                <div class="nav-icon">${icons.home}</div>
                <span>Home</span>
            </a>
            
            <a href="my-orders.html${appQuerySuffix}" class="nav-item ${currentPage === 'orders' ? 'active' : ''}" id="appNavOrders" data-page="orders" aria-label="Bestellungen" ${currentPage === 'orders' ? 'aria-current="page"' : ''}>
                <div class="nav-icon">${icons.orders}</div>
                <span>Bestellungen</span>
            </a>

            <a href="menu.html${appQuerySuffix}" class="nav-item nav-item-center ${currentPage === 'menu' ? 'active' : ''}" id="appNavMenu" data-page="menu" aria-label="Speisekarte" ${currentPage === 'menu' ? 'aria-current="page"' : ''}>
                <div class="nav-icon-center">${icons.menu}</div>
                <span class="nav-center-label">Speisekarte</span>
            </a>

            <a href="#" class="nav-item ${currentPage === 'checkout' ? 'active' : ''}" id="appNavCart" data-page="cart" aria-label="Warenkorb" ${currentPage === 'checkout' ? 'aria-current="page"' : ''}>
                <div class="nav-icon" style="position: relative;">
                    ${icons.cart}
                    <span class="nav-badge" id="appNavCartBadge" style="display: none;">0</span>
                </div>
                <span>Warenkorb</span>
            </a>

            <a href="profile.html${appQuerySuffix}" class="nav-item ${(currentPage === 'profile' || currentPage === 'points') ? 'active' : ''}" id="appNavProfile" data-page="profile" aria-label="Profil" ${(currentPage === 'profile' || currentPage === 'points') ? 'aria-current="page"' : ''}>
                <div class="nav-icon">${icons.profile}</div>
                <span>Profil</span>
            </a>
        `;

        document.body.appendChild(nav);

        // Bind clicks with smooth haptics & navigation
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function (e) {
                const targetPage = this.getAttribute('data-page');

                triggerHaptic();

                if (targetPage === 'cart') {
                    e.preventDefault();
                    window.openAppCartModal();
                    return;
                }

                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    if (currentPage === targetPage) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }

                    if (typeof window.navigateTo === 'function') {
                        e.preventDefault();
                        window.navigateTo(href);
                    }
                }
            });
        });

        updateCartBadge();
    }

    function updateCartBadge() {
        const count = getCartItemCount();
        const badge = document.getElementById('appNavCartBadge');
        const topBadge = document.getElementById('appTopCartBadge');
        const menuTopBadge = document.getElementById('appMenuTopCartBadge');
        const subBadge = document.getElementById('appSubpageCartBadge');

        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        if (topBadge) {
            if (count > 0) {
                topBadge.textContent = count > 99 ? '99+' : count;
                topBadge.style.display = 'inline-block';
            } else {
                topBadge.style.display = 'none';
            }
        }

        if (menuTopBadge) {
            if (count > 0) {
                menuTopBadge.textContent = count > 99 ? '99+' : count;
                menuTopBadge.style.display = 'inline-block';
            } else {
                menuTopBadge.style.display = 'none';
            }
        }

        if (subBadge) {
            if (count > 0) {
                subBadge.textContent = count > 99 ? '99+' : count;
                subBadge.style.display = 'flex';
            } else {
                subBadge.style.display = 'none';
            }
        }
    }

    // 13. Branch Selection Bottom Sheet
    function initAppBranchModal() {
        if (document.getElementById('appBranchModalOverlay')) return;
        const modal = document.createElement('div');
        modal.id = 'appBranchModalOverlay';
        modal.className = 'app-bottom-sheet-overlay';
        modal.innerHTML = `
            <div class="app-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="appBranchModalTitle" onclick="event.stopPropagation()">
                <div class="app-sheet-handle"></div>
                <div class="app-sheet-header">
                    <h3 class="app-sheet-title" id="appBranchModalTitle">📍 Filiale wählen</h3>
                    <button type="button" class="app-sheet-close" onclick="window.closeAppBranchModal()" aria-label="Filialauswahl schließen">✕</button>
                </div>
                <p class="app-branch-required-note">Jede Filiale hat eine eigene Speisekarte. Bitte wähle zuerst den Standort, bei dem du bestellen möchtest.</p>
                <div class="app-branch-list">
                    <button type="button" class="app-branch-item active" id="branchCardFlora" onclick="window.selectAppBranch('flora')">
                        <div class="app-branch-details">
                            <div class="app-branch-badge">Filiale 1 • Pankow</div>
                            <div class="app-branch-heading">LEO SUSHI - Florastraße 10A</div>
                            <div class="app-branch-sub">13187 Berlin • ⏱️ ca. 30-45 Min</div>
                            <div class="app-branch-tel">📞 030 37476736</div>
                        </div>
                        <div class="app-branch-check" id="branchCheckFlora">✓</div>
                    </button>
                    <button type="button" class="app-branch-item" id="branchCardHaupt" onclick="window.selectAppBranch('haupt')">
                        <div class="app-branch-details">
                            <div class="app-branch-badge">Filiale 2 • Wilhelmsruh</div>
                            <div class="app-branch-heading">LEO SUSHI - Hauptstraße 29a</div>
                            <div class="app-branch-sub">13158 Berlin • ⏱️ ca. 30-45 Min</div>
                            <div class="app-branch-tel">📞 030 55617056</div>
                        </div>
                        <div class="app-branch-check" id="branchCheckHaupt" style="display: none;">✓</div>
                    </button>
                </div>
            </div>
        `;
        modal.addEventListener('click', window.closeAppBranchModal);
        document.body.appendChild(modal);
    }

    window.toggleAppBranchModal = function (forceRequired = false) {
        triggerHaptic();
        initAppBranchModal();
        const modal = document.getElementById('appBranchModalOverlay');
        if (modal) {
            const selectedBranch = ensureAppBranchSelection();
            const currentBranch = selectedBranch ? (selectedBranch.id === 'branch_haupt' ? 'haupt' : 'flora') : null;
            const floraCard = document.getElementById('branchCardFlora');
            const hauptCard = document.getElementById('branchCardHaupt');
            const floraCheck = document.getElementById('branchCheckFlora');
            const hauptCheck = document.getElementById('branchCheckHaupt');
            const closeButton = modal.querySelector('.app-sheet-close');
            const isRequired = forceRequired || !selectedBranch;

            modal.dataset.required = isRequired ? 'true' : 'false';
            if (closeButton) closeButton.style.display = isRequired ? 'none' : '';

            if (currentBranch === 'haupt') {
                if (floraCard) floraCard.classList.remove('active');
                if (hauptCard) hauptCard.classList.add('active');
                if (floraCheck) floraCheck.style.display = 'none';
                if (hauptCheck) hauptCheck.style.display = 'flex';
            } else if (currentBranch === 'flora') {
                if (floraCard) floraCard.classList.add('active');
                if (hauptCard) hauptCard.classList.remove('active');
                if (floraCheck) floraCheck.style.display = 'flex';
                if (hauptCheck) hauptCheck.style.display = 'none';
            } else {
                if (floraCard) floraCard.classList.remove('active');
                if (hauptCard) hauptCard.classList.remove('active');
                if (floraCheck) floraCheck.style.display = 'none';
                if (hauptCheck) hauptCheck.style.display = 'none';
            }

            modal.classList.add('active');
            modal.style.display = 'flex';
            const focusTarget = isRequired ? modal.querySelector('.app-branch-item') : closeButton;
            if (focusTarget) focusTarget.focus({ preventScroll: true });
        }
    };

    window.closeAppBranchModal = function () {
        const modal = document.getElementById('appBranchModalOverlay');
        if (modal) {
            if (modal.dataset.required === 'true' && !ensureAppBranchSelection()) return;
            modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
    };

    window.selectAppBranch = function (branchKey) {
        triggerHaptic();
        const normalizedBranchKey = branchKey === 'haupt' ? 'haupt' : 'flora';
        const branchObj = APP_BRANCHES[normalizedBranchKey];
        const previousBranch = ensureAppBranchSelection();
        const rawCart = getRawAppCart();
        const cartBranchId = localStorage.getItem('leoCartBranchId') ||
            (rawCart.find(item => item && item.branchId)?.branchId || '');

        if (rawCart.length > 0 && cartBranchId !== branchObj.id) {
            const shouldClear = window.confirm(
                'Die Filialen haben unterschiedliche Speisekarten. Beim Wechsel wird dein aktueller Warenkorb geleert. Fortfahren?'
            );
            if (!shouldClear) return;
            window.clearAppCart();
        }

        localStorage.setItem('selected_branch', normalizedBranchKey);
        localStorage.setItem('leoSelectedBranch', JSON.stringify(branchObj));
        localStorage.setItem('leoBranchSelectionConfirmed', APP_BRANCH_CONFIRMATION_VERSION);
        if (rawCart.length > 0 && cartBranchId === branchObj.id) {
            saveAppCart(rawCart);
        }
        syncAppBranchLabels(normalizedBranchKey);

        const modal = document.getElementById('appBranchModalOverlay');
        if (modal) modal.dataset.required = 'false';
        window.closeAppBranchModal();

        if (window.addNotification) {
            window.addNotification('info', 'Filiale ausgewählt', `Speisekarte: ${branchObj.name}`);
        }

        const menuBelongsToAnotherBranch = window.LEO_MENU_BRANCH_ID !== branchObj.id;
        const branchChanged = !previousBranch || previousBranch.id !== branchObj.id;
        if (menuBelongsToAnotherBranch || branchChanged) {
            setTimeout(() => window.location.reload(), 120);
        }
    };

    // 14. Service Mode Switcher (Lieferung vs Abholung)
    window.switchAppServiceMode = function (mode) {
        triggerHaptic();
        localStorage.setItem('selected_service_type', mode);
        localStorage.setItem('leo_service_type', mode);

        // Sync all delivery / pickup toggle buttons across all pages
        const deliveryTabs = document.querySelectorAll('#appTabDelivery, #appMenuTabDelivery');
        const pickupTabs = document.querySelectorAll('#appTabPickup, #appMenuTabPickup');

        if (mode === 'delivery') {
            deliveryTabs.forEach(el => el.classList.add('active'));
            pickupTabs.forEach(el => el.classList.remove('active'));
        } else {
            pickupTabs.forEach(el => el.classList.add('active'));
            deliveryTabs.forEach(el => el.classList.remove('active'));
        }

        if (typeof window.setServiceType === 'function') {
            try {
                window.setServiceType(mode);
            } catch(e) {}
        }

        if (window.addNotification) {
            const isDel = mode === 'delivery';
            window.addNotification('info', isDel ? '🛵 Lieferung gewählt' : '🛍️ Abholung gewählt', isDel ? 'Lieferzeit ca. 30-45 Min.' : 'Abholbereit in ca. 15-20 Min.');
        }
    };

    function syncAppServiceModeUI() {
        const savedMode = localStorage.getItem('selected_service_type') || localStorage.getItem('leo_service_type') || 'delivery';
        const deliveryTabs = document.querySelectorAll('#appTabDelivery, #appMenuTabDelivery');
        const pickupTabs = document.querySelectorAll('#appTabPickup, #appMenuTabPickup');

        if (savedMode === 'delivery') {
            deliveryTabs.forEach(el => el.classList.add('active'));
            pickupTabs.forEach(el => el.classList.remove('active'));
        } else {
            pickupTabs.forEach(el => el.classList.add('active'));
            deliveryTabs.forEach(el => el.classList.remove('active'));
        }
    }

    function syncAppUserDashboard() {
        try {
            const userJson = localStorage.getItem('leo_user');
            const greetingEl = document.getElementById('appGreetingText');
            const nameEl = document.getElementById('appVipUserName');
            const pointsEl = document.getElementById('appHeroPointsText');
            const branchText = document.getElementById('appCurrentBranchText');

            const hour = new Date().getHours();
            let greeting = 'Guten Tag ✨';
            if (hour < 11) greeting = 'Guten Morgen 🌅';
            else if (hour >= 18) greeting = 'Guten Abend 🌙';
            if (greetingEl) {
                greetingEl.innerHTML = `<span class="app-greeting-dot"></span><span>${greeting}</span>`;
            }

            const selectedBranch = ensureAppBranchSelection();
            syncAppBranchLabels(selectedBranch ? (selectedBranch.id === 'branch_haupt' ? 'haupt' : 'flora') : null);

            if (userJson) {
                const user = JSON.parse(userJson);
                const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'VIP Gast';
                if (nameEl) nameEl.textContent = `Hallo, ${fullName}!`;
                if (pointsEl && user.points !== undefined) {
                    pointsEl.textContent = `${user.points} Pkt`;
                }
            } else {
                if (nameEl) nameEl.textContent = 'Willkommen bei LEO SUSHI';
                if (pointsEl) pointsEl.textContent = 'Mitglied';
            }
        } catch (e) {
            console.warn('Error syncing app user dashboard:', e);
        }
    }

    // 15. Check ?openCart=true
    function checkOpenCartUrlParam() {
        if (window.location.search.includes('openCart=true')) {
            setTimeout(() => {
                window.openAppCartModal();
            }, 500);
        }
    }

    // Event Listeners for Storage and Cart Sync
    window.addEventListener('storage', () => {
        updateCartBadge();
        renderFloatingCartBar();
        updateAllCardSteppers();
    });
    window.addEventListener('cartUpdated', () => {
        updateCartBadge();
        renderFloatingCartBar();
        updateAllCardSteppers();
    });
    window.addEventListener('cart:updated', () => {
        updateCartBadge();
        renderFloatingCartBar();
        updateAllCardSteppers();
    });

    // Celebration Modal when redirected with status=success
    function showAppOrderSuccessCelebration() {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('id') || 'LEO-' + Date.now().toString().slice(-6);

        if (document.getElementById('appOrderSuccessModal')) return;

        const modal = document.createElement('div');
        modal.id = 'appOrderSuccessModal';
        modal.className = 'app-branch-modal-overlay active';
        modal.style.zIndex = '100005';

        modal.innerHTML = `
            <div class="app-branch-modal-content" style="text-align: center; padding: 28px 20px;">
                <div style="font-size: 52px; margin-bottom: 12px; animation: bounce 1s infinite alternate;">🎉</div>
                <h2 style="font-size: 20px; font-weight: 800; color: var(--app-gold); margin-bottom: 6px;">Bestellung erfolgreich!</h2>
                <p style="color: #ffffff; font-weight: 700; font-size: 15px; margin-bottom: 4px;">Bestell-Nr.: <span style="color: var(--app-gold);">${orderId}</span></p>
                <p style="color: #9ca3af; font-size: 13px; margin-bottom: 22px; line-height: 1.5;">Vielen Dank für Ihre Bestellung! Wir bereiten Ihr Essen mit frischesten Zutaten zu.</p>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="my-orders.html${appQuerySuffix}" class="app-cart-checkout-btn" style="text-decoration: none;">
                        <span>📦 Live-Status verfolgen</span>
                        <span>➔</span>
                    </a>
                    <button type="button" onclick="document.getElementById('appOrderSuccessModal').remove();" class="app-branch-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; justify-content: center; font-weight: 600;">
                        🍣 Weiter im Menü stöbern
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        triggerHaptic();
    }

    // Run Initialization on DOM Ready
    function initAllAppComponents() {
        // Remove old web fixed order button completely from DOM in app mode
        const oldFixedBtn = document.getElementById('fixedOrderBtn');
        if (oldFixedBtn) {
            oldFixedBtn.remove();
        }

        // Check if URL has status=success (just completed order)
        if (window.location.search.includes('status=success')) {
            console.log('🎉 [Leo App] Detected successful order placement, clearing cart...');
            window.clearAppCart();
            showAppOrderSuccessCelebration();
        }

        initSubpageTopbar();
        initBottomNav();
        initFloatingCartBar();
        initAppBranchModal();
        initAppCartModal();
        initDishDetailModal();
        const pageRequiresBranch = ['home', 'menu', 'checkout'].includes(getCurrentPage());
        if (pageRequiresBranch && !ensureAppBranchSelection()) {
            setTimeout(() => window.toggleAppBranchModal(true), 0);
        }
        if (!window.__leoAppKeyboardControls) {
            window.__leoAppKeyboardControls = true;
            document.addEventListener('keydown', event => {
                if (event.key !== 'Escape') return;
                const detailModal = document.getElementById('appDishDetailOverlay');
                const cartModal = document.getElementById('appCartSheetOverlay');
                const branchModal = document.getElementById('appBranchModalOverlay');
                if (detailModal && detailModal.classList.contains('active')) {
                    window.closeAppDishDetail();
                } else if (cartModal && cartModal.classList.contains('active')) {
                    window.closeAppCartModal();
                } else if (branchModal && branchModal.classList.contains('active')) {
                    window.closeAppBranchModal();
                }
            });
        }
        renderAppDishes();
        initNativeAppMenu();
        loadExactAppBranchMenu();
        loadAppBestsellers();
        syncAppUserDashboard();
        syncAppServiceModeUI();
        checkOpenCartUrlParam();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllAppComponents);
    } else {
        initAllAppComponents();
    }

    window.addEventListener('load', () => {
        renderAppDishes();
        initNativeAppMenu();
        loadExactAppBranchMenu();
    });

    window.addEventListener('menuDataReady', () => {
        renderAppDishes();
        initNativeAppMenu();
    });

    // Global Export
    window.LeoMobileApp = {
        isApp: isApp,
        updateCartBadge: updateCartBadge,
        openCart: window.openAppCartModal,
        openDishDetail: window.openAppDishDetail,
        triggerHaptic: triggerHaptic,
        syncDashboard: syncAppUserDashboard,
        openBranchModal: window.toggleAppBranchModal,
        closeBranchModal: window.closeAppBranchModal
    };

})();
