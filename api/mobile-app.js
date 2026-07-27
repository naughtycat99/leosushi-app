/**
 * Mobile App UI Controller
 * Handles Bottom Navigation Bar and App-specific layout
 */

(function () {
    // DISABLED: App should display exactly like web
    // Bottom navigation bar is no longer needed
    return;

    // Original Capacitor detection (disabled)
    // const isCapacitor = (window.Capacitor && window.Capacitor.isNativePlatform()) ||
    //     window.location.search.includes('mock-app') ||
    //     localStorage.getItem('leo_mock_app') === 'true';
    //
    // if (!isCapacitor) {
    //     return;
    // }

    console.log('Mobile App UI Mode active (Restoring Original Header)');
    document.body.classList.add('is-capacitor-app');

    // SVG Icons
    const icons = {
        home: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        res: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        menu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`,
        cart: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
        profile: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    };

    function isPathActive(path) {
        const current = window.location.pathname.toLowerCase();
        if (path === 'index.html' || path === '/') {
            return current === '/' || current.endsWith('/') || current.includes('index.html');
        }
        return current.includes(path.toLowerCase());
    }

    // Bottom Navigation Bar HTML
    const bottomNavHTML = `
        <nav class="bottom-nav-bar">
            <a href="index.html" class="nav-item ${isPathActive('index.html') ? 'active' : ''}" id="nav-home">
                <span class="nav-icon">${icons.home}</span>
                <span>Home</span>
            </a>
            <a href="reservation.html" class="nav-item ${isPathActive('reservation.html') ? 'active' : ''}" id="nav-res">
                <span class="nav-icon">${icons.res}</span>
                <span>Reservieren</span>
            </a>
            <a href="menu.html" class="nav-item nav-item-center ${isPathActive('menu.html') ? 'active' : ''}" id="nav-menu">
                <span class="nav-icon">${icons.menu}</span>
                <span>Menü</span>
            </a>
            <a href="#" class="nav-item" id="nav-cart">
                <span class="nav-icon">${icons.cart}</span>
                <span>Warenkorb</span>
            </a>
            <a href="profile.html" class="nav-item ${isPathActive('profile.html') ? 'active' : ''}" id="nav-profile">
                <span class="nav-icon">${icons.profile}</span>
                <span>Profil</span>
            </a>
        </nav>
    `;

    function initMobileUI() {
        // Inject Bottom Bar
        let bottomNav = document.querySelector('.bottom-nav-bar');
        if (!bottomNav) {
            const container = document.createElement('div');
            container.innerHTML = bottomNavHTML;
            bottomNav = container.firstElementChild;
            document.body.appendChild(bottomNav);
        }

        // Handle clicks using our navigation helper
        document.querySelectorAll('.bottom-nav-bar a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = href;
            });
        });

        // Special Cart Action
        const cartBtn = document.getElementById('nav-cart');
        if (cartBtn) {
            cartBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const webCartToggle = document.getElementById('cartToggle');
                if (webCartToggle) webCartToggle.click();
            });
        }
    }

    // Run when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileUI);
    } else {
        initMobileUI();
    }

    // NUCLEAR OPTION: Extremely aggressive hiding for the fixed cart button on App
    setInterval(() => {
        const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
        allFixedOrderBtns.forEach(btn => {
            if (btn) {
                // If we found it, hide it with everything we've got
                btn.style.setProperty('display', 'none', 'important');
                btn.style.setProperty('visibility', 'hidden', 'important');
                btn.style.setProperty('opacity', '0', 'important');
                btn.style.setProperty('pointer-events', 'none', 'important');
                btn.style.setProperty('transform', 'scale(0)', 'important');
                btn.style.setProperty('position', 'absolute', 'important');
                btn.style.setProperty('left', '-9999px', 'important');

                // If it's still there after a while, remove it from DOM entirely
                // (Only do this after app has fully settled)
                if (window.leo_app_fully_loaded) {
                    btn.remove();
                }
            }
        });
    }, 500);

    // Mark app as fully loaded after 5 seconds to allow DOM removal
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.leo_app_fully_loaded = true;
        }, 5000);
    });

    return {
        init: initMobileUI
    };
})();
