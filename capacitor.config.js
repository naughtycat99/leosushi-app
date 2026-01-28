const { CapacitorConfig } = require('@capacitor/cli');

const config = {
  appId: 'com.leosushi.app',
  appName: 'LEO SUSHI',
  webDir: 'www',
  // App chạy hoàn toàn offline - không cần internet
  // server: {
  //   url: 'https://leo-sushi.berlin.de',
  //   cleartext: false
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0b0b0c",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0b0b0c'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    contentInset: 'automatic'
  }
};

module.exports = config;

