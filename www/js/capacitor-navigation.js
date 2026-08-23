// Capacitor Navigation Helper
// Handles navigation in Capacitor Android/iOS apps and App Preview mode

function getAppQuerySuffix() {
    try {
        const isApp = !!(
            window.LEO_IS_NATIVE_APP ||
            (window.location.search && (window.location.search.includes('app=true') || window.location.search.includes('mock-app'))) ||
            sessionStorage.getItem('leo_app_preview') === 'true' ||
            localStorage.getItem('leo_app_mode') === 'true'
        );
        return isApp ? '?app=true' : '';
    } catch (e) {
        return '';
    }
}

/**
 * Navigate to a page - works in both web and Capacitor apps
 * @param {string} page - Page name (e.g., 'menu.html', 'index.html', 'checkout.html')
 * @param {Event} event - Optional event to prevent default
 */
function navigateTo(page, event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    if (!page) return;
    let cleanTarget = String(page).trim();
    // Strip leading domain or protocol if present
    cleanTarget = cleanTarget.replace(/^https?:\/\/[^\/]+\//, '');
    cleanTarget = cleanTarget.replace(/^\//, '');
    
    // Strip existing query string
    const basePage = cleanTarget.split('?')[0].split('#')[0];
    const query = getAppQuerySuffix();

    window.location.href = basePage + query;
}

/**
 * Get proper URL for a page
 * @param {string} page - Page name
 * @returns {string} - Proper URL for the page
 */
function getPageUrl(page) {
    if (!page) return 'index.html';
    let clean = String(page).trim().replace(/^https?:\/\/[^\/]+\//, '').replace(/^\//, '');
    const base = clean.split('?')[0].split('#')[0];
    return base + getAppQuerySuffix();
}

/**
 * Initialize navigation for all links
 * Converts relative links to work in Capacitor
 */
function initCapacitorNavigation() {
    const isApp = window.LEO_IS_NATIVE_APP ||
        (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
        (window.location.search && window.location.search.includes('app=true'));

    if (!isApp) return;

    const pages = ['menu.html', 'index.html', 'reservation.html', 'checkout.html', 'profile.html', 'my-orders.html', 'points.html'];

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
            return;
        }

        const isOurPage = pages.some(page => href.includes(page));
        if (isOurPage) {
            const pageName = pages.find(page => href.includes(page));
            link.onclick = function (e) {
                e.preventDefault();
                navigateTo(pageName, e);
                return false;
            };
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCapacitorNavigation);
} else {
    initCapacitorNavigation();
}

// Expose functions globally
window.navigateTo = navigateTo;
window.getPageUrl = getPageUrl;

