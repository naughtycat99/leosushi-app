// Mobile App Cart Fix
// Ensure cart button always opens cart sidebar, never opens browser

(function() {
  console.log('📱 Mobile Cart Fix loaded');

  // Wait for DOM to be ready
  function initMobileCartFix() {
    const fixedOrderBtn = document.getElementById('fixedOrderBtn');
    
    if (!fixedOrderBtn) {
      console.warn('⚠️ fixedOrderBtn not found, will retry...');
      setTimeout(initMobileCartFix, 500);
      return;
    }

    console.log('✅ Found fixedOrderBtn, setting up mobile-specific handler');

    // Remove all existing click handlers by cloning the button
    const newBtn = fixedOrderBtn.cloneNode(true);
    fixedOrderBtn.parentNode.replaceChild(newBtn, fixedOrderBtn);

    // Add new click handler that always opens cart
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🛒 Cart button clicked in mobile app');

      // Try to open cart using existing function
      if (typeof window.openCart === 'function') {
        console.log('✅ Opening cart using window.openCart()');
        window.openCart();
      } else {
        // Fallback: manually open cart
        console.log('⚠️ window.openCart not found, using fallback');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar) {
          cartSidebar.classList.add('active');
        }
        if (cartOverlay) {
          cartOverlay.classList.add('active');
        }
        document.body.classList.add('cart-open');
      }
    }, true); // Use capture phase to ensure we catch it first

    console.log('✅ Mobile cart fix initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCartFix);
  } else {
    initMobileCartFix();
  }
})();
