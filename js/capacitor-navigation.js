// Capacitor Navigation Helper
// Handles navigation in Capacitor Android/iOS apps

/**
 * Navigate to a page - works in both web and Capacitor apps
 * @param {string} page - Page name (e.g., 'menu.html', 'index.html')
 * @param {Event} event - Optional event to prevent default
 */
function navigateTo(page, event) {
    if (event) {
        event.preventDefault();
    }

    // Check if running in Capacitor app
    const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();

    // Attempt to get server URL from config, but only if it exists
    let serverUrl = null;
    try {
        serverUrl = window.Capacitor?.getConfig?.()?.server?.url;
    } catch (e) {
        console.warn('Could not get Capacitor config', e);
    }

    if (isCapacitor && serverUrl) {
        // In Capacitor with remote server, use absolute path
        const fullUrl = `${serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl}/${page}`;
        window.location.href = fullUrl;
    } else {
        // In web browser OR offline Capacitor mode, use relative path
        // This works with Capacitor's local server (http://localhost)
        window.location.href = page;
    }
}

/**
 * Get proper URL for a page
 * @param {string} page - Page name
 * @returns {string} - Proper URL for the page
 */
function getPageUrl(page) {
    const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();

    let serverUrl = null;
    try {
        serverUrl = window.Capacitor?.getConfig?.()?.server?.url;
    } catch (e) { }

    if (isCapacitor && serverUrl) {
        return `${serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl}/${page}`;
    }

    return page;
}

/**
 * Initialize navigation for all links
 * Converts relative links to work in Capacitor
 */
function initCapacitorNavigation() {
    const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();

    if (!isCapacitor) {
        return; // No need to modify links in web browser
    }

    // Get all links that need to be updated
    const pages = ['menu.html', 'index.html', 'reservation.html', 'checkout.html', 'profile.html', 'my-orders.html', 'points.html'];

    // Update all links
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');

        // Skip if no href, external link, or anchor link
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
            return;
        }

        // Check if it's one of our pages
        const isOurPage = pages.some(page => href.includes(page));

        if (isOurPage) {
            // Extract just the page name
            const pageName = pages.find(page => href.includes(page));

            // Update href to use navigateTo function
            link.onclick = function (e) {
                e.preventDefault();
                navigateTo(pageName);
                return false;
            };
        }
    });

    console.log('Capacitor navigation initialized');
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
