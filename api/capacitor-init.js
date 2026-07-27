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
  Keyboard.addListener('keyboardWillShow', (info) => {
    console.log('Keyboard will show with height:', info.keyboardHeight);
  });

  Keyboard.addListener('keyboardWillHide', () => {
    console.log('Keyboard will hide');
  });

  // Hide splash screen after app is ready
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.warn('SplashScreen plugin error:', error);
  }

  console.log('Capacitor initialization complete');
});

// Handle app URL open (deep linking)
if (window.Capacitor && window.Capacitor.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('appUrlOpen', (data) => {
    console.log('App opened with URL:', data.url);
    // Handle deep link here if needed
  });
}












