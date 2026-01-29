/**
 * Mobile App UI Controller
 * Handles App-specific layout considerations (e.g. Status Bar)
 * But keeps standard Web UI for navigation
 */

(function () {
    // Check if running in Capacitor or Mock mode
    const isCapacitor = (window.Capacitor && window.Capacitor.isNativePlatform()) ||
        window.location.search.includes('mock-app') ||
        localStorage.getItem('leo_mock_app') === 'true';

    if (!isCapacitor) {
        return;
    }

    console.log('📱 Mobile App Mode Active: Using Standard Web UI');
    document.body.classList.add('is-capacitor-app');

    // SVG Icons (Kept for reference if needed later, but unused now)
    const icons = {
        home: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        res: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
        menu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>`,
        cart: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
        profile: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    };

    function initMobileUI() {
        console.log('✅ Mobile UI Initialized (Stock Web Layout)');
        // No custom bottom bar injection
        // No aggressive button hiding
    }

    // Run when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileUI);
    } else {
        initMobileUI();
    }

    return {
        init: initMobileUI
    };
})();
