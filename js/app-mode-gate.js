/**
 * LEO SUSHI app/web boundary.
 * Activates native/app UI only for the LEO SUSHI native shell.
 * A normal browser must always receive the website, even with ?app=true.
 */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search || '');
  const requestedAppView = params.get('app') === 'true' || params.has('mock-app') || params.get('mode') === 'app';
  const isLocalPreviewHost = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname || '');

  let storedLocalPreview = false;
  try {
    storedLocalPreview = isLocalPreviewHost && sessionStorage.getItem('leo_app_preview') === 'true';
  } catch (e) {}

  const userAgent = navigator.userAgent || '';
  const isAndroidWebView = /Android/i.test(userAgent) && (
    /\bwv\b/i.test(userAgent) ||
    (/Version\/4\.0/i.test(userAgent) && /Chrome\/\d+/i.test(userAgent))
  );
  const isIosWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent) ||
    (typeof window !== 'undefined' && window.webkit && window.webkit.messageHandlers);

  const hasLeoAppUserAgent = /(?:LeoSushiApp|Capacitor)/i.test(userAgent);
  const hasNativeBridge = !!(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:' ||
    (window.Capacitor && window.Capacitor.platform && window.Capacitor.platform !== 'web')
  );
  const isLocalPreview = isLocalPreviewHost && (requestedAppView || storedLocalPreview);
  const isTrustedLegacyWebView = requestedAppView && (isAndroidWebView || isIosWebView);
  const isNativeApp = !!(
    hasLeoAppUserAgent ||
    hasNativeBridge ||
    isTrustedLegacyWebView ||
    isLocalPreview
  );

  window.LEO_IS_NATIVE_APP = isNativeApp;
  window.LEO_IS_LOCAL_APP_PREVIEW = isLocalPreview;

  // Legacy app query parameters are not a public website preview switch.
  // Strip them in ordinary browsers so the canonical web UI is always shown.
  if (!isNativeApp && requestedAppView && !isLocalPreviewHost) {
    params.delete('app');
    params.delete('mock-app');
    if (params.get('mode') === 'app') params.delete('mode');
    const cleanQuery = params.toString();
    const cleanUrl = window.location.pathname + (cleanQuery ? `?${cleanQuery}` : '') + window.location.hash;
    window.location.replace(cleanUrl);
    return;
  }

  if (isNativeApp) {
    try {
      if (isLocalPreview) sessionStorage.setItem('leo_app_preview', 'true');
      else sessionStorage.removeItem('leo_app_preview');
      localStorage.removeItem('leo_app_mode');
    } catch (e) {}
    document.documentElement.classList.add('is-capacitor-app');
    const applyBodyClass = () => document.body && document.body.classList.add('is-capacitor-app');
    if (document.body) applyBodyClass();
    else document.addEventListener('DOMContentLoaded', applyBodyClass, { once: true });
  } else {
    try {
      sessionStorage.removeItem('leo_app_preview');
      localStorage.removeItem('leo_app_mode');
    } catch (e) {}
    document.documentElement.classList.remove('is-capacitor-app');
    if (document.body) document.body.classList.remove('is-capacitor-app');
  }

  // Clear stale website PWA caches in app mode
  if (isNativeApp) {
    const cacheResetKey = 'leo_app_cache_reset_20260824_v51';
    let cacheAlreadyReset = false;
    try {
      cacheAlreadyReset = localStorage.getItem(cacheResetKey) === '1';
    } catch (e) {}

    if (!cacheAlreadyReset) {
      const cleanupTasks = [];
      if ('serviceWorker' in navigator) {
        cleanupTasks.push(
          navigator.serviceWorker.getRegistrations()
            .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
            .catch(() => [])
        );
      }
      if ('caches' in window) {
        cleanupTasks.push(
          caches.keys()
            .then(keys => Promise.all(keys.map(key => caches.delete(key))))
            .catch(() => [])
        );
      }
      Promise.all(cleanupTasks).finally(() => {
        try {
          localStorage.setItem(cacheResetKey, '1');
        } catch (e) {}
      });
    }
  }
})();
