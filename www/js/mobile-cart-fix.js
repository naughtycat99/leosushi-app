// Mobile App Cart Fix
// Ensure cart button always opens cart sidebar, never opens browser

(function () {
  console.log('📱 Mobile Cart Fix loaded');

  // Global click handler to catch ANY element with WARENKORB text
  document.addEventListener('click', function (e) {
    const target = e.target;
    const text = target.textContent || target.innerText || '';

    // Check if clicked element or its parent contains WARENKORB
    if (text.toUpperCase().includes('WARENKORB')) {
      console.log('🛒 WARENKORB element clicked:', target);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Open cart
      if (typeof window.openCart === 'function') {
        window.openCart();
      } else if (typeof window.toggleCart === 'function') {
        window.toggleCart();
      } else {
        // Fallback
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartSidebar) {
          cartSidebar.classList.add('active');
          cartSidebar.style.display = 'block';
          cartSidebar.style.transform = 'translateX(0)';
        }
        if (cartOverlay) {
          cartOverlay.classList.add('active');
          cartOverlay.style.display = 'block';
        }
        document.body.classList.add('cart-open');
      }

      return false;
    }
  }, true); // Use capture phase

  // Wait for DOM to be ready
  function initMobileCartFix() {
    // Find ALL cart buttons and links
    const cartSelectors = [
      '#fixedOrderBtn',
      '#cartToggle',
      '.cart-toggle',
      '.fixed-order-btn',
      '[data-cart-toggle]',
      '[aria-label*="Warenkorb"]:not([aria-label*="schließen"])',
      '[aria-label*="warenkorb"]:not([aria-label*="schließen"])',
      'a[href*="cart"]',
      'a[href*="warenkorb"]',
      'button:has(.order-text):not(.cart-close)',
      '*[onclick*="cart"]:not(#cartClose)',
      // EXCLUDE close buttons

    ];

    const cartElements = [];
    cartSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!cartElements.includes(el)) {
            cartElements.push(el);
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    if (cartElements.length === 0) {
      console.warn('⚠️ No cart buttons found, will retry...');
      setTimeout(initMobileCartFix, 500);
      return;
    }

    console.log(`✅ Found ${cartElements.length} cart element(s), setting up mobile-specific handlers`);

    cartElements.forEach((element, index) => {
      console.log(`Setting up cart element ${index + 1}:`, element.tagName, element.id || element.className);

      // Remove all existing click handlers by cloning
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);

      // Add new click handler that always opens cart
      newElement.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        console.log('🛒 Cart element clicked in mobile app');

        // Try to open cart using existing functions
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
            cartSidebar.style.transform = 'translateX(0)';
          }
          if (cartOverlay) {
            cartOverlay.classList.add('active');
            cartOverlay.style.display = 'block';
            cartOverlay.style.opacity = '1';
          }
          document.body.classList.add('cart-open');
        }

        return false;
      }, true); // Use capture phase

      // Also prevent default on touchstart for mobile
      newElement.addEventListener('touchstart', function (e) {
        console.log('👆 Cart element touched');
      }, { passive: true });
    });

    console.log('✅ Mobile cart fix initialized for all cart elements');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCartFix);
  } else {
    initMobileCartFix();
  }

  // Also retry after delays to catch dynamically added elements
  setTimeout(initMobileCartFix, 1000);
  setTimeout(initMobileCartFix, 2000);
  setTimeout(initMobileCartFix, 3000);
  setTimeout(initMobileCartFix, 5000);
})();

