// Module Loader - Đảm bảo các module được load theo đúng thứ tự
// File này sẽ được load cuối cùng để khởi tạo tất cả

(function() {
  'use strict';
  
  // Đảm bảo tất cả dependencies đã được load
  const requiredGlobals = [
    'MENU_DATA',
    'EMAILJS_CONFIG',
    'FIREBASE_CONFIG',
    'cart'
  ];
  
  const checkDependencies = () => {
    const missing = requiredGlobals.filter(name => typeof window[name] === 'undefined');
    if (missing.length > 0) {
      console.warn('Missing dependencies:', missing);
      return false;
    }
    return true;
  };
  
  // Khởi tạo khi DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    if (!checkDependencies()) {
      console.error('Some dependencies are missing. Please check the load order of scripts.');
      return;
    }
    
    console.log('✅ All modules loaded successfully');
  }
})();

