// Mobile App Cart Fix
// Ensure cart button always opens cart sidebar, never opens browser

(function() {
  console.log('📱 Mobile Cart Fix loaded');

  // Wait for DOM to be ready
  function initMobileCartFix() {
    // Find ALL cart buttons
    const cartButtons = [
      document.getElementById('fixedOrderBtn'),
      document.getElementById('cartToggle'),
      document.querySelector('.cart-toggle'),
      document.querySelector('[data-cart-toggle]'),
      ...document.querySelectorAll('.fixed-order-btn'),
      ...document.querySelectorAll('[onclick*="cart"]')
    ].filter(btn => btn !== null);

    if (cartButtons.length === 0) {
      console.warn('⚠️ No cart buttons found, will retry...');
      setTimeout(initMobileCartFix, 500);
      return;
    }

    console.log(`✅ Found ${cartButtons.length} cart button(s), setting up mobile-specific handlers`);

    cartButtons.forEach((btn, index) => {
      console.log(`Setting up cart button ${index + 1}:`, btn.id || btn.className);
      
      // Remove all existing click handlers by cloning the button
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      // Add new click handler that always opens cart
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🛒 Cart button clicked in mobile app');

        // Try to open cart using existing function
        if (typeof window.openCart === 'function') {
          console.log('✅ Opening cart using window.openCart()');
          window.openCart();
        } else if (typeof window.toggleCart === 'function') {
          console.log('✅ Opening cart using window.toggleCart()');
          window.toggleCart();
        } else {
          // Fallback: manually open cart
          console.log('⚠️ Cart functions not found, using fallback');
          const cartSidebar = document.getElementById('cartSidebar');
          const cartOverlay = document.getElementById('cartOverlay');
          
          if (cartSidebar) {
            console.log('Opening cart sidebar');
            cartSidebar.classList.add('active');
            cartSidebar.style.display = 'block';
          }
          if (cartOverlay) {
            cartOverlay.classList.add('active');
            cartOverlay.style.display = 'block';
          }
          document.body.classList.add('cart-open');
        }
      }, true); // Use capture phase to ensure we catch it first
    });

    console.log('✅ Mobile cart fix initialized for all cart buttons');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCartFix);
  } else {
    initMobileCartFix();
  }

  // Also retry after a delay to catch dynamically added buttons
  setTimeout(initMobileCartFix, 2000);
})();
