// Capacitor Initialization Script
// This file initializes Capacitor plugins and handles app lifecycle

document.addEventListener('DOMContentLoaded', async () => {
  // Check if running in Capacitor
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) {
    console.log('Running in web browser, Capacitor features disabled');
    return;
  }

  console.log('Running in Capacitor app, initializing native features...');

  const { App, StatusBar, SplashScreen, Keyboard } = window.Capacitor.Plugins;

  // Initialize Status Bar
  try {
    await StatusBar.setStyle({ style: 'dark' });
    await StatusBar.setBackgroundColor({ color: '#0b0b0c' });
  } catch (error) {
    console.warn('StatusBar plugin error:', error);
  }

  // Handle app state changes
  App.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
  });

  // Handle back button (Android)
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      // Show exit confirmation or exit app
      App.exitApp();
    }
  });

  // Handle keyboard events
  try {
    Keyboard.addListener('keyboardWillShow', (info) => {
      console.log('Keyboard will show with height:', info.keyboardHeight);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('Keyboard will hide');
    });
  } catch (e) {
    console.warn('Keyboard plugin error:', e);
  }

  // === SMART SPLASH SCREEN: Hide only when page is truly ready ===
  // Wait for the page to be fully loaded (all resources including images, CSS, JS)
  const hideSplash = async () => {
    try {
      await SplashScreen.hide({ fadeOutDuration: 300 });
      console.log('Splash screen hidden - page is ready');
    } catch (error) {
      console.warn('SplashScreen hide error:', error);
    }
  };

  // Strategy: Wait for whichever comes first:
  // 1. window.onload (all resources loaded) + small delay
  // 2. Maximum timeout of 6 seconds (safety net)
  const maxWait = 6000; // 6s safety net - never wait longer than this
  let splashHidden = false;

  const doHideSplash = () => {
    if (splashHidden) return;
    splashHidden = true;
    // Small extra delay to let rendering finish
    setTimeout(hideSplash, 300);
  };

  // Safety net: always hide after maxWait
  setTimeout(doHideSplash, maxWait);

  // Ideal path: hide when page is fully loaded
  if (document.readyState === 'complete') {
    // Page already loaded
    setTimeout(doHideSplash, 500);
  } else {
    window.addEventListener('load', () => {
      // Page just finished loading, give a tiny bit more time for rendering
      setTimeout(doHideSplash, 800);
    });
  }

  // === PERFORMANCE: Disable heavy animations in app mode ===
  // Add a style tag to kill heavy CSS animations that cause lag in WebView
  const perfStyle = document.createElement('style');
  perfStyle.textContent = `
    /* Disable heavy animations in Capacitor app for better performance */
    .is-capacitor-app .intro-gradient-orb,
    .is-capacitor-app .particle,
    .is-capacitor-app .sparkle,
    .is-capacitor-app .ambient-glow,
    .is-capacitor-app .ambient-particles span,
    .is-capacitor-app .float-element,
    .is-capacitor-app .bg-particle,
    .is-capacitor-app .about-wave-effect,
    .is-capacitor-app .star-bg,
    .is-capacitor-app .floating-shape,
    .is-capacitor-app .contact-orb,
    .is-capacitor-app .logo-ring,
    .is-capacitor-app .intro-sparkles,
    .is-capacitor-app .intro-particles {
      display: none !important;
      animation: none !important;
    }

    /* Reduce other animations to simple transitions */
    .is-capacitor-app .hero-backdrop-img {
      animation: none !important;
    }

    .is-capacitor-app .info-card-shine,
    .is-capacitor-app .info-card-glow,
    .is-capacitor-app .value-icon-glow,
    .is-capacitor-app .about-bg-glow,
    .is-capacitor-app .reviews-bg-glow,
    .is-capacitor-app .contact-bg-shimmer {
      animation: none !important;
      opacity: 0.3 !important;
    }

    /* Simplify intro screen for faster perceived load */
    .is-capacitor-app .intro-screen {
      background: #0b0b0c !important;
    }

    .is-capacitor-app .intro-background {
      display: none !important;
    }

    /* Keep loader line animation - it's lightweight and gives feedback */
    .is-capacitor-app .loader-line {
      animation-duration: 1.5s !important;
    }
  `;
  document.head.appendChild(perfStyle);

  console.log('Capacitor initialization complete - performance mode enabled');
});

// Handle app URL open (deep linking)
if (window.Capacitor && window.Capacitor.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
    console.log('App opened with URL:', data.url);
    // Handle deep link here if needed
  });
}
