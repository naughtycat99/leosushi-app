/**
 * LEO SUSHI - Smart App Banner for Mobile Web
 * High-converting top banner to drive iOS/Android App downloads with APP10 discount code.
 */

(function () {
    'use strict';

    // Do not show inside Native Capacitor App
    const isNativeApp = (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
        document.documentElement.classList.contains('is-capacitor-app') ||
        document.body?.classList.contains('is-capacitor-app') ||
        window.location.search.includes('mock-app');

    if (isNativeApp) return;

    // Check if dismissed recently (24 hours)
    const dismissedAt = localStorage.getItem('leo_smart_banner_dismissed');
    if (dismissedAt) {
        const timePassed = Date.now() - parseInt(dismissedAt, 10);
        if (timePassed < 24 * 60 * 60 * 1000) {
            return;
        }
    }

    function initSmartBanner() {
        if (document.getElementById('leoSmartAppBanner')) return;

        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /android/i.test(userAgent);

        // Target Store Links
        let targetUrl = 'download-app.html';
        let storeAction = 'LADEN';
        if (isIOS) {
            targetUrl = 'https://apps.apple.com/de/app/leo-sushi/id6758460309';
            storeAction = 'LADEN';
        } else if (isAndroid) {
            targetUrl = 'https://play.google.com/store/apps/details?id=com.leosushi.berlin';
            storeAction = 'INSTALLIEREN';
        }

        // Create Container
        const banner = document.createElement('div');
        banner.id = 'leoSmartAppBanner';
        banner.className = 'leo-smart-app-banner';

        banner.innerHTML = `
            <div class="smart-banner-inner">
                <button class="smart-banner-close" id="closeSmartBanner" aria-label="Schließen">×</button>
                <img src="assets/logo.png" alt="Leo Sushi App" class="smart-banner-icon">
                <div class="smart-banner-content">
                    <div class="smart-banner-title">LEO SUSHI App</div>
                    <div class="smart-banner-subtitle">
                        <span class="smart-banner-stars">★★★★★</span>
                        <span>-10% Code: <strong>APP10</strong></span>
                    </div>
                </div>
                <a href="${targetUrl}" class="smart-banner-btn" id="smartBannerAction" target="_blank" rel="noopener">${storeAction}</a>
            </div>
        `;

        // CSS Styling
        const style = document.createElement('style');
        style.id = 'leoSmartBannerStyle';
        style.textContent = `
            .leo-smart-app-banner {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: 56px;
                background: rgba(14, 14, 18, 0.97);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border-bottom: 1px solid rgba(229, 207, 142, 0.25);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
                z-index: 9999999;
                display: flex;
                align-items: center;
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .smart-banner-inner {
                width: 100%;
                max-width: 100%;
                display: flex;
                align-items: center;
                padding: 0 12px;
                gap: 10px;
                box-sizing: border-box;
            }
            .smart-banner-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                font-size: 22px;
                line-height: 1;
                cursor: pointer;
                padding: 4px;
                margin-right: -2px;
                transition: color 0.2s;
            }
            .smart-banner-close:hover {
                color: #ffffff;
            }
            .smart-banner-icon {
                width: 38px;
                height: 38px;
                border-radius: 9px;
                border: 1px solid rgba(229, 207, 142, 0.4);
                object-fit: cover;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            }
            .smart-banner-content {
                flex: 1;
                min-width: 0;
            }
            .smart-banner-title {
                font-size: 13px;
                font-weight: 700;
                color: #ffffff;
                letter-spacing: 0.3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .smart-banner-subtitle {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.7);
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 1px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .smart-banner-stars {
                color: #e5cf8e;
                font-size: 10px;
                letter-spacing: -1px;
            }
            .smart-banner-subtitle strong {
                color: #e5cf8e;
            }
            .smart-banner-btn {
                background: linear-gradient(135deg, #e5cf8e, #b3914a);
                color: #0b0b0d !important;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 0.5px;
                padding: 7px 14px;
                border-radius: 16px;
                text-decoration: none !important;
                text-transform: uppercase;
                box-shadow: 0 2px 10px rgba(229, 207, 142, 0.35);
                white-space: nowrap;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .smart-banner-btn:active {
                transform: scale(0.95);
            }
            /* Push page content down when banner is present */
            body.has-smart-app-banner {
                padding-top: 56px !important;
            }
            body.has-smart-app-banner .site-header {
                top: 56px !important;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(banner);
        document.body.classList.add('has-smart-app-banner');

        // Dismiss action
        document.getElementById('closeSmartBanner').onclick = function () {
            banner.style.transform = 'translateY(-100%)';
            document.body.classList.remove('has-smart-app-banner');
            localStorage.setItem('leo_smart_banner_dismissed', Date.now().toString());
            setTimeout(() => {
                banner.remove();
                style.remove();
            }, 350);
        };
    }

    // Only show on mobile / tablet screens
    if (window.innerWidth <= 820) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSmartBanner);
        } else {
            initSmartBanner();
        }
    }
})();
