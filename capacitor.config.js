const { CapacitorConfig } = require('@capacitor/cli');

const config = {
  appId: 'com.leosushi.app',
  appName: 'LEO SUSHI',
  webDir: 'www',
  // App sử dụng file local trong thư mục www
  // Comment out server config để app dùng giao diện local giống web
  // server: {
  //   url: 'https://www.leo-sushi-berlin.de',
  //   cleartext: false
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#0b0b0c",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      // Ẩn splash screen ngay lập tức
      showSplash: false
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

